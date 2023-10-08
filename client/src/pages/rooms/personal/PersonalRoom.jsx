import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../components/navbar/logged_navbar/navbar';

export const PersonalRoom = () => {
  return (
    <div className='poppins mcolor-900 container py-10'>

      <div>
        <Navbar linkBack={'/main/'} linkBackName={'Main'} currentPageName={'Personal Study Area'} username={'Jennie Kim'}/>
      </div>

      <div className='mt-5'>
        <Link to={'/main/personal/study-area'}>
          Study Area
        </Link>
      </div>
    </div>
  )
}
