# Rooms API

## Daftar endpoint

| Method | Route | Autentikasi | Role | Deskripsi |
|---|---|---|---|---|
| POST | `/rooms` | Ya | Admin | Menambahkan ruangan |
| GET | `/rooms` | Tidak | — | Mengambil daftar ruangan |
| GET | `/rooms/:id` | Tidak | — | Mengambil detail ruangan |
| GET | `/rooms/:id/availability` | Tidak | — | Mengambil jadwal ruangan |
| PATCH | `/rooms/:id` | Ya | Admin | Memperbarui ruangan |
| DELETE | `/rooms/:id` | Ya | Admin | Menghapus ruangan |

## POST /rooms

### Request

```http
POST /rooms
Authorization: Bearer <accessTokenAdmin>
Content-Type: application/json
```

```json
{
  "name": "Ruang Garuda",
  "capacity": 10,
  "facilities": "Proyektor, papan tulis, AC",
  "locations": "Gedung A lantai 2",
  "isActive": true
}
```

| Field | Tipe | Aturan |
|---|---|---|
| `name` | string | Wajib; 1-100 karakter |
| `capacity` | integer | Wajib; 1-1000 |
| `facilities` | string | Wajib; 1-1000 karakter |
| `locations` | string | Wajib; 1-1000 karakter |
| `isActive` | boolean | Opsional; default `true` |

### Response

Status: `201 Created`

```json
{
  "message": "Ruangan berhasil ditambahkan",
  "room": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "Ruang Garuda",
    "capacity": 10,
    "facilities": "Proyektor, papan tulis, AC",
    "locations": "Gedung A lantai 2",
    "isActive": true,
    "createdAt": "2026-11-22T01:15:16.970Z",
    "updatedAt": "2026-11-22T01:15:16.970Z"
  }
}
```

### Error

- `400 Bad Request` — input tidak valid.
- `401 Unauthorized` — belum login atau token tidak valid.
- `403 Forbidden` — pengguna bukan admin.

## GET /rooms

### Request

```http
GET /rooms?minCapacity=6&isActive=true
```

| Query | Tipe | Aturan |
|---|---|---|
| `minCapacity` | integer | Opsional; positif |
| `isActive` | string | Opsional; `true` atau `false` |

### Response

Status: `200 OK`

```json
{
  "rooms": [
    {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "Ruang Garuda",
      "capacity": 10,
      "facilities": "Proyektor, papan tulis, AC",
      "locations": "Gedung A lantai 2",
      "isActive": true
    }
  ]
}
```

Tanpa query, seluruh ruangan dikembalikan dan diurutkan berdasarkan nama.

### Error

- `400 Bad Request` — nilai query tidak valid.

## GET /rooms/:id

### Request

```http
GET /rooms/{roomId}
```

### Response

Status: `200 OK`

```json
{
  "room": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "Ruang Garuda",
    "capacity": 10,
    "facilities": "Proyektor, papan tulis, AC",
    "locations": "Gedung A lantai 2",
    "isActive": true,
    "createdAt": "2026-11-22T01:15:16.970Z",
    "updatedAt": "2026-11-22T01:15:16.970Z"
  }
}
```

### Error

- `404 Not Found` — ruangan tidak ditemukan.

## GET /rooms/:id/availability

### Request

```http
GET /rooms/{roomId}/availability?date=2026-11-23
```

| Parameter | Tipe | Aturan |
|---|---|---|
| `roomId` | UUID string | ID ruangan aktif |
| `date` | query string | Wajib; format `YYYY-MM-DD` |

### Response

Status: `200 OK`

```json
{
  "room": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "Ruang Garuda",
    "capacity": 10,
    "facilities": "Proyektor, papan tulis, AC",
    "locations": "Gedung A lantai 2",
    "isActive": true
  },
  "date": "2026-11-23",
  "timezone": "Asia/Jakarta",
  "bookings": [
    {
      "id": "a3bb189e-8bf9-3888-9912-ace4e6543002",
      "title": "Sprint Planning",
      "startAt": "2026-11-23T01:00:00.000Z",
      "endAt": "2026-11-23T02:00:00.000Z"
    }
  ]
}
```

Hanya booking berstatus `CONFIRMED` yang dikembalikan.

### Error

- `400 Bad Request` — format atau nilai tanggal tidak valid.
- `404 Not Found` — ruangan tidak ditemukan atau tidak aktif.

## PATCH /rooms/:id

### Request

```http
PATCH /rooms/{roomId}
Authorization: Bearer <accessTokenAdmin>
Content-Type: application/json
```

```json
{
  "name": "Ruang Garuda Utama",
  "capacity": 12,
  "isActive": false
}
```

Minimal satu field harus diisi. Field yang diperbolehkan: `name`, `capacity`, `facilities`, `locations`, dan `isActive`.

Jika `isActive` diubah menjadi `false`, booking aktif mendatang pada ruangan tersebut dibatalkan dalam transaksi yang sama.

### Response

Status: `200 OK`

```json
{
  "message": "Ruangan berhasil diperbarui dan 2 booking dibatalkan",
  "room": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "Ruang Garuda Utama",
    "capacity": 12,
    "facilities": "Proyektor, papan tulis, AC",
    "locations": "Gedung A lantai 2",
    "isActive": false,
    "createdAt": "2026-11-22T01:15:16.970Z",
    "updatedAt": "2026-11-22T01:20:16.970Z"
  },
  "cancelledBookingsCount": 2
}
```

### Error

- `400 Bad Request` — tidak ada field atau input tidak valid.
- `401 Unauthorized` — belum login atau token tidak valid.
- `403 Forbidden` — pengguna bukan admin.
- `404 Not Found` — ruangan tidak ditemukan.

## DELETE /rooms/:id

### Request

```http
DELETE /rooms/{roomId}
Authorization: Bearer <accessTokenAdmin>
```

Penghapusan ruangan juga menghapus booking terkait karena relasi database memakai `onDelete: Cascade`.

### Response

Status: `200 OK`

```json
{
  "message": "Ruangan berhasil dihapus"
}
```

### Error

- `401 Unauthorized` — belum login atau token tidak valid.
- `403 Forbidden` — pengguna bukan admin.
- `404 Not Found` — ruangan tidak ditemukan.
