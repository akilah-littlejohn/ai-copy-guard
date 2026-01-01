import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { GatewayStore, EventSource } from 'gateway-brain';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-simulator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    template: `
    <div class="h-full bg-[#1e1e1e] text-slate-300 flex flex-col font-sans overflow-hidden">
      
      <!-- Top Bar -->
      <div class="h-8 bg-[#333333] flex items-center px-4 justify-between border-b border-[#1e1e1e]">
          <span class="text-xs text-slate-400">AI CopyGuard IDE</span>
          <div class="flex space-x-2">
               <span class="w-3 h-3 rounded-full bg-red-500/50"></span>
               <span class="w-3 h-3 rounded-full bg-yellow-500/50"></span>
               <span class="w-3 h-3 rounded-full bg-green-500/50"></span>
          </div>
      </div>

      <div class="flex-1 flex overflow-hidden">
          
          <!-- LEFT: Chat Panel -->
          <div class="w-1/3 border-r border-[#333333] flex flex-col bg-[#252526]">
              <div class="p-2 bg-[#333333] text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <lucide-icon name="message-square" class="w-3 h-3"></lucide-icon>
                  <span>AI Assistant</span>
              </div>
              
              <!-- Messages -->
              <div class="flex-1 overflow-y-auto p-4 space-y-4">
                  @for (msg of messages(); track $index) {
                      <div class="flex flex-col space-y-1" [class.items-end]="msg.role === 'user'">
                          <span class="text-[10px] text-slate-500 uppercase">{{ msg.role }}</span>
                          <div class="p-2 rounded-lg text-sm max-w-[90%]"
                               [ngClass]="{
                                  'bg-[#007acc] text-white': msg.role === 'user',
                                  'bg-[#3e3e42] text-slate-200': msg.role === 'ai'
                               }">
                              {{ msg.text }}
                          </div>
                      </div>
                  }
                  @if (isAiTyping()) {
                      <div class="flex items-center space-x-1 p-2">
                          <span class="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                          <span class="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                          <span class="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                      </div>
                  }
              </div>

              <!-- Input -->
              <div class="p-4 border-t border-[#333333] bg-[#1e1e1e]">
                  <div class="relative">
                      <input 
                          [formControl]="chatInput"
                          (keydown.enter)="sendMessage()"
                          type="text" 
                          placeholder="Ask AI to generate code..." 
                          class="w-full bg-[#333333] text-slate-200 rounded p-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[#007acc]">
                      <button (click)="sendMessage()" class="absolute right-2 top-2 text-slate-400 hover:text-white">
                          <lucide-icon name="send" class="w-4 h-4"></lucide-icon>
                      </button>
                  </div>
                  <div class="flex space-x-2 mt-2">
                      <button (click)="chatInput.setValue('Generate AWS Secrets'); sendMessage()" class="text-[10px] px-2 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50">Demo Leak</button>
                      <button (click)="chatInput.setValue('Write a QuickSort'); sendMessage()" class="text-[10px] px-2 py-1 bg-sky-900/30 text-sky-400 rounded hover:bg-sky-900/50">Demo Learn</button>
                  </div>
              </div>
          </div>

          <!-- RIGHT: Editor Panel -->
          <div class="flex-1 flex flex-col bg-[#1e1e1e]">
              <div class="h-9 bg-[#2d2d2d] flex items-center px-4 space-x-1 overflow-x-auto">
                   <div class="px-3 py-1 bg-[#1e1e1e] text-yellow-500 text-xs border-t-2 border-yellow-500 flex items-center space-x-2">
                       <lucide-icon name="file-code" class="w-3 h-3"></lucide-icon>
                       <span>main.ts</span>
                   </div>
              </div>
              <div class="flex-1 relative group">
                  <textarea 
                      [value]="editorContent()"
                      readonly
                      class="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-none focus:outline-none"></textarea>
                  
                  <!-- Watermark -->
                  <div class="absolute bottom-4 right-4 text-slate-700 text-xs font-mono pointer-events-none">
                      Ln 12, Col 45 | UTF-8 | TypeScript
                  </div>
              </div>
          </div>
      
      </div>
    </div>
    `
})
export class SimulatorComponent {
    store = inject(GatewayStore);


    chatInput = new FormControl('');
    messages = signal<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: 'Hello! I am your AI Assistant. Ask me to generate code.' }
    ]);
    editorContent = signal('// Editor is empty');
    isAiTyping = signal(false);

    context: EventSource = 'IDE';

    async sendMessage() {
        const val = this.chatInput.value;
        if (!val) return;


        this.addMessage('user', val);
        this.chatInput.reset();
        this.isAiTyping.set(true);


        try {
            const generatedCode = await this.store.generateCode(val);

            const result = await this.store.analyzeAndProcess(generatedCode, this.context);

            this.isAiTyping.set(false);

            if (result.intent === 'POTENTIAL_DATA_LEAK') {
                this.addMessage('ai', '🛑 [BLOCKED BY GUARD] The generated code contained secrets.');
            } else if (result.intent === 'PROMPT_INJECTION_ATTEMPT') {
                this.addMessage('ai', '🛑 [BLOCKED BY GUARD] Unsafe prompt detected.');
            } else {
                this.addMessage('ai', 'Here is the code you requested:');
                this.editorContent.set(generatedCode);
            }

        } catch (e) {
            this.isAiTyping.set(false);
            this.addMessage('ai', 'Error generating code. Please try again.');
        }
    }
    addMessage(role: 'user' | 'ai', text: string) {
        this.messages.update(m => [...m, { role, text }]);
    }
}
