const os = require("os");
const dns = require("dns");
const arp = require("arpjs");
const portscanner = require("portscanner");

import config from "./config";

export async function getLocalAddress() {
    return await new Promise((resolve, reject) => {
        dns.lookup(os.hostname(), (err, add) => {
            if (err) reject(err);
            else resolve(add);
        });
    });
}

export async function scanPorts() {
    let localAddress = await getLocalAddress();
    return await new Promise((resolve, reject) => {
        arp.table((error, devices) => {
            for (let device of devices) {
                portscanner.checkPortStatus(config.port, device.ip, (error, status) => {
                    if (error) reject(error);
                    if (device.ip !== localAddress && status !== "closed") resolve(device.ip);
                });
            }
            resolve(null);
        });
    });
}
