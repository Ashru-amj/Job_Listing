import React from "react";
import axios from 'axios';
import styles from "./RegisterFormSection.module.css";
import config from "../../../config";
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'


export default function FormSection() {
  const nameRef = useRef();
  const emailRef = useRef();
  const mobileRef = useRef();
  const passRef = useRef();
  const [errorMsg, setErrorMsg] = useState();

  const navigate = useNavigate(); 

  return (
    <div className={styles.formSection}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>Back</button>
      <div className={styles.formHeading}>
        <h1>Create an account</h1>
        <span>Your personal job finder is here</span>
      </div>

      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

      <form onSubmit={ async (e) => {
        e.preventDefault()
        let res = await axios.post(config.REACT_APP_BASE_URL + '/register', {
          name: nameRef.current.value,
          email: emailRef.current.value,
          mobile: mobileRef.current.value,
          password: passRef.current.value
        })

        switch(res.data.status){
          case 200:
            localStorage.setItem('data', JSON.stringify({name: res.data.name, jwtToken: res.data.jwtToken}));
            navigate('/');
            break;
          case 403:
              setErrorMsg('User with this email already exist. Please login')
              break;
          default:
            setErrorMsg('Something went wrong, Please Try again later')
         }
          
      }} className={styles.registerForm}>
        <input placeholder="Name" type="text" required name="name" ref={nameRef} />
        <input placeholder="Email" type="email" required name="email" ref={emailRef} />
        <input placeholder="Mobile" type="number" required name="mobile" ref={mobileRef} />
        <input placeholder="Password" type="password" required name="password" ref={passRef}/>
        <button className={styles.createAccountButton} type="submit">Create Account</button>
      </form>
      <div>Already have an account? <b><u><a href="./login">Sign in</a></u></b></div>
    </div>
  );
}
