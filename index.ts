///<reference path="typings/index.d.ts"/>

const ip = require("ip");
const arp = require("arpjs");
const primus = require("primus");

import config from "./config";
import {portScanner, getLocalAddress} from "./utilities";

// Step 1: Get list of connected IP addresses
async function server() {
    await arp.table(async(error, devices) => {
        // Step 2: Get status of port on those IP addresses
        if (true) {
            // Server exists on one of the IP addresses
            // Step 3A: Connect to the server.
        } else {
            // Server does not exists on one of the connected IP addresses
            // Step 3B: Create a server.
            const server = primus.createServer({
                port: config.port,
                transformer: "uws"
            });

            // Step 4B: Check ports again after server creation
            if (true) {
                // Server exists on one of the IP addresses
                // Step 5B: Compare IP addresses
                if (ip.toLong(getLocalAddress()) > ip.toLong("ADDRESS")) {
                    // TODO: Destroy created server and repeat whole process
                }
            }
        }
    });
}

server();
