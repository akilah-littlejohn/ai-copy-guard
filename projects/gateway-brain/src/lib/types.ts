export type ScanIntent =
    | 'POTENTIAL_DATA_LEAK'
    | 'PROMPT_INJECTION_ATTEMPT'
    | 'LEARN_SNIPPET'
    | 'SAFE_BOILERPLATE';

export type PolicyAction = 'BLOCK' | 'REDACT' | 'EDUCATE' | 'ALLOW';

export interface ScanResult {
    intent: ScanIntent;
    confidence: number;
    reasoning: string;
    action: PolicyAction;
    sanitizedCode?: string;
    educationalContent?: string;
    originalContent: string;
    timestamp: number;
}

export type EventSource = 'BROWSER' | 'IDE';

export interface LogEntry {
    id: string;
    timestamp: number;
    source: EventSource;
    intent: ScanIntent;
    snippetPreview: string;
    actionTaken: PolicyAction;
    riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
    latencyMs: number;
    tokensUsed: number;
    reasoning?: string;
    safe_snippet?: string;
}

export interface TelemetryMetrics {
    totalScans: number;
    violations: number;
    learningInterventions: number;
    averageLlmLatencyMs: number;
    totalTokenUsage: number;
}

export interface SystemStatus {
    status: 'OK' | 'CRITICAL_ALERT';
    message: string;
}
