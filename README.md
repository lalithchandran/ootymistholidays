# JC CABS & TOURS OOTY — Node.js Application

A modern, responsive Node.js Express web application for **JC Cabs Ooty** featuring interactive taxi fare estimation, package inquiries, route booking, and WhatsApp API integration.

---

## 🚀 Features

- **Express.js Server**: Serves frontend static files and handles API endpoints.
- **API Endpoints**:
  - `GET /api/health` — Server health check status.
  - `GET /api/routes` — Returns available sightseeing and transfer routes with rates.
  - `POST /api/calculate-fare` — Calculates estimated fares based on vehicle and duration.
  - `POST /api/book` — Receives cab booking submissions and generates booking IDs.
- **Responsive UI**: Glassmorphic navbar, hero search pill, tour packages, fleet cards, and interactive modal dialog.
- **WhatsApp Integration**: Instant one-click booking quote generation.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```

### 3. Run in Production Mode
```bash
npm start
```

Open `http://localhost:3000` in your web browser.

---

## 📁 Project Directory Structure

```
JC CABS/
├── .env                  # Environment configuration
├── .gitignore            # Git ignore rules
├── package.json          # Node.js project manifest & dependencies
├── server.js             # Express server entry point
├── README.md             # Project documentation
├── routes/
│   └── api.js            # Express API route handlers
└── public/               # Frontend web files
    ├── index.html        # Main HTML layout
    ├── styles.css        # CSS styles
    ├── script.js        # Client-side JavaScript
    └── assets/           # Images & media files
```
