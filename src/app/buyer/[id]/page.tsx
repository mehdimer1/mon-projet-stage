"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { api } from "@/lib/api";
import { snakeToCamel } from "@/lib/utils";
import { Product } from "@/types/product";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [form, setForm] = useState({
    buyer_name: "",
    buyer_email: "",
    buyer_phone: "",
    buyer_address: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const productId = parseInt(id as string);
    api.products.get(productId).then((res) => {
      setProduct(snakeToCamel(res.data) as Product);
    }).catch(() => {
      setProduct(null);
    }).finally(() => {
      setLoading(false);
    });
  }, [id]);

  const handleBuyClick = () => {
    setShowCheckout(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.buyer_name.trim() || !form.buyer_email.trim()) {
      setFormError("Nom et email sont requis");
      return;
    }

    if (!product) return;

    setPurchasing(true);
    try {
      const res = await api.orders.create(
        [{ product_id: product.id }],
        form.buyer_name,
        form.buyer_email,
        form.buyer_phone,
        form.buyer_address
      );
      setOrderId(res.data.id);
      setPurchased(true);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Erreur lors de l'achat");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Produit non trouvé</p>
          <Link href="/buyer" className="text-blue-600 hover:underline">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-zinc-600 hover:text-zinc-800 transition-colors"
        >
          Retour
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-slate-100">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full">
                  -{product.discount}%
                </div>
              )}
            </div>

            <div>
              <div className="mb-4">
                <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-zinc-800 mb-4">
                {product.title}
              </h1>

              <p className="text-zinc-600 mb-6 leading-relaxed">
                {product.description}
              </p>

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

              {product.warranty && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-700">
                    Garantie : {product.warranty}
                  </span>
                </div>
              )}

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

              {purchased ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">Commande confirmée !</div>
                  <p className="text-green-700 mb-2">
                    Votre commande #{orderId} a été enregistrée.
                  </p>
                  <p className="text-sm text-green-600">
                    Un email de confirmation sera envoyé à {form.buyer_email}
                  </p>
                  <button
                    onClick={() => router.push("/buyer")}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Retour à la boutique
                  </button>
                </div>
              ) : showCheckout ? (
                <form onSubmit={handleCheckout} className="space-y-4 border-t pt-6">
                  <h3 className="font-semibold text-zinc-800">Vos informations</h3>

                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                      {formError}
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      placeholder="Nom complet *"
                      value={form.buyer_name}
                      onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email *"
                      value={form.buyer_email}
                      onChange={(e) => setForm({ ...form, buyer_email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      value={form.buyer_phone}
                      onChange={(e) => setForm({ ...form, buyer_phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Adresse de livraison"
                      value={form.buyer_address}
                      onChange={(e) => setForm({ ...form, buyer_address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 py-2.5 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={purchasing}
                      className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {purchasing ? "Achat en cours..." : `Confirmer l'achat (${product.salePrice}$)`}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={handleBuyClick}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Acheter maintenant
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}