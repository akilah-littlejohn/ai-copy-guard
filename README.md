# AI CopyGuard Monorepo

This workspace implements the AI CopyGuard "Live Dashboard Suite", simulating a secure development environment where AI monitors and sanitizes copied code.

## Architecture

The project is structured as a Monorepo with a shared brain and three distinct applications:

*   **`projects/gateway-brain`**: Shared Core Logic (Signals Store, Gemini Service, Types).
*   **`projects/browser-guard` (Port 4201)**: Simulates a Chrome Extension popup with the `GuardModal`.
*   **`projects/ide-guard` (Port 4202)**: Simulates a VS Code Extension panel with inline notifications.
*   **`projects/security-dashboard` (Port 4200)**: A centralized "God View" dashboard for security teams.

## How to Start

To launch the entire suite (all 3 applications simultaneously), run:

```bash
npm start
```

This will run the `start:suite` script, which concurrently serves:
- **Security Dashboard**: [http://localhost:4200](http://localhost:4200)
- **Browser Guard**: [http://localhost:4201](http://localhost:4201)
- **IDE Guard**: [http://localhost:4202](http://localhost:4202)

## Usage Demo

1.  Open all 3 URLs in separate browser windows/tabs side-by-side.
2.  **IDE Guard**: Use the "Simulator" to trigger a "Leak" or "Learn" event.
3.  **Browser Guard**: Use the "Simulator" to trigger a copy event and see the `GuardModal` appear.
4.  **Security Dashboard**: Watch the metrics and logs update in real-time across all applications (synced via `GatewayStore`).
