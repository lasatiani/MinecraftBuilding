import { Component } from '@angular/core';
import { StructureService } from '../../services/structure.service';
import { PREDEFINED_STRUCTURES } from '../../models/structure.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-structure-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="structure-controls">
      <h3>Auto Build</h3>
      <div class="structure-buttons">
        <button *ngFor="let key of availableStructures" 
                (click)="buildStructure(key)">
          {{ getStructureName(key) }}
        </button>
      </div>
      <div class="animation-toggle">
        <label>
          <input type="checkbox" [(ngModel)]="animated" />
          Animated Building
        </label>
      </div>
    </div>
  `,
  styles: [`
    .structure-controls {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 10px;
      border-radius: 5px;
      z-index: 100;
      width: 200px;
    }
    
    h3 {
      margin-top: 0;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .structure-buttons {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    button {
      padding: 8px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #45a049;
    }
    
    .animation-toggle {
      margin-top: 10px;
      display: flex;
      align-items: center;
    }
    
    input[type="checkbox"] {
      margin-right: 5px;
    }
  `]
})
export class StructureControlsComponent {
  availableStructures: string[] = [];
  animated = true;
  
  constructor(private structureService: StructureService) {
    this.availableStructures = this.structureService.getAvailableStructures();
  }
  
  getStructureName(key: string): string {
    return PREDEFINED_STRUCTURES[key]?.name || key;
  }
  
  buildStructure(key: string) {
    // Build at position (0, 1, 0) - just above the ground
    if (this.animated) {
      this.structureService.buildStructureWithAnimation(key, { x: 0, y: 1, z: 0 }, 50);
    } else {
      this.structureService.buildStructure(key, { x: 0, y: 1, z: 0 });
    }
  }
}