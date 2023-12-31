import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import InboxIcon from '../../assets/mail.png'
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { SERVER_URL, CLIENT_URL } from '../../urlConfig';


export const ResetPassword = () => {

  const navigate = useNavigate();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showResetPasswordUI, setShowResetPasswordUI] = useState(false)
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
      password: password,
      url_host: CLIENT_URL
    }

    await axios.post(`${SERVER_URL}/users/reset-password/${id}/${token}`, data).then(response => {
      if(response.data.error) {

        setTimeout(() => {
          setError(true)
          setMsg(response.data.message)
        }, 100);
        
        setTimeout(() => {
          setError(false)
          setMsg('')
        }, 2500);
  
  
      } else {
        setTimeout(() => {
          setError(false)
          setMsg(response.data.message)
        }, 100);
        
        setTimeout(() => {
          setMsg('')
        }, 2500);
      }
    })

    setShowResetPasswordUI(false)
    navigate('/login')


  }

  return (
    <div className='mbg-200 h-[100vh] w-full flex items-center justify-center poppins mcolor-900'>
      
      {!showResetPasswordUI ? (
        <form className='shadows mbg-100 w-1/3 p-8 rounded'>

          {!error && msg !== '' && (
            <div className='green-bg text-center mt-5 rounded py-3 w-full'>
              {msg}
            </div>
          )}

          {error && msg !== '' && (
            <div className='bg-red mcolor-100 text-center mt-5 rounded py-3 w-full'>
              {msg}
            </div>
          )}

          <br />
          <div>
            <h3 className='text-center mcolor-800 text-3xl font-medium mb-10'>Reset Password</h3>

            <div className='flex relative'>
              <input
                className='my-2 py-2 px-4 rounded border-thin-800 w-full'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
              />

              <button
                type="button"
                className='ml-2 focus:outline-none absolute right-3 top-4 mcolor-800'
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

            <div className='flex relative'>
              <input
                className='my-2 py-2 px-4 rounded border-thin-800 w-full'
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Confirm password'
              />

              <button
                type="button"
                className='ml-2 focus:outline-none absolute right-3 top-4 mcolor-800'
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
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
