import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCardComponent } from '../ui/metric-card.component';
import { GatewayStore, DatadogService } from 'gateway-brain';
import { DatadogWidgetComponent } from './datadog-widget.component';
import { LucideAngularModule, Activity, AlertTriangle, CheckCircle, FileCode, Terminal } from 'lucide-angular';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, MetricCardComponent, LucideAngularModule, DatadogWidgetComponent],
    template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Security Overview</h1>
            <p class="text-slate-400 mt-1">Real-time threat monitoring and policy enforcement.</p>
        </div>
        
        <!-- Status Monitor Widget -->
         <div class="flex items-center space-x-4 px-4 py-2 rounded-xl border transition-all duration-500"
             [ngClass]="{
                'bg-emerald-500/10 border-emerald-500/20': store.systemStatus().status === 'OK',
                'bg-red-500/10 border-red-500/20 animate-pulse': store.systemStatus().status !== 'OK'
             }">
            <div class="w-3 h-3 rounded-full shadow-lg shadow-current"
                 [ngClass]="{
                    'bg-emerald-500': store.systemStatus().status === 'OK',
                    'bg-red-500': store.systemStatus().status !== 'OK'
                 }"></div>
            <div class="flex flex-col">
                <span class="text-xs font-bold uppercase tracking-wider opacity-75"
                     [ngClass]="{
                        'text-emerald-400': store.systemStatus().status === 'OK',
                        'text-red-400': store.systemStatus().status !== 'OK'
                     }">
                    Status Monitor
                </span>
                <span class="text-sm font-bold text-white">
                    {{ store.systemStatus().message }}
                </span>
            </div>
         </div>
      </div>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-metric-card 
            title="Total Scans" 
            [value]="store.stats().totalScans" 
            iconName="activity">
        </app-metric-card>
        
        <app-metric-card 
            title="Policy Violations" 
            [value]="store.stats().violations" 
            iconName="alert-triangle"
            [trend]="store.stats().violations > 0 ? '+Active' : ''" 
            class="text-red-400"> 
        </app-metric-card>

        <app-metric-card 
            title="Learning Moments" 
            [value]="store.stats().learningInterventions" 
            iconName="check-circle">
        </app-metric-card>
      </div>

      <!-- Recent Activity Log -->
      <div class="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div class="p-6 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
            <h3 class="font-bold text-white">Recent Security Events</h3>
            <button class="text-xs text-sky-400 hover:text-sky-300 font-medium">View All Logs</button>
        </div>
        <div class="divide-y divide-slate-800/50">
           @for (log of store.logs(); track log.id) {
               <div class="cursor-pointer group" (click)="toggleLog(log.id)">
                   <div class="p-4 hover:bg-slate-800/30 transition-colors flex items-center justify-between">
                       <div class="flex items-center space-x-4">
                           <div class="p-2 rounded-lg bg-slate-800 border border-slate-700 group-hover:border-slate-600 transition-colors">
                               <lucide-icon [name]="log.source === 'IDE' ? 'terminal' : 'file-code'" class="w-4 h-4 text-slate-400"></lucide-icon>
                           </div>
                           <div>
                               <div class="flex items-center space-x-2">
                                   <span class="font-medium text-slate-200">{{ log.intent }}</span>
                                   
                                   @if (log.riskLevel === 'CRITICAL') {
                                       <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20">CRITICAL</span>
                                   } @else if (log.riskLevel === 'HIGH') {
                                       <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/20">HIGH</span>
                                   } @else {
                                       <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-400 border border-slate-600">Info</span>
                                   }
                               </div>
                               <div class="text-sm text-slate-500 mt-0.5 font-mono line-clamp-1 opacity-75">
                                   {{ log.snippetPreview }}
                               </div>
                           </div>
                       </div>
                       <div class="text-right">
                           <div class="text-xs text-slate-500">{{ log.timestamp | date:'shortTime' }}</div>
                           <div class="text-xs font-medium mt-1" 
                                [class.text-emerald-400]="log.actionTaken === 'ALLOW'"
                                [class.text-red-400]="log.actionTaken === 'BLOCK' || log.actionTaken === 'REDACT'"
                                [class.text-sky-400]="log.actionTaken === 'EDUCATE'">
                               {{ log.actionTaken }}
                           </div>
                       </div>
                   </div>
                   
                   <!-- JSON Inspector Expansion -->
                   @if (expandedLogId() === log.id) {
                       <div class="px-4 pb-4 pt-0 bg-slate-800/20 border-b border-slate-800/50 animate-in slide-in-from-top-2 duration-200">
                            <div class="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs">
                                <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                                    <span class="text-sky-400 font-bold">AI Analysis Inspector</span>
                                    <span class="text-slate-500">Latency: {{ log.latencyMs }}ms</span>
                                </div>
                                <div class="text-slate-300">
                                    <span class="text-emerald-500">"reasoning"</span>: <span class="text-amber-200">"{{ log.reasoning || 'No analysis details available.' }}"</span>
                                </div>
                            </div>
                       </div>
                   }
                </div>
           } @empty {
               <div class="p-12 text-center text-slate-500">
                   <lucide-icon name="check-circle" class="w-12 h-12 mx-auto mb-3 opacity-20"></lucide-icon>
                   <p>No security events recorded yet.</p>
               </div>
           }
        </div>
        </div>
      
      <div class="mt-6 h-96">
        <app-datadog-widget></app-datadog-widget>
      </div>
    </div>

  `
})
export class DashboardComponent implements OnInit {
    store = inject(GatewayStore);
    dd = inject(DatadogService);

    expandedLogId = signal<string | null>(null);

    ngOnInit() {
        this.dd.trackMetric('dashboard.view', 1);
        this.dd.log('Security Dashboard Mounted', 'info');

        this.triggerConfetti();
    }

    triggerConfetti() {
        import('canvas-confetti').then((confetti) => {
            confetti.default({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10b981', '#3b82f6', '#6366f1']
            });
        });
    }

    toggleLog(id: string) {
        if (this.expandedLogId() === id) {
            this.expandedLogId.set(null);
        } else {
            this.expandedLogId.set(id);
        }
    }
}
