const dragDrop = require("drag-drop");
const io = require("socket.io-client");
const WebTorrent = require("webtorrent");

import {ipcRenderer} from "electron";

let url = ipcRenderer.sendSync("url");
let socket = io(url);
let client = new WebTorrent();

socket.on("hello", (data) => {
    console.log(data);
});

socket.on("download", (magnet) => {
    client.add(magnet, (torrent) => {
        console.log("Client is downloading:", torrent.infoHash);
        torrent.files.forEach((file) => {
            file.appendTo("body");
        });
    });
});

dragDrop("body", (files) => {
    client.seed(files, (torrent) => {
        console.log("Client is seeding:", torrent.infoHash);
    });
});
