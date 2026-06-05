// export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Body from "@/components/layout/body/Body";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Body />
    </Suspense>
  );
}
