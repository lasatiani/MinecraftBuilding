export interface StructureBlock {
    relativePosition: { x: number; y: number; z: number };
    type: string;
  }
  
  export interface Structure {
    name: string;
    blocks: StructureBlock[];
  }
  
  export const PREDEFINED_STRUCTURES: { [key: string]: Structure } = {
    house: {
      name: 'Simple House',
      blocks: [
        // Floor
        ...[...Array(5)].flatMap((_, x) => 
          [...Array(5)].map((_, z) => ({
            relativePosition: { x: x - 2, y: 0, z: z - 2 },
            type: 'stone'
          }))
        ),
        
        // Walls
        // Front wall with door
        { relativePosition: { x: -2, y: 1, z: -2 }, type: 'brick' },
        { relativePosition: { x: -1, y: 1, z: -2 }, type: 'brick' },
        { relativePosition: { x: 1, y: 1, z: -2 }, type: 'brick' },
        { relativePosition: { x: 2, y: 1, z: -2 }, type: 'brick' },
        { relativePosition: { x: -2, y: 2, z: -2 }, type: 'brick' },
        { relativePosition: { x: -1, y: 2, z: -2 }, type: 'brick' },
        { relativePosition: { x: 0, y: 2, z: -2 }, type: 'brick' },
        { relativePosition: { x: 1, y: 2, z: -2 }, type: 'brick' },
        { relativePosition: { x: 2, y: 2, z: -2 }, type: 'brick' },
        
        // Back wall
        ...[...Array(5)].flatMap((_, x) => 
          [...Array(2)].map((_, y) => ({
            relativePosition: { x: x - 2, y: y + 1, z: 2 },
            type: 'brick'
          }))
        ),
        
        // Left wall
        ...[...Array(5)].flatMap((_, z) => 
          [...Array(2)].map((_, y) => ({
            relativePosition: { x: -2, y: y + 1, z: z - 2 },
            type: 'brick'
          }))
        ),
        
        // Right wall
        ...[...Array(5)].flatMap((_, z) => 
          [...Array(2)].map((_, y) => ({
            relativePosition: { x: 2, y: y + 1, z: z - 2 },
            type: 'brick'
          }))
        ),
        
        // Roof
        ...[...Array(5)].flatMap((_, x) => 
          [...Array(5)].map((_, z) => ({
            relativePosition: { x: x - 2, y: 3, z: z - 2 },
            type: 'wood'
          }))
        ),
        
        // Windows
        { relativePosition: { x: -1, y: 1, z: 2 }, type: 'wood' },
        { relativePosition: { x: 1, y: 1, z: 2 }, type: 'wood' },
      ]
    },
    
    tower: {
      name: 'Castle Tower',
      blocks: [
        // Base
        ...[...Array(5)].flatMap((_, x) => 
          [...Array(5)].map((_, z) => ({
            relativePosition: { x: x - 2, y: 0, z: z - 2 },
            type: 'stone'
          }))
        ),
        
        // Walls - 4 levels
        ...[...Array(4)].flatMap((_, y) => 
          [
            // Outer walls
            ...[...Array(5)].flatMap((_, x) => [
              { relativePosition: { x: x - 2, y: y + 1, z: -2 }, type: 'stone' },
              { relativePosition: { x: x - 2, y: y + 1, z: 2 }, type: 'stone' }
            ]),
            ...[...Array(3)].flatMap((_, z) => [
              { relativePosition: { x: -2, y: y + 1, z: z - 1 }, type: 'stone' },
              { relativePosition: { x: 2, y: y + 1, z: z - 1 }, type: 'stone' }
            ])
          ]
        ),
        
        // Battlements
        ...[...Array(5)].flatMap((_, x) => 
          x % 2 === 0 ? [
            { relativePosition: { x: x - 2, y: 5, z: -2 }, type: 'stone' },
            { relativePosition: { x: x - 2, y: 5, z: 2 }, type: 'stone' }
          ] : []
        ),
        ...[...Array(3)].flatMap((_, z) => 
          z % 2 === 0 ? [
            { relativePosition: { x: -2, y: 5, z: z - 1 }, type: 'stone' },
            { relativePosition: { x: 2, y: 5, z: z - 1 }, type: 'stone' }
          ] : []
        ),
      ]
    },
    
    castle: {
      name: 'Small Castle',
      blocks: [
        // Base platform
        ...[...Array(11)].flatMap((_, x) => 
          [...Array(11)].map((_, z) => ({
            relativePosition: { x: x - 5, y: 0, z: z - 5 },
            type: 'stone'
          }))
        ),
        
        // Outer walls
        ...[...Array(11)].flatMap((_, x) => [
          // Front and back walls
          ...[...Array(3)].map((_, y) => ({
            relativePosition: { x: x - 5, y: y + 1, z: -5 },
            type: 'stone'
          })),
          ...[...Array(3)].map((_, y) => ({
            relativePosition: { x: x - 5, y: y + 1, z: 5 },
            type: 'stone'
          }))
        ]),
        
        ...[...Array(9)].flatMap((_, z) => [
          // Left and right walls
          ...[...Array(3)].map((_, y) => ({
            relativePosition: { x: -5, y: y + 1, z: z - 4 },
            type: 'stone'
          })),
          ...[...Array(3)].map((_, y) => ({
            relativePosition: { x: 5, y: y + 1, z: z - 4 },
            type: 'stone'
          }))
        ]),
        
        // Corner towers
        ...[
          { x: -5, z: -5 },
          { x: -5, z: 5 },
          { x: 5, z: -5 },
          { x: 5, z: 5 }
        ].flatMap(corner => 
          [...Array(5)].map((_, y) => ({
            relativePosition: { x: corner.x, y: y + 1, z: corner.z },
            type: 'brick'
          }))
        ),
        
        // Gate (front center)
        { relativePosition: { x: 0, y: 1, z: -5 }, type: 'wood' },
        { relativePosition: { x: 0, y: 2, z: -5 }, type: 'wood' },
        
        // Battlements
        ...[...Array(11)].flatMap((_, x) => 
          x % 2 === 0 ? [
            { relativePosition: { x: x - 5, y: 4, z: -5 }, type: 'stone' },
            { relativePosition: { x: x - 5, y: 4, z: 5 }, type: 'stone' }
          ] : []
        ),
        ...[...Array(9)].flatMap((_, z) => 
          z % 2 === 0 ? [
            { relativePosition: { x: -5, y: 4, z: z - 4 }, type: 'stone' },
            { relativePosition: { x: 5, y: 4, z: z - 4 }, type: 'stone' }
          ] : []
        ),
        
        // Central keep
        ...[...Array(5)].flatMap((_, x) => 
          [...Array(5)].flatMap((_, z) => [
            // Keep floor
            { relativePosition: { x: x - 2, y: 1, z: z - 2 }, type: 'brick' },
            // Keep walls
            ...(x === 0 || x === 4 || z === 0 || z === 4 ? 
              [...Array(4)].map((_, y) => ({
                relativePosition: { x: x - 2, y: y + 2, z: z - 2 },
                type: 'brick'
              })) : [])
          ])
        ),
        
        // Keep roof
        ...[...Array(5)].flatMap((_, x) => 
          [...Array(5)].map((_, z) => ({
            relativePosition: { x: x - 2, y: 6, z: z - 2 },
            type: 'wood'
          }))
        ),
      ]
    }
  };