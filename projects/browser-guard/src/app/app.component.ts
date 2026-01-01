import { Component } from '@angular/core';
import { SimulatorComponent } from './components/simulator/simulator.component';
import { GuardModalComponent } from './components/guard-modal/guard-modal.component';
import { LucideAngularModule, Activity, Shield, Copy, AlertTriangle, FileCode, Lock, CheckCircle, X } from 'lucide-angular';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [SimulatorComponent, GuardModalComponent, LucideAngularModule],
    template: `
    <app-guard-modal></app-guard-modal>
    <app-simulator></app-simulator>
  `,
    styles: [`
    :host {
      display: block;
      height: 100vh;
      background-color: #020617; /* slate-950 */
    }
  `]
})
export class AppComponent {
    title = 'browser-guard';
}
