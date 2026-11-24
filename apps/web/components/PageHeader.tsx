"use client";

import { useSyncExternalStore } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import Link from "next/link"; // Import Link

interface PageHeaderProps {
  userInitials?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function PageHeader({ userInitials = "DA", showBackButton = false, onBack }: PageHeaderProps) {
  const date = useSyncExternalStore(subscribeToDate, getCurrentJakartaDate, () => "");

  return (
    <header className="relative flex h-20 w-full items-center justify-between border-b border-slate-200/80 bg-white px-5 md:px-8 xl:px-10">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button onClick={onBack} className="flex size-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
            <ChevronLeft className="size-5" />
          </button>
        )}
        <p className="text-sm font-medium capitalize text-[#6683b8] sm:text-base">{date}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Bungkus Avatar dengan Link ke halaman /profile */}
        <Link href="/profile" prefetch={true} className="cursor-pointer hover:opacity-80 transition-opacity" aria-label="Buka profil">
          <Avatar className="relative z-10 size-11 bg-[#17386f] ring-2 ring-white">
            <AvatarImage src="/profile.png" alt="Foto profil" />
            <AvatarFallback className="bg-[#17386f] text-sm font-bold text-white">{userInitials}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}

function getCurrentJakartaDate() {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function subscribeToDate(onStoreChange: () => void) {
  const intervalId = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(intervalId);
}
