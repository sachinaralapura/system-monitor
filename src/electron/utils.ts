import {
  ipcMain,
  WebContents,
  IpcMainInvokeEvent,
  WebFrameMain,
} from "electron";
import { pathToFileURL } from "url";
import { getUIPath } from "./pathResolver.js";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Wraper for ipcMain.handle function. Adds a handler for an invokeable IPC.
 * This handler will be called whenever a renderer calls ipcRenderer.invoke(channel, ...args).
 */
export function ipcMainHandler<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event: IpcMainInvokeEvent) => {
    // check where this event is coming from.
    // event.senderFrame?.url
    // validata the event url
    validateEventFrame(event.senderFrame!);
    return handler();
  });
}

// wrapper function for webContents.send(). Send an asynchronous message to the renderer process.
export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}

// validate the url where event came from
export function validateEventFrame(frame: WebFrameMain) {
  if (isDev() && new URL(frame.url).host === "localhost:5123") {
    return;
  }
  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error("Malicious event");
  }
}
