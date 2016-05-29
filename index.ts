const os = require("os");
const ip = require("ip");
const dns = require("dns");
const arp = require("arpjs");
const portscanner = require("portscanner");

const config = {
    ip: getUserIPAddress(),
    port: 1234
};

// Step 1: Get list of connected IP addresses
arp.table((error, devices) => {
    // Step 2: Get status of port on those IP addresses
    let address = scanPorts(devices);
    if (address) {
        // Server exists on one of the IP addresses
        // Step 3A: Connect to the server.
        // TODO: Connect to WebSocket Server
    } else {
        // Server does not exists on one of the connected IP addresses
        // Step 3B: Create a server.
        // TODO: Create new WebSocket Server

        // Step 4B: Check ports again after server creation
        let address = scanPorts(devices);
        if (address) {
            // Server exists on one of the IP addresses
            // Step 5B: Compare IP addresses
            if (ip.toLong(config.ip) > ip.toLong(address)) {
                // TODO: Destroy created server and repeat whole process
            }
        }
    }
});

async function getUserIPAddress() {
    let ip;
    await dns.lookup(os.hostname(), (err, add, fam) => ip = add);
    return ip;
}

function scanPorts(addresses): number {
    let ip;
    addresses.forEach(async(address) => {
        await portscanner.checkPortStatus(config.port, address, (error, status) => {
            if (address !== config.ip && status !== "closed") ip = address;
        });
    });
    return ip;
}
