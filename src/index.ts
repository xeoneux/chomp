import {app, BrowserWindow, ipcMain} from "electron";

import config from "./config";
import server from "./server";

let win;
let serverAddress;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600, frame: false});
    win.loadURL(`file://${__dirname}/../src/client/load.html`);
    win.webContents.openDevTools();
    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", async() => {
    createWindow();
    server().then((address) => {
        serverAddress = address;
        win.loadURL(`file://${__dirname}/../src/client/index.html`);
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});

ipcMain.on("url", (event) => {
    event.returnValue = `ws://${serverAddress}:${config.port}`;
});
