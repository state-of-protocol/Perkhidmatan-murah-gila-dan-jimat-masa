# 🚀 Sentinel-01 · Autonomous Micro‑Billing & Service Console

**Perkhidmatan Murah Gila dan Jimat Masa**  
*Pilih, hantar, dan urus 15 perkhidmatan autonomi — semuanya dari satu konsol moden.*

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://state-of-protocol.github.io/Perkhidmatan-murah-gila-dan-jimat-masa/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![Google Apps Script](https://img.shields.io/badge/Backend-Google%20Apps%20Script-blue?logo=google)](https://script.google.com)

Sebuah konsol pemilihan perkhidmatan moden yang ringkas dan berprestasi tinggi. Dibina untuk pengguna akhir memilih daripada 15 modul autonomi, menghantar permintaan dengan lampiran, dan menerima pengesahan emel secara automatik — semuanya tanpa pelayan, percuma sepenuhnya.

---

## 📖 Isi Kandungan

- [Pratonton](#pratonton)
- [Ciri‑ciri Utama](#ciri‑ciri-utama)
- [Timbunan Teknologi](#timbunan-teknologi)
- [Struktur Fail](#struktur-fail)
- [Bermula Pantas](#bermula-pantas)
- [Konfigurasi Backend (Google Apps Script)](#konfigurasi-backend-google-apps-script)
- [Penempatan di GitHub Pages](#penempatan-di-github-pages)
- [Penyesuaian](#penyesuaian)
- [Menyumbang](#menyumbang)
- [Lesen](#lesen)
- [Hubungi](#hubungi)

---

## 📸 Pratonton

![Sentinel-01 Console Screenshot](assets/screenshot.png)

*Antara muka pemilihan perkhidmatan yang bersih, ringan, dan profesional.*

---

## ✨ Ciri‑ciri Utama

- **15 Perkhidmatan Modular** – API, data pipeline, web intelligence, e‑commerce, AI, kepatuhan, dan banyak lagi.
- **Pemilihan Sekali Klik** – Kad interaktif dengan maklum balas visual segera (border hijau, ikon dipilih).
- **Borang Hantar Pintar** – Emel, mesej, dan lampiran fail (maks 10 MB).
- **Pengesahan Penuh** – Memastikan sekurang‑kurangnya satu perkhidmatan dipilih dan format emel sah.
- **Hantar Tanpa Muat Semula** – Penghantaran asinkronus menggunakan `fetch` API (tiada segar semula halaman).
- **Backend Percuma & Serverless** – Google Apps Script menguruskan penyimpanan data, notifikasi emel, dan logik perniagaan.
- **Notifikasi Automatik** – Pengguna menerima emel pengesahan segera; pemilik menerima salinan penuh permintaan.
- **Rekod Kekal di Google Sheets** – Setiap permintaan direkodkan secara automatik untuk pengesanan.
- **Tema Ringan Profesional** – Inspirasi Google Font Inter, palet kelabu lembut, selesa di mata.
- **100% Responsif** – Berfungsi dengan cantik pada desktop, tablet, dan telefon.
- **Sedia GitHub Pages** – Hanya hoskan fail statik, tiada back‑end diperlukan.

---

## 🧱 Timbunan Teknologi

| Teknologi        | Kegunaan                                      |
|------------------|-----------------------------------------------|
| HTML5            | Struktur utama dan borang                     |
| Tailwind CSS 3.x | Penggayaan utiliti-pertama, CDN               |
| CSS Tersuai      | Animasi halus, glow terminal, scrollbar       |
| JavaScript ES6   | Logik pemilihan, pengesahan, hantar async     |
| Google Apps Script | Backend tanpa pelayan (simpan ke Sheets, hantar emel) |
| Google Sheets    | Pangkalan data kekal untuk rekod permintaan   |

---
## 📁 Struktur Fail

```
Perkhidmatan-murah-gila-dan-jimat-masa/
├── index.html        # Halaman utama dengan kad perkhidmatan dan borang
├── script.js         # Pengawal pemilihan, pengesahan, dan penghantaran (fetch ke Apps Script)
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

2. **Buka `index.html`** di pelayar anda. Ia berfungsi terus dari cakera tempatan (tanpa backend).  
   *Untuk fungsi penuh (penghantaran emel & simpanan data), ikut konfigurasi backend di bawah.*

3. **Sediakan Backend Google Apps Script** (lihat [Konfigurasi Backend](#konfigurasi-backend-google-apps-script)).

4. **Kemaskini URL Apps Script** dalam `script.js`.

5. **Hoskan di GitHub Pages** atau mana‑mana pelayan statik.

---

## ⚙️ Konfigurasi Backend (Google Apps Script)

Backend menggunakan **Google Apps Script** untuk memproses permintaan, menyimpan data ke Google Sheets, dan menghantar emel melalui Gmail.

### 1. Cipta Projek Apps Script
- Buka [script.google.com](https://script.google.com).
- Klik **New project**.
- Padamkan kod lalai dan tampalkan kod di bawah:

```javascript
// ============================================================
// Sentinel-01 · Service Handler + Google Sheets + Gmail
// ============================================================
const SHEET_ID = '1oWf1ajl19vTJE7trm53Nuhb0_2LGRd87lW9Dkbauxxg'; // Ganti dengan ID Sheet anda
const OWNER_EMAIL = 'emel_anda@gmail.com'; // Ganti dengan emel anda

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error("No post data");
    const data = JSON.parse(e.postData.contents);
    
    const userEmail = data.from_email;
    let selectedServices = Array.isArray(data.selected_services) ? data.selected_services.join(', ') : data.selected_services;
    const message = data.message || 'Tiada mesej tambahan.';
    let attachmentFile = null;
    let attachmentName = 'Tiada';

    if (data.attachment && data.attachment.name && data.attachment.data) {
      attachmentName = data.attachment.name;
      let base64Data = data.attachment.data.includes(',') ? data.attachment.data.split(',')[1] : data.attachment.data;
      const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), data.attachment.type || 'application/octet-stream', data.attachment.name);
      attachmentFile = blob;
    }

    // Simpan ke Google Sheets
    SpreadsheetApp.openById(SHEET_ID).getActiveSheet().appendRow([new Date(), userEmail, selectedServices, message, attachmentName]);

    // Emel kepada pemilik
    GmailApp.sendEmail(OWNER_EMAIL, `[Sentinel-01] Permintaan dari ${userEmail}`, `Permintaan baru:\n\nEmel: ${userEmail}\nPerkhidmatan: ${selectedServices}\nMesej: ${message}\nLampiran: ${attachmentName}`, { attachments: attachmentFile ? [attachmentFile] : [] });

    // Emel pengesahan kepada pengguna
    GmailApp.sendEmail(userEmail, 'Sentinel-01: Permintaan Anda Diterima', `Terima kasih. Permintaan anda untuk:\n[ ${selectedServices} ]\n\ntelah diterima. Kami akan membalas dalam 24 jam.\n\nSalam hormat,\nPasukan Sentinel-01`);

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 2. Dapatkan ID Google Sheet
- Cipta satu Google Sheet baru (atau guna yang sedia ada).
- Salin ID dari URL: `https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX/edit` → `XXXXXXXXXXXX` ialah ID.
- Gantikan `SHEET_ID` dalam kod di atas.

### 3. Tetapkan Emel Pemilik
Gantikan `OWNER_EMAIL` dengan alamat Gmail anda.

### 4. Terbitkan sebagai Web App
- Simpan projek (`Ctrl+S`).
- Klik **Deploy** → **New deployment**.
- Pilih jenis **Web app**.
- Execute as: **Me**.
- Who has access: **Anyone**.
- Klik **Deploy** dan salin URL Web App (contoh: `https://script.google.com/macros/s/.../exec`).

### 5. Kemaskini URL di `script.js`
Buka fail `script.js` dalam repositori, cari baris:
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/.../exec';
```
Gantikan dengan URL Web App yang anda salin.

### 6. Uji Backend
Gunakan fail `test.html` yang disertakan (atau sebarang klien HTTP) untuk mengesahkan backend berfungsi:
```html
<!DOCTYPE html>
<html><body>
<script>
fetch('URL_APPS_SCRIPT_ANDA', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: JSON.stringify({ from_email: 'test@example.com', selected_services: '001-api-microservice', message: 'Ujian' })
})
.then(r => r.json())
.then(console.log);
</script></body></html>
```
Pastikan header `Content-Type: text/plain` digunakan untuk mengelakkan isu CORS.

---

## 🌐 Penempatan di GitHub Pages

1. Pastikan semua fail (`index.html`, `script.js`, `styles.css`) telah dikemaskini dengan URL Apps Script yang betul.
2. Hantar (push) ke repositori GitHub.
3. Pergi ke **Settings** → **Pages**.
4. Pilih sumber **Deploy from a branch** dan pilih cawangan `main` (atau `gh-pages`).
5. Klik **Save**. Laman anda akan diterbitkan dalam beberapa minit.

---

## 🎨 Penyesuaian

### Menukar Emel Pemilik & Template Emel
Edit pembolehubah `OWNER_EMAIL` dan kandungan emel dalam skrip Apps Script (langkah 1 di atas).

### Menambah / Mengubah Perkhidmatan
Setiap perkhidmatan adalah kad di dalam `index.html`. Untuk menambah perkhidmatan baru:
- Salin blok `<div class="service-card ...">` sedia ada.
- Ubah `data-service` kepada ID unik, tajuk, dan penerangan.
- `script.js` akan mengesan secara automatik.

### Menukar Palet Warna
Edit `styles.css` — pembolehubah warna dan kelas kustom mudah diubah. Tema asas menggunakan Google Font Inter dan tona `slate` / `emerald`.

---

## 🤝 Menyumbang

Kami mengalu‑alukan sumbangan! Sila ikut aliran kerja:

1. Fork repositori ini.
2. Cipta cawangan ciri (`git checkout -b ciri-baru`).
3. Lakukan perubahan dan uji secara menyeluruh.
4. Hantar Pull Request dengan keterangan jelas.

Pastikan kod anda:
- Serasi dengan tema sedia ada.
- Lulus pengesahan JavaScript (tiada ralat di konsol).
- Menghormati tahap kontras untuk kebolehcapaian.

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

*Dibina dengan 💚 untuk semua yang menghargai kecekapan, automasi, dan reka bentuk bersih.*
```
