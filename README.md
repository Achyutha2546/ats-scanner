# AI Resume Builder & ATS Scanner

A full-stack application designed to help users build, manage, and optimize their resumes using Artificial Intelligence. The platform features an advanced Applicant Tracking System (ATS) engine to score resumes against job descriptions, and AI-powered rewriting to enhance professional summaries and work experience.

## 🚀 Features

- **Resume Management**: Build and manage your professional profile, education, experience, projects, and certifications.
- **ATS Scoring Engine**: Upload your resume (PDF/DOCX) or use your saved profile to get a detailed ATS compatibility score against a target job description.
- **AI-Powered Enhancements**: Automatically rewrite and enhance your job descriptions, experience bullets, and professional summaries using OpenAI integration (or a robust local NLP fallback).
- **Advanced Resume Parsing**: Built-in support for parsing PDFs and DOCX files to extract text for analysis.
- **Secure Authentication**: JWT-based user authentication and secure profile data storage.

## 🛠️ Tech Stack

**Frontend:**
- React 19 (via Vite)
- React Router DOM
- Tailwind CSS & Framer Motion
- React Hook Form & Yup (Validation)
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- OpenAI API Integration
- JWT Authentication
- Multer (File Uploads)
- NLP & Text Processing (`pdf-parse`, `mammoth`, `tesseract.js`, `natural`)

**ATS Engine:**
- Python-based matching and scoring algorithms
- Keyword extraction, role matching, and semantic analysis

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup

Navigate to the `backend` directory, install dependencies, and configure the environment variables:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

Start the backend development server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the `frontend` directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173/` and the backend API on `http://localhost:5000/`.

## 📂 Project Structure

- `/frontend` - React application built with Vite.
- `/backend` - Node.js Express server, MongoDB models, and API routes.
- `/ats_engine` - Python modules for ATS scoring, semantic matching, and resume suggestions.

## 📄 License

This project is licensed under the ISC License.
