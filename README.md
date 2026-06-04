# Sport Reserve

Platform web untuk mencari, melihat detail, dan memesan aktivitas olahraga secara online. Dibangun dengan **Next.js 16 (App Router)**, terintegrasi penuh dengan **Sport Reservation API** (Postman collection: `Sport_Reservation.json`).

UI mengikuti desain **Stitch** (SportReserve Responsive App) dengan design tokens di `src/app/globals.css`.

---

## Fitur utama

### Guest (belum login)
- Landing page: hero, kategori, popular venues
- Browse aktivitas (`/activities`) dengan search, filter kategori & kota, pagination
- Detail aktivitas (`/activities/[id]`)
- Daftar kategori (`/categories`)

### User (login)
- Register & login (Bearer token)
- Keranjang (Zustand + localStorage)
- Checkout + pilih metode pembayaran
- Dashboard: profil & riwayat booking (`/dashboard`)
- Upload bukti pembayaran & batalkan transaksi (pending)
- Detail transaksi (`/transactions/[id]`)

### Admin (`role === "admin"`)
- Dashboard admin: CRUD kategori & aktivitas (`/admin`, `/admin/categories`, `/admin/activities`)
- Semua transaksi + approve/reject (`/admin/transactions`)

---

## Tech stack

| Layer | Teknologi |
|--------|-----------|
| Framework | Next.js 16, React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, design tokens Stitch |
| State | Zustand (auth, cart) |
| Data fetching | SWR (client), `fetch` + ISR (server) |
| Forms | React Hook Form + Zod |
| HTTP | Axios + interceptors (Bearer token) |
| Icons | Lucide React |
| Toast | Sonner |

---

## Memulai proyek

### Prasyarat
- Node.js 20+
- npm

### Instalasi

```bash
cd sport-reservation
npm install
```

### Environment

Buat file `.env.local` di root proyek:

```env
NEXT_PUBLIC_BASE_URL=https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1
```

> Pastikan base URL mengarah ke prefix `/api/v1` sesuai koleksi Postman.

### Menjalankan

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # jalankan build production
npm run lint     # ESLint
```

---

## Routes

| Route | Deskripsi |
|-------|-----------|
| `/` | Home |
| `/login`, `/register` | Auth (tanpa navbar/footer utama) |
| `/activities` | Daftar aktivitas + filter |
| `/activities/[id]` | Detail aktivitas |
| `/categories` | Semua kategori |
| `/cart` | Keranjang |
| `/checkout` | Checkout & konfirmasi booking |
| `/dashboard` | My Bookings + profil |
| `/me` | Profil user saat ini (`GET /me`) |
| `/transactions/[id]` | Detail transaksi & upload bukti |
| `/admin` | Admin: kategori & aktivitas (tab) |
| `/admin/transactions` | Admin: semua transaksi & verifikasi |

---

## Integrasi API

Base URL: `NEXT_PUBLIC_BASE_URL` (contoh: `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1`)

### Authentication
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/login` | Login → token + user |
| POST | `/register` | Daftar user baru |
| GET | `/me` | Data user saat ini |
| POST | `/update-user/{id}` | Update profil |
| GET | `/logout` | Logout (tanpa body, pakai Bearer) |

Token disimpan di `localStorage` (`auth_token`) dan dikirim via header `Authorization: Bearer <token>`.

### Sport activities
| Method | Endpoint | Query / body |
|--------|----------|----------------|
| GET | `/sport-activities` | `search`, `sport_category_id`, `city_id`, `is_paginate`, `per_page`, `page` |
| GET | `/sport-activities/{id}` | Detail |
| POST | `/sport-activities/create` | Payload snake_case (lihat Postman) |
| POST | `/sport-activities/update/{id}` | Update |
| DELETE | `/sport-activities/delete/{id}` | Hapus |

### Categories, location, payment
- `GET /sport-categories` + CRUD (`/create`, `/update/{id}`, `/delete/{id}`)
- `GET /location/provinces`, `GET /location/cities/{provinceId}`
- `GET /payment-methods` (logo fallback di client jika `imageUrl` kosong)

### Transactions
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/transaction/create` | Body: `sport_activity_id`, `payment_method_id` |
| GET | `/my-transaction` | Riwayat user |
| GET | `/transaction/{id}` | Detail transaksi |
| POST | `/transaction/update-proof-payment/{id}` | `{ proofPaymentUrl }` |
| POST | `/transaction/cancel/{id}` | Batalkan |
| GET | `/all-transaction` | Admin: semua transaksi |
| POST | `/transaction/update-status/{id}` | Admin: `success` / `failed` |

### File upload
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/upload-image` | Foto profil, bukti bayar, gambar kategori/aktivitas |
| POST | `/upload-file` | File umum (helper tersedia) |

---

## Struktur proyek

```
src/
├── app/                      # Next.js App Router (pages)
│   ├── (auth)/login|register
│   ├── activities/[id]
│   ├── admin/...
│   ├── cart, checkout, dashboard, categories
│   └── transactions/[id]
├── features/                 # Feature-based modules
│   ├── auth/                 # Login, register, profil
│   ├── activity/             # List, detail, filter, admin form
│   ├── category/
│   ├── checkout/
│   ├── transaction/
│   ├── payment/
│   ├── location/
│   ├── home/
│   └── file/                 # Upload image/file
├── shared/
│   ├── components/           # UI, layout (Navbar, Footer, PageShell)
│   ├── config/               # api.ts, SWR keys, server-fetch
│   ├── hooks/
│   ├── types/
│   └── utils/
└── store/
    ├── useAuthStore.ts       # Auth (persist + hydration)
    └── useCartStore.ts       # Cart (persist)
```

**Pola data**
- **Server**: `*.server.ts` + `serverFetch` untuk halaman dengan ISR/revalidate
- **Client**: `*.client.ts` + SWR (`client-fetch.ts`, `swr-keys.ts`)
- **Mutations**: `useMutation` / `useMutationWithInvalidation` + invalidasi cache SWR

---

## Role & akses

| Role | Cara mendapatkan | Akses |
|------|------------------|--------|
| `user` | Register default dari backend | Booking, cart, dashboard, profil |
| `admin` | Di-set di backend / database | `/admin`, `/admin/transactions`, dll. |

Frontend **tidak** mengirim field `role` saat register (hanya backend yang menetapkan admin).

Cek role setelah login: Dashboard → Settings, atau `localStorage` / DevTools → Application → `auth-storage`.

---

## Catatan implementasi

1. **Checkout**: payload create transaction memakai `sport_activity_id` + `payment_method_id` (snake_case). Cart multi-item: aktivitas pertama yang dikirim ke API (sesuai spec Postman).
2. **Pagination**: list aktivitas client memakai `per_page=5` + navigasi halaman.
3. **Bukti bayar**: upload gambar → dapat URL → `POST update-proof-payment`.
4. **Hydration auth**: dashboard menunggu Zustand persist selesai agar tidak blank setelah redirect dari checkout.