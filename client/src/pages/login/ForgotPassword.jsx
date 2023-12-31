import axios from 'axios';
import React, { useState } from 'react'
import InboxIcon from '../../assets/mail.png'
import { useUser } from '../../UserContext';
import { SERVER_URL, CLIENT_URL } from '../../urlConfig';


export const ForgotPassword = () => {


  const [email, setEmail] = useState('');
  const [showResetPasswordUI, setShowResetPasswordUI] = useState(true)

  const submitForgotPasswordInfo = async (e) => {
    e.preventDefault();

    let data = {
      email: email,
      url_host: CLIENT_URL
    }

    setShowResetPasswordUI(false)
    
    await axios.post(`${SERVER_URL}/users/verify-email`, data);

    
    
  }

  return (
    <div className='mbg-200 h-[100vh] w-full flex items-center justify-center poppins mcolor-900'>

      {showResetPasswordUI ? (

        <form className='shadows mbg-100 w-1/3 p-8 rounded'>
          <h3 className='text-center mcolor-800 text-3xl font-medium mb-8'>Email Verification</h3>

          <div>
            <p className='text-lg'>Email Address: </p>
            <input className='my-2 py-2 px-4 rounded border-thin-800 w-full' autoComplete='no' type="email" placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <button className='mbg-700 mcolor-100 rounded w-full py-2 my-2' onClick={(e) => submitForgotPasswordInfo(e)}>Submit</button>
          </div>
        </form>
      ) : (
        <div className='px-8 gap-8 py-5'>
          <br />
          <div className='flex items-center justify-center'>
            <div className='text-emerald-500' style={{ width: '200px' }}>
              <img src={InboxIcon} className='w-full' alt="" />
            </div>
          </div>

          <br /><br />
          <h1 className='text-3xl font-medium mcolor-800 text-center'>Check Your Gmail Inbox</h1> 

          <p className='text-center mcolor-800 my-3 px-10'>Email verification has been sent to your email. Kindly check it out. Thank you for your patience.</p>
          <br />
        </div>
      )}
    </div>
  )
}
