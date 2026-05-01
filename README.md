# SampahPedia 🌿

Sistem klasifikasi jenis sampah berbasis **Convolutional Neural Network (CNN)** menggunakan arsitektur **MobileNetV2** untuk mendukung proses pemilahan sampah pada **Bank Sampah Panca Daya 3 Padang**.

> **Tugas Besar Mata Kuliah Aplikasi Pembelajaran Mesin — Kelompok 6**

## Fitur

- 🔍 Deteksi jenis sampah dari foto (Plastik, Kaca, Logam, Kardus)
- 🧠 Model CNN MobileNetV2 (Transfer Learning)
- 📊 Menampilkan confidence level dan breakdown prediksi
- ♻️ Panduan pengelolaan sampah per kategori
- 📱 Responsive design (desktop & mobile)

## Tech Stack

| Layer    | Teknologi           |
|----------|---------------------|
| Frontend | HTML, CSS, JavaScript |
| Backend  | Flask (Python)      |
| Model    | TensorFlow / Keras  |
| Dataset  | [Garbage Classification (Kaggle)](https://www.kaggle.com/datasets/ionutandreivaduva/garbage-classification) |

## Cara Menjalankan

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Pastikan file model tersedia

Letakkan file `model.h5` di root folder project.

### 3. Jalankan server

```bash
python app.py
```

### 4. Buka browser

Akses [http://localhost:5000](http://localhost:5000)

## Struktur Project

```
PROJECT APM 2026/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── model.h5               # Model CNN MobileNetV2
├── .gitignore
├── README.md
└── frontend/
    ├── index.html          # Halaman Beranda
    ├── deteksi.html        # Halaman Deteksi Sampah
    ├── about.html          # Halaman About Us
    ├── css/
    │   ├── style.css       # CSS Global
    │   ├── deteksi.css     # CSS Halaman Deteksi
    │   └── about.css       # CSS Halaman About
    ├── js/
    │   ├── app.js          # JS Global (navbar, reveal, counter)
    │   └── deteksi.js      # JS Deteksi (upload, API call, result)
    └── images/
        └── team/           # Foto anggota kelompok
```

## Anggota Kelompok

| Nama | NIM |
|------|-----|
| Loly Amelia Nurza | 2311521016 |
| Sherly Ayuma Putri | 2311521018 |
| Hasbi Ash Shiddiqi | 2311523014 |
| Alfi Zikri | 2411521002 |

## Lisensi

Project ini dibuat untuk keperluan akademik.
