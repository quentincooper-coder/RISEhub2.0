"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/access/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        cache: "no-store",
      });
      if (!response.ok) {
        setError(response.status === 503 ? "Access is temporarily unavailable." : "Incorrect password. Please try again.");
        return;
      }
      window.location.replace("/dashboard");
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f1f2f2] px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-[#dee1e0] bg-white px-8 py-10 shadow-xl">
        <div className="mb-9 flex flex-col items-center gap-4 text-center">
          <Image src="/SKODA-LOGO.png" width={96} height={48} alt="Škoda" priority className="h-auto w-24 object-contain" />
          <h1 className="text-3xl font-black tracking-tight text-[#0e3a2f]">RISE HUB 2.0</h1>
          <p className="text-sm text-[#5b655f]">Enter the project password to continue.</p>
        </div>
        <form onSubmit={login} className="space-y-5">
          <div>
            <label htmlFor="rise-password" className="mb-2 block text-sm font-semibold text-[#0e3a2f]">Password</label>
            <input id="rise-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-[#a9b0ac] bg-white px-4 py-3 text-[#14201b] outline-none focus:border-[#0e3a2f] focus:ring-2 focus:ring-[#78faae]" />
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#0e3a2f] px-4 py-3 font-semibold text-white hover:bg-[#14493b] disabled:opacity-60">
            {loading ? "Signing in..." : "Access RISE Hub"}
          </button>
        </form>
      </section>
    </main>
  );
}
