import { Suspense } from "react";

import AdminSidebar from "@/components/sidebar/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f7f9ff]" />}>
      <AdminSidebar>{children}</AdminSidebar>
    </Suspense>
  );
}
