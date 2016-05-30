///<reference path="typings/index.d.ts"/>

const os = require("os");
const ip = require("ip");
const dns = require("dns");
const arp = require("arpjs");
const primus = require("primus");
const portscanner = require("portscanner");

import config from "./config";
import {getLocalAddress} from "./utilities";

// Step 1: Get list of connected IP addresses
async function server() {
    await arp.table(async(error, devices) => {
        // Step 2: Get status of port on those IP addresses
        let address = await scanPorts(devices);
        if (address) {
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
            let address = scanPorts(devices);
            if (address) {
                // Server exists on one of the IP addresses
                // Step 5B: Compare IP addresses
                if (ip.toLong(getLocalAddress()) > ip.toLong(address)) {
                    // TODO: Destroy created server and repeat whole process
                }
            }
        }
    });
}

async function scanPorts(devices) {
    let ip = null;
    for (let device of devices) {
        await portscanner.checkPortStatus(config.port, device.ip, (error, status) => {
            if (device.ip !== getLocalAddress() && status !== "closed") ip = device.ip;
        });
    }
    return ip;
}

server();
