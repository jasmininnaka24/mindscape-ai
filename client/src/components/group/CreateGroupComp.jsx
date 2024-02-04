import React, { useEffect, useState } from 'react';
import { SearchFunctionality } from '../search/SearchFunctionality';
import axios from 'axios';
import { useUser } from '../../UserContext';
import { SERVER_URL } from '../../urlConfig';


export const CreateGroupComp = (props) => {

  const { user } = useUser();


  const { setSavedGroupNotif, fetchGroupListData } = props;

  const [hidden, setHidden] = useState("hidden");
  const [createGroup, setCreateGroup] = useState("hidden");
  const [joinGroup, setJoinGroup] = useState("hidden");
  const [selectedDataId, setSelectedDataId] = useState('');
  const [chosenData, setChosenData] = useState([]);
  const [data, setData] = useState([]);
  const [listedData, setListedData] = useState([]);
  const [searchTermApp, setSearchTermApp] = useState('');
  const [groupNameInp, setGroupNameInp] = useState('');
  const [enteredCodeRoom, setEnteredCodeRoom] = useState('')
  const [errorMessage, setErrorMessage] = useState();
  const [successfullyJoinedMessage, setSuccessfullyJoinedMessage] = useState();

  
  const UserId = user?.id;


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


  const removeSelectedUser = async (itemId) => {
  const updatedChosenData = chosenData.filter((id) => id !== itemId);  
  setChosenData(updatedChosenData);
  await axios.get(`${SERVER_URL}/users/get-user/${itemId}`).then((response) => {
    setData([...data, response.data])
  })
  }

  function generateRandomString() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
  
    let randomString = '';
  
    // Generate 3 random letters
    for (let i = 0; i < 5; i++) {
      const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
      randomString += randomLetter;
    }
    
    // Generate 4 random numbers
    for (let i = 0; i < 5; i++) {
      const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
      randomString += randomNumber;
    }
    
    // Generate 5 random letters
    for (let i = 0; i < 5; i++) {
      const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
      randomString += randomLetter;
    }
    return randomString;
  }

  const fetchFollowerData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/users`);
      let responseData = response.data;

      let filteredUsers = responseData.filter(user => user.id !== UserId);
  
      // Create an array to store all the Axios requests
      const axiosRequests = filteredUsers.map(async (item) =>
        await axios.get(`${SERVER_URL}/users/get-user/${item.id}`)
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

  const createGroupBtn = async () => {

    if (groupNameInp !== '') {
      try {
        const groupData = {
          groupName: groupNameInp,
          role: 'Super Admin',
          code: generateRandomString(),
          UserId: UserId,
        };
    
        const groupResponse = await axios.post(`${SERVER_URL}/studyGroup/create-group`, groupData);
        const { id } = groupResponse.data;
    
        const groupMemberPromises = chosenData.map(async (item) => {
          const groupMemberData = {
            role: 'Member',
            StudyGroupId: id,
            UserId: item,
          };
    
          const response = await axios.post(`${SERVER_URL}/studyGroupMembers/add-member`, groupMemberData);
          console.log('Saved!', response);
        });
    
        await Promise.all(groupMemberPromises);
    
        // Additional actions after all group members are added
        setHidden('hidden');
        setGroupNameInp('');
    
        await axios.get(`${SERVER_URL}/studyGroup/extract-group-through-user/${UserId}`);
        // setGroupList(groupListResponse.data);
  
    
        setTimeout(() => {
          setSavedGroupNotif(true);
        }, 0);
        
    
        setTimeout(() => {
          setSavedGroupNotif(false);
          fetchFollowerData();
          fetchGroupListData();
        }, 1800);
        
      } catch (error) {
        console.error('Error creating group:', error);
        // Handle errors as needed
      }
    } else {
      alert('Group name field cannot be empty.')
    }

  };
  
  
  const JoinGroup = async () => {

    if (enteredCodeRoom === '') {
      setErrorMessage('The field is empty.')
    } else {
      
      const groupData = await axios.get(`${SERVER_URL}/studyGroup/find-room-id/${enteredCodeRoom}`);
  
      if (groupData.data !== null) {
        const groupDataId = groupData.data.id;
        const groupDataUserId = groupData.data.UserId;
      
        console.log(UserId);

        if (groupDataUserId === UserId) {
          setErrorMessage('You are already in this group.');
        } else {
          const userIdPost = await axios.get(`${SERVER_URL}/studyGroupMembers/find-userId/${groupDataId}/${UserId}`);

          // console.log(userIdPost.data);
      
          if (userIdPost.data !== null && userIdPost.data.UserId === UserId) {
            setErrorMessage('You are already in this group.');
          } else {
            let data = {
              role: 'Member',
              StudyGroupId: groupDataId,
              UserId: UserId
            }
      
            await axios.post(`${SERVER_URL}/studyGroupMembers/add-member`, data);
      
            setTimeout(() => {
              setSuccessfullyJoinedMessage('Successfully joined!')
            }, 100);
      
            setTimeout(() => {
              setSuccessfullyJoinedMessage('')
              setEnteredCodeRoom('')
            }, 1500);
            
            fetchGroupListData()
          }
        }
      } else {
        setErrorMessage('No room found.');
      }
      
    }

    

  }



  useEffect(() => {
    // Call the fetchFollowerData function
    fetchFollowerData();
  }, []);
    
  return (
    <div className='w-1/2 flex justify-between items-center gap-5'>

      <button className='w-1/2 btn-800 border-thin-800 font-medium px-6 py-3 rounded-[5px]' onClick={() => {
        setHidden('')
        setJoinGroup('')
      }}>Join Group</button>
      
      <button className='w-1/2 btn-primary border-thin-800 font-medium px-6 py-3 rounded-[5px]' onClick={() => {
        setHidden('')
        setCreateGroup('')
        }}>
        Create Group +
      </button>

      <div className={`${hidden} absolute top-0 left-0 modal-bg w-full h-full`}>
        <div className='flex items-center justify-center h-full'>
          <div className='mbg-100 min-h-[45vh] w-1/3 z-10 relative p-10 rounded-[5px] flex items-center justify-center'>

            <button className='absolute right-4 top-3 text-xl' onClick={() => {
              setHidden("hidden")
              setCreateGroup('hidden')
              setJoinGroup('hidden')
              }}>
              ✖
            </button>

            <div className={`${createGroup} w-full`}>
              <p className='text-center text-2xl font-medium mcolor-800 mb-5'>Create a group</p>
              <div className="groupName flex flex-col">

                <input type="text" placeholder='Group name...'
                value={groupNameInp}
                 onChange={((e) => {setGroupNameInp(e.target.value)})} className='border-medium-800-scale px-5 py-2 w-full rounded-[5px]' />

                <br />
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
                <button onClick={createGroupBtn} className='mbg-800 mcolor-100 py-2 rounded-[5px]'>Create</button>
              </div>
            </div>

            <div className={`${joinGroup} w-full`}>
              <p className='text-center text-2xl font-medium mcolor-800 my-5'>Join a group</p>
              <div>
                <input type="text" className='border-medium-800-scale px-5 py-3 mb-2 w-full rounded-[5px]' placeholder='Enter the code...' value={enteredCodeRoom || ''} onChange={(event) => {
                  setEnteredCodeRoom(event.target.value)
                  setErrorMessage('')
                  }} />
                {errorMessage !== '' && (
                  <p className='text-red text-center mb-4'>{errorMessage}</p>
                )}
                {successfullyJoinedMessage !== '' && (
                  <p className='text-emerald-500 text-center mb-4'>{successfullyJoinedMessage}</p>
                )}
                <button className='text-xl w-full mcolor-100 mbg-800 my-3 rounded-[5px] py-2' onClick={JoinGroup}>Join</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
