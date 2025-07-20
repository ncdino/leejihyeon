"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/_store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkLoginStatus } = useAuthStore();

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return <>{children}</>;
}
