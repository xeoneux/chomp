const os = require("os");
const dns = require("dns");
const arp = require("arpjs");
const portscanner = require("portscanner");

import config from "./config";

interface IARP {
    ip: string;
    mac: string;
}

function getARPTable(): Promise<IARP[]> {
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
    let port = config.port;
    let devices = await getARPTable();
    let localAddress = await getLocalAddress();

    let serverAddress;
    for (let device of devices) {
        let address = device.ip;
        let status = await getPortStatus(port, address);
        if (status === "open") {
            serverAddress = address;
        }
    }
    return serverAddress;
}
