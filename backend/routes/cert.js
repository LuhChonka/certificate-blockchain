const Certificate = require("../models/Certificate");
const express = require("express");
const crypto = require("crypto");
const QRCode = require("qrcode");
const StellarSdk = require("stellar-sdk");
const { server, sourceKeys } = require("../stellar");

const router = express.Router();


// 🔥 CREATE CERTIFICATE
router.post("/create", async (req, res) => {
  const { name, course } = req.body;

  const data = `${name}-${course}-${Date.now()}`;
  const hash = crypto.createHash("sha256").update(data).digest("hex");

  try {
    const account = await server.loadAccount(sourceKeys.publicKey());

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.manageData({
          name: "certHash",
          value: hash,
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeys);

    const result = await server.submitTransaction(transaction);

    const txHash = result.hash;

    // 🔥 SAVE TO MONGODB
    await Certificate.create({
      name,
      course,
      txHash,
      date: new Date().toISOString(),
    });

    // 🔥 OPTIONAL QR FILE (can remove if not needed)
    await QRCode.toFile(`../qr/${txHash}.png`, txHash);

    res.json({ hash, txHash });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});


// 🔍 VERIFY CERTIFICATE
router.get("/verify/:txHash", async (req, res) => {
  const { txHash } = req.params;

  try {
    // 1. MongoDB check
    const cert = await Certificate.findOne({ txHash });

    if (!cert) {
      return res.json({ valid: false });
    }

    // 2. Blockchain check
    const tx = await server.transactions().transaction(txHash).call();

    if (!tx.successful) {
      return res.json({ valid: false });
    }

    // 3. Success
    res.json({
      valid: true,
      data: cert,
    });

  } catch (err) {
    console.error(err);
    res.json({ valid: false });
  }
});


// 📊 GET ALL CERTIFICATES (DASHBOARD)
router.get("/all", async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ _id: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

// ❌ DELETE CERTIFICATE
router.delete("/delete/:id", async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;