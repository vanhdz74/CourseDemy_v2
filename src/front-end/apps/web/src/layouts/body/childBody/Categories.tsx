"use client";

import React, { useEffect } from "react";
import { Skeleton } from "@/modules/shared/components/ui/skeleton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@repo/api";
import { queryKeys } from "@repo/api";
import { useI18n } from "@/modules/shared/i18n";

const Categories = () => {
  const pathname = usePathname();
  const { t } = useI18n();

  // clear localStorage khi về home
  useEffect(() => {
    if (pathname.includes("/home")) {
      localStorage.removeItem("select");
    }
  }, [pathname]);

  const saveCategoryName = (name: string) => {
    localStorage.setItem("select", name);
  };

  // React Query fetch
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: api.courses.getCategories,
  });

  const categoryList = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
    ? (data as any).data
    : Array.isArray((data as any)?.categories)
    ? (data as any).categories
    : [];

  return (
    <section className="pt-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t("home.categoriesTitle")}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("home.categoriesDescription")}
        </p>
      </div>

      <div className="mt-6 flex gap-3 overflow-x-auto pb-3 scrollbar-none">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-10 w-[120px] shrink-0 rounded-full"
            />
          ))
        ) : error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {t("home.categoriesError")}
          </div>
        ) : categoryList.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            {t("home.categoriesEmpty")}
          </p>
        ) : (
          categoryList.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/courses/category/${cat.id}`}
              onClick={() => saveCategoryName(cat.name)}
              className="inline-flex h-10 shrink-0 items-center rounded-full border border-border/80 bg-card px-4 text-sm font-medium text-muted-foreground shadow-sm transition-all duration-300 hover:border-primary/45 hover:bg-primary/5 hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {cat.name}
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default Categories;
