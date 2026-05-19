import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
              LMS<span className="text-gray-900">Platform</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/courses" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              All Courses
            </Link>

            {/* If NOT logged in */}
            {!user ? (
              <div className="flex items-center gap-4 border-l border-gray-200 pl-6 ml-2">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors shadow-sm">
                  Sign up
                </Link>
              </div>
            ) : (
              /* If LOGGED IN */
              <div className="flex items-center gap-4 border-l border-gray-200 pl-6 ml-2">
                
                {/* Smart Role Links */}
                {user.role === 'instructor' && (
                  <Link to="/instructor/dashboard" className="text-gray-900 bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200 font-medium text-sm transition-colors">
                    Instructor Dashboard
                  </Link>
                )}
                
                {user.role === 'student' && (
                  <Link to="/student/my-learning" className="text-gray-900 bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200 font-medium text-sm transition-colors">
                    My Learning
                  </Link>
                )}

                {/* User Profile & Logout */}
                <span className="text-sm font-medium text-gray-500 hidden sm:block">
                  Hi, {user.name || 'User'}
                </span>
                
                <button 
                  onClick={logout} 
                  className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;