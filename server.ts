const ip = require("ip");
const primus = require("primus");

import config from "./config";
import {scanPorts, getLocalAddress} from "./utilities";

export default async function server() {
    let localAddress = await getLocalAddress();
    let serverAddress = await scanPorts();
    return await new Promise(async(resolve, reject) => {
        if (serverAddress)resolve(serverAddress);
        else {
            let server = primus.createServer({
                port: config.port,
                transformer: "uws"
            });
            let serverAddress = await scanPorts();
            if (serverAddress) {
                if (ip.toLong(localAddress) > ip.toLong(serverAddress)) {
                    // TODO: Destroy created server and repeat whole process
                }
            } else {
                resolve(localAddress);
            }
        }
    });
};
