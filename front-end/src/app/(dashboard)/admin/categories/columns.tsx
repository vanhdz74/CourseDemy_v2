"use client";

import { ColumnDef } from "@tanstack/react-table";
import RowActions from "@/components/categories/RowAction";
import { Category } from "@/types/categoryType";

export const columns = (reload: () => void): ColumnDef<Category>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Tên danh mục",
  },
  // Phần hành động sẽ có row riêng ở component xử lý
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions category={row.original} reload={reload} />,
  },
];
