#!/usr/bin/env node
const { sendDnsSpoof, batchSpoof } = require("./dns-spoofer.js");
const args = process.argv.slice(2);

if(args[0] === "single") {
    const server = args[1] || "127.0.0.1";
    const domain = args[2] || "example.com";
    sendDnsSpoof(server, domain);
} else if(args[0] === "batch") {
    const file = args[1] || "FreeDNSservers.json";
    const domain = args[2] || "example.com";
    const server = args[3] || "127.0.0.1";
    batchSpoof(file, domain, server);
} else {
    console.log("Usage:");
    console.log("  dnspoofer single [SERVER_IP] [DOMAIN]");
    console.log("  dnspoofer batch [JSON_FILE] [DOMAIN] [SERVER_IP]");
}
