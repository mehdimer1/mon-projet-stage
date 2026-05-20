"use client";

import { Product } from "@/types/product";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge de remise */}
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}
        {/* Badge de statut */}
        {product.status === "new" && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Nouveau
          </div>
        )}
        {product.status === "featured" && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Catégorie */}
        <div className="mb-2">
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Nom du produit */}
        <h3 className="font-semibold text-zinc-800 text-lg mb-1 line-clamp-1">
          {product.title}
        </h3>

        {/* Description courte */}
        <p className="text-sm text-zinc-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        

        {/* Prix */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${product.salePrice}
          </span>
          {product.originalPrice > product.salePrice && (
            <span className="text-sm text-zinc-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Garantie */}
        {product.warranty && (
          <div className="text-xs text-zinc-500 mb-3">
            🔒 Garantie : {product.warranty}
          </div>
        )}

        {/* Note */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-amber-500 fill-amber-500"
                    : "text-gray-300 fill-gray-300"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-zinc-600">({product.rating})</span>
        </div>

        {/* Bouton d'action */}
        <Link href={`/buyer/${product.id}`}>
          <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Voir détails
          </button>
        </Link>
      </div>
    </div>
  );
}