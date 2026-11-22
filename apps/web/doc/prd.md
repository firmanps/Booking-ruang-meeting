## Studi kasus: Booking Ruang Meeting

Sebuah kantor punya beberapa ruang meeting dengan kapasitas dan fasilitas berbeda. Karyawan memesan
ruangan untuk slot waktu tertentu, dan admin mengelola daftar ruangan. Bangun aplikasi fullstack sederhana untuk kebutuhan ini.

Aturan bisnis terpenting: **satu ruangan tidak boleh dipesan dua kali pada waktu yang tumpang tindih,
termasuk saat dua orang memesan di detik yang sama.**

## Kebutuhan wajib

### Backend

1.✅`POST /auth/register` dan `POST /auth/login` dengan dua role: `employee` dan `admin`. Password di-hash, login menghasilkan token (JWT atau session).
2.✅`GET /rooms`: daftar ruangan dengan filter kapasitas minimum (`?minCapacity=6`).
3.✅`GET /rooms/:id/availability?date=YYYY-MM-DD`: jadwal booking ruangan pada tanggal tersebut.
4.✅`POST /bookings` (harus login): memesan ruangan dengan `roomId`, `startAt`, `endAt`, dan `title`. - Validasi: `endAt` setelah `startAt`, durasi 30 menit sampai 4 jam, di dalam jam kerja 08.00–18.00, dan tidak di masa lalu. - Booking tidak boleh bentrok dengan booking lain di ruangan yang sama, termasuk saat ada beberapa request bersamaan. Jika bentrok, kembalikan error dengan status code yang tepat.
5.✅`GET /bookings/me`: daftar booking milik user yang login.
6.✅`DELETE /bookings/:id`: membatalkan booking. Hanya pemilik booking atau admin yang boleh.
7.✅Khusus admin: `POST /rooms` dan `PATCH /rooms/:id` untuk menambah dan mengubah ruangan.
8.✅Validasi input dan format respons error yang konsisten.

### Database

- ✅PostgreSQL, dengan migrasi dan seed data (minimal 5 ruangan, 2 akun employee, dan 1 akun admin).
- ✅Tabel minimal: `users`, `rooms`, `bookings`.
- ✅Waktu disimpan dengan zona waktu yang jelas. Asumsikan kantor berada di zona waktu Asia/Jakarta.

### Frontend

1. Halaman login dan register.
2. Daftar ruangan dengan filter kapasitas.
3. Halaman ruangan yang menampilkan jadwal harian (slot yang sudah terisi) dan form booking.
4. Halaman "Booking saya" dengan tombol batal.
5. Halaman admin untuk menambah dan mengubah ruangan.
6. Tampilkan state loading, error, slot bentrok, dan booking berhasil.

### Menjalankan aplikasi

Sediakan `docker-compose.yml` untuk menjalankan semuanya dengan satu perintah, atau langkah setup yang jelas di README.

## Nilai tambah (opsional)

Pilih sesuai kekuatan dan waktumu. Tidak perlu mengerjakan semuanya.

-✅ **Test konkurensi:** integration test yang mengirim 20 request booking bersamaan untuk ruangan dan jam yang sama, dan membuktikan hanya 1 yang berhasil.

- **Pengaman di level database:** mencegah bentrok langsung lewat constraint di PostgreSQL, tidak hanya lewat kode aplikasi.
- **Booking berulang:** opsi booking mingguan (misalnya setiap Senin selama 4 minggu). Jika salah satu minggu bentrok, tentukan dan jelaskan perilakunya. -**CI:** pipeline (GitHub Actions atau GitLab CI) yang menjalankan lint, test, dan build setiap push.
- **Deploy:** aplikasi bisa diakses di URL publik (VPS, Vercel, Render, Railway, atau lainnya).
- **Notifikasi:** kirim email konfirmasi booking lewat background job (misalnya BullMQ). Email boleh hanya dicetak ke log.

## Yang dikumpulkan

1. Link repository Git (public, atau undang reviewer kami). Riwayat commit dibiarkan apa adanya, jangan di-squash.
2. `README.md` berisi:
   - Cara menjalankan project secara lokal, termasuk akun demo.
   - Gambaran singkat arsitektur.
   - Cara kamu mencegah booking bentrok, dan alasan memilih pendekatan itu.
   - Cara kamu menangani zona waktu.
   - Nilai tambah yang dikerjakan.
   - Hal yang belum selesai dan yang akan ditambahkan kalau punya waktu lebih.
3. URL demo, jika sudah di-deploy.
4. Atau dikumpulkan lewat email yang ada dibawah berupa link Github.
