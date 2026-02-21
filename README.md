# 🎨 Loomis Engine — v1.0.0

**Free, open-source data visualization platform. No paywalls. No watermarks. No limits.**

A powerful self-hosted alternative to Flourish, built for anyone who wants to turn Google Sheets data into beautiful, interactive dashboards — completely free, forever.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)]()
[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)](https://go.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)

---

## What Is Loomis Engine?

Loomis Engine lets you connect a public Google Sheet, drag and drop charts onto a canvas, configure them visually, and save unlimited dashboards — all for free. It handles the full pipeline: data loading, quality analysis, chart configuration, rendering, and persistence.

---

## Features

- **32+ Chart Types** — Bar, Line, Pie, Scatter, Area, Heatmap, Radar, Candlestick, Sankey, Treemap, WordCloud, Gauge, Funnel, 3D charts, and more
- **6 Geographic Maps** — World, USA, China, UK, India, Germany (choropleth with color-coded values)
- **Google Sheets Integration** — Paste any public Google Sheet URL and load your data instantly
- **Data Quality Analysis** — Automatic detection of missing values, type mismatches, and other issues before you build
- **Drag-and-Drop Dashboard Builder** — Freeform canvas with resizable, movable chart cards
- **Rich Text Blocks** — Add formatted titles, descriptions, and annotations with a full text editor
- **Auto-Refresh** — Keep dashboards live on a schedule (5 minutes to 24 hours)
- **Dashboard Persistence** — Save, reload, and manage unlimited dashboards via Firestore
- **No Limits** — Unlimited dashboards, unlimited charts, no watermarks, no usage caps

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Charts | ECharts (via echarts-for-react), echarts-gl (3D) |
| Text Editor | TipTap |
| Drag & Drop | react-rnd |
| Backend | Go 1.21+, Gin |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Go 1.21+
- A Firebase project (free tier is fine)

### 1. Clone the repository

```bash
git clone https://github.com/mjrtuhin/loomis.git
cd loomis
```

### 2. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:8080
```

Start the dev server:

```bash
npm run dev
```

### 3. Set up the backend

```bash
cd ../backend
go mod download
```

Create a `.env` file in `backend/`:

```env
PORT=8080
FIREBASE_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=./firebase-admin-key.json
```

Run the backend:

```bash
go run cmd/server/main.go
```

### 4. Firebase setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project
2. Enable **Authentication** → Email/Password
3. Enable **Firestore Database**
4. Go to Project Settings → Service Accounts → Generate new private key
5. Save the downloaded JSON as `backend/firebase-admin-key.json`
6. Copy your Web App config values into `frontend/.env`

---

## How to Use

**1. Sign up or log in** with your email and password.

**2. Create a new dashboard** — paste a public Google Sheet URL and click Load. Loomis fetches your data and runs an automatic quality check.

**3. Review data quality** — fix any detected issues (missing values, type mismatches) in your sheet, then reload.

**4. Build your dashboard** — drag chart types from the library on the right onto the canvas. Hover over any card to reveal the toolbar, then click ⚙️ to configure it. Select your columns, apply filters, and see a live preview before adding to the canvas.

**5. Configure charts** — pick X/Y columns, apply row filters (Top N, range, between values, date range), and set a title.

**6. Add text blocks** — use the text block tool to add formatted titles, descriptions, or annotations anywhere on the canvas.

**7. Save and refresh** — save your dashboard to Firestore. Set an auto-refresh interval so your charts always reflect the latest data from your sheet.

---

## Supported Chart Types

**Basic**
Bar, Horizontal Bar, Stacked Bar, Line, Smooth Line, Area, Pie, Scatter, Bubble Scatter, Effect Scatter, Funnel, Gauge

**Statistical**
Boxplot, Violin Plot, Heatmap, Calendar Heatmap, Candlestick

**Multi-Dimensional**
Radar, Parallel Coordinates, Polar Bar, Sankey, Treemap, Theme River, Network Graph

**Geographic**
World Map, USA Map, China Map, UK Map, India Map, Germany Map

**3D**
Bar 3D, Line 3D, Scatter 3D

**Other**
WordCloud, Liquid Fill, Gantt, Geopoints

---

## Project Structure

```
loomis/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── auth/               Login, Signup, Password Reset
│       │   ├── dashboard/          Canvas, Chart Library, Config Modal, Renderer
│       │   │   └── ChartConfigs/   Per-chart configuration forms (32+ types)
│       │   └── data/               Sheet input, quality report
│       ├── hooks/                  useAuth, useFetchSheet, useDashboard, useAutoRefresh
│       ├── pages/                  Landing, Auth, Dashboard, Builder, List
│       ├── services/               Firebase, Firestore CRUD, Chart API
│       ├── types/                  TypeScript definitions
│       └── utils/                  Chart validation, data aggregation, map registry
│
└── backend/
    ├── cmd/server/                 Main entry point
    └── internal/
        ├── auth/                   Firebase token verification
        ├── charts/                 Chart generation (go-echarts)
        ├── data/                   Google Sheets fetching and analysis
        └── middleware/             Auth middleware
```

---

## Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_API_URL` | Backend URL (e.g. `http://localhost:8080`) |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default `8080`) |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase service account JSON |

---

## Deployment

### Deploy frontend to Vercel

```bash
cd frontend
vercel --prod
```

Set all `VITE_*` environment variables in your Vercel project settings, and point `VITE_API_URL` to your Railway backend URL.

### Deploy backend to Railway

Connect your GitHub repo to Railway, set the root directory to `backend/`, and add your environment variables. Railway will detect the Go project and build automatically.

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a Pull Request

Please keep PRs focused — one feature or fix per PR.

---

## Roadmap

- [ ] Dashboard sharing via public URLs
- [ ] Export to PNG / PDF
- [ ] Real-time collaboration
- [ ] Dark mode
- [ ] PostgreSQL / MySQL data connectors
- [ ] AI-powered chart suggestions
- [ ] Embed dashboards in external websites
- [ ] Mobile app

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Author

**Md Julfikar Rahman Tuhin** — [@mjrtuhin](https://github.com/mjrtuhin)

*Because data visualization should be accessible to everyone.*
