import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative overflow-hidden bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-all duration-300 group hover:shadow-lg hover:shadow-sky-500/10 backdrop-blur-sm">
      <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div class="relative z-10">
        <div class="flex items-start justify-between mb-4">
            <div class="p-2 bg-slate-800/80 rounded-lg group-hover:bg-sky-500/20 group-hover:text-sky-400 transition-colors border border-slate-700/50 group-hover:border-sky-500/30">
            <lucide-icon [name]="iconName()" class="w-5 h-5"></lucide-icon>
            </div>
            @if (trend()) {
                <span class="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                    {{ trend() }}
                </span>
            }
        </div>
        <div class="space-y-1">
            <span class="text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors">{{ title() }}</span>
            <div class="text-3xl font-bold text-white tracking-tight" 
                 [class.text-transparent]="false" 
                 [class.bg-clip-text]="false" 
                 [class.bg-gradient-to-r]="false" 
                 [class.from-white]="false" 
                 [class.to-slate-400]="false">
                 {{ value() }}
            </div>
        </div>
      </div>
    </div>
  `
})
export class MetricCardComponent {
  title = input.required<string>();
  value = input.required<string | number>();
  iconName = input.required<string>();
  trend = input<string>();
}
