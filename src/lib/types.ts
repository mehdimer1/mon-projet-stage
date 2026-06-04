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

export interface ApiAuthData {
  user: { id: number; name: string; email: string };
  token: string;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
}

export interface ApiForgotPasswordResponse {
  reset_link?: string;
}
