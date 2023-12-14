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
            <p className='text-justify text-lg my-4'>Through the use of the Mindscape application, students can experience a transformative impact on their educational journey. This innovative platform goes beyond traditional learning methods, offering students the opportunity to achieve enhanced academic performance, foster growth development, and provide an enriched overall learning experience.</p>
            <p className='text-justify text-lg my-4'>The collaborative features of Mindscape create a dynamic learning environment, facilitating interaction and knowledge-sharing among users. This collaborative aspect not only enhances the academic experience but also prepares students for the collaborative nature of their future workplaces.</p>
            
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
