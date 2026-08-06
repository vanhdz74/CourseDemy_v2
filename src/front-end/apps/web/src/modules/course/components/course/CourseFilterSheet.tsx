"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // 👈 Thêm
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/modules/shared/components/ui/sheet";
import { Input } from "@/modules/shared/components/ui/input";
import { Button } from "@/modules/shared/components/ui/button";
import { Label } from "@/modules/shared/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/modules/shared/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { buildCourseSearchUrl, getCategories } from "@repo/api";
import { Category } from "@repo/contracts";

interface CourseFilterSheetProps {
  onFilter: (apiUrl: string) => void;
}

const CourseFilterSheet: React.FC<CourseFilterSheetProps> = ({ onFilter }) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // 👈 đọc query trên URL

  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApply = () => {
    const query = new URLSearchParams();
    if (keyword) query.set("keyword", keyword);
    if (categoryId && categoryId !== "" && categoryId !== "0")
      query.set("category_id", categoryId); // chỉ thêm nếu có chọn
    if (minPrice) query.set("min_price", minPrice);
    if (maxPrice) query.set("max_price", maxPrice);

    const queryString = query.toString();
    const url = buildCourseSearchUrl(Object.fromEntries(query.entries()));
    onFilter(url);
    router.push(`/courses/search?${queryString}`);
  };

  // Lấy danh sách categories
  const getCategoriesList = async () => {
    setCategories(await getCategories());
  };

  useEffect(() => {
    getCategoriesList();

    // Khi load trang, đọc lại query từ URL để set vào state
    const kw = searchParams.get("keyword") || "";
    const cat = searchParams.get("category_id") || "";
    const min = searchParams.get("min_price") || "";
    const max = searchParams.get("max_price") || "";

    setKeyword(kw);
    setCategoryId(cat);
    setMinPrice(min);
    setMaxPrice(max);
  }, [searchParams]); // quan trọng

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal size={18} />
          Bộ lọc
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex-1">
        <SheetHeader>
          <SheetTitle>Bộ lọc khoá học</SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-5 px-[20px]">
          <div className="space-y-2">
            <Label>Từ khoá</Label>
            <Input
              placeholder="Nhập từ khoá..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Danh mục</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={0} value="0">
                  Tất cả
                </SelectItem>
                {categories.map(({ id, name }) => (
                  <SelectItem key={id} value={String(id)}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Giá thấp nhất</Label>
            <Input
              type="number"
              placeholder="VD: 100000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Giá cao nhất</Label>
            <Input
              type="number"
              placeholder="VD: 500000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="mt-4 flex justify-end gap-2 flex-1">
          <SheetClose asChild>
            <Button variant="outline">Hủy</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button onClick={handleApply}>Áp dụng</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CourseFilterSheet;
