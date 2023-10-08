import React from 'react';
import './benefits.css';
import resonsibilityPic from '../../../assets/responsibility.png'


export const Benefits = () => {
  return (
    <div id='benefits-page' data-aos='fade-up'>
      <div className='py-6 nav mcolor-100'>nav</div>
      {/* top */}
      <div className='flex justify-between items-center'>
        <div className="line"></div>
        <h2 className="text-4xl font-medium text-center py-10">Benefits of MindScape</h2>
        <div className="line"></div>
      </div>

      {/* 2 boxes container */}
      <div className='flex justify-between items-center'>

        {/* information about the app */}
        <div className='box-border w-1/2'>
          <div>
            <p className='text-justify text-lg my-4'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius animi beatae minima, cum consequuntur enim similique nam, sunt nobis, ipsum id iste ullam nisi. Voluptate impedit inventore temporibus explicabo voluptatum.</p>
            <p className='text-justify text-lg my-4'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius animi beatae minima, cum consequuntur enim similique nam, sunt nobis, ipsum id iste ullam nisi. Voluptate impedit inventore temporibus explicabo voluptatum.</p>
            <p className='text-justify text-lg my-4'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius animi beatae minima, cum consequuntur enim similique nam, sunt nobis, ipsum id iste ullam nisi. Voluptate impedit inventore temporibus explicabo voluptatum.</p>
          </div>
        </div>

        {/* image */}
        <div className='box-border w-1/2'>
          <div className='flex justify-center'>
            <img className='w-full sm:w-64 md:w-50 lg:w-50 xl:w-96' src={resonsibilityPic} alt="" />
          </div>
        </div>

      </div>
    </div>
  )
}
