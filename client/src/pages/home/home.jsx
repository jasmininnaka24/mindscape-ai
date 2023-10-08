import './home.css';
import React from 'react';
import { About } from './about/about';
import { Benefits } from './benefits/benefits';
import { HowToUse } from './howtouse/howtouse';
import { Navbar } from '../../components/navbar/navbar';
import { Link } from 'react-router-dom';

export const Home = () => {

  return (
    <div className='flex justify-center mbg-100 mcolor-900'>
      <div className='max-width'>
        <Navbar/>

        <div className='py-6 nav mcolor-100'>nav</div>
        <div className="flex flex-col justify-center main-page">
          <div>
          <div className='first-child flex justify-between items-center'>
            <div className='line'></div>
            <h2 className='py-3 font-bold text-center text-6xl'>AI-Driven Study Tools</h2>
            <div className='line'></div>
          </div>
          <div className='second-child text-2xl text-center'>
            for Academic Enhancement and Collaborative Learning
          </div>
          <div className='third-child'>
            <div className='big-line mbg-900'></div>
          </div>

          {/* 4 main features */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 boxes'>
          <div className='box rounded-[5px]'>
            <div className='main-page-image'>
              
            </div>
            <div className='flex justify-center items-end mbg-300 inner-box'>
              <div className="self-end py-2 rounded-[5px] text-xl font-medium">Personal Study Room</div>
            </div>
          </div>
          <div className='box rounded-[5px]'>
            <div className='main-page-image'>
              
            </div>
            <div className='flex justify-center items-end mbg-300 inner-box'>
              <div className="self-end py-2 rounded-[5px] text-xl font-medium">Group Study Room</div>
            </div>
          </div>
          <div className='box rounded-[5px]'>
            <div className='main-page-image'>
              
            </div>
            <div className='flex justify-center items-end mbg-300 inner-box'>
              <div className="self-end py-2 rounded-[5px] text-xl font-medium">Virtual Library Room</div>
            </div>
          </div>
          <div className='box rounded-[5px]'>
            <div className='main-page-image'>
              
            </div>
            <div className='flex justify-center items-end mbg-300 inner-box'>
              <div className="self-end py-2 rounded-[5px] text-xl font-medium">Discussion Forums</div>
            </div>
          </div>
          </div>

          {/* main-page get started button */}

          <div className='mt-5 flex justify-center items-center'>
            <Link to={'/register'} className='mbg-800 mcolor-100 py-2 px-10 rounded-[5px] text-xl font-medium'>Get Started</Link>
          </div>
          </div>
        </div>


        {/* About section */}
        <section id="about">
          <About />
        </section>

        {/* Benefits section */}
        <section id="benefits">
          <Benefits />
        </section>

        {/* How to use section */}
        <section id="howtouse">
          <HowToUse />
        </section>

      </div>
    </div>
  )
}
