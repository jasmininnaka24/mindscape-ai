import React, { useEffect, useState } from 'react';
import './mainpage.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import personalStudyRoomImg from '../../assets/personal_study.jpg';
import groupStudyRoomImg from '../../assets/group_study.jpg';
import virtualLibraryRoomImg from '../../assets/library.jpg';
import discussionFormusImg from '../../assets/discussion_forum.jpg';
import LaunchIcon from '@mui/icons-material/Launch';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useUser } from '../../UserContext';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import MindScapeLogo from '../../assets/mindscape_logo.png';


export const MainPage = () => {

  const { user, SERVER_URL } = useUser();
  const navigate = useNavigate();

  const [dropDownPersonalLinks, setdropDownPersonalLinks] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([])
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const UserId = user?.id;

  const toggleExpansion = () => {
    setdropDownPersonalLinks(!dropDownPersonalLinks ? true : false);
  };

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    navigate('/')
  };
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/users`);
        let responseData = response.data;
  
        let filteredUsers = responseData.filter(user => user.id !== UserId);
        
        setUsers(filteredUsers)
        
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);


  const handleSearch = async (event) => {
    setSearchTerm(event)

    const response = await axios.get(`${SERVER_URL}/users`);
    let responseData = response.data;

    let filteredUsers = responseData.filter(user => user.id !== UserId);
    // Filter users based on the search term
    // const filteredUsers = users.filter((user) =>
    //   user.username.toLowerCase().includes(term.toLowerCase())
    // );

    setSearchResults(filteredUsers);
  };



  return (
    <div className='poppins mcolor-900 mbg-100 relative' >
      <div className='absolute main-home-page mbg-200'></div>


      <div className='mbg-100 pt-8 pb-6'>
        <div className='container flex justify-between w-full mainpage-inside items-center'>

          <div className='flex items-center'>
            <div className='flex items-center'>
              <div className='mr-2' style={{ width: '40px', height: '40px' }}>
                <img src={MindScapeLogo} alt="" />
              </div>
              <p className='font-normal text-3xl'>MindScape</p>
            </div>
          </div>

          <div className='flex gap-5 relative mr-[6rem]'>
            {/* <Link to={'/main/profile'}>
              <div className='text-3xl'><i class="fa-solid fa-user"></i></div>
            </Link> */}

            <div>
              <input
                type="text"
                placeholder="Search for a user..."
                className="border-thin-800 rounded py-2 px-8"
                value={searchTerm}
                onChange={(event) => handleSearch(event.target.value)}
              />
            </div>


            {searchTerm && (
              <div className='absolute mbg-100 top-12 p-3 border-thin-800 w-full rounded max-h-[50vh]' style={{ overflowY: 'auto' }}>
                <p className='font-medium mcolor-800 text-lg'>Search Results: </p>
                {searchResults.map((user) => (
                  <div key={user.id} className='my-4 flex items-center justify-between' style={{ borderBottom: '1px #999 solid' }}>
                    <p><PersonOutlineIcon className='mr-1' />{user.username}</p>
                    <Link to={`/main/profile/${user.id}`}><LaunchIcon fontSize='small'/></Link>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div className='flex items-center'>
            <button onClick={() => {
              navigate('/main/profile')
            }} className='mcolor-100 mbg-800 rounded-full p-1'><PersonIcon fontSize='medium' /></button>
            <button className='text-2xl ml-3' onClick={handleLogout}>Logout <i class="fa-solid fa-right-from-bracket"></i></button>
          </div>
        </div>
      </div>



      <div className='container'>

        <div className='w-full grid lg:grid-cols-2 gap-10 mt-8'>
          <div className='p-5 flex flex-col justify-between mbg-100 mainpage-room border-thin-800 rounded-[10px]'>
            <div className='flex justify-center' style={{width: '100%', height: '27vh'}}>
              <img src={personalStudyRoomImg} style={{height: '100%', width: '100%', objectFit: 'cover'}} alt="" />
            </div>
            <div className='flex justify-between items-center mt-3'>
              <p className='font-medium text-2xl'>Personal Study Room</p>
              <div className='relative'>

                <button className='mbg-700 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px] btn-800 btn-800' onClick={toggleExpansion}>Go visit</button>

                {dropDownPersonalLinks && (
                  <div className='absolute right-0 bottom-0 w-full mb-[-125px] mbg-700 mcolor-100 opacity-80'>
                    <Link to={`/main/personal/study-area`}>
                      <p className='btn-700 w-full text-center py-2'>Study Area</p>
                    </Link>
                    <Link to={`/main/personal/tasks`}>
                      <p className='btn-700 w-full text-center py-2'>Tasks</p>
                    </Link>
                    <Link to={`/main/personal/dashboard`}>
                      <p className='btn-700 w-full text-center py-2'>Dashboard</p>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='p-5 flex flex-col justify-between mbg-100 mainpage-room border-thin-800 rounded-[10px]'>
            <div className='flex justify-center' style={{width: '100%', height: '27vh'}}>
              <img src={groupStudyRoomImg} style={{height: '100%', width: '100%', objectFit: 'cover'}} alt="" />
            </div>
            <div className='flex justify-between items-center mt-3'>
              <p className='font-medium text-2xl'>Group Study Room</p>
              <div>
                <Link to={'/main/group/'}>
                  <button className='mbg-700 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px] btn-800'>Go visit</button>
                </Link>
              </div>
            </div>
          </div>
          <div className='p-5 flex flex-col justify-between mbg-100 mainpage-room border-thin-800 rounded-[10px]'>
            <div className='flex justify-center' style={{width: '100%', height: '27vh'}}>
              <img src={virtualLibraryRoomImg} style={{height: '100%', width: '100%', objectFit: 'cover'}} alt="" />
            </div>
            <div className='flex justify-between items-center mt-3'>
              <p className='font-medium text-2xl'>Virtual Library Room</p>
              <div>
                <Link to={'/main/library'}>
                <button className='mbg-700 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px] btn-800'>Go visit</button>
                </Link>
              </div>
            </div>
          </div>
          <div className='p-5 flex flex-col justify-between mbg-100 mainpage-room border-thin-800 rounded-[10px]'>
            <div className='flex justify-center' style={{width: '100%', height: '27vh'}}>
              <img src={discussionFormusImg} style={{height: '100%', width: '100%', objectFit: 'cover'}} alt="" />
            </div>
            <div className='flex justify-between items-center mt-3'>
              <p className='font-medium text-2xl'>Discussion Forums</p>
              <div>
                <Link to={'/main/forums'}>
                  <button className='mbg-700 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px] btn-800 btn-800'>Go visit</button>
                </Link>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
