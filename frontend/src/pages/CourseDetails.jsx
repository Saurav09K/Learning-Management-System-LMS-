import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CourseDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data.course);
      } catch (err) {
        setError('Failed to load course details.');
        console.error("Fetch course error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-red-500 text-lg mb-4">{error || "Course not found"}</p>
        <button onClick={() => navigate('/courses')} className="px-6 py-2 bg-blue-600 text-white rounded-md">
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/courses')}
          className="text-gray-500 hover:text-blue-600 mb-6 font-medium flex items-center transition-colors"
        >
          &larr; Back to all courses
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Hero Image Section */}
          <div className="w-full h-64 md:h-96 bg-gray-900 relative">
            <img 
              src={course.thumbnailUrl || 'https://via.placeholder.com/1200x600?text=Course+Cover'} 
              alt={course.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 shadow-sm">
                {course.title}
              </h1>
              <p className="text-lg text-gray-200 font-medium">
                Instructor: {course.instructor?.name || 'Expert Instructor'}
              </p>
            </div>
          </div>

          {/* Details & Action Section */}
          <div className="p-8 md:flex md:gap-12">
            {/* Left side: Description */}
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
              <div className="prose text-gray-600 leading-relaxed whitespace-pre-wrap">
                {course.description || "No description provided for this course yet."}
              </div>
            </div>

            {/* Right side: Checkout Card */}
            <div className="md:w-1/3">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-8">
                <div className="text-3xl font-extrabold text-gray-900 mb-4">
                  {course.price > 0 ? `$${course.price}` : 'FREE'}
                </div>
                
                <button 
                  onClick={() => console.log("🔥 Trigger Payment Gateway!")}
                  className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {course.price > 0 ? 'Buy Now' : 'Enroll for Free'}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Full lifetime access • 30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;