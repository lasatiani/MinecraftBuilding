// language: typescript
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MinecraftSceneComponent } from './app/components/minecraft-scene/minecraft-scene.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MinecraftSceneComponent],
  template: `
    <app-minecraft-scene></app-minecraft-scene>
  `,
})
export class App {
  title = 'Minecraft Style Builder';
}

bootstrapApplication(App, {
  providers: [
    provideAnimations()
  ]
});