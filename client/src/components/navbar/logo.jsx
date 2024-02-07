import React from 'react';
import { HashLink } from 'react-router-hash-link';
import SpaIcon from '@mui/icons-material/Spa';
import { useResponsiveSizes } from '../useResponsiveSizes';

export const Logo = () => {

  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  return (
    <div className={`ms-logo`}>
      <HashLink to={'#'} className='flex items-center'>
        <h3 className={`my-1 ${!extraSmallDevice ? 'text-3xl' : 'text-xl'}`}>
          <SpaIcon /> MindScape
        </h3>
      </HashLink>
    </div>
  );
};
