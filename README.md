**LensLyft - Movie Recommendation Web App**

## Project Overview

**LensLyft** is a full-stack movie recommendation web application built with:

* **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Authentication
* **Frontend:** React, React Router, Axios, Tailwind CSS, PWA support

It allows users to:

* Register, log in, and manage their profiles
* Search and filter movies via the TMDb API
* View detailed movie information, trailers, and cast
* Save favorite movies and create custom watchlists
* Rate and review movies
* Follow/unfollow other users and view their activity
* Install as a Progressive Web App (PWA) for offline usage

---

## Features

1. **User Authentication**

   * Secure registration/login with hashed passwords (bcrypt)
   * JWT token-based auth for protected API routes
2. **Movie Discovery**

   * Search and filter by title, genre, release date
   * Detailed movie pages with trailer embeds and cast
   * On-demand backend caching of viewed movies
3. **User Interactions**

   * Add/remove favorites
   * Create, update, and view custom watchlists
   * Rate and write reviews for movies
4. **Social**

   * Follow/unfollow other users
   * See followed users' favorites and reviews
5. **PWA Support**

   * Offline shell and asset caching with Workbox
   * Installable manifest and splash screens

---

## Tech Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Backend    | Node.js, Express, MongoDB (Mongoose)     |
| Auth       | bcryptjs, JSON Web Tokens (JWT)          |
| Caching    | Mongoose Movie cache, Workbox precaching |
| Frontend   | React, React Router, Axios, Context API  |
| Styling    | Tailwind CSS                             |
| PWA        | service-worker via Workbox, manifest     |
| Deployment | Render (API) & Netlify (Web)             |

---

## Project Structure

```
movie-app/
├── backend/             # Express API
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express route definitions
│   ├── utils/           # Recommendation engine
│   ├── server.js        # App entry
│   └── .env             # Environment variables
├── frontend/            # React PWA frontend
│   ├── public/
│   │   ├── icons/       # PWA icons
│   │   └── manifest.json|
│   ├── src/
│   │   ├── api/         # Axios instance
│   │   ├── components/  # Reusable UI
│   │   ├── context/     # Auth & user data
│   │   ├── pages/       # Route-based views
│   │   ├── serviceWorkerRegistration.js
│   │   ├── App.js       # Routes
│   │   └── index.js     # Entry + providers
│   └── tailwind.config.js|
├── README.md
└── .gitignore
```

---

## Installation & Setup

### Prerequisites

* Node.js (v16+)
* npm
* MongoDB instance or Atlas cluster
* TMDb API key

### 1. Backend Setup

```bash
cd backend
npm install
```

1. Create a `.env` in `backend/`:

   ```env
   PORT=5000
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT secret>
   TMDB_API_KEY=<Your TMDb API key>
   ```
2. Start the server:

   ```bash
   npm run dev   # using nodemon
   # or
   npm start    # production
   ```

API listens on `http://localhost:5000/api`.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

1. Place PWA icons in `public/icons/`:

   * `icon-192.png`
   * `icon-512.png`
2. Configure `public/manifest.json` with app metadata.
3. Start development:

   ```bash
   npm start
   ```

---

## Usage

* Visit `http://localhost:3000`
* Register a new account or log in
* Search for movies, view details, and interact
* Install the app via browser prompt (mobile or desktop)

---

## Deployment

### Backend on Render

1. Push `backend/` to GitHub
2. Create a Render Web Service:

   * Environment: Node
   * Build: `npm install`
   * Start: `npm start`
   * Add env vars
3. API URL appears as `https://<service>.onrender.com`

### Frontend on Netlify

1. Push `frontend/` to GitHub
2. Create a Netlify site from Git
3. Build command: `npm run build`
4. Publish directory: `build`
5. Add env var:

   ```text
   REACT_APP_API_BASE=https://<service>.onrender.com/api
   ```

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a pull request

---

## License

MIT © Docphils
