import React, { useEffect, useState } from 'react';
import '../../pages/main/mainpage.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from '../../urlConfig'; 


// icon imports
import CloseIcon from '@mui/icons-material/Close';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SpaIcon from '@mui/icons-material/Spa';
import LaunchIcon from '@mui/icons-material/Launch';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';


// responsive sizes
import { useResponsiveSizes } from '../useResponsiveSizes'; 

// animation import
import { motion, AnimatePresence  } from 'framer-motion';

export const Sidebar = ({currentPage}) => {

    const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false); // Declare isTablet outside useEffect
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


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

  const handleSearch = async (event) => {
    setSearchTerm(event)
  
    const response = await axios.get(`${SERVER_URL}/users`);
    let responseData = response.data;
  
    // Assuming you want to filter users based on the username field
    let filteredUsers = responseData.filter(user => 
      user.username.toLowerCase().includes(event.toLowerCase())
    );
  
    setSearchResults(filteredUsers);
  };




  return (
    <div>
      <motion.button
        className='fixed left-0 top-0 px-3 py-1 mbg-800 mcolor-100 mb-3 rounded-[1px]'
        onClick={toggleSidebar}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <MenuOpenIcon />
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

            <div className='text-center my-8'>
              <Link>
                <h3 className='mcolor-300 text-2xl my-1'><SpaIcon className='mb-2'/> MindScape</h3>
              </Link>
              <div className='flex items-center relative mx-5 mt-3 mb-7'>
                <div className='w-full'>
                  <input
                    type="text"
                    placeholder="Search for a user..."
                    className={`border-thin-800 mbg-input rounded py-2 px-5 ${(extraLargeDevices || largeDevices) ? 'text-md' : extraSmallDevice ? 'text-xs' : 'text-sm'} w-full`}
                    value={searchTerm}
                    onChange={(event) => handleSearch(event.target.value)}
                  />
                </div>


                {searchTerm && (
                  <div className={`${searchResults.length === 0 && 'hidden'} absolute mbg-input top-12 p-3 border-thin-800 w-full rounded max-h-[50vh] ${(extraLargeDevices || largeDevices) ? 'text-md' : extraSmallDevice ? 'text-xs' : 'text-sm'}`} style={{ overflowY: 'auto' }}>
                    <p className={`font-medium mcolor-800`}>Search Results: </p>
                    {searchResults.map((user) => (
                      <div key={user.id} className='my-4 flex items-center justify-between' style={{ borderBottom: '1px #999 solid' }}>
                        <p><PersonOutlineIcon className='mr-1' />{user.username}</p>
                        <Link to={`/main/profile/${user.id}`}><LaunchIcon fontSize='small'/></Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                <Link to={'/main/personal/dashboard'}><span className='color-primary'><PersonPinOutlinedIcon/></span> Personal Room</Link>
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
