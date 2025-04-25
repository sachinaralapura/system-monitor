import { ipcRenderer, IpcRendererEvent } from "electron";

const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  // for dynamic stats

  subscribeStats: (callback) => ipcOn("statistics", (stats) => {
    callback(stats);
  }),

  // for static stats
  getStaticData: () => ipcInvoke("getStaticData"),

  subscribeChangeView: (callback) => ipcOn("changeEvent", (view) => {
    callback(view)
  })

} satisfies Window["electron"]);

// --------------------------------

/**
 * wrapper function for ipcRenderer.invoke().
 * Send a message to the main process via channel and expect a result asynchronously.
 */
function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return ipcRenderer.invoke(key);
}

/**
 * wrapper function for ipcRenderer.on().
 * Listens to channel, when a new message arrives listener would be called with
 */
function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: IpcRendererEvent, payload: any) => callback(payload);
  ipcRenderer.on(key, cb);
  return () => ipcRenderer.off(key, cb);
}
