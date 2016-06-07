const ip = require("ip");
const debug = require("debug");
const socket = require("socket.io");

import config from "../config";
import {scanPorts} from "../utilities";

export default async function server() {
    let log = debug("chomp:server");
    let localAddress = config.address;
    let serverAddress = await scanPorts();
    if (serverAddress) return serverAddress;
    else return new Promise(async(resolve, reject) => {
        log("socket.io");
        let io = socket();
        io.listen(config.port);
        registerServerMethods(io);
        debug("server")("check for existing server");
        let serverAddress = await scanPorts();
        if (serverAddress) {
            if (ip.toLong(localAddress) > ip.toLong(serverAddress)) {
                server();
                io.close();
            }
        } else resolve(localAddress);
    });
};

function registerServerMethods(io) {
    let log = debug("chomp:socket");
    io.on("connection", (socket) => {
        socket.emit("hello", "Hello World!");
        socket.on("upload", (magnet) => {
            log("broadcast magnet");
            socket.emit("download", magnet);
        });
        socket.on("send-clients", () => {
            let clients = io.sockets.clients();
            socket.emit("receive-clients", clients);
        });
    });
}
