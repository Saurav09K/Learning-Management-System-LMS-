import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const InstructorDashboard = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const { data } = await api.get('/courses/me');
        setCourses(data.courses);

      } catch {
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Courses</h2>
          <Link 
            to="/instructor/create-course" 
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-medium shadow-sm"
          >
            + Create New Course
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : courses.length === 0 ? (
          /* Empty State - If they haven't made a course yet */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-20 px-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">You haven't created any courses yet.</h3>
            <p className="text-gray-500 mb-6">Start sharing your knowledge with the world.</p>
            <Link 
              to="/instructor/create-course" 
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          /* Course Grid - If they have courses */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                {/* Thumbnail placeholder */}
                <div className="h-48 bg-gray-200 w-full object-cover flex items-center justify-center text-gray-400">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="h-full w-full object-cover" />
                  ) : (
                    <span>No Thumbnail</span>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-1">{course.description?.substring(0, 80)}...</p>
                  
                  <div className="flex justify-between items-center mt-auto border-t pt-4 border-gray-100">
                    <span className="font-bold text-gray-900">${course.price}</span>
                    <Link 
                      to={`/instructor/course/${course._id}/curriculum`} 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                     Manage Content
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorDashboard;
