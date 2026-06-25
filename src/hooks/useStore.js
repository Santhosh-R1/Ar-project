import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_DIMENSIONS } from '../data/constants';

const useStore = create(
  persist(
    (set, get) => ({
      objects: [],
      selectedId: null,
      unit: 'Feet',
      theme: 'Dark',

      // Actions
      addObject: (type) => {
        const defaultDim = DEFAULT_DIMENSIONS[type] || {};
        const existingCount = get().objects.length;
        // Spread objects in a grid pattern to avoid stacking
        const col = existingCount % 5;
        const row = Math.floor(existingCount / 5);
        const newObj = {
          id: uuidv4(),
          type,
          name: `${type} ${existingCount + 1}`,
          position: [col * 2, 0, row * 2],
          rotation: [0, 0, 0],
          width: defaultDim.width || 1,
          height: defaultDim.height || 1,
          depth: defaultDim.depth || defaultDim.thickness || 1,
          radius: defaultDim.radius || 1,
          color: '#ffffff',
        };
        set((state) => ({ objects: [...state.objects, newObj], selectedId: newObj.id }));
      },

      updateObject: (id, updates) => {
        set((state) => ({
          objects: state.objects.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj)),
        }));
      },

      deleteObject: (id) => {
        set((state) => ({
          objects: state.objects.filter((obj) => obj.id !== id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        }));
      },

      duplicateObject: (id) => {
        const objToCopy = get().objects.find((obj) => obj.id === id);
        if (objToCopy) {
          const newObj = {
            ...objToCopy,
            id: uuidv4(),
            name: `${objToCopy.name} (Copy)`,
            position: [objToCopy.position[0] + 1, objToCopy.position[1], objToCopy.position[2] + 1],
          };
          set((state) => ({ objects: [...state.objects, newObj], selectedId: newObj.id }));
        }
      },

      selectObject: (id) => {
        set({ selectedId: id });
      },

      setUnit: (unit) => set({ unit }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'Dark' ? 'Light' : 'Dark' })),
      
      clearProject: () => set({ objects: [], selectedId: null }),
      
      loadProject: (stateData) => set({ 
        objects: stateData.objects || [], 
        unit: stateData.unit || 'Feet',
        theme: stateData.theme || 'Dark',
        selectedId: null 
      }),
      
    }),
    {
      name: 'construction-planner-storage', // name of item in the storage (must be unique)
    }
  )
);

export default useStore;
