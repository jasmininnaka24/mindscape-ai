import React, { useEffect, useState } from 'react';
import { LogReg } from '../../components/login_reg/LogReg';
import GoogleImg from '../../assets/google.png';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import jwt_decode from 'jwt-decode';

/* global google */

export const Login = () => {

  const [user, setUser] = useState({})

  const navigate = useNavigate();
  const { setUserInformation } = useUser();


  const [passwordLogVal, setPasswordLogVal] = useState('')
  const [emailLogVal, setEmailLogVal] = useState('')

  const loginAccount = async (e) => {

    e.preventDefault();

    const data = {
      password: passwordLogVal,
      email: emailLogVal,
    }

    await axios.post('http://localhost:3001/users/login', data).then((response) => {
      if (response.data.error) {
        console.log('error');
      } else {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        setUserInformation(response.data.user);
        navigate('/main')
      }
    });
  }

  const handleCallBackResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    let userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject)
  }

  useEffect(() => {
    // global google
    google.accounts.id.initialize({
      client_id: "220847377508-mb7a1fbtuqn2ibg2s1ihj0lesl17vut0.apps.googleusercontent.com",
      callback: handleCallBackResponse
    });
    
    
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
    );

    google.accounts.id.prompt()
  }, [])

  return (
    <div className='logreg poppins flex justify-between mcolor-900' data-aos='fade'>
      <section id='logreg-content' className='flex flex-col justify-center'>
        <article className='text-4xl text-center mt-20 font-normal'><i class="fa-solid fa-spa"></i> MindScape</article>
        
        <h2 className='text-xl dark-color font-normal mt-10 text-center'>Log into your account</h2>
        
        <div className='flex justify-center mt-4'>
          <button >
            <div id='signInDiv' className='flex items-center px-10 py-3 rounded-[30px] text-md'>

            </div>
          </button>
        </div>
        
        <div className='flex items-center gap-5 justify-center my-4'>
          <div className='line'></div>
          <p>or</p>
          <div className='line'></div>
        </div>

        <form className='logreg flex justify-center mb-5'>
          <div className='mt-3'>
            <div className='mb-3'>
              <label htmlFor="" className='font-medium'>Email<span className='text-red'>*</span></label>
              <input autoComplete='no' placeholder='Enter your email...' type="email" className='bg-transparent border-bottom-thin py-1 px-8 rounded-[5px]' value={emailLogVal !== '' ? emailLogVal : ''} onChange={(event) => setEmailLogVal(event.target.value)} />
            </div>
            <div className='mb-5 mt-8'>
              <label htmlFor="" className='font-medium'>Password<span className='text-red'>*</span></label>
              <input autoComplete='no' placeholder='Enter your password...' type="password" className='bg-transparent border-bottom-thin py-1 px-5 rounded-[5px]' value={passwordLogVal !== '' ? passwordLogVal : ''} onChange={(event) => setPasswordLogVal(event.target.value)} />
            </div>
              <button className='font-medium input-btn mbg-800 mcolor-100 py-2 rounded-[20px]' onClick={(e) => loginAccount(e)}>Sign In</button>
          </div>
        </form>

      </section>
      <LogReg/>
    </div>
  )
}
