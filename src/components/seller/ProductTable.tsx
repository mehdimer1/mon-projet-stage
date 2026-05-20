"use client";

import { useState } from "react";
import Image from "next/image";
import { products as initialProducts } from "@/data/products";
import { Product } from "@/types/product";
import ProductFormModal from "./ProductFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    featured: "bg-blue-50 text-blue-800",
    new: "bg-green-50 text-green-800",
  };
  const dots: Record<string, string> = {
    featured: "bg-blue-600",
    new: "bg-green-600",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${styles[status] ?? "bg-zinc-100 text-zinc-600"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? "bg-zinc-400"}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  
 
  const [sortBy, setSortBy] = useState<keyof Product>("sales");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const itemsPerPage = 5;


  const sortProducts = (productsToSort: Product[]) => {
    return [...productsToSort].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  };

  
  const filteredProducts = products.filter((p) =>
    searchTerm === "" ||
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
  const sortedProducts = sortProducts(filteredProducts);

  // Pagination (utilise sortedProducts au lieu de filteredProducts)
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

 
  const handleSort = (column: keyof Product) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };


  const getSortIcon = (column: keyof Product) => {
    if (sortBy !== column) return " ↕️";
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  // Changement de page
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Gestion de la sélection
  const toggleSelect = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map(p => p.id));
    }
  };

  // Ajouter un produit
  const handleAddProduct = (newProduct: Omit<Product, "id">) => {
    const maxId = Math.max(...products.map(p => p.id), 0);
    const productWithId = {
      ...newProduct,
      id: maxId + 1,
    };
    setProducts([...products, productWithId]);
  };

  // Modifier un produit
  const handleEditProduct = (updatedProduct: Omit<Product, "id">) => {
    if (selectedProduct) {
      const updatedProducts = products.map(p =>
        p.id === selectedProduct.id
          ? { ...updatedProduct, id: selectedProduct.id }
          : p
      );
      setProducts(updatedProducts);
    }
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  // Supprimer un produit
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setSelectedProducts(selectedProducts.filter(id => id !== selectedProduct.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  // Suppression groupée
  const handleBulkDelete = () => {
    setProducts(products.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
    setIsDeleteModalOpen(false);
    setIsBulkDelete(false);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const openBulkDeleteModal = () => {
    if (selectedProducts.length === 0) return;
    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      {/* Barre de recherche et actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <input
          type="text"
          placeholder="Rechercher par titre, description ou catégorie..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-zinc-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="flex gap-3">
          {selectedProducts.length > 0 && (
            <button
              onClick={openBulkDeleteModal}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              Supprimer ({selectedProducts.length})
            </button>
          )}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Ajouter un produit
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-2xl overflow-hidden shadow-xl shadow-zinc-200/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <colgroup>
              <col className="w-10" />
              <col className="w-12" />
              <col className="w-48" />
              <col className="w-28" />
              <col />
              <col className="w-20" />
              <col className="w-20" />
              <col className="w-20" />
              <col className="w-24" />
              <col className="w-28" />
            </colgroup>

            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-zinc-200">
                <th className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-zinc-300 cursor-pointer"
                  />
                </th>
                {/* ✅ AJOUT : En-têtes avec tri */}
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-zinc-400 uppercase tracking-wide cursor-pointer hover:text-zinc-600" onClick={() => handleSort("image")}>
                  Image{getSortIcon("image")}
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-zinc-400 uppercase tracking-wide cursor-pointer hover:text-zinc-600" onClick={() => handleSort("title")}>
                  Produit{getSortIcon("title")}
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-zinc-400 uppercase tracking-wide hidden sm:table-cell">
                  Catégorie
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                  Description
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-zinc-400 uppercase tracking-wide cursor-pointer hover:text-zinc-600" onClick={() => handleSort("salePrice")}>
                  Prix{getSortIcon("salePrice")}
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-zinc-400 uppercase tracking-wide cursor-pointer hover:text-zinc-600" onClick={() => handleSort("rating")}>
                  Note{getSortIcon("rating")}
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-zinc-400 uppercase tracking-wide cursor-pointer hover:text-zinc-600" onClick={() => handleSort("sales")}>
                  Ventes{getSortIcon("sales")}
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                  Statut
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-zinc-500">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors">
                    <td className="px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="w-4 h-4 rounded border-zinc-300 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <Image
                        src={`${p.image}?w=72&h=72&fit=crop&auto=format`}
                        alt={p.title}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-md object-cover border border-zinc-200 block"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-zinc-900 truncate text-[13px]">{p.title}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{p.sales} ventes</p>
                    </td>
                    <td className="px-3 py-2.5 hidden sm:table-cell">
                      <span className="text-[11px] text-zinc-500 bg-zinc-100 border border-zinc-200 rounded-md px-2 py-1">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="text-xs text-zinc-500 truncate">{p.description}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-medium text-zinc-900 text-[13px]">${p.salePrice}</span>
                      <span className="block text-[11px] text-zinc-400 line-through">${p.originalPrice}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-[12px] font-medium text-zinc-800">{p.rating}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[13px] font-medium text-zinc-900">{p.sales}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(p)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => openDeleteModal(p)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Précédent
          </button>
          <span className="text-sm text-zinc-600">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Suivant
          </button>
        </div>
      )}

      <div className="text-center mt-4 text-xs text-zinc-400">
        {filteredProducts.length} produit(s) trouvé(s)
        {selectedProducts.length > 0 && ` - ${selectedProducts.length} sélectionné(s)`}
      </div>

      {/* Modales */}
      <ProductFormModal
        key="add"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
        mode="add"
      />

      {selectedProduct && (
        <ProductFormModal
          key={`edit-${selectedProduct.id}`}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleEditProduct}
          product={selectedProduct}
          mode="edit"
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
          setIsBulkDelete(false);
        }}
        onConfirm={isBulkDelete ? handleBulkDelete : handleDeleteProduct}
        product={selectedProduct}
        isBulk={isBulkDelete}
        count={selectedProducts.length}
      />
    </div>
  );
}