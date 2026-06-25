export const OBJECT_TYPES = {
  WALL: 'Wall',
  PILLAR: 'Pillar',
  DOOR: 'Door',
  WINDOW: 'Window',
  STAIRCASE: 'Staircase',
  ROOF: 'Roof',
  FLOOR: 'Floor Slab',
  FURNITURE: 'Furniture'
};

export const DEFAULT_DIMENSIONS = {
  [OBJECT_TYPES.WALL]: { width: 5, height: 3, thickness: 0.2 },
  [OBJECT_TYPES.PILLAR]: { radius: 0.2, width: 0.4, height: 3 }, // using radius for cylinder, or width/height for box
  [OBJECT_TYPES.DOOR]: { width: 1, height: 2.1, thickness: 0.1 },
  [OBJECT_TYPES.WINDOW]: { width: 1.5, height: 1.2, thickness: 0.1 },
  [OBJECT_TYPES.STAIRCASE]: { width: 1.2, height: 3, depth: 3 },
  [OBJECT_TYPES.ROOF]: { width: 6, height: 2, depth: 6 },
  [OBJECT_TYPES.FLOOR]: { width: 5, height: 0.2, depth: 5 },
  [OBJECT_TYPES.FURNITURE]: { width: 1, height: 1, depth: 1 } // generic
};

export const MATERIALS = {
  CONCRETE: '#95a5a6',
  BRICK: '#c0392b',
  WOOD: '#d35400',
  MARBLE: '#ecf0f1',
  STEEL: '#7f8c8d',
  DEFAULT: '#ffffff'
};
