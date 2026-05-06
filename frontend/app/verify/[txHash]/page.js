"use client";
import { useEffect, useState, use } from "react";

export default function Verify({ params }) {
  const { txHash } = use(params); // ✅ FIX

  const [data, setData] = useState(null);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/cert/verify/${txHash}`)
      .then(res => res.json())
      .then(res => {
        setValid(res.valid);
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [txHash]);

  if (loading) return <p className="text-white p-10">Loading...</p>;

  if (!valid) {
    return (
      <div className="text-red-500 p-10">
        ❌ Invalid Certificate
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-xl w-96">

        <h2 className="text-2xl mb-4 text-green-400 text-center">
          ✅ Certificate Verified
        </h2>

        <p><b>Name:</b> {data.name}</p>
        <p><b>Course:</b> {data.course}</p>
        <p><b>Date:</b> {data.date}</p>

      </div>
    </div>
  );
}
