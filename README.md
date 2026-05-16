```markdown
# 🚀 Perkhidmatan Murah Gila dan Jimat Masa

**Sentinel‑01 · Autonomous Service Selection Console**  
*Pilih, hantar, jimat masa — semua dalam satu antara muka profesional.*

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://state-of-protocol.github.io/Perkhidmatan-murah-gila-dan-jimat-masa/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?logo=tailwindcss)](https://tailwindcss.com)

Sebuah konsol pemilihan perkhidmatan moden dan ringkas yang dibina untuk pengguna akhir. Pilih perkhidmatan yang anda perlukan, lampirkan fail, dan hantar permintaan terus — tiada konfigurasi rumit, tiada iklan. Dibina dengan tumpuan kepada **kemudahan penggunaan**, **prestasi pantas**, dan **reka bentuk responsif**.

---

## 📖 Isi Kandungan

- [Pratonton](#pratonton)
- [Ciri‑ciri Utama](#ciri‑ciri-utama)
- [Timbunan Teknologi](#timbunan-teknologi)
- [Struktur Fail](#struktur-fail)
- [Bermula Pantas](#bermula-pantas)
- [Penempatan di GitHub Pages](#penempatan-di-github-pages)
- [Penyesuaian](#penyesuaian)
- [Menyumbang](#menyumbang)
- [Lesen](#lesen)
- [Hubungi](#hubungi)

---

## 📸 Pratonton

![Sentinel-01 Console Screenshot](assets/screenshot.png)

*Antara muka pemilihan perkhidmatan yang bersih, ringan, dan mesra pengguna.*

---

## ✨ Ciri‑ciri Utama

- **15 Perkhidmatan Modular** – API, data pipeline, web intelligence, e‑commerce, AI, kepatuhan, dan banyak lagi.
- **Pemilihan Sekali Klik** – Kad interaktif dengan maklum balas visual segera.
- **Borang Hantar Pintar** – Emel, mesej, dan lampiran fail (maks 10 MB).
- **Pengesahan Penuh** – Pastikan sekurang‑kurangnya satu perkhidmatan dipilih dan format emel sah.
- **Hantar Tanpa Muat Semula** – Penggunaan `fetch` API untuk penghantaran asinkronus (tiada segar semula halaman).
- **Tema Ringan Profesional** – Inspirasi Google Font Inter, palet kelabu lembut, selesa di mata.
- **100% Responsif** – Berfungsi dengan cantik pada desktop, tablet, dan telefon.
- **Sedia GitHub Pages** – Hanya hoskan, tiada back‑end diperlukan (Formspree atau servis serupa untuk memproses borang).

---

## 🧱 Timbunan Teknologi

| Teknologi        | Kegunaan                                      |
|------------------|-----------------------------------------------|
| HTML5            | Struktur utama dan borang                     |
| Tailwind CSS 3.x | Penggayaan utiliti-pertama, CDN               |
| CSS Tersuai      | Animasi halus, glow terminal, scrollbar       |
| JavaScript ES6   | Logik pemilihan, pengesahan, hantar async     |
| Formspree (opsi) | Endpoint pemprosesan borang percuma           |

---

## 📁 Struktur Fail

```
Perkhidmatan-murah-gila-dan-jimat-masa/
├── index.html        # Halaman utama dengan kad perkhidmatan dan borang
├── script.js         # Pengawal pemilihan, pengesahan, dan penghantaran
├── styles.css        # Tema kustom ringan & aneka sentuhan visual
├── README.md         # Dokumentasi lengkap (anda di sini)
└── assets/
    └── screenshot.png   # Gambar pratonton untuk README
```

---

## 🚀 Bermula Pantas

1. **Klon repositori ini**
   ```bash
   git clone https://github.com/state-of-protocol/Perkhidmatan-murah-gila-dan-jimat-masa.git
   ```

2. **Buka fail `index.html`** di pelayar anda. Ia berfungsi terus dari cakera tempatan.

3. **Sesuaikan borang** (lihat [Penyesuaian](#penyesuaian)) untuk menggunakan endpoint pemprosesan anda sendiri (contohnya, Formspree).

4. **Hoskan di GitHub Pages** atau mana‑mana pelayan statik (lihat langkah seterusnya).

---

## 🌐 Penempatan di GitHub Pages

Repositori ini sedia untuk dihoskan secara percuma di GitHub Pages:

1. Buka tab **Settings** repositori anda.
2. Navigasi ke **Pages** (di bar sisi kiri).
3. Pilih sumber **Deploy from a branch** dan pilih cawangan `main` (atau `gh-pages`).
4. Klik **Save**. URL laman anda akan dipaparkan selepas beberapa minit.

Kemaskini atribut `action` pada borang dalam `index.html` untuk menghantar ke **Formspree** (atau alat serupa) supaya permintaan sampai ke emel anda. Tutorial ringkas: [Formspree](https://formspree.io/).

---

## 🎨 Penyesuaian

### Menukar Endpoint Borang
Edit baris berikut dalam `index.html`:
```html
<form id="service-request-form"
      action="https://formspree.io/f/your-form-id"
      ...
```
Gantikan dengan ID Formspree anda sendiri atau endpoint lain.

### Menambah / Mengubah Perkhidmatan
Setiap perkhidmatan adalah kad di dalam `index.html`. Untuk menambah perkhidmatan baru, salin dan tampal blok kad yang sedia ada, kemaskini:
- `data-service="nama-unik"`
- Tajuk dan penerangan
- Nilai checkbox (jika relevan)

Pengawal `script.js` akan mengesan secara automatik.

### Menukar Palet Warna
Edit `styles.css` – pembolehubah `:root` dan kelas kustom mudah diubah untuk penampilan korporat anda. Skema asas menggunakan Inter Google Font dan tona `slate` / `emerald`.

---

## 🤝 Menyumbang

Kami mengalu‑alukan sumbangan! Sila ikuti aliran kerja:

1. Fork repositori ini
2. Cipta cawangan ciri (`git checkout -b ciri-baru`)
3. Lakukan perubahan dan uji secara menyeluruh
4. Hantar Pull Request dengan keterangan jelas

Pastikan kod anda:
- Serasi dengan tema sedia ada (tiada `!important` yang tidak perlu)
- Lulus pengesahan JavaScript (tiada ralat di konsol)
- Menghormati tahap kontras untuk kebolehcapaian

Lihat isu‑isu yang dibuka untuk senarai penambahbaikan yang dirancang.

---

## 📄 Lesen

Projek ini dilesenkan di bawah [MIT License](LICENSE). Anda bebas mengguna, mengubah, dan mengedar semula selagi lesen asal disertakan.

---

## 📧 Hubungi

Dibangunkan dengan penuh semangat oleh **Solo Founder / System Architect**.  
Untuk pertanyaan, kerjasama, atau sekadar berbual:  
📨 [buka isu di GitHub](https://github.com/state-of-protocol/Perkhidmatan-murah-gila-dan-jimat-masa/issues)  
🌐 Laman langsung: [Sentinel-01 Console](https://state-of-protocol.github.io/Perkhidmatan-murah-gila-dan-jimat-masa/)

---

*Dibina dengan 💚 untuk semua yang menghargai kecekapan dan reka bentuk bersih.*
```
