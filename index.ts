///<reference path="typings/index.d.ts"/>

const ip = require("ip");
const primus = require("primus");

import config from "./config";
import {scanPorts, getLocalAddress} from "./utilities";

async function server() {
    let localAddress = await getLocalAddress();
    let serverAddress = await scanPorts();
    if (serverAddress) {
        // Server exists on the IP address
        // TODO: Connect to the server.
    } else {
        let server = primus.createServer({
            port: config.port,
            transformer: "uws"
        });

        let serverAddress = await scanPorts();
        if (serverAddress) {
            if (ip.toLong(localAddress) > ip.toLong(serverAddress)) {
                // TODO: Destroy created server and repeat whole process
            }
        }
    }
}

server();
