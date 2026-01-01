import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ScanIntent, ScanResult, PolicyAction, LogEntry } from './types';

@Injectable({
    providedIn: 'root'
})
export class GeminiService {
    private http = inject(HttpClient);
    private readonly PROXY_URL = 'http://localhost:3000/api/analyze';
    private readonly GENERATE_URL = 'http://localhost:3000/api/generate';

    constructor() { }

    async generateCode(prompt: string): Promise<string> {
        try {
            const res: any = await firstValueFrom(this.http.post(this.GENERATE_URL, { prompt }));
            return res.code;
        } catch (e) {
            console.error('Generation failed', e);
            return '// Generation failed. Is the backend running?';
        }
    }

    async uploadLog(entry: LogEntry) {
        try {
            await firstValueFrom(this.http.post('http://localhost:3000/api/log', {
                type: 'log',
                attributes: entry,
                message: `SCAN_RESULT: ${entry.intent}`,
                level: 'info'
            }));
        } catch (e) {
            console.error('Failed to upload log', e);
        }
    }

    async fetchLogs(): Promise<any[]> {
        try {
            return await firstValueFrom(this.http.get<any[]>('http://localhost:3000/api/logs'));
        } catch (e) {
            return [];
        }
    }

    async analyzeCodeSnippet(code: string): Promise<ScanResult> {
        try {
            const response: any = await firstValueFrom(
                this.http.post(this.PROXY_URL, { code })
            );

            const intent = response.intent as ScanIntent;
            const action = this.mapIntentToAction(intent);

            return {
                intent: intent,
                confidence: response.confidence || 0.9,
                reasoning: response.reasoning || "AI Analysis Complete (via Vertex AI)",
                action: action,
                sanitizedCode: response.safe_snippet,
                originalContent: code,
                timestamp: Date.now()
            };

        } catch (error) {
            console.error('Gemini Proxy Analysis Failed', error);
            console.error('Gemini Proxy Analysis Failed', error);
            return {
                intent: 'SAFE_BOILERPLATE',
                confidence: 0,
                reasoning: "Analysis Failed: " + JSON.stringify(error),
                action: 'ALLOW',
                originalContent: code,
                timestamp: Date.now()
            };
        }
    }

    private mapIntentToAction(intent: ScanIntent): PolicyAction {
        switch (intent) {
            case 'POTENTIAL_DATA_LEAK': return 'REDACT';
            case 'PROMPT_INJECTION_ATTEMPT': return 'BLOCK';
            case 'LEARN_SNIPPET': return 'EDUCATE';
            case 'SAFE_BOILERPLATE': return 'ALLOW';
            default: return 'ALLOW';
        }
    }

    async transformContent(code: string, intent: ScanIntent): Promise<string> {
        if (intent === 'POTENTIAL_DATA_LEAK') {
            return code.replace(/(key|token|password|secret)\s*[:=]\s*['"][a-zA-Z0-9\-_]+['"]/gi, "$1: '<REDACTED_SECRET>'");
        }
        return code;
    }
}
