import React, { use, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link,useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import PasswordInput from '../../components/input/PasswordInput';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrorEmail(null);
    setErrorPassword(null);

    // Validate email
    if (!validateEmail(email)) {
      setErrorEmail("Please enter a valid email address");
      return;
    }

    // Validate password
    if (!password) {
      setErrorPassword("Please enter the password");
      return;
    }

    // Proceed with Login API call here
try {
  const response = await axiosInstance.post('/login', {
    email: email,
    password: password,
  });

  if (response.data && response.data.success) {
    localStorage.setItem('token', response.data.token);
    navigate('/dashboard');
  }
} catch (error) {
  // Handle error response
  if (error.response && error.response.data && error.response.data.message) {
    setErrorPassword(error.response.data.message);
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
