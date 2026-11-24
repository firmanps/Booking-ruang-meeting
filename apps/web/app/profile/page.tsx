import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import PageHeader from "@/components/PageHeader";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import EmployeeSidebar from "@/components/sidebar/EmployeeSidebar";
import { Card, CardContent } from "@/components/ui/card";
import type { AuthUser } from "@repo/shared/schemas/auth.schema";

export const instant = false;

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/+$/, "");
  const response = await fetch(`${apiBaseUrl}/auth/me`, {
    headers: { cookie: `accessToken=${accessToken}` },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error("Layanan profil sedang tidak tersedia.");
  }

  const data = (await response.json()) as { user?: AuthUser };
  const profile = data.user;

  if (!profile) {
    throw new Error("Data profil tidak tersedia.");
  }

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const roleLabel = profile.role === "ADMIN" ? "Administrator" : "Karyawan";
  const Sidebar = profile.role === "ADMIN" ? AdminSidebar : EmployeeSidebar;

  return (
    <Sidebar>
      <div className="min-h-svh w-full min-w-0 overflow-x-hidden bg-[#f7f9ff] text-[#121a33]">
        <PageHeader userInitials={initials || "U"} />

        <main className="mx-auto w-full min-w-0 max-w-360 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
          <section className="mb-7 sm:mb-9">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6683b8]">Akun Anda</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Profil</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Informasi akun yang terdaftar di MeetSpace.</p>
          </section>

          <div>
            <div className="min-w-0 space-y-5 sm:space-y-6">
              <Card className="rounded-2xl border-slate-200/80 py-0 shadow-sm">
                <CardContent className="grid min-w-0 gap-5 px-5 py-5 sm:grid-cols-2 sm:px-7 sm:py-6">
                  <ProfileInfo icon={<UserRound />} label="Nama lengkap" value={profile.name} />
                  <ProfileInfo icon={<Mail />} label="Alamat email" value={profile.email} />
                  <ProfileInfo icon={<ShieldCheck />} label="Role akun" value={roleLabel} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </Sidebar>
  );
}

function ProfileInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-slate-500 shadow-sm">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-1 break-all text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}
