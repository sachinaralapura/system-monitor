import { app, BrowserWindow, Menu, Tray } from "electron";
import { getAssetsPath } from "./pathResolver.js";
import path from "path";

export function createTray(mainWindow: BrowserWindow) {
  const tray = new Tray(path.join(getAssetsPath(), "trayIcon.png"));
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        type: "normal",
        label: "show/hide",
        click: () => {
          const visible = mainWindow.isVisible();
          if (visible) {
            app.dock && app.dock.hide();
            mainWindow.hide();
            return;
          }
          app.dock && app.dock.show();
          mainWindow.show();
        },
      },
      {
        label: "Quit",
        click: () => app.quit(),
      },
    ])
  );
}
