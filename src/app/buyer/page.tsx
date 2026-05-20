"use client";

import { useState } from "react";
import ProductGrid from "@/components/buyer/ProductGrid";
import { products } from "@/data/products";

export default function BuyerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");


  const categories = ["Toutes", ...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-zinc-800 mb-2">
            🛍️ Boutique
          </h1>
          <p className="text-zinc-500">
            Découvrez nos produits sélectionnés pour vous
          </p>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="sticky top-[90px] z-10 bg-gradient-to-br from-slate-50 via-white to-blue-50 py-4 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtre par catégorie */}
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

      {/* Grille des produits */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductGrid searchTerm={searchTerm} categoryFilter={categoryFilter} />
      </div>
    </div>
  );
}