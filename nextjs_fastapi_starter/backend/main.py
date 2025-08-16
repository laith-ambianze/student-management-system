from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --------------------------------------^^ Users schema and APIs ^^-----------------------------------------
class User(BaseModel):
    id: int = None
    first_name: str
    last_name: str
    username: Optional[str] = None
    phone: str
    country: str
    city: str
    email: str

users = []  # Users list to store the users
user_id_counter = 1  # User ID counter

# Get all users with optional search
@app.get("/users")
def get_users(search: Optional[str] = None):
    if search:
        search_lower = search.lower()
        return [
            u for u in users
            if search_lower in u['first_name'].lower()
            or search_lower in u['last_name'].lower()
            or search_lower in u['email'].lower()
            or search_lower in u['phone'].lower()
        ]
    return users

# Get a user by ID
@app.get("/users/{user_id}")
def get_user(user_id: int):
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        return user
    return {"error": "User not found"}

# Create a new user
@app.post("/users")
def create_user(user: User):
    global user_id_counter
    user.id = user_id_counter
    user_id_counter += 1
    # Generate a unique username using first and last name plus timestamp
    base_username = f"{user.first_name.lower()}.{user.last_name.lower()}"
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    user.username = f"{base_username}.{timestamp}"
    users.append(user.dict())
    return user

# Update an existing user
@app.put("/users/{user_id}")
def update_user(user_id: int, user: User):
    for i, u in enumerate(users):
        if u['id'] == user_id:
            old_username = u.get('username')
            updated = user.dict()
            updated['id'] = user_id
            # Preserve existing username if not provided
            if not updated.get('username'):
                updated['username'] = old_username
            users[i] = updated
            return users[i]
    return {"error": "User not found"}

# Delete an existing user
@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    global users
    users = [u for u in users if u['id'] != user_id]
    return {"status": "deleted"}

# --------------------------------------^^ Courses schema and APIs ^^-----------------------------------------
class Course(BaseModel):
    id: int = None
    name: str
    first_grade: float
    second_grade: float
    final_grade: float
    user_id: int

courses = []  # Courses list to store the courses
course_id_counter = 1  # Course ID counter

# Get all courses
@app.get("/courses")
def get_courses():
    return courses

# Get courses by user ID
@app.get("/courses/{user_id}")
def get_courses_by_user(user_id: int):
    return [c for c in courses if c['user_id'] == user_id]


# Create a new course
@app.post("/courses")
def create_course(course: Course):
    global course_id_counter
    course.id = course_id_counter
    course_id_counter += 1
    courses.append(course.dict())
    return course

# Update an existing course
@app.put("/courses/{course_id}")
def update_course(course_id: int, course: Course):
    for i, c in enumerate(courses):
        if c['id'] == course_id:
            updated = course.dict()
            updated['id'] = course_id
            courses[i] = updated
            return courses[i]
    return {"error": "Course not found"}

# Delete an existing course
@app.delete("/courses/{course_id}")
def delete_course(course_id: int):
    global courses
    courses = [c for c in courses if c['id'] != course_id]
    return {"status": "deleted"}


# --------------------------------------^^ Demo Data Initialization ^^-----------------------------------------
def initialize_demo_data():
    """Initialize the system with demo data for 5 users and their courses"""
    global users, courses, user_id_counter, course_id_counter
    
    # Only initialize if no data exists
    if len(users) > 0 or len(courses) > 0:
        return
    
    # Demo Users Data
    demo_users = [
        {
            "first_name": "Alice",
            "last_name": "Johnson",
            "email": "alice.johnson@university.edu",
            "phone": "+1-555-0101",
            "country": "USA",
            "city": "Boston"
        },
        {
            "first_name": "Muhammad",
            "last_name": "Ahmad",
            "email": "muhammad.ahmad@university.edu",
            "phone": "+1-555-0102",
            "country": "Pakistan",
            "city": "Karachi"
        },
        {
            "first_name": "Emma",
            "last_name": "Williams",
            "email": "emma.williams@university.edu",
            "phone": "+1-555-0103",
            "country": "Canada",
            "city": "Toronto"
        },
        {
            "first_name": "Raj",
            "last_name": "Patel",
            "email": "raj.patel@university.edu",
            "phone": "+1-555-0104",
            "country": "India",
            "city": "Mumbai"
        },
        {
            "first_name": "Sofia",
            "last_name": "Garcia",
            "email": "sofia.garcia@university.edu",
            "phone": "+1-555-0105",
            "country": "Mexico",
            "city": "Mexico City"
        }
    ]
    
    # Create users
    for user_data in demo_users:
        user = User(**user_data)
        user.id = user_id_counter
        user_id_counter += 1
        
        # Generate username
        base_username = f"{user.first_name.lower()}.{user.last_name.lower()}"
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        user.username = f"{base_username}.{timestamp}"
        
        users.append(user.dict())
    
    # Demo Courses Data for each user
    demo_courses = [
        # Alice Johnson (User ID: 1) - Computer Science Student
        {"name": "Data Structures & Algorithms", "first_grade": 92, "second_grade": 88, "final_grade": 90, "user_id": 1},
        {"name": "Database Systems", "first_grade": 85, "second_grade": 91, "final_grade": 88, "user_id": 1},
        {"name": "Software Engineering", "first_grade": 94, "second_grade": 96, "final_grade": 95, "user_id": 1},
        {"name": "Machine Learning", "first_grade": 78, "second_grade": 82, "final_grade": 80, "user_id": 1},
        
        # Muhammad Ahmad (User ID: 2) - Engineering Student
        {"name": "Calculus III", "first_grade": 87, "second_grade": 84, "final_grade": 85, "user_id": 2},
        {"name": "Physics II", "first_grade": 91, "second_grade": 89, "final_grade": 90, "user_id": 2},
        {"name": "Engineering Mechanics", "first_grade": 79, "second_grade": 83, "final_grade": 81, "user_id": 2},
        {"name": "Materials Science", "first_grade": 88, "second_grade": 92, "final_grade": 90, "user_id": 2},
        
        # Emma Williams (User ID: 3) - Business Student
        {"name": "Financial Accounting", "first_grade": 93, "second_grade": 91, "final_grade": 92, "user_id": 3},
        {"name": "Marketing Management", "first_grade": 86, "second_grade": 88, "final_grade": 87, "user_id": 3},
        {"name": "Operations Research", "first_grade": 82, "second_grade": 85, "final_grade": 83, "user_id": 3},
        {"name": "Business Strategy", "first_grade": 89, "second_grade": 94, "final_grade": 91, "user_id": 3},
        
        # Raj Patel (User ID: 4) - Medicine Student
        {"name": "Anatomy & Physiology", "first_grade": 88, "second_grade": 92, "final_grade": 90, "user_id": 4},
        {"name": "Biochemistry", "first_grade": 84, "second_grade": 86, "final_grade": 85, "user_id": 4},
        {"name": "Pathology", "first_grade": 91, "second_grade": 89, "final_grade": 90, "user_id": 4},
        {"name": "Pharmacology", "first_grade": 87, "second_grade": 90, "final_grade": 88, "user_id": 4},
        
        # Sofia Garcia (User ID: 5) - Arts Student
        {"name": "Art History", "first_grade": 95, "second_grade": 93, "final_grade": 94, "user_id": 5},
        {"name": "Digital Design", "first_grade": 89, "second_grade": 91, "final_grade": 90, "user_id": 5},
        {"name": "Creative Writing", "first_grade": 92, "second_grade": 88, "final_grade": 90, "user_id": 5},
        {"name": "Philosophy of Art", "first_grade": 86, "second_grade": 84, "final_grade": 85, "user_id": 5},
    ]
    
    # Create courses
    for course_data in demo_courses:
        course = Course(**course_data)
        course.id = course_id_counter
        course_id_counter += 1
        courses.append(course.dict())
    
    print("✅ Demo data initialized successfully!")
    print(f"📊 Created {len(users)} users and {len(courses)} courses")


# Initialize demo data when the server starts
@app.on_event("startup")
async def startup_event():
    initialize_demo_data()


# Endpoint to reset demo data (useful for testing)
@app.post("/reset-demo-data")
def reset_demo_data():
    global users, courses, user_id_counter, course_id_counter
    users = []
    courses = []
    user_id_counter = 1
    course_id_counter = 1
    initialize_demo_data()
    return {"message": "Demo data reset successfully", "users": len(users), "courses": len(courses)}