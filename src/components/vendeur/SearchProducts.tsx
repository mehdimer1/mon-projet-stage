'use client';

import { Input } from '@heroui/react';

interface SearchProductsProps {
  onSearch?: (query: string) => void;
}

export function SearchProducts({ onSearch }: SearchProductsProps) {
  return (
    <Input
      className="w-full sm:max-w-[280px]"
      placeholder="Rechercher des produits..."
      type="search"
      onChange={(e) => onSearch?.(e.target.value)}
    />
  );
}