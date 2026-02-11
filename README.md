# 🎨 LOOMIS ENGINE

**Free, Open-Source Data Visualization Platform**

A powerful alternative to Flourish with no paywalls, no limits, and 100% free forever.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

---

## 🌟 Features

### ✅ Core Features
- **32 Chart Types** - From basic bar charts to advanced candlesticks, heatmaps, and radar charts
- **6 Geographic Maps** - World, USA, China, UK, India, Germany
- **Google Sheets Integration** - Load data directly from any public Google Sheet
- **Interactive Dashboard Builder** - Drag-and-drop interface with 12-column grid system
- **Rich Text Blocks** - Add formatted text with TipTap editor
- **Auto-Refresh** - Keep your dashboards updated (5 min to 1 month intervals)
- **Data Quality Analysis** - Automatic detection of data issues before visualization
- **Dashboard Persistence** - Save and load unlimited dashboards
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🎯 No Limitations
- ✅ Unlimited dashboards
- ✅ Unlimited charts per dashboard
- ✅ No watermarks
- ✅ No usage limits
- ✅ 100% free forever
- ✅ Open source

---

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **ECharts** - Professional chart rendering
- **TipTap** - Rich text editor
- **Firebase SDK** - Authentication & Database

### Backend
- **Go 1.21+** - High-performance server
- **Gin** - HTTP web framework
- **go-echarts** - Chart generation engine
- **Firebase Admin SDK** - Auth verification

### Infrastructure
- **Firebase Authentication** - Secure user management
- **Firebase Firestore** - NoSQL database
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting

---

## 📊 Supported Chart Types

### Basic Charts (11)
- Bar Chart (Vertical & Horizontal)
- Line Chart
- Pie Chart
- Scatter Plot
- Area Chart
- Funnel Chart
- Gauge Chart

### Advanced Charts (21)
- Candlestick Chart
- Kline Chart
- Boxplot Chart
- Heatmap
- Radar Chart
- Parallel Chart
- Sankey Diagram
- WordCloud
- Graph (Network)
- Tree Chart
- Treemap
- Sunburst
- ThemeRiver
- Liquid Chart
- Bar3D Chart
- Line3D Chart
- Scatter3D Chart
- Surface3D Chart
- And more...

### Geographic Maps (6)
- World Map
- USA Map
- China Map
- UK Map
- India Map
- Germany Map

---

## 🎬 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Go** 1.21+
- **Firebase Project** (free tier)
- **Google Sheets** for data source

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/mjrtuhin/loomis.git
cd loomis
```

#### 2. Set Up Frontend
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:8080
EOF

# Start development server
npm run dev
```

#### 3. Set Up Backend
```bash
cd ../backend

# Install dependencies
go mod download

# Create .env file
cat > .env << EOF
PORT=8080
FIREBASE_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
EOF

# Run backend server
go run cmd/server/main.go
```

#### 4. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database**
5. Download service account key → Place in `backend/`
6. Copy web app config → Update frontend `.env`

---

## 📖 Usage

### Creating Your First Dashboard

1. **Sign Up / Login**
   - Create an account with email and password
   - Or login if you already have an account

2. **Load Your Data**
   - Paste a Google Sheets URL
   - Make sure the sheet is publicly accessible
   - Click "Load Data"

3. **Data Quality Check**
   - Review detected issues (missing values, type mismatches, etc.)
   - Fix issues in Google Sheets if needed
   - Click "Reload" after fixing

4. **Build Your Dashboard**
   - Drag chart types from the library onto the canvas
   - Click on a chart to configure:
     - Select X and Y columns
     - Choose data filters (range, top N, etc.)
     - Customize appearance
   - Add text blocks for titles and descriptions

5. **Save & Share**
   - Click "Save Dashboard"
   - Set auto-refresh interval
   - Your dashboard updates automatically!

---

## 🏗️ Project Structure

```
loomis/
├── frontend/                 # React TypeScript app
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # Login, Signup, Password Reset
│   │   │   ├── data/        # Google Sheets integration
│   │   │   ├── dashboard/   # Dashboard builder & canvas
│   │   │   └── charts/      # Chart rendering
│   │   ├── pages/           # Main pages
│   │   ├── services/        # API & Firebase services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── backend/                  # Go backend
│   ├── cmd/server/          # Main application
│   ├── internal/
│   │   ├── auth/            # Firebase authentication
│   │   ├── charts/          # Chart generation (go-echarts)
│   │   ├── data/            # Data quality analysis
│   │   └── dashboard/       # Dashboard CRUD operations
│   ├── pkg/go-echarts/      # go-echarts library (local copy)
│   └── go.mod
│
└── README.md
```

---

## 🔧 Configuration

### Frontend Environment Variables
```env
VITE_FIREBASE_API_KEY=          # Firebase API key
VITE_FIREBASE_AUTH_DOMAIN=      # Firebase auth domain
VITE_FIREBASE_PROJECT_ID=       # Firebase project ID
VITE_FIREBASE_STORAGE_BUCKET=   # Firebase storage bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=  # Firebase sender ID
VITE_FIREBASE_APP_ID=           # Firebase app ID
VITE_API_URL=                   # Backend API URL
```

### Backend Environment Variables
```env
PORT=8080                       # Server port
FIREBASE_PROJECT_ID=            # Firebase project ID
GOOGLE_APPLICATION_CREDENTIALS= # Path to service account key
```

---

## 🚀 Deployment

### Deploy Frontend to Vercel
```bash
cd frontend
vercel --prod
```

### Deploy Backend to Railway
```bash
cd backend
railway up
```

Or use the Railway dashboard to deploy directly from GitHub.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **go-echarts** - Excellent Go charting library
- **ECharts** - Powerful JavaScript visualization library
- **Firebase** - Backend infrastructure
- **React** - UI framework
- **TipTap** - Rich text editor

---

## 👨‍💻 Author

**Md Julfikar Rahman Tuhin** ([@mjrtuhin](https://github.com/mjrtuhin))

---

## 🔮 Roadmap

### Future Features
- [ ] Video/GIF export
- [ ] Dashboard sharing (public URLs)
- [ ] Real-time collaboration
- [ ] Custom themes & dark mode
- [ ] PostgreSQL/MySQL connectors
- [ ] Mobile app (React Native)
- [ ] AI-powered chart suggestions
- [ ] Embed dashboards in websites

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/mjrtuhin/loomis/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mjrtuhin/loomis/discussions)

---

## ⭐ Star History

If you find this project useful, please give it a star! ⭐

---

**Made with ❤️ by Md Julfikar Rahman Tuhin**

*A free alternative to Flourish - Because data visualization should be accessible to everyone.*
