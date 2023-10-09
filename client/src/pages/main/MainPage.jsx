import React from 'react';
import './mainpage.css';
import { Link } from 'react-router-dom';


export const MainPage = () => {



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
            <div></div>
            <div className='flex justify-between items-center'>
              <p className='font-medium text-2xl'>Personal Study Room</p>
              <div>
                <Link to={'/main/personal/'}>
                  <button className='mbg-800 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px]'>Go visit</button>
                </Link>
              </div>
            </div>
          </div>
          <div className='p-5 flex flex-col justify-between mbg-100 mainpage-room rounded-[10px]'>
            <div></div>
            <div className='flex justify-between items-center'>
              <p className='font-medium text-2xl'>Group Study Room</p>
              <div>
                <Link to={'/main/group/'}>
                  <button className='mbg-800 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px]'>Go visit</button>
                </Link>
              </div>
            </div>
          </div>
          <div className='p-5 flex flex-col justify-between mbg-100 mainpage-room rounded-[10px]'>
            <div></div>
            <div className='flex justify-between items-center'>
              <p className='font-medium text-2xl'>Virtual Library Room</p>
              <div>
                <button className='mbg-800 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px]'>Go visit</button>
              </div>
            </div>
          </div>
          <div className='p-5 flex flex-col justify-between mbg-100 mainpage-room rounded-[10px]'>
            <div></div>
            <div className='flex justify-between items-center'>
              <p className='font-medium text-2xl'>Discussion Forums</p>
              <div>
                <button className='mbg-800 font-medium text-lg mcolor-100 px-14 py-2 rounded-[5px]'>Go visit</button>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}