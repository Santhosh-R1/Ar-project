import React, { useState } from 'react';
import { XRDomOverlay } from '@react-three/xr';
import { BoxSelect, Type, Grid3X3, ArrowRightSquare, Frame, Tent, Layers, Armchair, X, ChevronLeft, ChevronRight, Palette, Move, Ruler } from 'lucide-react';
import useStore from '../hooks/useStore';
import { OBJECT_TYPES, MATERIALS } from '../data/constants';

const icons = {
  [OBJECT_TYPES.WALL]: <BoxSelect size={18} />,
  [OBJECT_TYPES.PILLAR]: <Type size={18} />,
  [OBJECT_TYPES.DOOR]: <ArrowRightSquare size={18} />,
  [OBJECT_TYPES.WINDOW]: <Frame size={18} />,
  [OBJECT_TYPES.STAIRCASE]: <Grid3X3 size={18} />,
  [OBJECT_TYPES.ROOF]: <Tent size={18} />,
  [OBJECT_TYPES.FLOOR]: <Layers size={18} />,
  [OBJECT_TYPES.FURNITURE]: <Armchair size={18} />,
};

const AROverlay = () => {
  const { objects, selectedId, activeTool, setActiveTool, selectObject, updateObject, deleteObject, duplicateObject } = useStore();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProps, setShowProps] = useState(true);
  const [activeTab, setActiveTab] = useState('dims'); // 'dims' | 'transform' | 'color'

  const selectedObj = objects.find(o => o.id === selectedId);

  const panelBase = `
    backdrop-blur-xl bg-black/60 border border-white/20 rounded-2xl text-white shadow-2xl overflow-hidden
  `;

  const inputCls = `
    w-full px-2 py-1 rounded-lg border border-white/20 bg-white/10 text-white text-xs focus:outline-none focus:border-blue-400
  `;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = type === 'number' ? parseFloat(value) : value;
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
      newRot[idx] = val * (Math.PI / 180);
      updateObject(selectedId, { rotation: newRot });
      return;
    }
    updateObject(selectedId, { [name]: val });
  };

  return (
    <XRDomOverlay style={{ pointerEvents: 'auto', zIndex: 9999 }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>

        {/* ── Left: Object Library ── */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: showSidebar ? 8 : -190,
            transform: 'translateY(-50%)',
            width: 190,
            maxHeight: '80vh',
            transition: 'left 0.3s ease',
            pointerEvents: 'auto',
          }}
        >
          <div className={panelBase} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>Objects</span>
              <span style={{ fontSize: 11, opacity: 0.6 }}>Select & tap surface</span>
            </div>
            {/* Grid */}
            <div style={{ padding: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, overflowY: 'auto', maxHeight: 'calc(80vh - 44px)' }}>
              {Object.values(OBJECT_TYPES).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTool(activeTool === type ? null : type)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '10px 6px', borderRadius: 12,
                    background: activeTool === type ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)', 
                    border: activeTool === type ? '1px solid rgba(165,180,252,0.8)' : '1px solid rgba(255,255,255,0.15)',
                    color: 'white', cursor: 'pointer', gap: 6, transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (activeTool !== type) e.currentTarget.style.background = 'rgba(99,102,241,0.35)'; }}
                  onMouseLeave={e => { if (activeTool !== type) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                >
                  <span style={{ color: '#818cf8' }}>{icons[type]}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>{type}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Toggle tab */}
          <button
            onClick={() => setShowSidebar(s => !s)}
            style={{
              position: 'absolute', top: '50%', right: -28, transform: 'translateY(-50%)',
              width: 28, height: 44, borderRadius: '0 10px 10px 0',
              background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
              borderLeft: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {showSidebar ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* ── Right: Properties Panel ── */}
        {selectedObj && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: showProps ? 8 : -230,
              transform: 'translateY(-50%)',
              width: 220,
              maxHeight: '85vh',
              transition: 'right 0.3s ease',
              pointerEvents: 'auto',
            }}
          >
            <div className={panelBase} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedObj.name}</div>
                  <div style={{ fontSize: 10, color: '#818cf8', marginTop: 2 }}>{selectedObj.type}</div>
                </div>
                <button
                  onClick={() => selectObject(null)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: 4, color: 'white', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                {[
                  { id: 'dims', icon: <Ruler size={14} />, label: 'Size' },
                  { id: 'transform', icon: <Move size={14} />, label: 'Move' },
                  { id: 'color', icon: <Palette size={14} />, label: 'Color' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: 1, padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                      background: activeTab === tab.id ? 'rgba(99,102,241,0.3)' : 'transparent',
                      border: 'none', color: activeTab === tab.id ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer', fontSize: 10, fontWeight: 600, transition: 'all 0.15s',
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ padding: 12, overflowY: 'auto', maxHeight: 'calc(85vh - 130px)' }}>
                {activeTab === 'dims' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedObj.width !== undefined && (
                      <div>
                        <label style={{ fontSize: 10, opacity: 0.7, display: 'block', marginBottom: 3 }}>Width</label>
                        <input type="number" name="width" value={selectedObj.width} onChange={handleChange} step="0.1" className={inputCls} />
                      </div>
                    )}
                    {selectedObj.height !== undefined && (
                      <div>
                        <label style={{ fontSize: 10, opacity: 0.7, display: 'block', marginBottom: 3 }}>Height</label>
                        <input type="number" name="height" value={selectedObj.height} onChange={handleChange} step="0.1" className={inputCls} />
                      </div>
                    )}
                    {selectedObj.depth !== undefined && (
                      <div>
                        <label style={{ fontSize: 10, opacity: 0.7, display: 'block', marginBottom: 3 }}>Depth</label>
                        <input type="number" name="depth" value={selectedObj.depth} onChange={handleChange} step="0.1" className={inputCls} />
                      </div>
                    )}
                    {selectedObj.radius !== undefined && (
                      <div>
                        <label style={{ fontSize: 10, opacity: 0.7, display: 'block', marginBottom: 3 }}>Radius</label>
                        <input type="number" name="radius" value={selectedObj.radius} onChange={handleChange} step="0.05" className={inputCls} />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'transform' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 10, opacity: 0.7, display: 'block', marginBottom: 3 }}>Position X / Y / Z</label>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[0, 1, 2].map(i => (
                          <input key={i} type="number" name={`pos_${i}`} value={selectedObj.position[i].toFixed(2)} onChange={handleChange} step="0.1" className={inputCls} style={{ padding: '4px 6px' }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 10, opacity: 0.7, display: 'block', marginBottom: 3 }}>Rotation (°) X / Y / Z</label>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[0, 1, 2].map(i => (
                          <input key={i} type="number" name={`rot_${i}`} value={(selectedObj.rotation[i] * 180 / Math.PI).toFixed(0)} onChange={handleChange} step="5" className={inputCls} style={{ padding: '4px 6px' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'color' && (
                  <div>
                    <label style={{ fontSize: 10, opacity: 0.7, display: 'block', marginBottom: 6 }}>Preset Materials</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                      {Object.entries(MATERIALS).map(([key, color]) => (
                        <button
                          key={key}
                          title={key}
                          onClick={() => updateObject(selectedId, { color })}
                          style={{
                            width: 28, height: 28, borderRadius: 8, backgroundColor: color,
                            border: selectedObj.color === color ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.3)',
                            cursor: 'pointer', transition: 'transform 0.1s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      ))}
                    </div>
                    <label style={{ fontSize: 10, opacity: 0.7, display: 'block', marginBottom: 4 }}>Custom Color</label>
                    <input type="color" name="color" value={selectedObj.color || '#ffffff'} onChange={handleChange}
                      style={{ width: '100%', height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: 'transparent' }} />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', gap: 8 }}>
                <button
                  onClick={() => deleteObject(selectedId)}
                  style={{ flex: 1, padding: '7px 0', borderRadius: 10, background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                >
                  Delete
                </button>
                <button
                  onClick={() => { if (selectedId) { const dup = objects.find(o => o.id === selectedId); if (dup) updateObject(selectedId, {}); } duplicateObject(selectedId); }}
                  style={{ flex: 1, padding: '7px 0', borderRadius: 10, background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                >
                  Duplicate
                </button>
              </div>
            </div>

            {/* Toggle tab */}
            <button
              onClick={() => setShowProps(s => !s)}
              style={{
                position: 'absolute', top: '50%', left: -28, transform: 'translateY(-50%)',
                width: 28, height: 44, borderRadius: '10px 0 0 10px',
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
                borderRight: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {showProps ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        )}

        {/* ── Bottom hint when nothing selected ── */}
        {!selectedObj && (
          <div style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 40, padding: '8px 20px', color: 'rgba(255,255,255,0.75)', fontSize: 12,
            whiteSpace: 'nowrap', pointerEvents: 'none',
          }}>
            👆 Tap an object to select &amp; edit it
          </div>
        )}
      </div>
    </XRDomOverlay>
  );
};

export default AROverlay;
