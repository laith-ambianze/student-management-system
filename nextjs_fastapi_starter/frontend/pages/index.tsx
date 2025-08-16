import React, { useState, useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

const backendUrl = 'http://localhost:8000';

// Types
type User = { 
  id: number; 
  first_name: string; 
  last_name: string; 
  username: string; 
  email: string; 
  phone: string; 
  country: string; 
  city: string; 
};

type Course = {
  id: number;
  name: string;
  first_grade: number;
  second_grade: number;
  final_grade: number;
  user_id: number;
};

type ViewMode = 'students' | 'student-detail';

export default function Home() {
  // Navigation state
  const [currentView, setCurrentView] = useState<ViewMode>('students');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  // Students state
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Courses state
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [courseName, setCourseName] = useState('');
  const [firstGrade, setFirstGrade] = useState('');
  const [secondGrade, setSecondGrade] = useState('');
  const [finalGrade, setFinalGrade] = useState('');

  // Load data
  const loadUsers = useCallback(async () => {
    try {
      const queryParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      const res = await fetch(`${backendUrl}/users${queryParam}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data: User[] = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  }, [searchQuery]);

  const loadCourses = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/courses`);
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data: Course[] = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    }
  }, []);

  // Load data for a single user
  const loadUserById = useCallback(async (userId: number) => {
    try {
      const res = await fetch(`${backendUrl}/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      const data: User = await res.json();
      setSelectedStudent(data);
    } catch (error) {
      console.error('Error loading user:', error);
      setSelectedStudent(null);
    }
  }, []);

  // Fetch courses for a user
  const getStudentCourses = useCallback(async (studentId: number) => {
    try {
      const res = await fetch(`${backendUrl}/courses/${studentId}`);
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data: Course[] = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    }
  }, []);

  // Student CRUD
  const handleSaveStudent = async () => {
    try {
      const payload = { first_name: firstName, last_name: lastName, email, phone, country, city };
      if (editingUserId) {
        await fetch(`${backendUrl}/users/${editingUserId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${backendUrl}/users`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      }
      setDialogOpen(false);
      setEditingUserId(null);
      setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setCountry(''); setCity('');
      loadUsers();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student. Please try again.');
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await fetch(`${backendUrl}/users/${id}`, { method: 'DELETE' });
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Course CRUD
  const handleSaveCourse = async () => {
    if (!selectedStudent) return;
    
    try {
      const payload = {
        name: courseName,
        first_grade: parseFloat(firstGrade) || 0,
        second_grade: parseFloat(secondGrade) || 0,
        final_grade: parseFloat(finalGrade) || 0,
        user_id: selectedStudent.id
      };

      if (editingCourseId) {
        await fetch(`${backendUrl}/courses/${editingCourseId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${backendUrl}/courses`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      }
      setCourseDialogOpen(false);
      setEditingCourseId(null);
      setCourseName(''); setFirstGrade(''); setSecondGrade(''); setFinalGrade('');
      loadCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course. Please try again.');
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      await fetch(`${backendUrl}/courses/${id}`, { method: 'DELETE' });
      loadCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

  // View detail handler sets view and selected student
  const viewStudentDetail = (student: User) => {
    setSelectedStudent(student);
    setCurrentView('student-detail');
  };

  const backToStudents = () => {
    setCurrentView('students');
    setSelectedStudent(null);
  };

  // When entering detail view, load user and courses via API
  useEffect(() => {
    if (currentView === 'student-detail' && selectedStudent) {
      loadUserById(selectedStudent.id);
      getStudentCourses(selectedStudent.id);
    }
  }, [currentView, selectedStudent, loadUserById, getStudentCourses]);

  // Load users on mount and when search query changes
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  // Load courses once on mount
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Modern Professional Color Palette
  const styles = {
    container: { 
      padding: 24, 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh', 
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1e293b'
    },
    header: { 
      marginBottom: 24, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      paddingBottom: 16,
      borderBottom: '2px solid #e2e8f0'
    },
    breadcrumb: { 
      fontSize: 14, 
      color: '#64748b', 
      marginBottom: 12,
      fontWeight: 500
    },
    card: { 
      backgroundColor: '#ffffff', 
      borderRadius: 12, 
      padding: 24, 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
      marginBottom: 24,
      border: '1px solid #e2e8f0'
    },
    button: { 
      padding: '10px 18px', 
      borderRadius: 8, 
      border: 'none', 
      cursor: 'pointer', 
      fontSize: 14,
      fontWeight: 600,
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    primaryButton: { 
      backgroundColor: '#3b82f6', 
      color: '#ffffff',
      ':hover': { backgroundColor: '#2563eb' }
    },
    secondaryButton: { 
      backgroundColor: '#64748b', 
      color: '#ffffff',
      ':hover': { backgroundColor: '#475569' }
    },
    successButton: { 
      backgroundColor: '#10b981', 
      color: '#ffffff',
      ':hover': { backgroundColor: '#059669' }
    },
    dangerButton: { 
      backgroundColor: '#ef4444', 
      color: '#ffffff',
      ':hover': { backgroundColor: '#dc2626' }
    },
    table: { 
      width: '100%', 
      borderCollapse: 'collapse' as const, 
      backgroundColor: '#ffffff', 
      borderRadius: 12, 
      overflow: 'hidden',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    th: { 
      backgroundColor: '#f1f5f9', 
      padding: 16, 
      textAlign: 'left' as const, 
      borderBottom: '2px solid #e2e8f0', 
      fontWeight: 600,
      color: '#374151',
      fontSize: 14,
      letterSpacing: '0.025em'
    },
    td: { 
      padding: 16, 
      borderBottom: '1px solid #f1f5f9',
      color: '#374151'
    },
    input: { 
      padding: 12, 
      border: '2px solid #e2e8f0', 
      borderRadius: 8, 
      fontSize: 14, 
      width: '100%',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      transition: 'border-color 0.2s ease',
      ':focus': { borderColor: '#3b82f6', outline: 'none' }
    },
    badge: { 
      padding: '6px 12px', 
      borderRadius: 20, 
      fontSize: 12, 
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em'
    },
    gradeGood: { 
      backgroundColor: '#dcfce7', 
      color: '#166534',
      border: '1px solid #bbf7d0'
    },
    gradeAverage: { 
      backgroundColor: '#fef3c7', 
      color: '#92400e',
      border: '1px solid #fcd34d'
    },
    gradePoor: { 
      backgroundColor: '#fecaca', 
      color: '#991b1b',
      border: '1px solid #f87171'
    },
    gradeEmpty: { 
      backgroundColor: '#f1f5f9', 
      color: '#64748b',
      border: '1px solid #cbd5e1'
    }
  };

  const getGradeBadgeStyle = (grade: number) => {
    if (grade === 0) return { ...styles.badge, ...styles.gradeEmpty };
    if (grade >= 80) return { ...styles.badge, ...styles.gradeGood };
    if (grade >= 60) return { ...styles.badge, ...styles.gradeAverage };
    return { ...styles.badge, ...styles.gradePoor };
  };

  // Students List View
  if (currentView === 'students') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: 32, 
              fontWeight: 700, 
              color: '#1e293b',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🎓 Student Management System
            </h1>
            <p style={{ 
              margin: '4px 0 0 0', 
              color: '#64748b', 
              fontSize: 16,
              fontWeight: 500
            }}>
              Manage students and their academic courses
            </p>
          </div>
          <button 
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => {
              setEditingUserId(null);
              setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setCountry(''); setCity('');
              setDialogOpen(true);
            }}
          >
            + Add Student
          </button>
        </div>
        {/* Search Bar */}
        <div style={{ margin: '16px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder='Search students...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...styles.input, maxWidth: 300 }}
            onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
          />
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={loadUsers}
          >
            🔍 Search
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => { setSearchQuery(''); loadUsers(); }}
          >
            ✖ Clear
          </button>
        </div>

        <div style={styles.card}>
          <h3 style={{ 
            margin: '0 0 20px 0', 
            fontSize: 20, 
            fontWeight: 600, 
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            👥 All Students ({users.length})
          </h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Courses</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const count = courses.filter(c => c.user_id === user.id).length;
                 return (
                  <tr key={user.id}>
                    <td style={styles.td}>{user.id}</td>
                    <td style={styles.td}>
                      <strong>{user.first_name} {user.last_name}</strong>
                      <br />
                      <small style={{color: '#6c757d'}}>@{user.username}</small>
                    </td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.phone}</td>
                    <td style={styles.td}>
                      <span style={getGradeBadgeStyle(100)}>
                        {count} courses
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button 
                        style={{ ...styles.button, ...styles.primaryButton, marginRight: 8 }}
                        onClick={() => viewStudentDetail(user)}
                      >
                        View Details
                      </button>
                      <button 
                        style={{ ...styles.button, ...styles.secondaryButton, marginRight: 8 }}
                        onClick={() => {
                          setEditingUserId(user.id);
                          setFirstName(user.first_name);
                          setLastName(user.last_name);
                          setEmail(user.email);
                          setPhone(user.phone);
                          setCountry(user.country);
                          setCity(user.city);
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        style={{ ...styles.button, ...styles.dangerButton }}
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Student Dialog */}
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)'
            }} />
            <Dialog.Content style={{ 
              position: 'fixed', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              width: 440, 
              backgroundColor: '#ffffff', 
              padding: 32, 
              borderRadius: 16, 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <Dialog.Title style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                marginBottom: 8,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                {editingUserId ? '✏️ Edit Student' : '➕ Add New Student'}
              </Dialog.Title>
              <p style={{ 
                color: '#64748b', 
                marginBottom: 24, 
                fontSize: 14 
              }}>
                {editingUserId ? 'Update student information below' : 'Fill in the student details to create a new profile'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} style={styles.input} />
                <input placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} style={styles.input} />
                <input placeholder='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
                <input placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} />
                <input placeholder='Country' value={country} onChange={(e) => setCountry(e.target.value)} style={styles.input} />
                <input placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} style={styles.input} />
              </div>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Dialog.Close asChild>
                  <button style={{ ...styles.button, ...styles.secondaryButton }}>Cancel</button>
                </Dialog.Close>
                <button style={{ ...styles.button, ...styles.primaryButton }} onClick={handleSaveStudent}>
                  {editingUserId ? 'Update' : 'Save'}
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    );
  }

  // Student Detail View
  if (currentView === 'student-detail' && selectedStudent) {
    const studentCourses = courses.filter(c => c.user_id === selectedStudent.id);
    
    return (
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: '#3b82f6', 
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.2s ease'
          }} onClick={backToStudents}>
            ← Back to Students
          </button>
        </div>

        <div style={styles.header}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: 28, 
              fontWeight: 700, 
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              👤 {selectedStudent.first_name} {selectedStudent.last_name}
            </h1>
            <p style={{ 
              color: '#64748b', 
              margin: '4px 0 0 0',
              fontSize: 16,
              fontWeight: 500
            }}>
              @{selectedStudent.username} • {selectedStudent.email}
            </p>
          </div>
          <button 
            style={{ ...styles.button, ...styles.successButton }}
            onClick={() => {
              setEditingCourseId(null);
              setCourseName(''); setFirstGrade(''); setSecondGrade(''); setFinalGrade('');
              setCourseDialogOpen(true);
            }}
          >
            + Enroll Course
          </button>
        </div>

        {/* Student Info Card */}
        <div style={styles.card}>
          <h3 style={{ 
            margin: '0 0 20px 0', 
            fontSize: 20, 
            fontWeight: 600, 
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            📋 Student Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div><strong>Phone:</strong> {selectedStudent.phone}</div>
            <div><strong>Country:</strong> {selectedStudent.country}</div>
            <div><strong>City:</strong> {selectedStudent.city}</div>
            <div><strong>Total Courses:</strong> {studentCourses.length}</div>
          </div>
        </div>

        {/* Courses Card */}
        <div style={styles.card}>
          <h3 style={{ 
            margin: '0 0 20px 0', 
            fontSize: 20, 
            fontWeight: 600, 
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            📚 Enrolled Courses ({studentCourses.length})
          </h3>
          {studentCourses.length === 0 ? (
            <div style={{ 
              color: '#64748b', 
              textAlign: 'center', 
              padding: 40,
              backgroundColor: '#f8fafc',
              borderRadius: 12,
              border: '2px dashed #cbd5e1'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
                No courses enrolled yet
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: 14 }}>
                Click &quot;Enroll Course&quot; to add the first course
              </p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Course Name</th>
                  <th style={styles.th}>First Exam</th>
                  <th style={styles.th}>Second Exam</th>
                  <th style={styles.th}>Final Grade</th>
                  <th style={styles.th}>Total from 100%</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentCourses.map((course) => (
                  <tr key={course.id}>
                    <td style={styles.td}><strong>{course.name}</strong></td>
                    <td style={styles.td}>
                      <span style={getGradeBadgeStyle(course.first_grade)}>
                        {course.first_grade || 'Not graded'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={getGradeBadgeStyle(course.second_grade)}>
                        {course.second_grade || 'Not graded'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={getGradeBadgeStyle(course.final_grade)}>
                        {course.final_grade || 'Not graded'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {course.first_grade && course.second_grade && course.final_grade ? (
                        <span style={getGradeBadgeStyle(
                          (course.first_grade + course.second_grade + course.final_grade) / 3
                        )}>
                          {(course.first_grade + course.second_grade + course.final_grade) / 3}%
                        </span>
                      ) : (
                        <span style={getGradeBadgeStyle(0)}>No grades</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <button 
                        style={{ ...styles.button, ...styles.secondaryButton, marginRight: 8 }}
                        onClick={() => {
                          setEditingCourseId(course.id);
                          setCourseName(course.name);
                          setFirstGrade(course.first_grade.toString());
                          setSecondGrade(course.second_grade.toString());
                          setFinalGrade(course.final_grade.toString());
                          setCourseDialogOpen(true);
                        }}
                      >
                        Edit Grades
                      </button>
                      <button 
                        style={{ ...styles.button, ...styles.dangerButton }}
                        onClick={() => deleteCourse(course.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Course Dialog */}
        <Dialog.Root open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)'
            }} />
            <Dialog.Content style={{ 
              position: 'fixed', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              width: 440, 
              backgroundColor: '#ffffff', 
              padding: 32, 
              borderRadius: 16, 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <Dialog.Title style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                marginBottom: 8,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                {editingCourseId ? '📝 Edit Course & Grades' : '📚 Enroll New Course'}
              </Dialog.Title>
              <p style={{ 
                color: '#64748b', 
                marginBottom: 24, 
                fontSize: 14 
              }}>
                {editingCourseId ? 'Update course information and grades' : 'Add a new course for this student'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input placeholder='Course Name' value={courseName} onChange={(e) => setCourseName(e.target.value)} style={styles.input} />
                <input placeholder='First Exam Grade (0-100)' type='number' value={firstGrade} onChange={(e) => setFirstGrade(e.target.value)} style={styles.input} />
                <input placeholder='Second Exam Grade (0-100)' type='number' value={secondGrade} onChange={(e) => setSecondGrade(e.target.value)} style={styles.input} />
                <input placeholder='Final Grade (0-100)' type='number' value={finalGrade} onChange={(e) => setFinalGrade(e.target.value)} style={styles.input} />
              </div>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Dialog.Close asChild>
                  <button style={{ ...styles.button, ...styles.secondaryButton }}>Cancel</button>
                </Dialog.Close>
                <button style={{ ...styles.button, ...styles.successButton }} onClick={handleSaveCourse}>
                  {editingCourseId ? 'Update' : 'Enroll'}
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    );
  }

  return null;
}
