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

// Client
let fName = chance.word({syllables: 2});
let lName = chance.word({syllables: 2});
let clientName = fName + lName;

socket.on("download", (magnet) => {
    client.add(magnet, (torrent) => {
        log("download", torrent.infoHash);
        torrent.files.forEach((file) => {
            file.appendTo("body");
        });
    });
});

// Ping
socket.on("init", () => {
    let chomp = {};
    chomp["request"]["id"] = socket.id;
    chomp["request"]["name"] = clientName;
    socket.emit("request-clients", chomp);
});

socket.on("request-ping", (chomp) => {
    chomp["response"]["id"] = socket.id;
    chomp["response"]["name"] = clientName;
    socket.emit("response-ping", chomp);
});

socket.on("response-clients", (clients) => {
    console.log(clients);
});

// File
dragDrop("body", (files) => {
    client.seed(files, (torrent) => {
        log("upload", torrent.infoHash);
        socket.emit("upload", torrent.magnetURI);
    });
});
