"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import type { ApiOrder } from "@/lib/types";

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string; icon: string }> = {
  pending:    { label: "En attente",   bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
  confirmed:  { label: "Confirmée",    bg: "bg-blue-50",  text: "text-blue-700",  dot: "bg-blue-500",  icon: "M5 13l4 4L19 7" },
  shipped:    { label: "Expédiée",     bg: "bg-purple-50",text: "text-purple-700",dot: "bg-purple-500",icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  delivered:  { label: "Livrée",       bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  cancelled:  { label: "Annulée",      bg: "bg-red-50",   text: "text-red-700",   dot: "bg-red-500",   icon: "M6 18L18 6M6 6l12 12" },
};

const statusOrder = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${mins}`;
}

function StatusIcon({ icon }: { icon: string }) {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
    </svg>
  );
}

export default function SellerOrders() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.orders.list()
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.total), 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    return { total, revenue, pending, delivered };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filterStatus !== "all" && o.status !== filterStatus) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesId = String(o.id).includes(q);
        const matchesName = o.buyer_name?.toLowerCase().includes(q);
        const matchesEmail = o.buyer_email?.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesEmail) return false;
      }
      return true;
    });
  }, [orders, filterStatus, searchTerm]);

  const loadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-zinc-200 rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-4 w-12 bg-zinc-200 rounded" />
            <div className="h-4 w-32 bg-zinc-200 rounded" />
            <div className="h-5 w-24 bg-zinc-200 rounded-full" />
            <div className="ml-auto h-5 w-16 bg-zinc-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  const emptyState = () => (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-zinc-800 mb-1">Aucune commande</h3>
      <p className="text-sm text-zinc-500">Les commandes de vos produits apparaîtront ici.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-800">
          Commandes
          {orders.length > 0 && (
            <span className="ml-2 text-sm font-normal text-zinc-400">({orders.length})</span>
          )}
        </h2>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-zinc-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Revenu</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">${stats.revenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">En attente</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Livrées</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.delivered}</p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === "all"
                ? "bg-zinc-800 text-white"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            Toutes
          </button>
          {statusOrder.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                filterStatus === s
                  ? `${statusConfig[s].bg} ${statusConfig[s].text} ring-1 ring-inset ring-current/20`
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[s].dot}`} />
              {statusConfig[s].label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par ID, nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        loadingSkeleton()
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm">
          {emptyState()}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const isExpanded = expanded === order.id;
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-zinc-200 overflow-hidden transition-all duration-200 hover:border-zinc-300 hover:shadow-sm"
              >
                {/* Order header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-zinc-50/50 transition-colors text-left"
                >
                  {/* Status timeline dot */}
                  <div className={`hidden sm:flex w-8 h-8 rounded-full items-center justify-center ${status.bg}`}>
                    <svg className={`w-4 h-4 ${status.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={status.icon} />
                    </svg>
                  </div>

                  {/* Order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-800">#{order.id}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-500">{order.buyer_name}</span>
                      <span className="text-zinc-300">·</span>
                      <span className="text-xs text-zinc-400">{formatDate(order.created_at)}</span>
                    </div>
                  </div>

                  {/* Total + chevron */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">${Number(order.total).toFixed(2)}</p>
                      {order.items && (
                        <p className="text-[11px] text-zinc-400">{order.items.length} article{order.items.length > 1 ? "s" : ""}</p>
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-zinc-100 bg-zinc-50/50">
                    {/* Buyer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                      <div>
                        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-1">Client</p>
                        <p className="text-sm font-medium text-zinc-800">{order.buyer_name}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-1">Email</p>
                        <p className="text-sm text-zinc-700 truncate">{order.buyer_email}</p>
                      </div>
                      {order.buyer_phone && (
                        <div>
                          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-1">Téléphone</p>
                          <p className="text-sm text-zinc-700">{order.buyer_phone}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-1">Date</p>
                        <p className="text-sm text-zinc-700">{formatDate(order.created_at)}</p>
                      </div>
                    </div>

                    {order.buyer_address && (
                      <div className="px-4 pb-2">
                        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-1">Adresse de livraison</p>
                        <p className="text-sm text-zinc-700 bg-white rounded-lg border border-zinc-200 p-3">{order.buyer_address}</p>
                      </div>
                    )}

                    {/* Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="px-4 pb-4">
                        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-2">Articles</p>
                        <div className="space-y-1.5">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 bg-white rounded-lg border border-zinc-200 p-2.5">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title || ""}
                                  className="w-10 h-10 rounded-md object-cover bg-zinc-100 border border-zinc-100"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-md bg-zinc-100 border border-zinc-100 flex items-center justify-center text-xs text-zinc-400 font-medium">
                                  {item.title?.charAt(0).toUpperCase() || "P"}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-800 truncate">{item.title || `Produit #${item.product_id}`}</p>
                                <p className="text-xs text-zinc-500">
                                  {item.quantity} × ${Number(item.price).toFixed(2)}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-zinc-800">${(item.quantity * Number(item.price)).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Order total */}
                        <div className="flex justify-end mt-3 pt-3 border-t border-zinc-200">
                          <div className="text-right">
                            <p className="text-xs text-zinc-500">Total de la commande</p>
                            <p className="text-lg font-bold text-blue-600">${Number(order.total).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Results count */}
      {!loading && filteredOrders.length > 0 && (
        <p className="text-xs text-zinc-400 text-center">
          {filteredOrders.length} commande{filteredOrders.length > 1 ? "s" : ""}
          {filterStatus !== "all" && ` (${statusConfig[filterStatus].label.toLowerCase()})`}
          {searchTerm && ` correspondant à "${searchTerm}"`}
        </p>
      )}
    </div>
  );
}
