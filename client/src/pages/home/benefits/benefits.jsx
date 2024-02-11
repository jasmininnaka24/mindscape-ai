import React from 'react';
import './benefits.css';
import resonsibilityPic from '../../../assets/responsibility.png'
import { useResponsiveSizes } from '../../../components/useResponsiveSizes';



export const Benefits = () => {

  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  return (
    <div>
      <div className='py-6 nav mcolor-100'>nav</div>
      <div className='benefits-page' data-aos='fade-up'>

      {/* top */}
      <div className='flex justify-between items-center'>
        <div className={`${!extraSmallDevice ? 'line' : ''}`}></div>
        <h2 className={`${!extraSmallDevice ? 'text-4xl' : 'text-2xl'} font-bold text-center py-10 lora`}>Benefits of MindScape</h2>
        <div className={`${!extraSmallDevice ? 'line' : ''}`}></div>
      </div>

      {/* 2 boxes container */}
      <div className={`flex ${(!largeDevices && !extraLargeDevices) ? 'flex-col-reverse text-justify' : 'flex-row text-justify'} justify-between items-center`}>

        {/* information about the app */}
        <div className={`box-border-right ${(!largeDevices && !extraLargeDevices) ? 'w-full mt-5' : 'w-3/4'}`}>
          <div>
            <p className='text-justify text-lg my-4 poppins'>Through the use of the Mindscape application, students can experience a transformative impact on their educational journey. This innovative platform goes beyond traditional learning methods, offering students the opportunity to achieve enhanced academic performance, foster growth development, and provide an enriched overall learning experience.</p>
            <p className='text-justify text-lg my-4 poppins'>The collaborative features of Mindscape create a dynamic learning environment, facilitating interaction and knowledge-sharing among users. This collaborative aspect not only enhances the academic experience but also prepares students for the collaborative nature of their future workplaces.</p>
            
          </div>
        </div>

        {/* image */}
        <div className={`box-border-left flex items-center justify-center ${(!largeDevices && !extraLargeDevices) ? 'w-full' : 'w-1/3'}`}>
          <img className={(!largeDevices && !extraLargeDevices) ? 'w-1/2' : 'w-[80%]'} src={resonsibilityPic} alt="" />
        </div>

      </div>
    </div>
  </div>
  )
}
