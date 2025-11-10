"use client";

// Phân quyền FE
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const storedRole = user?.role;

    if (!storedRole || !allowedRoles.includes(storedRole)) {
      router.push("/login"); // không có quyền thì về login
    } else {
      setRole(storedRole);
    }
  }, [allowedRoles, router]);

  if (!role) return <p>Đang kiểm tra quyền...</p>;

  return <>{children}</>;
}
