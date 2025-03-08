import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BlockService } from '../../services/block.service';
import { Block, BlockType, BLOCK_COLORS } from '../../models/block.model';
import { StructureControlsComponent } from '../structure-controls/structure-controls.component';
import { TextureService } from '../../services/texture.service';

@Component({
  selector: 'app-minecraft-scene',
  standalone: true,
  template: `
    <div class="controls">
      <div>
        <p>Left click: Add block</p>
        <p>Right click: Remove block</p>
        <p>Mouse wheel: Zoom in/out</p>
        <p>Middle mouse: Rotate view</p>
      </div>
      <button (click)="clearScene()">Clear Scene</button>
    </div>
    
    <app-structure-controls></app-structure-controls>
    
    <div class="block-selector">
      <div *ngFor="let type of blockTypes" 
           [style.backgroundColor]="getColorHex(type)"
           [class.selected]="selectedBlockType === type"
           class="block-option"
           (click)="selectBlockType(type)">
           <span class="block-name">{{type}}</span>
      </div>
    </div>
    
    <canvas #rendererCanvas></canvas>
  `,
  imports: [
    CommonModule,
    StructureControlsComponent,
    FormsModule
  ]
})
export class MinecraftSceneComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererCanvas') rendererCanvas!: ElementRef;
  
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  controls!: OrbitControls;
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  blockMeshes: { [id: string]: THREE.Mesh } = {};
  blockTypes = Object.values(BlockType);
  selectedBlockType = BlockType.BRICK;
  
  constructor(private blockService: BlockService,
      private textureService: TextureService) {}
  
  ngOnInit() {
    this.blockService.blocks$.subscribe(blocks => {
      this.updateScene(blocks);
    });
  }
  
  ngAfterViewInit() {
    this.initThree();
    this.animate();
  }
  
  initThree() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.rendererCanvas.nativeElement,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(directionalLight);
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(20, 20);
    this.scene.add(gridHelper);
    
    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    
    // Add event listeners
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  
  updateScene(blocks: Block[]) {
    // Remove blocks that are no longer in the service
    const currentBlockIds = blocks.map(block => block.id);
    Object.keys(this.blockMeshes).forEach(id => {
      if (!currentBlockIds.includes(id)) {
        this.scene.remove(this.blockMeshes[id]);
        delete this.blockMeshes[id];
      }
    });
    
    // Add new blocks
    blocks.forEach(block => {
      if (!this.blockMeshes[block.id]) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = this.textureService.getMaterialForBlockType(block.type);
        
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(block.position.x, block.position.y, block.position.z);
        mesh.userData = { id: block.id, type: block.type };
        
        this.scene.add(mesh);
        this.blockMeshes[block.id] = mesh;
      }
    });
  }
  
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(Object.values(this.blockMeshes));
    
    if (event.button === 0) { // Left click - add block
      if (intersects.length > 0) {
        const intersect = intersects[0];
        // Ensure the face property is defined before accessing it
        if (!intersect.face) {
          return;
        }
        const normal = intersect.face.normal.clone();
        normal.transformDirection(intersect.object.matrixWorld);
        
        const position = intersect.point.clone().add(normal.multiplyScalar(0.5));
        position.x = Math.round(position.x);
        position.y = Math.round(position.y);
        position.z = Math.round(position.z);
        
        const id = `${position.x}_${position.y}_${position.z}`;
        
        this.blockService.addBlock({
          id,
          position: { x: position.x, y: position.y, z: position.z },
          type: this.selectedBlockType
        });
      }
    } else if (event.button === 2) { // Right click - remove block
      if (intersects.length > 0) {
        const intersect = intersects[0];
        const id = intersect.object.userData['id'];
        this.blockService.removeBlock(id);
      }
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event) {
    event.preventDefault();
  }
  
  clearScene() {
    this.blockService.clearBlocks();
  }
  
  selectBlockType(type: BlockType) {
    this.selectedBlockType = type;
  }
  
  getColorHex(type: BlockType): string {
    const colorValue = BLOCK_COLORS[type];
    return `#${colorValue.toString(16).padStart(6, '0')}`;
  }
}