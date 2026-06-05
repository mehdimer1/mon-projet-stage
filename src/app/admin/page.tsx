"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { api } from "@/lib/api";
import type { ApiUser, ApiProduct, ApiOrder, ApiStats } from "@/lib/types";
import { snakeToCamel } from "@/lib/utils";
import type { Product } from "@/types/product";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "products" | "orders">("stats");
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.admin.stats().catch(() => ({ data: null })),
      api.admin.users().catch(() => ({ data: [] })),
      api.admin.products().catch(() => ({ data: [] })),
      api.admin.orders().catch(() => ({ data: [] })),
    ]).then(([statsRes, usersRes, productsRes, ordersRes]) => {
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProducts(snakeToCamel(productsRes.data) as Product[]);
      setOrders(ordersRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await api.admin.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await api.admin.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: status as ApiOrder["status"] } : o))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const statusLabels: Record<string, string> = {
    pending: "En attente", confirmed: "Confirmée", shipped: "Expédiée",
    delivered: "Livrée", cancelled: "Annulée",
  };

  const roleLabels: Record<string, string> = {
    buyer: "Acheteur", seller: "Vendeur", admin: "Admin",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-800">Administration</h1>
            <p className="text-zinc-500 mt-1">
              {user?.name} - {user?.email}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/buyer")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Boutique
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-white border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-zinc-500">Utilisateurs</p>
              <p className="text-3xl font-bold text-zinc-800">{stats.total_users}</p>
              <p className="text-xs text-zinc-400">{stats.sellers} vendeurs, {stats.admins} admins</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-zinc-500">Produits</p>
              <p className="text-3xl font-bold text-zinc-800">{stats.total_products}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-zinc-500">Commandes</p>
              <p className="text-3xl font-bold text-zinc-800">{stats.total_orders}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-zinc-500">Revenus</p>
              <p className="text-3xl font-bold text-green-600">${stats.total_revenue}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm border border-zinc-200">
          {["stats", "users", "products", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "text-zinc-600 hover:text-zinc-800"
              }`}
            >
              {tab === "stats" ? "Statistiques" : tab === "users" ? "Utilisateurs" : tab === "products" ? "Produits" : "Commandes"}
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-4 font-medium text-zinc-600">ID</th>
                  <th className="text-left p-4 font-medium text-zinc-600">Nom</th>
                  <th className="text-left p-4 font-medium text-zinc-600">Email</th>
                  <th className="text-left p-4 font-medium text-zinc-600">Rôle</th>
                  <th className="text-left p-4 font-medium text-zinc-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50">
                    <td className="p-4 text-zinc-600">#{u.id}</td>
                    <td className="p-4 font-medium text-zinc-800">{u.name}</td>
                    <td className="p-4 text-zinc-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        u.role === "admin" ? "bg-purple-100 text-purple-700" :
                        u.role === "seller" ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {roleLabels[u.role] || u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-4 font-medium text-zinc-600">ID</th>
                  <th className="text-left p-4 font-medium text-zinc-600">Titre</th>
                  <th className="text-left p-4 font-medium text-zinc-600">Catégorie</th>
                  <th className="text-left p-4 font-medium text-zinc-600">Prix</th>
                  <th className="text-left p-4 font-medium text-zinc-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50">
                    <td className="p-4 text-zinc-600">#{p.id}</td>
                    <td className="p-4 font-medium text-zinc-800">{p.title}</td>
                    <td className="p-4 text-zinc-600">{p.category}</td>
                    <td className="p-4 text-zinc-800">${p.salePrice}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm text-zinc-500">Commande #{order.id}</span>
                    <span className="ml-2 text-xs text-zinc-400">
                      {order.buyer_name} ({order.buyer_email})
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">${order.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="text-sm border border-zinc-200 rounded-lg px-2 py-1"
                    >
                      {Object.entries(statusLabels).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
