import './home.css';
import React from 'react';
import { About } from './about/about';
import { Benefits } from './benefits/benefits';
import { Navbar } from '../../components/navbar/navbar';
import { Link } from 'react-router-dom';
import groupStudyRoomImg from '../../assets/groupstudy.jpg';
import { motion } from "framer-motion";
import { useResponsiveSizes } from '../../components/useResponsiveSizes'; 
import { HashLink } from 'react-router-hash-link';

// icon imports
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';


export const Home = () => {

  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();

  const [toggleMenuBtn, setToggleMenuBtn] = useState(false);

  const toggleMenuBtnFunc = () => { setToggleMenuBtn(toggleMenuBtn ? false : true) }


  return (
    <div className='flex justify-center mbg-100 mcolor-900'>
      <div className='max-width'>
        <Navbar toggleMenuBtnFunc={toggleMenuBtnFunc} />


        {toggleMenuBtn && (
          <nav className={`fixed h-[100vh] w-full top-0 left-0 dark-opacity mcolor-100 flex justify-center ${!extraSmallDevice && !smallDevice ? 'hidden' : ''}`} style={{ zIndex: '100' }}>
            <button onClick={toggleMenuBtnFunc} className='absolute right-10 top-8 mcolor-100'><CloseIcon/></button>

            <ul className='flex flex-col items-center justify-center'>
              <HashLink className='mb-5 py-3 text-xl' to={'#'}>Home</HashLink>
              <HashLink className='mb-5 py-3 text-xl' to={'#about'}>About</HashLink>
              <HashLink className='mb-5 py-3 text-xl' to={'#benefits'}>Benefits</HashLink>
            </ul>
          </nav>
        )}




        <div className={`py-6 nav mcolor-100`}>nav</div>

        <div className="flex rounded flex-col justify-center main-page w-full" style={{ position: 'relative', borderRadius: '10px' }}>
          
        <motion.img
            src={groupStudyRoomImg}
            alt="Group Study Room"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: '10',
              borderRadius: '10px'
            }}
            initial={{ opacity: 0, y: 50 }} // Initial animation state
            animate={{ opacity: 1, y: 0 }} // Animation when component mounts
            transition={{ delay: 0.5 }} // Delay before animation starts
          />

          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgb(61, 86, 84, .9)', zIndex: '20', borderRadius: '10px' }}></div>

          <motion.div 
            className='mcolor-100' 
            style={{ zIndex: '50', borderRadius: '10px' }}
            initial={{ opacity: 0, y: 50 }} // Initial animation state
            animate={{ opacity: 1, y: 0 }} // Animation when component mounts
            transition={{ delay: 0.5 }} // Delay before animation starts
          >
            <motion.div 
              className='lora first-child flex justify-center items-center'
              initial={{ opacity: 0 }} // Initial animation state
              animate={{ opacity: 1 }} // Animation when component mounts
              transition={{ delay: 1 }} // Delay before animation starts
            >
              <h2 className={`py-3 font-bold text-center ${smallDevice ? 'text-5xl px-5' : extraSmallDevice ? 'text-4xl px-5' : 'text-6xl'}`}><span className='color-light'>AI-Driven</span> Study Tools</h2>
            </motion.div>
            <motion.div 
              className={`second-child text-center lato ${smallDevice ? 'text-lg px-5' : extraSmallDevice ? 'text-md px-5' : 'text-2xl'}`}
              initial={{ opacity: 0 }} // Initial animation state
              animate={{ opacity: 1 }} // Animation when component mounts
              transition={{ delay: 1.5 }} // Delay before animation starts
            >
              for Academic Enhancement and Collaborative Learning
            </motion.div>
            <motion.div 
              className='description text-lg text-center my-8 flex items-center justify-center'
              initial={{ opacity: 0 }} // Initial animation state
              animate={{ opacity: 1 }} // Animation when component mounts
              transition={{ delay: 2 }} // Delay before animation starts
            >
              <p className={`w-3/4 p-4 mbg-700-opacity rounded lato ${smallDevice ? 'text-md' : extraSmallDevice ? 'hidden' : 'text-md'}`}>An application designed to revolutionize the way students learn, utilizing cutting-edge AI technology to provide personalized study recommendations, real-time feedback, and collaborative learning environments.</p>
            </motion.div>

            {/* main-page get started button */}
            <motion.div 
              className='mt-5 flex justify-center items-center'
              initial={{ opacity: 0 }} // Initial animation state
              animate={{ opacity: 1 }} // Animation when component mounts
              transition={{ delay: 2.5 }} // Delay before animation starts
            >
              <Link to={'/register'} className='btn-primary py-2 px-10 rounded-[5px] text-xl font-normal lato'>Get Started</Link>
            </motion.div>
          </motion.div>
        </div>



        {/* About section */}
        <section id="about" className='min-h-[85vh] flex items-center justify-center'>
          <About />
        </section>

        {/* Benefits section */}
        <section id="benefits" className='min-h-[85vh] flex items-center justify-center'>
          <Benefits />
        </section>



      </div>
    </div>
  )
}
