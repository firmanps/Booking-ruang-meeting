# Dokumentasi API

Dokumentasi REST API aplikasi MeetSpace — Booking Ruang Meeting Gedung Kantor.

- **Base URL:** `http://localhost:5000`
- **Format:** JSON
- **Autentikasi:** bearer token pada header `Authorization` atau cookie `accessToken`
- **Zona waktu:** `Asia/Jakarta`
- **Konvensi field:** `camelCase` untuk request, query, response, dan Zod schema

Port default aplikasi adalah `5000` pada konfigurasi `.env` proyek saat ini. Jika variabel `PORT` tidak disetel, kode aplikasi menggunakan fallback `4000`.

## Autentikasi

- [Auth API](./auth.md)

## Ruangan

- [Rooms API](./rooms.md)

## Booking

- [Bookings API](./bookings.md)

## Format autentikasi

Setelah login, kirim JWT dengan salah satu cara berikut:

```http
Authorization: Bearer <accessToken>
```

atau gunakan cookie yang dibuat otomatis oleh login:

```http
Cookie: accessToken=<accessToken>
```

## Konfigurasi environment

Contoh variabel `.env` pada aplikasi API:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database"
PORT=5000
JWT_SECRET="ganti-dengan-secret-yang-kuat"
JWT_EXPIRES_IN="1h"
NODE_ENV="development"
CORS_ORIGINS="http://localhost:3000"
```

Untuk beberapa origin frontend, pisahkan URL dengan koma:

```env
CORS_ORIGINS="http://localhost:3000,https://meetspace.example.com"
```

## Format error

Kesalahan memakai HTTP status code dan format berikut:

```json
{
  "statusCode": 400,
  "error": "Request Error",
  "message": "Pesan ringkas",
  "details": null,
  "path": "/rooms",
  "timestamp": "2026-11-22T01:15:16.970Z"
}
```

Untuk kegagalan validasi Zod, `details` berisi object field error dan `message` bernilai `Validasi input gagal`.

