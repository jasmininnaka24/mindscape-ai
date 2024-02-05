import React from 'react';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import SpaIcon from '@mui/icons-material/Spa';



export const Navbar = () => {
  return (
    <div className='fixed max-width z-10 navbar' data-aos='fade'>
      <nav className='flex justify-between items-center py-6 mbg-100'>
        <div className='ms-logo'>
          <HashLink to={'#'} className='flex items-center'>
            <h3 className='text-3xl my-1'><SpaIcon className='mb-2' sx={{ fontSize: 32 }}/> MindScape</h3>
          </HashLink>
        </div>
        <div className='ms-nav-links flex justify-between items-center gap-5'>
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
