const arp = require("arpjs");
const evilscan = require("evilscan");

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

function getPortStatus(port, target) {
    return new Promise((resolve, reject) => {
        let status;
        let options = {port, target};
        let scanner = new evilscan(options);
        scanner.on("result", function (result) {
            status = result.status;
        });
        scanner.on("error", function (error) {
            reject(error);
        });
        scanner.on("done", function () {
            if (status) resolve(status);
            else resolve("closed");
        });
        scanner.run();
    });
}

export async function scanPorts() {
    let {port, address} = config;
    let devices = await getARPTable();
    for (let device of devices) {
        let status = await getPortStatus(port, device.ip);
        if (status === "open" && device.ip !== address) {
            return device.ip;
        }
    }
}
