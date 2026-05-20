"use client";

import { products } from "@/data/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  searchTerm?: string;
  categoryFilter?: string;
}

export default function ProductGrid({ searchTerm = "", categoryFilter = "" }: ProductGridProps) {
  // Filtrer les produits
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Affichage du nombre de produits */}
      <div className="mb-6 text-sm text-zinc-500">
        {filteredProducts.length} produit(s) trouvé(s)
      </div>

      {/* Grille des produits */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-zinc-500">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}