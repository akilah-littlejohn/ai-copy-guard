import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewayStore, ScanIntent, ScanResult } from 'gateway-brain';
import { LucideAngularModule, Shield, AlertTriangle, CheckCircle, FileCode, Lock, X } from 'lucide-angular';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-guard-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" (click)="close()"></div>

        <!-- Modal Content -->
        <div class="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transform transition-all"
             [ngClass]="{
                'border-red-500/50 shadow-red-500/20': intent() === 'POTENTIAL_DATA_LEAK',
                'border-orange-500/50 shadow-orange-500/20': intent() === 'PROMPT_INJECTION_ATTEMPT',
                'border-sky-500/50 shadow-sky-500/20': intent() === 'LEARN_SNIPPET',
                'border-emerald-500/50 shadow-emerald-500/20': intent() === 'SAFE_BOILERPLATE'
             }">
          
          <!-- Header -->
          <div class="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-start">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                   [ngClass]="{
                      'bg-red-500/20 text-red-400': intent() === 'POTENTIAL_DATA_LEAK',
                      'bg-orange-500/20 text-orange-400': intent() === 'PROMPT_INJECTION_ATTEMPT',
                      'bg-sky-500/20 text-sky-400': intent() === 'LEARN_SNIPPET',
                      'bg-emerald-500/20 text-emerald-400': intent() === 'SAFE_BOILERPLATE'
                   }">
                   <lucide-icon [name]="getIcon()" class="w-6 h-6"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white tracking-tight">{{ getTitle() }}</h3>
                <div class="flex items-center space-x-2 mt-1">
                   <span class="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                     Confidence: {{ (result()?.confidence || 0) * 100 | number:'1.0-0' }}%
                   </span>
                </div>
              </div>
            </div>
            <button (click)="close()" class="text-slate-500 hover:text-white transition-colors">
              <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
             <!-- Reasoning -->
             <div class="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                <p class="text-sm text-slate-300 leading-relaxed">
                   <span class="font-bold text-slate-400 uppercase text-xs tracking-wider block mb-1">AI Reasoning</span>
                   {{ result()?.reasoning }}
                </p>
             </div>

             <!-- Snippet Preview (Blurred if blocked) -->
             @if (intent() === 'POTENTIAL_DATA_LEAK') {
                 <div class="relative rounded-lg overflow-hidden bg-slate-950 border border-red-900/30">
                     <pre class="p-3 text-xs text-red-300/50 blur-sm select-none font-mono">{{ result()?.originalContent }}</pre>
                     <div class="absolute inset-0 flex items-center justify-center">
                         <div class="bg-slate-900/90 px-3 py-1.5 rounded-full border border-red-500/30 text-red-400 text-xs font-bold flex items-center space-x-2">
                             <lucide-icon name="lock" class="w-3 h-3"></lucide-icon>
                             <span>Content Redacted</span>
                         </div>
                     </div>
                 </div>
             }
          </div>

          <!-- Footer Actions -->
          <div class="p-4 bg-slate-950 border-t border-slate-800 flex justify-end space-x-3">
             <button (click)="close()" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                Cancel
             </button>
             
             @if (intent() === 'POTENTIAL_DATA_LEAK') {
                 <button (click)="copySanitized()" class="px-4 py-2 rounded-lg text-sm font-bold bg-white text-slate-900 hover:bg-slate-200 transition-colors flex items-center space-x-2">
                    <lucide-icon name="shield" class="w-4 h-4"></lucide-icon>
                    <span>Copy Safe Version</span>
                 </button>
             } @else if (intent() === 'LEARN_SNIPPET') {
                 <button class="px-4 py-2 rounded-lg text-sm font-bold bg-sky-500 text-white hover:bg-sky-400 transition-colors flex items-center space-x-2">
                    <lucide-icon name="file-code" class="w-4 h-4"></lucide-icon>
                    <span>View Implementation Guide</span>
                 </button>
             } @else if (intent() === 'SAFE_BOILERPLATE') {
                 <button (click)="close()" class="px-4 py-2 rounded-lg text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-400 transition-colors flex items-center space-x-2">
                    <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon>
                    <span>Copy Code</span>
                 </button>
             }
          </div>
        </div>
      </div>
    }
  `
})
export class GuardModalComponent {
  store = inject(GatewayStore);

  // Derived signals
  result = this.store.lastscanResult;
  isOpen = computed(() => !!this.result() && this.result()?.intent !== 'SAFE_BOILERPLATE' && !this.manualClose());
  intent = computed(() => this.result()?.intent);

  manualClose = signal(false);

  constructor() {
    // Reset manual close when new result comes in
    effect(() => {
      if (this.result()) this.manualClose.set(false);
    }, { allowSignalWrites: true });
  }

  close() {
    this.manualClose.set(true);
  }

  copySanitized() {
    const safeCode = this.result()?.sanitizedCode;
    if (safeCode) {
      navigator.clipboard.writeText(safeCode);
      // In a real app we'd show a toast, for now alert is fine for the demo or we can just close
      // But let's verify it worked visually if possible.
      // Using a simple alert for the hackathon demo to be explicit.
      alert('✨ Auto-Fix Applied!\n\nSafe version copied to clipboard.\n(Secrets replaced with environment variables)');
    } else {
      alert('Safe version not available yet.');
    }
    this.close();
  }

  getIcon() {
    switch (this.intent()) {
      case 'POTENTIAL_DATA_LEAK': return 'alert-triangle';
      case 'PROMPT_INJECTION_ATTEMPT': return 'lock';
      case 'LEARN_SNIPPET': return 'file-code';
      default: return 'check-circle';
    }
  }

  getTitle() {
    switch (this.intent()) {
      case 'POTENTIAL_DATA_LEAK': return 'Data Leak Detected';
      case 'PROMPT_INJECTION_ATTEMPT': return 'Unsafe Prompt Blocked';
      case 'LEARN_SNIPPET': return 'Learning Opportunity';
      default: return 'Safe to Copy';
    }
  }
}
