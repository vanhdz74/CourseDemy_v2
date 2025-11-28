"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/userType";
import RowActions from "@/components/users/RowActions";

export const columns = (reload: () => void): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role");
      return (
        <span
          className={
            role === "ADMIN"
              ? "text-red-500 font-semibold"
              : role === "TEACHER"
              ? "text-yellow-600 font-medium"
              : "text-blue-600 font-medium"
          }
        >
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ row }) => {
      const active = Number(row.getValue("is_active"));
      return (
        <span
          className={
            active === 1
              ? "text-green-600 font-medium"
              : "text-gray-400 font-medium"
          }
        >
          {active === 1 ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    accessorKey: "avatar_url",
    header: "Avatar",
    cell: ({ row }) => {
      const url: any = row.getValue("avatar_url");
      return <div className="max-w-10 overflow-hidden">{url}</div>;
    },
  },

  // Phần hành động sẽ có row riêng ở component xử lý
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions user={row.original} reload={reload} />,
  },
];
