const os = require("os");
const dns = require("dns");
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

export async function portScanner(addresses) {
    let localAddress = await getLocalAddress();
    return await new Promise((resolve, reject) => {
        for (let address of addresses) {
            portscanner.checkPortStatus(config.port, address, (error, status) => {
                if (error) reject(error);
                if (address !== localAddress && status !== "closed") resolve(address);
            });
        }
        resolve(null);
    });
}
