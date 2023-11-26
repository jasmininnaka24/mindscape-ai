import React, { useEffect, useId, useState } from 'react'
import { Navbar } from '../../../components/navbar/logged_navbar/navbar'
import ScrollToBottom from "react-scroll-to-bottom";
import { useUser } from '../../../UserContext';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupsIcon from '@mui/icons-material/Groups';import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SensorDoorIcon from '@mui/icons-material/SensorDoor';

import io from 'socket.io-client';
import { Link } from 'react-router-dom';
const socket = io.connect("http://localhost:3001");


export const DiscussionForums = () => {

  const { user } = useUser();

  const userId = user?.id;
  const username = user?.username;


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
  const [currentIndex, setCurrentIndex] = useState('');

  // tabs
  const [showRooms, setShowrooms] = useState(true);
  const [showJoinedRooms, setShowJoinedrooms] = useState(false);
  const [message, setMessage] = useState('');

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
    let data = {
      room: discussionForumRoom,
      username: user?.username,
      userId: user?.id,
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
        joinDiscussionRoom()
      }
    }
  
    socket.on('discussion_rooms_list', (roomsList) => {
      setRoomList(roomsList);
      console.log(roomsList);
    });
  
  
    
    return () => {
      socket.off('discussion_rooms_list');
    };
  
  }, [alreadyJoined, user, roomList, showJoinedRooms, showRooms, message]);
  
  const createRoom = async () => {
    let data = {
      room: generateRandomString(),
      roomName: roomNameValue,
      roomCategory: roomCategoryValue,
      roomDescription: roomDescValue,
      username: user?.username,
      userId: user?.id,
      discussionForumRoom: discussionForumRoom
    };
    
    socket.emit('created_discussion_forum', data);
  };

  const joinCreatedRoom = async (roomCode, users, index) => {
    let data = {
      room: roomCode,
      userId: userId,
      username: username,
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
      username: user.username,
      userId: user.id,
      discussionForumRoom: discussionForumRoom,
      message: message,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      index: currentIndex,
    }

    socket.emit('message_joined_created_room', data);
    setMessage('')
  }

  return (
    <div>

      {showRooms && (
        <div className='mbg-200 min-h-screen flex poppins'>

          <div className='w-1/6 mbg-300 mcolor-900 flex flex-col justify-between'>
            <div>
              <p className='mcolor-900 text-2xl font-medium text-center pt-12'>{username}</p>

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

      
          <div className='rounded flex-1 h-[89vh] px-7 mbg-200'>

            <p className='text-4xl font-bold flex items-center justify-center mt-12 mcolor-900'>
              <GroupsIcon className='mr-3' sx={{ fontSize: 45 }} />
              <p>Discussion Forum</p>
            </p>

            {/* inputs and buttons */}
            <div className='w-full flex items-center justify-center mt-5 mb-14 gap-5'>
              <div className='flex items-center gap-5 w-1/2'>
                <div className='border-thin-800 w-full rounded'>
                  <input type="text" placeholder='Search for a room...' className='w-full py-2 rounded text-center' />
                </div>
                <div className='flex items-center justify-center w-full gap-1 my-5'>
                  <button className='mbg-700 mcolor-100 px-5 py-2 rounded w-full' onClick={() => {
                    setShowCreateRoomModal(true)
                  }}>Create a room</button>
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


            {/* Displaying room */}
            <div className='grid grid-cols-3 gap-3'>
              {roomList
                .filter(room => room !== null)
                .map((room, index) => {
                  const userIdExists = room?.users?.some((userr) => userr.userId === user?.id);

                  return (
                    <div key={index} className='mbg-300 py-3 px-5 rounded'>
                      {room && (
                        <>
                          <p className='mcolor-800'>
                            Room name: <span className='font-medium mcolor-900'>{room.roomName}</span>
                          </p>
                          <p className='mcolor-800'>
                            Room category: <span className='font-medium mcolor-900'>{room.roomCategory}</span>
                          </p>
                          <p className='mcolor-800'>
                            Room Description: <span className='font-medium mcolor-900'>{room.roomDescription}</span>
                          </p>

                          <div className='flex justify-between mt-3'>
                            <p>Users: {room?.users ? room.users.length : 0}</p>
                            {
                              !userIdExists ? (
                                <button
                                  className='mbg-700 mcolor-100 px-5 py-2 rounded'
                                  onClick={() => joinCreatedRoom(room?.room, room?.users, index)}
                                >
                                  Join Room
                                </button>
                              ) : (
                                <button
                                  className='mbg-700 mcolor-100 px-5 py-2 rounded'
                                  onClick={() => {
                                    setCurrentMessageRoom(room?.roomName)
                                  }}
                                >
                                  Visit
                                </button>
                              )
                            }
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
              <p className='mcolor-900 text-2xl font-medium text-center pt-12'>{username}</p>

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

              {roomList
              .filter(room => room !== null)
              .map((room, index) => {
                const userIdExists = room?.users?.some((userr) => userr.userId === user?.id);

              if (userIdExists) {
                  return (
                    <div key={index} className='mbg-300 py-3 px-5 my-5 rounded'>
                      {room && (
                        <>
                          <p className='mcolor-800'>Room name: <span className='font-medium mcolor-900'>{room.roomName}</span></p>
                          <p className='mcolor-800'>Room category: <span className='font-medium mcolor-900'>{room.roomCategory}</span></p>
                          <p className='mcolor-800'>Room Description: <span className='font-medium mcolor-900'>{room.roomDescription}</span></p>
  
                          <div className='flex justify-between mt-3'>
                              <p>Users: {room.users ? room.users.length : 0}</p>
                              {
                                !userIdExists ? (
                                    <button className='mbg-700 mcolor-100 px-5 py-2 rounded' onClick={() => joinCreatedRoom(room?.room, room?.users, index)}>Join Room</button>
                                ) : (
                                  <button
                                    className='mbg-700 mcolor-100 px-5 py-2 rounded'
                                    onClick={() => {
                                      setCurrentRoom(room?.room)
                                      setCurrentMessageRoom(room?.roomName)
                                      setCurrentIndex(index)
                                    }}
                                  >
                                    View Chat Room
                                  </button>
                                )
                              }
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
                <p>{currentMessageRoom !== '' ? currentMessageRoom : 'Group Name'}</p>
                <button className='mcolor-900 mbg-300 px-4 py-1 my-2 rounded'>Active Users</button>
              </div>
              <div className="chat-body">
                <ScrollToBottom className="message-container">
                  {roomList[currentIndex] && roomList[currentIndex].messages ? (
                    roomList[currentIndex].messages.map((messageContent) => (
                      <div
                        className="message"
                        id={username === messageContent.username ? "you" : "other"}
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
          </div>



        </div>
      )}
    </div>
  )
}
