"use client";

import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PageHeader from "@/components/PageHeader";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import EmployeeSidebar from "@/components/sidebar/EmployeeSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile, UnauthorizedProfileError } from "@/lib/services/profile.service";
import type { AuthUser } from "@repo/shared/schemas/auth.schema";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    getCurrentProfile()
      .then((user) => {
        if (isMounted) setProfile(user);
      })
      .catch((requestError: unknown) => {
        if (!isMounted) return;
        if (requestError instanceof UnauthorizedProfileError) {
          router.replace("/login");
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Profil gagal dimuat.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [retryCount, router]);

  if (isLoading) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#f7f9ff] px-5 text-sm font-medium text-slate-500" aria-live="polite">
        Memuat profil...
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#f7f9ff] px-5">
        <Card className="w-full max-w-md rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle>Profil tidak dapat dimuat</CardTitle>
            <CardDescription>{error || "Coba muat ulang data profil Anda."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setError("");
                setRetryCount((count) => count + 1);
              }}
              className="w-full bg-[#17386f]"
            >
              Coba lagi
            </Button>
          </CardContent>
        </Card>
      </main>
    );
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

        <main className="mx-auto w-full min-w-0 max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
          <section className="mb-7 sm:mb-9">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6683b8]">Akun Anda</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Profil</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Informasi akun yang terdaftar di MeetSpace.</p>
          </section>

          <div>
            <div className="min-w-0 space-y-5 sm:space-y-6">
              <Card className="rounded-2xl border-slate-200/80 py-0 shadow-sm">
                <CardHeader className="border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-[#2864d7]">
                      <UserRound className="size-4" />
                    </span>
                    Informasi akun
                  </CardTitle>
                  <CardDescription>Data ini diambil langsung dari profil akun Anda.</CardDescription>
                </CardHeader>
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
