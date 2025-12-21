# Manual Instruksi

Panduan ini menjelaskan cara menyiapkan, menjalankan, dan menggunakan layanan klasifikasi sampah pada repo ini.

## Ringkasan proyek
- Server: [server.py](server.py#L1)
- Model: `model.keras` (dimuat oleh [model/loader.py](model/loader.py#L1))
- Prediksi: logika berada di [model/predictor.py](model/predictor.py#L1)
- Frontend statis: folder `static/` (halaman utama [static/index.html](static/index.html#L1))

## Prasyarat
- Python 3.9+ (image Docker menggunakan `python:3.9-slim`)
- Sistem operasi yang mendukung Docker (opsional)
- Paket Python: lihat [requirements.txt](requirements.txt#L1)

Rekomendasi: gunakan virtual environment saat menjalankan lokal.

## Instalasi (lokal)
1. Buat virtual environment:

```bash
python3 -m venv venv
```

2. Aktifkan virtual environment:
```bash
source venv/bin/activate # Linux, macOS
.\venv\Scripts\activate # Windows
```

3. Instal dependensi:

```bash
pip install -r requirements.txt
```

4. Pastikan file model `model.keras` berada di root project.

## Menjalankan server (lokal)
Jalankan:

```bash
python server.py
```

Server akan berjalan di `0.0.0.0:8012` secara default. Akses antarmuka statis di `http://localhost:8012/`.

## Menjalankan dengan Docker
1. Build dan jalankan dengan `docker-compose` (file [docker-compose.yml](docker-compose.yml#L1)):

```bash
docker-compose up --build
```

2. Di konfigurasi saat ini, port host `8012` diteruskan ke port aplikasi `8012`.

Akses UI di `http://localhost:8012/` atau endpoint API di `http://localhost:8012/predict`.

## Endpoint API
- `GET /` — halaman index statis (lihat [server.py](server.py#L1)).
- `POST /predict` — unggah gambar sebagai `multipart/form-data` dengan field `image`.

Contoh `curl`:

```bash
curl -X POST -F "image=@/path/to/photo.jpg" http://localhost:8012/predict
```

Respons JSON contoh:

```json
{
  "class_id": 3,
  "class_name": "clothes",
  "type": "anorganik",
  "recyclable": true,
  "confidence": 0.87
}
```

## Struktur hasil prediksi
Logika prediksi ada di [model/predictor.py](model/predictor.py#L1).
- `class_id`: indeks kelas
- `class_name`: nama kelas (mis. `battery`, `plastic`, dsb.)
- `type`: kategori organik/anorganik
- `recyclable`: boolean
- `confidence`: probabilitas model

Daftar kelas lengkap dan metadata ada di `model/predictor.py`.

## File model
Model disimpan di `model.keras` pada root. [model/loader.py](model/loader.py#L1) memuat model dengan `keras.models.load_model("model.keras")`.

Jika Anda ingin mengganti model:
1. Ganti file `model.keras` dengan model baru (format Keras saved model).
2. Restart server.

Model dilatih pada file [train.ipynb](train.ipynb)
