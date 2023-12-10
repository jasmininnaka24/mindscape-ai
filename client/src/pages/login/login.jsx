/* global google */
import React, { useEffect, useState } from 'react';
import { LogReg } from '../../components/login_reg/LogReg';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import jwt_decode from 'jwt-decode';
import { CustomModal } from '../../components/CustomModal';
import { Link } from 'react-router-dom';


export const Login = () => {
  
  
  const navigate = useNavigate();
  const { setUserInformation } = useUser();
  
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [passwordLogVal, setPasswordLogVal] = useState('')
  const [emailLogVal, setEmailLogVal] = useState('')
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);


  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };





  const loginAccount = async (e) => {

    e.preventDefault(); 

    const data = {
      email: emailLogVal,
      password: passwordLogVal,
    };
    
    console.log(data);
    await axios.post('http://localhost:3001/users/login', data).then((response) => {
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
          navigate('/main');
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
    };
  
    await axios.post('http://localhost:3001/users/login', data).then((response) => {
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
          navigate('/main');
        }, 2000);
      }
    });
    
  };
  

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
    <div className='poppins flex justify-between mcolor-900 w-full'>

      <section className='w-1/3 flex items-center justify-center'>
        <div>
          <article className='text-4xl text-center font-normal'><i class="fa-solid fa-spa"></i> MindScape</article>
          
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

          <div className='mb-5 w-full flex items-center justify-center'>
            <div>

              <div className='mb-3 w-full'>
                <p htmlFor="" className='font-medium'>Email<span className='text-red'>*</span></p>
                <input required autoComplete='no' placeholder='Enter your email...' type="email" className='bg-transparent w-full border-bottom-thin py-1 rounded-[5px]' value={emailLogVal !== '' ? emailLogVal : ''} onChange={(event) => setEmailLogVal(event.target.value)} />
              </div>

              <div className='mb-4 mt-8'>
                <p className='font-medium'>Password<span className='text-red'>*</span></p>
                <input required autoComplete='no' placeholder='Enter your password...' type="password" className='bg-transparent w-full border-bottom-thin py-1 rounded-[5px]' value={passwordLogVal !== '' ? passwordLogVal : ''} onChange={(event) => setPasswordLogVal(event.target.value)} />
              </div>

                
              <div className='w-full mb-5 font-medium mcolor-700'>
                <Link to={'/verify-email'}>Forgot Password</Link>
              </div>

              <p className={`text-center ${(msg !== '' && error) && 'text-red my-3'}`} style={{ whiteSpace: 'pre-wrap' }}>{(msg !== '' && error) && msg}</p>
              
              <button className={`font-medium input-btn py-2 rounded-[20px] ${(msg !== '' && !error) ? 'dark-green mcolor-900' : 'mbg-800 mcolor-100'}`} onClick={(e) => loginAccount(e)}>{(msg !== '' && !error) ? msg : 'Sign In'}</button>
            </div>

          </div>

          <div className='w-full flex items-center justify-center px-14'>
            Don't have an account? <span className='font-bold ml-1'><Link to={'/register'}>Sign Up</Link></span>
          </div>

        </div>

      </section>
      
      <div className='flex-1 mbg-300 h-[100vh]'>
        {/* <LogReg/> */}
      </div>
    </div>
  )
}
