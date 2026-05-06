"use client";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black text-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 bg-black/30 backdrop-blur-md border-b border-white/10">
        <h1 className="text-lg font-semibold">
          🎓 Blockchain Certify
        </h1>

        <div className="flex gap-4">
          <a href="/verify" className="hover:text-indigo-400">Verify</a>
          <a href="/login" className="bg-indigo-600 px-4 py-1 rounded hover:bg-indigo-700">
            Admin
          </a>
        </div>
      </div>

      {/* HERO */}
      <div className="text-center mt-16 px-6">
        <h1 className="text-4xl font-bold mb-4">
          Secure Digital Certificate Platform
        </h1>

        <p className="text-gray-300 max-w-xl mx-auto">
          Issue, store and verify academic certificates using blockchain
          technology with complete transparency and security.
        </p>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-6 px-10 mt-16">

        <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg border border-white/10 hover:scale-105 transition">
          <h3 className="text-lg font-semibold mb-2">🔐 Tamper Proof</h3>
          <p className="text-gray-300 text-sm">
            Certificates stored on blockchain cannot be altered or forged.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg border border-white/10 hover:scale-105 transition">
          <h3 className="text-lg font-semibold mb-2">⚡ Fast Verification</h3>
          <p className="text-gray-300 text-sm">
            Verify authenticity instantly using transaction hash or QR code.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg border border-white/10 hover:scale-105 transition">
          <h3 className="text-lg font-semibold mb-2">📄 Smart Certificates</h3>
          <p className="text-gray-300 text-sm">
            Automatically generated PDFs with embedded verification links.
          </p>
        </div>

      </div>

      {/* ACTION SECTION */}
      <div className="flex flex-col md:flex-row justify-center gap-8 mt-20 px-6">

        {/* ADMIN CARD */}
        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 p-8 rounded-2xl w-full max-w-sm shadow-xl">
          <h2 className="text-xl font-bold mb-3">Admin Portal</h2>

          <p className="text-sm text-gray-200 mb-4">
            Authorized staff can issue and manage certificates securely.
          </p>

          <ul className="text-sm space-y-1 mb-6">
            <li>✔ Issue certificates</li>
            <li>✔ View records</li>
            <li>✔ Blockchain tracking</li>
          </ul>

          <a
            href="/login"
            className="block text-center bg-white text-black py-2 rounded font-semibold hover:bg-gray-200"
          >
            Login
          </a>
        </div>

        {/* VERIFY CARD */}
        <div className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-2xl w-full max-w-sm shadow-xl border border-white/10">
          <h2 className="text-xl font-bold mb-3">Public Verification</h2>

          <p className="text-sm text-gray-300 mb-4">
            Anyone can verify a certificate using its unique ID.
          </p>

          <ul className="text-sm space-y-1 mb-6">
            <li>✔ No login required</li>
            <li>✔ Instant results</li>
            <li>✔ Blockchain-backed</li>
          </ul>

          <a
            href="/verify"
            className="block text-center bg-indigo-600 py-2 rounded font-semibold hover:bg-indigo-700"
          >
            Verify Now
          </a>
        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-500 text-sm mt-20 pb-6">
        Built with Stellar Blockchain • Secure • Transparent
      </div>

    </div>
  );
}