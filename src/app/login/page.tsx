"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@heroui/react";
import { useAuth } from "@/contexts/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
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
      const user = await login(formData.email, formData.password);
      const redirect = searchParams.get("redirect") || (
        user.role === "admin" ? "/admin" : "/dashboard"
      );
      router.push(redirect);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <p className="text-sm text-zinc-500 mb-6 text-center">
        Espace réservé aux vendeurs et administrateurs
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4">
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="mb-2">
        <Input
          type={isVisible ? "text" : "password"}
          placeholder="Mot de passe"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>

      <div className="text-right mb-2">
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {isVisible ? "Masquer" : "Afficher"} le mot de passe
        </button>
      </div>

      <div className="text-right mb-6">
        <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
          Mot de passe oublié ?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>

      <div className="text-center mt-6">
        <p className="text-sm text-zinc-500">
          Pas encore de compte vendeur ?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700">
            Créer un espace vendeur
          </Link>
        </p>
        <p className="text-sm text-zinc-400 mt-2">
          <Link href="/buyer" className="hover:text-blue-600">
            Retour à la boutique
          </Link>
        </p>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-800">Connexion vendeur</h1>
          <p className="text-zinc-500 mt-2">
            Accédez à votre espace de vente
          </p>
        </div>
        <Suspense fallback={<div className="text-center py-8 text-zinc-500">Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}