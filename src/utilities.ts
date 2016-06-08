const arp = require("arpjs");
const debug = require("debug");
const evilscan = require("evilscan");

import config from "./config";

let log = debug("chomp:utilities");

interface IARP {
    ip:string;
    mac:string;
}

function getARPTable():Promise<IARP[]> {
    return new Promise((resolve, reject) => {
        arp.table((error, devices) => {
            if (error) reject(error);
            else resolve(devices);
        });
    });
}

function getPortStatus(device) {
    return new Promise((resolve, reject) => {
        let info;
        let port = config.port;
        let target = device.ip;
        let options = {port, target};
        let scanner = new evilscan(options);
        scanner.on("result", function (result) {
            info = result;
        });
        scanner.on("error", function (error) {
            reject(error);
        });
        scanner.on("done", function () {
            if (info) resolve(info);
            else resolve(null);
        });
        scanner.run();
    });
}

export async function scanPorts() {
    log("scan ports");
    let states = null;
    let address = config.address;
    let devices = await getARPTable();

    await Promise
        .all(devices.map((device) => {
            return getPortStatus(device);
        }))
        .then((result) => states = result);

    for (let state of states) {
        if (state &&
            state.ip !== address &&
            state.status === "open")
            return state.ip;
    }

    log("no server found");
}
