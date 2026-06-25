import React from 'react';
import { Save, FolderOpen, Download, Upload, Trash2, Moon, Sun, Ruler, Box } from 'lucide-react';
import useStore from '../hooks/useStore';
import { exportProjectJSON } from '../utils/helpers';
import { xrStore } from '../store/xrStore';

const Toolbar = () => {
  const { theme, toggleTheme, unit, setUnit, clearProject, objects, loadProject } = useStore();

  const handleExport = () => {
    exportProjectJSON({ objects, unit, theme });
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const stateData = JSON.parse(event.target.result);
          loadProject(stateData);
        } catch (err) {
          alert("Invalid project file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`h-14 flex items-center justify-between px-4 border-b ${theme === 'Dark' ? 'bg-dark-panel border-dark-border text-dark-text' : 'bg-light-panel border-light-border text-light-text'}`}>
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-lg tracking-tight mr-4">Builder Pro</h1>
        
        {/* We can use native Save/Load or just Import/Export for now since we persist to localstorage anyway */}
        <button className="p-2 hover:bg-slate-700 rounded transition-colors" title="Export Project" onClick={handleExport}>
          <Download size={18} />
        </button>
        
        <label className="p-2 hover:bg-slate-700 rounded transition-colors cursor-pointer" title="Import Project">
          <Upload size={18} />
          <input type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>
        
        <button className="p-2 hover:bg-red-900 rounded transition-colors text-red-500" title="Clear Project" onClick={() => {
          if (confirm("Are you sure you want to clear the project?")) clearProject();
        }}>
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          onClick={() => setUnit(unit === 'Feet' ? 'Meters' : 'Feet')}
        >
          <Ruler size={16} />
          {unit}
        </button>

        <button 
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors"
          onClick={() => xrStore.enterAR()}
        >
          <Box size={16} />
          AR Mode
        </button>
        
        <button className="p-2 hover:bg-slate-700 rounded transition-colors" onClick={toggleTheme}>
          {theme === 'Dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
