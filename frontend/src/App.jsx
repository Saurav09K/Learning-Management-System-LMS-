import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import InstructorDashboard from '../src/pages/InstructorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreateCourse from './pages/CreateCourse';

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

          <Route path="/student/my-learning" element={<h1>Student Dashboard</h1>} />
          <Route path="/student/course/:id" element={<h1>Video Player / Classroom</h1>} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;