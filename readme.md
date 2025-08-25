# DNSpoofer CLI

DNSpoofer est un module Node.js pour effectuer du DNS spoofing en batch ou continu, avec multicores et stats live.
Utile pour solidifier une infrastructure.
---

## Installation client
\`\`\`
npm i -g @roflsec/dnspoofer
\`\`\`

ou

## Installation locale

\`\`\`bash
git clone <repo>
cd DNSpoofer
npm install
npm link
\`\`\`

> La commande CLI globale \`dnspoofer\` est maintenant disponible.

---

## Commandes

### Spoof simple (test)
\`\`\`bash
dnspoofer -server=192.168.0.1 -domain=example.com --test
\`\`\`

### Spoof réel
\`\`\`bash
dnspoofer -server=192.168.0.1 -domain=example.com,example2.com
\`\`\`

### Spoof avec custom DNS
\`\`\`bash
dnspoofer -server=192.168.0.1 -domain=example.com -dns=custom.json
\`\`\`

### Options avancées
- \`--workers=N\` : nombre de workers (par défaut = nombre de cores CPU)
- \`--interval=ms\` : délai entre cycles de spoof pour chaque worker (par défaut = 0)
- \`--test\` : mode test (aucune requête réelle envoyée)

Exemple :
\`\`\`bash
dnspoofer -server=192.168.0.1 -domain=example.com -dns=custom.json --workers=4 --interval=1000 --test
\`\`\`

---

## Fonctionnalités

- Multicores continu et stats live toutes les 5 secondes  
- Queue circulaire pour chaque DNS, pas de répétition avant utilisation de tous  
- Fusion automatique \`freeDNS.json\` + custom  
- Compatible Termux, Debian, Ubuntu, Windows

Lulz
