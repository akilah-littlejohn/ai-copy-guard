import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DatadogService {
    private http = inject(HttpClient);
    private readonly LOG_ENDPOINT = 'http://localhost:3000/api/log';

    log(message: string, level: 'info' | 'warn' | 'error' = 'info', attributes: any = {}) {
        this.send({
            type: 'log',
            message,
            level,
            ...attributes
        });
    }

    trackMetric(metricName: string, value: number, tags: string[] = []) {
        this.send({
            type: 'metric',
            metricName,
            value,
            tags
        });
    }

    private send(payload: any) {
        this.http.post(this.LOG_ENDPOINT, payload).subscribe({
            error: (err) => console.warn('Telemetry Failed', err)
        });
    }
}
