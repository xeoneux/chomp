import {app, BrowserWindow} from "electron";
import server from "./server";

let win;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600, frame: false});

    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", async() => {
    let url = await server();
    createWindow();
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
