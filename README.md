# Ekstensi Klasifikasi Komentar Promosi Judi Online

Ekstensi Google Chrome untuk mengenali komentar yang terindikasi
mengandung promosi judi online pada halaman YouTube.

Ekstensi mengirim teks komentar ke server untuk diproses menggunakan
model Hybrid RegEx–SVM. Komentar yang terindikasi promosi akan mendapat
penanda, alasan prediksi, dan pesan kewaspadaan.

Proyek ini dikembangkan untuk penelitian skripsi:

**Implementasi Metode Hybrid RegEx–SVM pada Ekstensi Peramban
untuk Klasifikasi Komentar Promosi Judi Online**

**Pengembang:** Justin Wijaya  
**NIM:** 32230039  
**Program Studi:** Informatika, Universitas Bunda Mulia

## Fitur

- Mengaktifkan dan menonaktifkan klasifikasi melalui popup ekstensi.
- Memproses teks komentar yang telah dimuat pada halaman YouTube.
- Memberi penanda pada komentar yang terindikasi promosi judi online.
- Menampilkan alasan yang mendorong hasil prediksi model.
- Memeriksa komentar tambahan ketika komentar dimuat pada halaman.

## Persyaratan

- Komputer atau laptop dengan Google Chrome.
- Koneksi internet untuk menghubungi server klasifikasi.
- Akses ke halaman YouTube yang memiliki komentar.
- Developer mode pada halaman pengelolaan ekstensi Chrome.

Pengguna tidak perlu memasang Python, Node.js, atau menjalankan
server sendiri. Pemrosesan model dilakukan oleh API yang digunakan
ekstensi.

## Cara Mengunduh

1. Klik tombol **Code** pada halaman repository ini.
2. Pilih **Download ZIP**.
3. Setelah unduhan selesai, ekstrak file ZIP.
4. Buka folder hasil ekstrak dan pastikan terdapat file `manifest.json`.

Simpan folder tersebut di lokasi tetap karena Chrome akan memuat
ekstensi dari folder ini.

## Cara Memasang di Google Chrome

1. Buka Google Chrome.
2. Ketik alamat berikut pada bilah alamat, kemudian tekan Enter:

   ```
   chrome://extensions/
   ```

3. Aktifkan **Developer mode / Mode developer** di kanan atas.
4. Klik **Load unpacked / Muat yang belum dikemas**.
5. Pilih folder hasil ekstrak yang langsung berisi `manifest.json`.
6. Pastikan ekstensi **Klasifikasi Komentar Judi Online** muncul
   dan dalam keadaan aktif.

Jika Chrome menyatakan bahwa manifest tidak ditemukan, periksa
kembali folder yang dipilih. Pilih folder yang langsung berisi
`manifest.json`, bukan file ZIP atau folder induknya.

## Cara Menggunakan

1. Buka halaman video di `https://www.youtube.com/`.
2. Jika halaman sudah terbuka sebelum pemasangan ekstensi,
   muat ulang halaman tersebut.
3. Klik ikon **Extensions / Ekstensi** berbentuk puzzle
   pada toolbar Chrome.
4. Pilih **Klasifikasi Komentar Judi Online**.
5. Centang **Aktifkan klasifikasi**.
6. Gulir halaman sampai bagian komentar dimuat.
7. Tunggu proses klasifikasi selesai.

Komentar yang terindikasi promosi akan mendapat penanda:

> Komentar ini terindikasi mengandung promosi judi online.

Klik **Mengapa komentar ini ditandai?** untuk melihat alasan prediksi.

Komentar diproses secara bertahap. Waktu yang dibutuhkan bergantung
pada jumlah komentar, koneksi internet, dan respons server.

Untuk menonaktifkan klasifikasi, buka popup ekstensi dan hilangkan
centang pada **Aktifkan klasifikasi**.

## Cara Kerja Singkat

1. Ekstensi membaca teks komentar pada halaman YouTube.
2. Teks dikirim ke server melalui API.
3. Server mengolah teks dan membentuk fitur TF-IDF serta RegEx.
4. Model SVM menentukan kelas komentar.
5. Server mengembalikan label, skor, dan alasan prediksi.
6. Ekstensi menampilkan penanda pada komentar terindikasi promosi.

Model klasifikasi berjalan di server, sehingga ekstensi membutuhkan
koneksi internet.

## Informasi Pemrosesan Data

Ketika klasifikasi aktif, teks komentar yang diproses dikirim ke
server klasifikasi. Pengaturan aktif atau nonaktif disimpan secara
lokal melalui penyimpanan ekstensi Chrome.

Alamat layanan yang digunakan:

```
https://judol-api-cr42-bice.vercel.app/predict
```

## Batasan

- Versi ini ditujukan untuk halaman YouTube pada Google Chrome desktop.
- Ekstensi memproses komentar yang telah dimuat pada halaman.
- Hasil klasifikasi dapat keliru, baik berupa komentar biasa yang
  ditandai maupun komentar promosi yang tidak terdeteksi.
- Alasan prediksi menunjukkan fitur yang memengaruhi model,
  bukan bukti pasti bahwa suatu komentar merupakan promosi.
- Tidak adanya penanda tidak menjamin komentar aman. Komentar dapat
  belum diproses atau permintaan ke server mengalami kegagalan.
- Klasifikasi bergantung pada ketersediaan server.
- Perubahan tampilan atau struktur halaman YouTube dapat memerlukan
  penyesuaian kode ekstensi.

## Mengatasi Kendala

### Ekstensi tidak muncul di toolbar

Klik ikon puzzle pada toolbar Chrome, lalu sematkan ekstensi
menggunakan ikon pin.

### Komentar belum mendapat penanda

1. Pastikan ekstensi aktif pada `chrome://extensions/`.
2. Pastikan **Aktifkan klasifikasi** sudah dicentang.
3. Pastikan koneksi internet tersedia.
4. Gulir hingga komentar terlihat.
5. Tunggu proses selesai, lalu muat ulang halaman jika diperlukan.

Penanda hanya muncul pada komentar yang diprediksi sebagai promosi.

### Server gagal merespons

Tunggu beberapa saat, lalu muat ulang halaman untuk mencoba kembali.
Jika masalah berlanjut, laporkan melalui tab **Issues** di repository
ini dengan menyertakan pesan kesalahan atau tangkapan layar.

### Ekstensi bermasalah setelah file diperbarui

1. Buka `chrome://extensions/`.
2. Klik tombol muat ulang pada kartu ekstensi.
3. Muat ulang halaman YouTube.

## Struktur File

| File | Fungsi |
|---|---|
| `manifest.json` | Konfigurasi, izin, dan halaman yang didukung ekstensi |
| `background.js` | Mengirim permintaan klasifikasi ke API |
| `content.js` | Membaca komentar dan menampilkan penanda |
| `popup.html` | Tampilan pengaturan ekstensi |
| `popup.js` | Mengatur status aktif dan nonaktif |
| `README.md` | Dokumentasi instalasi dan penggunaan |
