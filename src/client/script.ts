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
let clientName = `${fName} ${lName}`;
document.getElementById("name").innerText = clientName

socket.on("download", (magnet) => {
    log(`magnet: ${magnet}`);
    client.add(magnet, (torrent) => {
        log(`torrent: ${torrent.infoHash}`);
        torrent.files.forEach((file) => {
            file.appendTo("body");
        });
    });
});

// Ping
socket.on("init", () => {
    let chomp = {};
    chomp["requestId"] = socket.id;
    chomp["requestName"] = clientName;
    socket.emit("request-clients", chomp);
});

socket.on("request-ping", (chomp) => {
    chomp["responseId"] = socket.id;
    chomp["responseName"] = clientName;
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
