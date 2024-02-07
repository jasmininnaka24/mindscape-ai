import React, { useEffect, useState } from 'react';
import './navbar.css';
import '../responsiveness/navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import SpaIcon from '@mui/icons-material/Spa';


import { useResponsiveSizes } from '../useResponsiveSizes'; 


export const Navbar = () => {
  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  return (
    <div className='fixed max-width z-10 navbar' data-aos='fade'>
      <nav className={`flex justify-between items-center py-6 mbg-100`}>
        <div className={`ms-logo`}>
          <HashLink to={'#'} className='flex items-center'>
            <h3 className={`my-1 ${!extraSmallDevice ? 'text-3xl' : 'text-xl'}`}>
              <SpaIcon /> MindScape
            </h3>
          </HashLink>
        </div>
        <div className={`ms-nav-links flex justify-between items-center gap-5 hidden-on-tablet-to-small-screen`}>
          
          <HashLink className='mx-4' to={'#'}>Home</HashLink>
          <HashLink className='mx-4' to={'#about'}>About</HashLink>
          <HashLink className='mx-4' to={'#benefits'}>Benefits</HashLink>
        </div>

        <div className='ms-login'>
          <Link to={'/login'} className='flex justify-between items-center gap-2'>
            <div>Login</div>
            <div>
            <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
          </Link>
        </div>
      </nav>
    </div>
  )
}
