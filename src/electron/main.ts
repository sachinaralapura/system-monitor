import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { ipcMainHandler, isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { getStaticData, pollResources } from "./resourceManager.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  mainWindow.setTitle("AskDb");
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }
  pollResources(mainWindow);

  // handle the getStaticData channel invoke
  ipcMainHandler("getStaticData", () => getStaticData());
});
