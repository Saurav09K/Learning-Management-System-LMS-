import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const CoursePlayer = () => {
  const { id, courseId } = useParams();
  const resolvedCourseId = id || courseId;
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setError('');
        const { data } = await api.get(`/courses/${resolvedCourseId}`);
        const loadedCourse = data.course;
        const firstLesson = loadedCourse?.modules?.[0]?.lessons?.[0] || null;

        setCourse(loadedCourse);
        setCurrentLesson(firstLesson);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load this course.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [resolvedCourseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{course?.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {currentLesson ? currentLesson.title : 'No lessons available yet.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <main className="bg-black rounded-lg overflow-hidden border border-gray-200 shadow-lg">
          {currentLesson?.videoUrl ? (
            /* The key attribute here is brilliant - it forces React to reload the video when the lesson changes! */
            <video
              key={currentLesson._id}
              controls
              autoPlay
              className="w-full aspect-video bg-black outline-none"
            >
              <source src={currentLesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-gray-950 text-gray-300 text-sm">
              Select a lesson to start watching.
            </div>
          )}
        </main>

        <aside className="bg-white rounded-lg border border-gray-200 shadow-sm h-fit max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <h2 className="font-semibold text-gray-900">Course Content</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {course?.modules?.map((module, moduleIndex) => (
              <section key={module._id} className="p-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                  Module {moduleIndex + 1}: {module.title}
                </h3>

                {module.lessons?.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No lessons in this module yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {module.lessons?.map((lesson, lessonIndex) => {
                      const isActive = currentLesson?._id === lesson._id;

                      return (
                        <li key={lesson._id}>
                          {/* We changed this from a div to a real HTML button! */}
                          <button
                            onClick={() => setCurrentLesson(lesson)}
                            className={`w-full text-left cursor-pointer select-none rounded-md border px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 ${
                              isActive
                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                : 'border-transparent text-gray-700'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className={`text-xs font-semibold mt-0.5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                                {lessonIndex + 1}.
                              </span>
                              <div>
                                <p className="font-medium">{lesson.title}</p>
                                <p className={`text-xs mt-0.5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                  {Math.floor((lesson.duration || 0) / 60)}m {(lesson.duration || 0) % 60}s
                                </p>
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePlayer;
