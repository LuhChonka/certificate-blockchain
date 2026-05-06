"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

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

      if (!data.txHash) {
        throw new Error("Transaction hash not received");
      }

      setTxHash(data.txHash);

      // 🔥 Generate PDF
      await generatePDF(name, course, data.txHash);

      // 🔥 Generate QR for UI
      const verifyUrl = `http://localhost:3000/verify/${data.txHash}`;

      const qrImage = await QRCode.toDataURL(verifyUrl, {
        width: 300,
        margin: 2,
      });

      setQr(qrImage);

    } catch (err) {
      console.error("ERROR:", err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  // 🔥 PDF GENERATION
  const generatePDF = async (name, course, txHash) => {
    try {
      const doc = new jsPDF();

      // Border
      doc.setDrawColor(100);
      doc.setLineWidth(2);
      doc.rect(10, 10, 190, 277);

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("CERTIFICATE OF COMPLETION", 105, 50, {
        align: "center",
      });

      // Subtitle
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text("This is proudly presented to", 105, 80, {
        align: "center",
      });

      // Student Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(name, 105, 100, {
        align: "center",
      });

      // Course
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text("for successfully completing the course", 105, 120, {
        align: "center",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(course, 105, 135, {
        align: "center",
      });

      // Date
      const date = new Date().toLocaleDateString();

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Date: ${date}`, 20, 180);

      // Transaction Hash
      doc.setFontSize(8);
      doc.text("Transaction Hash:", 20, 200);

      doc.text(txHash, 20, 210, {
        maxWidth: 160,
      });

      // 🔥 QR CODE IN PDF
      const verifyUrl = `http://localhost:3000/verify/${txHash}`;

      const qrCodeImage = await QRCode.toDataURL(verifyUrl, {
        width: 200,
        margin: 2,
      });

      doc.addImage(qrCodeImage, "PNG", 145, 170, 45, 45);

      // Signature
      doc.line(140, 250, 190, 250);

      doc.setFontSize(10);
      doc.text("Authorized Signature", 145, 260);

      // Footer
      doc.setFontSize(10);

      doc.text("Verified on Stellar Blockchain", 105, 270, {
        align: "center",
      });

      // 🔥 DOWNLOAD PDF
      const pdfBlob = doc.output("blob");
const pdfUrl = URL.createObjectURL(pdfBlob);

window.open(pdfUrl, "_blank");

      console.log("PDF downloaded successfully");

    } catch (err) {
      console.error("PDF ERROR:", err);
      alert("PDF generation failed");
    }
  };

  // COPY TX HASH
  const copyToClipboard = () => {
    navigator.clipboard.writeText(txHash);
    alert("Transaction hash copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 flex items-center justify-center text-white">

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20">

        <h1 className="text-3xl font-bold text-center mb-6">
          🎓 Create Certificate
        </h1>

        <input
          type="text"
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-600"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 border border-gray-600"
          placeholder="Course Name"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <button
          onClick={createCert}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition"
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
                className="flex-1 bg-green-600 py-2 rounded-lg hover:bg-green-700"
              >
                📋 Copy
              </button>

              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-blue-600 py-2 rounded-lg text-center hover:bg-blue-700"
              >
                🔗 View
              </a>

            </div>

          </div>
        )}

        {/* QR CODE */}
        {qr && (
          <div className="mt-6 text-center">

            <p className="text-sm text-gray-400 mb-2">
              Scan to Verify
            </p>

            <img
              src={qr}
              alt="QR Code"
              className="mx-auto w-40 bg-white p-2 rounded-lg"
            />

          </div>
        )}

      </div>

    </div>
  );
}