import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import InboxIcon from '../../assets/mail.png'
import { useUser } from '../../UserContext';


export const ResetPassword = () => {

  const { SERVER_URL } = useUser

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showResetPasswordUI, setShowResetPasswordUI] = useState(true)

  let { id, token } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const resetData = await axios.get(`${SERVER_URL}/users/reset-password/${id}/${token}`)

      setEmail(resetData.data.email);
    }

    fetchData()
  }, [id, token])

  const resetPassword = async (e) => {
    e.preventDefault();

    let data = {
      password: password
    }

    const updatePassword =  await axios.post(`${SERVER_URL}/users/reset-password/${id}/${token}`, data);

    alert(updatePassword.data.message)

  }

  return (
    <div className='mbg-200 h-[100vh] w-full flex items-center justify-center poppins mcolor-900'>

      {!showResetPasswordUI ? (
        <form className='shadows mbg-100 w-1/3 p-8 rounded'>


          <div>
            <h3 className='text-center mcolor-800 text-3xl font-medium mb-10'>Reset Password</h3>

            <div>
              <input className='my-2 py-2 px-4 rounded border-thin-800 w-full' type="text" onChange={(e) => setPassword(e.target.value)} placeholder='Password' />  
            </div>
            <div>
              <input className='my-2 py-2 px-4 rounded border-thin-800 w-full' type="text" onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm password' />
            </div>

            <div>
              <button className='mbg-700 mcolor-100 rounded w-full py-2 my-2' onClick={(e) => resetPassword(e)}>Submit</button>  
            </div>
          </div>

        </form>  
      ) : (
        <form className='px-8 gap-8 py-5'>
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
        </form>
      )}



    </div>



  )
}
