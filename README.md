# 🚀 Sapiforg (S-apiforg)

[English](#english) | [Türkçe](#türkçe)

---

<a name="english"></a>
## English

Sapiforg is a lightweight, local-first **API Development and Testing Platform** designed for modern software development workflows. 

It is optimized to run seamlessly on **VDS (Virtual Dedicated Servers)** or **Local** environments for developers who want speed, simplicity, and full control over their data.

### 💎 Why Sapiforg?
- **Fast & Efficient:** High performance even on modest VDS servers due to its low-resource architecture.
- **Flexible Database Support:**
  - **SQLite:** Zero configuration (Plug & Play) for quick starts.
  - **PostgreSQL:** For production environments and scalability.
- **VDS Ready:** Deploy your own API sandbox in seconds with Docker or .NET runtime.

### ✨ Features
- **API Request Builder:** Easily create and test HTTP requests (GET, POST, PUT, DELETE, etc.).
- **Environment Management:** Switch between variable sets instantly.
- **Deep Variable Substitution:** Dynamically resolve `{{variable}}` patterns in URLs and Headers.
- **Mock Engine & Collections:** Manage mock endpoints and group your requests.

### 🛠️ Tech Stack
- **Backend:** .NET 10.0 Web API, EF Core
- **Database:** PostgreSQL & SQLite (Dual Support)
- **Frontend:** React + Vite, Zustand, TailwindCSS

---

<a name="türkçe"></a>
## Türkçe

Sapiforg, modern yazılım geliştirme süreçleri için tasarlanmış, hafif (lightweight) ve yerel odaklı (local-first) bir **API Geliştirme ve Test Platformudur**. 

Sistem, hız isteyen ve verisinin kontrolünü elinde tutmak isteyen geliştiriciler için **VDS (Virtual Dedicated Server)** veya **Local** ortamlarda sorunsuz çalışacak şekilde optimize edilmiştir.

### 💎 Neden Sapiforg?
- **Hafif ve Hızlı:** Düşük kaynak tüketen mimarisi sayesinde en mütevazı VDS sunucularda bile yüksek performansla çalışır.
- **Esnek Veritabanı:** 
  - **SQLite:** "Sıfır Kurulum" isteyenler için (Tak çalıştır).
  - **PostgreSQL:** Üretim (Production) ortamları ve ölçeklenebilirlik için.
- **VDS Uyumluluğu:** Kendi API test merkezinizi saniyeler içinde kurup yayına alabilirsiniz.

### ✨ Temel Özellikler
- **API Request Builder:** HTTP isteklerini kolayca oluşturun ve test edin.
- **Environment Management:** Değişken setleri arasında anlık geçiş yapın.
- **Deep Variable Substitution:** URL ve Header içindeki `{{variable}}` kalıplarını otomatik çözün.
- **Mock Engine & Collections:** Sahte endpointleri yönetin ve istekleri gruplayın.

### 🛠️ Teknoloji Yığını
- **Backend:** .NET 10.0 Web API, EF Core
- **Database:** PostgreSQL & SQLite (Çift Destek)
- **Frontend:** React + Vite, Zustand, TailwindCSS

---

## 🚀 Getting Started / Başlangıç

1. **Clone the Repo / Repoyu Klonlayın:**
   ```bash
   git clone https://github.com/SametKy192/S-apiforg.git
   cd S-apiforg
   ```

2. **Database Choice / Veritabanı Seçimi:**
   `Sapiforge.API/appsettings.json`:
   ```json
   "DatabaseProvider": "Sqlite" // or "PostgreSQL"
   ```

3. **Run / Çalıştırın:**
   ```bash
   # Backend
   cd Sapiforg/backend/Sapiforge.API
   dotnet run

   # Frontend
   cd Sapiforg/frontend/sapiforge-client
   npm install
   npm run dev
   ```

---
*Developer: [Samet Ky](https://github.com/SametKy192)*
