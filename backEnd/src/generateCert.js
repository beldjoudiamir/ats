const selfsigned = require("selfsigned");
const fs = require("fs");

const attrs = [{ name: "commonName", value: "localhost" }];
const pems = selfsigned.generate(attrs, { days: 365 });

fs.mkdirSync("certs", { recursive: true });
fs.writeFileSync("certs/server.key", pems.private);
fs.writeFileSync("certs/server.cert", pems.cert);

console.log("✅ Certificats générés dans le dossier certs/");
