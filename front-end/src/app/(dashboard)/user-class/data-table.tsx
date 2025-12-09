"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormDialog from "@/components/common/FormDialog";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: (reload: () => void) => ColumnDef<TData, TValue>[];
  data: TData[];
  reload: () => void;
  courseId: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  reload,
  courseId,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const fields = React.useMemo(
    () => [
      {
        name: "email",
        label: "Email (Thêm mới người dùng vào khoá học bằng email)",
        required: true,
      },
    ],
    []
  );

  const [openForm, setOpenForm] = React.useState(false);
  const { post } = useApi();

  const table = useReactTable({
    data,
    columns: columns(reload), // <-- truyền reload chuẩn
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      {/* Input search email*/}
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button
          onClick={() => {
            setOpenForm(true);
          }}
        >
          Thêm người dùng
        </Button>

        {/* FORM DIALOG */}
        <FormDialog
          open={openForm}
          title="Thêm người dùng"
          fields={fields}
          submitText="Thêm mới"
          defaultValues={[]}
          onClose={() => setOpenForm(false)}
          onSubmit={async (data) => {
            try {
              const res = await post(`/courses/${courseId}/students`, data);
              toast.success(data.message);
              reload();
            } catch (error: any) {
              toast.error(error.response?.data.error);
            }
          }}
        />
      </div>

      {/* Data table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns(reload).length}
                  className="h-24 text-center"
                >
                  Không có kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Trang trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
