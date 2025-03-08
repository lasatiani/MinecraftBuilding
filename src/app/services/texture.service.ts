import { Injectable } from "@angular/core";
import * as THREE from "three";
import {
  BlockType,
  BLOCK_TEXTURES,
  BlockTextureConfig,
  AllSidesTexture
} from "../models/block.model";
import imageToBase64  from "image-to-base64";

@Injectable({
  providedIn: "root",
})
export class TextureService {
  private textureLoader = new THREE.TextureLoader();
  private textureCache: { [url: string]: THREE.Texture } = {};
  private materialCache: { [key: string]: THREE.Material | THREE.Material[] } =
    {};

  constructor() {}

  private loadTexture(url: string): THREE.Texture {
    if (!this.textureCache[url]) {
       const texture = this.textureLoader.load(url);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      this.textureCache[url] = texture;
    }
    return this.textureCache[url];
  }

  getMaterialForBlockType(type: BlockType): THREE.Material | THREE.Material[] {
    const cacheKey = type;

    if (this.materialCache[cacheKey]) {
      return this.materialCache[cacheKey];
    }

    const textureConfig = BLOCK_TEXTURES[type];
    let material: THREE.Material | THREE.Material[];

    // Check if it's an "all sides" texture configuration
    if ("all" in textureConfig) {
      // Same texture for all sides
      const texture = this.loadTexture(textureConfig.all);
      material = new THREE.MeshLambertMaterial({ map: texture });
    } else {
      // Different textures for different sides
      const materials: THREE.Material[] = [];

      // Order: right, left, top, bottom, front, back
      for (let i = 0; i < 6; i++) {
        let textureUrl: string;

        if (i === 2) {
          // top
          textureUrl = textureConfig.top;
        } else if (i === 3) {
          // bottom
          textureUrl =
            "bottom" in textureConfig
              ? textureConfig.bottom
              : textureConfig.side;
        } else {
          // sides
          textureUrl = textureConfig.side;
        }

        const texture = this.loadTexture(textureUrl);
        materials.push(new THREE.MeshLambertMaterial({ map: texture }));
      }

      material = materials;
    }

    this.materialCache[cacheKey] = material;
    return material;
  }
}
