/**
 * ClawX Enhanced — Preload Script
 * Exposes safe IPC channels to the renderer process via contextBridge
 */
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("clawx", {
  // Window controls
  window: {
    minimize: () => ipcRenderer.send("window:minimize"),
    maximize: () => ipcRenderer.send("window:maximize"),
    close: () => ipcRenderer.send("window:close"),
  },

  // OpenClaw Gateway
  openclaw: {
    start: () => ipcRenderer.invoke("openclaw:start"),
    stop: () => ipcRenderer.invoke("openclaw:stop"),
    restart: () => ipcRenderer.invoke("openclaw:restart"),
    getStatus: () => ipcRenderer.invoke("openclaw:status"),
    onStatus: (callback: (status: any) => void) => {
      ipcRenderer.on("openclaw:status", (_event, status) => callback(status));
    },
    onLog: (callback: (entry: any) => void) => {
      ipcRenderer.on("openclaw:log", (_event, entry) => callback(entry));
    },
  },

  // OpenCode
  opencode: {
    start: () => ipcRenderer.invoke("opencode:start"),
    stop: () => ipcRenderer.invoke("opencode:stop"),
    restart: () => ipcRenderer.invoke("opencode:restart"),
    getStatus: () => ipcRenderer.invoke("opencode:status"),
    send: (command: string) => ipcRenderer.invoke("opencode:send", command),
    getSessions: () => ipcRenderer.invoke("opencode:sessions"),
    onStatus: (callback: (status: any) => void) => {
      ipcRenderer.on("opencode:status", (_event, status) => callback(status));
    },
    onLog: (callback: (entry: any) => void) => {
      ipcRenderer.on("opencode:log", (_event, entry) => callback(entry));
    },
    onSessions: (callback: (sessions: any) => void) => {
      ipcRenderer.on("opencode:sessions", (_event, sessions) => callback(sessions));
    },
  },

  // IPC Bridge
  bridge: {
    send: (target: string, message: string) => {
      return ipcRenderer.invoke("bridge:send", target, message);
    },
  },
});
