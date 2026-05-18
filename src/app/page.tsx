import ProductTable from "../components/seller/ProductTable";
export default function Home() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold p-8 text-zinc-800">
        Seller Dashboard
      </h1>

      <ProductTable />
    </main>
  );
}