"use client";

import { useParams, useRouter } from "next/navigation";
import { products } from "@/data/products";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const productId = parseInt(id as string);
  const product = products.find((p) => p.id === productId) || null;

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Produit non trouvé</p>
          <Link href="/buyer" className="text-blue-600 hover:underline">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Bouton retour */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-zinc-600 hover:text-zinc-800 transition-colors"
        >
          ← Retour
        </button>

        {/* Détail produit */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image */}
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-slate-100">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Infos produit */}
            <div>
              {/* Catégorie */}
              <div className="mb-4">
                <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Titre */}
              <h1 className="text-3xl font-bold text-zinc-800 mb-4">
                {product.title}
              </h1>

              {/* Description complète */}
              <p className="text-zinc-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Prix */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-blue-600">
                    ${product.salePrice}
                  </span>
                  {product.originalPrice > product.salePrice && (
                    <span className="text-lg text-zinc-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-sm text-green-600 font-medium">
                      Économisez ${product.originalPrice - product.salePrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Garantie */}
              {product.warranty && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-700">
                    🔒 Garantie : {product.warranty}
                  </span>
                </div>
              )}

              {/* Note */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
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
                <span className="text-zinc-600">
                  {product.rating} / 5
                </span>
                <span className="text-zinc-400">
                  ({product.sales} ventes)
                </span>
              </div>

              {/* Bouton action */}
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Ajouter au panier 🛒
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}