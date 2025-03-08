import { Injectable } from '@angular/core';
import { BlockService } from './block.service';
import { BlockType } from '../models/block.model';
import { PREDEFINED_STRUCTURES, Structure } from '../models/structure.model';

@Injectable({
  providedIn: 'root'
})
export class StructureService {
  
  constructor(private blockService: BlockService) {}
  
  getAvailableStructures(): string[] {
    return Object.keys(PREDEFINED_STRUCTURES);
  }
  
  getStructureByKey(key: string): Structure | null {
    return PREDEFINED_STRUCTURES[key] || null;
  }
  
  buildStructure(structureKey: string, position: { x: number, y: number, z: number }) {
    const structure = this.getStructureByKey(structureKey);
    if (!structure) return;
    
    // Build the structure block by block
    structure.blocks.forEach(block => {
      const worldPosition = {
        x: position.x + block.relativePosition.x,
        y: position.y + block.relativePosition.y,
        z: position.z + block.relativePosition.z
      };
      
      const blockType = block.type as BlockType;
      
      this.blockService.addBlock({
        id: `${worldPosition.x}_${worldPosition.y}_${worldPosition.z}`,
        position: worldPosition,
        type: blockType
      });
    });
  }
  
  // Build a structure with animation (adding blocks one by one)
  async buildStructureWithAnimation(
    structureKey: string, 
    position: { x: number, y: number, z: number },
    delayMs: number = 50
  ) {
    const structure = this.getStructureByKey(structureKey);
    if (!structure) return;
    
    // Sort blocks by y-coordinate to build from bottom to top
    const sortedBlocks = [...structure.blocks].sort(
      (a, b) => a.relativePosition.y - b.relativePosition.y
    );
    
    for (const block of sortedBlocks) {
      const worldPosition = {
        x: position.x + block.relativePosition.x,
        y: position.y + block.relativePosition.y,
        z: position.z + block.relativePosition.z
      };
      
      const blockType = block.type as BlockType;
      
      this.blockService.addBlock({
        id: `${worldPosition.x}_${worldPosition.y}_${worldPosition.z}`,
        position: worldPosition,
        type: blockType
      });
      
      // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}