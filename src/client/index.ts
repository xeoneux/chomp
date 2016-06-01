const io = require("socket.io-client");

import {ipcRenderer} from "electron";

let url = ipcRenderer.sendSync("url");
let socket = io(url);

socket.on("hello", function (data) {
    console.log(data);
});
