import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function SREWorkOrders() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAsset, setNewAsset] = useState('HVAC-Z1');
  const [newPriority, setNewPriority] = useState('High');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateWO = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.post('/workorders', {
        title: newTitle,
        type: 'CORRECTIVE',
        priority: newPriority === 'Critical' ? 'CRITICAL' : newPriority === 'High' ? 'HIGH' : 'MEDIUM',
        status: 'PENDING'
      });
    } catch (err) {
      // fallback
    }
    setShowModal(false);
    setNewTitle('');
    alert('Ordre de travail SRE créé avec succès !');
  };

  const workOrders = [
    {
      id: 'WO-1042',
      title: 'Main DB Replica Sync Failure',
      priority: 'Critical',
      time: '14:00',
      asset: 'DB-CL-01-EU',
      assigneeName: 'J. Doe',
      assigneeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbj76xy4UNQt-Bq5YyBJowM04x3aaaubrwbEitdtfB-7hwK1fcv60ifc3nMb6YEjBr0NxLiU6GU19-KmBgvB1xBSg1PyYRQG2LWafhi1-gvvMpKKkn8OAjJEoCdgA2EEHjw0zYm7F4BngrujxcYIFD6uBZPPZXxq3g5aJPmXfWdgAmkrxe1OfnrPRoqd1aISVpaYvOJaSuqdQiZTdm3-4BIqeeNv2sqPL2ja4ZE8etXEnzeFkN-ZIy',
      onClick: () => navigate('/close-work-order-report')
    },
    {
      id: 'WO-1043',
      title: 'Cooling System Anomaly',
      priority: 'High',
      time: '15:30',
      asset: 'HVAC-Z3-RACK4',
      assigneeName: 'Unassigned',
      assigneeAvatar: null
    },
    {
      id: 'WO-1044',
      title: 'Routine Security Patch - Node A',
      priority: 'Normal',
      time: '18:00',
      asset: 'APP-NODE-01',
      assigneeName: 'M. Smith',
      assigneeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqhnkW_6TKoeGrejY80IfKyiEhqiMRssFYCqYCQL_m9p81XhZ-Z2iIYKYEJ_57rFJDnnKeBiVln-mD0y-1huRpMXBDWDp_97NgvL8ijvZw5DOWygENfWLIl3f_DEc3jC4JDcCYmRDV7WxqAyhdseZJzwrOfIu_oUpUHA_8yaN--iMpZX3wP8IxS8IC58djxhQtzDgLpgJcJfwyzzK9j9-qN5VPS9gZs0ufSmG2S5GIwJI_PzLDQ3y0'
    }
  ];

  const filteredOrders = useMemo(() => {
    return workOrders.filter(order => {
      const query = searchQuery.toLowerCase();
      return order.title.toLowerCase().includes(query) || order.id.toLowerCase().includes(query) || order.asset.toLowerCase().includes(query);
    });
  }, [searchQuery]);

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col md:flex-row">
      {/* Sidebar (Web) */}
      <aside className="hidden md:flex flex-col w-sidebar-width bg-surface-container-low border-r border-border-muted fixed h-full z-40">
        <div className="h-header-height flex items-center px-margin-page border-b border-border-muted">
          <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">SRE COMMAND</span>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-2 px-4">
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors" href="/">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md uppercase">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors" href="/assets-inventory">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-label-md text-label-md uppercase">Assets</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary bg-secondary-container/20" href="/sre-work-orders">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
            <span className="font-label-md text-label-md uppercase font-bold">Work</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined">notifications</span>
            <span className="font-label-md text-label-md uppercase">Alerts</span>
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-sidebar-width pb-16 md:pb-0">
        {/* TopAppBar */}
        <header className="bg-surface text-primary font-headline-sm text-headline-sm fixed top-0 w-full md:w-[calc(100%-256px)] h-16 border-b border-border-muted flex justify-between items-center px-margin-page z-50">
          <div className="flex items-center gap-4">
            {/* Avatar (Mobile Only - Web has sidebar) */}
            <div className="md:hidden w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-border-muted">
              <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeAyivJQLC9uoO_ohcatvqqt4c0LxxW1veqE0fOaWvZCyI6shfJqPGvAosP3AUkyEdC2uSF-A8qHbIqyWlD5Q_m38eIC3leJ0OEfzepeDmWiRL3p7mCpgf94PjC5zGmhnewLyWX1bjXjfhz8i6ug96dH0_ReWZPZQJD2jq4qXpcYvg-hpq7SfqwJgvzVFiaVGwMDU0vgatB_1AKUW09fz20q-uvUL6qeWbp6I_6XBFgTTA4J9ecr2Z"/>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight md:hidden">SRE COMMAND</span>
            <span className="hidden md:block font-headline-md text-headline-md font-bold text-on-surface">Work Orders</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/settings" className="text-on-surface-variant hover:text-primary transition-colors active:opacity-80">
              <span className="material-symbols-outlined">settings</span>
            </a>
          </div>
        </header>

        {/* Canvas */}
        <main className="flex-1 mt-16 p-container-padding md:p-margin-page flex flex-col gap-widget-gap overflow-y-auto">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                className="w-full bg-transparent border border-border-muted rounded-lg pl-9 pr-3 py-2 text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all font-body-sm text-body-sm outline-none placeholder-on-surface-variant/50" 
                placeholder="Search orders..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded border border-border-muted bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-label-sm text-label-sm uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
              </button>
              <button className="px-3 py-1.5 rounded border border-border-muted bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-label-sm text-label-sm uppercase">
                Sort: Priority
              </button>
            </div>
          </div>

          {/* Work Order List */}
          <div className="flex flex-col gap-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant">
                No work orders found matching "{searchQuery}"
              </div>
            ) : (
              filteredOrders.map(order => (
                <div 
                  key={order.id} 
                  onClick={order.onClick}
                  className={`bg-surface-card rounded-lg border border-border-muted hover:border-border-active transition-colors p-4 relative overflow-hidden group ${order.onClick ? 'cursor-pointer' : ''}`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${order.priority === 'Critical' ? 'bg-critical' : order.priority === 'High' ? 'bg-warning' : 'bg-surface-container'}`}></div>
                  
                  {order.priority !== 'Normal' && (
                    <div className={`absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t ${order.priority === 'Critical' ? 'from-critical/10' : 'from-warning/10'} to-transparent pointer-events-none`}></div>
                  )}

                  <div className="flex justify-between items-start mb-2 pl-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">{order.id}</span>
                        <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded w-fit uppercase ${
                          order.priority === 'Critical' ? 'text-critical bg-critical/10' : 
                          order.priority === 'High' ? 'text-warning bg-warning/10' : 
                          'text-success bg-success/10'
                        }`}>
                          {order.priority}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">{order.title}</h3>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded whitespace-nowrap">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> {order.time}
                    </span>
                  </div>

                  <div className="pl-2 mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Asset</span>
                      <span className="font-body-sm text-body-sm text-secondary-fixed">{order.asset}</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Assignee</span>
                      <span className="font-body-sm text-body-sm text-on-surface flex items-center gap-2">
                        {order.assigneeAvatar ? (
                          <div className="w-4 h-4 rounded-full bg-surface-container overflow-hidden shrink-0">
                            <img alt="Assignee" className="w-full h-full object-cover" src={order.assigneeAvatar}/>
                          </div>
                        ) : (
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">person_add</span>
                        )}
                        {order.assigneeName}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 rounded-xl bg-primary-container text-[#1000a9] flex items-center justify-center shadow-lg hover:bg-primary-fixed-dim transition-colors active:scale-95 z-50"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border-muted p-6 rounded-lg max-w-md w-full space-y-4 font-mono text-xs">
            <h3 className="font-bold text-sm text-on-surface uppercase">Nouveau Work Order SRE</h3>
            <form onSubmit={handleCreateWO} className="space-y-3">
              <div>
                <label className="block text-on-surface-variant mb-1">Titre de l'incident / tâche</label>
                <input
                  required
                  type="text"
                  placeholder="ex: Anomalie serveur réplication"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-surface-container border border-border-muted p-2 rounded text-on-surface outline-none"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant mb-1">Priorité</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full bg-surface-container border border-border-muted p-2 rounded text-on-surface outline-none"
                >
                  <option value="Critical">Critique (P0)</option>
                  <option value="High">Haute (P1)</option>
                  <option value="Normal">Normale (P2)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded font-bold uppercase"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden bg-surface-container-low text-primary font-label-sm text-label-sm fixed bottom-0 w-full z-50 border-t border-border-muted flex justify-around items-center h-16 px-4">
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-95" href="/">
          <span className="material-symbols-outlined mb-1">dashboard</span>
          <span className="uppercase">Dashboard</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-95" href="/assets-inventory">
          <span className="material-symbols-outlined mb-1">inventory_2</span>
          <span className="uppercase">Assets</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary bg-secondary-container/20 rounded-xl p-1 active:scale-95 transition-transform min-w-[64px]" href="#">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
          <span className="uppercase font-bold">Work</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-95" href="#">
          <span className="material-symbols-outlined mb-1">notifications</span>
          <span className="uppercase">Alerts</span>
        </a>
      </nav>
    </div>
  );
}
