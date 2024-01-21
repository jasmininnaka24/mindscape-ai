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
          <Link className='font-medium' to={linkBack}>{linkBackName}</Link>
          <i class="fa-solid fa-chevron-right"></i>
          <p className='font-bold'>{currentPageName}</p>
        </div>
      </div>
    </div>
  )
}
