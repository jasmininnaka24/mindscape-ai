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
              <p className='text-justify text-lg my-4'>Mindscape is a web-based application designed to enhance students' academic performance. This platform aims to cultivate students' academic abilities through artificial intelligence (AI) learning strategies and collaborative learning. It is designed to foster the growth and development of students' academic skills, enhancing their overall learning experience and nurturing exceptional abilities. Mindscape promotes collaborative environments and efficient task management, contributing to the creation of an optimal learning experience.</p>
              <p className='text-justify text-lg my-4'>Mindscape enables users to explore various features that allow them to enhance their learning opportunities for growth-oriented learning and collaborative development. By harnessing advanced AI and deep learning technologies, Mindscape aims to assist students in maximizing their academic opportunities.</p>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
