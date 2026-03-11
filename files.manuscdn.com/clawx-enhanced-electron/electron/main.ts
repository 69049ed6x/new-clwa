/**
 * ClawX Enhanced — Electron Main Process
 * 
 * Responsibilities:
 * 1. Create and manage the BrowserWindow
 * 2. Spawn and monitor OpenClaw Gateway subprocess
 * 3. Spawn and monitor OpenCode subprocess
 * 4. Bridge IPC between renderer and both subprocesses
 * 5. Handle app lifecycle (startup, shutdown, crash recovery)
 */
import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import { OpenClawManager } from "./services/openclawManager";
import { OpenCodeManager } from "./services/opencodeManager";
import { IPCBridge } from "./services/ipcBridge";
import { Logger } from "./utils/logger";

const logger = new Logger("main");
let mainWindow: BrowserWindow | null = null;
let openclawManager: OpenClawManager;
let opencodeManager: OpenCodeManager;
let ipcBridge: IPCBridge;

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#0d1117",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    icon: path.join(__dirname, "../resources/icon.png"),
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

async function initServices() {
  // Initialize process managers
  openclawManager = new OpenClawManager();
  opencodeManager = new OpenCodeManager();
  ipcBridge = new IPCBridge(openclawManager, opencodeManager);

  // Forward process events to renderer
  openclawManager.on("status-change", (status) => {
    mainWindow?.webContents.send("openclaw:status", status);
  });

  openclawManager.on("log", (entry) => {
    mainWindow?.webContents.send("openclaw:log", entry);
  });

  opencodeManager.on("status-change", (status) => {
    mainWindow?.webContents.send("opencode:status", status);
  });

  opencodeManager.on("log", (entry) => {
    mainWindow?.webContents.send("opencode:log", entry);
  });

  opencodeManager.on("session-update", (sessions) => {
    mainWindow?.webContents.send("opencode:sessions", sessions);
  });

  // Start both processes
  try {
    await openclawManager.start();
    logger.info("OpenClaw Gateway started successfully");
  } catch (err) {
    logger.error("Failed to start OpenClaw Gateway:", err);
  }

  try {
    await opencodeManager.start();
    logger.info("OpenCode server started successfully");
  } catch (err) {
    logger.error("Failed to start OpenCode server:", err);
  }
}

function setupIPC() {
  // Window controls
  ipcMain.on("window:minimize", () => mainWindow?.minimize());
  ipcMain.on("window:maximize", () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.on("window:close", () => mainWindow?.close());

  // OpenClaw controls
  ipcMain.handle("openclaw:start", () => openclawManager.start());
  ipcMain.handle("openclaw:stop", () => openclawManager.stop());
  ipcMain.handle("openclaw:restart", () => openclawManager.restart());
  ipcMain.handle("openclaw:status", () => openclawManager.getStatus());

  // OpenCode controls
  ipcMain.handle("opencode:start", () => opencodeManager.start());
  ipcMain.handle("opencode:stop", () => opencodeManager.stop());
  ipcMain.handle("opencode:restart", () => opencodeManager.restart());
  ipcMain.handle("opencode:status", () => opencodeManager.getStatus());
  ipcMain.handle("opencode:send", (_event, command: string) => {
    return opencodeManager.sendCommand(command);
  });
  ipcMain.handle("opencode:sessions", () => opencodeManager.getSessions());

  // IPC Bridge
  ipcMain.handle("bridge:send", (_event, target: string, message: string) => {
    return ipcBridge.send(target, message);
  });
}

// App lifecycle
app.whenReady().then(async () => {
  createWindow();
  setupIPC();
  await initServices();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", async () => {
  logger.info("Shutting down services...");
  await openclawManager?.stop();
  await opencodeManager?.stop();

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", async () => {
  await openclawManager?.stop();
  await opencodeManager?.stop();
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection:", reason);
});
