"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Course } from "@repo/contracts";
import RowActions from "@/modules/course/components/courses/RowActions";

export const columns = (reload: () => void): ColumnDef<Course>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const url: any = row.getValue("description");
      return <div className="max-w-50 overflow-x-scroll">{url}</div>;
    },
  },
  {
    accessorKey: "teacher_name",
    header: "Giảng viên",
  },
  {
    accessorKey: "price",
    header: "Giá",
  },
  {
    accessorKey: "category_name",
    header: "Danh mục",
  },

  // Phần hành động sẽ có row riêng ở component xử lý
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions course={row.original} reload={reload} />,
  },
];
