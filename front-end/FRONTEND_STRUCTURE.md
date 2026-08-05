# Frontend Architecture

Tài liệu này là rule kiến trúc cho frontend monorepo. Web dùng Next.js trước, mobile chỉ tạo khung và sẽ triển khai sau.

## 1. Cấu trúc tổng thể

```text
front-end/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── modules/
│   │   │   ├── layouts/
│   │   │   ├── providers/
│   │   │   ├── middleware/
│   │   │   └── styles/
│   │   ├── public/
│   │   └── package.json
│   └── mobile/
│       ├── src/
│       │   ├── app/
│       │   ├── modules/
│       │   ├── navigation/
│       │   ├── providers/
│       │   └── assets/
│       └── package.json
├── packages/
│   ├── api/
│   ├── contracts/
│   ├── state/
│   ├── ui/
│   ├── ui-web/
│   └── ui-native/
├── tooling/
├── scripts/
└── docs/
```

`apps/` là nơi chứa ứng dụng chạy độc lập. `packages/` là nơi chứa code dùng chung giữa web và mobile.

## 2. Chia theo module nghiệp vụ

Không chia `src/` theo loại file như `components`, `hooks`, `services`, `stores`.

Nên chia theo domain nghiệp vụ:

```text
apps/web/src/modules/
├── auth/
├── user/
├── course/
├── learning/
├── instructor/
├── payment/
├── order/
├── review/
├── notification/
├── search/
├── wishlist/
└── admin/
```

Ví dụ module:

```text
modules/course/
├── components/
├── hooks/
├── store/
├── utils/
├── constants/
└── index.ts
```

Module không import tùy tiện file internal của module khác.

Không nên:

```ts
import CourseCard from "@/modules/course/components/internal/CourseCard";
```

Nên expose qua `modules/course/index.ts`:

```ts
export { CourseCard } from "./components/CourseCard";
```

Và dùng:

```ts
import { CourseCard } from "@/modules/course";
```

## 3. Package API là trung tâm giao tiếp Backend

Không viết API lung tung trong `apps/web` hoặc `apps/mobile`.

Tất cả request backend đi qua:

```text
packages/api/
├── src/
│   ├── client/
│   │   ├── http-client.ts
│   │   ├── interceptor.ts
│   │   └── error-handler.ts
│   ├── auth/
│   │   └── auth.api.ts
│   ├── users/
│   │   └── users.api.ts
│   ├── courses/
│   │   └── courses.api.ts
│   ├── payments/
│   │   └── payments.api.ts
│   └── index.ts
└── package.json
```

Web và mobile đều dùng cùng một public API:

```ts
import { courseApi } from "@repo/api";
```

Nếu backend đổi route như `/api/v1/course` sang `/api/v2/courses`, chỉ sửa trong `packages/api`.

## 4. Contracts là nguồn dữ liệu chuẩn

DTO, schema và type dùng chung đặt ở:

```text
packages/contracts/
├── src/
│   ├── auth/
│   │   ├── login.contract.ts
│   │   └── register.contract.ts
│   ├── course/
│   │   ├── course.contract.ts
│   │   └── create-course.contract.ts
│   ├── user/
│   └── index.ts
└── package.json
```

Ưu tiên dùng Zod để TypeScript type và runtime validation dùng chung một schema.

```ts
export const CourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
});

export type Course = z.infer<typeof CourseSchema>;
```

## 5. State management

Không đưa mọi thứ vào Redux hoặc Zustand.

```text
Server State        -> TanStack Query
Client Global State -> Zustand
Form State          -> React Hook Form
Validation          -> Zod
```

Ví dụ:

- Course từ API: TanStack Query.
- Theme, sidebar, temporary UI state: Zustand.
- Login form, Create Course form: React Hook Form.
- Validate payload và response: Zod contract.

## 6. Routing

Next.js web routes đặt trong `apps/web/src/app`.

```text
apps/web/src/app/
├── (public)/
├── (auth)/
├── (student)/
├── (instructor)/
└── (admin)/
```

Mobile nếu dùng Expo Router thì tổ chức tương tự:

```text
apps/mobile/src/app/
├── (auth)/
├── (tabs)/
│   ├── home.tsx
│   ├── search.tsx
│   ├── learning.tsx
│   └── profile.tsx
├── courses/
│   └── [id].tsx
└── instructor/
```

Rule quan trọng: route chỉ điều phối màn hình, logic nghiệp vụ nằm trong `modules`, API nằm trong `packages/api`, type/schema nằm trong `packages/contracts`.
