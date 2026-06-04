"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.auth.login(formData.email, formData.password);
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-800">Connexion</h1>
          <p className="text-zinc-500 mt-2">
            Connectez-vous à votre compte vendeur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Affichage de l'erreur */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="mb-2">
            <Input
              type={isVisible ? "text" : "password"}
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {/* Bouton afficher/masquer */}
          <div className="text-right mb-2">
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {isVisible ? "Masquer" : "Afficher"} le mot de passe
            </button>
          </div>

          {/* Lien mot de passe oublié */}
          <div className="text-right mb-6">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {/* Lien vers inscription */}
          <div className="text-center mt-6">
            <p className="text-sm text-zinc-500">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700">
                Créer un compte
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}