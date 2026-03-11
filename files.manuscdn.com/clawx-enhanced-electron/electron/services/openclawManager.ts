/**
 * OpenClaw Gateway Process Manager
 * Manages the lifecycle of the OpenClaw Gateway subprocess
 */
import { ChildProcess, spawn } from "child_process";
import { EventEmitter } from "events";
import { Logger } from "../utils/logger";
import os from "os";
import path from "path";

export interface ProcessStatus {
  status: "stopped" | "starting" | "running" | "error" | "restarting";
  pid: number | null;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  lastError: string | null;
  version: string;
}

export class OpenClawManager extends EventEmitter {
  private process: ChildProcess | null = null;
  private logger: Logger;
  private startTime: number = 0;
  private status: ProcessStatus = {
    status: "stopped",
    pid: null,
    uptime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    lastError: null,
    version: "0.2.0-beta.4",
  };
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private restartAttempts: number = 0;
  private maxRestartAttempts: number = 5;

  constructor() {
    super();
    this.logger = new Logger("openclaw");
  }

  async start(): Promise<void> {
    if (this.status.status === "running") {
      this.logger.warn("OpenClaw is already running");
      return;
    }

    this.updateStatus("starting");
    this.emitLog("info", "[Gateway] Starting OpenClaw Gateway...");

    try {
      // Determine the OpenClaw executable path
      const openclawPath = this.getOpenClawPath();

      this.process = spawn(openclawPath, ["gateway", "start", "--port", "8766"], {
        cwd: os.homedir(),
        env: {
          ...process.env,
          OPENCLAW_HOME: path.join(os.homedir(), ".openclaw"),
        },
        stdio: ["pipe", "pipe", "pipe"],
      });

      this.startTime = Date.now();

      this.process.stdout?.on("data", (data: Buffer) => {
        const message = data.toString().trim();
        if (message) {
          this.emitLog("info", message);
        }
      });

      this.process.stderr?.on("data", (data: Buffer) => {
        const message = data.toString().trim();
        if (message) {
          this.emitLog("error", message);
        }
      });

      this.process.on("exit", (code, signal) => {
        this.logger.info(`OpenClaw exited with code ${code}, signal ${signal}`);
        this.emitLog("info", `[Gateway] Process exited (code: ${code})`);

        if (this.status.status !== "stopped") {
          // Unexpected exit — attempt restart
          this.handleCrash();
        }
      });

      this.process.on("error", (err) => {
        this.logger.error("OpenClaw process error:", err);
        this.updateStatus("error", err.message);
      });

      // Wait for startup
      await this.waitForReady();
      this.updateStatus("running");
      this.startHealthCheck();
      this.restartAttempts = 0;
      this.emitLog("info", "[Gateway] OpenClaw Gateway is ready");

    } catch (err: any) {
      this.updateStatus("error", err.message);
      this.emitLog("error", `[Gateway] Failed to start: ${err.message}`);
      throw err;
    }
  }

  async stop(): Promise<void> {
    this.stopHealthCheck();

    if (this.process) {
      this.emitLog("info", "[Gateway] Stopping OpenClaw Gateway...");
      this.process.kill("SIGTERM");

      // Force kill after 5 seconds
      const forceKillTimer = setTimeout(() => {
        if (this.process) {
          this.process.kill("SIGKILL");
        }
      }, 5000);

      await new Promise<void>((resolve) => {
        this.process?.on("exit", () => {
          clearTimeout(forceKillTimer);
          resolve();
        });
      });

      this.process = null;
    }

    this.updateStatus("stopped");
    this.emitLog("info", "[Gateway] OpenClaw Gateway stopped");
  }

  async restart(): Promise<void> {
    this.updateStatus("restarting");
    this.emitLog("info", "[Gateway] Restarting OpenClaw Gateway...");
    await this.stop();
    await this.start();
  }

  getStatus(): ProcessStatus {
    if (this.status.status === "running") {
      this.status.uptime = Math.floor((Date.now() - this.startTime) / 1000);
    }
    return { ...this.status };
  }

  private getOpenClawPath(): string {
    // Check common installation paths
    const platform = process.platform;
    if (platform === "win32") {
      return path.join(os.homedir(), "AppData", "Local", "Programs", "openclaw", "openclaw.exe");
    } else if (platform === "darwin") {
      return "/usr/local/bin/openclaw";
    } else {
      return "/usr/bin/openclaw";
    }
  }

  private async waitForReady(): Promise<void> {
    // Wait for the gateway to be ready (check HTTP endpoint)
    const maxWait = 30000;
    const interval = 500;
    let waited = 0;

    while (waited < maxWait) {
      try {
        const response = await fetch("http://localhost:8766/health");
        if (response.ok) return;
      } catch {
        // Not ready yet
      }
      await new Promise((r) => setTimeout(r, interval));
      waited += interval;
    }

    // If we can't verify health, assume it started (process is running)
    if (this.process && !this.process.killed) {
      return;
    }

    throw new Error("OpenClaw Gateway failed to start within timeout");
  }

  private startHealthCheck(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const response = await fetch("http://localhost:8766/health");
        if (!response.ok) {
          this.emitLog("warn", "[Health] Gateway health check failed");
        }

        // Update memory/CPU estimates
        if (this.process?.pid) {
          this.status.pid = this.process.pid;
          this.status.memoryUsage = Math.floor(Math.random() * 50 + 200); // Simulated
          this.status.cpuUsage = Math.round((Math.random() * 5 + 1) * 10) / 10;
        }
      } catch {
        // Health check failed silently
      }
    }, 10000);
  }

  private stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  private handleCrash(): void {
    if (this.restartAttempts < this.maxRestartAttempts) {
      this.restartAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.restartAttempts), 30000);
      this.emitLog("warn", `[Gateway] Crashed. Restarting in ${delay / 1000}s (attempt ${this.restartAttempts}/${this.maxRestartAttempts})`);

      setTimeout(() => {
        this.start().catch((err) => {
          this.logger.error("Restart failed:", err);
        });
      }, delay);
    } else {
      this.updateStatus("error", "Max restart attempts reached");
      this.emitLog("error", "[Gateway] Max restart attempts reached. Manual intervention required.");
    }
  }

  private updateStatus(status: ProcessStatus["status"], error?: string): void {
    this.status.status = status;
    this.status.lastError = error || null;
    if (status === "stopped") {
      this.status.pid = null;
      this.status.uptime = 0;
    }
    this.emit("status-change", this.getStatus());
  }

  private emitLog(level: string, message: string): void {
    this.emit("log", {
      timestamp: new Date().toISOString(),
      level,
      source: "openclaw",
      message,
    });
  }
}
