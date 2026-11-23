import type { ReactNode } from "react";

import EmployeeSidebar from "@/components/sidebar/EmployeeSidebar";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return <EmployeeSidebar>{children}</EmployeeSidebar>;
}
