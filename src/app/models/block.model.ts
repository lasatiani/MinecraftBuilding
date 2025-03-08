export interface Block {
  id: string;
  position: { x: number; y: number; z: number };
  type: BlockType;
}

export enum BlockType {
  GRASS = 'grass',
  DIRT = 'dirt',
  STONE = 'stone',
  WOOD = 'wood',
  BRICK = 'brick'
}

// Define texture configuration interfaces
export interface AllSidesTexture {
  all: string;
}

export interface TopSideTexture {
  top: string;
  side: string;
}

export interface TopBottomSideTexture {
  top: string;
  bottom: string;
  side: string;
}

export type BlockTextureConfig = AllSidesTexture | TopSideTexture | TopBottomSideTexture;

// Texture URLs for each block type
export const BLOCK_TEXTURES: Record<BlockType, BlockTextureConfig> = {
  [BlockType.GRASS]: {
    all: '/Grass.png'
  },
  [BlockType.DIRT]: {
    all: '/Dirt.png'
  },
  [BlockType.STONE]: {
    all: '/Stone.png'
  },
  [BlockType.WOOD]: {
    all: '/Wood.png'
  },
  [BlockType.BRICK]: {
    all: '/Stone.png'
  }
};

// Keep the colors for the block selector UI
export const BLOCK_COLORS = {
  [BlockType.GRASS]: 0x3bab17,
  [BlockType.DIRT]: 0x8b4513,
  [BlockType.STONE]: 0x808080,
  [BlockType.WOOD]: 0x966f33,
  [BlockType.BRICK]: 0xb22222
};

