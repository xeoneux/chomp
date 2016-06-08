const debug = require("debug");
const dragDrop = require("drag-drop");
const io = require("socket.io-client");
const WebTorrent = require("webtorrent");

import {ipcRenderer} from "electron";

let log = debug("chomp:client");
let url = ipcRenderer.sendSync("url");
log(`websocket url: ${url}`);

let socket = io(url);
let client = new WebTorrent();

socket.on("hello", (data) => {
    socket.emit("send-clients");
});

socket.on("download", (magnet) => {
    client.add(magnet, (torrent) => {
        log("download", torrent.infoHash);
        torrent.files.forEach((file) => {
            file.appendTo("body");
        });
    });
});

socket.on("receive-clients", (clients) => {
    console.log(clients);
});

dragDrop("body", (files) => {
    client.seed(files, (torrent) => {
        log("upload", torrent.infoHash);
        socket.emit("upload", torrent.magnetURI);
    });
});
