import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ScrollToBottom from "react-scroll-to-bottom";

import seedrandom from 'seedrandom';
import { PreJoinPage } from '../../../../components/group/PreJoinPage';
import { AssessmentPage } from '../../../../components/group/AssessmentPage';
import axios from 'axios';
import { useUser } from '../../../../UserContext';
import { fetchUserData } from '../../../../userAPI';

const socket = io("https://mindscapeserver.jassywaaa.repl.co", {
  credentials: true,
  transports: ['websocket'],
});



export const GroupReviewerPage = () => {


  const { user, SERVER_URL } = useUser();


  const { groupId, materialId } = useParams();

  const userId = user?.id;

  // user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    studyProfTarget: 0,
    typeOfLearner: '',
    userImage: ''
  })
    


  const userActivity = useRef(null);
  
  
  const [room, setRoom] = useState("");
  const [groupHost, setGroupHost] = useState("");
  const [groupHostId, setGroupHostId] = useState("");
  const [materialTitle, setMaterialTitle] = useState("");
  const [groupName, setGroupName] = useState("");
  const [userList, setUserList] = useState([]);
  const [userTurn, setUserTurn] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const [showPreJoin, setShowPreJoin] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [lostPoints, setLostPoints] = useState(false)
  const [gainedPoints, setGainedPoints] = useState(false)
  const [alreadyFetched, setAlreadyFetched] = useState(false);
  const [isRunningReview, setIsRunningReview] = useState(false);
  const [secondsReview, setSecondsReview] = useState(0);
  const [disableSubmitButton, setDisabledSubmitButton] = useState(false);
  const [isStartStudyButtonStarted, setIsStartStudyButtonStarted] = useState(false)
  const [itemsLength, setItemsLength] = useState(0);
  const [itemsDone, setItemsDone] = useState(0);
  const [userScores, setUserScores] = useState([]);
  const [doneCheckingScores, setDoneCheckingScores] = useState(false)
  const [messageReview, setMessageReview] = useState("");
  const [messageListReview, setMessageListReview] = useState([])
  const [hideModalReview, setHideModalReview] = useState('hidden')

  // const [inCall, setInCall] = useState(false);
  
  
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
  const [shuffledChoicesAssessment, setShuffledChoicesAssessment] = useState([])
  const [extractedQAAssessment, setQAAssessment] = useState([])
  const [assessmentUsersChoices, setAssessmentUsersChoices] = useState([]);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([])
  const [isStartAssessmentButtonStarted, setIsStartAssessmentButtonStarted] = useState(false)

  const [successfullyInvited, setSuccessfullyInvited] = useState(false);
  const [successfullyInviting, setSuccessfullyInviting] = useState(false);

  const [isDone, setIsDone] = useState(false);


  const getUserData = async () => {
    const userData = await fetchUserData(userId);
    setUserData({
      username: userData?.username,
      email: userData?.email,
      studyProfTarget: userData?.studyProfTarget,
      typeOfLearner: userData?.typeOfLearner,
      userImage: userData?.userImage
    });
  }

  useEffect(() => {
    
    
    if (!isDone) {
      setIsDone(true)
    }

  },[userId])



  useEffect(() => {
    if (isDone) {
      getUserData();
      setIsDone(false)
    }
  }, [isDone])


  

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
    let currentFailCount = num;
    let submittedAnswerVal = val;
    setFailCount(currentFailCount);
    setSubmittedAnswer(submittedAnswerVal);
    socket.emit("submitted_answer", { room, currentFailCount, submittedAnswerVal });
    socket.on("received_submitted_answer", (currentFailCount) => {
      setFailCount(currentFailCount)
    })
  };
  

  const handleRadioChange = (event) => {
    setSelectedChoice(event.target.value);
    let selectedChoiceVal = event.target.value;
    socket.emit("selected_choice", {room, selectedChoiceVal})
  };


  
  // const handleUserActivity = () => {
  //   clearTimeout(userActivity.current);
  //   userActivity.current = setTimeout(() => {
  //     setSessionExpired(true);
  //   }, 10 * 60 * 1000); 
  //   socket.on('disconnect', (newUserTurn) => {
  //     setUserList(prevUsers => prevUsers.filter(user => user.userId !== userId));
  //     setUserTurn(newUserTurn); 
  //   });
  // };


  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedChoiceText = e.dataTransfer.getData('text/plain');
    setSelectedChoice(droppedChoiceText);
    setDraggedBG('mbg-100')
  };


  

  useEffect(() => {
    async function fetchData() {
      try {
        const groupDataResponse = await axios.get(`${SERVER_URL}/studyGroup/extract-all-group/${groupId}`);
        setGroupName(groupDataResponse.data.groupName);
        setGroupHostId(groupDataResponse.data.UserId);


        const groupResponse = await axios.get(`${SERVER_URL}/studyMaterial/study-code/${groupId}/${materialId}`);
        const materialResponse = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${materialId}`);
        const fetchedQA = materialResponse.data;
        
        setRoom(groupResponse.data.code);
        setMaterialTitle(groupResponse.data.title);
        
        
        
        const userHostResponse = await axios.get(`${SERVER_URL}/users/get-user/${groupResponse.data.UserId}`);
        
        setGroupHost(userHostResponse.data.email)

        setAssessmentRoom(`assessment-room-${groupResponse.data.code}`)


        const updatedData = await Promise.all(
          fetchedQA.map(async (item) => {
            if (item.quizType === 'ToF') {
              const randomNumber = Math.floor(Math.random() * 10);
              if (randomNumber % 2 === 0) {
                try {
                  const choicesResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${materialId}/${item.id}`);
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
        setQAAssessment(updatedData)
        setItemCount(updatedData.length * 60)
        socket.emit("update_QA_data", updatedData);

          
        if (Array.isArray(updatedData)) {
          const shuffledChoicesPromises = updatedData.map(async (item) => {
            try {
              const materialChoicesResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${materialId}/${item.id}`);
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
            setShuffledChoicesAssessment(shuffledChoices);

            const arrayOfObjects = shuffledChoices.map(choices => {
              return choices.map(choice => ({
                  choice,
                  numOfWhoChoose: 0,
                  userIds: []
              }));
            });

            setAssessmentUsersChoices(arrayOfObjects)
            socket.emit("shuffled_choices", {room, shuffledChoices})
          } catch (error) {
            console.error('Error processing choices:', error);
          }
        }



        
        


      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    
    if (alreadyFetched === false) {
      fetchData();
      setAlreadyFetched(true)
    }
    
    // let userListCount = userList.length;
    // socket.emit("user_list", {userListCount, room})
    // socket.on("user_turn_disc", (userTurnCurr) => {
      //   setUserTurn(userTurnCurr)
      // })
      
    setItemsLength(extractedQA.length)
 
    // Event listeners for socket events
    socket.on('userList', (users) => setUserList(users));
    socket.on('received_next_user', (nextUser) => {
      setUserTurn(nextUser)
      setCurrentCount(20)
      socket.emit('update_time_review', { room: room, timeDurationValReview: 20 });  
    });
    socket.on('received_question_index', (nextQuestion) => setQuestionIndex(nextQuestion));
    socket.on('received_selected_choice', (selectedChoiceVal) => setSelectedChoice(selectedChoiceVal));
    socket.on('received_submitted_answer', (currentFailCount) => setFailCount(currentFailCount));
    socket.on('study_session_started', (isStarted) => setIsStartStudyButtonStarted(isStarted));
    socket.on('items_done', (itemsDone) => setItemsDone(itemsDone));

    socket.on("message_list_review", (message) => {
      setMessageListReview(message);
    });

    if (itemsLength !== itemsDone) {
      setDoneCheckingScores(false);
    }
    
    if (itemsLength === itemsDone && !doneCheckingScores) {
      const uniqueUserScores = Array.from(new Set(userList.map((user) => user.points)));
    
      const sortedUserScores = uniqueUserScores.sort((a, b) => b - a);

      setUserScores(sortedUserScores);
      setDoneCheckingScores(true);
    }
    

    // socket.on('received_next_user_join', (updatedUserList) => setUserList(updatedUserList));


    // socket.on("extracted_qa_data", (updatedData) => {
    //   setQA(updatedData);
    // });
    



    
    

    
    // Cleanup function to handle disconnection
    socket.on('disconnect', (newUserTurn) => {
      nextUser();
    });



    // window.addEventListener('mousemove', handleUserActivity);
    // window.addEventListener('keypress', handleUserActivity);


    return () => {
      socket.off('userList', setUserList);
      socket.off('received_next_user');
      socket.off('received_question_index');
      socket.off('received_selected_choice');
      socket.off('received_submitted_answer');
      socket.off('study_session_started');
      socket.off('items_done');
      
      // window.removeEventListener('mousemove', handleUserActivity);
      // window.removeEventListener('keypress', handleUserActivity);
    };
  }, [groupId, userTurn, materialId, questionIndex, room, userId, userList.length, alreadyFetched, userList, extractedQA.length, isStartStudyButtonStarted, itemsDone, itemsLength, userScores, doneCheckingScores, messageListReview, setMessageListReview]);




  // invite members to join study session or assessment
  const inviteMembers = async (sentence) => {

    let updatedSentence = '';

    setSuccessfullyInviting(true)


    const groupMembers = await axios.get(`${SERVER_URL}/studyGroupMembers/get-members/${groupId}`);
    
    const groupMembersData = groupMembers.data;

    for (const member of groupMembersData) {
      // Your code to handle each member
      const groupMembersDetails = await axios.get(`${SERVER_URL}/users/get-user/${member.UserId}`);
      if (groupMembersDetails.data !== null) {

        let invitationData = {
          email: groupMembersDetails.data.email,
          groupName: groupName,
          title: materialTitle,
          sentence: updatedSentence,
        }

        if (member.UserId !== userId) {
          await axios.post(`${SERVER_URL}/studyGroupMembers/invite-members`, invitationData);
        }
      }
    } 

    
    if (groupHostId !== userId) {
      let invitationData = {
        email: groupHost,
        groupName: groupName,
        title: materialTitle,
        sentence: updatedSentence,
      }
      
      if (invitationData) {
        await axios.post(`${SERVER_URL}/studyGroupMembers/invite-members`, invitationData);
      }
    }
    
    setSuccessfullyInviting(false)
    setSuccessfullyInvited(true);
    
  }

  

  const joinRoom = async () => {
    let points = 0;
    setFailCount(2)

    let username = userData?.username;

    socket.emit("join_room", { room, username, userId, points, questionIndex, shuffledChoices, userList, failCount, lostPoints, gainedPoints, isRunningReview: true, timeDurationValReview: currentCount, extractedQA, isStudyStarted: false, itemsDone: itemsDone });

    let showPreJoinSaved = false;
    let isJoinedSaved = true;

    setShowPreJoin(showPreJoinSaved);
    setIsJoined(isJoinedSaved);
    

    socket.on("received_next_user_join", (userTurnSer) => setUserTurn(userTurnSer));    
    socket.on("userList", (userListValExt) => setUserList(userListValExt));    
    socket.on("shuffled_join", (shuffledChoices) => setShuffledChoices(shuffledChoices));
    socket.on("received_selected_choice_join", (selectedChoiceValCurr) => setSelectedChoice(selectedChoiceValCurr));
    socket.on("received_current_fail_val", (currentFailCountVal) => setFailCount(currentFailCountVal));
    socket.on("received_updated_userlist", (userList) => setUserList(userList));
    socket.on("is_lost_points", (points) => setLostPoints(points));
    socket.on("is_gained_points", (points) => setGainedPoints(points));
    socket.on('updated_time_review', (time) => setSecondsReview(time));  
    socket.on('is_running_review', (isrunning) => setIsRunningReview(isrunning));  
    socket.on('extracted_qa_data', (extractedQA) => setQA(extractedQA));    
    socket.on('received_question_index', (nextQuestion) => setQuestionIndex(nextQuestion));
    socket.on('study_session_started', (isStarted) => setIsStartStudyButtonStarted(isStarted));

    socket.on("message_list_review", (message) => {
      if (message.length !== 0) {
        setMessageListReview(message)
      }
    });

    

  };



  const responseStateUpdate = async (questionId, responseStateInp) => {
    const data = {
      response_state: responseStateInp, 
    };
    
    await axios.put(`${SERVER_URL}/quesAns/update-response-state/${materialId}/${questionId}`, data);
    
  }



  const otherUserFunctionalities = () => {
    let nextUser = (userTurn + 1) % userList.length;
      
    socket.emit('next_turn', {nextUser, room});
    let questionIndexVal = (questionIndex + 1) % extractedQA.length;
    // let studyMaterialsLength = extractedQA.length;

    socket.emit('updated_question_index', {questionIndex: questionIndexVal, room });

    let selectedChoiceVal = "";
    setSelectedChoice(selectedChoiceVal)
    socket.emit("selected_choice", {room, selectedChoiceVal})
    setRemainingHints(3)
    setCurrentCount(20)
    socket.emit('update_time_review', { room: room, timeDurationValReview: 20 });
    
    if (Array.isArray(extractedQA) && extractedQA.length > 0) {
      if (
        extractedQA[questionIndexVal].quizType !== 'ToF' 
      ) {
        failCountDefault(2, "")
      } else {
        failCountDefault(1, "")
      }
    }

  }


  const studyAgain = () => {

    setIsRunningReview(true)
    setItemsDone(0)

          
    setSelectedChoice("")
    setRemainingHints(3)
    setCurrentCount(20)
    setQuestionIndex(0)

    let nextUser = (userTurn + 1) % userList.length;

    
    if (Array.isArray(extractedQA) && extractedQA.length > 0) {
      if (
        extractedQA[0].quizType !== 'ToF' 
        ) {
          failCountDefault(2, "")
        } else {
          failCountDefault(1, "")
        }
      }
      
      socket.emit('next_turn', {nextUser, room});
      socket.emit('updated_question_index', {questionIndex: 0, room });
      socket.emit("selected_choice", {room, selectedChoiceVal: ""})
      socket.emit('update_time_review', { room: room, timeDurationValReview: 20 });
      
    socket.emit("update_is_running_review", { room, isRunningReview: true });
    socket.emit('updated_items_done', {itemsDone: 0, room });

  }

  const resetAndStudy = () => {
    let updatedUserList = userList.map((user) => ({
      ...user,
      points: 0,
    }));
    
    setUserList(updatedUserList);
    setIsRunningReview(true)
    setItemsDone(0)

          
    setSelectedChoice("")
    setRemainingHints(3)
    setCurrentCount(20)


    socket.emit('next_turn', { nextUser: 0, room });
    socket.emit('updated_question_index', { questionIndex: 0, room });
    socket.emit('updated_userlist', { room, userList: updatedUserList });


    socket.emit("selected_choice", {room, selectedChoiceVal: ""})
    socket.emit('update_time_review', { room: room, timeDurationValReview: 20 });

    
    if (Array.isArray(extractedQA) && extractedQA.length > 0) {
      if (
        extractedQA[0].quizType !== 'ToF' 
      ) {
        failCountDefault(2, "")
      } else {
        failCountDefault(1, "")
      }
    }


    socket.emit("update_is_running_review", { room, isRunningReview: true });
    socket.emit('updated_items_done', {itemsDone: 0, room });
  }


  const checkIfDone = () => {
    setIsRunningReview(false)
    socket.emit("update_is_running_review", { room, isRunningReview: false });
  }



  const nextUser = () => {

    let itemsDoneVal = itemsDone + 1;
    setItemsDone(itemsDoneVal)
    socket.emit('updated_items_done', {itemsDone: itemsDoneVal, room });

    if (itemsLength !== itemsDoneVal) {      

      otherUserFunctionalities()

    } else {
      checkIfDone()
    }


  }


  const failedItem = () => {
    setTimeout(() => {

      setLostPoints(true);
      setSubmittedAnswer("");
      setDisabledSubmitButton(true)
      setDisabledSubmitButton(true)
      responseStateUpdate(extractedQA[questionIndex].id, "Wrong")
      

      socket.emit("updated_lost_points", { room, lostPoints: true });
      socket.emit("update_is_running_review", { room, isRunningReview: false });

    }, 100);


    
    setTimeout(() => {
      const updatedUserList = userList.map((userData, index) => {
        if (index !== userTurn) {
          userData.points += 5;
        } else {
          if (userData.points <= 0) {
            userData.points = 0;
          } else {
            userData.points = Math.max(0, userData.points - 3);
          }
        }
        return userData;
      });
  
      socket.emit("updated_userlist", { room, userList: updatedUserList });
      setUserList(updatedUserList);
      setDisabledSubmitButton(false)
      socket.emit("updated_lost_points", { room, lostPoints: false });
      socket.emit("update_is_running_review", { room, isRunningReview: true });
      nextUser();
      setDisabledSubmitButton(false)
      setLostPoints(false);



    }, 2500);
  }





  const submitAnswer = () => {
    if(selectedChoice === extractedQA[questionIndex].answer){

      setTimeout(() => {
        setGainedPoints(true);
        setDisabledSubmitButton(true)
        setDisabledSubmitButton(true)
        responseStateUpdate(extractedQA[questionIndex].id, "Correct")

        socket.emit("updated_gained_points", { room, gainedPoints: true });
        socket.emit("update_is_running_review", { room, isRunningReview: false });

        
      }, 100);
      
      setTimeout(() => {
        setGainedPoints(false);
        socket.emit("updated_gained_points", { room, gainedPoints: false });
        setSubmittedAnswer("")
        setRemainingHints(3)
        userList[userTurn].points += 5;
        socket.emit("updated_userlist", {room, userList});
        setUserList(userList)
        // setIsRunningReview(true)
        socket.emit("update_is_running_review", { room, isRunningReview: true });
        nextUser()
        setDisabledSubmitButton(false)

  
      }, 2500);

    } else {

      if (Array.isArray(extractedQA) && extractedQA.length > 0) {
        if (
          extractedQA[questionIndex].quizType === 'ToF'
        ) {
          failCountDefault(1, "")
          failedItem()
        } else {
          if(failCount !== 0 && secondsReview !== 0) {
            // failCountDefault(2, "")
            let currentFailCount = failCount - 1
            failCountDefault(currentFailCount, "")

            if (currentFailCount === 0) {
              failedItem()
            }

          } else {
            failedItem()
          }
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



  function generateRandomString() {
    const letters = 'aBcDeFgHiJkLmNoPqRsTuVwXyZ';
    const numbers = '0123456789';
  
    let randomString = '';
  
    // Generate 3 random letters
    for (let i = 0; i < 3; i++) {
      const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
      randomString += randomLetter;
    }
    
    // Generate 4 random numbers
    for (let i = 0; i < 3; i++) {
      const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
      randomString += randomNumber;
    }
    
    // Generate 5 random letters
    for (let i = 0; i < 3; i++) {
      const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
      randomString += randomLetter;
    }
    return randomString;
  }


  const startStudySessionBtn = async () => {
    setIsStartStudyButtonStarted(true)
    socket.emit('updated_study_session_started', { isStarted: true, room })

    await axios.put(`${SERVER_URL}/studyMaterial/update-data/${materialId}`, {
      isStarted: 'true',
      codeDashTrackingNum: generateRandomString(),
    });
  }


  
  useEffect(() => {

    let interval;
    if (isRunningReview && secondsReview > 0 && userList.length > 1 && isStartStudyButtonStarted) {
      interval = setInterval(() => {

        setSecondsReview(prevSeconds => {
          const updatedSeconds = prevSeconds - 1;
          socket.emit('update_time_review', { room: room, timeDurationValReview: updatedSeconds });
          return updatedSeconds;
        });

        
        socket.on("updated_time_review", (time) => {
          setSecondsReview(time);
        });
        
        
        
      }, 1000);
    } else if (secondsReview <= 0 && isRunningReview) {
      setIsRunning(false);
      submitAnswer()


            

      }
  
    return () => clearInterval(interval);
  }, [room, isRunningReview, secondsReview, userList.length, isStartStudyButtonStarted]);
  
  const sendMessageReview = async () => {
    let data = {
      room: room,
      userId: userId,
      author: userData?.username,
      message: messageReview,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
    }

    if (messageReview !== '') {
      await socket.emit('sent_messages_review', data)
    }

    setMessageReview('')
  }


  const leaveReviewerPageRoom = () => {
    const userIndex = userList.findIndex(user => user.userId === userId);
    const userSocketId = userList[userIndex].socketId;


    // Emit socket event indicating user is leaving
    socket.emit('leave-reviewer-page-room', { room, socketId: userSocketId });
    setShowPreJoin(true)
    setIsJoined(false)
    setShowAssessmentPage(false)

    setSuccessfullyInviting(false)
    setSuccessfullyInvited(false)
  };


  return (
    <div className=''>
        {sessionExpired ? (
          <div>
            <p className='pt-5 text-xl text-center'>Your session has expired due to inactivity. Please refresh the page to start a new session.</p>

          </div>
        ) : (
          <div>
              <div>

                {showPreJoin && (
                  <PreJoinPage joinRoom={joinRoom} materialId={materialId} groupId={groupId} setShowPreJoin={setShowPreJoin} setShowAssessmentPage={setShowAssessmentPage} room={room} assessementRoom={assessementRoom} username={userData?.username} userId={userId} userListAssessment={userListAssessment} setUserListAssessment={setUserListAssessment} selectedAssessmentAnswer={selectedAssessmentAnswer} setSelectedAssessmentAnswer={setSelectedAssessmentAnswer} isRunning={isRunning} setIsRunning={setIsRunning} seconds={seconds} setSeconds={setSeconds} itemCount={itemCount} setQA={setQA} extractedQA={extractedQA} shuffledChoices={shuffledChoices} setShuffledChoices={setShuffledChoices} isSubmittedButtonClicked={isSubmittedButtonClicked} setIsSubmittedButtonClicked={setIsSubmittedButtonClicked} idOfWhoSubmitted={idOfWhoSubmitted} setIdOfWhoSubmitted={setIdOfWhoSubmitted} usernameOfWhoSubmitted={usernameOfWhoSubmitted} setUsernameOfWhoSubmitted={setUsernameOfWhoSubmitted} score={score} setScore={setScore} isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} isAssessmentDone={isAssessmentDone} setIsAssessmentDone={setIsAssessmentDone} showSubmittedAnswerModal={showSubmittedAnswerModal} setShowSubmittedAnswerModal={setShowSubmittedAnswerModal} showTexts={showTexts} setShowTexts={setShowTexts} showAnalysis={showAnalysis} setShowAnalysis={setShowAnalysis} showAssessment={showAssessment} setShowAssessment={setShowAssessment} overAllItems={overAllItems} setOverAllItems={setOverAllItems} preAssessmentScore={preAssessmentScore} setPreAssessmentScore={setPreAssessmentScore} assessmentScore={assessmentScore} setAssessmentScore={setAssessmentScore} assessmentImp={assessmentImp} setAssessmentImp={setAssessmentImp} assessmentScorePerf={assessmentScorePerf} setAssessmentScorePerf={setAssessmentScorePerf} completionTime={completionTime} setCompletionTime={setCompletionTime} confidenceLevel={confidenceLevel} setConfidenceLevel={setConfidenceLevel} overAllPerformance={overAllPerformance} setOverAllPerformance={setOverAllPerformance} assessmentCountMoreThanOne={assessmentCountMoreThanOne} setAssessmentCountMoreThanOne={setAssessmentCountMoreThanOne} generatedAnalysis={generatedAnalysis} setGeneratedAnalysis={setGeneratedAnalysis} extractedQAAssessment={extractedQAAssessment} setQAAssessment={setQAAssessment} shuffledChoicesAssessment={shuffledChoicesAssessment} setShuffledChoicesAssessment={setShuffledChoicesAssessment} assessmentUsersChoices={assessmentUsersChoices} setAssessmentUsersChoices={setAssessmentUsersChoices} message={message} setMessage={setMessage} messageList={messageList} setMessageList={setMessageList} isStartAssessmentButtonStarted={isStartAssessmentButtonStarted} setIsStartAssessmentButtonStarted={setIsStartAssessmentButtonStarted} />
                )}
 
                {showAssessmentPage && (
                  <AssessmentPage groupId={groupId} materialId={materialId} setShowAssessmentPage={setShowAssessmentPage} userListAssessment={userListAssessment} setUserListAssessment={setUserListAssessment} room={room} assessementRoom={assessementRoom} username={userData?.username} userId={userId} selectedAssessmentAnswer={selectedAssessmentAnswer} setSelectedAssessmentAnswer={setSelectedAssessmentAnswer} isRunning={isRunning} setIsRunning={setIsRunning} seconds={seconds} setSeconds={setSeconds} setQA={setQA} extractedQA={extractedQA} shuffledChoices={shuffledChoices} setShuffledChoices={setShuffledChoices} isSubmittedButtonClicked={isSubmittedButtonClicked} setIsSubmittedButtonClicked={setIsSubmittedButtonClicked} idOfWhoSubmitted={idOfWhoSubmitted} setIdOfWhoSubmitted={setIdOfWhoSubmitted} usernameOfWhoSubmitted={usernameOfWhoSubmitted} setUsernameOfWhoSubmitted={setUsernameOfWhoSubmitted} score={score} setScore={setScore} isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} isAssessmentDone={isAssessmentDone} setIsAssessmentDone={setIsAssessmentDone} showSubmittedAnswerModal={showSubmittedAnswerModal} setShowSubmittedAnswerModal={setShowSubmittedAnswerModal} showTexts={showTexts} setShowTexts={setShowTexts} showAnalysis={showAnalysis} setShowAnalysis={setShowAnalysis} showAssessment={showAssessment} setShowAssessment={setShowAssessment} overAllItems={overAllItems} setOverAllItems={setOverAllItems} preAssessmentScore={preAssessmentScore} setPreAssessmentScore={setPreAssessmentScore} assessmentScore={assessmentScore} setAssessmentScore={setAssessmentScore} assessmentImp={assessmentImp} setAssessmentImp={setAssessmentImp} assessmentScorePerf={assessmentScorePerf} setAssessmentScorePerf={setAssessmentScorePerf} completionTime={completionTime} setCompletionTime={setCompletionTime} confidenceLevel={confidenceLevel} setConfidenceLevel={setConfidenceLevel} overAllPerformance={overAllPerformance} setOverAllPerformance={setOverAllPerformance} assessmentCountMoreThanOne={assessmentCountMoreThanOne} setAssessmentCountMoreThanOne={setAssessmentCountMoreThanOne} generatedAnalysis={generatedAnalysis} setGeneratedAnalysis={setGeneratedAnalysis} extractedQAAssessment={extractedQAAssessment} setQAAssessment={setQAAssessment} shuffledChoicesAssessment={shuffledChoicesAssessment} setShuffledChoicesAssessment={setShuffledChoicesAssessment} assessmentUsersChoices={assessmentUsersChoices} setAssessmentUsersChoices={setAssessmentUsersChoices} message={message} setMessage={setMessage} messageList={messageList} setMessageList={setMessageList} isStartAssessmentButtonStarted={isStartAssessmentButtonStarted} setIsStartAssessmentButtonStarted={setIsStartAssessmentButtonStarted} setShowPreJoin={setShowPreJoin} setIsJoined={setIsJoined} inviteMembers={inviteMembers} successfullyInvited={successfullyInvited} successfullyInviting={successfullyInviting} />
                )}

                
              </div>

              {isJoined && (
                <div className='poppins w-full flex flex-col items-center min-h-[100vh] mcolor-900'>
                  <div className='w-full'>
                    <div className='flex justify-between'>


                    {/* chat functionality goes here */}
                    <div className='w-1/2 relative fixed mbg-100 shadows rounded min-h-[100vh]'>
                      <div className='flex justify-center'>
                        <div className='h-[65vh] mx-5 rounded fixed w-1/3'>
                          <div>
                            <div className='flex items-center justify-between w-full pb-4 pt-5'>
                              <button className='mbg-200 px-2 py-2 rounded border-thin-800' onClick={() => setHideModalReview('')}>
                                Users 
                                <span className='ml-1 bg-red mcolor-100 px-2 rounded-full'>
                                  {userList.length >= 1000 ? `${(userList.length / 1000).toFixed(0)}k` : userList.length}
                                </span>
                              </button>
                              {isStartStudyButtonStarted && (
                                <button className='bg-red mcolor-100 px-4 py-2 rounded' onClick={leaveReviewerPageRoom}>Leave Room</button>
                              )}
                            </div>


                            <div className={`${hideModalReview} absolute top-0 left-0 modal-bg w-full h-full`} >
                              <div className='flex items-center justify-center h-full'>
                                <div className='mbg-100 max-h-[60vh] w-1/3 relative p-10 rounded-[5px] flex items-center justify-center' style={{ overflowY: 'auto' }}>

                                  <button className='absolute right-4 top-3 text-xl' onClick={() => setHideModalReview('hidden')}>
                                    ✖
                                  </button>

                                  <div className={`w-full`}>
                                    <p className='text-center text-2xl font-medium mcolor-800 mb-5'>Connected Users:</p>

                                    <ul className='grid grid-results col-6 gap-5'>
                                      {userList.map(user => (
                                        <li key={user?.userId} className='shadows flex items-center justify-center py-4 rounded'>
                                          <p><i className="fa-solid fa-circle text-green-500 mr-1"></i> {user?.username.charAt(0).toUpperCase() + user?.username.slice(1)}</p>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* chat functionality */}
                          <div className="chat-window">
                            <div className="chat-header">
                              <p className='px-5'>Live Chat</p>
                            </div>
                            <div className="chat-body">
                              <ScrollToBottom className="message-container">
                                {messageListReview.map((messageContent) => {
                                  return (
                                    <div
                                      className="message"
                                      id={userData?.username === messageContent.author ? "you" : "other"}
                                    >
                                      <div>
                                        <div className="message-content">
                                          <p>{messageContent.message}</p>
                                        </div>
                                        <div className="message-meta">
                                          <p id="time">{messageContent.time}</p>
                                          <p id="author" className='capitalize'>{messageContent.author}</p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </ScrollToBottom>
                            </div>
                            <div className="chat-footer">
                              <input
                                type="text"
                                placeholder="Hey..."
                                value={messageReview}
                                onChange={(event) => {
                                  setMessageReview(event.target.value);
                                }}
                                onKeyPress={(event) => {
                                  event.key === "Enter" && sendMessageReview();
                                }}
                              />
                              <button onClick={sendMessageReview}>&#9658;</button>
                            </div>
                          </div>
              
                        </div>
                      </div>

            
                    </div>

                      
   
                    {/* userlist */}
                    {userList.length > 0 && (
                      <div className={'w-3/4 mx-10 min-h-[100vh] mt-5 mb-16'}>
                        {(userList.length > 1 && isStartStudyButtonStarted) ? 
                          (

                            <div>
                              <div>
                                {(userList.length > 0 && userList[userTurn]?.userId === userId) ? (
                                  <div>
                                    <p className={`mbg-200 mcolor-800 px-5 py-3 rounded-[5px] text-center text-xl ${(userList.length > 0 && userList[userTurn]?.userId === userId) ? 'font-bold' : 'font-bold'}`}>{userList[userTurn]?.userId !== userId ? `${userList[userTurn]?.username.charAt(0).toUpperCase() + userList[userTurn]?.username.slice(1)}'s turn`: 'YOUR TURN'}</p>


    
                                    {(isRunningReview === true) && (
                                      <div className='timer-container px-10 py-3'>
                                        <div className='rounded-[5px]' style={{ height: "5px", backgroundColor: "#B3C5D4" }}>
                                          <div
                                            className='rounded-[5px]'
                                            style={{
                                              width: `${(secondsReview / (20)) * 100}%`,
                                              height: "100%",
                                              backgroundColor: secondsReview <= 10 ? "#af4242" : "#667F93", 
                                            }}
                                            />
                                        </div>

                                        <h1 className='mcolor-900 text-sm pt-1'>
                                          Remaining time:{' '}
                                          {secondsReview} seconds
                                        </h1>
                                      </div>
                                    )}

                                    {extractedQA && extractedQA.length > 0 ? (
                                      <div>

                                        {/* question */}
                                        <div className='flex items-center justify-between gap-4 mt-4 pb-8 text-center text-xl font-medium text-xl mcolor-900'>
                                        <div className={`w-full mbg-300 mcolor-900 px-10 pt-5 pb-8 w-full rounded-[5px] mcolor-800`} >
                                            <p className='mcolor-800 text-lg font-medium text-start'>Type: {
                                              (extractedQA[questionIndex].quizType === 'ToF' && 'True or False') ||
                                              (extractedQA[questionIndex].quizType === 'FITB' && 'Fill In The Blanks') ||
                                              (extractedQA[questionIndex].quizType === 'Identification' && 'Identification') ||
                                              (extractedQA[questionIndex].quizType === 'MCQA' && 'MCQA')
                                            }</p>

                                            { (extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB') && (
                                              <div>
                                                <p className='mcolor-800 text-lg mt-2 font-medium  top-10 left-5'>Remaining Hints: {remainingHints}</p>
                                                <button className='mcolor-800 mbg-200 border-thin-800 rounded-[5px] px-2 py-1 text-lg mt-2 font-medium  bottom-5 left-5' onClick={giveHint}>Use hint</button>
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
                                                className={`dragHere w-1/2 h-[12vh] rounded-[5px] bottom-14 flex justify-center items-center px-10 mbg-100 ${borderMedium}`}
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


                                    {extractedQA && extractedQA.length > 0 && extractedQA[questionIndex] && (
                                      <div>
            
                                        {(failCount === 2 || failCount === 1 || failCount === 0) && lostPoints === true && (
                                          <div className='text-red text-lg text-center mb-3'>{selectedChoice === '' ? 'No answer.' : (extractedQA[questionIndex].quizType !== 'MCQA' && userList[userTurn]?.points > 0) ? 'Wrong. You lost 3 points' : 'Wrong answer.'}</div>
                                        )}

                                        {gainedPoints === true && (
                                          <div className='text-emerald-500 text-lg text-center mb-1'>Correct! You earned 5 points</div>
                                        )}

                                        {(failCount < 2 && (extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB')) && lostPoints === false && gainedPoints === false && (
                                          <p className='pb-5 pt-2 text-center font-normal text-lg mcolor-800'>{userList[userTurn]?.userId !== userId ? `${userList[userTurn]?.username.charAt(0).toUpperCase() + userList[userTurn]?.username.slice(1)}`: 'You'} submitted a wrong answer. {failCount} chance left
                                          </p>
                                        )}


                                        {(selectedChoice !== "" && (extractedQA[questionIndex].quizType === 'MCQA' || extractedQA[questionIndex].quizType === 'ToF')) && 
                                          <div>

                                            {/* {failCount === 0 && (
                                              <p className='pb-4 font-normal text-lg text-red text-center'>Failed to answer</p>
                                            )} */}
                                            
                                            {failCount < 2 && extractedQA[questionIndex].quizType !== 'ToF' && lostPoints === false && gainedPoints === false && (
                                              <p className='pb-5 pt-4 text-center font-normal text-lg mcolor-800'>{userList[userTurn]?.userId !== userId ? `${userList[userTurn]?.username.charAt(0).toUpperCase() + userList[userTurn]?.username.slice(1)}`: 'You'} selected <span className='font-bold'>{selectedChoice}</span> - {failCount} chance left
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

                                        {disableSubmitButton === false && (
                                          <div className='flex justify-center mt-8'>
                                            <button className='w-1/2 py-2 px-5 mbg-700 rounded-[5px] mcolor-100 text-lg' onClick={submitAnswer}>Submit Answer</button>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                  </div>
                                ) : (
                                  <div>
                                    <p className={`mbg-200 mcolor-800 px-5 py-3 rounded-[5px] text-center text-xl ${(userList.length > 0 && userList[userTurn]?.userId === userId) ? 'font-bold' : 'font-bold'}`}>{userList[userTurn]?.userId !== userId ? `${userList[userTurn]?.username.charAt(0).toUpperCase() + userList[userTurn]?.username.slice(1)}'s turn`: 'YOUR TURN'}</p>


                                    {(isRunningReview === true) && (
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
                                
                                    {extractedQA && extractedQA.length > 0 ? (
                                      <div>

                                        {/* question */}
                                        <div className='flex items-center justify-between gap-4 mt-4 pb-8 text-center text-xl font-medium text-xl mcolor-900'>
                                          <div className={`w-full mbg-300 mcolor-900 px-10 pt-5 pb-8 w-full rounded-[5px] mcolor-800`} >
                                            <p className='mcolor-800 text-lg font-medium text-start'>Type: {
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
                                                className={`dragHere w-1/2 h-[12vh] rounded-[5px] flex justify-center items-center px-10 mbg-100 ${borderMedium}`}
                                                onDrop={handleDrop}
                                                onDragOver={handleDragOver}
                                              >


                                                  {/* answer */}
                                                  <div className='text-center'>
                                                    {(extractedQA[questionIndex].quizType === 'MCQA' || extractedQA[questionIndex].quizType === 'ToF') && (
                                                      <p className={`py-7 ${selectedChoice === '' ? 'mcolor-400' : 'mcolor-900'}`}>{selectedChoice === '' ? `${userList[userTurn]?.userId !== userId ? `${userList[userTurn]?.username.charAt(0).toUpperCase() + userList[userTurn]?.username.slice(1)}'s answer goes here`: 'your answer goes here'}` : selectedChoice}</p>

                                                    )}


                                                    {(extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB') && (
                                                      <input type="text" placeholder={`${selectedChoice === '' ? `${userList[userTurn]?.userId !== userId ? `${userList[userTurn]?.username.charAt(0).toUpperCase() + userList[userTurn]?.username.slice(1)}'s answer goes here`: 'your answer goes here'}` : selectedChoice}`} className='w-full h-full text-center py-5 my-2' readOnly value={selectedChoice || ''} onChange={(event) => {
                                                        setSelectedChoice(event.target.value)
                                                      }} style={{ height: '100%' }} />
                                                    )}

                                                  </div>
                                              </div>
                                            </div>
                                          </div>



                                        </div>

                                        {(failCount === 2 || failCount === 1 || failCount === 0) && lostPoints === true && (
                                          <div className='text-emerald-500 text-lg text-center mb-1'>
                                            You have gained 5 points as a result of {userList[userTurn]?.username}'s incorrect answer.
                                          </div>
                                        )}

                                        {gainedPoints === true && (
                                          <div className='text-emerald-500 text-lg text-center mb-1'>{userList[userTurn]?.username} earned 5 points</div>
                                        )}

                                        {(selectedChoice !== "" && (extractedQA[questionIndex].quizType === 'MCQA' || extractedQA[questionIndex].quizType === 'ToF')) && 
                                          <div>
      
                                            {failCount < 2 && extractedQA[questionIndex].quizType === 'MCQA' && lostPoints === false && gainedPoints === false && (
                                              <p className='pb-5 pt-4 text-center font-normal text-lg mcolor-800'>{userList[userTurn]?.userId !== userId ? `${userList[userTurn]?.username.charAt(0).toUpperCase() + userList[userTurn]?.username.slice(1)}`: 'You'} selected <span className='font-bold'>{selectedChoice}</span> - {failCount} chance left
                                              </p>
                                            )}
                                          
                                          </div>
                                        }

                                        {(failCount <= 2 && selectedChoice !== '' && (extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB')) && lostPoints === false && gainedPoints === false &&  (
                                          <p className={`pb-5 pt-4 text-center font-normal text-lg ${selectedChoice === extractedQA[questionIndex].answer ? 'text-emerald-500' : 'text-red'}`}>{userList[userTurn]?.userId !== userId ? `${userList[userTurn]?.username.charAt(0).toUpperCase() + userList[userTurn]?.username.slice(1)} is`: 'You are'} typing a {selectedChoice === extractedQA[questionIndex].answer ? 'correct' : 'wrong'} answer...
                                          </p>
                                        )}

                                        {(failCount < 2 && (extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB')) && lostPoints === false && gainedPoints === false && (
                                          <p className='pb-5 pt-2 text-center font-normal text-lg mcolor-800'>{userList[userTurn]?.userId !== userId ? `${userList[userTurn]?.username.charAt(0).toUpperCase() + userList[userTurn]?.username.slice(1)}`: 'You'} submitted a wrong answer. {failCount} chance left
                                          </p>
                                        )}
                                            

                                        {extractedQA[questionIndex].quizType === 'MCQA' && (
                                          <ul className='grid-result gap-4'>
                                            {shuffledChoices && shuffledChoices[questionIndex].map((choice, index) => {
                                              return (
                                                <li
                                                  className={`${choice === selectedChoice ? choice === extractedQA[questionIndex].answer ? 'mbg-700 mcolor-100' : 'bg-red mcolor-100' : "mbg-200 mcolor-800"} px-5 py-3 text-xl text-center choice border-thin-800 rounded-[5px]`}
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
                                              className={`${'True' === selectedChoice ? 'True' === extractedQA[questionIndex].answer ? 'mbg-700 mcolor-100' : 'bg-red mcolor-100' : "mbg-200 mcolor-800"} px-5 py-3 text-xl text-center choice border-thin-800 rounded-[5px]`}
                                              key={1}
                                            >
                                              {'True'}
                                            </li>
                                            <li
                                              className={`${'False' === selectedChoice ? 'False' === extractedQA[questionIndex].answer ? 'mbg-700 mcolor-100' : 'bg-red mcolor-100' : "mbg-200 mcolor-800"} px-5 py-3 text-xl text-center choice border-thin-800 rounded-[5px]`}
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
                                )}
                              </div>

                              {/* modal */}
                              {itemsLength === itemsDone && (
                                <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                                  <div className='flex items-center justify-center h-full'>
                                    <div className='relative mbg-100 min-h-[75vh] w-1/2 z-10 relative p-10 rounded-[5px]'>

                                      <p className='text-lg mcolor-900 font-medium mb-5'>Leaderboard</p>  

                                      <div className='flex items-center justify-between mb-5 gap-5'>
                                        <button onClick={resetAndStudy} className='w-1/2 py-2 rounded mcolor-900 mbg-200 border-thin-800'>Reset Points & Study Again</button>
                                        <button onClick={studyAgain} className='w-1/2 py-2 rounded mcolor-100 mbg-700'>Study Again</button>
                                      </div>

                                      <div className='flex items-center justify-between px-3 mb-3 mcolor-800'>
                                        <span>Users</span>
                                        <span className='mr-4'>Scores</span>
                                      </div>
                                      <ul>
                                        {[...userList]
                                          .sort((a, b) => b.points - a.points)
                                          .map((user, index) => {
                                            let medalClass = ''; 

                                            if (user.points === userScores[0]) {
                                              medalClass = 'gold-medal'
                                            } else if (user.points === userScores[1]) {
                                              medalClass = 'silver-medal'
                                            } else if (user.points === userScores[2]) {
                                              medalClass = 'bronze-medal'
                                            }

                                    
                                            return (
                                              <li key={user.userId} className='mb-4'>
                                                <p className={`mbg-200 shadows p-3 flex justify-between items-center font-medium rounded mcolor-800`}>
                                                  <span>
                                                    <WorkspacePremiumIcon fontSize="large" className={`mr-3 ${user.points !== 0 ? medalClass : ''}`} />
                                                    <span className='text-xl pt-3'>
                                                      {user.username.charAt(0).toUpperCase() + user.username.slice(1)}:{" "}
                                                    </span>
                                                  </span>
                                                  <span className='mr-4'>
                                                    {user.points} {user.points > 1 ? 'points' : 'point'}
                                                  </span>
                                                </p>
                                              </li>
                                            );
                                          })}
                                      </ul>




                                    
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>


                            


                          ) : (

                            <div className='w-full'>
                              <button className='mt-5 px-5 py-2 rounded border-thin-800 mbg-100 shadows' disabled={successfullyInviting || successfullyInvited} onClick={() => inviteMembers("study session")} >{successfullyInviting ? `Sending an invitation link...` : successfullyInvited ? `Successfully sent an invitation link` : `Invite other members to join`}</button>
                          

                              <div className='flex items-center justify-between mt-8'>
                                

                                <p className='text-xl text-center mcolor-800 py-3'>Waiting for other users to join...</p>



                                <div className='flex justify-center'>
                                {userList && userList.length > 1 && userList[0] && userList[0].userId === userId && (
                                  <button className='mbg-700 mcolor-100 px-4 py-2 rounded' onClick={startStudySessionBtn}>Start Assessment</button>
                                  )}
                                  {!isStartStudyButtonStarted && (
                                    <button className='bg-red mcolor-100 px-4 py-2 rounded ml-3' onClick={leaveReviewerPageRoom}>Leave Room</button>
                                  )}
                                </div>
                              </div>
                              <div className='my-5'>
                                <ul className='grid grid-cols-3 gap-5'>
                                  {userList && userList.map(user => (
                                    <li key={user?.userId} className={`text-xl text-center ${user?.userId === userList[0]?.userId ? 'mbg-700 mcolor-100' : 'mcolor-900 '} shadows p-5 rounded`}>
                                      <i className={`fa-solid fa-user ${user?.userId === userList[0]?.userId ? 'mbg-700 mcolor-100' : 'mcolor-700'}`} style={{ fontSize: '35px' }}></i> 
                                      <p>{user?.username.charAt(0).toUpperCase() + user?.username.slice(1)}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                          </div>
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