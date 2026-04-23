const StellarSdk = require("stellar-sdk");

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

const sourceKeys = StellarSdk.Keypair.fromSecret("SC2NPWKPNW5WIF7C3WEUDQIUHVXGHTFYIUYPLH4ZQXN424WUAUXEHRK4");

async function createAccount() {
  await fetch(`https://friendbot.stellar.org?addr=${sourceKeys.publicKey()}`);
  return sourceKeys;
}

module.exports = { server, sourceKeys, createAccount };
console.log("Public Key:", sourceKeys.publicKey());