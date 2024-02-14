import React, { useEffect, useState } from 'react';
import '../../pages/main/mainpage.css';
import { Link, useNavigate } from 'react-router-dom';



// icon imports
import CloseIcon from '@mui/icons-material/Close';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import SpaIcon from '@mui/icons-material/Spa';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

// responsive sizes
import { useResponsiveSizes } from '../useResponsiveSizes'; 

// animation import
import { motion, AnimatePresence  } from 'framer-motion';

export const Sidebar = ({currentPage}) => {

    const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false); // Declare isTablet outside useEffect

  useEffect(() => {
    if (!extraLargeDevices) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [extraLargeDevices]);



  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    navigate('/')
  };



  return (
    <div>
      <motion.button
        className='fixed left-0 top-0'
        onClick={toggleSidebar}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        Open
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
          style={{zIndex: 1}}
          className={`fixed h-[100vh] flex flex-col items-center justify-between py-2 ${
            extraLargeDevices ? 'w-1/6' :
            sidebarOpen && (largeDevices) ? 'w-1/4' : 
            sidebarOpen && (smallDevice || mediumDevices) ? 'w-1/2' : 'w-full'
          } mbg-800`}
            initial={{ opacity: 0, x: isTablet ? 0 : '-100%' }}
            animate={{ opacity: 1, x: isTablet ? 0 : 0 }}
            exit={{ opacity: 0, x: isTablet ? 0 : '-100%' }}
            transition={{ duration: 0.2 }}
          >
            {/* Sidebar content goes here */}
            <div className={`mbg-800 mcolor-100 fixed top-5 right-5`}>
              <button onClick={toggleSidebar}>
                {sidebarOpen && !extraLargeDevices && <CloseIcon/> }
              </button>
            </div>

            <div className='mcolor-300 text-center mt-8'>
              <Link>
                <h3 className='text-2xl my-1'><SpaIcon className='mb-2'/> MindScape</h3>
              </Link>
            </div>

            <ul className='mcolor-100 w-full' style={{marginTop: `${
              extraLargeDevices ? '-8rem' :
              (largeDevices || mediumDevices) ? '-8rem' :
              (smallDevice || extraSmallDevice) ? '-5rem' : '-8rem'
            }`}}>
              <li className={`my-1 py-4 pl-5 ml-2 text-md ${currentPage === 'profile' ? 'rounded-side mbg-200 mcolor-800' : 'rounded'}`}>
                <Link to={'/main/profile'}><span className='color-primary'><AccountCircleOutlinedIcon/></span> My Profile</Link>
              </li>
              <li className={`my-1 py-4 pl-5 ml-2 text-md ${currentPage === 'personal-study-area' ? 'rounded-side mbg-200 mcolor-800' : 'rounded'}`}>
                <Link to={'/main/personal/study-area'}><span className='color-primary'><PersonPinOutlinedIcon/></span> Personal Room</Link>
              </li>
              <li className={`my-1 py-4 pl-5 ml-2 text-md ${currentPage === 'group-study-area' ? 'rounded-side mbg-200 mcolor-800' : 'rounded'}`}>
                <Link to={'/main/group/'}><span className='color-primary'><PeopleAltOutlinedIcon/></span> Group Rooms</Link>
              </li>
              <li className={`my-1 py-4 pl-5 ml-2 text-md ${currentPage === 'library' ? 'rounded-side mbg-200 mcolor-800' : 'rounded'}`}>
                <Link to={'/main/library'}><span className='color-primary'><LocalLibraryOutlinedIcon/></span> Library Room</Link>
              </li>
              <li className={`my-1 py-4 pl-5 ml-2 text-md ${currentPage === 'forum' ? 'rounded-side mbg-200 mcolor-800' : 'rounded'}`}>
                <Link to={'/main/forums'}><span className='color-primary'><QuestionAnswerOutlinedIcon/></span> Discussion Forums</Link>
              </li>
            </ul>

            <div className='mcolor-100 py-3 w-full px-5'>
              <button className='text-lg rounded py-1 mbg-700 w-full' onClick={handleLogout}>Logout</button>
            </div>


          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
