const ip = require("ip");

const config = {
    port: 1234,
    address: ip.address()
};

export default config;
