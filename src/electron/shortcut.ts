import { BrowserWindow } from "electron";
import { isDev } from "./utils.js";

export function setShortcut(mainWindow: BrowserWindow) {
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.alt) {
      event.preventDefault(); // optional: prevent default behavior
      isDev() && console.log("alt key pressed");
      mainWindow.setMenuBarVisibility(!mainWindow.isMenuBarVisible());
    }
  });
}
