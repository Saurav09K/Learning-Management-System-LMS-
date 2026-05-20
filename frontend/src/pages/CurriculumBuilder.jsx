import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';

const CurriculumBuilder = () => {
  const { courseId } = useParams(); 
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [moduleTitle, setModuleTitle] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const fileInputRef = useRef(null);

  const fetchCourseDetails = async () => {
    try {
      const { data } = await api.get(`/courses/${courseId}`);
      setCourse(data.course);
      if (data.modules && data.modules.length > 0) {
        setSelectedModuleId(data.modules[0]._id); 
      }
    } catch (err) {
      setError('Failed to fetch course structure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const handleCreateModule = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!moduleTitle.trim()) {
      const validationMessage = 'Please type a module title before adding it.';
      console.warn(validationMessage);
      setError(validationMessage);
      alert(validationMessage);
      return; 
    }

    try {
      //  POST /api/courses/:courseId/modules endpoint
      await api.post(`/courses/${courseId}/modules`, { title: moduleTitle });
      setModuleTitle('');
      setMessage('Module created successfully.');
      fetchCourseDetails(); // Refresh list
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add module.';
      console.error('Module creation failed:', err);
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    setError('');
    setMessage(file ? `Selected video: ${file.name}` : '');
    console.log('Selected video file:', file);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');
    console.log('Upload lesson submit clicked', {
      selectedModuleId,
      lessonTitle,
      videoFile,
    });

    if (!selectedModuleId) {
      const validationMessage = 'Please create and select a Target Module before uploading a lesson.';
      console.warn(validationMessage);
      setError(validationMessage);
      alert(validationMessage);
      return;
    }
    if (!lessonTitle.trim()) {
      const validationMessage = 'Please type a Lesson Title.';
      console.warn(validationMessage);
      setError(validationMessage);
      alert(validationMessage);
      return;
    }
    if (!videoFile) {
      const validationMessage = 'Please select a Video File before uploading.';
      console.warn(validationMessage);
      setError(validationMessage);
      alert(validationMessage);
      return;
    }

    if (!import.meta.env.VITE_CLOUDINARY_API_KEY || !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
      const validationMessage = 'Cloudinary config is missing. Check VITE_CLOUDINARY_API_KEY and VITE_CLOUDINARY_CLOUD_NAME.';
      console.error(validationMessage);
      setError(validationMessage);
      alert(validationMessage);
      return;
    }

    setUploadingVideo(true);

    try {
      console.log('Requesting Cloudinary signature...');
      const signatureRes = await api.get('/cloudinary/signature');
      const { signature, timestamp } = signatureRes.data;

      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, // Notice 'video' instead of 'image' in the URL!
        formData
      );

      console.log('Cloudinary upload completed:', uploadRes.data);
      const videoUrl = uploadRes.data.secure_url;
      const videoPublicId = uploadRes.data.public_id;
      const duration = Math.round(uploadRes.data.duration); 
      console.log('Saving lesson to backend...');
      await api.post(`/courses/${courseId}/modules/${selectedModuleId}/lessons`, {
        title: lessonTitle,
        videoUrl,
        videoPublicId,
        duration
      });

      setLessonTitle('');
      setVideoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setMessage('Lesson uploaded and saved successfully.');
      fetchCourseDetails();

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Video upload or saving failed. Make sure file size is within limits.';
      console.error('Video upload/save failed:', err);
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setUploadingVideo(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
      
      {/* LEFT COLUMN: Manage & Add Forms */}
      <div className="space-y-8">
        <div>
          <Link to="/instructor/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Curriculum Builder</h2>
          <p className="text-gray-500 text-sm mt-1">Course: <span className="font-semibold text-gray-700">{course?.title}</span></p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-md text-sm">{error}</div>}
        {message && <div className="bg-green-100 text-green-700 p-4 rounded-md text-sm">{message}</div>}

        {/* Form 1: Add Module */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">1. Create a Section / Module</h3>
          <form onSubmit={handleCreateModule} className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. Module 1: Core Concepts"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
            />
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 text-sm font-medium">
              Add Module
            </button>
          </form>
        </div>

        {/* Form 2: Add Lesson to Module */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">2. Upload Video Lesson</h3>
          <form onSubmit={handleAddLesson} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Target Module</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
              >
                <option value="">Select a module</option>
                {course?.modules?.map((mod) => (
                  <option key={mod._id} value={mod._id}>{mod.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lesson Title</label>
              <input
                type="text"
                placeholder="e.g. Understanding Event Loop"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Video File (.mp4)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleVideoFileChange}
              />
            </div>

            <button
              type="submit"
              disabled={uploadingVideo}
              className={`w-full py-2 px-4 rounded-md text-white font-medium text-sm transition-colors ${
                uploadingVideo ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {uploadingVideo ? 'Uploading Heavy Video File...' : 'Upload & Add Lesson'}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Real-Time Live Curriculum Tree Preview */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-fit">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Course Outline Preview</h3>
        
        {course?.modules?.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">No modules created yet. Add one on the left.</p>
        ) : (
          <div className="space-y-6">
            {course?.modules?.map((mod) => (
              <div key={mod._id} className="border-l-2 border-blue-500 pl-4 py-1">
                <h4 className="font-bold text-gray-800 text-base">{mod.title}</h4>
                
                {mod.lessons?.length === 0 ? (
                  <p className="text-gray-400 text-xs mt-1">No lessons inside this module yet.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {mod.lessons?.map((les) => (
                      <li key={les._id} className="flex justify-between items-center bg-gray-50 p-2.5 rounded border border-gray-100 text-sm">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/learn/${courseId}`}
                            className="text-blue-500 cursor-pointer transition-colors hover:text-blue-600"
                            title="Preview course"
                            aria-label={`Preview ${les.title}`}
                          >
                            &#9654;
                          </Link>
                          <span className="text-gray-700 font-medium">{les.title}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {Math.floor(les.duration / 60)}m {les.duration % 60}s
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CurriculumBuilder;
