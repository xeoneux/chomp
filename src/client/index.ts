const debug = require("debug");
const Chance = require("chance");
const dragDrop = require("drag-drop");
const io = require("socket.io-client");
const WebTorrent = require("webtorrent");

import {ipcRenderer} from "electron";

let log = debug("chomp:client");
let url = ipcRenderer.sendSync("url");
log(`websocket url: ${url}`);

let socket = io(url);
let chance = Chance();
let client = new WebTorrent();

// Client identifiers
let id = socket.id;
let fName = chance.word({syllables: 2});
let lName = chance.word({syllables: 2});
let clientName = fName + lName;

socket.on("hello", (data) => {
    socket.emit("send-clients", id);
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

socket.on("get-client", (caller) => {
    socket.emit("ping-client", {caller, pinger: id});
});

dragDrop("body", (files) => {
    client.seed(files, (torrent) => {
        log("upload", torrent.infoHash);
        socket.emit("upload", torrent.magnetURI);
    });
});
