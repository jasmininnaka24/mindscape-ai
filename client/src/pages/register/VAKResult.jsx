import React  from 'react';
import { useLocation } from 'react-router-dom';
import Kinesthetic from '../../assets/kinesthetic.jpg';
import Auditory from '../../assets/auditory.jpg';
import Visual from '../../assets/visual.jpg';

import './qavak.css';
import { Link } from 'react-router-dom';

export const VAKResult = () => {
  const location = useLocation();
  const { learningStyle, probability } = location.state;

  return (
    <div className='mcolor-900 vh flex flex-col justify-center'  data-aos='fade'>
      <div className="flex flex-col justify-center items-center">
        <div className="breadcrumbs max-width flex justify-center items-center">
          <div className="flex flex-col justify-between items-center">
            <div className="circle active text-4xl pl-4 pt-1">1</div>
            <p className="text-center mcolor-900 text-lg font-medium">Answer Questions</p>
          </div>
          <div className="line"></div>
          <div className="flex flex-col justify-between items-center">
          <div className="circle active text-4xl pl-5 pt-1">2</div>
            <p className="text-center mcolor-900 text-lg font-medium">Data Submission</p>
          </div>
          <div className="line"></div>
          <div className="flex flex-col justify-between items-center">
            <div className="circle active text-4xl pl-5 pt-1">3</div>
            <p className="text-center mcolor-900 text-lg font-medium">Type of Learner Result</p>
          </div>
        </div>
      </div>


      {probability >= 60 ?
      <div className='poppins flex justify-center items-center mt-14'>
        <div className="max-width">
            {/* <p className='text-xl text-center mb-5'>" {sentence} "</p> */}
            <div className='flex justify-between items-center gap-10'>
              <div className='w-full text-justify'>
                <p className='text-xl'>Based on your response data, the classification model has <span className='font-bold'>{probability}%</span> identified you as <span className='font-bold'>{learningStyle} learner.</span></p>
                <p className='text-xl mt-8'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit veritatis quod at amet ullam eaque iste dolore. Deleniti, harum quo! Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit velit placeat autem consectetur eveniet, nemo atque sapiente neque. Ipsa assumenda et, velit culpa suscipit cumque provident pariatur exercitationem iste incidunt esse facilis eveniet, alias dolorum impedit ab porro magni molestias.</p>
                <p className='text-xl mt-8'>Understanding your learning style can help you tailor your study approach to maximize your learning potential.</p>
                <Link to={'/main'}>
                  <button type="button" className ="mt-8 text-xl font-medium mbg-800 mcolor-100 px-16 py-2 rounded-[10px]">Done</button>
                </Link>
              </div>
              <div className='w-1/2 image'>
                {learningStyle === "Visual" && <img src={Visual} alt="" /> }
                {learningStyle === "Auditory" && <img src={Auditory} alt="" /> }
                {learningStyle === "Kinesthetic" && <img src={Kinesthetic} alt="" /> }
              </div>
            </div>
        </div>
      </div>
      : 
      <div className='mt-20 text-center'>
        <p className='text-2xl'>Something is wrong with your input.</p>
      </div>
      }
    </div>
  )
}
