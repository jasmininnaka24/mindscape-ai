import React from 'react'
import { Link } from 'react-router-dom';

export const Navbar = (props) => {

  const { linkBack, linkBackName, currentPageName, username } = props;

  return (
    <div className='mcolor-900 flex justify-between items-center'>
      <div className='flex justify-between items-start'>
        <div className='flex gap-3 items-center text-2xl'>
          <Link to={linkBack}>{linkBackName}</Link>
          <i class="fa-solid fa-chevron-right"></i>
          <p className='font-bold'>{currentPageName}</p>
        </div>
      </div>

      <div className='flex items-center text-xl gap-3'>
        <i class="fa-regular fa-user"></i>
        <button className='text-xl'>{username} <i class="fa-solid fa-chevron-down"></i></button>
      </div>
    </div>
  )
}
