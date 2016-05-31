import {app, BrowserWindow} from "electron";
import server from "./server";

let win;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600, frame: false});
    win.webContents.openDevTools();
    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", async() => {
    createWindow();
    server()
        .then((address) => {
            console.log(address);
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
