import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const socket = io.connect("http://localhost:3001");


const shuffleArray = (array) => {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};


export const GroupReviewerPage = () => {
  const { groupId, materialId } = useParams();
  const UserId = 1;
  const userActivity = useRef(null);
  
  
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [room, setRoom] = useState("");
  const [userList, setUserList] = useState([]);
  const [userTurn, setUserTurn] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const [showInputs, setInputs] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  
  // study material
  const [questionIndex, setQuestionIndex] = useState(0)
  const [extractedQA, setQA] = useState({});
  const [extractedChoices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [failCount, setFailCount] = useState(2)
  const [submittedAnswer, setSubmittedAnswer] = useState("")

  const failCountDefault = (num, val) => {
    let currentFailCount = num
    let submittedAnswerVal = val
    setFailCount(currentFailCount)
    setSubmittedAnswer(submittedAnswerVal)
    socket.emit("submitted_answer", {room, currentFailCount, submittedAnswerVal})
  }

  const handleRadioChange = (event) => {
    setSelectedChoice(event.target.value);
    let selectedChoiceVal = event.target.value;
    socket.emit("selected_choice", {room, selectedChoiceVal})
  };
  
  const handleUserActivity = () => {
    clearTimeout(userActivity.current);
    userActivity.current = setTimeout(() => {
      setSessionExpired(true);
    }, 10 * 60 * 1000); 
    socket.on('disconnect', (newUserTurn) => {
      setUserList(prevUsers => prevUsers.filter(user => user.userId !== userId));
      setUserTurn(newUserTurn); 
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const groupResponse = await axios.get(`http://localhost:3001/studyMaterial/study-code/${groupId}/${materialId}`);
        const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}`);
        
        setRoom(groupResponse.data.code);
        setQA(materialResponse.data);

        

        const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${extractedQA[questionIndex].id}`);
        setChoices(choicesResponse.data);

        let shuffledArray = shuffleArray([...choicesResponse.data, { choice: extractedQA[questionIndex].answer }])

        setShuffledChoices(shuffledArray);
        socket.emit("shuffled_choices", {room, shuffledArray})


      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    
    fetchData();
 
    socket.on('userList', (users) => {
      setUserList(users);
    });

    socket.on('received_next_user', (nextUser) => {
      setUserTurn(nextUser);
    });
    socket.on('received_next_qa', (nextQuestion) => {
      setQuestionIndex(nextQuestion);
    });
    socket.on('next_qa_join', (nextQA) => {
      setQuestionIndex(nextQA);
    });

    socket.on('received_next_user_zero', (nextUser) => {
      setUserTurn(nextUser);
    });

    socket.on('received_shuffled_choices', (shuffledArray) => {
      setShuffledChoices(shuffledArray);
    });

    socket.on("received_selected_choice", (selectedChoiceVal) => {
      setSelectedChoice(selectedChoiceVal)
    })

    socket.on("received_submitted_answer", ({currentFailCount, selectedChoice}) => {
      setFailCount(currentFailCount)
      setSubmittedAnswer(selectedChoice)
    })

    // if(failCount === 0) {
    //   let currentFailCount = 2
    //   setFailCount(currentFailCount)
    //   socket.emit("submitted_answer", {room, currentFailCount})
    // }

    let userListCount = userList.length;
    socket.emit("user_list", {userListCount, room})
    socket.on("user_turn_disc", (userTurnCurr) => {
      setUserTurn(userTurnCurr)
    })
   

    // Cleanup function to handle disconnection
    socket.on('disconnect', (newUserTurn) => {
      setUserList(prevUsers => prevUsers.filter(user => user.userId !== userId));
      setUserTurn(newUserTurn); 
      nextUser()
    });
    

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);

    
    return () => {
      socket.off('userList');
      socket.off('disconnect');
      socket.off('received_next_user_zero');
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
    };
  }, [groupId, userTurn, userList, materialId, questionIndex, room]);

  console.log("userList:", userList);
  console.log("userTurn:", userTurn);
  console.log("current index:", questionIndex);
  console.log("selected choice:", selectedChoice);
  console.log("submitted answer:", submittedAnswer);
  console.log("code: ", room);

  
  

const joinRoom = () => {
  let points = 0;
  setFailCount(2)
  socket.emit("join_room", { room, username, userId, points, questionIndex, shuffledChoices, userList, failCount });
  setInputs(false);
  setIsJoined(true);

  socket.on("received_next_user_join", (userTurnSer) => {
    setUserTurn(userTurnSer)
  });
  
  socket.on("userList", (userListValExt) => {
    setUserList(userListValExt);
  });
  
  socket.on("shuffled_join", (shuffledChoices) => {
    setShuffledChoices(shuffledChoices);
  });

  socket.on("received_selected_choice_join", (selectedChoiceValCurr) => {
    setSelectedChoice(selectedChoiceValCurr);
  });

  socket.on("received_current_fail_val", (currentFailCountVal) => {
    setFailCount(currentFailCountVal);
  });

  socket.on("received_updated_userlist", (userList) => {
    setUserList(userList);
  });
};


  const nextUser = () => {
    let nextUser = (userTurn + 1) % userList.length;
    let questionIndexVal = (questionIndex + 1) % extractedQA.length;
    let studyMaterialsLength = extractedQA.length;

    socket.emit('next_turn', {nextUser, room});
    socket.emit('next_qa', {questionIndexVal, room, studyMaterialsLength });
    setUserTurn(nextUser)

    let selectedChoiceVal = "";
    setSelectedChoice(selectedChoiceVal)
    socket.emit("selected_choice", {room, selectedChoiceVal})
    failCountDefault(2, "")
  }

  const submitAnswer = () => {
    if(selectedChoice === extractedQA[questionIndex].answer){
      alert('Correct')
      nextUser()
      setSubmittedAnswer("")
      failCountDefault(2, "")
      userList[userTurn].points += 1;
      socket.emit("updated_userlist", {room, userList});
      setUserList(userList)
    } else {
      if(failCount !== 0) {
        alert('Wrong')
        let currentFailCount = failCount - 1
        failCountDefault(currentFailCount, "")
        if(currentFailCount === 0) {
          setTimeout(() => {
            userList.map((userData, index) => {
              if(index !== userTurn) {
                userList[userTurn].points += 1;
              } else {
                userList[userTurn].points += 1;
              }
              socket.emit("updated_userlist", {room, userList});
              setUserList(userList)
            })
            setSubmittedAnswer("")
            failCountDefault(2, "")
            nextUser()
          }, 1000);
        }
      } 
      
    }
    
  };



  return (
    <div className='poppins container w-full pt-5 flex flex-col items-center min-h-[100vh]'>
      <div className='w-full'>
        {sessionExpired ? (
          <div>
            <p className='pt-5 text-xl text-center'>Your session has expired due to inactivity. Please refresh the page to start a new session.</p>
          </div>
        ) : (
          <div>
            {showInputs && (
              <div>
                <input type="text" placeholder='username' onChange={(event) => { setUsername(event.target.value) }} />
                <input type="text" placeholder='user id' onChange={(event) => { setUserId(event.target.value) }} />
                {/* Get user input for userId */}
                <button onClick={joinRoom}>Join</button>
              </div>
            )}

          {isJoined && (
            <div className='flex justify-between'>
              <ul className='w-[18%] relative top-0 left-0 py-5 px-8 mbg-200 rounded-[5px]'>
                <p>Connected users:</p>
                {userList.map(user => (
                  <li key={user.userId}>
                    <p><i className="fa-solid fa-circle text-green-500 mr-1"></i> {user.username.charAt(0).toUpperCase() + user.username.slice(1)}</p>
                  </li>
                ))}
                <br />
                <p>Points: </p>
                {userList.map(user => (
                  <li key={user.userId}>
                    <p><i class="fa-solid fa-user mcolor-800 mr-1"></i> {user.username.charAt(0).toUpperCase() + user.username.slice(1)}: {user.points} </p>
                  </li>
                ))}
              </ul>
              {userList.length > 0 && userTurn < userList.length && (
                <div className='w-[80%]'>


                  {userList.length > 1 ? 
                    (userList[userTurn % userList.length].userId === userId ? (
                      <div>
                        <p className={`mbg-200 mcolor-800 px-5 py-3 rounded-[5px] text-center text-xl ${userList[userTurn].userId === userId ? 'font-bold' : 'font-bold'}`}>{userList[userTurn].userId !== userId ? `${userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)}'s turn`: 'YOUR TURN'}</p>
                        <p className='py-10 text-center text-xl font-medium text-xl mcolor-900'>{extractedQA[questionIndex].question}</p>
                        {extractedQA.length > 0 && extractedQA[questionIndex] && (
                          <div>
                            {selectedChoice !== "" && 
                              <div>
                                {failCount < 2 && (
                                  <p className='pb-5 pt-4 font-normal text-lg mcolor-800'>{userList[userTurn].userId !== userId ? `${userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)}`: 'You'} selected <span className='font-bold'>{selectedChoice}</span> - {failCount} chance left
                                  </p>
                                )}

                                {failCount === 0 && (
                                  <p className='pb-4 font-normal text-lg text-red'>Failed to answer</p>
                                )}
                              </div>
                            }
                            <form className='grid-result gap-4'>
                              {shuffledChoices.map((choice, index) => {
                                return (
                                  <div
                                    key={index}
                                    className='flex justify-center mbg-200 px-5 py-3 text-xl text-center mcolor-800 choice border-thin-800 rounded-[5px]'
                                  >
                                    <input
                                      type="radio"
                                      name="option"
                                      value={choice.choice}
                                      id={`choice${index}`} 
                                      className='custom-radio mt-1 cursor-pointer'
                                      onChange={handleRadioChange}
                                      checked={selectedChoice === choice.choice} 
                                    />
                                    <label htmlFor={`choice${index}`} className='ml-1 cursor-pointer'>{choice.choice}</label>
                                  </div>
                                );
                              })}
                            </form>

                            <div className='flex justify-center mt-8'>
                              <button className='w-1/2 py-2 px-5 mbg-700 rounded-[5px] mcolor-100 text-lg' onClick={submitAnswer}>Submit Answer</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {extractedQA.length > 0 && extractedQA[questionIndex] && (
                          <div>
                            <p className={`mbg-200 mcolor-800 px-5 py-3 rounded-[5px] text-center text-xl ${userList[userTurn].userId === userId ? 'font-bold' : 'font-bold'}`}>{userList[userTurn].userId !== userId ? `${userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)}'s turn`: 'YOUR TURN'}</p>

                            <p className='py-10 text-center text-xl font-medium text-xl mcolor-900'>{extractedQA[questionIndex].question}</p>
                            {selectedChoice !== "" && 
                              <div>
                                {failCount < 2 && (
                                  <p className='py-1 font-normal text-lg mcolor-800'>{userList[userTurn].userId !== userId ? `${userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)}`: 'You'} selected <span className='font-bold'>{selectedChoice}</span> <span className='mcolor-800'>- {failCount} chance left</span>
                                  </p>
                                )}

                                {failCount !== 0 && (
                                  <p className={`pb-4 font-normal text-lg ${selectedChoice === extractedQA[questionIndex].answer ? 'text-emerald-500' : 'text-red'}`}>{userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)} selected {selectedChoice === extractedQA[questionIndex].answer ? 'the correct answer' : 'a wrong answer'}</p>
                                )}

                                {failCount === 0 && (
                                  <p className='pb-4 font-normal text-lg text-red'>Failed to answer</p>
                                )}
                              </div>
                            }
                            <ul className='grid-result gap-4'>
                              {shuffledChoices.map((choice, index) => {
                                return (
                                  <li
                                    className={`${choice.choice === selectedChoice ? "mbg-600 mcolor-100" : "mbg-200 mcolor-800"} px-5 py-3 text-xl text-center choice border-thin-800 rounded-[5px]`}
                                    key={index}
                                  >
                                    {choice.choice}
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    )) : (
                      <p className='text-xl text-center mcolor-800 py-3 my-1'>Waiting for other users...</p>
                    )
                  }

                </div>
              )}

            </div>
          )}        
          </div>
        )}
      </div>
    </div>
  );
};
