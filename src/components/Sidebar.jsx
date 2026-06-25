import React from 'react';
import useStore from '../hooks/useStore';
import { OBJECT_TYPES } from '../data/constants';
import { BoxSelect, Type, Grid3X3, ArrowRightSquare, Frame, Tent, Layers, Armchair } from 'lucide-react';

const icons = {
  [OBJECT_TYPES.WALL]: <BoxSelect size={20} />,
  [OBJECT_TYPES.PILLAR]: <Type size={20} />,
  [OBJECT_TYPES.DOOR]: <ArrowRightSquare size={20} />,
  [OBJECT_TYPES.WINDOW]: <Frame size={20} />,
  [OBJECT_TYPES.STAIRCASE]: <Grid3X3 size={20} />,
  [OBJECT_TYPES.ROOF]: <Tent size={20} />,
  [OBJECT_TYPES.FLOOR]: <Layers size={20} />,
  [OBJECT_TYPES.FURNITURE]: <Armchair size={20} />,
};

const Sidebar = () => {
  const { theme, addObject, mobileMenuOpen } = useStore();

  return (
    <div className={`w-64 flex flex-col border-r h-full overflow-y-auto scrollbar-thin shrink-0
      absolute md:relative z-20 transition-transform duration-300
      ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      ${theme === 'Dark' ? 'bg-dark-bg border-dark-border text-dark-text' : 'bg-light-bg border-light-border text-light-text'}`}>
      <div className="p-4 border-b border-inherit">
        <h2 className="font-semibold text-lg">Object Library</h2>
        <p className="text-sm opacity-70 mt-1">Click to add to scene</p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {Object.values(OBJECT_TYPES).map((type) => (
          <button
            key={type}
            onClick={() => addObject(type)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              theme === 'Dark' 
                ? 'bg-dark-panel border-dark-border hover:border-blue-500' 
                : 'bg-light-panel border-light-border hover:border-blue-500'
            }`}
          >
            <div className="mb-2 text-blue-500">
              {icons[type]}
            </div>
            <span className="text-xs font-medium text-center">{type}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
