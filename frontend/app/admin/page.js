"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

export default function Admin() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [certs, setCerts] = useState([]);
  const router = useRouter();

  // AUTH CHECK
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const isAuth = localStorage.getItem("auth");

        if (isAuth !== "true") {
          router.push("/login");
        }
      }
    };

    setTimeout(checkAuth, 0);
  }, []);

  // FETCH CERTIFICATES
  const fetchCerts = async () => {
    try {
      const res = await fetch("http://localhost:5000/cert/all");

      const data = await res.json();

      setCerts(data);
    } catch (err) {
      console.error("Error fetching certificates:", err);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  // ISSUE CERTIFICATE
  const issueCert = async () => {
    if (!name || !course) {
      alert("Please fill all fields");
      return;
    }

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
        throw new Error("Transaction hash missing");
      }

      // =========================
      // PDF GENERATION
      // =========================

      const doc = new jsPDF();

      // BORDER
      doc.setDrawColor(100);
      doc.setLineWidth(2);
      doc.rect(10, 10, 190, 277);

      // TITLE
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);

      doc.text("CERTIFICATE OF COMPLETION", 105, 50, {
        align: "center",
      });

      // SUBTITLE
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);

      doc.text("This certificate is proudly awarded to", 105, 80, {
        align: "center",
      });

      // STUDENT NAME
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);

      doc.text(name, 105, 105, {
        align: "center",
      });

      // COURSE
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);

      doc.text("for successfully completing the course", 105, 125, {
        align: "center",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);

      doc.text(course, 105, 140, {
        align: "center",
      });

      // DATE
      const date = new Date().toLocaleDateString();

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);

      doc.text(`Date: ${date}`, 20, 180);

      // TX HASH
      doc.setFontSize(8);

      doc.text("Transaction Hash:", 20, 200);

      doc.text(data.txHash, 20, 210, {
        maxWidth: 160,
      });

      // QR CODE
      const verifyUrl = `http://localhost:3000/verify/${data.txHash}`;

      const qrImage = await QRCode.toDataURL(verifyUrl, {
        width: 200,
        margin: 2,
      });

      doc.addImage(qrImage, "PNG", 145, 170, 45, 45);

      // SIGNATURE
      doc.line(140, 250, 190, 250);

      doc.setFontSize(10);

      doc.text("Authorized Signature", 145, 260);

      // FOOTER
      doc.setFontSize(10);

      doc.text("Verified on Stellar Blockchain", 105, 270, {
        align: "center",
      });

      // OPEN PDF IN NEW TAB
      doc.save(`${name}_certificate.pdf`);

      // SUCCESS
      alert("Certificate Issued Successfully");

      setName("");
      setCourse("");

      fetchCerts();

    } catch (err) {
      console.error("Error issuing certificate:", err);
      alert("Certificate generation failed");
    }
  };

  // DELETE CERTIFICATE
  const deleteCert = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this certificate?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/cert/delete/${id}`, {
        method: "DELETE",
      });

      fetchCerts();
    } catch (err) {
      console.error("Error deleting certificate:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Professor Dashboard
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("auth");
            router.push("/login");
          }}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">

        <div className="bg-gray-800 p-4 rounded-xl text-center shadow">
          <p className="text-gray-400">Total Certificates</p>

          <h2 className="text-2xl font-bold">
            {certs.length}
          </h2>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl text-center shadow">
          <p className="text-gray-400">Latest Course</p>

          <h2 className="text-lg">
            {certs[0]?.course || "-"}
          </h2>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl text-center shadow">
          <p className="text-gray-400">Status</p>

          <h2 className="text-green-400">
            Active
          </h2>
        </div>

      </div>

      {/* ISSUE SECTION */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8 max-w-md mx-auto shadow-lg border border-gray-700">

        <h2 className="text-xl mb-4 text-center">
          Issue Certificate
        </h2>

        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={issueCert}
          className="w-full bg-green-600 py-3 rounded font-semibold hover:scale-105 transition"
        >
          Issue Certificate
        </button>

      </div>

      {/* CERTIFICATE LIST */}
      <div className="max-w-5xl mx-auto">

        <h2 className="text-xl mb-4">
          Issued Certificates
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          {certs.map((c) => (
            <div
              key={c._id}
              className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow hover:scale-[1.02] transition"
            >

              <p>
                <b>Name:</b> {c.name}
              </p>

              <p>
                <b>Course:</b> {c.course}
              </p>

              <p className="text-xs break-all text-green-400 mt-2">
                {c.txHash}
              </p>

              <div className="flex gap-2 mt-3 flex-wrap">

                <a
                  href={`/verify/${c.txHash}`}
                  className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                >
                  Verify
                </a>

                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${c.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-purple-600 px-3 py-1 rounded hover:bg-purple-700"
                >
                  Blockchain
                </a>

                <button
                  onClick={() => deleteCert(c._id)}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}