import React from 'react';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <div className='fixed max-width z-10 navbar' data-aos='fade'>
      <nav className='flex justify-between items-center py-6 mbg-100'>
        <div className='ms-logo'>
          <HashLink to={'#'}><i class="fa-solid fa-spa"></i> Mindscape</HashLink>
        </div>
        <div className='ms-nav-links flex justify-between items-center gap-5'>
          <HashLink to={'#'}>Home</HashLink>
          <HashLink to={'#about'}>About</HashLink>
          <HashLink to={'#benefits'}>Benefits</HashLink>
          <HashLink to={'#howtouse'}>How To Use</HashLink>
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
