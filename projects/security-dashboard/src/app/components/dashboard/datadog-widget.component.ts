import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-datadog-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm h-full flex flex-col group relative hover:border-sky-500/30 transition-all duration-300">
       <!-- Cyber Glow Effect -->
       <div class="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
       
       <div class="relative flex flex-col h-full bg-slate-900/90 rounded-xl">
           <div class="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 class="font-bold text-white flex items-center space-x-2">
                 <img src="https://img.logo.dev/datadog.com?token=pk_test_123" class="w-5 h-5 rounded" alt="DD">
                 <span>Live Command Center</span>
              </h3>
              <div class="flex items-center space-x-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span class="text-[10px] text-emerald-400 font-mono tracking-wider">ONLINE</span>
              </div>
           </div>
           
           <div class="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div class="p-4 rounded-full bg-slate-800/50 border border-slate-700/50 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-400"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              </div>
              
              <div class="space-y-1">
                  <h4 class="text-lg font-bold text-white">Full Telemetry Active</h4>
                  <p class="text-sm text-slate-400 max-w-xs mx-auto">
                    Secure Dashboard sharing is enabled. Launch the external monitor to view real-time log streams and attack vectors.
                  </p>
              </div>

              <a [href]="iframeUrl" target="_blank" 
                 class="mt-4 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-sky-500/20 flex items-center space-x-2">
                 <span>Launch Datadog Monitor</span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
           </div>
       </div>
    </div>
  `
})
export class DatadogWidgetComponent {
    @Input() iframeUrl: string = 'https://us5.datadoghq.com/s/1aea5992-d938-11f0-8e88-86b037d79d1a/kv5-w8s-u2k';
}
