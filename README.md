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
│   └── main.js           # Entry point
├── index.html
├── vite.config.js
└── tailwind.config.js

api/
├── imoveis.js            # GET list of properties
├── carrossel.js          # GET image carousel
└── index.js              # GET filtered property search

.vercel/
└── project.json          # Vercel configuration
