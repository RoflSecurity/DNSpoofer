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
