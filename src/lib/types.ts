export interface ApiProduct {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  sale_price: number;
  original_price: number;
  discount: number;
  warranty: string;
  rating: number;
  sales: number;
  status: "new" | "featured";
  image: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = "seller" | "admin";

export interface ApiAuthData {
  user: { id: number; name: string; email: string; role: UserRole };
  token: string;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface ApiForgotPasswordResponse {
  reset_link?: string;
}

export interface ApiOrder {
  id: number;
  user_id: number;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  buyer_address?: string;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
  items?: ApiOrderItem[];
  user_name?: string;
  user_email?: string;
}

export interface ApiOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  title?: string;
  image?: string;
}

export interface ApiWishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  [key: string]: unknown;
}

export interface ApiStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  sellers: number;
  admins: number;
}
