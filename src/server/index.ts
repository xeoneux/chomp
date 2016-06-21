const ip = require("ip");
const debug = require("debug");
const socket = require("socket.io");

import config from "../config";
import {scanPorts} from "../utilities";

export default async function server() {
    let log = debug("chomp:server");

    let localAddress = config.address;
    log(`local address: ${localAddress}`);

    let serverAddress = await scanPorts();

    if (serverAddress) {
        log(`server address: ${serverAddress}`);
        return serverAddress;
    }
    else {
        log("create socket server");
        return new Promise(async (resolve, reject) => {
            let io = socket();
            io.listen(config.port);
            registerServerMethods(io);

            log("check existing server");
            let serverAddress = await scanPorts();
            if (serverAddress) {
                log("existing server found");
                if (ip.toLong(localAddress) > ip.toLong(serverAddress)) {
                    server();
                    io.close();
                }
            } else resolve(localAddress);
        });
    }
};

function registerServerMethods(io) {
    let log = debug("chomp:socket");
    io.on("connection", (socket) => {
        socket.emit("init");

        socket.on("upload", (magnet) => {
            log(`broadcast magnet: ${magnet}`);
            socket.broadcast.emit("download", magnet);
        });

        socket.on("request-clients", (chomp) => {
            log(`request client: ${chomp.requestName}`);
            socket.broadcast.emit("request-ping", chomp);
        });

        socket.on("response-ping", (chomp) => {
            log(`response client: ${chomp.responseName}`);
            io.sockets.connected[`/#${chomp.requestId}`]
                .emit("response-clients", chomp);
        });
    });
}
