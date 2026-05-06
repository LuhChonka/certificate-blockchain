import { isConnected, getPublicKey } from "@stellar/freighter-api";

export async function connectWallet() {
  if (!(await isConnected())) {
    alert("Please install Freighter Wallet");
    return;
  }

  const publicKey = await getPublicKey();
  return publicKey;
}