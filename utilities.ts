const os = require("os");
const dns = require("dns");

export async function getLocalAddress() {
    return await new Promise((resolve, reject) => {
        dns.lookup(os.hostname(), (err, add) => {
            if (err) reject(err);
            else resolve(add);
        });
    });
}
