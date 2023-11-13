const express = require('express');
const app = express();
const db = require('./models');
const cors = require('cors'); 
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

app.use(express.static(path.join(__dirname, 'client/build')));


let rooms = {};
let userTurnSer = 0;
let nextQA = 0;
let question_index = 0
let shuffledChoicesVal = []
let selectedChoiceValCurr = '';
let questionValCurr = '';
let currentFailCountVal = 0;
let submittedAnswerValCurr = "";
let userListValExt = []

let reviewShuffledChoices = {}
let reviewUserTurnSer = {}
let reviewSelectedChoiceValCurr = {}
let reviewFailCount = {}
let reviewNextQA = {}
let reviewQuestionIndex = {}



// assessment
let assessmentRoomList = {};
let ioSelectedAssessmentAnswers = {}
let isRunningList = {}
let setSeconds = {}
let isSubmittedButtonClicked = {}
let idOfWhoSubmittedPerson = {}
let usernameOfWhoSubmittedPerson = {}
let assessmentScores = {}
let isSubmittedAssess = {}
let isAssessmentDoneList = {}
let showSubmittedAnswerModalList = {}
let showTextsList = {}
let showAnalysisList = {}
let showAssessmentList = {}







io.on('connection', (socket) => {
  socket.on('join_room', (data) => {
    const { room, username, userId, points, questionIndex, shuffledChoices, userList, failCount } = data;
    socket.join(room);
  
    // Initialize arrays for the room if they don't exist
    if (!rooms[room]) {
      rooms[room] = [];
    }
    if (!reviewShuffledChoices[room]) {
      reviewShuffledChoices[room] = [];
    }
    if (!reviewUserTurnSer[room]) {
      reviewUserTurnSer[room] = [];
    }
    if (!reviewSelectedChoiceValCurr[room]) {
      reviewSelectedChoiceValCurr[room] = [];
    }
    if (!reviewFailCount[room]) {
      reviewFailCount[room] = [];
    }
    if (!reviewNextQA[room]) {
      reviewNextQA[room] = [];
    }
    if (!reviewQuestionIndex[room]) {
      reviewQuestionIndex[room] = [];
    }

  
    // Add user to the room's user list
    rooms[room].push({ socketId: socket.id, username, userId, points });

    // Only push new user's data if arrays are empty
    if (reviewShuffledChoices[room].length === 0) {
      reviewShuffledChoices[room].push([...shuffledChoices]);
    }
    if (reviewUserTurnSer[room].length === 0) {
      reviewUserTurnSer[room].push(Number(userTurnSer));
    }
    if (reviewSelectedChoiceValCurr[room].length === 0) {
      reviewSelectedChoiceValCurr[room].push(selectedChoiceValCurr.toString());
    }
    if (reviewFailCount[room].length === 0) {
      reviewFailCount[room].push(Number(failCount));
    }
    if (reviewNextQA[room].length === 0) {
      reviewNextQA[room].push(Number(nextQA));
    }
    if (reviewQuestionIndex[room].length === 0) {
      reviewQuestionIndex[room].push(questionIndex);
    }

  
    // Emit the updated user list and current turn to all clients in the room
    io.to(room).emit('userList', rooms[room]);
    io.to(room).emit('received_next_user_join', reviewUserTurnSer[room]);
    io.to(room).emit('received_selected_choice_join', reviewSelectedChoiceValCurr[room]);
    io.to(room).emit('received_current_fail_val', reviewFailCount[room]);
    io.to(room).emit('next_qa_join', reviewNextQA[room]);
    io.to(room).emit('current_QA_index', reviewQuestionIndex[room]);
    io.to(room).emit('shuffled_join', reviewShuffledChoices[room]);
  

  });


  socket.on('next_turn', ({ nextUser, room }) => {
    // Determine the next turn and emit it to all clients in the room
    // const usersInRoom = rooms[room];
    // const currentTurn = usersInRoom.findIndex(user => user.socketId === socket.id);
    const nextTurn = nextUser;

    io.to(room).emit('received_next_user', nextTurn);
    reviewUserTurnSer[room] = nextTurn;
  });
  
  socket.on('next_qa', ({ questionIndexVal, room, studyMaterialsLength }) => {
    io.to(room).emit('received_next_qa', questionIndexVal);
    reviewNextQA[room] = questionIndexVal;
  });
  
  socket.on('shuffled_choices', ({ room, shuffledArray }) => {
    io.to(room).emit('received_shuffled_choices', shuffledArray);
    reviewShuffledChoices[room] = shuffledArray;
  });
  
  socket.on('current_QA_index_rec', ({ questionIndex, room }) => {
    io.to(room).emit('received_next_qa', nextQuestion);
    reviewQuestionIndex[room] = questionIndex;
  });

  socket.on("user_zero", ({userTurn, questionIndex, room}) => {
    io.to(room).emit('received_next_user_zero', {userTurnSer, questionIndex})
    reviewUserTurnSer[room] = userTurn;
    reviewQuestionIndex[room] = questionIndex;
  })


  socket.on("user_list", ({userListCount, room}) => {
    if(userListCount === 1){
      let userTurnCurr = 0
      io.to(room).emit("user_turn_disc", userTurnCurr)
      reviewUserTurnSer[room] = userTurnCurr
    }
  })

  socket.on("selected_choice", ({room, selectedChoiceVal}) => {
    io.to(room).emit("received_selected_choice", selectedChoiceVal)
    reviewSelectedChoiceValCurr[room] = selectedChoiceVal
  })

  socket.on('update_QA_data', (updatedData) => {
    io.emit('update_QA_data', updatedData);
  });

  socket.on("updated_userlist", ({room, userList}) => {
    io.to(room).emit("received_updated_userlist", userList)
    rooms[room] = userList
  })




  // to be repaired later
  socket.on("submitted_answer", ({room, currentFailCount, submittedAnswerVal}) => {
    io.to(room).emit("received_submitted_answer", {currentFailCount, submittedAnswerVal})
    currentFailCountVal = currentFailCount;
    submittedAnswerValCurr = submittedAnswerVal;
  })














// assessment sockets
  socket.on('join_assessment_room', (data) => {
    const {
      room,
      username,
      userId,
      selectedAssessmentAnswers,
      timeDurationVal,
      isAnswersSubmitted,
      idOfWhoSubmitted,
      assessmentScore,
      isSubmittedChar,
      isAssessmentDone,
      isRunning,
      showSubmittedAnswerModal,
      showTexts,
      showAnalysis,
      showAssessment
    } = data;
    socket.join(room);

    if (!assessmentRoomList[room]) {
      assessmentRoomList[room] = [];
    }

    if (!ioSelectedAssessmentAnswers[room]) {
      ioSelectedAssessmentAnswers[room] = [];
    }

    if (!isRunningList[room]) {
      isRunningList[room] = false;
    }

    if (!setSeconds[room]) {
      setSeconds[room] = 0;
    }

    if (!isSubmittedButtonClicked[room]) {
      isSubmittedButtonClicked[room] = false;
    }

    if (!idOfWhoSubmittedPerson[room]) {
      idOfWhoSubmittedPerson[room] = '';
    }

    if (!usernameOfWhoSubmittedPerson[room]) {
      usernameOfWhoSubmittedPerson[room] = '';
    }

    if (!assessmentScores[room]) {
      assessmentScores[room] = 0;
    }

    if (!isSubmittedAssess[room]) {
      isSubmittedAssess[room] = false;
    }

    if (!isAssessmentDoneList[room]) {
      isAssessmentDoneList[room] = false;
    }

    if (!showSubmittedAnswerModalList[room]) {
      showSubmittedAnswerModalList[room] = false;
    }

    if (!showTextsList[room]) {
      showTextsList[room] = true;
    }

    if (!showAnalysisList[room]) {
      showAnalysisList[room] = false;
    }

    if (!showAssessmentList[room]) {
      showAssessmentList[room] = true;
    }




    // Add user to the room's user list
    assessmentRoomList[room].push({ socketId: socket.id, username, userId });

    if (ioSelectedAssessmentAnswers[room].length === 0) {
      ioSelectedAssessmentAnswers[room].push(selectedAssessmentAnswers);
    }

    if (isSubmittedAssess[room] === false) {
      isSubmittedAssess[room] = isSubmittedChar;
    }

    if (idOfWhoSubmittedPerson[room] === '') {
      idOfWhoSubmittedPerson[room] = idOfWhoSubmitted;
      idOfWhoSubmittedPerson[room] = idOfWhoSubmitted;
    }

    if (usernameOfWhoSubmittedPerson[room] === '') {
      usernameOfWhoSubmittedPerson[room] = idOfWhoSubmitted;
    }
    
    if (assessmentScores[room] === 0) {
      assessmentScores[room] = assessmentScore;
    }
    
    if (isAssessmentDoneList[room] === false) {
      isAssessmentDoneList[room] = isAssessmentDone;
    }
    
    if (showSubmittedAnswerModalList[room] === false) {
      showSubmittedAnswerModalList[room] = showSubmittedAnswerModal;
    }
    
    if (showTextsList[room] === true) {
      showTextsList[room] = showTexts;
    }
    
    if (showAnalysisList[room] === false) {
      showAnalysisList[room] = showAnalysis;
    }
    
    if (showAssessmentList[room] === true) {
      showAssessmentList[room] = showAssessment;
    }



    if (isRunningList[room] === false) {
      isRunningList[room] = isRunning;
      setSeconds[room] = timeDurationVal;
      io.to(room).emit('updated_time', setSeconds[room]);
      io.to(room).emit('is_running', isRunningList[room]);
    } else {
      io.to(room).emit('updated_time', setSeconds[room]);
      io.to(room).emit('is_running', isRunningList[room]);
    }

    if (isSubmittedButtonClicked[room] === false) {
      isSubmittedButtonClicked[room] = isAnswersSubmitted;
      io.to(room).emit('submitted_button_response', isSubmittedButtonClicked[room]);
    } else {
      io.to(room).emit('submitted_button_response', isSubmittedButtonClicked[room]);
    }

    // Emit the updated user list and current turn to all clients in the room
    io.to(room).emit('assessment_user_list', assessmentRoomList[room]);
    io.to(room).emit('selected_assessment_answers', ioSelectedAssessmentAnswers[room]);
    io.to(room).emit('id_of_who_submitted', idOfWhoSubmittedPerson[room]);
    io.to(room).emit('username_of_who_submitted', usernameOfWhoSubmittedPerson[room]);
    io.to(room).emit('assessment_score', assessmentScores[room]);
    io.to(room).emit('isSubmitted_assess', isSubmittedAssess[room]);
    io.to(room).emit('isAssessment_done', isAssessmentDoneList[room]);
    io.to(room).emit('show_submitted_answer_modal', showSubmittedAnswerModalList[room]);
    io.to(room).emit('show_texts', showTextsList[room]);
    io.to(room).emit('show_analysis', showAnalysisList[room]);
    io.to(room).emit('show_assessment', showAssessmentList[room]);

  });






  socket.on("updated_show_analysis", (data) => {
    const {room, showAnalysis } = data
    showAnalysisList[room] = showAnalysis;
    io.to(room).emit("show_analysis", showAnalysisList[room])
  })


  socket.on("updated_show_assessment", (data) => {
    const {room, showAssessment } = data
    showAssessmentList[room] = showAssessment;
    io.to(room).emit("show_assessment", showAssessmentList[room])
  })


  socket.on("updated_show_texts", (data) => {
    const {room, showTexts } = data
    showTextsList[room] = showTexts;
    io.to(room).emit("show_texts", showTextsList[room])
  })

  socket.on("updated_show_submitted_answer_modal", (data) => {
    const {room, showSubmittedAnswerModal } = data
    showSubmittedAnswerModalList[room] = showSubmittedAnswerModal;
    io.to(room).emit("show_submitted_answer_modal", showSubmittedAnswerModalList[room])
  })
  

  socket.on("updated_isAssessment_done", (data) => {
    const {room, isAssessmentDone } = data
    isAssessmentDoneList[room] = isAssessmentDone;
    io.to(room).emit("isAssessment_done", isAssessmentDoneList[room])
  })
  
  socket.on("updated_running", (data) => {
    const {room, isRunning } = data
    isRunningList[room] = isRunning;
    io.to(room).emit("is_running", isRunningList[room])
  })
  
  
  socket.on("updated_isSubmitted_assess", (data) => {
    const {room, isSubmittedChar } = data
    isSubmittedAssess[room] = isSubmittedChar;
    io.to(room).emit("isSubmitted_assess", isSubmittedAssess[room])
  })

  socket.on('updated_id_of_who_submitted', (data) => {
    const { room, idOfWhoSubmitted } = data;

    idOfWhoSubmittedPerson[room] = idOfWhoSubmitted;
    io.to(room).emit('id_of_who_submitted', idOfWhoSubmittedPerson[room]);

  });

  socket.on('updated_username_of_who_submitted', (data) => {
    const { room, usernameOfWhoSubmitted } = data;

    usernameOfWhoSubmittedPerson[room] = usernameOfWhoSubmitted;
    io.to(room).emit('username_of_who_submitted', usernameOfWhoSubmittedPerson[room]);

  });



  
  socket.on("updated_score", (data) => {
    const {room, assessmentScore } = data
    assessmentScores[room] = assessmentScore;
    io.to(room).emit("assessment_score", assessmentScores[room])
  })
  
  socket.on("update_time", (data) => {
    const {room, timeDurationVal } = data
    setSeconds[room] = timeDurationVal;
    io.to(room).emit("updated_time", setSeconds[room])
  })
  


  socket.on("updated_answers", (data) => {
    const {assessementRoom, selectedAssessmentAnswers } = data

    ioSelectedAssessmentAnswers[assessementRoom] = selectedAssessmentAnswers;
    io.to(assessementRoom).emit("selected_assessment_answers", ioSelectedAssessmentAnswers[assessementRoom])
  })


  socket.on('submitted_button_clicked', (data) => {
    const { room, isAnswersSubmitted } = data;

    isSubmittedButtonClicked[room] = isAnswersSubmitted;
    io.to(room).emit('submitted_button_response', isSubmittedButtonClicked[room]);

  });



  




  socket.on('disconnect', () => {

    // Find the user index in the room
    Object.keys(rooms).forEach((room) => {

      const makePointsZero = () => {
        if(rooms[room].length === 1) {
          rooms[room][userTurnSer].points = 0;
          let updateUserList = rooms[room];
          io.to(room).emit('userList', updateUserList);
        }
      }

      const makeCountValTwo = () => {
        currentFailCountVal = 2;
        io.to(room).emit('received_current_fail_val', currentFailCountVal);
      }

      const userIndex = rooms[room].findIndex(user => user.socketId === socket.id);
      if (userIndex !== -1) {
        rooms[room].splice(userIndex, 1);
        io.to(room).emit('userList', rooms[room]);
    
        // Check if the user being disconnected is the current turn user
        if (userIndex === userTurnSer) {
          // If the last user is removed, set userTurnSer to 0
          if (rooms[room].length === 0 || rooms[room].length === 1) {
            userTurnSer = 0;
            selectedChoiceValCurr = ""
            io.to(room).emit('received_next_user', userTurnSer);

            makeCountValTwo();
            makePointsZero();
          } else {
            // Otherwise, set it to the next user in the array
            userTurnSer = userTurnSer % rooms[room].length;
            io.to(room).emit('received_next_user', userTurnSer);
            makeCountValTwo();
          }
          io.to(room).emit('received_next_user_zero', userTurnSer);
        } else {
          if (rooms[room].length === 0 || rooms[room].length === 1) {
            userTurnSer = 0;
            selectedChoiceValCurr = ""
            io.to(room).emit('received_next_user', userTurnSer);
            makePointsZero();
            makeCountValTwo();
          } else {
            if(userIndex === -1){
              let nextUser = userTurnSer -= 1;
              io.to(room).emit('received_next_user', nextUser);
              makeCountValTwo();
            }
          }
        }
    
        // Remove the room if there are no users in it
        if (rooms[room].length === 0) {
          delete rooms[room];
          selectedChoiceValCurr = ""
        }


      }
    });




    // Find and remove the user from all assessment rooms
    Object.keys(assessmentRoomList).forEach((assessmentRoom) => {
      const userIndex = assessmentRoomList[assessmentRoom].findIndex(user => user.socketId === socket.id);
      if (userIndex !== -1) {
        assessmentRoomList[assessmentRoom].splice(userIndex, 1);
        // Remove the assessmentRoom if there are no users in it
        if (assessmentRoomList[assessmentRoom].length === 0) {
          delete assessmentRoomList[assessmentRoom];
          ioSelectedAssessmentAnswers[assessmentRoom] = [];
          isRunningList[assessmentRoom] = false;
          setSeconds[assessmentRoom] = 0;
          isSubmittedButtonClicked[assessmentRoom] = false;
          idOfWhoSubmittedPerson[assessmentRoom] = ''
          usernameOfWhoSubmittedPerson[assessmentRoom] = ''
          assessmentScores[assessmentRoom] = 0
          isSubmittedAssess[assessmentRoom] = false
          isAssessmentDoneList[assessmentRoom] = false
          showSubmittedAnswerModalList[assessmentRoom] = false
          showTextsList[assessmentRoom] = false
          showAnalysisList[assessmentRoom] = false
          showAssessmentList[assessmentRoom] = true
        }
        io.to(assessmentRoom).emit('assessment_user_list', assessmentRoomList[assessmentRoom]);

      }
    });

  });
  
  
  



  
  
});





// Routers
const tasksRouter = require('./routes/Tasks');
const userRouter = require('./routes/User');
const quesAnsRouter = require('./routes/QuesAns');
const quesRevRouter = require('./routes/QuesRev');
const quesAnsChoicesRouter = require('./routes/QuesAnsChoices');
const studyMaterialRouter = require('./routes/StudyMaterials');
const studyMaterialCategoryRouter = require('./routes/StudyMaterialsCategory');
const studyGroupRouter = require('./routes/StudyGroup');
const studyGroupMembersRouter = require('./routes/StudyGroupMembers');
const FollowersRouter = require('./routes/Followers');
const DashForPersonalAndGroup = require('./routes/DashForPersonalAndGroup');
const { fail } = require('assert');

app.use('/tasks', tasksRouter);
app.use('/users', userRouter);
app.use('/quesAns', quesAnsRouter);
app.use('/quesRev', quesRevRouter);
app.use('/studyMaterial', studyMaterialRouter);
app.use('/quesAnsChoices', quesAnsChoicesRouter);
app.use('/studyMaterialCategory', studyMaterialCategoryRouter);
app.use('/studyGroup', studyGroupRouter);
app.use('/studyGroupMembers', studyGroupMembersRouter);
app.use('/followers', FollowersRouter);
app.use('/DashForPersonalAndGroup', DashForPersonalAndGroup);

// Serve the React app for all routes except the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Sync the Sequelize models with the database and start the server
db.sequelize.sync().then(() => {
  server.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
});
