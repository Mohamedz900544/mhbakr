
# VetCare - World-Class Veterinary Platform

VetCare is a comprehensive, full-stack veterinary platform connecting pet owners with doctors. It features real-time appointment booking, an e-commerce store, community forums, and adoption services, wrapped in a high-end 3D Glassmorphism UI.

## 🚀 Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide Icons, Glassmorphism UI.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Auth, Bcrypt.
- **AI:** Google Gemini API (for VetBot assistant).

## 🛠️ Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (Local instance or Atlas connection string)

## 📦 Installation & Setup

1. **Clone the repository** (or unzip files).
2. **Install Dependencies**:
   ```bash
   npm install
   ```
   *This installs both frontend and backend dependencies listed in package.json.*

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   # Backend Config
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vetcare
   JWT_SECRET=your_super_secure_jwt_secret_key_123!
   
   # Frontend Config
   VITE_API_URL=http://localhost:5000/api
   
   # External APIs
   API_KEY=your_gemini_api_key_here
   ```

4. **Run the Application**:
   The project is configured to run both frontend and backend concurrently.
   ```bash
   npm start
   ```
   - **Frontend:** `http://localhost:5173`
   - **Backend:** `http://localhost:5000`

## 🌟 Key Features

- **Role-Based Access:** Distinct dashboards for Clients, Doctors, and Admins.
- **Secure Auth:** JWT-based authentication with password hashing (Bcrypt).
- **Doctor Verification:** Admins approve doctors before they appear in search.
- **AI Integration:** VetBot provides instant AI-powered advice.
- **Resilience:** The frontend gracefully falls back to mock data if the backend is offline.

## 📁 Project Structure

- `backend/`
  - `server.js` - Main entry point.
  - `controllers/` - Logic for Auth, Doctors, Appointments.
  - `models/` - Mongoose Schemas.
  - `routes/` - API Endpoints.
  - `config/` - Database connection.
- `src/`
  - `components/` - Reusable UI components.
  - `pages/` - Main views.
  - `services/` - API integration layer.
  - `lib/` - Helpers and translations.

## 🧪 Testing Accounts (Local)

1. **Admin:**
   - No default admin. Register a user, then manually set `role: "admin"` in MongoDB.
2. **Doctor:**
   - Register with "Doctor" role.
   - Status will be "Pending". Login as Admin (or edit DB) to set `verified: true`.
