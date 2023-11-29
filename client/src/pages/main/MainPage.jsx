import React, { useState } from 'react';
import './mainpage.css';
import { Link } from 'react-router-dom';
import personalStudyRoomImg from '../../assets/personal_study.jpg';
import groupStudyRoomImg from '../../assets/group_study.jpg';
import virtualLibraryRoomImg from '../../assets/library.jpg';
import discussionFormusImg from '../../assets/discussion_forum.jpg';
import { useUser } from '../../UserContext';

export const MainPage = () => {

  const { user } = useUser();

  const [dropDownPersonalLinks, setdropDownPersonalLinks] = useState(false);

  const toggleExpansion = () => {
    setdropDownPersonalLinks(!dropDownPersonalLinks ? true : false);
  };

  return (
    <div className='poppins mcolor-900 mbg-100 relative' >
      <div className='absolute main-home-page mbg-200'></div>
      <div className='container'>
        <div className='flex justify-between w-full mainpage-inside text-xl py-8'>
          <div className='flex gap-5'>
            <div className='text-3xl'><i class="fa-solid fa-user"></i></div>
            <div className='text-3xl'><i class="fa-regular fa-bell"></i></div>
          </div>
          <div>
            <p className='font-normal text-3xl'>MindScape</p>
          </div>
          <div>
            <Link to={'/'}>
              <p className='text-2xl'>Logout <i class="fa-solid fa-right-from-bracket"></i></p>
            </Link>
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
