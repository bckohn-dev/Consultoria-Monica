# 🏢 Apartment Catalog

Web application to manage a real estate apartment catalog, built with **Vue 3 + Vite** on the frontend and **Firebase (Firestore + Storage)** on the backend. The system is deployed on **Vercel** using serverless functions.

---

## 🚀 Features

- **Home**: Consulting company landing page  
- **Catalog**: List of available properties with filters by price and number of bedrooms  
- **Admin**: Add, edit, and delete properties  
- **Contact & About**: Information about the company, mission, and values  
- **Carousel**: Dynamic image carousel integrated with Firebase Storage  

---

## 🧱 Tech Stack

### ✅ Frontend (SPA)
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [Swiper.js](https://swiperjs.com/)

### ✅ Backend (Serverless on Vercel)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin)  
  - Firestore (database)  
  - Storage (image hosting)
- Vercel Serverless Functions (`/api/*.js`)

---

## 📁 Project Structure

```plaintext
frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── views/            # Main views (pages)
│   ├── router/           # Vue Router config
│   ├── firebase.js       # Firebase client init
│   ├── App.vue
│   └── main.client.js    # Entry point (renamed to avoid conflict)
├── index.html
├── vite.config.js
└── tailwind.config.js

api/
├── imoveis.js            # GET list of properties
├── carrossel.js          # GET image carousel
└── index.js              # GET filtered property search

.vercel/
└── project.json          # Vercel configuration
```

---

## 🌐 Deployment

Hosted on [Vercel](https://vercel.com):

🔗 **Production**: https://consultoria-monica.vercel.app  
🔗 **Preview** (pull requests): automatically created by Vercel

---

## 💪 Local Development

### Requirements
- Node.js 18+
- Firebase account
- Vercel account (optional, for local API emulation)

### Setup

```bash
git clone https://github.com/bckohn-dev/Consultoria-Monica.git
cd frontend
npm install
npm run dev
```

### Local API Testing (optional)
```bash
vercel dev
```

---

## 🔐 Environment Variables

### 🔹 Firebase Admin (API - Backend)
```
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

### 🔹 Firebase Client (Frontend)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
> `VITE_` prefix is required for frontend access to environment variables.

---

## 📬 API Endpoints

| Method | Route                                | Description                      |
|--------|--------------------------------------|----------------------------------|
| GET    | `/api/imoveis`                       | Get list of all properties       |
| GET    | `/api/carrossel`                     | Get carousel images              |
| GET    | `/api?quartos=&precoMin=&precoMax=`  | Filtered property search         |

---

## 📌 Future Improvements

- [ ] Firebase Auth with protected admin area
- [ ] Image upload directly from frontend
- [ ] Dashboard and analytics
- [ ] CMS or dynamic content editor