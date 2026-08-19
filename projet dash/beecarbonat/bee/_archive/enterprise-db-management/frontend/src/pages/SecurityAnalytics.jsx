import React from 'react';

export default function SecurityAnalytics() {
    return (
        <div className="bg-background-dark font-display text-slate-100 antialiased min-h-screen">
            <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
                        <span className="material-icons text-primary text-2xl">security_update_good</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">Security Analytics &amp; Trends</h1>
                        <p className="text-xs text-slate-400">High-level security and access monitoring • <span className="text-primary font-medium">Live Feed</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                        <span className="material-symbols-outlined text-rose-500 text-sm animate-pulse">error</span>
                        <span className="text-xs font-bold text-rose-400">3 ACTIVE ALERTS</span>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-slate-700 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-slate-300">
                        <span className="material-icons text-sm">calendar_today</span>
                        Last 24h
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <span className="material-icons text-sm">settings</span>
                        Configure
                    </button>
                </div>
            </header>
            <main className="p-6 max-w-[1600px] mx-auto space-y-6">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 flex items-start gap-4">
                        <div className="bg-rose-500/20 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-rose-500">lock_reset</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider">Brute Force Attempt</h3>
                                <span className="text-[10px] text-rose-500/70 font-mono">14:52:10</span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">Multiple failed logins from IP <span className="font-mono text-white">192.168.14.22</span> detected on User: <span className="font-mono text-white">admin_root</span></p>
                        </div>
                    </div>
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-4">
                        <div className="bg-amber-500/20 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-amber-500">travel_explore</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Impossible Travel</h3>
                                <span className="text-[10px] text-amber-500/70 font-mono">14:48:05</span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">Login from <span className="text-white">Berlin, DE</span> followed by <span className="text-white">Tokyo, JP</span> in 4 minutes (User: <span className="font-mono text-white">m.chen</span>)</p>
                        </div>
                    </div>
                </section>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-lg text-white">Login Attempts over Time</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Success vs Failures</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                                    <span className="text-xs text-slate-400">Success</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                                    <span className="text-xs text-slate-400">Failures</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-64 w-full relative rounded-lg border border-slate-800/50 flex items-end justify-between px-4 pb-2" style={{
                            backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)",
                            backgroundSize: "24px 24px"
                        }}>
                            <div className="absolute inset-0 flex items-end">
                                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M0 80 Q 20 60, 40 75 T 60 40 T 80 50 T 100 20 L 100 100 L 0 100 Z" fill="rgba(59, 130, 246, 0.1)"></path>
                                    <path d="M0 80 Q 20 60, 40 75 T 60 40 T 80 50 T 100 20" fill="none" stroke="#3b82f6" strokeWidth="2"></path>
                                    <path d="M0 95 Q 25 90, 50 98 T 75 85 T 100 90 L 100 100 L 0 100 Z" fill="rgba(244, 63, 94, 0.1)"></path>
                                    <path d="M0 95 Q 25 90, 50 98 T 75 85 T 100 90" fill="none" stroke="#f43f5e" strokeWidth="2"></path>
                                </svg>
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                <div className="h-40 w-1 bg-slate-800/50 rounded-full"></div>
                                <span className="text-[10px] text-slate-600">08:00</span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                <div className="h-40 w-1 bg-slate-800/50 rounded-full"></div>
                                <span className="text-[10px] text-slate-600">12:00</span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                <div className="h-40 w-1 bg-slate-800/50 rounded-full"></div>
                                <span className="text-[10px] text-slate-600">16:00</span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                <div className="h-40 w-1 bg-slate-800/50 rounded-full"></div>
                                <span className="text-[10px] text-slate-600">20:00</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-lg text-white">Access Locations</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Global Traffic</p>
                            </div>
                            <span className="material-icons text-slate-600">public</span>
                        </div>
                        <div className="aspect-square bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-center bg-no-repeat bg-contain"></div>
                            <div className="absolute top-1/3 left-1/4">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                            </div>
                            <div className="absolute top-1/2 left-1/2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                            </div>
                            <div className="absolute top-1/4 right-1/4">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                                </span>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg p-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="flex items-center gap-1 text-slate-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> United States</span>
                                        <span className="font-bold">42.5%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="flex items-center gap-1 text-slate-300"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Germany</span>
                                        <span className="font-bold">18.2%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="flex items-center gap-1 text-slate-300"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Japan</span>
                                        <span className="font-bold">12.1%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-1 bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-col">
                        <div className="p-5 border-b border-slate-800">
                            <h3 className="font-bold text-lg text-white">Top Modified Objects</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">High Volatility Resources</p>
                        </div>
                        <div className="p-2 space-y-1">
                            <div className="flex items-center gap-4 p-3 hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-700">
                                <div className="bg-slate-800 w-10 h-10 rounded flex items-center justify-center font-mono text-xs text-primary">OBJ</div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-200">IAM_POLICIES_V2</p>
                                    <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-white">1,452</p>
                                    <p className="text-[10px] text-slate-500">edits</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-700">
                                <div className="bg-slate-800 w-10 h-10 rounded flex items-center justify-center font-mono text-xs text-amber-500">CFG</div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-200">K8S_AUTH_STORE</p>
                                    <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                                        <div className="bg-amber-500 h-full" style={{ width: '62%' }}></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-white">941</p>
                                    <p className="text-[10px] text-slate-500">edits</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-700">
                                <div className="bg-slate-800 w-10 h-10 rounded flex items-center justify-center font-mono text-xs text-emerald-500">DB</div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-200">USER_METADATA</p>
                                    <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-white">612</p>
                                    <p className="text-[10px] text-slate-500">edits</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto p-4 border-t border-slate-800">
                            <button className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-lg border border-slate-700">View Full Impact Report</button>
                        </div>
                    </div>
                    <div className="xl:col-span-3 bg-slate-900 rounded-xl border border-slate-800 shadow-xl flex flex-col overflow-hidden min-h-[500px]">
                        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-slate-200">Real-time Activity Stream</span>
                                <div className="h-4 w-[1px] bg-slate-800"></div>
                                <span className="text-xs text-slate-500">Auto-update: <span className="text-emerald-400">ON</span></span>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-1.5 hover:bg-slate-800 rounded border border-slate-700 text-slate-400"><span className="material-icons text-sm">search</span></button>
                                <button className="p-1.5 hover:bg-slate-800 rounded border border-slate-700 text-slate-400"><span className="material-icons text-sm">filter_list</span></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left border-collapse table-fixed-header audit-table">
                                <thead className="bg-slate-800/80 backdrop-blur-sm text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 w-40 border-b border-slate-700">Time</th>
                                        <th className="px-4 py-3 w-48 border-b border-slate-700">User</th>
                                        <th className="px-4 py-3 w-40 border-b border-slate-700">Action</th>
                                        <th className="px-4 py-3 border-b border-slate-700">Details</th>
                                        <th className="px-4 py-3 w-28 border-b border-slate-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr className="hover:bg-slate-800/50 transition-colors border-b border-slate-800/50">
                                        <td className="px-4 py-3 font-mono text-[10px] text-slate-500 uppercase">14:52:10.452</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-rose-500 flex items-center justify-center text-[9px] text-white font-bold">SM</div>
                                                <span className="font-medium text-slate-200 truncate">Sarah Meyer</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-rose-400 font-medium">Policy Delete</td>
                                        <td className="px-4 py-3 text-xs text-slate-400 truncate">Removed 'write' permission for group: external_contractors</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">Critical</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-800/50 transition-colors border-b border-slate-800/50">
                                        <td className="px-4 py-3 font-mono text-[10px] text-slate-500 uppercase">14:50:02.118</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-primary/30 flex items-center justify-center text-[9px] text-primary font-bold">JD</div>
                                                <span className="font-medium text-slate-200 truncate">John Doe</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-200 font-medium">Config Update</td>
                                        <td className="px-4 py-3 text-xs text-slate-400 truncate">Updated global timeout settings to 300s</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/20 text-primary border border-primary/30">Info</span>
                                        </td>
                                    </tr>
                                    {/* Additional rows */}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-3 border-t border-slate-800 flex items-center justify-center bg-slate-900/50">
                            <button className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                                View Entire Audit Log
                                <span className="material-icons text-xs">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <div className="fixed top-0 right-0 -z-10 w-1/2 h-1/2 bg-primary/5 blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-rose-500/5 blur-[120px] pointer-events-none"></div>
        </div>
    );
}
