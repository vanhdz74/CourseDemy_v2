"use client";

import { motion } from "framer-motion";
import { Button } from "@/modules/shared/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage({
  title = "404",
  subtitle = "Page Not Found",
  description = "Sorry, the page you are looking for doesn’t exist or has been moved.",
  showHomeButton = true,
}) {
  const router = useRouter();

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl shadow-md bg-muted">
            <AlertTriangle className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight">{title}</h1>
          <h2 className="text-xl font-semibold">{subtitle}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {showHomeButton && (
          <Button
            onClick={handleHome}
            className="rounded-2xl shadow-sm px-6 py-2"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        )}
      </motion.div>
    </div>
  );
}
