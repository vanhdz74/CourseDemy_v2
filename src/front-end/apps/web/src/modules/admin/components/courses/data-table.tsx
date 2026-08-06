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
} from "@/modules/shared/components/ui/table";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import FormDialog from "@/modules/shared/components/common/FormDialog";
import { useApi } from "@/modules/shared/hooks/useApi";
import { toast } from "sonner";
import { da } from "zod/v4/locales";
import { useRouter } from "next/navigation";
import { slugify } from "@/modules/shared/lib/utils";
import { useAppDispatch, useAppSelector } from "@/modules/shared/store/hooks";
import { setCourse } from "@/modules/course/store/courseSlice";
import { Category } from "@repo/contracts";

type ApiError = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

function getErrorMessage(error: unknown) {
  const apiError = error as ApiError;
  return (
    apiError.response?.data?.message ||
    apiError.message ||
    "Lỗi hệ thống"
  );
}

interface DataTableProps<TData, TValue> {
  columns: (reload: () => void) => ColumnDef<TData, TValue>[];
  data: TData[];
  reload: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  reload,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const router = useRouter();
  const { get, post } = useApi();
  const [searchValue, setSearchValue] = React.useState("");
  const [categories, setCategories] = React.useState<Category[]>([]);

  // Lưu course vô redux
  const course = useAppSelector((state) => state.course);
  const dispatch = useAppDispatch();

  const getCategory = async () => {
    const data = await get<Category[]>("/categories");
    setCategories(data);
  };

  React.useEffect(() => {
    getCategory();
  }, []);

  const fields = [
    { name: "title", label: "Tiêu đề" },
    { name: "description", label: "Mô tả" },
    {
      name: "teacher_id",
      label: "Giảng viên phụ trách ( id )",
      required: true,
    },
    { name: "price", label: "Giá tiền", type: "number" },
    {
      name: "category_id",
      label: "Tên danh mục",
      type: "select",
      options: [
        ...categories.map((cate) => ({
          label: cate.name,
          value: cate.id,
        })),
      ],
    },
  ];

  const [openForm, setOpenForm] = React.useState(false);

  const table = useReactTable({
    data,
    columns: columns(reload),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
    globalFilterFn: (row, columnId, filterValue: string) => {
      // Cho viết hoa hết
      const val = filterValue.toLowerCase();

      // Các trường cần lọc
      const title = String(row.getValue("title") ?? "").toLowerCase();
      const teacher = String(row.getValue("teacher_name") ?? "").toLowerCase();
      const description = String(
        row.getValue("description") ?? ""
      ).toLowerCase();
      return (
        title.includes(val) ||
        teacher.includes(val) ||
        description.includes(val)
      );
    },
  });

  // Cập nhật globalFilter khi input thay đổi
  React.useEffect(() => {
    table.setGlobalFilter(searchValue);
  }, [searchValue, table]);

  return (
    <div>
      {/* Input search */}
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Tìm theo tiêu đề, mô tả, giảng viên..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-sm"
        />

        <Button onClick={() => setOpenForm(true)}>Thêm khoá học</Button>

        {/* FORM DIALOG */}
        <FormDialog
          open={openForm}
          title="Thêm khoá học"
          fields={fields}
          submitText="Thêm mới"
          defaultValues={{}}
          onClose={() => setOpenForm(false)}
          onSubmit={async (data) => {
            try {
              const categoryId = Number(data.category_id);
              if (!categories.some((category) => category.id === categoryId)) {
                toast.error("Danh mục đã chọn không tồn tại trong danh sách hiện tại.");
                return;
              }

              const response = await post<{ message?: string }>(`/course`, {
                ...data,
                category_id: categoryId,
                teacher_id: Number(data.teacher_id),
              });
              toast.success(response.message || "Thêm khoá học thành công");
              reload();
            } catch (err: unknown) {
              toast.error(getErrorMessage(err));
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => {
                        dispatch(
                          setCourse({
                            courseId: row.original.id,
                            courseTitle: row.original.title,
                          })
                        );
                      }}
                    >
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
