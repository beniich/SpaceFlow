import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const DEFAULT_SITES = [
  {
    id: 'site-1',
    name: 'Paris HQ - Bâtiment Alpha',
    streetAddress: '124 Boulevard Haussmann',
    postalCode: '75008',
    city: 'Paris',
    country: 'France',
    phone: '+33 1 42 68 50 00',
    accessInstructions: 'Accès visiteurs via le PC Sécurité au RDC. Badge obligatoire et enregistrement sur le registre.',
    isPrimary: true,
    status: 'ACTIVE'
  },
  {
    id: 'site-2',
    name: 'Lyon Hub - Bâtiment Béta',
    streetAddress: '42 Rue de la République',
    postalCode: '69002',
    city: 'Lyon',
    country: 'France',
    phone: '+33 4 72 10 30 00',
    accessInstructions: 'Accès zone logistique par la cour arrière (Quai 3). Code digicode 4589B.',
    isPrimary: false,
    status: 'ACTIVE'
  },
  {
    id: 'site-3',
    name: 'Berlin Tech Campus - Building C',
    streetAddress: 'Friedrichstraße 100',
    postalCode: '10117',
    city: 'Berlin',
    country: 'Germany',
    phone: '+49 30 201 400',
    accessInstructions: 'RFID Keycard required at entrance C2. Contact SRE Desk on extension 401.',
    isPrimary: false,
    status: 'ACTIVE'
  }
];

const DEFAULT_FORM_CONFIG = {
  banners: [
    {
      id: 'ind-1',
      title: 'Consignes de Sécurité Générales (Superadmin)',
      text: 'EPI obligatoires (casque, chaussures de sécurité, gants isolants) pour toute intervention technique en local restreint (TGBT, CTA, Chaufferie).',
      type: 'warning', // 'warning' | 'info' | 'important'
      enabled: true
    },
    {
      id: 'ind-2',
      title: 'Procédure de Signalement & Urgences',
      text: 'En cas d\'urgence absolue (fuite d\'eau critique, départ de feu ou coupure électrique principale), appeler immédiatement le PC Sécurité au 01 42 68 50 00.',
      type: 'important',
      enabled: true
    }
  ],
  customFields: [
    {
      id: 'cf-access-code',
      label: 'Numéro de Pass / Badge Accès Site',
      type: 'text',
      placeholder: 'Ex: PASS-2026-889',
      required: true,
      helpText: 'Indication requise par le Superadmin pour traçabilité de sécurité',
      enabled: true,
      appliesTo: 'ALL'
    },
    {
      id: 'cf-epi-verified',
      label: 'Vérification des Équipements de Protection (EPI)',
      type: 'checkbox',
      placeholder: '',
      required: true,
      helpText: 'Je certifie disposer des EPI adaptés avant le démarrage des travaux',
      enabled: true,
      appliesTo: 'ALL'
    },
    {
      id: 'cf-phone-contact',
      label: 'Contact Téléphonique Direct de l\'Intervenant',
      type: 'text',
      placeholder: '+33 6 12 34 56 78',
      required: false,
      helpText: 'Numéro mobile joignable en cours d\'intervention',
      enabled: true,
      appliesTo: 'ALL'
    }
  ]
};

const SiteConfigContext = createContext();

export function SiteConfigProvider({ children }) {
  const [sites, setSites] = useState(() => {
    try {
      const saved = localStorage.getItem('beecarbonat_site_config_v1');
      return saved ? JSON.parse(saved) : DEFAULT_SITES;
    } catch {
      return DEFAULT_SITES;
    }
  });

  const [formConfig, setFormConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('beecarbonat_form_config_v1');
      return saved ? JSON.parse(saved) : DEFAULT_FORM_CONFIG;
    } catch {
      return DEFAULT_FORM_CONFIG;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('beecarbonat_site_config_v1', JSON.stringify(sites));
    } catch (e) {
      console.error('Failed to save site config:', e);
    }
  }, [sites]);

  useEffect(() => {
    try {
      localStorage.setItem('beecarbonat_form_config_v1', JSON.stringify(formConfig));
    } catch (e) {
      console.error('Failed to save form config:', e);
    }
  }, [formConfig]);

  // Site Actions
  const addSite = (siteData) => {
    const newSite = {
      id: `site-${Date.now()}`,
      name: siteData.name || 'Nouveau Site',
      streetAddress: siteData.streetAddress || '',
      postalCode: siteData.postalCode || '',
      city: siteData.city || '',
      country: siteData.country || 'France',
      phone: siteData.phone || '',
      accessInstructions: siteData.accessInstructions || '',
      isPrimary: false,
      status: 'ACTIVE'
    };
    setSites(prev => [...prev, newSite]);
    toast.success(`Nouveau site "${newSite.name}" ajouté avec succès !`);
  };

  const updateSite = (id, updatedFields) => {
    setSites(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    toast.success('Adresse du site mise à jour avec succès.');
  };

  const deleteSite = (id) => {
    setSites(prev => prev.filter(s => s.id !== id));
    toast.error('Site supprimé du registre.');
  };

  // Form Banner Actions
  const addFormBanner = (bannerData) => {
    const newBanner = {
      id: `ind-${Date.now()}`,
      title: bannerData.title || 'Indication du Superadmin',
      text: bannerData.text || '',
      type: bannerData.type || 'info',
      enabled: true
    };
    setFormConfig(prev => ({
      ...prev,
      banners: [...prev.banners, newBanner]
    }));
    toast.success('Nouvelle consigne ajoutée au formulaire.');
  };

  const updateFormBanner = (id, updatedFields) => {
    setFormConfig(prev => ({
      ...prev,
      banners: prev.banners.map(b => b.id === id ? { ...b, ...updatedFields } : b)
    }));
    toast.success('Consigne de formulaire modifiée.');
  };

  const toggleFormBanner = (id) => {
    setFormConfig(prev => ({
      ...prev,
      banners: prev.banners.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b)
    }));
  };

  const deleteFormBanner = (id) => {
    setFormConfig(prev => ({
      ...prev,
      banners: prev.banners.filter(b => b.id !== id)
    }));
    toast.error('Consigne supprimée.');
  };

  // Custom Field Actions
  const addCustomField = (fieldData) => {
    const newField = {
      id: `cf-${Date.now()}`,
      label: fieldData.label || 'Champ Personnalisé',
      type: fieldData.type || 'text', // 'text' | 'checkbox' | 'number' | 'select'
      placeholder: fieldData.placeholder || '',
      required: fieldData.required || false,
      helpText: fieldData.helpText || '',
      enabled: true,
      appliesTo: fieldData.appliesTo || 'ALL'
    };
    setFormConfig(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }));
    toast.success('Nouveau champ personnalisé ajouté aux formulaires !');
  };

  const updateCustomField = (id, updatedFields) => {
    setFormConfig(prev => ({
      ...prev,
      customFields: prev.customFields.map(f => f.id === id ? { ...f, ...updatedFields } : f)
    }));
    toast.success('Champ du formulaire mis à jour.');
  };

  const toggleCustomField = (id) => {
    setFormConfig(prev => ({
      ...prev,
      customFields: prev.customFields.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
    }));
  };

  const deleteCustomField = (id) => {
    setFormConfig(prev => ({
      ...prev,
      customFields: prev.customFields.filter(f => f.id !== id)
    }));
    toast.error('Champ supprimé du formulaire.');
  };

  const resetToDefaults = () => {
    setSites(DEFAULT_SITES);
    setFormConfig(DEFAULT_FORM_CONFIG);
    localStorage.removeItem('beecarbonat_site_config_v1');
    localStorage.removeItem('beecarbonat_form_config_v1');
    toast.success('Configurations réinitialisées aux valeurs par défaut.');
  };

  return (
    <SiteConfigContext.Provider value={{
      sites,
      formConfig,
      addSite,
      updateSite,
      deleteSite,
      addFormBanner,
      updateFormBanner,
      toggleFormBanner,
      deleteFormBanner,
      addCustomField,
      updateCustomField,
      toggleCustomField,
      deleteCustomField,
      resetToDefaults
    }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
}
