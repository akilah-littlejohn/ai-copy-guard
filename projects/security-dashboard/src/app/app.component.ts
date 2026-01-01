import { Component } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LucideAngularModule, Activity, Shield, AlertTriangle, FileCode, CheckCircle, Terminal } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-slate-950 relative overflow-hidden">
      <!-- Cyber Grid Background -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#3b82f615,transparent)]"></div>
      
      <div class="max-w-7xl mx-auto p-8 relative z-10">
         <app-dashboard></app-dashboard>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'security-dashboard';
}
