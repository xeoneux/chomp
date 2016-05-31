declare const Primus;

import {ipcRenderer} from "electron";

let url = ipcRenderer.sendSync("url");
let primus = Primus.connect(url);

primus.on("data", (data) => {
    console.log(data);
});
