/* global google */
import React, { useEffect, useState } from 'react';
import { LogReg } from '../../components/login_reg/LogReg';
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import jwt_decode from 'jwt-decode';
import { CustomModal } from '../../components/CustomModal';
import { Link } from 'react-router-dom';
import MindScapeLogo from '../../assets/mindscape_logo.png';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { SERVER_URL, CLIENT_URL, CLIENT_ID } from '../../urlConfig';


export const Login = () => {
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isGroupSession = searchParams.has('group_session');
  const groupId = searchParams.get('groupId');
  const materialId = searchParams.get('materialId');

  const navigate = useNavigate();
  const { setUserInformation } = useUser();
  
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [passwordLogVal, setPasswordLogVal] = useState('')
  const [emailLogVal, setEmailLogVal] = useState('')
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signInBtnClicked, setSignInBtnClicked] = useState(false);


  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const loginAccount = async (e) => {

    setSignInBtnClicked(true)

    e.preventDefault(); 

    const data = {
      email: emailLogVal,
      password: passwordLogVal,
      url_host: CLIENT_URL
    };
    
    console.log(data);
    await axios.post(`${SERVER_URL}/users/login`, data).then((response) => {
      if (response.data.error) {
        setMsg(response.data.message);
        setError(true)
      } else {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        setUserInformation(response.data.user);

        setTimeout(() => {
          setError(false)
          setMsg("Logging in...");
        }, 100);

        setTimeout(() => {

          if (isGroupSession) {

            navigate(`/main/group/study-area/group-review/${groupId}/${materialId}`);
          } else {
            navigate('/main');
          }

        }, 2000);
      }
    });
  };
  

  const handleCallBackResponse = async (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    let userObject = jwt_decode(response.credential);
    console.log(userObject);
  
    const data = {
      email: userObject.email,
      url_host: CLIENT_URL
    };

    console.log(data);
  
    await axios.post(`${SERVER_URL}/users/login`, data).then((response) => {
      
      if (response.data.error) {
        setMsg(response.data.message);
        setError(true)
      } else {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        setUserInformation(response.data.user);

        setTimeout(() => {
          setError(false)
          setMsg("Logging in...");
        }, 100);

        setTimeout(() => {
          if (isGroupSession) {
    
            navigate(`/main/group/study-area/group-review/${groupId}/${materialId}`);
          } else {
            navigate('/main');
          }
        }, 2000);
      }
    });
    
  };
  

  useEffect(() => {
    // global google
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCallBackResponse
    });
    
    
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
    );

    // google.accounts.id.prompt()
  }, [])



  // const customStyles = {
  //   content: {
  //     width: '50%',
  //     height: '50%', 
  //     backgroundColor: 'white', 
  //     textAlign: 'center'
  //   },
  //   overlay: {
  //     backgroundColor: 'rgba(0, 0, 0, 0)', // Customize the background color of the overlay
  //   },
  // };
  

  return (
    <div className='poppins flex justify-center items-center mcolor-900 w-full h-[100vh] mbg-300'>

      <div className='mbg-100 p-8 rounded'>
        <div className='flex items-center justify-center'>
          <div style={{ width: '50px', height: '50px' }}>
            <img src={MindScapeLogo} alt="" />
          </div>
          <p className='font-medium ml-2 text-3xl'>MindScape</p>
        </div>

        
        <div className='flex justify-center mt-5'>
          <button >
            <div id='signInDiv' className='flex items-center px-10 py-3 rounded-[30px] text-md'>

            </div>
          </button>
        </div>
        
        <div className='flex items-center gap-5 justify-center'>
          <div className='line'></div>
          <p>or</p>
          <div className='line'></div>
        </div>

        <div className='mb-5 w-full flex items-center justify-center'>
          <div>

            <div className='mb-3 w-full'>
              <p htmlFor="" className='font-medium'>Email<span className='text-red'>*</span></p>
              <input required autoComplete='no' placeholder='Enter your email...' type="email" className='bg-transparent w-full border-bottom-thin py-1 rounded-[5px] input-login' value={emailLogVal !== '' ? emailLogVal : ''} onChange={(event) => setEmailLogVal(event.target.value)} />
            </div>

            <div className='mb-4 mt-8 flex relative flex-relative'>
              <input
                required
                autoComplete='new-password' // 'no' may not be the best choice for accessibility
                placeholder='Enter your password...'
                type={showPassword ? 'text' : 'password'}
                className='bg-transparent w-full border-bottom-thin py-1 rounded-[5px] input-login'
                value={passwordLogVal}
                onChange={(event) => setPasswordLogVal(event.target.value)}
              />

              <button
                type="button"
                className='ml-2 focus:outline-none absolute right-0 mcolor-800'
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>





              
            <div className='w-full mb-5 font-medium mcolor-700'>
              <Link to={'/verify-email'}>Forgot Password</Link>
            </div>

            <p className={`text-center ${(msg !== '' && error) && 'text-red my-3'}`} style={{ whiteSpace: 'pre-wrap' }}>{(msg !== '' && error) && msg}</p>
            
            <button className={`font-medium input-btn py-2 rounded-[20px] ${((msg !== '' && !error) || signInBtnClicked) ? 'mbg-200 border-thin-800 mcolor-900' : 'btn-800'}`} onClick={(e) => loginAccount(e)}>{(msg !== '' && !error) ? msg : signInBtnClicked ? 'Logging In...' : 'Sign In'}</button>
          </div>

        </div>

        <div className='w-full flex items-center justify-center px-14'>
          Don't have an account? <span className='font-bold ml-1'><Link to={'/register'}>Sign Up</Link></span>
        </div>

      </div>
    </div>
  )
}
