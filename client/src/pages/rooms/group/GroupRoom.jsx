import React, { useEffect, useState } from 'react';
import './groupRoom.css';
import { Navbar } from '../../../components/navbar/logged_navbar/navbar';
import { Link } from 'react-router-dom';
import { CreateGroupComp } from '../../../components/group/CreateGroupComp';
import axios from 'axios';
import { useUser } from '../../../UserContext';


export const GroupRoom = () => {
  
  const { user } = useUser();

  const [savedGroupNotif, setSavedGroupNotif] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [memberGroupList, setMemberGroupList] = useState([])
  const [isDone, setIsDone] = useState(false);
  const UserId = user?.id;





  const fetchGroupListData = async () => {
    try {



      const response = await axios.get(`http://localhost:3001/studyGroup/extract-group-through-user/${UserId}`);
      
      setGroupList(response.data);

      const userMemberGroupList = await axios.get(`http://localhost:3001/studyGroupMembers/get-materialId/${UserId}`);
      
      const materialPromises = userMemberGroupList.data.map(async (item) => {
        const material = await axios.get(`http://localhost:3001/studyGroup/extract-all-group/${item.StudyGroupId}`);
        return material.data;
      });
      
      const materials = await Promise.all(materialPromises);
      setMemberGroupList(materials);
     
    } catch (error) {
      console.error('Error fetching study groups:', error);
      // Handle the error as needed
    }
  };

  
  useEffect(() => {

    
    if (!isDone) {
      setIsDone(true)
    }
  
  }, [UserId]);
  
  useEffect(() => {
    if (isDone) {
      fetchGroupListData();
      setIsDone(false)
    }
  }, [isDone])
  

  console.log(isDone);
  const toggleExpansion = (groupId) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  return (
    <div className='relative poppins mcolor-900 grouproom p-5'>
      <div className='mt-5 mb-8'>
        <Navbar linkBack={'/main/'} linkBackName={'Main'} currentPageName={'Groups'} username={'Jennie Kim'}/>
      </div>

      {savedGroupNotif && (
        <p className={`my-5 py-2 mbg-300 mcolor-800 text-center rounded-[5px] text-lg`}>New Created group saved!</p>
      )}


      <div className='flex flex-col lg:flex-row gap-3'>

      {/* Right Side (Room & Task) */}
      <div className='w-full h-full lg:w-full rounded-[5px] lg:flex lg:flex-col'>

        {/* Room */}
        <div className='py-4'>
          
          <div className='flex items-center justify-center'>
            <CreateGroupComp setSavedGroupNotif={setSavedGroupNotif} fetchGroupListData={fetchGroupListData} />
          </div>

          <div className='mt-6'>
            <p className='text-xl mcolor-900 font-medium'>Rooms:</p>
          </div>
            
          <div className='mt-5 grid grid-cols-3 gap-5'>

            {groupList && groupList.length > 0 && groupList.slice().sort((a, b) => b.id - a.id).map(({ id, groupName}) => (
              <div key={id} className='shadows mcolor-900 rounded-[5px] p-5 my-6 mbg-100 flex items-center justify-between relative'>


                <p className='px-1'>{groupName}</p>
                <button onClick={() => toggleExpansion(id)} className='px-5 py-2 mbg-700 mcolor-100 rounded'>View</button>

                {expandedGroupId === id && (

                  <div className='absolute right-0 bottom-0 px-7 mb-[-114px] mbg-700 mcolor-100 rounded pt-3 pb-4 opacity-80'>
                    <Link to={`/main/group/study-area/${id}`}>
                      <p className='pt-1'>Study Area</p>
                    </Link>
                    <Link to={`/main/group/tasks/${id}`}>
                      <p className='pt-1'>Tasks</p>
                    </Link>
                    <Link to={`/main/group/dashboard/${id}`}>
                      <p className='pt-1'>Dashboard</p>
                    </Link>
                  </div>
                )}

              </div>
            ))}

            {memberGroupList && memberGroupList.length > 0 && memberGroupList.slice().sort((a, b) => b.id - a.id).map(({ id, groupName}) => (
              <div key={id} className='shadows mcolor-900 rounded-[5px] p-5 my-6 mbg-100 flex items-center justify-between relative'>


                <p className='px-1'>{groupName}</p>
                <button onClick={() => toggleExpansion(id)} className='px-5 py-2 mbg-700 mcolor-100 rounded'>View</button>

                {expandedGroupId === id && (

                  <div className='absolute right-0 bottom-0 px-7 mb-[-114px] mbg-700 mcolor-100 rounded pt-3 pb-4 opacity-80' style={{ zIndex: '100' }}>
                    <Link to={`/main/group/study-area/${id}`}>
                      <p className='pt-1'>Study Area</p>
                    </Link>
                    <Link to={`/main/group/tasks/${id}`}>
                      <p className='pt-1'>Tasks</p>
                    </Link>
                    <Link to={`/main/group/dashboard/${id}`}>
                      <p className='pt-1'>Dashboard</p>
                    </Link>
                  </div>
                )}

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
