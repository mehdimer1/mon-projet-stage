"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductGrid from "@/components/buyer/ProductGrid";
import { api } from "@/lib/api";
import { snakeToCamel } from "@/lib/utils";
import type { Product } from "@/types/product";
import { useAuth } from "@/contexts/auth";

export default function BuyerPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    api.products.list().then((res) => {
      setProducts(snakeToCamel(res.data) as Product[]);
    }).catch(() => {
      setProducts([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const categories = ["Toutes", ...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-800">
              Marketplace
            </h1>
            <p className="text-zinc-500 text-sm">
              Découvrez nos produits
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-zinc-500">
                  {user?.name}
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {user?.role === "admin" ? "Admin" : "Vendeur"}
                  </span>
                </span>
                <Link
                  href={user?.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mon espace
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 border border-zinc-300 text-zinc-700 text-sm rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Espace vendeur
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-[73px] z-10 bg-gradient-to-br from-slate-50 via-white to-blue-50 py-4 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les catégories</option>
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-500">Chargement...</p>
          </div>
        ) : (
          <ProductGrid products={products} searchTerm={searchTerm} categoryFilter={categoryFilter} />
        )}
      </div>
    </div>
  );
}