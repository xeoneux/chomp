const io = require("socket.io-client");
const WebTorrent = require("webtorrent");

import {ipcRenderer} from "electron";

let url = ipcRenderer.sendSync("url");
let socket = io(url);

socket.on("hello", (data) => {
    console.log(data);
});

socket.on("download", (magnet) => {
    let client = new WebTorrent();
    client.add(magnet, (torrent) => {
        console.log("Client is downloading:", torrent.infoHash);
        torrent.files.forEach((file) => {
            file.appendTo("body");
        });
    });
});
