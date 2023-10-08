import React, { useEffect, useState } from 'react';
import { SearchFunctionality } from '../search/SearchFunctionality';
import axios from 'axios';

export const CreateGroupComp = (props) => {

  const { setSavedGroupNotif, groupList, setGroupList } = props;

  const [hidden, setHidden] = useState("hidden");
  const [createGroup, setCreateGroup] = useState("hidden");
  const [joinGroup, setJoinGroup] = useState("hidden");
  const [selectedDataId, setSelectedDataId] = useState('');
  const [chosenData, setChosenData] = useState([]);
  const [data, setData] = useState([]);
  const [listedData, setListedData] = useState([]);
  const [searchTermApp, setSearchTermApp] = useState('');
  const [groupNameInp, setGroupNameInp] = useState('');


  const handleSearch = (searchTerm) => {
    setSearchTermApp(searchTerm); 
  };

  const addToChosenData = () => {
    if (selectedDataId !== '') {
      setChosenData([...chosenData, selectedDataId]);
      setData(data.filter((item) => item.id !== selectedDataId));
      setSearchTermApp('')
    } else {
      alert(`No ${searchTermApp} username found`);
    }
  }

  const removeSelectedUser = (itemId) => {
  const updatedChosenData = chosenData.filter((id) => id !== itemId);  
  setChosenData(updatedChosenData);
  axios.get(`http://localhost:3001/users/get-user/${itemId}`).then((response) => {
    setData([...data, response.data])
  })
  }

  const createGroupBtn = () => {
    const groupData = {
      groupName: groupNameInp,
      role: 'Super Admin', 
      UserId: UserId
    }

    axios.post('http://localhost:3001/studyGroup/create-group', groupData).then((response) => {
      const { id } = response.data;
      chosenData.map((item) => {
        const groupMemberData = {
          role: 'Member',
          StudyGroupId: id,
          UserId: item
        }
        axios.post('http://localhost:3001/studyGroupMembers/add-member', groupMemberData).then((response) => {
          console.log('Saved!');
          setChosenData([]);
          setHidden('hidden');
          setGroupNameInp('')

          axios.get('http://localhost:3001/studyGroup/extract-all-group').then((response) => {
            setGroupList(response.data);
          })

          setTimeout(() => {
            setSavedGroupNotif('hidden')
          }, 0);
          
          setTimeout(() => {
            setSavedGroupNotif('');
          }, 1000);
          
          setTimeout(() => {
            setSavedGroupNotif('hidden')
            fetchFollowerData();
          }, 1800);
        })
      })
    })
  }
  
  // console.log(searchTermApp);
  // console.log(data);
  // console.log(chosenData);


  const UserId = 1;

  const fetchFollowerData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/followers/get-follower-list/${UserId}`);
      let responseData = response.data;
  
      // Create an array to store all the Axios requests
      const axiosRequests = responseData.map((item) =>
        axios.get(`http://localhost:3001/users/get-user/${item.FollowingId}`)
      );
  
      Promise.all(axiosRequests)
        .then((responses) => {
          const names = responses.map((response) => response.data);
          const uniqueNames = Array.from(new Set(names));
          setData(uniqueNames);
          setListedData(uniqueNames);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    } catch (error) {
      console.error('Error fetching follower list:', error);
    }
  };

  useEffect(() => {
    // Call the fetchFollowerData function
    fetchFollowerData();
  }, []);
    
  return (
    <div className='flex justify-between items-center gap-5'>

      <button className='w-1/2 border-thin-800 font-medium mcolor-900 px-6 py-2 rounded-[5px]' onClick={() => {
        setHidden('')
        setJoinGroup('')
      }}>Join Room</button>
      <button className='w-1/2 border-thin-800 font-medium mcolor-900 px-6 py-2 rounded-[5px]' onClick={() => {
        setHidden('')
        setCreateGroup('')
        }}>
        Create Room +
      </button>

      <div className={`${hidden} absolute top-0 left-0 modal-bg w-full h-full`}>
        <div className='flex items-center justify-center h-full'>
          <div className='mbg-100 min-h-[45vh] w-1/3 z-10 relative p-10 rounded-[5px]'>

            <button className='absolute right-4 top-3 text-xl' onClick={() => {
              setHidden("hidden")
              setCreateGroup('hidden')
              setJoinGroup('hidden')
              }}>
              ✖
            </button>

            <div className={createGroup}>
              <p className='text-center text-2xl font-medium mcolor-800 my-5'>Create a group</p>
              <div className="groupName flex flex-col">

                <input type="text" placeholder='Group name...'
                value={groupNameInp}
                 onChange={((e) => {setGroupNameInp(e.target.value)})} className='border-medium-800-scale px-5 py-2 w-full rounded-[5px]' />

                <br /><br />
                <p className='mb-3'>Add group members:</p>
                <div className='relative'>
                  <SearchFunctionality data={data} onSearch={handleSearch} setSearchTermApp={setSearchTermApp} setSelectedDataId={setSelectedDataId} searchTermApp={searchTermApp} searchAssetFor={'search-username-for-group-creation'} />
                  <button className='absolute right-5 top-1 text-3xl' onClick={addToChosenData}>+</button>
                </div>
                <br /><br />
                <div>
                  {chosenData.length > 0 && 
                    <div>
                      <p className='my-3'>Selected Member{chosenData.length > 1 ? 's' : ''}: </p>
                      {chosenData.map((itemId) => (
                        <div key={itemId}>
                          {listedData.map((item) => (
                            item.id === itemId && <div className='py-1 my-1 font-medium mcolor-900'>
                              <div className='flex justify-between items-between'>
                                <p className='mb-2'><i class="fa-regular fa-user mr-3 "></i>@{item.username}</p>
                                <button onClick={(() => {removeSelectedUser(item.id)})} className='text-lg'><i class="fa-solid fa-xmark"></i></button>
                              </div>
                              <hr />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  }
                </div>
                <button onClick={createGroupBtn} className='mt-6 mbg-800 mcolor-100 py-2 rounded-[5px]'>Create</button>
              </div>
            </div>

            <div className={joinGroup}>
              <p className='text-center text-2xl font-medium mcolor-800 my-5'>Join a group</p>
              <div>
                <input type="text" className='border-medium-800-scale px-5 py-3 w-full rounded-[5px]' placeholder='Enter the code...' />
                <button className='text-xl w-full mcolor-100 mbg-800 my-3 rounded-[5px] py-2'>Join</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
