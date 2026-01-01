import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { GatewayStore, EventSource } from 'gateway-brain';
import { LucideAngularModule } from 'lucide-angular';
@Component({
    selector: 'app-simulator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    template: `
    <div class="h-full bg-slate-950 p-6 flex flex-col space-y-6 overflow-y-auto">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-white tracking-tight">Browser Agent</h1>
            <p class="text-slate-400 text-sm">Simulating Chrome Extension Context</p>
          </div>
          
          <div class="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-500">
             PID: 4201
          </div>
      </div>

      <!-- Code Input -->
      <div class="flex-1 space-y-4">
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-1 overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/50 transition-all flex flex-col h-96">
              <div class="px-4 py-2 border-b border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span>stackoverflow_snippet.js</span>
                  <span>{{ codeControl.value?.length || 0 }} chars</span>
              </div>
              <textarea 
                  [formControl]="codeControl"
                  class="flex-1 w-full bg-slate-950 text-slate-300 p-4 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-700"
                  placeholder="// Paste code here to simulate a browser copy event..."></textarea>
          </div>

          <div class="flex justify-between items-center">
               <div class="flex space-x-2">
                   <button (click)="loadPreset('SECRET')" class="text-xs px-2 py-1 bg-red-900/20 text-red-400 border border-red-900/30 rounded hover:bg-red-900/40">Leak</button>
                   <button (click)="loadPreset('CODE')" class="text-xs px-2 py-1 bg-sky-900/20 text-sky-400 border border-sky-900/30 rounded hover:bg-sky-900/40">Learn</button>
               </div>

               <button (click)="analyze()" 
                       [disabled]="store.isAnalyzing()"
                       class="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                   @if (store.isAnalyzing()) {
                       <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                       <span>Scanning...</span>
                   } @else {
                       <lucide-icon name="copy" class="w-4 h-4"></lucide-icon>
                       <span>Simulate Copy</span>
                   }
               </button>
          </div>
      </div>
    </div>
    `
})
export class SimulatorComponent implements OnInit {
    private destroyRef = inject(DestroyRef);
    store = inject(GatewayStore);
    codeControl = new FormControl('');

    context: EventSource = 'BROWSER';

    ngOnInit() {
        this.codeControl.valueChanges.pipe(
            takeUntilDestroyed(this.destroyRef),
            debounceTime(1000),
            distinctUntilChanged(),
            filter((value: string | null) => !!value && value.length > 5) // Basic noise filter
        ).subscribe(() => {
            this.analyze();
        });
    }

    loadPreset(type: 'SECRET' | 'CODE') {
        const presets = {
            SECRET: 'const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";\nconst AWS_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";',
            CODE: 'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  // ... implementation ...\n}'
        };
        this.codeControl.setValue(presets[type]);
    }

    async analyze() {
        if (!this.codeControl.value) return;

        await this.store.analyzeAndProcess(
            this.codeControl.value,
            this.context
        );
        // Modal will open automatically via signal in GuardModalComponent
    }
}
