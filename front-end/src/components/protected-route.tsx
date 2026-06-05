"use client";

// Phân quyền FE
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const storedRole = session?.user?.role;

    if (!storedRole || !allowedRoles.includes(storedRole)) {
      router.push("/login"); // không có quyền thì về login
    } else {
      setRole(storedRole);
    }
  }, [allowedRoles, router, session?.user?.role, status]);

  if (!role) return <p>Đang kiểm tra quyền...</p>;

  return <>{children}</>;
}
