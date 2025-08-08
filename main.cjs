const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, screen, ipcMain } = require('electron');

const isDev = process.env.ELECTRON_IS_DEV === 'true' || !app.isPackaged;

// Setup logger
function log(msg) {
  const logFile = path.join(app.getPath('userData'), 'app.log');
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
  console.log(msg);
}

// Load config
function loadConfig() {
  const configPath = app.isPackaged
    ? path.join(process.resourcesPath, 'config.json')
    : path.join(__dirname, 'config.json');

  log(`CONFIG PATH: ${configPath}`);

  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw);
    log(`Loaded config: ${JSON.stringify(parsed)}`);
    return parsed;
  } catch (err) {
    log(`Failed to load config.json: ${err.message}`);
    return {
      apiBaseUrl: 'http://localhost:8080/api' // fallback
    };
  }
}

function createWindow() {
  const config = loadConfig();

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  ipcMain.handle('get-config', () => config);

  win.setMenuBarVisibility(false);

  if (isDev) {
    win.loadURL('http://localhost:8081');
    win.webContents.openDevTools();
  } else {
    const filePath = path.join(__dirname, 'dist', 'index.html');
    log(`Loading production file: ${filePath}`);
    win.loadFile(filePath);
  }

  win.webContents.on('did-fail-load', (event, code, desc, validatedURL) => {
    const msg = `Failed to load ${validatedURL}: ${desc} (${code})`;
    log(msg);
    if (isDev) {
      setTimeout(() => win.loadURL('http://localhost:8081'), 1000);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
