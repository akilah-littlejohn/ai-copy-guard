import { Injectable, signal, computed, effect } from '@angular/core';
import { GeminiService } from './gemini.service';
import { LogEntry, ScanIntent, EventSource, ScanResult } from './types';

@Injectable({
    providedIn: 'root'
})
export class GatewayStore {
    private channel = new BroadcastChannel('copyguard_sync');

    readonly logs = signal<LogEntry[]>([]);

    readonly isAnalyzing = signal<boolean>(false);
    readonly lastscanResult = signal<ScanResult | null>(null);

    readonly stats = computed(() => {
        const currentLogs = this.logs();
        return {
            totalScans: currentLogs.length,
            violations: currentLogs.filter(l => l.intent === 'POTENTIAL_DATA_LEAK' || l.intent === 'PROMPT_INJECTION_ATTEMPT').length,
            learningInterventions: currentLogs.filter(l => l.intent === 'LEARN_SNIPPET').length
        };
    });

    readonly systemStatus = computed(() => {
        const violations = this.stats().violations;
        if (violations > 0) return { status: 'CRITICAL_ALERT', message: 'Active Security Threat Detected' };
        return { status: 'OK', message: 'System Monitor Active' };
    });

    constructor(private gemini: GeminiService) {
        this.setupSync();
        this.seedDemoData();
    }

    async analyzeAndProcess(text: string, source: EventSource): Promise<ScanResult> {
        this.isAnalyzing.set(true);

        try {
            const result = await this.gemini.analyzeCodeSnippet(text);
            this.lastscanResult.set(result);


            const entry: LogEntry = {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                source: source,
                intent: result.intent,
                snippetPreview: text.substring(0, 50),
                actionTaken: result.action,
                riskLevel: result.intent === 'POTENTIAL_DATA_LEAK' ? 'CRITICAL' : 'INFO',
                latencyMs: Date.now() - result.timestamp,
                tokensUsed: Math.floor(text.length / 4),
                reasoning: result.reasoning,
                safe_snippet: result.sanitizedCode
            };

            this.addLog(entry);
            return result;

        } finally {
            this.isAnalyzing.set(false);
        }
    }

    async generateCode(prompt: string): Promise<string> {
        return this.gemini.generateCode(prompt);
    }

    private seedDemoData() {
        if (this.logs().length > 0) return;

        const demoLogs: LogEntry[] = [
            {
                id: 'demo-1',
                timestamp: Date.now() - 1000 * 60 * 5,
                source: 'IDE',
                intent: 'POTENTIAL_DATA_LEAK',
                snippetPreview: 'const awsKey = "AKIAIOSFODNN7EXAMPLE";',
                actionTaken: 'BLOCK',
                riskLevel: 'CRITICAL',
                latencyMs: 450,
                tokensUsed: 120,
                reasoning: 'Detected pattern matching AWS Access Key ID (AKIA...). This is a high-confidence credential leak.'
            },
            {
                id: 'demo-2',
                timestamp: Date.now() - 1000 * 60 * 15,
                source: 'BROWSER',
                intent: 'SAFE_BOILERPLATE',
                snippetPreview: 'import React, { useState } from "react";',
                actionTaken: 'ALLOW',
                riskLevel: 'INFO',
                latencyMs: 320,
                tokensUsed: 45,
                reasoning: 'Code consists of standard library imports and React component structure. No secrets or PII detected.'
            },
            {
                id: 'demo-3',
                timestamp: Date.now() - 1000 * 60 * 45,
                source: 'IDE',
                intent: 'LEARN_SNIPPET',
                snippetPreview: 'function quickSort(arr) { if (arr.length <= 1) ...',
                actionTaken: 'EDUCATE',
                riskLevel: 'INFO',
                latencyMs: 512,
                tokensUsed: 200,
                reasoning: 'Identified complex algorithmic logic (QuickSort). Recommended "Educational Mode" to explain time complexity.'
            }
        ];

        this.logs.set(demoLogs);
    }

    private addLog(entry: LogEntry) {
        this.updateLocalLog(entry);
        this.broadcast(entry);
    }

    private setupSync() {
        setInterval(async () => {
            try {
                const logs = await this.gemini.fetchLogs(); // Need to add this to service
                this.mergeLogs(logs);
            } catch (e) {
                // silent fail
            }
        }, 2000);
    }

    private updateLocalLog(entry: LogEntry) {
        this.logs.update(current => [entry, ...current]);
    }

    private mergeLogs(remoteLogs: LogEntry[]) {
        const currentIds = new Set(this.logs().map(l => l.id));
        const newLogs = remoteLogs.filter(l => !currentIds.has(l.id));

        if (newLogs.length > 0) {
            // Add new logs to the top
            this.logs.update(current => [...newLogs.reverse(), ...current]);
        }
    }

    private broadcast(entry: LogEntry) {
        this.gemini.uploadLog(entry);
    }
}
