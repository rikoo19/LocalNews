# News Finder - Local News

Aplikasi pencarian berita lokal berbasis React dengan class-based components.

## Fitur

### Komponen yang Diimplementasikan:
1. **TextBox** - Input pencarian berita dengan kata kunci
2. **Button** - Tombol untuk memulai pencarian
3. **Dropdown** - Pilihan kategori berita (Umum, Bisnis, Teknologi, dll)
4. **CheckBox** - Filter untuk menampilkan hanya berita dengan gambar
5. **Halaman Utama** - Menampilkan hasil pencarian berita dalam grid layout

### State Management:
- `searchQuery` - Menyimpan kata kunci pencarian
- `category` - Kategori berita yang dipilih
- `showImagesOnly` - Status checkbox filter gambar
- `articles` - Array data berita dari API
- `loading` - Status loading saat fetch data
- `error` - Pesan error jika terjadi kesalahan
- `hasSearched` - Tracking apakah user sudah melakukan pencarian

### API Integration:
Menggunakan NewsAPI (https://newsapi.org) untuk mendapatkan berita terkini.

**Catatan:** Untuk menggunakan aplikasi ini dengan data real:
1. Daftar gratis di https://newsapi.org
2. Dapatkan API Key
3. Ganti nilai `API_KEY` di file `src/App.js` dengan API key Anda

## Cara Menjalankan

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm start
```

3. Buka browser di http://localhost:3000

## Struktur Komponen

```
App (Class Component)
├── Header
├── Main Content
│   ├── Search Section
│   │   ├── TextBox (Class Component)
│   │   ├── Dropdown (Class Component)
│   │   ├── CheckBox (Class Component)
│   │   └── Button (Class Component)
│   └── Results Section
│       └── NewsCard (Class Component) - Multiple instances
└── Footer
```

## Teknologi

- React 18.2.0
- Class-based Components
- NewsAPI
- CSS3 dengan Flexbox & Grid
- Responsive Design

## Screenshot Fitur

- Pencarian berita dengan kata kunci
- Filter berdasarkan kategori
- Filter berita dengan gambar saja
- Tampilan grid responsif
- Loading state
- Error handling

---

Dibuat untuk tugas Web Technology 3
