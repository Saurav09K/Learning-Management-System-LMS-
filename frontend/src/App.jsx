import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import InstructorDashboard from '../src/pages/InstructorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreateCourse from './pages/CreateCourse';
import CurriculumBuilder from './pages/CurriculumBuilder';
import CoursePlayer from './pages/CoursePlayer';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">        
        <Routes>
          <Route path="/" element={<h1 className="text-3xl font-bold p-8">Public Course Catalog</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/instructor/dashboard" element={<ProtectedRoute allowedRoles={['instructor']}><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/create-course" element={<ProtectedRoute allowedRoles={['instructor']}><CreateCourse /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/curriculum" element={<ProtectedRoute allowedRoles={['instructor']}><CurriculumBuilder /></ProtectedRoute>} />
          <Route path="/student/my-learning" element={<h1>Student Dashboard</h1>} />
          <Route path="/learn/:courseId" element={<ProtectedRoute allowedRoles={['student', 'instructor']}><CoursePlayer /></ProtectedRoute>} />
          <Route path="/student/course/:id" element={<ProtectedRoute allowedRoles={['student']}><CoursePlayer /></ProtectedRoute>} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
