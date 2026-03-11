/**
 * Simple Logger Utility
 */
import fs from "fs";
import path from "path";
import os from "os";

const LOG_DIR = path.join(os.homedir(), ".clawx-enhanced", "logs");

export class Logger {
  private context: string;
  private logFile: string;

  constructor(context: string) {
    this.context = context;
    this.logFile = path.join(LOG_DIR, `${context}.log`);

    // Ensure log directory exists
    try {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  info(message: string, ...args: any[]): void {
    this.log("INFO", message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log("WARN", message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log("ERROR", message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.log("DEBUG", message, ...args);
  }

  private log(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level}] [${this.context}] ${message} ${args.length ? JSON.stringify(args) : ""}`;

    // Console output
    console.log(formatted);

    // File output
    try {
      fs.appendFileSync(this.logFile, formatted + "\n");
    } catch {
      // Silently fail file logging
    }
  }
}
