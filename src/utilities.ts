const os = require("os");
const dns = require("dns");
const arp = require("arpjs");
const portscanner = require("portscanner");

import config from "./config";

function getARPTable() {
    return new Promise((resolve, reject) => {
        arp.table((error, devices) => {
            if (error) reject(error);
            else resolve(devices);
        });
    });
}

function getPortStatus(port, address) {
    return new Promise((resolve, reject) => {
        portscanner.checkPortStatus(port, address, (error, status) => {
            if (error) reject(error);
            else resolve(status);
        });
    });
}

export function getLocalAddress() {
    return new Promise((resolve, reject) => {
        dns.lookup(os.hostname(), (error, address) => {
            if (error) reject(error);
            else resolve(address);
        });
    });
}

export async function scanPorts() {
    let devices = await getARPTable();
    let localAddress = await getLocalAddress();
    // TODO: Return address with open port
}
