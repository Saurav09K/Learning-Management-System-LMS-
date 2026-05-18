import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For the direct Cloudinary upload
import api from '../api/axios'; // Our secure bridge to our Node backend

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
    setLoading(true);
    setError('');
    
    let thumbnailUrl = ''; 

    try {
      // STEP 1 & 2: If they selected an image, handle Cloudinary first
      if (imageFile) {
        // 1. Ask Node.js for the VIP Signature
        const signatureRes = await api.get('/cloudinary/signature');
        const { signature, timestamp } = signatureRes.data;

        // 2. Pack up the file and the signature to send to Cloudinary
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp);
        formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

        // 3. Upload directly to Cloudinary (Notice we use standard 'axios' here, NOT our 'api' instance!)
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );

        // Cloudinary gives us back the secure URL where the image is hosted!
        thumbnailUrl = uploadRes.data.secure_url;
      }

      // STEP 3: Now save the actual course to our Node.js database
      await api.post('/courses', {
        title,
        description,
        price,
        thumbnailUrl // Attach the Cloudinary link we just got!
      });

      // Boom. Done. Send them back to the dashboard.
      navigate('/instructor/dashboard');

    } catch (err) {
      console.error(err);
      setError('Failed to create course. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
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
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Advanced React Patterns"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            required
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
              required
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
              onChange={(e) => setImageFile(e.target.files[0])}
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