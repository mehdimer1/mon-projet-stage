import Link from "next/link";
import ProductTable from "../components/seller/ProductTable";

export default function Home() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center p-8">
        <h1 className="text-3xl font-bold text-zinc-800">
          Seller Dashboard
        </h1>
        <Link
          href="/buyer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🛍️ Voir la boutique
        </Link>
      </div>
      <ProductTable />
    </main>
  );
}