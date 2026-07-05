# Sport Reserve

Platform web untuk mencari, melihat detail, dan memesan aktivitas olahraga secara online. Dibangun dengan **Next.js 16 (App Router)**, terintegrasi penuh dengan **Sport Reservation API**.

Referensi API: koleksi Postman [`Sport_Reservation.json`](./Sport_Reservation.json) di root proyek.

UI memakai design tokens Material-inspired di `src/app/globals.css` (Tailwind CSS 4 + `@theme inline`).

---

## Fitur utama

### Guest (belum login)

- Landing page: hero, kategori, popular venues, CTA partner
- Browse aktivitas (`/activities`) — search, filter kategori & provinsi/kota, pagination
- Detail aktivitas (`/activities/[id]`)
- Daftar kategori (`/categories`)

### User (login)

- Register & login (Bearer token)
- Keranjang (Zustand + `localStorage`)
- Checkout + pilih metode pembayaran
- Dashboard (`/dashboard`): tab **My Bookings** & **Settings** (profil)
- Halaman profil (`/me`) — data user dari `GET /me`
- Upload bukti pembayaran & batalkan transaksi (status `pending`)
- Sembunyikan transaksi `cancelled` / `failed` dari daftar (persist lokal)
- Detail transaksi (`/transactions/[id]`)

### Admin (`role === "admin"`)

- Dashboard admin: CRUD kategori & aktivitas via tab (`/admin`)
- Verifikasi transaksi: filter status, search, pagination, approve/reject (`/admin/transactions`)
- Route guard: non-admin diarahkan ke home dengan toast error

---

## Tech stack

| Layer | Teknologi |
|--------|-----------|
| Framework | Next.js 16, React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, design tokens (`globals.css`) |
| State | Zustand (auth, cart, hidden transactions) |
| Data fetching | SWR (client), `fetch` + ISR (server) |
| Forms | React Hook Form + Zod |
| HTTP | Axios + interceptors (Bearer token, 401 → logout) |
| Icons | Lucide React |
| Toast | Sonner |

---

## Memulai proyek

### Prasyarat

- Node.js 20+
- npm

### Instalasi

```bash
git clone <url-repo>
cd sport-reservation
npm install
```

### Environment

Buat file `.env.local` di root proyek:

```env
NEXT_PUBLIC_BASE_URL=https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1
```

> Base URL harus mengarah ke prefix `/api/v1` sesuai koleksi Postman.

### Menjalankan

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # jalankan build production
npm run lint     # ESLint
```

---

## Routes

| Route | Akses | Deskripsi |
|-------|--------|-----------|
| `/` | Public | Home |
| `/login`, `/register` | Public | Auth (layout tanpa navbar/footer utama) |
| `/activities` | Public | Daftar aktivitas + filter |
| `/activities/[id]` | Public | Detail aktivitas |
| `/categories` | Public | Semua kategori |
| `/cart` | User | Keranjang |
| `/checkout` | User | Checkout & konfirmasi booking |
| `/dashboard` | User | My Bookings + profil (tab) |
| `/me` | User | Profil user (`GET /me`) |
| `/transactions/[id]` | User | Detail transaksi & upload bukti |
| `/admin` | Admin | CRUD kategori & aktivitas |
| `/admin/transactions` | Admin | Semua transaksi & verifikasi |

---

## Integrasi API

Base URL: `NEXT_PUBLIC_BASE_URL`

Contoh: `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1`

### Authentication

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/login` | Login → token + user |
| POST | `/register` | Daftar user baru |
| GET | `/me` | Data user saat ini |
| POST | `/update-user/{id}` | Update profil |
| GET | `/logout` | Logout (Bearer token) |

Token disimpan di Zustand persist (`auth-storage`) dan disinkronkan ke `localStorage` (`auth_token`, `user_data`). Header: `Authorization: Bearer <token>`.

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
| GET | `/my-transaction` | Riwayat user (`per_page=100`) |
| GET | `/transaction/{id}` | Detail transaksi |
| POST | `/transaction/update-proof-payment/{id}` | `{ proofPaymentUrl }` |
| POST | `/transaction/cancel/{id}` | Batalkan (pending) |
| GET | `/all-transaction` | Admin: semua transaksi + filter |
| POST | `/transaction/update-status/{id}` | Admin: `success` / `failed` |

### File upload

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/upload-image` | Foto profil, bukti bayar, gambar kategori/aktivitas |
| POST | `/upload-file` | File umum |

---

## Struktur proyek

```
src/
├── app/                          # Next.js App Router (pages)
│   ├── (auth)/login|register
│   ├── activities/[id]
│   ├── admin/                    # /admin, /admin/transactions
│   ├── cart, checkout, dashboard, categories, me
│   └── transactions/[id]
├── features/                     # Feature-based modules
│   ├── admin/                    # Guard, CRUD panel, verifikasi transaksi
│   ├── auth/                     # Login, register, profil, session restore
│   ├── activity/                 # List, detail, filter, admin form
│   ├── category/
│   ├── checkout/
│   ├── transaction/
│   ├── payment/
│   ├── location/
│   ├── home/
│   └── file/                     # Upload image/file
├── shared/
│   ├── components/               # UI, layout (Navbar, Footer, PageShell)
│   ├── config/                   # api.ts, SWR keys, server/client fetch
│   ├── hooks/                    # useMutation, useMutationWithInvalidation
│   ├── types/
│   └── utils/
└── store/
    ├── useAuthStore.ts           # Auth (persist + hydration)
    ├── useCartStore.ts           # Cart (persist)
    └── useHiddenTransactionsStore.ts  # Sembunyikan tx cancelled/failed
```

**Pola data**

- **Server**: `*.server.ts` + `serverFetch` untuk halaman dengan ISR/revalidate
- **Client**: `*.client.ts` + SWR (`client-fetch.ts`, `swr-keys.ts`)
- **Mapper**: `*.mapper.ts` — normalisasi snake_case API → camelCase frontend
- **Mutations**: `useMutationWithInvalidation` + invalidasi cache SWR

---

## Auth & sesi

1. **Login/register** → `setAuth(user, token)` menyimpan ke Zustand persist + `localStorage`.
2. **AuthHydrationProvider** menunggu rehydrate selesai sebelum UI auth-sensitive dirender.
3. **useRestoreAuthSession** — jika token ada tapi `user` kosong, fetch `GET /me` atau fallback `user_data` legacy.
4. **401 interceptor** — logout otomatis dan redirect ke `/login` jika token expired/invalid.
5. **Admin guard** (`useAdminGuard`) — cek `user.role === "admin"` sebelum render panel admin.

---

## Role & akses

| Role | Cara mendapatkan | Akses |
|------|------------------|--------|
| `user` | Register default dari backend | Booking, cart, dashboard, profil |
| `admin` | Di-set di backend / database | `/admin`, `/admin/transactions` |

Frontend **tidak** mengirim field `role` saat register — hanya backend yang menetapkan admin.

Cek role setelah login: Dashboard → Settings, navbar (link Admin), atau DevTools → Application → `auth-storage`.

---

## Catatan implementasi

1. **Checkout**: setiap item keranjang membuat transaksi terpisah (`POST /transaction/create` per aktivitas). Payload API tetap `sport_activity_id` + `payment_method_id` (snake_case).
2. **Pagination**: list aktivitas & admin memakai `per_page=5` + navigasi halaman.
3. **Bukti bayar**: upload gambar → dapat URL → `POST /transaction/update-proof-payment/{id}`.
4. **Hydration auth**: dashboard & checkout menunggu Zustand persist + session restore agar tidak blank setelah redirect.
5. **Admin transaksi**: tab status (`pending`, `success`, `cancelled`), search, approve (`success`) / reject (`failed`).
6. **Gambar eksternal**: helper `ExternalImage` + `skipImageOptimization` untuk URL dari API upload.

---

## Credential for Testing

| Role | Email | Password |
|------|------------------|--------|
| `admin` | syukran@gmail.com | syukran123 |
| `user` | user.testing@gmail.com | user12345 |