import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// slugify("Python cho người mới bắt đầu") -> "python-cho-nguoi-moi-bat-dau"
export function slugify(title: string, maxLength = 0) {
  if (!title) return "";

  // 1. lowercase
  let slug = title.toLowerCase();

  // 2. normalize unicode (tách dấu) và loại combining marks
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 3. handle special vietnamese character đ
  slug = slug.replace(/đ/g, "d");

  // 4. replace any non-alphanumeric (keep a-z0-9) with hyphen
  slug = slug.replace(/[^a-z0-9]+/g, "-");

  // 5. remove leading/trailing hyphens and collapse multiples
  slug = slug.replace(/^-+|-+$/g, "").replace(/-+/g, "-");

  // 6. optionally limit length (cắt ở ký tự '-' gần nhất)
  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength);
    // tránh cắt ở giữa từ => cắt tới vị trí '-' cuối trong phạm vi
    const lastDash = slug.lastIndexOf("-");
    if (lastDash > 0) slug = slug.slice(0, lastDash);
    // trim nếu vẫn còn dấu ở đầu/cuối
    slug = slug.replace(/^-+|-+$/g, "");
  }

  return slug;
}
