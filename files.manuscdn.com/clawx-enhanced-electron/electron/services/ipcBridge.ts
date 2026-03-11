/**
 * IPC Bridge
 * Facilitates communication between OpenClaw and OpenCode processes
 * Supports WebSocket → HTTP → stdin/stdout fallback
 */
import { EventEmitter } from "events";
import { OpenClawManager } from "./openclawManager";
import { OpenCodeManager } from "./opencodeManager";
import { Logger } from "../utils/logger";

export class IPCBridge extends EventEmitter {
  private logger: Logger;
  private openclawManager: OpenClawManager;
  private opencodeManager: OpenCodeManager;

  constructor(openclawManager: OpenClawManager, opencodeManager: OpenCodeManager) {
    super();
    this.logger = new Logger("ipc-bridge");
    this.openclawManager = openclawManager;
    this.opencodeManager = opencodeManager;
  }

  /**
   * Send a message from one process to another
   */
  async send(target: "openclaw" | "opencode", message: string): Promise<string> {
    this.logger.info(`Bridging message to ${target}: ${message.substring(0, 100)}`);

    if (target === "opencode") {
      return this.opencodeManager.sendCommand(message);
    } else {
      // For OpenClaw, use the HTTP API
      try {
        const response = await fetch("http://localhost:8766/api/v1/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        if (response.ok) {
          const result = await response.json();
          return result.response || "";
        }
        throw new Error(`HTTP ${response.status}`);
      } catch (err: any) {
        this.logger.error(`Failed to bridge message to ${target}:`, err);
        throw err;
      }
    }
  }

  /**
   * Check bridge connectivity
   */
  async checkConnectivity(): Promise<{ openclaw: boolean; opencode: boolean }> {
    const results = { openclaw: false, opencode: false };

    try {
      const r1 = await fetch("http://localhost:8766/health");
      results.openclaw = r1.ok;
    } catch { /* not connected */ }

    try {
      const r2 = await fetch("http://localhost:9090/health");
      results.opencode = r2.ok;
    } catch { /* not connected */ }

    return results;
  }
}
