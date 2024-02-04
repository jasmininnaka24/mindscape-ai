import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import InboxIcon from '../../assets/mail.png'
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { SERVER_URL, CLIENT_URL } from '../../urlConfig';
import DangerousIcon from '@mui/icons-material/Dangerous';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


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

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;


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
  
    if (password === confirmPassword && password.length >= 8 && /[A-Z]/.test(password) && passwordRegex.test(password)) {
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
            setShowResetPasswordUI(false)
            navigate('/login')
          }, 2500);
        }
      })
    } else {
      let errorMessage = '';
      if (password.length < 8) {
        errorMessage = 'Password must be at least 8 characters long';
      } else if (!/[A-Z]/.test(password)) {
        errorMessage = 'Password must contain at least one capital letter';
      } else if (!passwordRegex.test(password)) {
        errorMessage = 'Password must have 1 number and 1 symbol';
      } else {
        errorMessage = 'Password and Confirm Password do not match';
      }
  
      setTimeout(() => {
        setError(true)
        setMsg(errorMessage)
      }, 100);
      
      setTimeout(() => {
        setError(false)
        setMsg('')
      }, 2500);
    }
  }
  



  const calculatePasswordStrength = (password) => {
    // Your password strength calculation logic here
    // This example enforces at least one capital letter, one number, one symbol, and a minimum length of 8 characters
    const hasCapital = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*]/.test(password);

    if (hasCapital && hasNumber && hasSymbol && password.length >= 8) {
      return 'strong';
    } else if (hasCapital && (hasNumber || hasSymbol) && password.length >= 8) {
      return 'average';
    } else {
      return 'weak';
    }
  };

  const strength = calculatePasswordStrength(password);

  const getStrengthColor = () => {
    switch (strength) {
      case 'strong':
        return 'dark-green-str';
      case 'average':
        return 'dark-orange-str';
      case 'weak':
        return 'dark-red-str';
      default:
        return '';
    }
  };

  const progressBarWidth = () => {
    switch (strength) {
      case 'strong':
        return '100%';
      case 'average':
        return '50%';
      case 'weak':
        return '25%';
      default:
        return '0%';
    }
  };



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

            {password !== '' && (
              <div className='my-4 flex items-center justify-center'>
                <div className={`mcolor-900 text-center rounded border-thin-800 py-1`} style={{ width: progressBarWidth(), transition: 'width 0.3s ease' }}>{`${strength.charAt(0).toUpperCase() + strength.slice(1)}`} <span className={`${getStrengthColor()}`}>{getStrengthColor() !== 'dark-green-str' ? <DangerousIcon /> : <CheckCircleIcon sx='18px' />}</span></div>
              </div>
              )}



            <div className='text-sm mcolor-800-opacity my-4'>
              <ul className="text-center">
                <li>At least 8 characters long</li>
                <li>At least 1 uppercase letter</li>
                <li>At least 1 symbol and number</li>
              </ul>
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
              <button className='btn-800 mcolor-100 rounded w-full py-2 my-2' onClick={(e) => resetPassword(e)}>Submit</button>  
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
