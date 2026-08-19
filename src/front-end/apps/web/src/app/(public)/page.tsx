// export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Body from "@/layouts/body/Body";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Body />
    </Suspense>
  );
}
