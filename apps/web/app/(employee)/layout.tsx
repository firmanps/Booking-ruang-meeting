import { Suspense } from "react";
import type { ReactNode } from "react";

import EmployeeSidebar from "@/components/sidebar/EmployeeSidebar";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f7f9ff]">{children}</div>}>
      <EmployeeSidebar>{children}</EmployeeSidebar>
    </Suspense>
  );
}
