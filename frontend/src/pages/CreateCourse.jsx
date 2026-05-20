import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import api from '../api/axios'; 

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Create course submit clicked', {
      title,
      description,
      price,
      imageFile,
    });

    if (!title.trim()) {
      const validationMessage = 'Please enter a course title.';
      console.warn(validationMessage);
      setError(validationMessage);
      alert(validationMessage);
      return;
    }

    if (!description.trim()) {
      const validationMessage = 'Please enter a course description.';
      console.warn(validationMessage);
      setError(validationMessage);
      alert(validationMessage);
      return;
    }

    if (Number(price) < 0) {
      const validationMessage = 'Course price cannot be negative.';
      console.warn(validationMessage);
      setError(validationMessage);
      alert(validationMessage);
      return;
    }

    if (
      imageFile &&
      (!import.meta.env.VITE_CLOUDINARY_API_KEY || !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
    ) {
      const validationMessage = 'Cloudinary config is missing. Check VITE_CLOUDINARY_API_KEY and VITE_CLOUDINARY_CLOUD_NAME.';
      console.error(validationMessage);
      setError(validationMessage);
      alert(validationMessage);
      return;
    }

    setLoading(true);
    
    let thumbnailUrl = ''; 

    try {
      if (imageFile) {
        console.log('Requesting Cloudinary signature for thumbnail...');
        const signatureRes = await api.get('/cloudinary/signature');
        const { signature, timestamp } = signatureRes.data;

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp);
        formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );

        console.log('Thumbnail upload completed:', uploadRes.data);
        thumbnailUrl = uploadRes.data.secure_url;
      }

      console.log('Saving course to backend...');
      await api.post('/courses', {
        title,
        description,
        price: Number(price),
        thumbnailUrl 
      });

      navigate('/instructor/dashboard');

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create course. Please check your inputs and try again.';
      console.error('Course creation failed:', err);
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setError('');
    console.log('Selected thumbnail file:', file);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Create a New Course</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm rounded-lg border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Advanced React Patterns"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will students learn?"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleImageFileChange}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-md text-white font-medium ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Publishing...' : 'Publish Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
