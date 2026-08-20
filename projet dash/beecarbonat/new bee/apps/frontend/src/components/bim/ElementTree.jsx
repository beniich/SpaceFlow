import { useState } from 'react';
import { Layers, Folder, FolderOpen, File, ChevronRight, ChevronDown } from 'lucide-react';

export default function ElementTree({ elements = [], selectedElement, onSelectElement }) {
  const [openStoreys, setOpenStoreys] = useState({ 'Etage 1': true, 'Etage 2': true, 'Etage 3': true });

  // Regrouper les éléments par étage
  const storeys = {
    'Etage 1': elements.filter((_, idx) => idx < 8),
    'Etage 2': elements.filter((_, idx) => idx >= 8 && idx < 16),
    'Etage 3': elements.filter((_, idx) => idx >= 16)
  };

  const toggleStorey = (storey) => {
    setOpenStoreys(prev => ({ ...prev, [storey]: !prev[storey] }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-[500px] overflow-y-auto font-mono text-xs text-slate-300">
      <h3 className="font-bold text-slate-200 mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
        <Layers className="w-4 h-4 text-indigo-400" /> Structure de la Maquette
      </h3>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
          <FolderOpen className="w-4 h-4" /> Projet IFC (Horizon Alpha)
        </div>

        <div className="pl-4 space-y-1.5">
          {Object.entries(storeys).map(([storeyName, storeyElements]) => {
            const isOpen = openStoreys[storeyName];
            return (
              <div key={storeyName}>
                <button
                  onClick={() => toggleStorey(storeyName)}
                  className="flex items-center gap-1.5 font-semibold text-slate-200 hover:text-white transition"
                >
                  {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  {isOpen ? <FolderOpen className="w-3.5 h-3.5 text-amber-400" /> : <Folder className="w-3.5 h-3.5 text-amber-400" />}
                  {storeyName} ({storeyElements.length})
                </button>

                {isOpen && (
                  <div className="pl-6 pt-1 space-y-1 border-l border-slate-800 ml-1.5">
                    {storeyElements.map(el => {
                      const isSelected = el.id === selectedElement;
                      return (
                        <button
                          key={el.id}
                          onClick={() => onSelectElement(el.id)}
                          className={`w-full flex items-center gap-1.5 py-1 px-2 rounded text-left transition ${
                            isSelected
                              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                              : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <File className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{el.name}</span>
                          <span className="text-[9px] bg-slate-800 px-1 py-0.5 rounded text-slate-500 ml-auto shrink-0 uppercase">
                            {el.type.replace('Ifc', '')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
