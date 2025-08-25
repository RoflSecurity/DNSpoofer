const dgram = require("dgram");
const fs = require("fs");

// Liste de DNS par défaut (freeDNS)
const freeDNS = require("./freeDNS.json");

// Construire une requête DNS A
function buildDnsQuery(domain) {
    const parts = domain.split(".");
    let qname = [];
    for(const part of parts){
        qname.push(Buffer.from([part.length]));
        qname.push(Buffer.from(part));
    }
    qname.push(Buffer.from([0]));

    const header = Buffer.alloc(12);
    header.writeUInt16BE(Math.floor(Math.random()*65535), 0);
    header.writeUInt16BE(0x0100, 2);
    header.writeUInt16BE(1, 4);
    header.writeUInt16BE(0, 6);
    header.writeUInt16BE(0, 8);
    header.writeUInt16BE(0, 10);

    const question = Buffer.concat([
        Buffer.concat(qname),
        Buffer.from([0x00,0x01]),
        Buffer.from([0x00,0x01])
    ]);

    return Buffer.concat([header, question]);
}

// Envoi “spoof” d'une requête vers le serveur cible
function sendDnsSpoof(targetServer, domain) {
    const client = dgram.createSocket("udp4");
    const message = buildDnsQuery(domain);
    client.send(message, 53, targetServer, () => {
        console.log(`[+] DNS spoof request normaly sent to server ${targetServer} for ${domain}`);
        client.close();
    });
}

module.exports = { sendDnsSpoof, freeDNS };
