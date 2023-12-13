// Sidebar.js
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './Sidebar.css';

const Sidebar = ({isOpen, setIsOpen, isDropdownOpen, setIsDropdownOpen, toggleSidebar}) => {




  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`fixed h-screen w-64 mbg-300 mcolor-900 text-white ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform ease-in-out duration-300`}>
      <div className="p-4">
        <div className="mt-4">


        <button onClick={toggleDropdown} className="flex items-center focus:outline-none relative">
          <span className="mr-2 text-lg font-medium">Room Sections</span>
          {isDropdownOpen ? (
            <ExpandLessIcon className={`w-6 h-6 opacity-0 animate-fade-in`} />
          ) : (
            <ExpandMoreIcon className={`w-6 h-6 opacity-0 animate-fade-in`} />
          )}
        </button>


          {isDropdownOpen && (
            <div className="mt-2 pl-4 mcolor-900 transition-opacity duration-300">
              <p className='my-1'>Personal Study Room</p>
              <p className='my-1'>Group Study Room</p>
              <p className='my-1'>Virtual Library Room</p>
              <p className='my-1'>Discussion Forums</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Sidebar;
