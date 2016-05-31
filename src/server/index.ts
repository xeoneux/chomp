const ip = require("ip");
const primus = require("primus");

import config from "../config";
import {scanPorts} from "../utilities";

export default async function server() {
    let localAddress = config.address;
    let serverAddress = await scanPorts();
    if (serverAddress) return serverAddress;
    else return new Promise(async(resolve, reject) => {
        let server = primus.createServer({
            port: config.port,
            transformer: "uws"
        });
        registerServerMethods(server);
        server.save(`${__dirname}/../client/primus.js`);
        let serverAddress = await scanPorts();
        if (serverAddress) {
            if (ip.toLong(localAddress) > ip.toLong(serverAddress)) {
                server.destroy();
            }
        } else resolve(localAddress);
    });
};

function registerServerMethods(server) {
    server.on("connection", (spark) => {
        spark.write("Hello from the server");
        console.log("New connection from:", spark.id);
    });
}
