import React, { useState, useEffect } from 'react';

export const useResponsiveSizes = () => {

  const [extraSmallDevice, setExtraSmallDevice] = useState(window.innerWidth < 577);
  const [smallDevice, setSmallDevice] = useState(window.innerWidth <= 768 && window.innerWidth >= 577);
  const [mediumDevices, setMediumDevices] = useState(window.innerWidth <= 992 && window.innerWidth >= 769);
  const [largeDevices, setLargeDevices] = useState(window.innerWidth <= 1200 && window.innerWidth >= 993);
  const [extraLargeDevices, setExtraLargeDevices] = useState(window.innerWidth > 1200);

  useEffect(() => {
    const handleResize = () => {
      setExtraSmallDevice(window.innerWidth < 577);
      setSmallDevice(window.innerWidth <= 768 && window.innerWidth >= 577);
      setMediumDevices(window.innerWidth <= 992 && window.innerWidth >= 769);
      setLargeDevices(window.innerWidth <= 1200 && window.innerWidth >= 993);
      setExtraLargeDevices(window.innerWidth > 1200);
    };

    window.addEventListener('resize', handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    extraSmallDevice,
    smallDevice,
    mediumDevices,
    largeDevices,
    extraLargeDevices,
  };

}
