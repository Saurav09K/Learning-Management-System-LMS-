import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MyLearning = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get('/enrollments/my-courses');
        
        setEnrollments(response.data.enrollments || []);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError('Failed to load your courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">My Learning</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name}! Ready to level up?</p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>
        )}

        {!loading && enrollments.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-20 px-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">You haven't enrolled in any courses yet!</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Explore our catalog and find the perfect course to kickstart your journey.
            </p>
            <Link to="/courses" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold transition-all">
              Browse Catalog
            </Link>
          </div>
        )}

        {!loading && enrollments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrollments.map((enrollment) => {
              const course = enrollment.course; 
              
              if (!course) return null; 

              return (
                <div key={enrollment._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
                  
                  <div className="aspect-video w-full bg-gray-200 relative">
                    <img
                      src={course.thumbnailUrl || 'https://via.placeholder.com/640x360?text=No+Thumbnail'}
                      alt={course.title}
                      className="object-cover w-full h-full"
                    />
                    {/* Progress Bar  exact database fields! */}
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-200">
                      <div 
                        className={`h-full ${enrollment.isCompleted ? 'bg-green-500' : 'bg-blue-600'}`} 
                        style={{ width: enrollment.completedLessons.length > 0 ? '50%' : '0%' }} // We will make this math dynamic later!
                      ></div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <div className="mt-auto pt-4">
                      <Link
                        to={`/learn/${course._id}`} 
                        className="block w-full text-center px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        {enrollment.isCompleted ? 'Review Course' : 'Continue Learning'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyLearning;