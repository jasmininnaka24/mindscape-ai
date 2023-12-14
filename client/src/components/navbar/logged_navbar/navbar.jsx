import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { fetchUserData } from '../../../userAPI';
import { useUser } from '../../../UserContext';
export const Navbar = (props) => {

  const { linkBack, linkBackName, currentPageName, username } = props;
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const navigate = useNavigate();

  const { user } = useUser();
  const UserId = user?.id;

  // user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    studyProfTarget: 0,
    typeOfLearner: '',
    userImage: ''
  })
  

  const getUserData = async () => {
    const userData = await fetchUserData(UserId);
    setUserData({
      username: userData?.username,
      email: userData?.email,
      studyProfTarget: userData?.studyProfTarget,
      typeOfLearner: userData?.typeOfLearner,
      userImage: userData?.userImage
    });
  }

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    navigate('/')
  };



  useEffect(() => {
    
    
    if (!isDone) {
      setIsDone(true)
    }

  },[UserId])



  useEffect(() => {
    if (isDone) {
      getUserData();
      setIsDone(false)
    }
  }, [isDone])

  

  return (
    <div className='mcolor-900 flex justify-between items-center relative'>
      <div className='flex justify-between items-start'>
        <div className='flex gap-3 items-center text-2xl'>
          <Link to={linkBack}>{linkBackName}</Link>
          <i class="fa-solid fa-chevron-right"></i>
          <p className='font-bold'>{currentPageName}</p>
        </div>
      </div>

      <div className='flex items-center text-xl gap-3'>
        <i class="fa-regular fa-user"></i>
        <button className='text-xl' onClick={() => {
          if (openLogoutModal) {
            setOpenLogoutModal(false);
          } else {
            setOpenLogoutModal(true);
          }
        }}>{userData?.username} <i class="fa-solid fa-chevron-down"></i></button>
      </div>
      
      {openLogoutModal &&
        <div className='absolute mbg-200 mcolor-900 rounded border-thin-800 py-2 px-5 right-0 top-9'>
          <button onClick={() => handleLogout()}>
            Logout <LogoutIcon />
          </button>
        </div>
      }
    </div>
  )
}
