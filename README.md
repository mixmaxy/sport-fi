# Project Name: Sport Reservation Web Application (Sport-Fi)
# Target Developer: Junior Front-End Web Developer
# Architecture Style: Clean Architecture & Clean Code (Feature-Based Model)   

## Project Overview & Objectives
Proyek ini adalah platform berbasis web yang memungkinkan pengguna untuk mencari, melihat, dan memesan fasilitas atau aktivitas olahraga secara online.

### Objectives:
- Membangun antarmuka (Front-End) interaktif menggunakan HTML, CSS, JavaScript, dan Tailwind CSS.
- Mengimplementasikan framework React atau Next.js untuk performa dan skalabilitas yang optimal.
- Mengintegrasikan fungsionalitas CRUD secara penuh menggunakan API yang telah disediakan.
- Mengelola repositori kode menggunakan Git dengan dokumentasi yang rapi.
- Melakukan deployment aplikasi agar dapat diakses secara publik.

## User Persona & Flow
- Guest (Belum Login): Dapat melihat Landing Page, menjelajahi kategori olahraga, mencari lokasi, dan melihat detail aktivitas olahraga.
- Registered Customer (Sudah Login): Dapat melakukan pemesanan (transaksi), mengelola profil, melihat riwayat transaksi, mengunggah bukti pembayaran, dan membatalkan pesanan.
- Admin (Optional/Role-based): Mengelola (CRUD) Kategori Olahraga dan Aktivitas Olahraga.

## Scope of Pages & Features (UI/UX Requirement)
Sesuai panduan layout (Phone & Desktop layout), aplikasi ini wajib responsif:

### A. Core Pages
Homepage / Landing Page:
    - Navbar: Navigasi, tombol Login/Register (jika belum login), atau Menu Profil (jika sudah login).
    - Hero Section: Banner utama dengan tombol Call-to-Action (CTA).
    - Sport Categories Section: Menampilkan daftar kategori olahraga (diambil dari API).
    - Featured Activities Section: Daftar aktivitas olahraga terpopuler/terbaru.
Auth Pages (Login & Register):
    - Form input email, password, nama, dll. sesuai kebutuhan API Authentication.
Sport Activity Detail Page:
    - Menampilkan deskripsi lengkap, harga, lokasi (provinsi/kota), dan tombol "Book Now" / "Add to Cart".
Cart / Checkout Page:
    - Daftar aktivitas yang dipilih, ringkasan harga, pemilihan metode pembayaran, dan tombol konfirmasi pesanan.
User Dashboard & Transaction History:
    - Halaman profil untuk update data user.
    - Daftar transaksi pengguna beserta statusnya (Pending, Success, Canceled).
    - Fitur unggah bukti pembayaran (menggunakan API File).
Admin Dashboard (CRUD Management):
    - Halaman khusus untuk melakukan Create, Read, Update, Delete pada Sport Category dan Sport Activity.

## API Integration Mapping
Base URL: https://sport-reservation-api-bootcamp.do.dibimbing.id
Endpoints Implementation:
    - Authentication: POST /login, POST /register, GET /me, POST /update-user, GET /logout.
    - File: POST /upload-image (digunakan untuk foto profil, gambar aktivitas, atau bukti pembayaran).
    - Sport Category (CRUD): GET /categories, POST /create-category, POST /update-category, DEL /delete-category.
    - Location: GET /provinces, GET /cities, GET /cities-by-province-id (untuk filter pencarian tempat olahraga).
    - Sport Activity (CRUD): GET /sport-activities, GET /sport-activity-by-id, POST /create-sport-activity, POST /update-sport-activity, DEL /delete-sport-activity.
    - Payment Method: GET /payment-methods.
    - Transaction: POST /create-transaction, GET /my-transaction, POST /update-proof-payment-url, POST /cancel-transaction.

## Project Structure

```
src/
├── features/            # Pembagian berdasarkan Fitur Utama
│   ├── auth/
│   │   ├── components/  # LoginForm, RegisterForm
│   │   ├── hooks/       # useAuth (login, logout function)
│   │   └── services/    # authApi.ts (axios calls)
│   ├── activity/
│   │   ├── components/  # ActivityCard, ActivityDetail, ActivityList, ActivityFormModal, AdminActivityTable
│   │   └── services/    # activityApi.ts (CRUD requests)
│   ├── transaction/
│   │   ├── components/  # CheckoutForm, TransactionHistory, TransactionList, ProofPaymentUpload
│   │   └── services/    # transactionApi.ts
│   ├── category/
│   │   ├── components/  # CategoryCard, CategoryFormModal, AdminCategoryTable
│   │   └── services/    # categoryApi.ts
│   ├── location/
│   │   ├── components/  # LocationFilter
│   │   └── services/    # locationApi.ts
│   ├── payment/
│   │   ├── components/  # PaymentSelector
│   │   └── services/    # paymentApi.ts
├── app/                 
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── shared/              
│   ├── components/      # Global Reusable Components (Buttons, Input, Navbar, Footer)
│   ├── config/          # API configuration, axios instance, etc
│   ├── hooks/           # Custom hooks
│   ├── types/           # Type definitions (interface & type)
│   └── utils/           # Helper functions (format currency, date, etc.)
├── store/               # Global state (Zustand)
│   ├── useAuthStore.ts  # Authentication state
│   └── useCartStore.ts  # Cart state
```

## Tech Stack

- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS 4
- Shadcn/UI - UI Component Library
- Zustand - Global State Management
- TanStack Query v5 - Server State Management
- React Hook Form - Form Handling
- Zod - Form Validation
- Lucide React - Icon
- Axios - API Integration