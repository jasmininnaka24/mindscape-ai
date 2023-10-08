import React, { useEffect, useState } from 'react';
import './groupRoom.css';
import { Navbar } from '../../../components/navbar/logged_navbar/navbar';
import { Link } from 'react-router-dom';
import { CreateGroupComp } from '../../../components/group/CreateGroupComp';
import axios from 'axios';


export const GroupRoom = () => {

  const [savedGroupNotif, setSavedGroupNotif] = useState('hidden');
  const [groupList, setGroupList] = useState([]);


  useEffect(() => {
    
    axios.get('http://localhost:3001/studyGroup/extract-all-group').then((response) => {
      setGroupList(response.data);
    })
  }, [])

  return (
    <div className='relative poppins mcolor-900 mbg-200 grouproom p-5'>
      <div className='mt-5 mb-8'>
        <Navbar linkBack={'/main/'} linkBackName={'Main'} currentPageName={'Group Study Area'} username={'Jennie Kim'}/>
      </div>


      <p className={`${savedGroupNotif} my-5 py-2 mbg-300 mcolor-800 text-center rounded-[5px] text-lg`}>New Created group saved!</p>


      <div className='flex flex-col lg:flex-row gap-3'>
      {/* Left Side (Study Area & Dashboard Box) */}
      <div className='w-full lg:w-full lg:min-w-0 inside-group-room rounded-[5px] p-4 mbg-100'>
        <div className='lg:flex lg:flex-row lg:items-center lg:justify-between gap-5'>
          <div className='relative mb-4 lg:1/2 w-full mcolor-900 rounded-[5px] inlines flex items-center justify-center mbg-800'>
            <p className='absolute bottom-0 py-2 px-5 border-thin-800 rounded-[5px] left-0 mbg-100'>Dashboard</p>
          </div>
        </div>


        {/* Task Grid (Desktop) */}
        <div className='hidden lg:block p-1'>
          <div>
            <div className='mbg-100 rounded'>

              <div className='my-4 flex items-center justify-between'>
                <button className='border-thin-700 font-medium mcolor-600 px-6 py-2 rounded-[5px]'>Sort By <i class="fa-solid fa-chevron-down"></i></button>
                <p className='text-lg mcolor-600'>There are <span className='mcolor-900 font-medium'>5 Tasks</span> assigned to you.</p>
                <button className='border-thin-800 font-medium mcolor-900 px-6 py-2 rounded-[5px]'>Add Task +</button>
              </div>

              <hr />
              
              <div className='my-4 w-full gap-5'>
                <div>
                  <div className='grid grid-cols-2 gap-6'>
                    <div className='shadows my-5 p-8 rounded-[5px]'>
                      <p className='mb-1 font-bold text-xl'>Make 2 pages of System Design</p>
                      <p className='mb-4 text-lg mcolor-600'>From this group</p>
                      <div className='flex gap-4 items-center'>
                        <p className='mbg-300 mcolor-1000 py-2 text-center w-3/4 rounded-[5px]'><i class="fa-regular fa-clock"></i> September 15 8:30AM</p>
                        <p className='bg-red-500 text-red py-2 w-1/4 rounded-[5px] text-center'>Hard</p>
                      </div>
                      <div className='mt-3 rounded-[8px] border-thin-700 font-medium mcolor-600 flex justify-center'>
                        <button className='py-3 w-full'><i class="fa-regular fa-circle"></i> Mark Complete</button>
                      </div>
                    </div>
                    <div className='shadows my-5 p-8 rounded-[5px]'>
                      <p className='mb-1 font-bold text-xl'>Make 2 pages of System Design</p>
                      <p className='mb-4 text-lg mcolor-600'>From this group</p>
                      <div className='flex gap-4 items-center'>
                        <p className='mbg-300 mcolor-1000 py-2 text-center w-3/4 rounded-[5px]'><i class="fa-regular fa-clock"></i> September 15 8:30AM</p>
                        <p className='bg-red-500 text-red py-2 w-1/4 rounded-[5px] text-center'>Hard</p>
                      </div>
                      <div className='mt-3 rounded-[8px] border-thin-700 font-medium mcolor-600 flex justify-center'>
                        <button className='py-3 w-full'><i class="fa-regular fa-circle"></i> Mark Complete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (Room & Task) */}
      <div className='w-full h-full lg:w-1/2 inside-group-room rounded-[5px] mbg-100 p-4 lg:flex lg:flex-col'>

        {/* Room */}
        <div className='mbg-100 p-4 rounded'>
          
          <CreateGroupComp setGroupList={setGroupList} groupList={setGroupList} setSavedGroupNotif={setSavedGroupNotif} />

          <div className='mt-6'>
            <p className='text-xl mcolor-900 font-medium'>Rooms:</p>
          </div>

          <div className='mt-5'>

            {groupList.slice().sort((a, b) => b.id - a.id).map(({ id, groupName}) => (
              <div key={id}>
                <Link to={`/main/group/study-area/${id}`}>
                  <p className='shadows mcolor-900 rounded-[5px] p-5 my-6'>{groupName}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Task Grid (Mobile) */}
      <div className='block lg:hidden mt-4 w-full lg:w-full lg:min-w-0 inside-group-room mbg-100'>
        <div className='grid grid-cols-1 gap-4'>
          {/* Task 1 */}
          <div className='p-4'>Task 1</div>
        </div>
      </div>
      </div>
    </div>
  );
};
