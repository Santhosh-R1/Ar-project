import React from 'react';
import useStore from '../hooks/useStore';
import { Copy, Trash2 } from 'lucide-react';
import { formatDimension } from '../utils/helpers';
import { MATERIALS } from '../data/constants';

const PropertiesPanel = () => {
  const { theme, objects, selectedId, updateObject, duplicateObject, deleteObject, unit, mobilePropsOpen } = useStore();

  const selectedObj = objects.find(o => o.id === selectedId);

  if (!selectedObj) {
    return (
      <div className={`w-72 flex flex-col items-center justify-center border-l h-full p-6 text-center shrink-0
        absolute right-0 md:relative z-20 transition-transform duration-300
        ${mobilePropsOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        ${theme === 'Dark' ? 'bg-dark-bg border-dark-border text-dark-muted' : 'bg-light-bg border-light-border text-light-muted'}`}>
        <p>Select an object to view its properties.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = type === 'number' ? parseFloat(value) : value;
    
    // For position and rotation arrays
    if (name.startsWith('pos_')) {
      const idx = parseInt(name.split('_')[1]);
      const newPos = [...selectedObj.position];
      newPos[idx] = val;
      updateObject(selectedId, { position: newPos });
      return;
    }
    
    if (name.startsWith('rot_')) {
      const idx = parseInt(name.split('_')[1]);
      const newRot = [...selectedObj.rotation];
      newRot[idx] = val * (Math.PI / 180); // convert deg to rad
      updateObject(selectedId, { rotation: newRot });
      return;
    }

    updateObject(selectedId, { [name]: val });
  };

  const inputClass = `w-full px-2 py-1.5 rounded border text-sm focus:outline-none focus:border-blue-500 ${
    theme === 'Dark' ? 'bg-dark-panel border-dark-border text-white' : 'bg-white border-light-border text-black'
  }`;

  return (
    <div className={`w-72 flex flex-col border-l h-full overflow-y-auto scrollbar-thin shrink-0
      absolute right-0 md:relative z-20 transition-transform duration-300
      ${mobilePropsOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      ${theme === 'Dark' ? 'bg-dark-bg border-dark-border text-dark-text' : 'bg-light-bg border-light-border text-light-text'}`}>
      <div className="p-4 border-b border-inherit flex justify-between items-center sticky top-0 backdrop-blur-md z-10">
        <h2 className="font-semibold text-lg truncate pr-2">{selectedObj.name}</h2>
        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full">{selectedObj.type}</span>
      </div>

      <div className="p-4 space-y-6">
        {/* Dimensions */}
        <section>
          <h3 className="text-sm font-semibold mb-3 opacity-80 uppercase tracking-wider">Dimensions ({unit})</h3>
          <div className="grid grid-cols-2 gap-3">
            {selectedObj.width !== undefined && (
              <div>
                <label className="text-xs mb-1 block">Width</label>
                <input type="number" name="width" value={selectedObj.width} onChange={handleChange} className={inputClass} step="0.1" />
              </div>
            )}
            {selectedObj.height !== undefined && (
              <div>
                <label className="text-xs mb-1 block">Height</label>
                <input type="number" name="height" value={selectedObj.height} onChange={handleChange} className={inputClass} step="0.1" />
              </div>
            )}
            {selectedObj.depth !== undefined && (
              <div>
                <label className="text-xs mb-1 block">Depth / Thick</label>
                <input type="number" name="depth" value={selectedObj.depth} onChange={handleChange} className={inputClass} step="0.1" />
              </div>
            )}
            {selectedObj.radius !== undefined && (
              <div>
                <label className="text-xs mb-1 block">Radius</label>
                <input type="number" name="radius" value={selectedObj.radius} onChange={handleChange} className={inputClass} step="0.1" />
              </div>
            )}
          </div>
        </section>

        {/* Transform */}
        <section>
          <h3 className="text-sm font-semibold mb-3 opacity-80 uppercase tracking-wider">Transform</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs mb-1 block">Position (X, Y, Z)</label>
              <div className="flex gap-2">
                <input type="number" name="pos_0" value={selectedObj.position[0].toFixed(2)} onChange={handleChange} className={inputClass} step="0.1" />
                <input type="number" name="pos_1" value={selectedObj.position[1].toFixed(2)} onChange={handleChange} className={inputClass} step="0.1" />
                <input type="number" name="pos_2" value={selectedObj.position[2].toFixed(2)} onChange={handleChange} className={inputClass} step="0.1" />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block">Rotation (X, Y, Z) Deg</label>
              <div className="flex gap-2">
                <input type="number" name="rot_0" value={(selectedObj.rotation[0] * 180 / Math.PI).toFixed(0)} onChange={handleChange} className={inputClass} step="5" />
                <input type="number" name="rot_1" value={(selectedObj.rotation[1] * 180 / Math.PI).toFixed(0)} onChange={handleChange} className={inputClass} step="5" />
                <input type="number" name="rot_2" value={(selectedObj.rotation[2] * 180 / Math.PI).toFixed(0)} onChange={handleChange} className={inputClass} step="5" />
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h3 className="text-sm font-semibold mb-3 opacity-80 uppercase tracking-wider">Appearance</h3>
          <div>
            <label className="text-xs mb-1 block">Color</label>
            <div className="flex gap-2 items-center">
              <input type="color" name="color" value={selectedObj.color || '#ffffff'} onChange={handleChange} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <div className="flex flex-wrap gap-1">
                {Object.entries(MATERIALS).map(([key, color]) => (
                  <button 
                    key={key} 
                    className="w-6 h-6 rounded border border-gray-500 hover:scale-110 transition-transform" 
                    style={{ backgroundColor: color }}
                    title={key}
                    onClick={() => updateObject(selectedId, { color })}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="pt-4 border-t border-inherit flex gap-3">
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            onClick={() => duplicateObject(selectedId)}
          >
            <Copy size={16} /> Duplicate
          </button>
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            onClick={() => deleteObject(selectedId)}
          >
            <Trash2 size={16} /> Delete
          </button>
        </section>

      </div>
    </div>
  );
};

export default PropertiesPanel;
