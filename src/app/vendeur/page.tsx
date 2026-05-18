"use client";

import { useState } from "react";
import { AddProductButton } from "@/components/vendeur/Form-buttom";
import { ListeProduit } from "@/components/vendeur/ListeProduit";
import { SearchProducts } from "@/components/vendeur/SearchProducts";
import { Surface } from "@heroui/react";
import { Typography } from "@/components/ui/typography";

export default function VendeurPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const sellerId = "1";

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      <Surface className="p-6 rounded-xl" variant="default">
        <div className="flex flex-col gap-4">
          <Typography.H3 className="text-2xl font-semibold">
            Tableau de bord vendeur
          </Typography.H3>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <SearchProducts onSearch={setSearchQuery} />
            <AddProductButton sellerId={sellerId} />
          </div>
        </div>
      </Surface>
      {sellerId ? (
        <ListeProduit sellerId={sellerId} />
      ) : (
        <div className="text-muted text-center py-12">
          Aucun vendeur trouvé.
        </div>
      )}
    </div>
  );
}
