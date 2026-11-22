# Bookings API

## Daftar endpoint

| Method | Route | Autentikasi | Role | Deskripsi |
|---|---|---|---|---|
| POST | `/bookings` | Ya | Semua | Membuat booking |
| GET | `/bookings` | Ya | Admin | Mengambil seluruh booking |
| GET | `/bookings/me` | Ya | Semua | Mengambil booking milik pengguna |
| DELETE | `/bookings/:id` | Ya | Pemilik atau Admin | Membatalkan booking |

## POST /bookings

### Request

```http
POST /bookings
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "roomId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "title": "Sprint Planning",
  "startAt": "2026-11-23T09:00:00+07:00",
  "endAt": "2026-11-23T10:00:00+07:00"
}
```

| Field | Tipe | Aturan |
|---|---|---|
| `roomId` | UUID string | Wajib; ruangan harus ada dan aktif |
| `title` | string | Wajib; 1-50 karakter |
| `startAt` | ISO 8601 datetime with offset | Wajib |
| `endAt` | ISO 8601 datetime with offset | Wajib; harus setelah `startAt` |

Aturan waktu:

- Durasi 30 menit sampai 4 jam.
- Tidak boleh dibuat pada masa lalu.
- Harus berada pada jam kerja `08.00-18.00` Asia/Jakarta.
- `startAt` dan `endAt` harus pada tanggal yang sama di Asia/Jakarta.
- Tidak boleh tumpang tindih dengan booking berstatus `CONFIRMED`.

Pembuatannya dilindungi oleh PostgreSQL advisory transaction lock per ruangan dan pengecekan waktu bentrok dalam transaksi.

### Response

Status: `201 Created`

```json
{
  "id": "a3bb189e-8bf9-3888-9912-ace4e6543002",
  "roomId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Sprint Planning",
  "startAt": "2026-11-23T02:00:00.000Z",
  "endAt": "2026-11-23T03:00:00.000Z",
  "status": "CONFIRMED",
  "createdAt": "2026-11-22T01:15:16.970Z"
}
```

### Error

- `400 Bad Request` — format waktu, durasi, jam kerja, waktu masa lalu, atau ruangan tidak aktif.
- `401 Unauthorized` — belum login atau token tidak valid.
- `404 Not Found` — ruangan tidak ditemukan.
- `409 Conflict` — waktu bentrok dengan booking lain.

## GET /bookings

### Request

```http
GET /bookings
Authorization: Bearer <accessTokenAdmin>
```

### Response

Status: `200 OK`

```json
{
  "bookings": [
    {
      "id": "a3bb189e-8bf9-3888-9912-ace4e6543002",
      "title": "Sprint Planning",
      "startAt": "2026-11-23T02:00:00.000Z",
      "endAt": "2026-11-23T03:00:00.000Z",
      "status": "CONFIRMED",
      "cancelledAt": null,
      "cancelledBy": null,
      "createdAt": "2026-11-22T01:15:16.970Z",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Budi Santoso",
        "email": "budi@example.com",
        "role": "EMPLOYEE"
      },
      "rooms": {
        "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "name": "Ruang Garuda",
        "capacity": 10,
        "locations": "Gedung A lantai 2"
      }
    }
  ]
}
```

Daftar diurutkan berdasarkan `startAt` naik.

### Error

- `401 Unauthorized` — belum login atau token tidak valid.
- `403 Forbidden` — pengguna bukan admin.

## GET /bookings/me

### Request

```http
GET /bookings/me
Authorization: Bearer <accessToken>
```

### Response

Status: `200 OK`

```json
{
  "bookings": [
    {
      "id": "a3bb189e-8bf9-3888-9912-ace4e6543002",
      "title": "Sprint Planning",
      "startAt": "2026-11-23T02:00:00.000Z",
      "endAt": "2026-11-23T03:00:00.000Z",
      "status": "CONFIRMED",
      "cancelledAt": null,
      "cancelledBy": null,
      "createdAt": "2026-11-22T01:15:16.970Z",
      "rooms": {
        "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "name": "Ruang Garuda",
        "capacity": 10,
        "locations": "Gedung A lantai 2"
      }
    }
  ]
}
```

Daftar diurutkan berdasarkan `startAt` naik.

### Error

- `401 Unauthorized` — belum login atau token tidak valid.

## DELETE /bookings/:id

### Request

```http
DELETE /bookings/{bookingId}
Authorization: Bearer <accessToken>
```

Pemilik booking atau admin dapat membatalkan booking. Employee tidak dapat membatalkan booking milik pengguna lain.

### Response

Status: `200 OK`

```json
{
  "message": "Booking berhasil dibatalkan",
  "booking": {
    "id": "a3bb189e-8bf9-3888-9912-ace4e6543002",
    "title": "Sprint Planning",
    "status": "CANCELLED",
    "cancelledAt": "2026-11-22T02:15:16.970Z",
    "cancelledBy": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Error

- `400 Bad Request` — booking sudah dibatalkan.
- `401 Unauthorized` — belum login atau token tidak valid.
- `403 Forbidden` — employee mencoba membatalkan booking milik pengguna lain.
- `404 Not Found` — booking tidak ditemukan.
