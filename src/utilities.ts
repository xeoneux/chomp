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

export async function scanPorts() {
    let {port, address} = config;
    let devices = await getARPTable();
    for (let device of devices) {
        console.log(device.ip);
        let status = await getPortStatus(port, device.ip);
        if (status === "open" && device.ip !== address) {
            return device.ip;
        }
    }
}
