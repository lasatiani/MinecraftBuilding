import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Block, BlockType } from '../models/block.model';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  private blocks: Block[] = [];
  private blocksSubject = new BehaviorSubject<Block[]>([]);
  
  blocks$ = this.blocksSubject.asObservable();
  
  constructor() {
    // Initialize with a flat ground of grass blocks
    this.createInitialGround();
  }
  
  private createInitialGround() {
    const size = 10; // 10x10 ground
    for (let x = -size/2; x < size/2; x++) {
      for (let z = -size/2; z < size/2; z++) {
        this.addBlock({
          id: `${x}_0_${z}`,
          position: { x, y: 0, z },
          type: BlockType.GRASS
        });
      }
    }
  }
  
  addBlock(block: Block) {
    // Check if a block already exists at this position
    const existingBlockIndex = this.blocks.findIndex(b => 
      b.position.x === block.position.x && 
      b.position.y === block.position.y && 
      b.position.z === block.position.z
    );
    
    if (existingBlockIndex === -1) {
      this.blocks.push(block);
      this.blocksSubject.next([...this.blocks]);
    }
  }
  
  removeBlock(id: string) {
    this.blocks = this.blocks.filter(block => block.id !== id);
    this.blocksSubject.next([...this.blocks]);
  }
  
  getBlocks() {
    return [...this.blocks];
  }
  
  clearBlocks() {
    this.blocks = [];
    this.blocksSubject.next([]);
    this.createInitialGround();
  }
}