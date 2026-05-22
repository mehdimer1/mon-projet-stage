"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@heroui/react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    
    setIsSubmitted(true);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">Lien invalide ou expiré</p>
          <Link href="/forgot-password" className="text-blue-600">
            Retour à la page de réinitialisation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-800">Nouveau mot de passe</h1>
          <p className="text-zinc-500 mt-2">
            Entrez votre nouveau mot de passe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {!isSubmitted ? (
            <>
              <div className="mb-4">
                <Input
                  type={isVisible ? "text" : "password"}
                  placeholder="Nouveau mot de passe"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <Input
                  type={isVisible ? "text" : "password"}
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              {/* Bouton afficher/masquer mot de passe */}
              <div className="text-right mb-6">
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {isVisible ? "Masquer" : "Afficher"} le mot de passe
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Réinitialiser
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
                Mot de passe modifié !
              </h2>
              <p className="text-zinc-500 mb-6">
                Votre mot de passe a été réinitialisé avec succès.
              </p>
              <Link href="/login">
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Se connecter
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}