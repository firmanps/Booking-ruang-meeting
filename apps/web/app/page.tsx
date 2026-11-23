"use client";

import { ArrowRight, CalendarClock, CheckCircle2, MapPin, Menu, ShieldCheck, SlidersHorizontal, Sparkles, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const rooms = [
  {
    name: "Ruang Rapat Nusantara",
    location: "Lantai 8",
    capacity: "20",
    image: "/room1.webp",
  },
  {
    name: "Ruang Rapat Garuda",
    location: "Lantai 5",
    capacity: "16",
    image: "/room2.webp",
  },
  {
    name: "Ruang Kolaborasi Merapi",
    location: "Lantai 3",
    capacity: "10",
    image: "/room3.webp",
  },
];

const features = [
  {
    icon: CalendarClock,
    title: "Cek Ketersediaan Real-time",
    description: "Lihat slot kerja terbaru untuk setiap ruangan pada tanggal yang Anda pilih.",
  },
  {
    icon: ShieldCheck,
    title: "Validasi Otomatis Anti-bentrok",
    description: "Pemesanan yang bertabrakan, di luar jam kantor, atau tidak memenuhi durasi akan ditolak.",
  },
  {
    icon: Users,
    title: "Mandiri untuk Semua Karyawan",
    description: "Pesan, pantau, dan batalkan reservasi Anda sendiri tanpa menghubungi bagian umum.",
  },
  {
    icon: SlidersHorizontal,
    title: "Kontrol Penuh untuk Admin",
    description: "Kelola data ruangan, aktivasi, kapasitas, dan reservasi bermasalah dari satu tempat.",
  },
];

const steps = [
  {
    number: "01",
    title: "Pilih Ruangan & Tanggal",
    description: "Telusuri katalog ruangan, lalu pilih kapasitas dan fasilitas yang Anda butuhkan.",
  },
  {
    number: "02",
    title: "Periksa Linimasa Jadwal",
    description: "Pastikan slot 08.00–18.00 WIB yang Anda inginkan masih tersedia.",
  },
  {
    number: "03",
    title: "Konfirmasi & Selesai",
    description: "Reservasi tercatat otomatis dan langsung muncul pada daftar pemesanan Anda.",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9ff] text-[#121a33]">
      <nav
        aria-label="Navigasi utama"
        className="fixed top-5 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/70 bg-white/75 px-2 py-2 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl md:flex"
      >
        <Link href="#fitur" className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-950">
          Fitur
        </Link>
        <Link href="#ruangan" className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-950">
          Ruangan
        </Link>
        <Link href="#alur" className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-950">
          Alur
        </Link>

        <span className="mx-1 h-7 w-px bg-slate-200" />
        <Button variant="ghost" className="h-10 rounded-full px-4">
          <Link href="/login">Masuk</Link>
        </Button>
        <Button className="h-10 rounded-full bg-[#1c345f] px-5">
          <Link href="/register">Daftar Gratis</Link>
        </Button>
      </nav>

      <div aria-label="Navigasi utama" className="fixed right-4 bottom-[max(14px,env(safe-area-inset-bottom))] z-50 md:hidden">
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="grid size-14 place-items-center rounded-full border border-white/70 bg-white/80 text-[#173b77] shadow-[0_10px_35px_rgba(15,23,42,0.22)] backdrop-blur-xl transition-transform active:scale-95"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileMenuOpen && <button type="button" aria-label="Tutup menu" className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)} />}

      <aside
        aria-label="Menu perangkat kecil"
        className={`fixed top-0 right-0 z-60 h-dvh w-[min(82vw,320px)] border-l border-white/60 bg-white/90 p-5 shadow-[-20px_0_50px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 font-bold">
            <span className="grid size-10 place-items-center overflow-hidden rounded-xl bg-[#edf3ff]">
              <Image src="/logo.webp" alt="" width={40} height={40} className="size-full object-contain" />
            </span>
            MeetSpace
          </Link>
          <button type="button" aria-label="Tutup menu" onClick={() => setMobileMenuOpen(false)} className="grid size-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100">
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          {[
            ["Fitur", "#fitur"],
            ["Ruangan", "#ruangan"],
            ["Alur", "#alur"],
          ].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100">
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5">
          <Button variant="outline" className="h-11 rounded-xl">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              Masuk
            </Link>
          </Button>
          <Button className="h-11 rounded-xl bg-[#1c345f] px-3">
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              Daftar
            </Link>
          </Button>
        </div>
      </aside>

      <main>
        <section className="bg-[#17386f] text-white">
          <div className="mx-auto grid max-w-420 gap-8 px-4 py-10 sm:gap-10 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center xl:px-12 xl:py-14">
            <div className="max-w-190">
              <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-[#91c9ff] sm:mb-7 sm:px-4 sm:text-sm">
                <Sparkles className="size-4" />
                Sistem Reservasi Ruang Rapat Kantor
              </div>

              <h1 className="max-w-180 text-[40px] font-bold leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-[56px] xl:text-[64px]">
                Pesan ruang rapat <span className="text-[#32aef3]">tanpa bentrok</span>, tanpa ribet.
              </h1>
              <p className="mt-6 max-w-162.5 text-base leading-7 text-[#c0cee8] sm:mt-7 sm:text-lg sm:leading-8 lg:text-xl">
                MeetSpace membantu seluruh karyawan melihat ketersediaan ruangan secara real-time, memesan jadwal dalam hitungan detik, dan menghindari tabrakan jadwal semuanya dalam satu aplikasi yang cepat.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <Button variant="outline" size="lg" className="h-12 w-full rounded-xl border-white/30 bg-transparent px-5 text-base text-white hover:bg-white/10 hover:text-white sm:h-14 sm:w-auto sm:px-7">
                  <Link href="#ruangan">Lihat Daftar Ruangan</Link>
                </Button>
              </div>

              <div className="mt-10 grid max-w-155 grid-cols-3 divide-x divide-white/15 sm:mt-12">
                <div className="pr-2 sm:pr-5">
                  <p className="text-xs text-[#91a6ce] sm:text-sm">Ruangan Aktif</p>
                  <p className="mt-2 text-xl font-bold sm:text-2xl">N/A</p>
                </div>
                <div className="px-2 sm:px-5">
                  <p className="text-xs text-[#91a6ce] sm:text-sm">Jam Operasional</p>
                  <p className="mt-2 text-xl font-bold sm:text-2xl">
                    10 <span className="hidden text-sm font-normal text-[#c0cee8] sm:inline">jam/hari</span>
                  </p>
                </div>
              </div>
            </div>

            <Card className="overflow-hidden rounded-2xl border-0 bg-[#203d70] py-0 text-white shadow-2xl shadow-slate-950/20">
              <div className="relative h-60 sm:h-95 lg:h-90 xl:h-100">
                <Image src="/room4.webp" alt="Ruangan rapat dengan fasilitas presentasi" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
              </div>
            </Card>
          </div>
        </section>

        <section id="fitur" className="px-4 py-14 sm:px-8 sm:py-20 xl:px-12">
          <div className="mx-auto max-w-420">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Semua yang dibutuhkan tim Anda</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">Dirancang untuk ritme kerja kantor modern — dari sprint planning mingguan hingga rapat direksi bulanan.</p>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="min-h-0 rounded-2xl border-slate-200 sm:min-h-72">
                    <CardHeader>
                      <span className="grid size-12 place-items-center rounded-xl bg-[#edf3ff] text-[#2459c7]">
                        <Icon className="size-6" />
                      </span>
                      <CardTitle className="mt-5 text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base leading-7">{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="ruangan" className="border-y border-slate-200/70 bg-white px-4 py-14 sm:px-8 sm:py-20 xl:px-12">
          <div className="mx-auto max-w-420">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ruangan siap digunakan</h2>
              </div>
              <Button variant="outline" className="h-11 w-full rounded-xl px-5 sm:w-auto">
                <Link href="/login" className="flex items-center">
                  Lihat Semua Ruangan
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => (
                <Card key={room.name} className="gap-0 overflow-hidden rounded-2xl border-slate-200 py-0">
                  <div className="relative h-52 overflow-hidden sm:h-64">
                    <Image src={room.image} alt={room.name} fill className="object-cover transition-transform duration-500 hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <CardTitle className="text-xl">{room.name}</CardTitle>
                      <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        <CheckCircle2 className="size-4" />
                        Aktif
                      </span>
                    </div>
                    <CardDescription className="mt-3 flex items-center gap-1.5 text-base">
                      <MapPin className="size-4" />
                      {room.location}
                    </CardDescription>
                    <p className="mt-4 flex items-center gap-2 text-base font-medium">
                      <Users className="size-5 text-slate-500" />
                      {room.capacity} Orang
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="alur" className="scroll-mt-28 px-4 py-14 sm:px-8 sm:py-20 xl:px-12">
          <div className="mx-auto max-w-420">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tiga langkah, jadwal beres</h2>
            <p className="mt-4 text-lg text-slate-500">Proses pemesanan yang cepat tanpa bolak-balik email.</p>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {steps.map((step) => (
                <Card key={step.number} className="min-h-0 rounded-2xl border-slate-200 sm:min-h-56">
                  <CardHeader>
                    <p className="text-base font-bold tracking-[0.2em] text-[#2864d7]">{step.number}</p>
                    <CardTitle className="mt-5 text-xl">{step.title}</CardTitle>
                    <CardDescription className="text-base leading-7">{step.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-8 sm:pb-20 xl:px-12">
          <div className="mx-auto max-w-420 rounded-3xl bg-[#17386f] px-5 py-12 text-center text-white sm:px-12 sm:py-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Siap merapikan jadwal rapat kantor?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#bfd0eb]">Bergabung bersama rekan-rekan Anda di MeetSpace dan rasakan pemesanan ruangan yang transparan untuk semua tim.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" className="h-12 w-full rounded-xl bg-white px-6 text-slate-900 hover:bg-slate-100 sm:w-auto">
                <Link href="/register">Daftar Gratis</Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 w-full rounded-xl border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white sm:w-auto">
                <Link href="/login">Saya Sudah Punya Akun</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex min-h-24 max-w-420 flex-col items-center justify-between gap-4 px-4 py-8 text-center text-xs text-slate-500 sm:flex-row sm:px-8 sm:text-left sm:text-sm xl:px-12">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
            <span className="grid size-9 place-items-center overflow-hidden rounded-lg bg-[#edf3ff]">
              <Image src="/logo.webp" alt="" width={36} height={36} className="size-full object-contain" />
            </span>
            MeetSpace
          </Link>
          <p>© 2026 MeetSpace · Dikembangkan untuk kebutuhan gedung kantor</p>
        </div>
      </footer>
    </div>
  );
}
