import { Component } from '@angular/core';
import { SimulatorComponent } from './components/simulator/simulator.component';
import { LucideAngularModule, Terminal } from 'lucide-angular';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [SimulatorComponent, LucideAngularModule],
    template: `<app-simulator></app-simulator>`,
    styles: [`
    :host {
      display: block;
      height: 100vh;
      background-color: #1e1e1e;
    }
  `]
})
export class AppComponent {
    title = 'ide-guard';
}
