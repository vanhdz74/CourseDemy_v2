"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const pathname = usePathname();

  if (pathname.includes("/home")) {
    localStorage.removeItem("select");
  }

  const saveCategoryName = (name: any) => {
    localStorage.setItem("select", name);
  };

  // Hàm gọi API
  const getCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="hidden md:flex flex-wrap gap-3 max-w-[80%] mt-[10px]">
      {categories.length > 0
        ? categories.map((cat) => (
            <div
              key={cat.id}
              className="px-5 py-2 border rounded-xl hover:bg-gray-100 cursor-pointer transition"
            >
              <button onClick={() => saveCategoryName(cat.name)}>
                <Link href={`/courses/category/${cat.id}`}>{cat.name}</Link>
              </button>
            </div>
          ))
        : Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="px-5 py-2 border rounded-xl w-[100px] h-[36px] animate-pulse"
            >
              <h1 className="opacity-0">Danh muc</h1>
            </Skeleton>
          ))}
    </div>
  );
};

export default Categories;
