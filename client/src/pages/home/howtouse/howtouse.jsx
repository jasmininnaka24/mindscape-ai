import React from 'react';
import './howtouse.css';

export const HowToUse = () => {
  return (
    <div id='htu-page' data-aos='zoom-in'>
      <div className='py-6 nav mcolor-100'>nav</div>
      {/* top */}
      <div className='flex justify-between items-center'>
        <div className="line"></div>
        <h2 className="text-4xl font-medium text-center py-10">How to use MindScape?</h2>
        <div className="line"></div>
      </div>

      <div className='flex justify-center'>
        <p className='text-center text-xl border-box w-1/2'>You can watch the tutorial below, it gives step-by-step guide on how to use the application.</p>
      </div>

      <div className='mt-6 flex justify-center'>
        <div id="video-box" className='rounded-[10px]'></div>
      </div>


    </div>
  )
}
