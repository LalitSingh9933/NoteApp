import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import PasswordInput from '../../components/input/PasswordInput';
import axiosInstance from '@/utils/axiosInstance';



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorEmail(null);
    setErrorPassword(null);

    if (!validateEmail(email)) {
      setErrorEmail("Please enter a valid email address");
      return;
    }

    if (!password) {
      setErrorPassword("Please enter the password");
      return;
    }

    try {
      const response = await axiosInstance.post('/login', {
        email: email,
        password: password,
      });

      // ✅ Use backend's `error: false` logic
      if (response.data && response.data.error === false) {
        localStorage.setItem('token', response.data.accessToken); // ✅ match backend's token name
        navigate('/dashboard');
      } else {
        setErrorPassword(response.data.message || "Login failed. Please check your credentials.");
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorPassword(error.response.data.error);
      } else {
        setErrorPassword("An error occurred while logging in. Please try again later.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
            <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>
          </div>

          {/* Card Body */}
          <div className="p-8">
            <form onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 rounded-lg border ${errorEmail ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errorEmail && (
                  <p className="mt-1 text-sm text-red-600">{errorEmail}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${errorPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  placeholder="Enter your password"
                />
                {errorPassword && (
                  <p className="mt-1 text-sm text-red-600">{errorPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Sign In
              </button>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-green-600 hover:text-green-700 transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}