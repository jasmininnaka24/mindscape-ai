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

export const MainPage = () => {

  const { user } = useUser();
  const navigate = useNavigate();

  const [dropDownPersonalLinks, setdropDownPersonalLinks] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([])
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);


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
        const response = await axios.get('http://localhost:3001/users');
        setUsers(response.data);


      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);


  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter users based on the search term
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filteredUsers);
  };

  return (
    <div className='poppins mcolor-900 mbg-100 relative' >
      <div className='absolute main-home-page mbg-200'></div>
      <div className='container'>
        <div className='flex justify-between w-full mainpage-inside py-8'>
          <div className='flex gap-5 relative'>
            <Link to={'/main/profile'}>
              <div className='text-3xl'><i class="fa-solid fa-user"></i></div>
            </Link>


            <div>
              <input
                type="text"
                placeholder="Search for a user..."
                className="border-thin-800 rounded py-1 px-5"
                value={searchTerm}
                onChange={handleSearch}
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

          <div>
            <p className='font-normal text-3xl'>MindScape</p>
          </div>
          <div>
            <button className='text-2xl' onClick={handleLogout}>Logout <i class="fa-solid fa-right-from-bracket"></i></button>
          </div>
        </div>

        <div className='w-full grid lg:grid-cols-2 gap-10 mt-8'>
          <div className='p-5 flex flex-col justify-between mbg-100 mainpage-room rounded-[10px]'>
            <div className='flex justify-center' style={{width: '100%', height: '27vh'}}>
              <img src={personalStudyRoomImg} style={{height: '100%', width: '100%', objectFit: 'cover'}} alt="" />
            </div>
            <div className='flex justify-between items-center mt-3'>
              <p className='font-medium text-2xl'>Personal Study Room</p>
              <div className='relative'>

                <button className='mbg-700 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px]' onClick={toggleExpansion}>Go visit</button>

                {dropDownPersonalLinks && (
                  <div className='absolute right-0 bottom-0 px-11 mb-[-114px] mbg-700 mcolor-100 rounded pt-3 pb-4 opacity-80'>
                    <Link to={`/main/personal/study-area`}>
                      <p className='pt-1'>Study Area</p>
                    </Link>
                    <Link to={`/main/personal/tasks`}>
                      <p className='pt-1'>Tasks</p>
                    </Link>
                    <Link to={`/main/personal/dashboard`}>
                      <p className='pt-1'>Dashboard</p>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='p-5 flex flex-col justify-between mbg-100 mainpage-room rounded-[10px]'>
            <div className='flex justify-center' style={{width: '100%', height: '27vh'}}>
              <img src={groupStudyRoomImg} style={{height: '100%', width: '100%', objectFit: 'cover'}} alt="" />
            </div>
            <div className='flex justify-between items-center mt-3'>
              <p className='font-medium text-2xl'>Group Study Room</p>
              <div>
                <Link to={'/main/group/'}>
                  <button className='mbg-700 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px]'>Go visit</button>
                </Link>
              </div>
            </div>
          </div>
          <div className='p-5 flex flex-col justify-between mbg-100 mainpage-room rounded-[10px]'>
            <div className='flex justify-center' style={{width: '100%', height: '27vh'}}>
              <img src={virtualLibraryRoomImg} style={{height: '100%', width: '100%', objectFit: 'cover'}} alt="" />
            </div>
            <div className='flex justify-between items-center mt-3'>
              <p className='font-medium text-2xl'>Virtual Library Room</p>
              <div>
                <Link to={'/main/library'}>
                <button className='mbg-700 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px]'>Go visit</button>
                </Link>
              </div>
            </div>
          </div>
          <div className='p-5 flex flex-col justify-between mbg-100 mainpage-room rounded-[10px]'>
            <div className='flex justify-center' style={{width: '100%', height: '27vh'}}>
              <img src={discussionFormusImg} style={{height: '100%', width: '100%', objectFit: 'cover'}} alt="" />
            </div>
            <div className='flex justify-between items-center mt-3'>
              <p className='font-medium text-2xl'>Discussion Forums</p>
              <div>
                <Link to={'/main/forums'}>
                  <button className='mbg-700 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px]'>Go visit</button>
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
