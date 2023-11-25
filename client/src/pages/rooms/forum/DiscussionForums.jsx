import React, { useEffect, useId, useState } from 'react'
import { Navbar } from '../../../components/navbar/logged_navbar/navbar'

import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001");


export const DiscussionForums = () => {

  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [roomNameValue, setRoomNameValue] = useState('')
  const [roomCategoryValue, setRoomCategoryValue] = useState('')
  const [roomDescValue, setRoomDescValue] = useState('')

  const [roomList, setRoomList] = useState([]);
  const [discussionForumAllActiveUsers, setDiscussionForumAllActiveUsers] = useState([]);

  const [userId, setUserId] = useState(0)
  const [username, setUsername] = useState('')

  const [alreadyJoined, setAlreadyJoined] = useState(false);

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
      username: username,
      userId: userId,
    };
  
    socket.emit('join_discussion_room', data);
    socket.on('discussion_room_list', (allActiveUserList) => {
      setDiscussionForumAllActiveUsers(allActiveUserList);
      console.log(allActiveUserList);
    });

  };
  

  useEffect(() => {
    if (!alreadyJoined) {
      joinDiscussionRoom()
    }
  
    socket.on('discussion_rooms_list', (roomsList) => {
      setRoomList(roomsList);
      console.log(roomsList);
    });
  
    return () => {
      socket.off('discussion_rooms_list');
    };
  
  }, [alreadyJoined]);
  
  const createRoom = async () => {

    let room = generateRandomString()
  
    let data = {
      room: room,
      roomName: roomNameValue,
      username: username,
      userId: userId,
      roomCategory: roomCategoryValue,
      roomDescription: roomDescValue,
      discussionForumRoom: discussionForumRoom
    };
    
    socket.emit('created_discussion_forum', data);

    socket.on('discussion_rooms_list', (roomsList) => {
      setRoomList(roomsList);
      console.log(roomsList);
    });
  };
  

  return (
    <div className='mbg-200 poppins'>
      <div className='container'>
        <div className='py-10'>
          <Navbar linkBack={'/main'} linkBackName={'Main'} currentPageName={'Discussion Forums'} username={'Jennie Kim'}/>
        </div>
        
        
        {/* categories of discussion forum */}

        <div className='flex mt-8 gap-8'>

          <div className='w-1/3 min-h-[70vh]' style={{ borderRight: '2px solid #999' }}>
          </div>

          <div className='w-3/4'>

            <div className='mb-3'>
              <input type="text" className='border-thin-800 mx-1 rounded text-center py-1' placeholder='userId' onChange={(event) => setUserId(event.target.value)} value={userId !== 0 ? userId : 0} />
              <input type="text" className='border-thin-800 mx-1 rounded text-center py-1' placeholder='username' onChange={(event) => setUsername(event.target.value) } value={username !== '' ? username : ''} />
            </div>

            <div className='flex items-center justify-between mb-14 gap-5'>
              <div className='border-thin-800 w-1/2 rounded'>
                <input type="text" placeholder='Search for a room...' className='w-full py-2 rounded text-center' />
              </div>
              <div className='flex items-center justify-center w-1/2 gap-1'>
                <button className='mbg-300 px-5 py-2 rounded border-thin-800 w-full'>Join a room</button>
                <button className='mbg-700 mcolor-100 px-5 py-2 rounded w-full' onClick={() => {
                  setShowCreateRoomModal(true)
                }}>Create a room</button>
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




          </div>



        </div>


      </div>
    </div>  )
}
