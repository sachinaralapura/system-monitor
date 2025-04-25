import { app, BrowserWindow } from "electron";
import path from "path";
import { ipcMainHandler, isDev } from "./utils.js";
import { getAssetsPath, getPreloadPath, getUIPath } from "./pathResolver.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import { setShortcut } from "./shortcut.js";

let views: Views = {
  CPU: true,
  RAM: true,
  STORAGE: true,
};


app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(getAssetsPath(), "icon.png"),
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
    },
  });

  if (isDev()) mainWindow.loadURL("http://localhost:5123");
  else mainWindow.loadFile(getUIPath());

  pollResources(mainWindow);

  // handle the getStaticData channel invoke
  ipcMainHandler("getStaticData", () => getStaticData());

  // mainWindow.setAlwaysOnTop(true);

  // Listen for key events when the window is focused
  setShortcut(mainWindow);

  createMenu(mainWindow, false, views);

  createTray(mainWindow);

  handleCloseEvents(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}
