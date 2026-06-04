"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@heroui/react";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.auth.forgotPassword(email);
      if (res.data?.reset_link) {
        setResetLink(res.data.reset_link);
      }
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-800">Mot de passe oublié</h1>
          <p className="text-zinc-500 mt-2">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {!isSubmitted ? (
            <>
              <div className="mb-6">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Envoi en cours..." : "Envoyer le lien"}
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4 text-green-600">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-zinc-800 mb-2">
                Email envoyé !
              </h2>
              <p className="text-zinc-500 mb-6">
                Un lien de réinitialisation a été envoyé à {email}
              </p>
              {resetLink && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2 font-medium">Mode debug - Lien de réinitialisation :</p>
                  <a
                    href={resetLink}
                    className="text-sm text-blue-600 underline break-all hover:text-blue-800"
                  >
                    {resetLink}
                  </a>
                </div>
              )}
              <Link href="/login">
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Retour à la connexion
                </button>
              </Link>
            </div>
          )}

          <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700">
              ← Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}