export interface Product {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  warranty: string;
  rating: number;
  sales: number;
  status: "new" | "featured";
}