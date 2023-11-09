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

io.on('connection', (socket) => {
  socket.on('join_room', (data) => {
    const { room, username, userId, points, questionIndex, shuffledChoices, userList, failCount} = data;
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = [];
    }

    // Add user to the room's user list
    rooms[room].push({ socketId: socket.id, username, userId, points });

    userListValExt = rooms[room];
    // Emit the updated user list and current turn to all clients in the room
    io.to(room).emit('userList', userListValExt);
    io.to(room).emit('received_next_user_join', userTurnSer);
    io.to(room).emit('received_selected_choice_join', selectedChoiceValCurr);
    io.to(room).emit('received_current_fail_val', failCount);
    io.to(room).emit('next_qa_join', nextQA);
    io.to(room).emit('current_QA_index', questionIndex);
    io.to(room).emit('shuffled_join', shuffledChoices);
    shuffledChoicesVal = shuffledChoices;
    currentFailCountVal = failCount;
  });

  socket.on('next_turn', ({ nextUser, room }) => {
    // Determine the next turn and emit it to all clients in the room
    // const usersInRoom = rooms[room];
    // const currentTurn = usersInRoom.findIndex(user => user.socketId === socket.id);
    const nextTurn = nextUser;

    io.to(room).emit('received_next_user', nextTurn);
    userTurnSer = nextTurn;
  });
  
  socket.on('next_qa', ({ questionIndexVal, room, studyMaterialsLength }) => {
    io.to(room).emit('received_next_qa', questionIndexVal);
    nextQA = questionIndexVal;
  });
  
  socket.on('shuffled_choices', ({ room, shuffledArray }) => {
    io.to(room).emit('received_shuffled_choices', shuffledArray);
    shuffledChoicesVal = shuffledArray;
  });
  
  socket.on('current_QA_index_rec', ({ questionIndex, room }) => {
    io.to(room).emit('received_next_qa', nextQuestion);
    question_index = questionIndex;
  });

  socket.on("user_zero", ({userTurn, questionIndex, room}) => {
    io.to(room).emit('received_next_user_zero', {userTurnSer, questionIndex})
    userTurnSer = userTurn;
    question_index = questionIndex;
  })


  socket.on("user_list", ({userListCount, room}) => {
    if(userListCount === 1){
      let userTurnCurr = 0
      io.to(room).emit("user_turn_disc", userTurnCurr)
      userTurnSer = userTurnCurr
    }
  })

  socket.on("selected_choice", ({room, selectedChoiceVal}) => {
    io.to(room).emit("received_selected_choice", selectedChoiceVal)
    selectedChoiceValCurr = selectedChoiceVal
  })

  socket.on('update_QA_data', (updatedData) => {
    io.emit('update_QA_data', updatedData);
  });

  socket.on("updated_userlist", ({room, userList}) => {
    io.to(room).emit("received_updated_userlist", userList)
    rooms[room] = userList
  })

  socket.on("submitted_answer", ({room, currentFailCount, submittedAnswerVal}) => {
    io.to(room).emit("received_submitted_answer", {currentFailCount, submittedAnswerVal})
    currentFailCountVal = currentFailCount;
    submittedAnswerValCurr = submittedAnswerVal;
  })


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
