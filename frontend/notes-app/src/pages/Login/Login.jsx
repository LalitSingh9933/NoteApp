import React, {  useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link,useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import PasswordInput from '../../components/input/PasswordInput';
import axiosInstance from '../../utils/axiosInstance';



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
    <div>
      <Navbar />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border bg-white px-7 py-10 rounded'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7'>Login</h4>
            <input
              type='text'
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorEmail && <p className='text-red-500 text-xs pb-1'>{errorEmail}</p>}

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorPassword && <p className='text-red-500 text-xs pb-1'>{errorPassword}</p>}

            <button type='submit' className='btn-primary'>
              Login
            </button>

            <p className='text-sm text-center mt-4'>
              Not registered yet?{" "}
              <Link to='/signup' className='font-medium text-green-600 underline'>
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
