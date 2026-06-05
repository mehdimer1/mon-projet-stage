"use client";

import { RouterProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/contexts/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <RouterProvider navigate={router.push}>
      <AuthProvider>{children}</AuthProvider>
    </RouterProvider>
  );
}
