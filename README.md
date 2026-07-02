# 🎓 Campus Helper

A full-stack campus resource platform built for IIT Kharagpur students, providing centralized access to study materials, previous year question papers, campus societies, departmental information, FAQs, events, KGP lingo, and JoSAA cutoff analytics through a unified web interface.

---

## ✨ Features

- 📚 Study Materials Repository
- 📄 10+ Years Previous Year Question Papers
- 🏛 Department Information Portal
- 👥 20+ Campus Societies Directory
- ❓ Categorized FAQs
- 🗣 KGP Lingo Dictionary
- 🎉 Campus Events Dashboard
- 📊 JoSAA Rank Dashboard
- 🔐 User Authentication
- 📱 Responsive Modern UI

---

## 🏗 Architecture

```
                React Frontend
                      │
          Axios Service Layer
                      │
             Express REST APIs
                      │
        Controllers → Models (MVC)
                      │
                 MongoDB Atlas
```

---

## 🛠 Tech Stack

### Frontend

- React.js
- React Router DOM
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs

### Database

- MongoDB Atlas

---

## 📂 Project Structure

```
Campus-Helper
│
├── campus-helper-web
│   ├── src
│   │   ├── components
│   │   ├── services
│   │   ├── data
│   │   ├── assets
│   │   └── App.jsx
│   └── package.json
│
├── campus-helper-backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── config
│   ├── migrate.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## 🗄 Database Design

The application stores all campus resources in MongoDB using dedicated document schemas.

### Collections

- Users
- StudyMaterials
- PreviousYearPapers
- Departments
- Societies
- FAQs
- Lingo
- Events
- JosaaCutoffs

---

## 🔄 Request Flow

```
User
 │
 ▼
React Component
 │
 ▼
Axios Service
 │
 ▼
Express Route
 │
 ▼
Controller
 │
 ▼
MongoDB
 │
 ▼
JSON Response
 │
 ▼
React State Update
 │
 ▼
UI Render
```

---

## 🚀 REST API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/auth/register` |
| POST | `/auth/login` |

### Resources

| Method | Endpoint |
|---------|----------|
| GET | `/api/studymaterials` |
| GET | `/api/previousyearpapers` |
| GET | `/api/departments` |
| GET | `/api/departments/career-stats` |
| GET | `/api/societies` |
| GET | `/api/faqs` |
| GET | `/api/lingo` |
| GET | `/api/events` |
| GET | `/api/josaacutoffs/:year` |

---

## ⚙ Installation

### Clone Repository

```bash
git clone <repository-url>
cd Campus-Helper
```

### Backend

```bash
cd campus-helper-backend
npm install
```

Create a `.env` file

```env
MONGO_URI=your_mongodb_connection_string
PORT=8080
```

Run migration

```bash
npm run seed
```

Start backend

```bash
npm start
```

---

### Frontend

```bash
cd campus-helper-web
npm install
npm run dev
```

---

## 📊 Key Highlights

- Full-stack React + Express application
- Modular MVC backend architecture
- RESTful API design
- MongoDB document modeling
- Axios service abstraction
- React Router based navigation
- Dynamic data rendering from MongoDB
- Programmatic migration of legacy datasets
- Persistent authentication state
- Responsive UI built with Tailwind CSS

---

## 📸 Screenshots

> Add screenshots of:
>
> - Home Dashboard
> - Study Materials
> - PYQ Repository
> - JoSAA Dashboard
> - Societies
> - Department Profile
> - Events
> - Login Page

---

## 🔮 Future Improvements

- Admin Dashboard
- Resource Upload Portal
- Search Indexing
- Bookmark Resources
- Notifications
- Event Registration
- Resource Recommendation Engine

---

## 👨‍💻 Author

**Kartik Gupta**

Indian Institute of Technology Kharagpur

---
