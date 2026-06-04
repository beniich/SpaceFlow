import React, { useState, useEffect } from "react";
import { 
  Users, UserPlus, Search, RefreshCw, Mail, Phone, Info,
  LogOut, Shield, CheckCircle, AlertTriangle, Key, User, Plus, Trash2, Heart, Database
} from "lucide-react";
import { GlassCard } from "./GlassUI";
import { googleSignIn, getAccessToken, logout } from "../utils/firebaseAuth";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { db, handleFirestoreError, OperationType } from "../utils/firebaseDb";
import { collection, doc, setDoc, onSnapshot, deleteDoc, query } from "firebase/firestore";

interface ContactPerson {
  resourceName: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  organization?: string;
  jobTitle?: string;
  type: "platform-admin" | "subscriber-client" | "general";
  isFirestore?: boolean;
}

interface SovereignContactsProps {
  currentRole: "super-admin" | "strategist" | "tactician" | "auditor" | "client";
  onChangeRole: (role: "super-admin" | "strategist" | "tactician" | "auditor" | "client") => void;
  isLightMode: boolean;
}

export const SovereignContacts: React.FC<SovereignContactsProps> = ({
  currentRole,
  onChangeRole,
  isLightMode
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Directory and Filter states
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [firestoreContacts, setFirestoreContacts] = useState<ContactPerson[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "platform-admin" | "subscriber-client">("all");

  // New Contact Creator states
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactOrg, setNewContactOrg] = useState("Sovereign Operations Hub");
  const [newContactRole, setNewContactRole] = useState<"platform-admin" | "subscriber-client">("subscriber-client");
  const [isCreating, setIsCreating] = useState(false);

  // 1. Authenticate & listen to user state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const accessToken = await getAccessToken();
        if (accessToken) {
          setToken(accessToken);
          setNeedsAuth(false);
        } else {
          setNeedsAuth(true);
        }
      } else {
        setCurrentUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Listen to Firestore contacts list dynamically
  useEffect(() => {
    if (!currentUser) {
      setFirestoreContacts([]);
      return;
    }

    const path = `users/${currentUser.uid}/contacts`;
    const q = query(collection(db, "users", currentUser.uid, "contacts"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ContactPerson[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          resourceName: `firestore/${doc.id}`,
          name: data.name || "Unnamed Contact",
          email: data.email || "Not specified",
          phone: data.phone || "Not specified",
          photoUrl: data.photoUrl,
          organization: data.organization || "Sovereign Operations Hub",
          jobTitle: data.type === "platform-admin" ? "Sovereign Administrator" : "Platform Client Subscriber",
          type: data.type || "subscriber-client",
          isFirestore: true
        });
      });
      setFirestoreContacts(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 3. Fetch from Google People API
  const fetchGoogleContacts = async (accessTokenString?: string) => {
    const activeToken = accessTokenString || token;
    if (!activeToken) return;

    setIsLoading(true);
    setErrorDetails(null);
    try {
      const url = `https://people.googleapis.com/v1/people/me/connections?pageSize=100&personFields=names,emailAddresses,phoneNumbers,photos,organizations`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Google API responded with error status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.connections && data.connections.length > 0) {
        const parsed: ContactPerson[] = data.connections.map((item: any) => {
          const nameObj = item.names && item.names[0];
          const name = nameObj ? nameObj.displayName : "Unnamed Contact";
          
          const emailObj = item.emailAddresses && item.emailAddresses[0];
          const email = emailObj ? emailObj.value : "Not specified";
          
          const phoneObj = item.phoneNumbers && item.phoneNumbers[0];
          const phone = phoneObj ? phoneObj.value : "Not specified";
          
          const photoObj = item.photos && item.photos[0];
          const photoUrl = photoObj && !photoObj.default ? photoObj.url : undefined;

          const orgObj = item.organizations && item.organizations[0];
          const organization = orgObj ? orgObj.name : "";
          const jobTitle = orgObj ? orgObj.title : "";

          let type: "platform-admin" | "subscriber-client" | "general" = "general";
          const tag = (jobTitle + " " + organization + " " + name).toLowerCase();
          if (tag.includes("admin") || tag.includes("director") || tag.includes("manager") || tag.includes("staff")) {
            type = "platform-admin";
          } else if (tag.includes("patient") || tag.includes("client") || tag.includes("user")) {
            type = "subscriber-client";
          }

          return {
            resourceName: item.resourceName,
            name,
            email,
            phone,
            photoUrl,
            organization,
            jobTitle,
            type,
            isFirestore: false
          };
        });

        setContacts(parsed);
      } else {
        setContacts([]);
      }
    } catch (err: any) {
      console.error("Failed to load Google Contacts connections:", err);
      setErrorDetails(err.message || "Unable to retrieve Google contacts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGoogleContacts();
    }
  }, [token]);

  // Handle manual Login Trigger
  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorDetails(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setCurrentUser(result.user);
        setNeedsAuth(false);
        fetchGoogleContacts(result.accessToken);
      }
    } catch (err: any) {
      console.error("Sign-in trigger failed:", err);
      setErrorDetails(err.message || "Session cancelled or rejected.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Sign out / deconnection
  const handleLogout = async () => {
    try {
      await logout();
      setToken(null);
      setCurrentUser(null);
      setContacts([]);
      setFirestoreContacts([]);
      setNeedsAuth(true);
    } catch (err) {
      console.error("Deconnection failed:", err);
    }
  };

  // Create & persist in Cloud Firestore list
  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!newContactName.trim()) {
      setErrorDetails("Contact name is required.");
      return;
    }

    setIsCreating(true);
    setErrorDetails(null);

    const contactId = `contact_${Date.now()}`;
    const path = `users/${currentUser.uid}/contacts/${contactId}`;

    try {
      // 1. Set document in Firestore
      const contactData = {
        id: contactId,
        name: newContactName,
        email: newContactEmail || "Not specified",
        phone: newContactPhone || "Not specified",
        organization: newContactOrg || "Sovereign Operations Hub",
        type: newContactRole,
        createdAt: new Date().toISOString(),
        ownerId: currentUser.uid
      };

      await setDoc(doc(db, "users", currentUser.uid, "contacts", contactId), contactData);

      // 2. Also try writing back to Google API contacts list if token is available
      if (token) {
        try {
          const body = {
            names: [{ givenName: newContactName }],
            emailAddresses: newContactEmail ? [{ value: newContactEmail }] : [],
            phoneNumbers: newContactPhone ? [{ value: newContactPhone }] : [],
            organizations: [{
              name: newContactOrg,
              title: newContactRole === "platform-admin" ? "Platform Administrator" : "Subscriber Client"
            }]
          };

          const response = await fetch("https://people.googleapis.com/v1/people:createContact", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          });

          if (response.ok) {
            console.log("Written successfully to Google Contacts backup cloud.");
            await fetchGoogleContacts();
          }
        } catch (gErr) {
          console.warn("Google Contacts API background write skipped: ", gErr);
        }
      }

      // Reset form fields
      setNewContactName("");
      setNewContactEmail("");
      setNewContactPhone("");
      setIsAddingContact(false);
      alert("New contact registered and persistent in Cloud Firestore!");
    } catch (err: any) {
      console.error("Failed to create Contact in Firestore:", err);
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsCreating(false);
    }
  };

  // Securely delete contact from cloud database
  const handleDeleteFirestoreContact = async (resourceName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    const docId = resourceName.replace("firestore/", "");

    const path = `users/${currentUser.uid}/contacts/${docId}`;
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "contacts", docId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Combine regular Google contacts and Firestore persisted contacts
  const mergedContactsList = [...firestoreContacts, ...contacts];

  const filteredContacts = mergedContactsList.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(term) || 
                          c.email.toLowerCase().includes(term) ||
                          c.phone.toLowerCase().includes(term) ||
                          (c.organization && c.organization.toLowerCase().includes(term));
    
    if (filterType === "all") return matchesSearch;
    return matchesSearch && c.type === filterType;
  });

  return (
    <div id="sovereign-contacts-grid" className="space-y-6 font-mono text-left">
      
      {/* Upper informational bar */}
      <GlassCard className="p-6 relative overflow-hidden bg-gradient-to-r from-purple-950/20 to-cyan-950/10 border-l-4 border-cyan-400">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Users className="w-24 h-24 text-cyan-400" />
        </div>
        <div className="z-10 relative">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Sovereign Clinical Contacts
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
            This directory synchronizes your secure clinic contacts in real-time with your Google Contacts account and segmented Cloud Firestore database. Register new approved Admin or Customer nodes under our closed-loop security protocol.
          </p>
        </div>
      </GlassCard>

      {needsAuth ? (
        <GlassCard className="p-8 text-center max-w-xl mx-auto space-y-6 border border-purple-500/20">
          <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
            <Key className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Connection Required</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              To authorize access to the operator's Google contacts and enroll clinical members, please authenticate with your credentials.
            </p>
          </div>

          <button
            onClick={handleSignIn}
            disabled={isLoggingIn}
            className="gsi-material-button mx-auto hover:scale-105 active:scale-95 transition-all"
          >
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              </div>
              <span className="gsi-material-button-contents font-sans font-semibold text-xs text-stone-850">Sign in with Google</span>
            </div>
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Controls & Directory section */}
          <div className="lg:col-span-8 space-y-6">
            
            <GlassCard className="p-5 bg-stone-950/20">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-4 border-b border-stone-900">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      filterType === "all"
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    All Contacts ({mergedContactsList.length})
                  </button>
                  <button
                    onClick={() => setFilterType("platform-admin")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      filterType === "platform-admin"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    Admins
                  </button>
                  <button
                    onClick={() => setFilterType("subscriber-client")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      filterType === "subscriber-client"
                        ? "bg-emerald-500/20 text-emerald-450 border border-emerald-400/30"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    Clients
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchGoogleContacts()}
                    disabled={isLoading}
                    className="p-1.5 bg-stone-905 hover:bg-stone-900 text-stone-300 rounded border border-stone-800 transition-all cursor-pointer"
                    title="Reload Google Contacts"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  </button>

                  <button
                    onClick={() => setIsAddingContact(!isAddingContact)}
                    className="px-3 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-500/20 text-[9px] font-black uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    + New Register
                  </button>
                </div>
              </div>

              {/* Search bar */}
              <div className="mt-4 relative">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-stone-500" />
                <input
                  type="text"
                  placeholder="Filter name, email, clinical code, telephone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-stone-850 px-9 py-2.5 rounded-xl font-mono text-[11px] text-stone-200 focus:outline-none focus:border-cyan-500/40 transition-colors"
                />
              </div>

              {/* Contacts List Grid */}
              <div className="mt-6 space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {isLoading ? (
                   <div className="text-center py-12 flex flex-col items-center justify-center space-y-2">
                     <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                     <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Querying Operator Contacts API...</span>
                   </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="text-center py-12 bg-black/20 rounded-xl border border-dashed border-stone-900 text-stone-500 text-[10px] uppercase">
                     No contacts found. Register a new one using the form.
                  </div>
                ) : (
                  filteredContacts.map((contact, i) => (
                    <div 
                      key={contact.resourceName || i} 
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        contact.type === "platform-admin"
                          ? "bg-purple-950/5 border-purple-500/10 hover:border-purple-500/25"
                          : contact.type === "subscriber-client"
                          ? "bg-emerald-950/5 border-emerald-500/10 hover:border-emerald-500/25"
                          : "bg-black/10 border-stone-900 hover:border-stone-800"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {contact.photoUrl ? (
                          <img 
                            src={contact.photoUrl} 
                            alt={contact.name} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full border border-stone-800 object-cover shrink-0"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border text-xs font-black shrink-0 ${
                            contact.type === "platform-admin"
                              ? "bg-purple-500/10 border-purple-500/25 text-purple-300"
                              : contact.type === "subscriber-client"
                              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-450"
                              : "bg-stone-900 border-stone-800 text-stone-400"
                          }`}>
                            {contact.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="space-y-0.5 text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[12px] font-extrabold text-white">{contact.name}</span>
                            
                            <span className={`text-[7px] font-black uppercase px-1.5 py-0.2 rounded-sm border ${
                              contact.type === "platform-admin"
                                ? "bg-purple-950/40 text-purple-300 border-purple-400/20"
                                : contact.type === "subscriber-client"
                                ? "bg-emerald-950/40 text-emerald-450 border-emerald-500/20"
                                : "bg-stone-900 text-stone-500 border-stone-850"
                            }`}>
                              {contact.type === "platform-admin" ? "Staff Admin" : "Subscriber Client"}
                            </span>

                            {/* Storage origin indicator */}
                            <span className={`text-[7px] font-mono font-bold tracking-widest uppercase px-1 py-0.2 rounded flex items-center gap-0.5 ${
                              contact.isFirestore 
                                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/35"
                                : "bg-purple-950/40 text-purple-300 border border-purple-500/25"
                            }`}>
                              {contact.isFirestore ? (
                                <>
                                  <Database className="w-2 h-2" />
                                  Firestore Clouddb
                                </>
                              ) : (
                                <>
                                  <Users className="w-2 h-2" />
                                  Google App API
                                </>
                              )}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:gap-4 text-[9.5px] text-stone-400 font-mono">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-stone-600" />
                              {contact.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-stone-600" />
                              {contact.phone}
                            </span>
                          </div>
                          
                          {contact.organization && (
                            <div className="text-[8.5px] text-stone-500 uppercase tracking-tight italic">
                              🏢 {contact.organization} {contact.jobTitle ? `• ${contact.jobTitle}` : ""}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {contact.isFirestore && (
                          <button
                            onClick={(e) => handleDeleteFirestoreContact(contact.resourceName, e)}
                            className="p-1 px-2 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/20 text-rose-500 text-[10px] rounded hover:scale-105 transition-all uppercase cursor-pointer flex items-center gap-1"
                            title="Delete from Firestore"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        )}
                        <span className="text-[8px] text-stone-500 uppercase hidden sm:inline">SIG_CONN_ENFORCED</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
            
          </div>

          {/* Form Create & Onboarding / Registration states */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* New Contact Creation form */}
            {isAddingContact && (
              <GlassCard className="p-5 border border-cyan-500/25 bg-cyan-950/5 space-y-4">
                <div className="flex justify-between items-center border-b border-stone-900 pb-2.5">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-cyan-400" />
                    Register Hospital Contact
                  </h4>
                  <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">SECURE TRANSMIT</span>
                </div>

                <form onSubmit={handleSubmitContact} className="space-y-4.5 text-left">
                  <div className="space-y-1">
                    <label className="text-[8.5px] text-stone-400 uppercase font-black block">Full Name *</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-stone-850 p-2 text-xs rounded text-stone-200 outline-none focus:border-cyan-500/45 font-mono"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      placeholder="e.g. Dr. Adam Beniich"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8.5px] text-stone-400 uppercase font-black block">Email Address</label>
                      <input
                        type="email"
                        className="w-full bg-black border border-stone-850 p-2 text-xs rounded text-stone-200 outline-none focus:border-cyan-500/45 font-mono"
                        value={newContactEmail}
                        onChange={(e) => setNewContactEmail(e.target.value)}
                        placeholder="adambeniich7@gmail.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8.5px] text-stone-400 uppercase font-black block">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full bg-black border border-stone-850 p-2 text-xs rounded text-stone-200 outline-none focus:border-cyan-500/45 font-mono"
                        value={newContactPhone}
                        onChange={(e) => setNewContactPhone(e.target.value)}
                        placeholder="+212 6..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8.5px] text-stone-400 uppercase font-black block">Clinic / Org</label>
                      <input
                        type="text"
                        className="w-full bg-black border border-stone-850 p-2 text-xs rounded text-stone-200 outline-none focus:border-cyan-500/45"
                        value={newContactOrg}
                        onChange={(e) => setNewContactOrg(e.target.value)}
                        placeholder="Sovereign Operations Hub"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8.5px] text-stone-400 uppercase font-black block">Platform Role / Sector</label>
                      <select
                        className="w-full bg-black border border-stone-850 p-2 text-[10px] rounded text-stone-200 outline-none focus:border-cyan-500/45 font-mono"
                        value={newContactRole}
                        onChange={(e: any) => setNewContactRole(e.target.value)}
                      >
                        <option value="subscriber-client">Subscribed Member Client</option>
                        <option value="platform-admin">Platform Administrator</option>
                      </select>
                    </div>
                  </div>

                  {errorDetails && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-lg text-rose-500 text-[9px] font-bold leading-normal">
                      ⚠ {errorDetails}
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="flex-1 py-2.5 bg-cyan-950/50 hover:bg-cyan-900 text-cyan-400 hover:text-white border border-cyan-500/40 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-40"
                    >
                      {isCreating ? "Adding to Cloud DB..." : "💾 Save Securely"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingContact(false)}
                      className="px-3 py-2.5 bg-stone-900 border border-stone-800 text-stone-400 hover:text-white text-[9px] font-black uppercase rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </GlassCard>
            )}

            {/* Application Onboarding / Registration for Admin and Clients interface */}
            <GlassCard className="p-5 space-y-4 border-l-4 border-purple-500">
              <div className="border-b border-stone-900 pb-2.5 flex justify-between items-center text-left">
                <h4 className="text-xs font-black text-[#a855f7] uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-purple-400" />
                  SOVEREIGN Core Role Registry
                </h4>
                <span className="text-[7.5px] bg-[#a855f7]/10 text-purple-300 border border-purple-500/25 px-1.5 py-0.5 rounded">IDENTITY PROMPT</span>
              </div>

              <div className="space-y-4 text-left leading-normal text-[11px] text-stone-300">
                <p>
                  Declare and assert your active access role on this sovereign control terminal. Cryptographic privileges and segmented 3D viewports are provisioned in real time.
                </p>

                <div className="p-3.5 bg-black/50 border border-stone-900 rounded-xl space-y-3.5 feedback-grid">
                  <div className="font-extrabold text-[9.5px] uppercase tracking-widest text-purple-200">
                    SELECT MY DEPLOYMENT PROFILE
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onChangeRole("super-admin");
                        alert("Admin credential validated. Tactical command modules are unlocked.");
                      }}
                      className={`py-3 text-[10px] font-black uppercase rounded-lg border transition-all text-center cursor-pointer ${
                        currentRole === "super-admin"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500"
                          : "bg-stone-950/40 border-stone-900 text-stone-500 hover:text-white"
                      }`}
                    >
                      👑 Platform Admin
                    </button>

                    <button
                      onClick={() => {
                        onChangeRole("client");
                        alert("Client accreditation activated. Courtesy access and fallback dashboard.");
                      }}
                      className={`py-3 text-[10px] font-black uppercase rounded-lg border transition-all text-center cursor-pointer ${
                        currentRole === "client"
                          ? "bg-emerald-500/20 text-emerald-455 border-emerald-500"
                          : "bg-stone-950/40 border-stone-900 text-stone-500 hover:text-white"
                      }`}
                    >
                      ⚡ Client / Guest
                    </button>
                  </div>

                  <div className="text-[8px] text-stone-500 text-justify leading-relaxed">
                    Each role renegotiation instantly generates brand-new mTLS routing handshakes with hot-standby cloud nodes.
                  </div>
                </div>

                <div className="bg-stone-950/40 p-3 rounded-lg border border-stone-900 space-y-1 text-[9.5px]">
                  <div className="text-stone-400 font-bold uppercase">CURRENT OPERATOR:</div>
                  <div className="text-white text-[10.5px] break-all font-semibold italic">
                    👤 {currentUser?.email || "Secure Airgapped Session"}
                  </div>
                  {currentUser && (
                    <div className="text-[7.5px] text-emerald-455 font-black animate-pulse uppercase">
                      ✓ GOOGLE SECURE IDENTITY ATTACHED
                    </div>
                  )}
                </div>

                {/* Disconnection buttons as requested */}
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-rose-950/20 hover:bg-rose-950/60 text-rose-500 border border-rose-900 hover:border-rose-600 rounded-xl font-black text-[9.5px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  End Session (Sign Out)
                </button>
              </div>
            </GlassCard>

          </div>

        </div>
      )}
    </div>
  );
};
