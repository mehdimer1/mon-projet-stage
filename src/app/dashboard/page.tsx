"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductTable from "../../components/seller/ProductTable";
import SellerOrders from "../../components/seller/SellerOrders";
import { useAuth } from "@/contexts/auth";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center p-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-800">
            Tableau de bord vendeur
          </h1>
          {user && (
            <p className="text-sm text-zinc-500 mt-1">
              Connecté en tant que {user.name}
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Vendeur
              </span>
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            href="/buyer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir la boutique
          </Link>

          <button
            onClick={logout}
            className="px-4 py-2 bg-white border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
      <ProductTable />
      <div className="px-8 pb-8">
        <SellerOrders />
      </div>
    </main>
  );
}