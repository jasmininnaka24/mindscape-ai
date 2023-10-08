import React from 'react';
import './about.css';
import studyPic from '../../../assets/study.png'

export const About = () => {
  return (
    <div class="">
      <div className='py-6 nav mcolor-100'>nav</div>
      <div className='about-page' data-aos='fade-up'>
        {/* top */}
        <div className='flex justify-between items-center'>
          <div className="line"></div>
          <h2 className="text-4xl font-medium text-center py-10">What is MindScape about?</h2>
          <div className="line"></div>
        </div>

        {/* 2 boxes container */}
        <div className='flex justify-between items-center'>

          {/* image */}
          <div className='box-border-left'>
            <img className='w-full sm:w-64 md:w-50 lg:w-50 xl:w-96' src={studyPic} alt="" />
          </div>

          {/* information about the app */}
          <div className='box-border-right'>
            <div>
              <p className='text-justify text-lg my-4'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius animi beatae minima, cum consequuntur enim similique nam, sunt nobis, ipsum id iste ullam nisi. Voluptate impedit inventore temporibus explicabo voluptatum.</p>
              <p className='text-justify text-lg my-4'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius animi beatae minima, cum consequuntur enim similique nam, sunt nobis, ipsum id iste ullam nisi. Voluptate impedit inventore temporibus explicabo voluptatum.</p>
              <p className='text-justify text-lg my-4'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius animi beatae minima, cum consequuntur enim similique nam, sunt nobis, ipsum id iste ullam nisi. Voluptate impedit inventore temporibus explicabo voluptatum.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
