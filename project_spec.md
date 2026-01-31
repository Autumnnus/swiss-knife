# 🛠️ Project SwissKnife - Technical Specification

## 1. Proje Özeti (Overview)

**SwissKnife**, kişisel kullanım için tasarlanmış, modüler, yüksek performanslı bir medya işleme aracıdır. Kullanıcıya video indirme, format dönüştürme ve görsel işleme gibi araçları tek bir modern arayüzde sunar. Aynı zamanda bu yetenekleri dış dünyaya güvenli bir REST API üzerinden açar.

## 2. Teknoloji Yığını (Tech Stack)

### Backend (Core & Workers)

- **Language:** Python 3.11+
- **Web Framework:** FastAPI (Async, Type-safe)
- **Task Queue:** Celery (Redis broker ile)
- **Media Processing:**
- `yt-dlp` (YouTube & Video extraction)
- `ffmpeg-python` (Audio/Video conversion)
- `Pillow` (Image processing)
- `Tesseract` (OCR - Opsiyonel)

- **Database/Cache:** Redis (Task yönetimi ve önbellek için)

### Frontend (UI)

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn/UI (Radix UI tabanlı)
- **State Management:** React Query (TanStack Query) - Polling işlemleri için.

### DevOps

- **Container:** Docker & Docker Compose
- **Server:** Uvicorn (ASGI)

---

## 3. Sistem Mimarisi (Architecture)

Proje **Modüler Monolit** yapısındadır ve **Asenkron Worker** deseni kullanır. Ağır işlemler (indirme, convert) asla API thread'ini bloklamaz.

**İş Akışı (Workflow):**

1. **Client:** `/api/v1/youtube/download` endpointine istek atar.
2. **API:** İsteği doğrular, Redis'e bir `task` (görev) oluşturur ve Client'a bir `task_id` döner. (Response time: <50ms).
3. **Worker:** Celery worker kuyruktan görevi alır, `yt-dlp`'yi çalıştırır, dosyayı `shared_volume`'a indirir.
4. **Client:** Belirli aralıklarla (Polling) `/api/v1/tasks/{task_id}` endpointini sorar.
5. **Sonuç:** Görev durumu `COMPLETED` olunca, Client dosyayı indirebileceği statik linki alır.

---

## 4. API Tasarımı (Endpoints)

Tüm endpointler `/api/v1` prefix'i ile başlar.

### A. General

- `GET /health`: Sistem sağlık durumu.
- `GET /tasks/{task_id}`: Görev durumunu sorgula (PENDING, PROCESSING, SUCCESS, FAILED).

### B. YouTube Module

- `POST /youtube/download`:
- Body: `{url: string, format: "mp4" | "mp3", quality: "best"}`
- Returns: `{task_id: "uuid...", status: "queued"}`

### C. Converter Module

- `POST /convert/video`:
- Body: `Form-Data` (File upload)
- Target: `target_format="mp3"`
- Returns: `{task_id: "uuid..."}`

---

## 5. Klasör Yapısı (Directory Structure)

```text
swiss-knife/
├── docker-compose.yml        # Redis, API, Worker, Frontend servisleri
├── README.md
├── apps/
│   ├── web/                  # Next.js Frontend
│   │   ├── src/app/          # Pages
│   │   ├── src/components/   # UI Components
│   │   └── Dockerfile
│   └── api/                  # FastAPI Backend
│       ├── main.py           # Entry point
│       ├── core/             # Config, Security
│       ├── worker.py         # Celery App definition
│       ├── services/         # Business Logic Modules
│       │   ├── youtube_service.py
│       │   └── media_service.py
│       ├── routers/          # API Endpoints
│       └── Dockerfile
└── storage/                  # Docker Volume (İşlenen dosyalar buraya)
    ├── uploads/
    └── downloads/

```
