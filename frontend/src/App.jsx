import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import InstructorDashboard from '../src/pages/InstructorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreateCourse from './pages/CreateCourse';
import CurriculumBuilder from './pages/CurriculumBuilder';
import CoursePlayer from './pages/CoursePlayer';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import Navbar from './components/Navbar';
import MyLearning from './pages/MyLearning';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />

        <Routes>
          <Route path="/" element={<CourseCatalog />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/instructor/dashboard" element={<ProtectedRoute allowedRoles={['instructor']}><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/create-course" element={<ProtectedRoute allowedRoles={['instructor']}><CreateCourse /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/curriculum" element={<ProtectedRoute allowedRoles={['instructor']}><CurriculumBuilder /></ProtectedRoute>} />
          <Route path="/student/my-learning" element={<ProtectedRoute allowedRoles={['student']}><MyLearning /></ProtectedRoute>} />
          <Route path="/learn/:courseId" element={<ProtectedRoute allowedRoles={['student', 'instructor']}><CoursePlayer /></ProtectedRoute>} />
          <Route path="/student/course/:id" element={<ProtectedRoute allowedRoles={['student']}><CoursePlayer /></ProtectedRoute>} />
          <Route path="/course/:id" element={<CourseDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
