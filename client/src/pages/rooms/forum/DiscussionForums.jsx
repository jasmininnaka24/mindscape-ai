import React, { useEffect, useId, useState } from 'react'
import { Navbar } from '../../../components/navbar/logged_navbar/navbar'
import ScrollToBottom from "react-scroll-to-bottom";
import { useUser } from '../../../UserContext';
import { fetchUserData } from '../../../userAPI';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupsIcon from '@mui/icons-material/Groups';import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SensorDoorIcon from '@mui/icons-material/SensorDoor';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import io from 'socket.io-client';
import { Link } from 'react-router-dom';
const socket = io.connect("http://localhost:3001");


export const DiscussionForums = () => {

  const { user } = useUser();

  const userId = user?.id;
  
  // user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    studyProfTarget: 0,
    typeOfLearner: '',
    userImage: ''
  })

  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [roomNameValue, setRoomNameValue] = useState('')
  const [roomCategoryValue, setRoomCategoryValue] = useState('')
  const [roomDescValue, setRoomDescValue] = useState('')

  const [roomList, setRoomList] = useState([]);
  const [discussionForumAllActiveUsers, setDiscussionForumAllActiveUsers] = useState([]);
  
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  // messages
  const [currentMessageRoom, setCurrentMessageRoom] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // tabs
  const [showRooms, setShowrooms] = useState(true);
  const [showJoinedRooms, setShowJoinedrooms] = useState(false);
  const [message, setMessage] = useState('');

  // modal
  const [showActiveUsers, setShowActiveUsers] = useState(false)
  const [showCategories, setShowCategories] = useState(false)

  // seach
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);


  let discussionForumRoom = 'discussionForumsRoomXXX';

  
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

  
  const joinDiscussionRoom = async () => {

    const userData = await fetchUserData(userId);
    setUserData({
      username: userData.username,
      email: userData.email,
      studyProfTarget: userData.studyProfTarget,
      typeOfLearner: userData.typeOfLearner,
      userImage: userData.userImage
    });


    let data = {
      room: discussionForumRoom,
      username: userData.username,
      userId: userId,
    };
  
    socket.emit('join_discussion_room', data);
    
    socket.on('discussion_room_list', (allActiveUserList) => {
      setDiscussionForumAllActiveUsers(allActiveUserList);
      console.log(allActiveUserList);
    });
  
    socket.on('discussion_rooms_list', (roomsList) => {
      setRoomList(roomsList);
      console.log(roomsList);
    });
  };
  

  useEffect(() => {



    if (!alreadyJoined) {
      if (user) {
        joinDiscussionRoom();
      }
    }
  
    // Update the event name to match the server
    socket.on('discussion_room_list', (roomsList) => {
      setRoomList(roomsList);
      console.log(roomsList);
    });
  
    return () => {
      // Update the event name to match the server
      socket.off('discussion_room_list');
    };
  }, [alreadyJoined, user]);
  
  
  const createRoom = async () => {
    let data = {
      room: generateRandomString(),
      roomName: roomNameValue,
      roomCategory: roomCategoryValue,
      roomDescription: roomDescValue,
      username: userData.username,
      userId: userId,
      discussionForumRoom: discussionForumRoom
    };
    
    socket.emit('created_discussion_forum', data);

    socket.on('discussion_rooms_list', (roomsListData) => {
      const index = roomsListData.findIndex(roomData => roomData.room === data.room);
      console.log('Index of the created room:', index);

      setCurrentIndex(index)
      setCurrentRoom(roomList[index]?.roomName)
    });


    setShowCreateRoomModal(false)
  };

  const joinCreatedRoom = async (roomCode, users, index) => {
    let data = {
      room: roomCode,
      userId: userId,
      username: userData.username,
      discussionForumRoom: discussionForumRoom,
      users: users,
      index,
    }

    socket.emit('join_created_room', data);
  }
  
  const isUserExists = (users, userId) => {
    return users.some(user => user.userId === userId);
  };

  const sendMessage = async () => {
    let data = {
      room: currentRoom,
      username: userData.username,
      userId: userId,
      discussionForumRoom: discussionForumRoom,
      message: message,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      index: currentIndex,
    }

    socket.emit('message_joined_created_room', data);
    setMessage('')
  }


  const capitalizeFirstLetter = (str) => {
    if (typeof str !== 'string' || str.length === 0) {
      return ''; // Return an empty string if the input is not a valid string
    }
  
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
  };
  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setSelectedCategory(null); // Reset selected category when searching
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm(''); // Reset search term when clicking a category
  };

  const filteredRooms = roomList
  .filter((room) => 
    (!selectedCategory || room?.roomCategory?.toLowerCase() === selectedCategory.toLowerCase()) &&
    (
      room?.roomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room?.roomCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room?.roomDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const uniqueCategories = [...new Set(roomList.map(room => capitalizeFirstLetter(room?.roomCategory)))];


  const handleClear = () => {
    setSearchTerm('');
    setSelectedCategory(null);
  };


  const leaveDiscussionForumRoom = async (room) => {
    const roomIndex = roomList.findIndex(roomItem => roomItem.room === room);
  
    // If the room is not found or already removed, do nothing
    if (roomIndex === -1) {
      return;
    }
  
    const userIndex = roomList[roomIndex].users.findIndex(user => user.userId === userId);
    const socketId = roomList[roomIndex].users[userIndex].socketId;
  
    let updatedRoomList = [...roomList];
  
    // Use filter to create a new array without the user to be removed
    const updatedUsers = updatedRoomList[roomIndex].users.filter(user => user.socketId !== socketId);
  
    // Update the users property of the room with the new array
    updatedRoomList[roomIndex].users = updatedUsers;
  
    // Check if there are no users in the room, remove the room
    if (updatedUsers.length === 0) {
      updatedRoomList = updatedRoomList.filter(updatedRoom => updatedRoom.room !== room);
    }
  
    setRoomList(updatedRoomList);
    console.log(updatedRoomList);
    socket.emit('leave-discussion-forum-room', { room: discussionForumRoom, roomList: updatedRoomList });

  };
  
  
  


  return (
    <div>

      {showRooms && (
        <div className='mbg-100 min-h-screen flex poppins'>

          <div className='w-1/6 mbg-300 mcolor-900 flex flex-col justify-between'>
            <div>
              <p className='mcolor-900 text-2xl font-medium text-center pt-12'>{userData.username}</p>

              <br />
              <br />

              <ul className='mcolor-900 w-full'>
                <li className='px-6 my-1 py-2 text-lg'>
                  <Link to={'/main'}>
                    <ArrowBackIcon className='mr-3' />Back to main
                  </Link>
                </li>

                <div className='w-full mbg-700'>
                  <button
                    className='px-6 my-1 py-2 text-lg  mcolor-100'
                    onClick={() => {
                      setShowJoinedrooms(false);
                      setShowrooms(true);
                    }}
                    >
                    <GroupsIcon className='mr-2' />
                    Rooms
                  </button>
                </div>

                <button
                className='px-6 my-1 py-2 text-lg'
                onClick={() => {
                  setShowJoinedrooms(true);
                  setShowrooms(false);
                  console.log('clicked');
                }}
              >
                <GroupsIcon className='mr-2' />
                Joined Rooms
              </button>
              </ul>
            </div>

            <div className='py-6 px-6 mcolor-900 font-medium text-lg w-full'><SensorDoorIcon /> Log out</div>
          </div>

      
          <div className='rounded flex-1 h-[89vh] px-7 mbg-100'>

            <p className='text-4xl font-bold flex items-center justify-center mt-12 mcolor-900'>
              <GroupsIcon className='mr-3' sx={{ fontSize: 45 }} />
              <p>Discussion Forum</p>
            </p>

            {/* inputs and buttons */}
            <div className='w-full flex items-center justify-center mt-5 gap-5'>
              <div className='flex items-center gap-5 w-full'>
                <div className='border-thin-800 w-full rounded'>
                  <input
                    type="text"
                    placeholder='Search for a room?...'
                    className='w-full py-2 rounded text-center'
                    value={searchTerm}
                    onChange={handleSearch}
                  />         
                </div>
                <div className='flex items-center justify-center w-full gap-1 my-5'>
                  <button className='mbg-700 mcolor-100 px-5 py-2 rounded w-full' onClick={() => {
                    setShowCreateRoomModal(true)
                  }}>Create a room</button>
                </div>
                <div className='flex items-center justify-center w-full gap-1 my-5'>
                  <button className='mbg-300 mcolor-900 border-thin-800 px-5 py-2 rounded w-full' onClick={() => {
                    setShowCategories(true)
                  }}>View Categories</button>
                </div>
              </div>
            </div>

            {/* create room modal */}

            {showCreateRoomModal && (
              <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                <div className='flex items-center justify-center h-full'>
                  <div className='relative mbg-100 h-[70vh] w-1/3 z-10 relative py-5 px-5 rounded-[5px]' style={{overflowY: 'auto'}}>

                    <button className='absolute right-5 top-5 font-medium text-xl' onClick={() => {
                      setShowCreateRoomModal(false)
                    }}>&#10006;</button>

                    <br />

                    <p className='text-center text-2xl mcolor-900 mb-5 mt-3'>Create a room</p>

                    <p className='mb-1'>Room name:</p>
                    <div className='border-thin-800 w-full rounded flex justify-center relative'>
                      <input 
                        type="text" 
                        placeholder='Type a room name
                        ...' 
                        className='px-5 py-2 rounded text-center w-full' 
                        maxLength={20} 
                        value={roomNameValue !== '' ? roomNameValue : ''}
                        onChange={(event) => setRoomNameValue(event.target.value)} />
                      <span className='absolute right-2 bottom-1 opacity-50 text-sm'>{roomNameValue.length}/20</span>
                    </div>
                    
                    <p className='mb-1 mt-4'>Room Category: </p>
                    <div className='border-thin-800 w-full rounded flex justify-center relative'>
                      <input 
                        type="text" 
                        placeholder='Type a room category...' 
                        className='px-5 py-2 rounded text-center w-full' 
                        maxLength={20} 
                        value={roomCategoryValue !== '' ? roomCategoryValue : ''}
                        onChange={(event) => setRoomCategoryValue(event.target.value)} />
                      <span className='absolute right-2 bottom-1 opacity-50 text-sm'>{roomCategoryValue.length}/20</span>
                    </div>
                    
                    <p className='mb-1 mt-4'>Room Description: </p>
                    <div className='border-thin-800 w-full rounded flex justify-center relative'>
                      <textarea
                        type="text"
                        placeholder='Type a room category'
                        className='px-5 py-2 rounded w-full'
                        rows={4}
                        maxLength={150}
                        style={{ overflow: 'hidden', resize: 'none' }}
                        value={roomDescValue !== '' ? roomDescValue : ''}
                        onChange={(event) => setRoomDescValue(event.target.value)}
                      ></textarea>
                      <span className='absolute right-2 bottom-1 opacity-50 text-sm'>{roomDescValue.length}/150</span>
                    </div>

                    <br />
                    <button className='mbg-700 mcolor-100 px-5 py-2 rounded w-full' onClick={createRoom}>Create a room</button>



                  </div>
                </div>
              </div>
            )}


            {(searchTerm !== '' || selectedCategory !== null) && (
              <div className='flex items-center justify-end mb-5'>
                <button className='mbg-300 border-thin-800 rounded py-1 px-5 mcolor-900' onClick={handleClear}>
                <ClearAllIcon /> Clear
                </button>
              </div>
            )}

            
            {showCategories && (
              <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                <div className='flex items-center justify-center h-full'>
                  <div className='relative mbg-100 h-[70vh] w-1/3 z-10 relative p-8 rounded-[5px]' style={{overflowY: 'auto'}}>

                    <button className='absolute right-5 top-5 font-medium text-xl' onClick={() => {
                      setShowCategories(false)
                    }}>&#10006;</button>

                    <p className='text-center text-2xl mcolor-900 mb-5 mt-3'>Categories</p>


                    <br />

                    {uniqueCategories.map((uniqueCategory) => (
                      <button
                        key={uniqueCategory}
                        className={`w-full my-1 mbg-300 border-thin-800 rounded py-1 ${selectedCategory === uniqueCategory ? 'bg-gray-400' : ''}`}
                        onClick={() => handleCategoryClick(uniqueCategory)}
                      >
                        {uniqueCategory}
                      </button>
                    ))}




                  </div>
                </div>
              </div>
            )}

  

    

            <p className='mcolor-900 font-medium my-4 text-lg'>Rooms: </p>
            <div className='grid grid-cols-3 gap-3'>

            {filteredRooms
              .filter(room => room !== null)
              .map((room, index) => {
                const userIdExists = room?.users?.some((userr) => userr.userId === user?.id);
         
                return (
                  <div key={index} className='mbg-300 py-3 px-5 rounded'>
                    {room && (
                      <>
                        <p className='mcolor-800'>
                          Room name: <span className='font-medium mcolor-900'>{room?.roomName || 'N/A'}</span>
                        </p>
                        <p className='mcolor-800'>
                          Room category: <span className='font-medium mcolor-900'>{room?.roomCategory || 'N/A'}</span>
                        </p>
                        <p className='mcolor-800'>
                          Room Description: <span className='font-medium mcolor-900'>{room?.roomDescription || 'N/A'}</span>
                        </p>

                        <div className='flex justify-between mt-3'>
                          <p>Users: {room?.users ? room?.users.length : 0}</p>
                          {!userIdExists ? (
                            <button
                              className='mbg-700 mcolor-100 px-5 py-2 rounded'
                              onClick={() => {
                                joinCreatedRoom(room?.room, room?.users, index)
                                setCurrentRoom(room?.room)
                                setCurrentMessageRoom(room?.roomName)
                                setCurrentIndex(index)
                              }}
                            >
                              Join Room
                            </button>
                          ) : (
                            <button
                              className='mbg-700 mcolor-100 px-5 py-2 rounded'
                              onClick={() => {
                                setCurrentRoom(room?.room)
                                setCurrentMessageRoom(room?.roomName)
                                setCurrentIndex(index)
                                setShowrooms(false)
                                setShowJoinedrooms(true)
                              }}
                            >
                              Visit
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

                      
          </div>


        </div>
      )}


      {showJoinedRooms && (
        <div className='mbg-200 min-h-screen flex poppins'>

          <div className='w-1/6 mbg-300 mcolor-900 flex flex-col justify-between'>
            <div>
              <p className='mcolor-900 text-2xl font-medium text-center pt-12'>{userData.username}</p>

              <br />
              <br />

              <ul className='mcolor-900 w-full'>
                <li className='px-6 my-1 py-2 text-lg'>
                  <Link to={'/main'}>
                    <ArrowBackIcon className='mr-3' />Back to main
                  </Link>
                </li>


                <div className='w-full'>
                  <button
                    className='px-6 my-1 py-2 text-lg mcolor-900'
                    onClick={() => {
                      setShowJoinedrooms(false);
                      setShowrooms(true);
                    }}
                    >
                    <GroupsIcon className='mr-2' />
                    Rooms
                  </button>
                </div>

                <div className='w-full mbg-700'>
                  <button
                    className='px-6 my-1 py-2 text-lg mcolor-100'
                    onClick={() => {
                      setShowrooms(false)
                      setShowJoinedrooms(true)
                    }}
                    >
                    <GroupsIcon className='mr-2' />
                    Joined Rooms
                  </button>
                </div>
              </ul>
            </div>

            <div className='py-6 px-6 mcolor-900 font-medium text-lg w-full'><SensorDoorIcon /> Log out</div>
          </div>

          <div className='flex-1 flex'>
            <div className='w-1/2 h-[100vh] px-8' style={{ borderRight: '2px solid #999', overflowY: 'auto' }}>
              <p className='text-4xl font-bold flex items-center justify-center mt-12 mcolor-900'>
                <GroupsIcon className='mr-3' sx={{ fontSize: 45 }} />
                <p>Chat Rooms</p>
              </p>


              {filteredRooms
              .filter(room => room !== null)
              .map((room, index) => {
                const userIdExists = room?.users?.some((userr) => userr.userId === user?.id);
         
                if (userIdExists) {
                  return (
                    <div key={index} className='mbg-300 py-3 px-5 my-5 rounded'>
                      {room && (
                        <>
                          <p className='mcolor-800'>Room name: <span className='font-medium mcolor-900'>{room?.roomName}</span></p>
                          <p className='mcolor-800'>Room category: <span className='font-medium mcolor-900'>{room?.roomCategory}</span></p>
                          <p className='mcolor-800'>Room Description: <span className='font-medium mcolor-900'>{room?.roomDescription}</span></p>
  
                          <div className='flex justify-between mt-3'>
                              <p>Users: {room?.users ? room?.users.length : 0}</p>


         
                              {
                                (roomList && roomList[currentIndex]?.roomName !== room?.roomName) && (
                                  <div>
                                    <button
                                      className='mbg-700 mcolor-100 px-5 py-2 rounded text-sm'
                                      onClick={() => {
                                        setCurrentRoom(room?.room);
                                        setCurrentMessageRoom(room?.roomName);
                                        setCurrentIndex(index);
                                      }}
                                    >
                                      View Chat Room
                                    </button>
 
                                  </div>
                                )
                              }

                              <button className='bg-red mcolor-100 px-5 text-sm py-2 rounded' onClick={() => leaveDiscussionForumRoom(room?.room)}>
                                Leave Room
                              </button>

                          </div>
                        </>
                      )}
                    </div>
                    );
                }
                })}
            </div>

            <div className='border-thin-800 rounded w-1/2 h-[89vh]'>

              <div className="chat-window">
                <div className="chat-header flex items-center justify-between px-5">
                  {(roomList && roomList[currentIndex]?.users?.some((userr) => userr.userId === userId)) && (
                    <div className='chat-header flex items-center justify-between px-5 w-full'>
                      <p>{roomList[currentIndex]?.roomName}</p>
                      <button className='mcolor-900 mbg-300 px-4 py-1 my-2 rounded' onClick={() => setShowActiveUsers(true)}>Active Users</button>
                    </div>
                  )}
                </div>
                <div className="chat-body">
                  { (roomList && roomList.length > 0 && roomList[currentIndex]?.users?.some((userr) => userr.userId === user?.id)) && (
                      roomList[currentIndex] && (
                      <ScrollToBottom className="message-container">
                        {roomList[currentIndex] && roomList[currentIndex].messages ? (
                          roomList[currentIndex].messages.map((messageContent) => (
                            <div
                              className="message"
                              id={userData.username === messageContent.username ? "you" : "other"}
                              key={messageContent.id} // Assuming there's an 'id' property for each message
                            >
                              <div>
                                <div className="message-content">
                                  <p>{messageContent.message}</p>
                                </div>
                                <div className="message-meta">
                                  <p id="time">{messageContent.time}</p>
                                  <p id="author" className='capitalize'>{messageContent.username}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No messages available</p>
                        )}
                      </ScrollToBottom>
                      )
                    )
                  }
                </div>
                <div className="chat-footer">
                  <input
                    type="text"
                    placeholder="Hey..."
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                      event.key === "Enter" && sendMessage();
                    }}
                  />
                  <button onClick={sendMessage}>&#9658;</button>
                </div>

              </div>
              
            </div>




            {showActiveUsers && (
              <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                <div className='flex items-center justify-center h-full'>
                  <div className='relative mbg-100 h-[70vh] w-1/3 z-10 relative py-5 px-5 rounded-[5px]' style={{overflowY: 'auto'}}>

                    <button className='absolute right-5 top-5 font-medium text-xl' onClick={() => {
                      setShowActiveUsers(false)
                    }}>&#10006;</button>

                    <p className='text-center text-2xl mcolor-900 mb-5 mt-3'>Active Users</p>


                    <br />

                    {roomList[currentIndex] && roomList[currentIndex].users ? (
                      roomList[currentIndex].users.map((user) => (
                        <div
                          key={user.userId} 
                          className='text-center'
                        >
                          <p>{user.username}</p>
                        </div>
                      ))
                    ) : (
                      <p className='text-center opacity-50'>No Active User</p>
                    )}


                  </div>
                </div>
              </div>
            )}
          </div>



        </div>
      )}
    </div>
  )
}
