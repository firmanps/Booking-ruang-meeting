# Dokumentasi API

Dokumentasi REST API aplikasi Booking Ruang Meeting.

- **Base URL:** `http://localhost:4000`
- **Format:** JSON
- **Autentikasi:** bearer token pada header `Authorization` atau cookie `access_token`
- **Zona waktu:** `Asia/Jakarta`

## Autentikasi

- [Auth API](./auth.md)

## Ruangan

- [Rooms API](./rooms.md)

## Booking

- [Bookings API](./bookings.md)

## Format autentikasi

Setelah login, kirim JWT dengan salah satu cara berikut:

```http
Authorization: Bearer <access_token>
```

atau gunakan cookie yang dibuat otomatis oleh login:

```http
Cookie: access_token=<access_token>
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

