import type { ApiProduct, ApiAuthData, ApiUser, ApiForgotPasswordResponse } from "./types";

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
    register: (name: string, email: string, password: string) =>
      request<ApiAuthData>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
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
  },
};
