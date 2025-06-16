# 🥗 TrackNourish

**TrackNourish** is a sleek, modern meal tracking web app that helps users log their meals, track calorie and macro intake, and visualize their eating habits. Built with **Next.js**, **MongoDB**, and powered by **Spoonacular API**, it aims to simplify healthy living.

---

## 🚀 Features

- ✅ Full Authentication (Sign Up, Sign In, Email Verification)
- 🥗 Track Meals with nutritional info
- 🔥 Monitor Calories & Macros (Protein, Carbs, Fat)
- 📊 View Recent Meals, Total Meals Tracked, Average Calories
- 🔍 Search & Sort logged meals
- 🖼️ Upload Profile & Cover Images (Cloudinary)
- 🧠 Rate Limiting for external APIs
- 📱 Fully Responsive
- 🔐 Production-ready

---

## 🔧 Tech Stack

- **Frontend:** Next.js 14, TailwindCSS, TypeScript, ShadCN UI
- **Backend:** Next.js API Routes, Mongoose
- **Authentication:** JWT, Resend Email Verification
- **Image Uploads:** Cloudinary
- **Food Data:** Spoonacular API
- **Deployment:** Vercel
- **Email Service:** Resend

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tracknourish.git
cd tracknourish
```

### 2. Install Dependencies

Make sure you're inside the project directory and run:

```bash
npm install
```

### 3. Configure Environment Variables

Create a .env.local file in the root of your project and add the following:

```bash
RESEND_API_KEY=your_resend_api_key
MONGODB_URI=your_mongo_db_uri
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret

# SpoonacularAPI Variables
SPOONACULAR_API=your_spoonacular_api

# Cloudinary Variables
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Start the App Locally

```bash
npm run dev
```

