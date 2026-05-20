"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id">) => void;
  product?: Product | null;
  mode: "add" | "edit";
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  product,
  mode,
}: ProductFormModalProps) {
  const defaultFormState = {
    title: "",
    category: "",
    description: "",
    salePrice: 0,
    originalPrice: 0,
    discount: 0,
    warranty: "",
    rating: 0,
    sales: 0,
    status: "new" as const,
    image: "",
  };

  const initialData = mode === "edit" && product
    ? {
        title: product.title,
        category: product.category,
        description: product.description,
        salePrice: product.salePrice,
        originalPrice: product.originalPrice,
        discount: product.discount,
        warranty: product.warranty,
        rating: product.rating,
        sales: product.sales,
        status: product.status as "new" | "featured",
        image: product.image,
      }
    : defaultFormState;

  const [formData, setFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(
    mode === "edit" && product ? product.image : ""
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setFormData({ ...formData, image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="sticky top-0 bg-white border-b border-zinc-200 px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-zinc-800">
            {mode === "add" ? "Ajouter un produit" : "Modifier le produit"}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-6 text-zinc-400 hover:text-zinc-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Upload image avec preview */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Image du produit
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-lg object-cover border border-zinc-200"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1 text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Nom du produit */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Nom du produit *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Catégorie *
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prix et remise */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Prix de vente ($) *
              </label>
              <input
                type="number"
                required
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Prix original ($)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Remise (%)
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Garantie
              </label>
              <input
                type="text"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Lifetime, 6 months..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Note /5
              </label>
              <input
                type="number"
                step="0.1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Ventes
              </label>
              <input
                type="number"
                value={formData.sales}
                onChange={(e) => setFormData({ ...formData, sales: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "new" | "featured" })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="new">Nouveau</option>
              <option value="featured">Featured</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === "add" ? "Ajouter" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}