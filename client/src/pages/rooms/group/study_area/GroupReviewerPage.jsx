import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import seedrandom from 'seedrandom';
import { PreJoinPage } from '../../../../components/group/PreJoinPage';
import { AssessmentPage } from '../../../../components/group/AssessmentPage';
import axios from 'axios';

const socket = io.connect("http://localhost:3001");




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
  const [showPreJoin, setShowPreJoin] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [lostPoints, setLostPoints] = useState(false)
  
  
  
  // study material
  const [questionIndex, setQuestionIndex] = useState(0)
  const [extractedQA, setQA] = useState({});
  const [extractedChoices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [failCount, setFailCount] = useState(2);
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [remainingHints, setRemainingHints] = useState(3);
  const [kinesthethicAnswers, setKinesthethicAnswers] = useState([]);
  const [lastDraggedCharacter, setLastDraggedCharacter] = useState('');
  const [draggedBG, setDraggedBG] = useState('mbg-100');
  const [borderMedium, setBorderMedium] = useState('border-medium-800');
  const [typeOfLearner, setTypeOfLearner] = useState('kinesthetic')
  const [enabledSubmitBtn, setEnabledSubmitBtn] = useState(true);
  const [showAssessmentPage, setShowAssessmentPage] = useState(false);
  const [assessementRoom, setAssessmentRoom] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isRunningReview, setIsRunningReview] = useState(false);
  const [secondsReview, setSecondsReview] = useState(0);




  // assessment socket userstates
  const [userListAssessment, setUserListAssessment] = useState([]);

  // assessment page states
  const [selectedAssessmentAnswer, setSelectedAssessmentAnswer] = useState([]);
  const [itemCount, setItemCount] = useState(0)
  const [isSubmittedButtonClicked, setIsSubmittedButtonClicked] = useState(false);
  const [idOfWhoSubmitted, setIdOfWhoSubmitted] = useState('');
  const [usernameOfWhoSubmitted, setUsernameOfWhoSubmitted] = useState('');
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAssessmentDone, setIsAssessmentDone] = useState(false);
  const [showSubmittedAnswerModal, setShowSubmittedAnswerModal] = useState(false);
  const [showTexts, setShowTexts] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAssessment, setShowAssessment] = useState(true);
  const [overAllItems, setOverAllItems] = useState(0);
  const [preAssessmentScore, setPreAssessmentScore] = useState(0);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [assessmentImp, setAssessmentImp] = useState(0);
  const [assessmentScorePerf, setAssessmentScorePerf] = useState(0);
  const [completionTime, setCompletionTime] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [overAllPerformance, setOverAllPerformance] = useState(0);
  const [assessmentCountMoreThanOne, setAssessmentCountMoreThanOne] = useState(false);
  const [generatedAnalysis, setGeneratedAnalysis] = useState('');
  const [currentCount, setCurrentCount] = useState(20);






  

  const seed = 'uniqueRandArr27';
  const rng = seedrandom(seed);

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };
  

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

  
  function handleDragStart(e, choice) {
    setSelectedChoice(e.dataTransfer.setData("text/plain", choice));
    let selectedChoiceVal = e.dataTransfer.setData("text/plain", choice);
    socket.emit("selected_choice", {room, selectedChoiceVal})
  }


  function handleDragEnd(e) {
    // Handle any cleanup or additional logic after dragging ends
  }
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedChoiceText = e.dataTransfer.getData('text/plain');
    setSelectedChoice(droppedChoiceText);
    setDraggedBG('mbg-100')
  };

  const handleDropKinesthetic = (e, index) => {
    e.preventDefault();

    const droppedChoiceText = e.dataTransfer.getData('text/plain');

    if (extractedQA[questionIndex].quizType !== 'ToF') {
      const draggedAnswers = [...kinesthethicAnswers];
      draggedAnswers[index] = droppedChoiceText;
      setKinesthethicAnswers(draggedAnswers);
      setSelectedChoice(draggedAnswers.join('').toLowerCase());
    } else {
      setSelectedChoice(droppedChoiceText)
    }
    setLastDraggedCharacter(droppedChoiceText)
  }
  

  useEffect(() => {
    async function fetchData() {
      try {
        const groupResponse = await axios.get(`http://localhost:3001/studyMaterial/study-code/${groupId}/${materialId}`);
        const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}`);
        const fetchedQA = materialResponse.data;

        setRoom(groupResponse.data.code);
        setAssessmentRoom(`assessment-room-${groupResponse.data.code}`)


        const updatedData = await Promise.all(
          fetchedQA.map(async (item) => {
            if (item.quizType === 'ToF') {
              const randomNumber = Math.floor(Math.random() * 10);
              if (randomNumber % 2 === 0) {
                try {
                  const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${item.id}`);
                  const randomIndex = Math.floor(rng() * choicesResponse.data.length);
                  const question = choicesResponse.data[randomIndex].choice;
                  return {
                    ...item,
                    question: question,
                    answer: 'False',
                  };
                } catch (error) {
                  console.error('Error fetching choices:', error);
                  return item; // Return the original item if there's an error
                }
              }
            }
            return item; // Return the original item if it's not of type 'ToF'
          })
        );

        setQA(updatedData);
        setItemCount(updatedData.length * 60)
        socket.emit("update_QA_data", updatedData);

          
        if (Array.isArray(updatedData)) {
          const shuffledChoicesPromises = updatedData.map(async (item) => {
            try {
              const materialChoicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${item.id}`);
              const choices = materialChoicesResponse.data.map(choice => choice.choice);
              const combinedArray = [...choices, item.answer];
              const shuffledArray = shuffleArray(combinedArray);
              return shuffledArray;
            } catch (error) {
              console.error('Error fetching choices:', error);
              return []; // or handle the error according to your use case
            }
          });
    
          try {
            const shuffledChoices = await Promise.all(shuffledChoicesPromises);
            setShuffledChoices(shuffledChoices);

            socket.emit("shuffled_choices", {room, shuffledChoices})
          } catch (error) {
            console.error('Error processing choices:', error);
          }
        }



        
        


      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    
    fetchData();
 
    // socket.on('userList', (users) => {
    //   setUserList(users);
    // });

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

    // socket.on('received_shuffled_choices', (shuffledArray) => {
    //   setShuffledChoices(shuffledArray);
    // });
    socket.on("received_selected_choice", (selectedChoiceVal) => {
      setSelectedChoice(selectedChoiceVal)
    })

    socket.on("received_submitted_answer", ({currentFailCount, selectedChoice}) => {
      setFailCount(currentFailCount)
      setSubmittedAnswer(selectedChoice)
    })

    socket.on("update_QA_data", (updatedData) => {
      setQA(updatedData);
    });

    // socket.on("received_updated_userlist", (userList) => {
    //   setUserList(userList);
    // });
    console.log(userList.length);

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
  }, [groupId, userTurn, materialId, questionIndex, room, userId]);


  

  const joinRoom = () => {
    let points = 0;
    setFailCount(2)

    let userLength = userList.length;
    socket.emit("join_room", { room, username, userId, points, questionIndex, shuffledChoices, userList, failCount, lostPoints, isRunningReview: userLength > 1 ? true : false, timeDurationValReview: currentCount });
    setShowPreJoin(false);
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

    // socket.on("received_updated_userlist", (userList) => {
    //   setUserList(userList);
    // });

    socket.on("is_lost_points", (points) => {
      setLostPoints(points);
    });

    socket.on('updated_time_review', (time) => {
      setSecondsReview(time);
    });
  
    socket.on('is_running_review', (isrunning) => {
      setIsRunningReview(isrunning);
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
    setRemainingHints(3)
  }

  const submitAnswer = () => {
    if(selectedChoice === extractedQA[questionIndex].answer){
      alert('Correct')
      nextUser()
      setSubmittedAnswer("")
      failCountDefault(2, "")
      setRemainingHints(3)
      userList[userTurn].points += 1;
      socket.emit("updated_userlist", {room, userList});
      setUserList(userList)
    } else {
      if(failCount !== 0) {
        alert('Wrong')
        let currentFailCount = failCount - 1
        failCountDefault(currentFailCount, "")
        if (currentFailCount === 0) {
          setTimeout(() => {
            const updatedUserList = userList.map((userData, index) => {
              if (index !== userTurn) {
                userData.points += 1;
              } else {
                if (userData.points !== 0) {
                  userData.points -= 1;
                }
              }
              return userData;
            });
        
            socket.emit("updated_userlist", { room, userList: updatedUserList });
            setUserList(updatedUserList);
            setSubmittedAnswer("");
            failCountDefault(2, "");
            nextUser();
          }, 2500);
          setLostPoints(true);
          socket.emit("updated_lost_points", { room, lostPoints: true });
          
          setTimeout(() => {
            setLostPoints(false);
            socket.emit("updated_lost_points", { room, lostPoints: false });
          }, 2500);
        }
        
      } 
      
    }
    
  };

  
  const giveHint = () => {

    if (remainingHints >= 1) {
      let selectedChoiceVal = '';
    
      if (remainingHints === 3) {
        selectedChoiceVal = extractedQA[questionIndex].answer[0];
      } else if (remainingHints === 2) {
        selectedChoiceVal = extractedQA[questionIndex].answer.slice(0, 2);
      } else if (remainingHints === 1) {
        selectedChoiceVal = extractedQA[questionIndex].answer.slice(0, 3);
      }
    
      setSelectedChoice(selectedChoiceVal);
    
      if (remainingHints > 0) {
        setRemainingHints(remainingHints - 1);
      }
    
      if (remainingHints === 0) {
        speechSynthesis.speak(new SpeechSynthesisUtterance('No more remaining hint'));
      }
    
      socket.emit("selected_choice", { room, selectedChoiceVal });
    } else {
      speechSynthesis.speak(new SpeechSynthesisUtterance('No more remaining hint'));
    }
    
    
  }

  
  const reviewHours = Math.floor(seconds / 3600);
  const reviewMinutes = Math.floor((seconds % 3600) / 60);
  const reviewRemainingSeconds = seconds % 60;


  
  useEffect(() => {

    let interval;
    if (isRunningReview && secondsReview > 0) {
      interval = setInterval(() => {
        // setSeconds(prevSeconds => prevSeconds - 1);

        setSecondsReview(prevSeconds => {
          const updatedSeconds = prevSeconds - 1;
          socket.emit('update_time_review', { room: assessementRoom, timeDurationVal: updatedSeconds });
          return updatedSeconds;
        });
        
        socket.on("updated_time_review", (time) => {
          setSecondsReview(time);
        });


        
      }, 1000);
    } else if (secondsReview <= 0 && isRunningReview) {
      setIsRunning(false);


            

      }
  
    return () => clearInterval(interval);
  }, [isRunningReview, secondsReview]);
  


  return (
    <div className='pt-5'>
        {sessionExpired ? (
          <div>
            <p className='pt-5 text-xl text-center'>Your session has expired due to inactivity. Please refresh the page to start a new session.</p>

          </div>
        ) : (
          <div>
              <div>

                {showPreJoin && (
                  <PreJoinPage setUsername={setUsername} setUserId={setUserId} joinRoom={joinRoom} materialId={materialId} groupId={groupId} setShowPreJoin={setShowPreJoin} setShowAssessmentPage={setShowAssessmentPage} room={room} assessementRoom={assessementRoom} username={username} userId={userId} userListAssessment={userListAssessment} setUserListAssessment={setUserListAssessment} selectedAssessmentAnswer={selectedAssessmentAnswer} setSelectedAssessmentAnswer={setSelectedAssessmentAnswer} isRunning={isRunning} setIsRunning={setIsRunning} seconds={seconds} setSeconds={setSeconds} itemCount={itemCount} setQA={setQA} extractedQA={extractedQA} shuffledChoices={shuffledChoices} setShuffledChoices={setShuffledChoices} isSubmittedButtonClicked={isSubmittedButtonClicked} setIsSubmittedButtonClicked={setIsSubmittedButtonClicked} idOfWhoSubmitted={idOfWhoSubmitted} setIdOfWhoSubmitted={setIdOfWhoSubmitted} usernameOfWhoSubmitted={usernameOfWhoSubmitted} setUsernameOfWhoSubmitted={setUsernameOfWhoSubmitted} score={score} setScore={setScore} isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} isAssessmentDone={isAssessmentDone} setIsAssessmentDone={setIsAssessmentDone} showSubmittedAnswerModal={showSubmittedAnswerModal} setShowSubmittedAnswerModal={setShowSubmittedAnswerModal} showTexts={showTexts} setShowTexts={setShowTexts} showAnalysis={showAnalysis} setShowAnalysis={setShowAnalysis} showAssessment={showAssessment} setShowAssessment={setShowAssessment} overAllItems={overAllItems} setOverAllItems={setOverAllItems} preAssessmentScore={preAssessmentScore} setPreAssessmentScore={setPreAssessmentScore} assessmentScore={assessmentScore} setAssessmentScore={setAssessmentScore} assessmentImp={assessmentImp} setAssessmentImp={setAssessmentImp} assessmentScorePerf={assessmentScorePerf} setAssessmentScorePerf={setAssessmentScorePerf} completionTime={completionTime} setCompletionTime={setCompletionTime} confidenceLevel={confidenceLevel} setConfidenceLevel={setConfidenceLevel} overAllPerformance={overAllPerformance} setOverAllPerformance={setOverAllPerformance} assessmentCountMoreThanOne={assessmentCountMoreThanOne} setAssessmentCountMoreThanOne={setAssessmentCountMoreThanOne} generatedAnalysis={generatedAnalysis} setGeneratedAnalysis={setGeneratedAnalysis} />
                )}
 
                {showAssessmentPage && (
                  <AssessmentPage groupId={groupId} materialId={materialId} setShowAssessmentPage={setShowAssessmentPage} userListAssessment={userListAssessment} setUserListAssessment={setUserListAssessment} room={room} assessementRoom={assessementRoom} username={username} userId={userId} selectedAssessmentAnswer={selectedAssessmentAnswer} setSelectedAssessmentAnswer={setSelectedAssessmentAnswer} isRunning={isRunning} setIsRunning={setIsRunning} seconds={seconds} setSeconds={setSeconds} setQA={setQA} extractedQA={extractedQA} shuffledChoices={shuffledChoices} setShuffledChoices={setShuffledChoices} isSubmittedButtonClicked={isSubmittedButtonClicked} setIsSubmittedButtonClicked={setIsSubmittedButtonClicked} idOfWhoSubmitted={idOfWhoSubmitted} setIdOfWhoSubmitted={setIdOfWhoSubmitted} usernameOfWhoSubmitted={usernameOfWhoSubmitted} setUsernameOfWhoSubmitted={setUsernameOfWhoSubmitted} score={score} setScore={setScore} isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} isAssessmentDone={isAssessmentDone} setIsAssessmentDone={setIsAssessmentDone} showSubmittedAnswerModal={showSubmittedAnswerModal} setShowSubmittedAnswerModal={setShowSubmittedAnswerModal} showTexts={showTexts} setShowTexts={setShowTexts} showAnalysis={showAnalysis} setShowAnalysis={setShowAnalysis} showAssessment={showAssessment} setShowAssessment={setShowAssessment} overAllItems={overAllItems} setOverAllItems={setOverAllItems} preAssessmentScore={preAssessmentScore} setPreAssessmentScore={setPreAssessmentScore} assessmentScore={assessmentScore} setAssessmentScore={setAssessmentScore} assessmentImp={assessmentImp} setAssessmentImp={setAssessmentImp} assessmentScorePerf={assessmentScorePerf} setAssessmentScorePerf={setAssessmentScorePerf} completionTime={completionTime} setCompletionTime={setCompletionTime} confidenceLevel={confidenceLevel} setConfidenceLevel={setConfidenceLevel} overAllPerformance={overAllPerformance} setOverAllPerformance={setOverAllPerformance} assessmentCountMoreThanOne={assessmentCountMoreThanOne} setAssessmentCountMoreThanOne={setAssessmentCountMoreThanOne} generatedAnalysis={generatedAnalysis} setGeneratedAnalysis={setGeneratedAnalysis}  />
                )}
                
              </div>

              {isJoined && (
                <div className='poppins container w-full flex flex-col items-center min-h-[100vh]'>
                  <div className='w-full'>
                    <div className='flex justify-between'>
                      <ul className='w-[18%] relative top-0 left-0 py-5 px-8 mbg-200 rounded-[5px]'>
                        <p>Connected users:</p>
                        {userList.map(user => (
                          <li key={user.userId}>
                            <p><i className="fa-solid fa-circle text-green-500 mr-1"></i> {user.username.charAt(0).toUpperCase() + user.username.slice(1)}</p>
                          </li>
                        ))}
                        <br />
                        <p className='mb-2'>Points:</p>
                        {userList
                          .sort((a, b) => b.points - a.points) // Sort userList by points in descending order
                          .map((user, index) => (
                            <li key={user.userId}>
                              <p className={(index === 0 && user.points > 0 ) ? 'text-emerald-500' : 'mcolor-900'}>
                                <i className="fa-solid fa-user mr-1"></i>{" "}
                                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}:{" "}
                                {user.points} 
                              </p>
                            </li>
                          ))}


                      </ul>

                      {userList.length > 0 && userTurn < userList.length && (
                        <div className='w-[80%]'>
                          {userList.length > 1 ? 
                            (userList[userTurn % userList.length].userId === userId ? (
                              <div>
                                <p className={`mbg-200 mcolor-800 px-5 py-3 rounded-[5px] text-center text-xl ${userList[userTurn].userId === userId ? 'font-bold' : 'font-bold'}`}>{userList[userTurn].userId !== userId ? `${userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)}'s turn`: 'YOUR TURN'}</p>


                      
                                {isRunningReview === true && (
                                  <div className='timer-container px-10 py-3'>
                                    <div className='rounded-[5px]' style={{ height: "15px", backgroundColor: "#B3C5D4" }}>
                                      <div
                                        className='rounded-[5px]'
                                        style={{
                                          width: `${(secondsReview / (20)) * 100}%`,
                                          height: "100%",
                                          backgroundColor: secondsReview <= 10 ? "#af4242" : "#667F93", 
                                        }}
                                        />
                                    </div>

                                    <h1 className='mcolor-900 text-lg pt-3'>
                                      Remaining time:{' '}
                                      {secondsReview} seconds
                                    </h1>
                                  </div>
                                )}

                                {extractedQA.length > 0 ? (
                                  <div>

                                    {/* question */}
                                    <div className='flex items-center justify-between gap-4 relative mt-4 pb-8 text-center text-xl font-medium text-xl mcolor-900'>
                                      <div className={`relative w-full mbg-300 mcolor-900 min-h-[50vh] w-full rounded-[5px] pt-14 mcolor-800`}>
                                        <p className='mcolor-800 text-lg mt-2 font-medium absolute top-3 left-5'>Type: {
                                          (extractedQA[questionIndex].quizType === 'ToF' && 'True or False') ||
                                          (extractedQA[questionIndex].quizType === 'FITB' && 'Fill In The Blanks') ||
                                          (extractedQA[questionIndex].quizType === 'Identification' && 'Identification') ||
                                          (extractedQA[questionIndex].quizType === 'MCQA' && 'MCQA')
                                        }</p>

                                        { (extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB') && (
                                          <div>
                                            <p className='mcolor-800 text-lg mt-2 font-medium absolute top-10 left-5'>Remaining Hints: {remainingHints}</p>
                                            <button className='mcolor-800 mbg-200 border-thin-800 rounded-[5px] px-2 py-1 text-lg mt-2 font-medium absolute bottom-5 left-5' onClick={giveHint}>Use hint</button>
                                          </div>
                                        )}

                                        {/* questions */}
                                        {extractedQA[questionIndex].quizType === 'ToF' ? (

                                          <p className='p-10'>{extractedQA[questionIndex].question}</p>
                                          
                                        ) : (
                                          <p className='p-10'>{extractedQA[questionIndex].question}</p>
                                        )}

                                        <div className='flex justify-center'>
                                          <div
                                            className={`dragHere w-1/2 h-[12vh] rounded-[5px] absolute bottom-14 flex justify-center items-center px-10 mbg-100 ${borderMedium}`}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                          >


                                              {/* answer */}
                                              <div className='text-center'>
                                                {(extractedQA[questionIndex].quizType === 'MCQA' || extractedQA[questionIndex].quizType === 'ToF') && (
                                                  <p className={`py-7 ${selectedChoice === '' ? 'mcolor-400' : 'mcolor-900'}`}>{selectedChoice === '' ? 'Your answer goes here' : selectedChoice}</p>

                                                )}


                                                { (extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB') && (
                                                  <input type="text" onChange={handleRadioChange} placeholder='Type here...' className='w-full h-full text-center py-5 my-2' value={selectedChoice || ''} style={{ height: '100%' }} />
                                                )}

                                              </div>
                                          </div>
                                        </div>
                                      </div>




                                    </div>

                                  </div>
                                  ) : (
                                    <p className='text-center my-5 text-xl mcolor-500'>Nothing to show</p>
                                  )
                                }


                                {extractedQA.length > 0 && extractedQA[questionIndex] && (
                                  <div>
        
                                    {lostPoints === true && (
                                      <div className='text-red text-lg text-center mb-5'>You lost 1 point</div>
                                    )}


                                    {(selectedChoice !== "" && (extractedQA[questionIndex].quizType === 'MCQA' || extractedQA[questionIndex].quizType === 'ToF')) && 
                                      <div>
                                        {failCount === 0 && (
                                          <p className='pb-4 font-normal text-lg text-red text-center'>Failed to answer</p>
                                        )}
                                        {failCount < 2 && (
                                          <p className='pb-5 pt-4 text-center font-normal text-lg mcolor-800'>{userList[userTurn].userId !== userId ? `${userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)}`: 'You'} selected <span className='font-bold'>{selectedChoice}</span> - {failCount} chance left
                                          </p>
                                        )}

                                      </div>
                                    }

                                    {extractedQA[questionIndex].quizType === 'MCQA' && (
                                      <form className='grid-result gap-4'>
                                        {shuffledChoices && shuffledChoices[questionIndex].map((choice, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className='flex justify-center mbg-200 px-5 py-3 text-xl text-center mcolor-800 choice border-thin-800 rounded-[5px]'
                                            >
                                              <input
                                                type="radio"
                                                name="option"
                                                value={choice}
                                                id={`choice${index}`} 
                                                className='custom-radio mt-1 cursor-pointer'
                                                onChange={handleRadioChange}
                                                checked={selectedChoice === choice} 
                                              />
                                              <label htmlFor={`choice${index}`} className='ml-1 cursor-pointer'>{choice}</label>
                                            </div>
                                          );
                                        })}
                                      </form>
                                    )}

                                    {extractedQA[questionIndex].quizType === 'ToF' && (
                                      <form className='grid-result gap-4'>
                                        <div
                                          key={1}
                                          className='flex justify-center mbg-200 px-5 py-3 text-xl text-center mcolor-800 choice border-thin-800 rounded-[5px]'
                                        >
                                          <input
                                            type="radio"
                                            name="option"
                                            value={'True'}
                                            id={`choice${1}`} 
                                            className='custom-radio mt-1 cursor-pointer'
                                            onChange={handleRadioChange}
                                            checked={selectedChoice === 'True'} 
                                          />
                                          <label htmlFor={`choice${1}`} className='ml-1 cursor-pointer'>{'True'}</label>
                                        </div>
                                        <div
                                          key={2}
                                          className='flex justify-center mbg-200 px-5 py-3 text-xl text-center mcolor-800 choice border-thin-800 rounded-[5px]'
                                        >
                                          <input
                                            type="radio"
                                            name="option"
                                            value={'False'}
                                            id={`choice${2}`} 
                                            className='custom-radio mt-1 cursor-pointer'
                                            onChange={handleRadioChange}
                                            checked={selectedChoice === 'False'} 
                                          />
                                          <label htmlFor={`choice${2}`} className='ml-1 cursor-pointer'>{'False'}</label>
                                        </div>
                                      </form>
                                    )}

                                    <div className='flex justify-center mt-8'>
                                      <button className='w-1/2 py-2 px-5 mbg-700 rounded-[5px] mcolor-100 text-lg' onClick={submitAnswer}>Submit Answer</button>
                                    </div>
                                  </div>
                                )}

                              </div>
                            ) : (
                              <div>
                                <p className={`mbg-200 mcolor-800 px-5 py-3 rounded-[5px] text-center text-xl ${userList[userTurn].userId === userId ? 'font-bold' : 'font-bold'}`}>{userList[userTurn].userId !== userId ? `${userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)}'s turn`: 'YOUR TURN'}</p>


                                {isRunningReview === true && (
                                  <div className='timer-container px-10 py-3'>
                                    <div className='rounded-[5px]' style={{ height: "15px", backgroundColor: "#B3C5D4" }}>
                                      <div
                                        className='rounded-[5px]'
                                        style={{
                                          width: `${(secondsReview / (20)) * 100}%`,
                                          height: "100%",
                                          backgroundColor: secondsReview <= 10 ? "#af4242" : "#667F93", 
                                        }}
                                        />
                                    </div>

                                    <h1 className='mcolor-900 text-lg pt-3'>
                                      Remaining time:{' '}
                                      {secondsReview} seconds
                                    </h1>
                                  </div>
                                )}
                            
                                {extractedQA.length > 0 ? (
                                  <div>

                                    {/* question */}
                                    <div className='flex items-center justify-between gap-4 relative mt-4 pb-8 text-center text-xl font-medium text-xl mcolor-900'>
                                      <div className={`relative w-full mbg-300 mcolor-900 min-h-[50vh] w-full rounded-[5px] pt-14 mcolor-800`}>
                                        <p className='mcolor-800 text-lg mt-2 font-medium absolute top-3 left-5'>Type: {
                                          (extractedQA[questionIndex].quizType === 'ToF' && 'True or False') ||
                                          (extractedQA[questionIndex].quizType === 'FITB' && 'Fill In The Blanks') ||
                                          (extractedQA[questionIndex].quizType === 'Identification' && 'Identification') ||
                                          (extractedQA[questionIndex].quizType === 'MCQA' && 'MCQA')
                                        }</p>



                                        {/* questions */}
                                        {extractedQA[questionIndex].quizType === 'ToF' ? (

                                          <p className='p-10'>{extractedQA[questionIndex].question}</p>
                                          
                                        ) : (
                                          <p className='p-10'>{extractedQA[questionIndex].question}</p>
                                        )}

                                        <div className='flex justify-center'>
                                          <div
                                            className={`dragHere w-1/2 h-[12vh] rounded-[5px] absolute bottom-14 flex justify-center items-center px-10 mbg-100 ${borderMedium}`}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                          >


                                              {/* answer */}
                                              <div className='text-center'>
                                                {(extractedQA[questionIndex].quizType === 'MCQA' || extractedQA[questionIndex].quizType === 'ToF') && (
                                                  <p className={`py-7 ${selectedChoice === '' ? 'mcolor-400' : 'mcolor-900'}`}>{selectedChoice === '' ? `${userList[userTurn].userId !== userId ? `${userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)}'s answer goes here`: 'your answer goes here'}` : selectedChoice}</p>

                                                )}


                                                { (extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB') && (
                                                  <input type="text" placeholder={`${selectedChoice === '' ? `${userList[userTurn].userId !== userId ? `${userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)}'s answer goes here`: 'your answer goes here'}` : selectedChoice}`} className='w-full h-full text-center py-5 my-2' readOnly value={selectedChoice || ''} onChange={(event) => {
                                                    setSelectedChoice(event.target.value)
                                                  }} style={{ height: '100%' }} />
                                                )}

                                              </div>
                                          </div>
                                        </div>
                                      </div>



                                    </div>

                                    {lostPoints === true && (
                                      <div className='text-emerald-500 text-lg text-center mb-5'>You earned 1 point</div>
                                    )}

                                    {(selectedChoice !== "" && (extractedQA[questionIndex].quizType === 'MCQA' || extractedQA[questionIndex].quizType === 'ToF')) && 
                                      <div>



                                        {failCount < 2 && (
                                          <p className='py-1 text-center font-normal text-lg mcolor-800'>{userList[userTurn].userId !== userId ? `${userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)}`: 'You'} selected <span className='font-bold'>{selectedChoice}</span> <span className='mcolor-800'>- {failCount} chance left</span>
                                          </p>
                                        )}

                                        {failCount === 0 && (
                                          <p className='pb-4 text-center font-normal text-lg text-red text-center'>Failed to answer</p>
                                        )}

                                        {failCount !== 0 && (
                                          <p className={`pb-4 text-center font-normal text-lg ${selectedChoice === extractedQA[questionIndex].answer ? 'text-emerald-500' : 'text-red'}`}>{userList[userTurn].username.charAt(0).toUpperCase() + userList[userTurn].username.slice(1)} selected {selectedChoice === extractedQA[questionIndex].answer ? 'the correct answer' : 'a wrong answer'}</p>
                                        )}

                                      </div>
                                    }

                                    {extractedQA[questionIndex].quizType === 'MCQA' && (
                                      <ul className='grid-result gap-4'>
                                        {shuffledChoices && shuffledChoices[questionIndex].map((choice, index) => {
                                          return (
                                            <li
                                              className={`${choice === selectedChoice ? "mbg-600 mcolor-100" : "mbg-200 mcolor-800"} px-5 py-3 text-xl text-center choice border-thin-800 rounded-[5px]`}
                                              key={index}
                                            >
                                              {choice}
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    )}

                                    {extractedQA[questionIndex].quizType === 'ToF' && (
                                      <ul className='grid-result gap-4'>
                                        <li
                                          className={`${'True' === selectedChoice ? "mbg-600 mcolor-100" : "mbg-200 mcolor-800"} px-5 py-3 text-xl text-center choice border-thin-800 rounded-[5px]`}
                                          key={1}
                                        >
                                          {'True'}
                                        </li>
                                        <li
                                          className={`${'False' === selectedChoice ? "mbg-600 mcolor-100" : "mbg-200 mcolor-800"} px-5 py-3 text-xl text-center choice border-thin-800 rounded-[5px]`}
                                          key={1}
                                        >
                                          {'False'}
                                        </li>
                                      </ul>
                                    )}

                                  </div>
                                  ) : (
                                    <p className='text-center my-5 text-xl mcolor-500'>Nothing to show</p>
                                  )
                                }

                              </div>
                            )) : (
                              <p className='text-xl text-center mcolor-800 py-3 my-1'>Waiting for other users...</p>
                            )
                          }

                        </div>
                      )}

                    </div>
                  </div>
                </div>
              )}        
          </div>
        )}
    </div>
  );
};
