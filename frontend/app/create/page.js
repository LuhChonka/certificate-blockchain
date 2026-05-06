"use client";
import { useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";

export default function Create() {
  const [qr, setQr] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 CREATE CERTIFICATE
  const createCert = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/cert/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, course }),
      });

      const data = await res.json();

      setTxHash(data.txHash);

      // 🔥 Generate PDF
      await generatePDF(name, course, data.txHash);

      // 🔥 Generate QR for UI
      const verifyUrl = `http://localhost:3000/verify/${data.txHash}`;
      const qrImage = await QRCode.toDataURL(verifyUrl);
      setQr(qrImage);

    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  // 🔥 PRETTY PDF
  const generatePDF = async (name, course, txHash) => {
    const doc = new jsPDF();

    // Border
    doc.setDrawColor(100);
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("CERTIFICATE OF COMPLETION", 105, 50, { align: "center" });

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("This is proudly presented to", 105, 80, { align: "center" });

    // Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(name, 105, 100, { align: "center" });

    // Course
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("for successfully completing the course", 105, 120, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(course, 105, 135, { align: "center" });

    // Date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 20, 180);

    // TX Hash
    doc.setFontSize(8);
    doc.text("Transaction Hash:", 20, 200);
    doc.text(txHash, 20, 210, { maxWidth: 170 });

    // QR inside PDF
    const verifyUrl = `http://localhost:3000/verify/${txHash}`;
    const qr = await QRCode.toDataURL(verifyUrl);
    doc.addImage(qr, "PNG", 150, 180, 40, 40);

    // Signature
    doc.line(140, 250, 190, 250);
    doc.setFontSize(10);
    doc.text("Authorized Signature", 145, 260);

    // Footer
    doc.setFontSize(10);
    doc.text("Verified on Stellar Blockchain", 105, 270, { align: "center" });

    doc.save(`${name}_certificate.pdf`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txHash);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20">

        <h1 className="text-3xl font-bold text-center mb-6">
          🎓 Create Certificate
        </h1>

        <input
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-600"
          placeholder="Student Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 border border-gray-600"
          placeholder="Course Name"
          onChange={(e) => setCourse(e.target.value)}
        />

        <button
          onClick={createCert}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold"
        >
          {loading ? "⏳ Processing..." : "🚀 Generate Certificate"}
        </button>

        {/* TX HASH */}
        {txHash && (
          <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-700">

            <p className="text-sm text-gray-400 mb-2">
              Transaction Hash:
            </p>

            <p className="text-xs break-all text-green-400">
              {txHash}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-green-600 py-2 rounded-lg"
              >
                📋 Copy
              </button>

              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                className="flex-1 bg-blue-600 py-2 rounded-lg text-center"
              >
                🔗 View
              </a>
            </div>

          </div>
        )}

        {/* QR CODE */}
        {qr && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 mb-2">Scan to Verify</p>
            <img src={qr} alt="QR Code" className="mx-auto w-40" />
          </div>
        )}

      </div>
    </div>
  );
}