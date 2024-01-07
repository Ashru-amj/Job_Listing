


import React from 'react';
import styles from '../form_section/LoginFormSection.module.css';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const LoginFormSection = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const [errorMsg, setErrorMsg] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the base URL to verify
    console.log('Base URL:', config.REACT_APP_BASE_URL);

    try {
      // Construct the complete URL
      const url = `${config.REACT_APP_BASE_URL}/login`;

      // Log the complete URL to verify
      console.log('Complete URL:', url);

      // Make the Axios POST request
      const res = await axios.post(url, {
        email: emailRef.current.value,
        password: passRef.current.value,
      });
      axios.get('/api/jobs')
      // Handle different status codes
      switch (res.data.status) {
        case 200:
          // Store data in localStorage and navigate on success
          localStorage.setItem(
            'data',
            JSON.stringify({
              name: res.data.name,
              jwtToken: res.data.jwtToken,
            })
          );
          navigate('/');
          break;
        case 401:
          setErrorMsg('Invalid credentials. Please try again.');
          break;
        default:
          setErrorMsg('Something went wrong. Please try again later.');
      }
    } catch (error) {
      // Log any error that occurred during the request
      console.error('Error during request:', error);

      // Handle specific error scenarios if needed
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request failed:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  return (
    <div className={styles.formSection}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Back
      </button>
      <div className={styles.formHeading}>
        <h1>Already have an account?</h1>
        <span>Your personal job finder is here</span>
      </div>

      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <input
          placeholder="Email"
          type="email"
          required
          name="email"
          ref={emailRef}
        />
        <input
          placeholder="Password"
          type="password"
          required
          name="password"
          ref={passRef}
        />
        <button type="submit">Sign in</button>
      </form>
      <div>
        Don’t have an account?{' '}
        <b>
          <u>
            <a href="./register">Sign Up</a>
          </u>
        </b>
      </div>
    </div>
  );
};

export default LoginFormSection;
