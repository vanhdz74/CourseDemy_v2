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
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: api.courses.getCategories,
  });

  return (
    <section className="pt-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          {t("home.categoriesTitle")}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          {t("home.categoriesDescription")}
        </p>
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto pb-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-10 w-[120px] shrink-0 rounded-full"
            />
          ))
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {t("home.categoriesError")}
          </div>
        ) : categories?.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            {t("home.categoriesEmpty")}
          </p>
        ) : (
          categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/courses/category/${cat.id}`}
              onClick={() => saveCategoryName(cat.name)}
              className="inline-flex h-10 shrink-0 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-200"
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
