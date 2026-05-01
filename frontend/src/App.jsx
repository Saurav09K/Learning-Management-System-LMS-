import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">        
        <Routes>
          <Route path="/" element={<h1 className="text-3xl font-bold p-8">Public Course Catalog</h1>} />
          <Route path="/login" element={<h1 className="text-3xl font-bold p-8">Login Page</h1>} />

          <Route path="/instructor/dashboard" element={<h1>Instructor Dashboard</h1>} />
          <Route path="/instructor/create-course" element={<h1>Create Course Builder</h1>} />

          <Route path="/student/my-learning" element={<h1>Student Dashboard</h1>} />
          <Route path="/student/course/:id" element={<h1>Video Player / Classroom</h1>} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;