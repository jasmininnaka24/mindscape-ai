import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogReg } from '../../components/login_reg/LogReg';
import GoogleImg from '../../assets/google.png';
import axios from 'axios'


export const Register = () => {

  const [usernameRegVal, setUsernameRegVal] = useState('')
  const [passwordRegVal, setPasswordRegVal] = useState('')
  const [emailRegVal, setEmailRegVal] = useState('')

  const registerAccount = async () => {
    const data = {
      username: usernameRegVal,
      password: passwordRegVal,
      email: emailRegVal,
      name: 'random',
    }

    await axios.post('http://localhost:3001/users', data);
  }

  return (
    <div className='logreg poppins flex justify-between mcolor-900' data-aos='fade'>
      <section id='logreg-content' className='flex flex-col justify-center'>
        <article className='text-4xl text-center mt-20 font-normal'><i class="fa-solid fa-spa"></i> MindScape</article>
        
        <h2 className='text-xl dark-color font-normal mt-10 text-center'>Log into your account</h2>
        
        <div className='flex justify-center mt-4'>
          <button className='flex items-center border-thin-800 px-10 py-2 rounded-[30px] text-md'>
            <img className='google-logo' src={GoogleImg} alt="google logo" />
            <span className='pl-2 dark-color'>Log in with Google</span>
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
              <label htmlFor="" className='font-medium'>Username<span className='text-red'>*</span></label>
              <input autoComplete='no' placeholder='Enter username...' type="text" className='bg-transparent border-bottom-thin py-1 px-8 rounded-[10px]' value={usernameRegVal !== '' ? usernameRegVal : ''} onChange={(event) => setUsernameRegVal(event.target.value)} />
            </div>
            <div className='mb-5 mt-8'>
              <label htmlFor="" className='font-medium'>Email<span className='text-red'>*</span></label>
              <input autoComplete='no' placeholder='Enter email...' type="email" className='bg-transparent border-bottom-thin py-1 px-5 rounded-[5px]' value={emailRegVal !== '' ? emailRegVal : ''} onChange={(event) => setEmailRegVal(event.target.value)} />
            </div>
            <div className='mb-5 mt-8'>
              <label htmlFor="" className='font-medium'>Password<span className='text-red'>*</span></label>
              <input autoComplete='no' placeholder='Enter password...' type="password" className='bg-transparent border-bottom-thin py-1 px-5 rounded-[5px]' value={passwordRegVal !== '' ? passwordRegVal : ''} onChange={(event) => setPasswordRegVal(event.target.value)} />
            </div>
            <Link to={'/classification-questions'} className='mt-10'>
              <button className='font-medium input-btn mbg-800 mcolor-100 py-2 rounded-[20px]' onClick={registerAccount} >Sign In</button>
            </Link>
          </div>
        </form>

      </section>
      <LogReg/>
    </div>
  )
}
