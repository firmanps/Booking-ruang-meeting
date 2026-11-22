# Auth API

## Daftar endpoint

| Method | Route | Autentikasi | Deskripsi |
|---|---|---|---|
| POST | `/auth/register` | Tidak | Mendaftarkan akun employee |
| POST | `/auth/login` | Tidak | Login dan mendapatkan JWT |
| GET | `/auth/me` | Ya | Mengambil profil pengguna |

## POST /auth/register

### Request

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "password123"
}
```

| Field | Tipe | Aturan |
|---|---|---|
| `name` | string | Wajib; 1-100 karakter |
| `email` | string | Wajib; email valid; maksimal 100 karakter |
| `password` | string | Wajib; 8-255 karakter |

### Response

Status: `201 Created`

```json
{
  "message": "Register berhasil",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "role": "EMPLOYEE",
    "createdAt": "2026-11-22T01:15:16.970Z",
    "updatedAt": "2026-11-22T01:15:16.970Z"
  }
}
```

### Error

- `400 Bad Request` — input tidak valid.
- `409 Conflict` — email sudah terdaftar.

## POST /auth/login

### Request

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "budi@example.com",
  "password": "password123"
}
```

| Field | Tipe | Aturan |
|---|---|---|
| `email` | string | Wajib; email valid; maksimal 100 karakter |
| `password` | string | Wajib; 1-255 karakter |

### Response

Status: `201 Created`

```json
{
  "message": "Login berhasil",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "role": "EMPLOYEE"
  }
}
```

Endpoint juga menyetel cookie:

```text
accessToken=<jwt>; HttpOnly; SameSite=Lax; Max-Age=3600
```

### Error

- `400 Bad Request` — input tidak valid.
- `401 Unauthorized` — email atau password salah.

## GET /auth/me

### Request

```http
GET /auth/me
Authorization: Bearer <accessToken>
```

Autentikasi dapat memakai header bearer atau cookie `accessToken`.

### Response

Status: `200 OK`

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "role": "EMPLOYEE",
    "createdAt": "2026-11-22T01:15:16.970Z",
    "updatedAt": "2026-11-22T01:15:16.970Z"
  }
}
```

### Error

- `401 Unauthorized` — belum login, token tidak valid atau kedaluwarsa, atau pengguna tidak ditemukan.
