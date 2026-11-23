"use client";

import {
  Building2,
  CalendarCheck2,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

const employeeMenu = [
  { label: "Dasbor", href: "/dashboard", icon: LayoutDashboard },
  { label: "Daftar Ruangan", href: "/rooms", icon: Building2 },
  { label: "Pemesanan Saya", href: "/bookings", icon: CalendarCheck2 },
];

export default function EmployeeSidebar({ children }: { children?: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider
      className="min-h-svh w-auto"
      style={{
        "--sidebar": "#0b1a2d",
        "--sidebar-foreground": "#ffffff",
        "--sidebar-accent": "#203d70",
        "--sidebar-accent-foreground": "#ffffff",
        "--sidebar-border": "rgba(255,255,255,0.1)",
        "--sidebar-width-icon": "4.5rem",
      } as CSSProperties}
    >
      <Sidebar side="left" collapsible="icon" className="border-white/10 bg-[#0b1a2d]! text-white **:data-[slot=sidebar-container]:duration-300! **:data-[slot=sidebar-container]:ease-in-out! **:data-[slot=sidebar-gap]:duration-300! **:data-[slot=sidebar-gap]:ease-in-out! **:data-[slot=sidebar-inner]:bg-[#0b1a2d]!">
        <SidebarHeader className="h-20 shrink-0 flex-row items-center justify-between overflow-visible border-b border-white/10 bg-[#0b1a2d] px-2 py-0 transition-[padding] duration-300 ease-in-out group-data-[collapsible=icon]:px-4">
          <Link href="/dashboard" aria-label="MeetSpace, dashboard karyawan" title="MeetSpace" className="flex min-w-0 items-center rounded-2xl">
            <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-1.5 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:p-1">
              <Image src="/logo.webp" alt="" width={48} height={48} className="size-full object-contain" priority />
            </span>
            <span className="ml-3 block max-w-40 overflow-hidden text-lg leading-6 font-bold tracking-tight whitespace-nowrap text-white opacity-100 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
              MeetSpace
            </span>
          </Link>
          <EmployeeMobileCloseButton />
        </SidebarHeader>

        <SidebarContent className="gap-2 overflow-x-hidden bg-[#0b1a2d] px-2 py-5 transition-[padding] duration-300 ease-in-out group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:py-4">
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="h-8 px-3 text-xs font-semibold tracking-[0.16em] whitespace-nowrap text-[#91a6ce] uppercase transition-all duration-300 ease-in-out group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:opacity-0">
              Menu Utama
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              {employeeMenu.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton render={<Link href={href} aria-current={active ? "page" : undefined} />} isActive={active} tooltip={label} size="lg" className="h-14 gap-0 rounded-2xl px-4 text-[17px] font-medium text-[#c0cee8] transition-[width,height,padding,border-radius,background-color,color] duration-300 ease-in-out hover:bg-white/5 hover:text-white group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:rounded-xl! group-data-[collapsible=icon]:pr-3! group-data-[collapsible=icon]:pl-4! group-data-[collapsible=icon]:py-0! data-active:bg-[#203d70] data-active:text-white data-active:hover:bg-[#203d70]">
                      <Icon className="size-5 shrink-0" strokeWidth={2} />
                      <span className="ml-3 max-w-50 overflow-hidden whitespace-nowrap opacity-100 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
                        {label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 bg-[#0b1a2d] px-2 py-3 group-data-[collapsible=icon]:px-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton type="button" tooltip="Logout" size="lg" className="h-12 gap-0 rounded-2xl px-4 text-base font-medium text-[#c0cee8] transition-colors hover:bg-white/5 hover:text-white group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:rounded-xl! group-data-[collapsible=icon]:px-0!">
                <LogOut className="size-5 shrink-0" strokeWidth={2} />
                <span className="ml-3 max-w-50 overflow-hidden whitespace-nowrap opacity-100 transition-all duration-300 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
                  Logout
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <EmployeeDesktopToggle />
      <EmployeeMobileTrigger />
      <SidebarInset className="min-h-svh bg-[#f7f9ff]">{children}</SidebarInset>
    </SidebarProvider>
  );
}

function EmployeeDesktopToggle() {
  const { state, isMobile, toggleSidebar } = useSidebar();
  if (isMobile) return null;
  const isCollapsed = state === "collapsed";
  const leftPosition = isCollapsed ? "calc(var(--sidebar-width-icon) - 0.75rem)" : "calc(var(--sidebar-width) - 0.75rem)";

  return (
    <button type="button" onClick={toggleSidebar} className="fixed top-10 z-40 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#0b1a2d] text-[#c0cee8] shadow-md transition-[left,background-color,color] duration-300 ease-in-out hover:bg-white/10 hover:text-white" style={{ left: leftPosition }} aria-label={isCollapsed ? "Buka sidebar" : "Tutup sidebar"}>
      <ChevronLeft className={`size-5 transition-transform duration-300 ease-in-out ${isCollapsed ? "rotate-180" : "rotate-0"}`} />
    </button>
  );
}

function EmployeeMobileCloseButton() {
  const { isMobile, setOpenMobile } = useSidebar();
  if (!isMobile) return null;
  return (
    <Button type="button" variant="ghost" size="icon" aria-label="Tutup menu" onClick={() => setOpenMobile(false)} className="size-10 shrink-0 rounded-xl text-[#c0cee8] hover:bg-white/10 hover:text-white [&_svg]:size-5">
      <X />
    </Button>
  );
}

function EmployeeMobileTrigger() {
  const { isMobile, openMobile, toggleSidebar } = useSidebar();
  if (!isMobile || openMobile) return null;
  return (
    <div className="fixed right-4 bottom-[max(14px,env(safe-area-inset-bottom))] z-40 md:hidden">
      <Button type="button" variant="ghost" size="icon" aria-label="Buka menu" onClick={toggleSidebar} className="size-14 rounded-full border border-white/60 bg-white/90 text-[#173b77] shadow-[0_10px_35px_rgba(15,23,42,0.22)] backdrop-blur-xl hover:bg-white hover:text-[#173b77] [&_svg]:size-6">
        <Menu className="size-5" />
      </Button>
    </div>
  );
}
