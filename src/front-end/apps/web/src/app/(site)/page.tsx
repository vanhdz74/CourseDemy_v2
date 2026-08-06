// export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Body from "@/layouts/body/Body";
import CourseDemyLoading from "@/modules/shared/components/loading/CourseDemyLoading";

export default function Page() {
  return (
    <Suspense fallback={<CourseDemyLoading label="Đang tải khóa học nổi bật" />}>
      <Body />
    </Suspense>
  );
}
