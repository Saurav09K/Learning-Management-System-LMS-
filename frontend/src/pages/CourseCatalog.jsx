import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const limit = 2;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/courses?page=${page}&limit=${limit}`);
        const courseData = response.data.courses;
        setCourses(courseData);
        
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        console.error("Fetch courses error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Explore Our Courses
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Level up your skills with world-class instruction.
          </p>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
            No courses available right now. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course._id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
              >
                {/* Course Thumbnail */}
                <div className="aspect-video w-full bg-gray-200 relative">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                  {/* Price Tag Bubble */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                    {course.price > 0 ? `$${course.price}` : 'FREE'}
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-grow">
                    {course.description || "Learn amazing new skills in this comprehensive course."}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 font-medium truncate pr-4">
                      By {course.instructor?.name || 'Instructor'}
                    </div>
                    
                    {/* The Enroll Button */}
                    <Link
                      to={`/course/${course._id}`} 
                      className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mt-10">

        {/* Previous */}
        <button onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded text-white ${page === 1? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Previous
        </button>

        <span className="font-semibold">
          Page {page}
        </span>

        {/* Next */}
        <button onClick={() => setPage(page + 1)} disabled={courses.length < limit}
          className={`px-4 py-2 rounded text-white ${
            courses.length < limit
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Next
        </button>

      </div>

      </div>
    </div>
  );
};

export default CourseCatalog;