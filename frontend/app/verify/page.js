"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyHome() {
  const [txHash, setTxHash] = useState("");
  const router = useRouter();

  const handleVerify = () => {
    if (!txHash) return alert("Enter transaction hash");
    router.push(`/verify/${txHash}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-xl w-96 text-center">

        <h2 className="text-2xl mb-4">Verify Certificate</h2>

        <input
          placeholder="Enter Transaction Hash"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-600"
        />

        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
        >
          Verify
        </button>

      </div>
    </div>
  );
}