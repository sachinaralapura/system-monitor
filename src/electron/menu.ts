import { app, BrowserWindow, Menu, View } from "electron";
import { ipcWebContentsSend, isDev } from "./utils.js";

export function createMenu(mainWindow: BrowserWindow, isVisible: boolean, _views: Views) {

  const views: Views = {
    CPU: true,
    RAM: true,
    STORAGE: true,
    STORAGESTATIC: true,
  }


  mainWindow.setMenuBarVisibility(isVisible);


  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: process.platform === "darwin" ? undefined : "App",
        type: "submenu",
        submenu: [
          {
            label: "hide",
            click: () => {
              if (app.dock) {
                app.dock.hide();
              }
              mainWindow.close();
            },
          },
          {
            label: "devTools",
            click: () => mainWindow.webContents.openDevTools(),
            visible: isDev(),
          },
          {
            label: "Quit",
            click: app.quit,
          },
        ],
      },
      {
        label: "View",
        type: "submenu",
        submenu: [
          {
            type: "checkbox",
            label: "CPU",
            checked: views.CPU,
            click: (meneItem) => {
              views.CPU = meneItem.checked
              ipcWebContentsSend("changeEvent", mainWindow.webContents, views)
            }
          },
          {
            type: "checkbox",
            label: "RAM",
            checked: views.RAM,
            click: (meneItem) => {
              views.RAM = meneItem.checked
              ipcWebContentsSend("changeEvent", mainWindow.webContents, views)
            }
          },
          {
            type: "checkbox",
            label: "storage",
            checked: views.STORAGE,
            click: (meneItem) => {
              views.STORAGE = meneItem.checked
              ipcWebContentsSend("changeEvent", mainWindow.webContents, views)
            }
          },
          {
            type: "checkbox",
            label: "storage overtime",
            checked: views.STORAGESTATIC,
            click: (menuItem) => {
              views.STORAGESTATIC = menuItem.checked;
              ipcWebContentsSend("changeEvent", mainWindow.webContents, views);
            }
          }
        ],
      },
    ])
  );
}
