# MeetSpace

Aplikasi fullstack untuk pemesanan ruang meeting kantor. Karyawan dapat mencari ruangan, melihat jadwal harian, membuat reservasi, dan membatalkan booking miliknya sendiri. Admin dapat mengelola data ruangan serta seluruh reservasi.

## Daftar Isi

- [Teknologi](#teknologi)
- [Struktur Project](#struktur-project)
- [Quick Start (Docker)](#quick-start-docker)
- [Menjalankan Tanpa Docker](#menjalankan-tanpa-docker)
- [Perintah Docker yang Sering Digunakan](#perintah-docker-yang-sering-digunakan)
- [Akun Demo](#akun-demo)
- [Fitur](#fitur)
- [Endpoint API](#endpoint-api)
- [Pencegahan Booking Bentrok](#pencegahan-booking-bentrok)
- [Penanganan Zona Waktu](#penanganan-zona-waktu)
- [Database](#database)
- [Troubleshooting](#troubleshooting)
- [Batasan Saat Ini](#batasan-saat-ini)
- [Pengembangan dengan Bantuan AI](#pengembangan-dengan-bantuan-ai)

## Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS, Base UI, Axios |
| Backend | NestJS 11, Prisma 7, PostgreSQL, JWT, bcryptjs |
| Validasi | Zod (shared lewat package `@repo/shared`) |
| Monorepo | pnpm workspace, Turborepo |

## Struktur Project

```text
Booking-ruang-meeting/
├── apps/
│   ├── api/      # Backend NestJS + Prisma (dokumentasi API ada di apps/api/doc)
│   └── web/      # Frontend Next.js
├── packages/
│   └── shared/   # Schema Zod dan tipe bersama
└── doc/
    └── prd.md    # Studi kasus dan kebutuhan project
```

## Quick Start (Docker)

Cara yang direkomendasikan: PostgreSQL, API, dan frontend berjalan lewat satu perintah Docker Compose.

### Persyaratan

- Docker Desktop (atau Docker Engine) beserta Docker Compose

### Langkah

**1. Masuk ke folder project**

```bash
cd Booking-ruang-meeting
```

**2. Buat file `.env` di root project**

```env
POSTGRES_DB=booking_ruang_meeting
POSTGRES_USER=meetspace
POSTGRES_PASSWORD=ganti-dengan-password-yang-kuat
POSTGRES_PORT=5433

API_PORT=5000
WEB_PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> `POSTGRES_PORT=5433` adalah port di host, supaya tidak bentrok dengan PostgreSQL lokal di port `5432`. Di dalam jaringan Docker, PostgreSQL tetap memakai port `5432`.

**3. Buat file `apps/api/.env`**

```env
PORT=5000
JWT_SECRET=ganti-dengan-secret-yang-kuat
JWT_EXPIRES_IN=1h
NODE_ENV=production
CORS_ORIGINS=http://localhost:3000,http://localhost:4000
```

> Anda tidak perlu mengisi `DATABASE_URL` untuk Docker. Docker Compose otomatis menggantinya dengan alamat PostgreSQL di dalam jaringan Docker.

**4. Buat file `apps/web/.env`**

```env
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:5000
API_INTERNAL_URL=http://api:5000
```

- `NEXT_PUBLIC_API_URL`: dipakai browser untuk memanggil API.
- `API_INTERNAL_URL`: dipakai server/proxy Next.js untuk memanggil container API.

**5. Build dan jalankan**

```bash
docker compose up -d --build
```

Urutan startup: PostgreSQL → API (otomatis menjalankan migration dan seed) → frontend.

**6. Cek status service**

```bash
docker compose ps
```

Semua service harus berstatus `Up`, dan database `healthy`.

**7. Buka aplikasi**

| Layanan | Alamat |
|---|---|
| Frontend | http://localhost:4000 |
| API | http://localhost:5000 |
| PostgreSQL | localhost:5433 |

Login memakai [akun demo](#akun-demo) di bawah.

## Menjalankan Tanpa Docker

### Persyaratan

- Node.js 22 atau lebih baru
- pnpm 10
- PostgreSQL 16

### Langkah

**1. Siapkan database**

Aktifkan PostgreSQL lalu buat database `booking_ruang_meeting`.

**2. Buat `apps/api/.env`**

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/booking_ruang_meeting?schema=public
PORT=5000
JWT_SECRET=ganti-dengan-secret-yang-kuat
JWT_EXPIRES_IN=1h
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:4000
```

Ganti `USER` dan `PASSWORD` sesuai PostgreSQL lokal Anda.

**3. Buat `apps/web/.env`**

```env
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**4. Install dependency**

```bash
corepack enable
pnpm install
```

**5. Generate Prisma Client, migration, dan seed**

```bash
cd apps/api
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm exec prisma db seed
cd ../..
```

**6. Jalankan API dan frontend sekaligus (dari root project)**

```bash
pnpm dev
```

Atau jalankan terpisah di dua terminal:

```bash
# Terminal 1 - API (http://localhost:5000)
cd apps/api && pnpm dev

# Terminal 2 - Frontend (http://localhost:4000)
pnpm --filter web dev
```

## Perintah Docker yang Sering Digunakan

| Tujuan | Perintah |
|---|---|
| Lihat log semua service | `docker compose logs -f` |
| Lihat log API | `docker compose logs -f api` |
| Lihat log frontend | `docker compose logs -f web` |
| Build ulang dan jalankan | `docker compose up -d --build` |
| Hentikan container (data aman) | `docker compose down` |
| Hentikan dan hapus data database | `docker compose down -v` |

> ⚠️ `docker compose down -v` menghapus **seluruh data PostgreSQL**. Setelah volume dibuat ulang, migration dan seed berjalan lagi saat container API dinyalakan.

## Akun Demo

Password sama dengan alamat email. Akun ini hanya untuk pengembangan dan demo, jangan dipakai di production.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `admin@example.com` |
| Employee | `employee1@example.com` | `employee1@example.com` |
| Employee | `employee2@example.com` | `employee2@example.com` |

## Fitur

### Karyawan

- Registrasi dan login
- Melihat daftar ruangan, dengan filter kapasitas minimum, status, nama, dan lokasi
- Melihat jadwal booking harian suatu ruangan
- Membuat booking pada tanggal dan waktu yang tersedia
- Melihat booking mendatang, riwayat, dan booking yang dibatalkan
- Membatalkan booking milik sendiri
- Melihat profil akun

### Admin

- Mengelola ruangan: tambah, ubah, aktifkan, nonaktifkan, dan hapus
- Melihat, mencari, dan memfilter seluruh booking pengguna
- Membatalkan booking milik pengguna lain
- Melihat ringkasan reservasi, jumlah ruangan, dan ruangan aktif

### Nilai Tambah

- Dashboard ringkasan untuk employee dan admin
- Penonaktifan ruangan otomatis membatalkan booking aktif mendatang dan mencatat pembatalannya
- Sidebar responsif untuk desktop dan mobile
- Halaman profil yang menyesuaikan role pengguna
- Cache singkat pada request frontend, dengan invalidasi setelah data berubah
- Validasi terpusat dengan schema Zod yang dipakai bersama frontend dan backend
- JWT lewat cookie HttpOnly atau header bearer
- Format error JSON yang konsisten melalui exception filter
- Dokumentasi API terpisah (auth, ruangan, booking)
- Integration test yang mensimulasikan 20 request booking bersamaan

## Endpoint API

Dokumentasi lengkap ada di [apps/api/doc](./apps/api/doc).

### Autentikasi

| Method | Endpoint |
|---|---|
| POST | `/auth/register` |
| POST | `/auth/login` |
| POST | `/auth/logout` |
| GET | `/auth/me` |

### Ruangan

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/rooms` | Semua user |
| GET | `/rooms/:id` | Semua user |
| GET | `/rooms/:id/availability?date=YYYY-MM-DD` | Semua user |
| POST | `/rooms` | Admin |
| PATCH | `/rooms/:id` | Admin |
| DELETE | `/rooms/:id` | Admin |

### Booking

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/bookings` | User login |
| GET | `/bookings/me` | User login |
| GET | `/bookings` | Admin |
| DELETE | `/bookings/:id` | Pemilik booking atau admin |

## Pencegahan Booking Bentrok

Pencegahan dilakukan berlapis:

1. Frontend memvalidasi judul, tanggal, rentang waktu, durasi, dan jam kerja.
2. Backend memvalidasi input dengan Zod.
3. Backend memeriksa booking aktif yang waktunya tumpang tindih.
4. PostgreSQL advisory transaction lock dijalankan per `roomId` untuk mengunci proses booking ruangan yang sama.
5. Pemeriksaan bentrok dan pembuatan booking berjalan dalam satu transaksi Prisma.

Advisory lock dipilih karena menutup kondisi race pada PostgreSQL dengan mengunci proses transaksi berdasarkan `roomId`, lalu pemeriksaan bentrok dilakukan sebelum insert. Pendekatan ini lebih sesuai untuk studi kasus ini daripada hanya mengandalkan pengecekan aplikasi tanpa lock atau constraint database terpisah, karena beberapa request dari pengguna dapat masuk pada waktu yang sama.

Status `CANCELLED` memastikan booking yang dibatalkan tidak dihitung sebagai jadwal aktif.

## Penanganan Zona Waktu

Zona waktu kantor adalah `Asia/Jakarta` (UTC+7).

- Frontend mengirim waktu booking dengan offset `+07:00`.
- Backend menyimpan waktu sebagai `TIMESTAMPTZ(3)` di PostgreSQL.
- Jam kerja yang divalidasi adalah 08.00–18.00 WIB.
- Availability harian dihitung berdasarkan rentang tanggal `Asia/Jakarta`.
- Frontend menampilkan tanggal dan jam dengan `Intl.DateTimeFormat` zona `Asia/Jakarta`.

## Database

Tiga tabel utama:

| Tabel | Isi |
|---|---|
| `users` | Akun, role, nama, email, dan password ter-hash |
| `rooms` | Nama, kapasitas, fasilitas, lokasi, status aktif, waktu perubahan |
| `bookings` | Pemilik, ruangan, judul, waktu mulai/selesai, status, informasi pembatalan |

Seed menyediakan 1 admin, 2 employee, dan 5 ruangan meeting.

## Troubleshooting

**Port sudah dipakai.** Ubah `POSTGRES_PORT`, `API_PORT`, atau `WEB_PORT` di `.env` root. Jika `API_PORT` atau port web diubah, sesuaikan juga `NEXT_PUBLIC_API_URL`, `API_INTERNAL_URL`, dan `CORS_ORIGINS`.

**Frontend tidak bisa memanggil API (error CORS).** Pastikan alamat frontend Anda ada di `CORS_ORIGINS` pada `apps/api/.env`.

**API gagal start di Docker.** Cek log dengan `docker compose logs -f api`. Penyebab umum: database belum `healthy` atau `POSTGRES_USER`/`POSTGRES_PASSWORD` kosong.

**Data demo tidak muncul.** Seed berjalan saat container API dinyalakan. Untuk mengulang dari nol: `docker compose down -v`, lalu `docker compose up -d --build`.

**Halaman admin/dashboard menampilkan "Layanan autentikasi sedang tidak tersedia" (503).**
Frontend di Docker tidak bisa menjangkau API. Pastikan `API_INTERNAL_URL=http://api:5000`
ada di `apps/web/.env`, lalu jalankan `docker compose up -d --build web`.

## Batasan dan Rencana Pengembangan

Fitur berikut belum tersedia pada versi saat ini:

- Login/Register menggunakan akun google
- Reset atau lupa password.
- Pengubahan data profil dari halaman profil.
- Notifikasi email atau pengingat meeting.
- Booking berulang.
- Dashboard analytics yang lebih mendalam.

## Pengembangan dengan Bantuan AI

Beberapa bagian project dibantu AI, antara lain:

- Penyusunan struktur dokumentasi API
- Pembuatan dan pemeriksaan seed data
- Audit pemenuhan kebutuhan PRD
- Perbaikan sinkronisasi role, autentikasi, dan navigasi profil
- Pengujian build dan concurrency booking