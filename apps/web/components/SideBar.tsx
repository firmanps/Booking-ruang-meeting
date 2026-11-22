"use client";

import { Building2, CalendarCheck2, ChevronLeft, ClipboardList, LayoutDashboard, Menu, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar } from "@/components/ui/sidebar";

const mainMenu = [
  { label: "Dasbor", href: "/dashboard", icon: LayoutDashboard },
  { label: "Daftar Ruangan", href: "/rooms", icon: Building2 },
  { label: "Pemesanan Saya", href: "/my-bookings", icon: CalendarCheck2 },
];

const adminMenu = [
  { label: "Kelola Reservasi", href: "/kelolareservasi", icon: ClipboardList },
  { label: "Kelola Ruangan", href: "/kelolaruangan", icon: SlidersHorizontal },
];

/*
  Catatan animasi:
  Semua elemen memakai durasi & easing yang SAMA (300ms ease-in-out) supaya bergerak serempak
  dengan lebar sidebar. Properti yang tidak bisa dianimasikan (display, justify-content, margin auto,
  gap yang tiba-tiba hilang) sudah diganti dengan properti yang bisa (padding, margin, max-width, opacity).
*/

export default function SideBar({ children }: { children?: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider
      className="min-h-svh w-auto"
      style={
        {
          "--sidebar": "#0b1a2d",
          "--sidebar-foreground": "#ffffff",
          "--sidebar-accent": "#203d70",
          "--sidebar-accent-foreground": "#ffffff",
          "--sidebar-border": "rgba(255,255,255,0.1)",
          "--sidebar-width-icon": "4.5rem", // 72px
        } as CSSProperties
      }
    >
      <Sidebar
        side="left"
        collapsible="icon"
        className="border-white/10 !bg-[#0b1a2d] text-white [&_[data-slot=sidebar-container]]:!duration-300 [&_[data-slot=sidebar-container]]:!ease-in-out [&_[data-slot=sidebar-gap]]:!duration-300 [&_[data-slot=sidebar-gap]]:!ease-in-out [&_[data-slot=sidebar-inner]]:!bg-[#0b1a2d]"
      >
        {/*
          Header setinggi 80px (h-20), sejajar dengan tombol toggle (top 2.5rem).
          Posisi logo dianimasikan lewat padding kiri (bukan justify-content):
          - Expanded : px-2 (8px)  + logo 48px
          - Collapsed: px-4 (16px) + logo 40px -> (72 - 40) / 2 = 16px, pas di tengah.
        */}
        <SidebarHeader className="h-20 shrink-0 flex-row items-center justify-between overflow-visible border-b border-white/10 bg-[#0b1a2d] px-2 py-0 transition-[padding] duration-300 ease-in-out motion-reduce:transition-none group-data-[collapsible=icon]:px-4">
          <Link href="/" aria-label="MeetSpace, beranda" title="MeetSpace" className="flex min-w-0 items-center rounded-2xl">
            <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-1.5 transition-all duration-300 ease-in-out motion-reduce:transition-none group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:p-1">
              <Image src="/logo.webp" alt="" width={48} height={48} className="size-full object-contain" priority />
            </span>

            {/* Teks memudar + menyempit (bukan display:none) agar transisinya halus */}
            <span className="ml-3 block max-w-[160px] overflow-hidden text-lg leading-6 font-bold tracking-tight whitespace-nowrap text-white opacity-100 transition-all duration-300 ease-in-out motion-reduce:transition-none group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
              MeetSpace
            </span>
          </Link>

          {/* Tombol tutup, hanya muncul di mobile, di samping logo */}
          <MobileCloseButton />
        </SidebarHeader>

        {/*
          Padding konten dianimasikan: 8px (expanded) -> 12px (collapsed).
          Tombol menu 48px + padding 12px kiri/kanan = 72px, otomatis di tengah tanpa mx-auto.
        */}
        <SidebarContent className="gap-2 overflow-x-hidden bg-[#0b1a2d] px-2 py-5 transition-[padding] duration-300 ease-in-out motion-reduce:transition-none group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:py-4">
          <MenuSection title="Menu Utama" items={mainMenu} pathname={pathname} />
          <MenuSection title="Administrasi" items={adminMenu} pathname={pathname} />
        </SidebarContent>
      </Sidebar>

      {/* Tombol melayang untuk Desktop (Fixed Positioning) */}
      <DesktopFloatingToggle />

      <MobileSidebarTrigger />

      <SidebarInset className="min-h-svh bg-[#f7f9ff]">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

// Komponen Toggle Khusus Desktop
function DesktopFloatingToggle() {
  const { state, isMobile, toggleSidebar } = useSidebar();

  if (isMobile) return null;

  const isCollapsed = state === "collapsed";
  const label = isCollapsed ? "Buka sidebar" : "Tutup sidebar";

  // Tombol (32px) menempel di tepi sidebar: 12px di dalam, 20px di luar.
  const leftPosition = isCollapsed ? "calc(var(--sidebar-width-icon) - 0.75rem)" : "calc(var(--sidebar-width) - 0.75rem)";

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="fixed top-[2.5rem] z-[100] grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#0b1a2d] text-[#c0cee8] shadow-md transition-[left,background-color,color] duration-300 ease-in-out hover:bg-white/10 hover:text-white motion-reduce:transition-none"
      style={{ left: leftPosition }}
      aria-label={label}
    >
      {/* Satu ikon yang berputar 180° (bukan ganti ikon) supaya mulus */}
      <ChevronLeft className={`size-5 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${isCollapsed ? "rotate-180" : "rotate-0"}`} />
    </button>
  );
}

// Tombol Close di dalam sidebar (hanya mobile)
function MobileCloseButton() {
  const { isMobile, setOpenMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <Button type="button" variant="ghost" size="icon" aria-label="Tutup menu" onClick={() => setOpenMobile(false)} className="size-10 shrink-0 rounded-xl text-[#c0cee8] hover:bg-white/10 hover:text-white [&_svg]:size-5">
      <X />
    </Button>
  );
}

// Komponen Toggle Khusus Mobile
function MobileSidebarTrigger() {
  const { isMobile, openMobile, toggleSidebar } = useSidebar();

  if (!isMobile || openMobile) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-[max(14px,env(safe-area-inset-bottom))] z-50 md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Buka menu"
        onClick={toggleSidebar}
        className="size-14 rounded-full border border-white/60 bg-white/90 text-[#173b77] shadow-[0_10px_35px_rgba(15,23,42,0.22)] backdrop-blur-xl hover:bg-white hover:text-[#173b77] [&_svg]:size-6"
      >
        <Menu className="size-5" />
      </Button>
    </div>
  );
}

function MenuSection({ title, items, pathname }: { title: string; items: typeof mainMenu; pathname: string }) {
  return (
    <SidebarGroup className="p-0">
      {/* Label group: tinggi, margin, dan opacity dianimasikan bersamaan */}
      <SidebarGroupLabel className="h-8 px-3 text-xs font-semibold tracking-[0.16em] whitespace-nowrap text-[#91a6ce] uppercase transition-all duration-300 ease-in-out motion-reduce:transition-none group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:opacity-0">
        {title}
      </SidebarGroupLabel>

      <SidebarMenu className="gap-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));

          return (
            <SidebarMenuItem key={href}>
              {/*
                Tombol: gap selalu 0 (jarak ikon-teks diatur margin pada teks supaya bisa dianimasikan).
                Saat collapsed: ukuran 48px, padding kiri/kanan 14px -> ikon 20px tepat di tengah (14 + 20 + 14 = 48).
                Tanpa justify-center / mx-auto karena keduanya tidak bisa bertransisi.
              */}
              <SidebarMenuButton
                render={<Link href={href} aria-current={active ? "page" : undefined} />}
                isActive={active}
                tooltip={label}
                size="lg"
                className={`h-14 gap-0 rounded-2xl px-4 text-[17px] font-medium text-[#c0cee8] transition-[width,height,padding,border-radius,background-color,color] duration-300 ease-in-out hover:bg-white/5 hover:text-white motion-reduce:transition-none group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!rounded-xl group-data-[collapsible=icon]:!pr-[12px] group-data-[collapsible=icon]:!pl-[16px] group-data-[collapsible=icon]:!py-0 data-active:bg-[#203d70] data-active:text-white data-active:hover:bg-[#203d70] ${
                  active ? "data-active:font-semibold" : ""
                }`}
              >
                <Icon className="size-5 shrink-0" strokeWidth={2} />
                {/* Teks: menyempit + memudar, margin kiri menggantikan gap */}
                <span className="ml-3 max-w-[200px] overflow-hidden whitespace-nowrap opacity-100 transition-all duration-300 ease-in-out motion-reduce:transition-none group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
                  {label}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
