# 🎓 Student Management System

A comprehensive full-stack web application for managing students and their academic courses, built with Next.js (TypeScript) frontend and FastAPI backend.

## ✨ Features

### 👨‍🎓 Student Management
- **Complete CRUD Operations**: Create, read, update, and delete student profiles
- **Auto-Generated Usernames**: Unique usernames based on name and timestamp
- **Comprehensive Profiles**: First name, last name, email, phone, country, and city
- **Advanced Search**: Multi-field search across all student attributes
- **Professional UI**: Modern, responsive design with Radix UI components

### 📚 Course Management
- **Course Enrollment**: Assign multiple courses to students
- **Grade Tracking**: First exam, second exam, and final grades
- **Grade Visualization**: Color-coded badges (Good ≥80%, Average ≥60%, Poor <60%)
- **Academic Progress**: Automatic GPA calculation and progress tracking
- **Course Analytics**: View course distribution and performance metrics

### 🚀 Technical Features
- **Demo Data**: Pre-populated with 5 students and 20 courses for testing
- **Real-time Updates**: Live data synchronization between frontend and backend
- **Error Handling**: Comprehensive error handling and user feedback
- **Type Safety**: Full TypeScript implementation on frontend
- **API Documentation**: Auto-generated FastAPI docs with Swagger UI

## 🏗️ Project Structure

```
student-management-system/
├── backend/
│   ├── main.py              # FastAPI application with all endpoints
│   ├── requirements.txt     # Python dependencies
│   └── __pycache__/        # Python cache files
└── frontend/
    ├── pages/
    │   ├── index.tsx        # Main application with student/course views
    │   ├── _app.tsx         # Next.js app configuration
    │   └── _document.tsx    # HTML document structure
    ├── styles/
    │   ├── globals.css      # Global styles
    │   └── Home.module.css  # Component-specific styles
    ├── package.json         # Node.js dependencies
    └── tsconfig.json        # TypeScript configuration
```

## 🔧 API Endpoints

### 👥 User Management
- `GET /users` - Get all users (with optional search query)
- `GET /users/{user_id}` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/{user_id}` - Update existing user
- `DELETE /users/{user_id}` - Delete user

### 📖 Course Management
- `GET /courses` - Get all courses
- `GET /courses/{user_id}` - Get courses by user ID
- `POST /courses` - Create new course
- `PUT /courses/{course_id}` - Update existing course
- `DELETE /courses/{course_id}` - Delete course

### 🎲 Demo Data
- `POST /reset-demo-data` - Reset and reinitialize demo data

## 🚀 Getting Started

### Prerequisites
- **Python 3.7+** installed
- **Node.js 18+** installed
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/laith-ambianze/student-management-system.git
cd student-management-system
```

### 2. Set Up Backend (FastAPI)
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Set Up Frontend (Next.js)
```powershell
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📖 Usage Guide

### Managing Students
1. **View Students**: Browse all students in the main dashboard
2. **Search Students**: Use the search bar to find students by name, email, or phone
3. **Add Student**: Click "Add Student" to create a new profile
4. **Edit Student**: Click "Edit" next to any student to modify their information
5. **View Details**: Click "View Details" to see student's complete profile and courses

### Managing Courses
1. **View Courses**: Access from student detail view
2. **Enroll Course**: Add new courses with grades for any student
3. **Edit Grades**: Update exam scores and final grades
4. **Remove Course**: Delete course enrollment from student profile
5. **Track Progress**: Monitor GPA and grade distribution

## 🎨 Design Features

- **Modern UI**: Professional color palette with Inter font
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Interactive Components**: Smooth animations and hover effects
- **Visual Feedback**: Color-coded grade badges and status indicators
- **Accessible**: Screen reader friendly with proper ARIA labels

## 🔧 Technical Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for production deployment
- **CORS Middleware**: Cross-origin resource sharing configuration

### Frontend
- **Next.js 15**: React framework with TypeScript support
- **Radix UI**: Headless, accessible UI components
- **React Hooks**: Modern state management (useState, useEffect, useCallback)
- **Fetch API**: HTTP client for backend communication

## 🚀 Development

### Hot Reload
Both frontend and backend support hot reload for efficient development:
- Backend: Uvicorn automatically reloads on file changes
- Frontend: Next.js fast refresh updates components instantly

### Code Quality
- **TypeScript**: Full type safety on frontend
- **Error Boundaries**: Graceful error handling throughout the application
- **Loading States**: User feedback during API operations

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js and FastAPI**
