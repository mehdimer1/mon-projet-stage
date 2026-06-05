import type { ApiProduct, ApiAuthData, ApiUser, ApiForgotPasswordResponse, ApiOrder, ApiStats } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Something went wrong");
  }

  return json;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<ApiAuthData>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (name: string, email: string, password: string, role?: string) =>
      request<ApiAuthData>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      }),
    me: () => request<ApiUser>("/auth/me"),
    logout: () => request<null>("/auth/logout", { method: "POST" }),
    forgotPassword: (email: string) =>
      request<ApiForgotPasswordResponse>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    resetPassword: (token: string, password: string) =>
      request<null>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      }),
  },
  products: {
    list: (params?: { category?: string; status?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set("category", params.category);
      if (params?.status) searchParams.set("status", params.status);
      if (params?.search) searchParams.set("search", params.search);
      const qs = searchParams.toString();
      return request<ApiProduct[]>(`/products${qs ? `?${qs}` : ""}`);
    },
    get: (id: number) => request<ApiProduct>(`/products/${id}`),
    create: (data: Record<string, unknown>) =>
      request<ApiProduct>("/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Record<string, unknown>) =>
      request<ApiProduct>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<null>(`/products/${id}`, { method: "DELETE" }),
    bulkDelete: (ids: number[]) =>
      request<{ deleted: number }>("/products/bulk-delete", {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      }),
    myProducts: (params?: { search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set("search", params.search);
      const qs = searchParams.toString();
      return request<ApiProduct[]>(`/products${qs ? `?${qs}` : ""}`);
    },
  },
  wishlist: {
    list: () => request<ApiProduct[]>("/wishlist"),
    toggle: (productId: number) =>
      request<{ wishlisted: boolean }>("/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ product_id: productId }),
      }),
    check: (productId: number) =>
      request<{ wishlisted: boolean }>(`/wishlist/check/${productId}`),
  },
  orders: {
    list: () => request<ApiOrder[]>("/orders"),
    get: (id: number) => request<ApiOrder>(`/orders/${id}`),
    create: (items: { product_id: number; quantity?: number }[], buyerName?: string, buyerEmail?: string, buyerPhone?: string, buyerAddress?: string) =>
      request<ApiOrder>("/orders", {
        method: "POST",
        body: JSON.stringify({ items, buyer_name: buyerName, buyer_email: buyerEmail, buyer_phone: buyerPhone, buyer_address: buyerAddress }),
      }),
  },
  admin: {
    stats: () => request<ApiStats>("/admin/stats"),
    users: (params?: { role?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.role) searchParams.set("role", params.role);
      if (params?.search) searchParams.set("search", params.search);
      const qs = searchParams.toString();
      return request<ApiUser[]>(`/admin/users${qs ? `?${qs}` : ""}`);
    },
    updateUserRole: (id: number, role: string) =>
      request<null>(`/admin/users/${id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role }),
      }),
    deleteUser: (id: number) =>
      request<null>(`/admin/users/${id}`, { method: "DELETE" }),
    products: () => request<ApiProduct[]>("/admin/products"),
    deleteProduct: (id: number) =>
      request<null>(`/admin/products/${id}`, { method: "DELETE" }),
    orders: () => request<ApiOrder[]>("/admin/orders"),
    updateOrderStatus: (id: number, status: string) =>
      request<null>(`/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
  },
};
