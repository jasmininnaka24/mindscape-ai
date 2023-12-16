import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useUser } from '../../../../UserContext';
import { fetchUserData } from '../../../../userAPI';
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import EditNoteIcon from '@mui/icons-material/EditNote';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CampaignIcon from '@mui/icons-material/Campaign';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import seedrandom from 'seedrandom';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// component imports
import { AuditoryLearner } from '../../../../components/practices/AuditoryLearner';
import { KinestheticLearner } from '../../../../components/practices/KinestheticLearner';
import { VisualLearner } from '../../../../components/practices/VisualLearner';





export const PersonalReviewerStart = () => {


  const { materialId } = useParams();
  const { user, SERVER_URL } = useUser()

  const UserId = user?.id;
  
  // user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    studyProfTarget: 0,
    typeOfLearner: '',
    userImage: ''
  })

  const [questionIndex, setQuestionIndex] = useState(0)
  const [extractedQA, setQA] = useState({});
  const [mcqaItems, setMcqaItems] = useState([]);
  const [fitbItems, setFITBItems] = useState([]);
  const [identificationItems, setIdentificationItems] = useState([]);
  const [answersItems, setAnswersItems] = useState([]);
  const [quesRev, setQuesRev] = useState([])
  const [typeOfLearner, setTypeOfLearner] = useState('')
  const [questionData, setQuestionData] = useState({});
  const [generatedChoices, setChoices] = useState([]);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [shuffledChoicesTOF, setShuffledChoicesTOF] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [, setSubmittedAnswer] = useState("");
  const [unattemptedCounts, setUnattemptedCounts] = useState(0);
  const [correctAnswerCounts, setCorrectAnswerCounts] = useState(0);
  const [wrongAnswerCounts, setWrongAnswerCounts] = useState(0);
  const [chanceLeft, setChanceLeft] = useState(3);
  const [points, setPoints] = useState(0);
  const [filteredDataValue, setFilteredDataValue] = useState('');
  const [remainingHints, setRemainingHints] = useState(3);
  const [draggedBG, setDraggedBG] = useState('mbg-100');
  const [borderMedium, setBorderMedium] = useState('border-medium-800');
  const [kinesthethicAnswers, setKinesthethicAnswers] = useState([]);
  const [lastDraggedCharacter, setLastDraggedCharacter] = useState('');
  
  // for hide and unhide
  const [hideQuestion, setHideQuestion] = useState('hidden');
  const [unhideQuestion, setUnideQuestion] = useState('');
  const [unhiddenChoice, setUnhiddenChoice] = useState([]);
  const [hideAllChoice, setHideAllChoice] = useState('hidden');
  const [unhideAllChoice, setUnhideAllChoice] = useState('');
  const [hideAll, setHideAll] = useState('hidden');
  const [unhideAll, setUnhideAll] = useState('');

  // wrong and correct answer
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false)
  const [wrongAnswer2, setWrongAnswer2] = useState(false)
  const [answeredWrongVal, setAnsweredWrongVal] = useState('')
  const [answeredWrongVal2, setAnsweredWrongVal2] = useState('')
  const [kinestheticAnswer, setKinestheticAnswer] = useState('')

  const [enabledSubmitBtn, setEnabledSubmitBtn] = useState(true);
  const [hiddenItems, setHiddenItems] = useState([]);
  const speakingRef = useRef(false);


  const [isRunning, setIsRunning] = useState(true)
  const [seconds, setSeconds] = useState(300);
  const [timeForPomodoro, setTimeForPomodoro] = useState(true);
  const [timeForBreak, setTimeForBreak] = useState(false);
  const [hidePomodoroModalBreak, setHidePomodoroModalBreak] = useState('hidden');
  
  const [isDone, setIsDone] = useState(false);

  const getUserData = async () => {
    const userData = await fetchUserData(UserId);
    setUserData({
      username: userData.username,
      email: userData.email,
      studyProfTarget: userData.studyProfTarget,
      typeOfLearner: userData.typeOfLearner,
      userImage: userData.userImage
    });
  }

  useEffect(() => {
    
    
    if (!isDone) {
      setIsDone(true)
    }

  },[UserId])



  useEffect(() => {
    if (isDone) {
      getUserData();
      setIsDone(false)
    }
  }, [isDone])









  function handleDragStart(e, choice) {
    e.dataTransfer.setData("text/plain", choice);
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


  // const handleDropKinesthetic = (e, index) => {
  //   e.preventDefault();

  //   const droppedChoiceText = e.dataTransfer.getData('text/plain');

  //   if (extractedQA[questionIndex].quizType !== 'ToF') {
  //     const draggedAnswers = [...kinesthethicAnswers];
  //     draggedAnswers[index] = droppedChoiceText;
  //     setKinesthethicAnswers(draggedAnswers);
  //     setSelectedChoice(draggedAnswers.join('').toLowerCase());
  //   } else {
  //     setSelectedChoice(droppedChoiceText)
  //   }
  //   setLastDraggedCharacter(droppedChoiceText)
  // }

  
  
  
  const removeValueOfIndex = (index) => {
    if (extractedQA[questionIndex].quizType !== 'ToF') {
      const draggedAnswers = [...kinesthethicAnswers];
      draggedAnswers[index] = ' ';
      setKinesthethicAnswers(draggedAnswers);
    } else {
      setSelectedChoice('')
    }
    setLastDraggedCharacter('')
  }




  const speechSynthesis = window.speechSynthesis;
  

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const choiceFunc = async (id) => {
    try {
      const choicesResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${materialId}/${id}`);
      const randomIndex = Math.floor(Math.random() * choicesResponse.data.length);
      return choicesResponse.data[randomIndex].choice;
    } catch (error) {
      console.error('Error fetching choices:', error);
      return null;
    }
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const userDetailsResponse = await axios.get(`${SERVER_URL}/users/get-user/${UserId}`);
        setTypeOfLearner(userDetailsResponse.data.typeOfLearner)
        console.log(userDetailsResponse.data.typeOfLearner);
        
        const quesRevResponse = await axios.get(`${SERVER_URL}/quesRev/study-material-rev/${materialId}`);
        setQuesRev(quesRevResponse.data);
      



        if (filteredDataValue !== 'Correct' && filteredDataValue !== 'Wrong' && filteredDataValue !== 'Unattempted') {

          
          const materialResponse = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${materialId}`);
          const fetchedQA = materialResponse.data;


          const updatedData = await Promise.all(
            fetchedQA.map(async (item) => {
              if (item.quizType === 'ToF') {
                const randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber % 2 === 0) {
                  try {
                    const choicesResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${materialId}/${item.id}`);
                    const randomIndex = Math.floor(Math.random() * choicesResponse.data.length);
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
          let mcqa = fetchedQA.filter(data => data.quizType === 'MCQA');
          let fitb = fetchedQA.filter(data => data.quizType === 'FITB');
          let identification = fetchedQA.filter(data => data.quizType === 'Identification');
          const lowercaseAnswers = fetchedQA.map(data => ({
            ...data,
            answer: data.answer.toLowerCase(),
          }));
          
          // Use an object to track unique answers
          const uniqueAnswersMap = {};
          lowercaseAnswers.forEach(data => {
            uniqueAnswersMap[data.answer] = uniqueAnswersMap[data.answer] || data;
          });
          
          // Convert the object values back to an array
          const uniqueLowercaseAnswers = Object.values(uniqueAnswersMap);
          
          // Remove the 'true' answer
          let answers = uniqueLowercaseAnswers.filter(data => data.answer !== 'true');
          
          


          setMcqaItems(mcqa)
          setFITBItems(fitb)
          setIdentificationItems(identification)
          setAnswersItems(answers)
          console.log(answers);


          if(updatedData.length > 0) {
            const filteredQuestions = updatedData.filter(question => question.stoppedAt === '1');
          
            if (filteredQuestions.length > 0) {
              const questionIndexGet = filteredQuestions[0].id;
              const foundIndex = updatedData.findIndex(question => question.id === questionIndexGet);
              if (foundIndex !== -1) {
                setQuestionIndex(foundIndex);
              } else {
                setQuestionIndex(0);
              }
            } else {
              setQuestionIndex(0);
            } 


            
          
          
            const choicesResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${materialId}/${updatedData[questionIndex].id}`);

            setChoices(choicesResponse.data);
  
            let shuffledArray = shuffleArray([...choicesResponse.data, { choice: updatedData[questionIndex].answer }])

            setShuffledChoices(shuffledArray);
            setShuffledChoicesTOF(choicesResponse.data);
          }


  
          const unattemptedCount = updatedData.filter(question => question.response_state === 'Unattempted').length;
          const correctCount = updatedData.filter(question => question.response_state === 'Correct').length;
          const wrongCount = updatedData.filter(question => question.response_state === 'Wrong').length;
          setUnattemptedCounts(unattemptedCount);
          setCorrectAnswerCounts(correctCount);
          setWrongAnswerCounts(wrongCount);



          

        } 
        
        // this is for correct answers
        else if(filteredDataValue === 'Correct') {


          const materialResponse = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${materialId}/${filteredDataValue}`);

          
          const fetchedQA = materialResponse.data;

          const updatedData = await Promise.all(
            fetchedQA.map(async (item) => {
              if (item.quizType === 'ToF') {
                const randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber % 2 === 0) {
                  try {
                    const choicesResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${materialId}/${item.id}`);
                    const randomIndex = Math.floor(Math.random() * choicesResponse.data.length);
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

          
          if(updatedData.length > 0) {
            const filteredQuestions = updatedData.filter(question => question.stoppedAt === '1');
          
            if (filteredQuestions.length > 0) {
              const questionIndexGet = filteredQuestions[0].id;
              const foundIndex = updatedData.findIndex(question => question.id === questionIndexGet);
              if (foundIndex !== -1) {
                setQuestionIndex(foundIndex);
              } else {
                setQuestionIndex(0);
              }
            } else {
              setQuestionIndex(0);
            } 

          
          
          
            const choicesResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${materialId}/${updatedData[questionIndex].id}`);
            setChoices(choicesResponse.data);
  
            let shuffledArray = shuffleArray([...choicesResponse.data, { choice: updatedData[questionIndex].answer }])
            setShuffledChoices(shuffledArray);
          }





          setCorrectAnswerCounts(updatedData.length);




        } else if(filteredDataValue === 'Wrong') { 

          const materialResponse = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${materialId}/${filteredDataValue}`);

          
          const fetchedQA = materialResponse.data;
          const updatedData = await Promise.all(
            fetchedQA.map(async (item) => {
              if (item.quizType === 'ToF') {
                const randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber % 2 === 0) {
                  try {
                    const choicesResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${materialId}/${item.id}`);
                    const randomIndex = Math.floor(Math.random() * choicesResponse.data.length);
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

          
          if(updatedData.length > 0) {
            const filteredQuestions = updatedData.filter(question => question.stoppedAt === '1');
          
            if (filteredQuestions.length > 0) {
              const questionIndexGet = filteredQuestions[0].id;
              const foundIndex = updatedData.findIndex(question => question.id === questionIndexGet);
              if (foundIndex !== -1) {
                setQuestionIndex(foundIndex);
              } else {
                setQuestionIndex(0);
              }
            } else {
              setQuestionIndex(0);
            } 

          
          
          
            const choicesResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${materialId}/${updatedData[questionIndex].id}`);
            setChoices(choicesResponse.data);
  
            let shuffledArray = shuffleArray([...choicesResponse.data, { choice: updatedData[questionIndex].answer }])
            setShuffledChoices(shuffledArray);

          }



          setWrongAnswerCounts(updatedData.length);




          
          
        } else if(filteredDataValue === 'Unattempted') { 


          const materialResponse = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${materialId}/${filteredDataValue}`);

          
          const fetchedQA = materialResponse.data;
          const updatedData = await Promise.all(
            fetchedQA.map(async (item) => {
              if (item.quizType === 'ToF') {
                const randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber % 2 === 0) {
                  try {
                    const choicesResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${materialId}/${item.id}`);
                    const randomIndex = Math.floor(Math.random() * choicesResponse.data.length);
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

          
          if(updatedData.length > 0) {
            const filteredQuestions = updatedData.filter(question => question.stoppedAt === '1');
          
            if (filteredQuestions.length > 0) {
              const questionIndexGet = filteredQuestions[0].id;
              const foundIndex = updatedData.findIndex(question => question.id === questionIndexGet);
              if (foundIndex !== -1) {
                setQuestionIndex(foundIndex);
              } else {
                setQuestionIndex(0);
              }
            } else {
              setQuestionIndex(0);
            } 

          
            const choicesResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${materialId}/${updatedData[questionIndex].id}`);
            setChoices(choicesResponse.data);
  
            let shuffledArray = shuffleArray([...choicesResponse.data, { choice: updatedData[questionIndex].answer }])
            setShuffledChoices(shuffledArray);

          }





          setUnattemptedCounts(updatedData.length);

        } else {
          console.error("No questions available or invalid question index.");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

  
    fetchData();



    if (questionIndex >= 0 && questionIndex < extractedQA.length && typeOfLearner === 'Kinesthetic') {

      let arrays = Array.from({ length: extractedQA[questionIndex].answer.length }, (_, index) => ` `);
      setKinesthethicAnswers(arrays);

    }


    return () => {
      speechSynthesis.cancel();
    };
  }, [materialId, filteredDataValue, questionIndex, speechSynthesis, correctAnswerCounts, wrongAnswerCounts, unattemptedCounts, typeOfLearner, UserId]);
  
  
  
  useEffect(() => {

    if (isRunning) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            if (timeForPomodoro) {
              setTimeForPomodoro(false)
              setTimeForBreak(true)
              setHidePomodoroModalBreak('')
              setSeconds(300); 
            } else {
              setHidePomodoroModalBreak('hidden')
              setTimeForBreak(true)
              setTimeForPomodoro(true)
              setSeconds(300);
            }
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
    
  
  }, [isRunning, timeForPomodoro]);
  



  useEffect(() => {

  }, [isRunning, seconds]);





  

  const handleRadioChange = (event) => {
    setSelectedChoice(event.target.value);
  };
  
  const stateQuestion = () => {
    let questionText = extractedQA[questionIndex].question.replace('_________', 'blank').replace(/\([^)]+\)/g, '');  
    let questionUtterance = new SpeechSynthesisUtterance(questionText);
  
    speechSynthesis.speak(questionUtterance);
  }
  
  
  const choiceSpeak = (choice) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(choice);
      utterance.onend = () => {
        speakingRef.current = false;
        resolve();
      };
      speechSynthesis.speak(utterance);
    });
  };

  const currectCounts = async (choice, responseStateInp) => {
    const data = {
      response_state: responseStateInp, 
    };
    
    await axios.put(`${SERVER_URL}/quesAns/update-response-state/${materialId}/${choice}`, data);
    
    setUnattemptedCounts(unattemptedCounts - 1)

    if(responseStateInp === "Correct") {
      setCorrectAnswerCounts(correctAnswerCounts + 1)
    } else if(responseStateInp === "Wrong") {
      setWrongAnswerCounts(wrongAnswerCounts + 1)
    }
  }

  const currectQuestion = async (stoppedAtInp, questionIndexVal) => {
    const data = {
      stoppedAt: stoppedAtInp, 
    };

    let currentQuestionId = extractedQA[questionIndexVal].id; 

    await axios.put(`${SERVER_URL}/quesAns/update-stoppedAt/${materialId}/${currentQuestionId}`, data);
  }



  const shuffleArraySeed = (array, rng) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  
  const wrongFunctionality = (choice, seed) => {
    let backgroundColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray'];
    let extractedBG = extractedQA[questionIndex].bgColor;
    backgroundColors = backgroundColors.filter(color => color !== extractedBG);
    
    const rng = seedrandom(seed);

    backgroundColors = backgroundColors.filter(color => color !== extractedBG);
    backgroundColors = shuffleArraySeed(backgroundColors, rng);

    const chooseBGColor = (num) => {
      setDraggedBG(`${backgroundColors[num]}-bg`)
    }

    if(chanceLeft !== 0) {
      // alert('Wrong')
      let currentChanceCount = chanceLeft - 1
      setChanceLeft(currentChanceCount)

      if(setAnsweredWrongVal === ''){
        setWrongAnswer(true)
        setAnsweredWrongVal(selectedChoice)
      } else {
        setWrongAnswer2(true)
        setAnsweredWrongVal2(selectedChoice)
      }

      if(currentChanceCount === 0) {
        setTimeout(() => {
          unhideAllBtn()
          setAnswerSubmitted(true)
          setEnabledSubmitBtn(false)
          chooseBGColor(1)
        }, 500);
        
        setTimeout(() => {
          setSelectedChoice('')
          setRemainingHints(3);
          setAnsweredWrongVal('')
          setAnsweredWrongVal2('')
          setAnswerSubmitted(false)
          setChanceLeft(3)
          currectCounts(choice, "Wrong")
          hideAllBtn()
          setSubmittedAnswer("")
          setWrongAnswer(false)      
          setWrongAnswer2(false)      
          setEnabledSubmitBtn(true)      
          currectQuestion('0', questionIndex)
          chooseBGColor('mbg-300')
          setLastDraggedCharacter('')
          setKinestheticAnswer('')
          setDraggedBG('mbg-100')

          let questionIndexVal = (questionIndex + 1) % extractedQA.length;
          setQuestionIndex(questionIndexVal)
          currectQuestion('1', questionIndexVal)
        }, typeOfLearner === 'Kinesthetic' ? 6000 : 3000);
        

      } else {
        chooseBGColor(0)
      }
    }
  }

  const correctFunctionality = (choice, typeOfLearner) => {
    if(selectedChoice === ((typeOfLearner === 'Kinesthetic' && extractedQA[questionIndex].quizType !== 'ToF') ? extractedQA[questionIndex].answer.toLowerCase() : extractedQA[questionIndex].answer)){
      setTimeout(() => {
        unhideAllBtn()
        setAnswerSubmitted(true)
        setEnabledSubmitBtn(false)
        let bgColor = extractedQA[questionIndex].bgColor;
        setDraggedBG(`${bgColor}-bg`)
        setBorderMedium('border-bold-100')
      }, 500);
      setTimeout(() => {
        setAnswerSubmitted(false)
        setSubmittedAnswer("")
        setChanceLeft(3)
        setSelectedChoice('')
        setPoints(points + 1)
        currectQuestion('0', questionIndex)
        currectCounts(choice, "Correct")
        hideAllBtn()
        setEnabledSubmitBtn(true)
        setRemainingHints(3);
        setDraggedBG('mbg-100')
        setBorderMedium('border-medium-800')
        setAnsweredWrongVal('')
        setAnsweredWrongVal2('')
        setLastDraggedCharacter('')
        setKinestheticAnswer('')

        let questionIndexVal = (questionIndex + 1) % extractedQA.length;
        setQuestionIndex(questionIndexVal);
        currectQuestion('1', questionIndexVal)
      }, 4000);

    } else {
      const seedValue = 'keepChoiceBgVal';

      wrongFunctionality(choice, seedValue)
    }
  }


  const submitAnswer = (choice) => {
    
    correctFunctionality(choice, typeOfLearner)
    
  };



  const giveHintAtIndex = (remainingHint) => {
    let answerLength = extractedQA[questionIndex].answer.length;

    const getRandomNumber = () => {
        return Math.floor(Math.random() * answerLength);
    };

    let answerIndex = getRandomNumber();


    while (kinesthethicAnswers[answerIndex] !== ' ') {
      answerIndex = getRandomNumber();
    }

    const updatedAnswers = [...kinesthethicAnswers];
    updatedAnswers[answerIndex] = extractedQA[questionIndex].answer[answerIndex].toUpperCase();
    setKinesthethicAnswers(updatedAnswers);
    setRemainingHints(remainingHint);
  }


  const giveHint = () => {
    if (typeOfLearner === 'Kinesthetic' && remainingHints > 0) {

        if (remainingHints === 3) {
          setKinestheticAnswer(extractedQA[questionIndex].answer[0])
          setRemainingHints(2)
        } else if(remainingHints === 2){
          setKinestheticAnswer(extractedQA[questionIndex].answer.slice(0, 2))
          setRemainingHints(1)
        } else if(remainingHints === 1) {
          setKinestheticAnswer(extractedQA[questionIndex].answer.slice(0, 3))
          setRemainingHints(0)
        } else {
          speechSynthesis.speak(new SpeechSynthesisUtterance('No more remaining hint'));
        }

    } else {

      if (remainingHints === 3) {
        setSelectedChoice(extractedQA[questionIndex].answer[0])
        setRemainingHints(2)
      } else if(remainingHints === 2){
        setSelectedChoice(extractedQA[questionIndex].answer.slice(0, 2))
        setRemainingHints(1)
      } else if(remainingHints === 1) {
        setSelectedChoice(extractedQA[questionIndex].answer.slice(0, 3))
        setRemainingHints(0)
      } else {
        speechSynthesis.speak(new SpeechSynthesisUtterance('No more remaining hint'));
      }
    }
  }


  // hide button functionalities
  const hideQuestionBtn = () => {
    setHideQuestion('')
    setUnideQuestion('hidden')
  }

  const unhideQuestionBtn = () => {
    setHideQuestion('hidden')
    setUnideQuestion('')
  }

  const hideChoiceBtn = (choice) => {
    if (unhiddenChoice.includes(choice)) {
      setUnhiddenChoice(unhiddenChoice.filter(item => item !== choice));
    } else {
      setUnhiddenChoice([...unhiddenChoice, choice]);
    }
  }

  const toggleMcqVisibility = (question) => {
    if (hiddenItems.includes(question)) {
      setHiddenItems((prevHiddenItems) => prevHiddenItems.filter(item => item !== question));
    } else {
      setHiddenItems((prevHiddenItems) => [...prevHiddenItems, question]);
    }
  };

  const unhideAllChoicesBtn = () => {

    let allChoices = []
    if(extractedQA[questionIndex].quizType === 'ToF') {
      allChoices = ['True', 'False'];
      allChoices = allChoices.map(choice => choice)
    } else {
      allChoices = shuffledChoices.map(choice => choice.choice);
    }
    
    setUnhiddenChoice(allChoices);
    setUnhideAllChoice('hidden')
    setHideAllChoice('')
  };
  
  const hideAllChoicesBtn = () => {
    setUnhiddenChoice([]);
    setUnhideAllChoice('')
    setHideAllChoice('hidden')
  };


  const unhideAllBtn = () => {
    unhideAllChoicesBtn()
    setUnhideAll('hidden')
    setHideAll('')

    hideQuestionBtn();
  };
  
  const hideAllBtn = () => {
    hideAllChoicesBtn()
    setUnhideAll('')
    setHideAll('hidden')

    unhideQuestionBtn();
  };

  









  const replaceWords = (question, answer) => {
    return question
      .replace(/What/gi, answer)
      .replace(/Who/gi, answer)
      .replace(/When/gi, answer)
      .replace(/what/gi, answer.toLowerCase())
      .replace(/who/gi, answer.toLowerCase())
      .replace(/when/gi, answer.toLowerCase())
      .replace(/s does/gi, 's do')
      .replace(/are/gi, 'is')
      .replace(/s is/gi, 's are')
      .replace(/s has/gi, 's have')
      .replace(/\?/g, '')
      .replace(/_+/g, answer);
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const seedValue = 'randomSeedForHighlights';
  const rng = seedrandom(seedValue);

  // Function to get a random color
  function getRandomColor(colors, lastColor) {
    let newColor = lastColor;
    while (newColor === lastColor) {
      const randomIndex = Math.floor(rng() * colors.length);
      newColor = colors[randomIndex];
    }
    return newColor;
  }

  
  const backgroundColors = ['red', 'yellow', 'green', 'blue', 'purple'];
  let lastColor = '';


  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className='poppins flex mcolor-900'>


      <div className={`${hidePomodoroModalBreak} absolute top-0 left-0 modal-bg w-full h-full`}>
        <div className='flex items-center justify-center h-full'>
          <div className='mbg-100 min-h-[50vh] w-1/3 z-10 relative p-10 rounded-[5px] flex items-center justify-center relative' style={{ overflowY: 'auto' }}>

            <div className={`w-full`}>
              <p className='mcolor-900 text-2xl text-center mb-5'><span className='font-bold'>{timeForBreak ? formatTime(seconds) : '00:00'}</span></p>

              <p className='text-center text-xl font-medium mcolor-800 mb-12'>The 25-minute Pomodoro session has ended. If you'd like to continue, you can do so by clicking the "Continue" button below.</p>
              
              <div className='absolute bottom-5 flex items-center justify-between w-full left-0 px-5'>
                <button className='mbg-300 mcolor-900 px-5 py-2 rounded'>Previous Page</button>
                <button className='mbg-700 mcolor-100 px-5 py-2 rounded' onClick={() => {
                  setHidePomodoroModalBreak('hidden')
                  setTimeForBreak(false)
                  setTimeForPomodoro(true)
                  setSeconds(10); 
                }}>Resume</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='w-1/6 mbg-300 h-[100vh] flex justify-between flex-col' style={{ borderRight: '1px solid #999' }}>

        <div>
          <div className='px-5 py-5 font-bold mbg-200 mcolor-800 text-center text-xl'>{typeOfLearner} Learner</div>

          {/* pomodoro time */}
          <div className='mt-10 px-5'>
            <div className='mcolor-900 text-lg'>Time Left: <span className='font-bold'>{timeForPomodoro ? formatTime(seconds) : '00:00'}</span></div>
            

            {timeForPomodoro && (
              <button 
                className='mbg-200 w-full py-2 rounded mt-2 font-medium'
                onClick={() => {
                  if (isRunning) {
                    setIsRunning(false)
                  } else {
                    setIsRunning(true)
                  }
                }}>{isRunning ? <>Pause <PauseIcon /></> : <>Resume <PlayArrowIcon /></>}</button>
            )}

          </div>

          <div className='mt-8 px-5'>
            <div className='flex items-center mcolor-900'>
              <p><FilterListIcon /> Filter: </p>



            </div>

            {/* all filters */}
            <div className='mt-2'>
              <select
                className="border-thin-800 px-3 py-1 rounded-[5px] outline-none border-none mcolor-900"
                value={filteredDataValue}
                onChange={(e) => {
                  setFilteredDataValue(e.target.value)
                  setSelectedChoice('')
                  setDraggedBG('mbg-100')
                  setChanceLeft(3)
                  setKinestheticAnswer('')
                  setRemainingHints(3)
                  setAnsweredWrongVal('')
                  setAnsweredWrongVal2('')
                  }
                }
              >
                <option value="">All Items</option>
                <option value="Correct">Correct Answers</option>
                <option value="Wrong">Wrong Answers</option>
                <option value="Unattempted">Unattempted Items</option>
              </select>
            </div>
            

            {filteredDataValue === '' && (
              <div className='mt-3 px-1'>
                <div className='mcolor-900 mbg-200 rounded mb-2 px-3 text-md py-2'>Unattempted: <span className='font-bold'>{unattemptedCounts}</span></div>
                <div className='mcolor-900 mbg-200 rounded mb-2 px-3 text-md py-2'>Correct Answer: <span className='font-bold'>{correctAnswerCounts}</span></div>
                <div className='mcolor-900 mbg-200 rounded mb-2 px-3 text-md py-2'>Wrong Answer: <span className='font-bold'>{wrongAnswerCounts}</span></div>
              </div>
            )}

            {/* response statements counts */}
            <div className='mt-3 px-1'>
              {filteredDataValue === 'Unattempted' && (
                <div className='mcolor-900 mbg-200 rounded mb-2 px-3 text-md py-2'>Unattempted: <span className='font-bold'>{unattemptedCounts}</span></div>
                )}
              {filteredDataValue === 'Correct' && (
                <div className='mcolor-900 mbg-200 rounded mb-2 px-3 text-md py-2'>Correct Answer: <span className='font-bold'>{correctAnswerCounts}</span></div>
                )}
              {filteredDataValue === 'Wrong' && (
                <div className='mcolor-900 mbg-200 rounded mb-2 px-3 text-md py-2'>Wrong Answer: <span className='font-bold'>{wrongAnswerCounts}</span></div>
                )}
            </div>





          </div>
        </div>


        <div className='text-xl mcolor-900 text-center py-4 mbg-200'>
          <PersonIcon className='mr-1' />{userData.username}
        </div>
      </div>

      <div className='flex-1'>

        <div className='flex justify-between'>
          <div className='w-1/2 px-5 py-8 h-[100vh]' style={{ borderLeft: '2px solid #e0dfdc', overflowY: 'auto' }}>
            <p className='text-center mcolor-800 text-3xl opacity-75 mb-10'>Generated Notes</p>
            

            {typeOfLearner !== 'Auditory' ?
              (answersItems.map((item, index) => (
                <div key={index} className={`${typeOfLearner === 'Visual' ? `${item.bgColor}-bg` : 'mbg-200 border-thin-800'} rounded mb-5 p-5`}>

                  <div className='mb-6'>
                    <span className='mbg-100 shadows px-5 py-2 rounded'>{capitalizeFirstLetter(item.answer)}</span>
                  </div>

                  {mcqaItems
                    .filter(mcqa => mcqa.answer.toLowerCase() === item.answer.toLowerCase())
                    .map((filteredItem, index) => (
                      <div key={index}>
                        <p><EmojiObjectsIcon className='text-red' /> {replaceWords(filteredItem.question, item.answer)}</p>
                      </div>
                    ))}
                    
                  {fitbItems
                    .filter(fitb => fitb.answer.toLowerCase() === item.answer.toLowerCase())
                    .map((filteredItem, index) => (
                      <div key={index}>
                        <p><EmojiObjectsIcon className='text-red' /> {replaceWords(filteredItem.question, item.answer)}</p>
                      </div>
                    ))}

                  {identificationItems
                    .filter(identification => identification.answer.toLowerCase() === item.answer.toLowerCase())
                    .map((filteredItem, index) => (
                      <div key={index}>
                        <p><EmojiObjectsIcon className='text-red' /> {replaceWords(filteredItem.question, item.answer)}</p>
                      </div>
                    ))}
                </div>
              ))) : (
                answersItems.map((item, index) => (
                <div key={index} className={`${typeOfLearner === 'Visual' ? `${item.bgColor}-bg` : 'mbg-200 border-thin-800'} rounded mb-5 p-5`}>

                  <div className='mb-6'>
                    <span className='mbg-100 shadows px-5 py-2 rounded'>{capitalizeFirstLetter(item.answer)}</span>
                  </div>

                  {mcqaItems
                    .filter(mcqa => mcqa.answer && mcqa.answer.toLowerCase() === item.answer.toLowerCase())
                    .map((filteredItem, index) => (
                      <div key={index} className='flex items-start justify-between w-full'>
                        {hiddenItems.includes(replaceWords(filteredItem.question, item.answer)) ? (
                          <p className='w-3/4 text-justify'  style={{ whiteSpace: 'pre-wrap' }}><EmojiObjectsIcon className='text-red' /> {replaceWords(filteredItem.question, item.answer)}</p>
                          ) : (
                          <p className='w-3/4'  style={{ whiteSpace: 'pre-wrap' }}><GraphicEqIcon className='mcolor-900 mr-1' />Listen...</p>
                        )}


                        <div className='mt-1 flex justify-end w-1/4 gap-3'>
                          <button onClick={() => choiceSpeak(replaceWords(filteredItem.question, item.answer))}><CampaignIcon /></button>
                          <button onClick={() => toggleMcqVisibility(replaceWords(filteredItem.question, item.answer))}>
                            {hiddenItems.includes(replaceWords(filteredItem.question, item.answer)) ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </button>
                        </div>
                      </div>
                    ))
                  }



                  {fitbItems
                    .filter(fitb => fitb.answer.toLowerCase() === item.answer.toLowerCase())
                    .map((filteredItem, index) => (
                      <div key={index} className='flex items-start justify-between w-full'>
                        {hiddenItems.includes(replaceWords(filteredItem.question, item.answer)) ? (
                          <p className='w-3/4 text-justify'  style={{ whiteSpace: 'pre-wrap' }}><EmojiObjectsIcon className='text-red' /> {replaceWords(filteredItem.question, item.answer)}</p>
                          ) : (
                          <p className='w-3/4'  style={{ whiteSpace: 'pre-wrap' }}><GraphicEqIcon className='mcolor-900 mr-1' />Listen...</p>
                        )}


                        <div className='mt-1 flex justify-end w-1/4 gap-3'>
                          <button onClick={() => choiceSpeak(replaceWords(filteredItem.question, item.answer))}><CampaignIcon /></button>
                          <button onClick={() => toggleMcqVisibility(replaceWords(filteredItem.question, item.answer))}>
                            {hiddenItems.includes(replaceWords(filteredItem.question, item.answer)) ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </button>
                        </div>
                      </div>
                    ))
                  }



                  {identificationItems
                    .filter(identification => identification.answer.toLowerCase() === item.answer.toLowerCase())
                    .map((filteredItem, index) => (
                      <div key={index} className='flex items-start justify-between w-full'>
                        {hiddenItems.includes(replaceWords(filteredItem.question, item.answer)) ? (
                          <p className='w-3/4 text-justify'  style={{ whiteSpace: 'pre-wrap' }}><EmojiObjectsIcon className='text-red' /> {replaceWords(filteredItem.question, item.answer)}</p>
                          ) : (
                          <p className='w-3/4'  style={{ whiteSpace: 'pre-wrap' }}><GraphicEqIcon className='mcolor-900 mr-1' />Listen...</p>
                        )}


                        <div className='mt-1 flex justify-end w-1/4 gap-3'>
                          <button onClick={() => choiceSpeak(replaceWords(filteredItem.question, item.answer))}><CampaignIcon /></button>
                          <button onClick={() => toggleMcqVisibility(replaceWords(filteredItem.question, item.answer))}>
                            {hiddenItems.includes(replaceWords(filteredItem.question, item.answer)) ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </button>
                        </div>
                      </div>
                    ))
                  }

   
                </div>
              )))}



            <p className='text-center mcolor-800 text-3xl opacity-75 my-10'>Summarized Highlighted Notes</p>
            
            {typeOfLearner !== 'Auditory' ?
              (quesRev.map((filteredItem, index) => {
              const color = getRandomColor(backgroundColors, lastColor);
              lastColor = color; // Update lastColor for the next iteration

              return (
                <div key={index} className={`${typeOfLearner === 'Visual' ? `${color}-bg` : 'mbg-200 border-thin-800'} rounded mb-5 p-5`}>
                <p><EditNoteIcon className='mcolor-900' />{filteredItem.answer}</p>
                </div>
              );
            })) : (
              quesRev.map((filteredItem, index) => {
                const color = getRandomColor(backgroundColors, lastColor);
                lastColor = color; // Update lastColor for the next iteration
  
                return (
                  <div key={index} className={`${typeOfLearner === 'Visual' ? `${color}-bg` : 'mbg-200 border-thin-800'} rounded mb-5 p-5 flex items-start justify-between w-full`}>
                    {hiddenItems.includes(filteredItem.answer) ? (
                      <p className='w-3/4'  style={{ whiteSpace: 'pre-wrap' }}><EmojiObjectsIcon className='text-red' /> {filteredItem.answer}</p>
                      ) : (
                      <p className='w-3/4'  style={{ whiteSpace: 'pre-wrap' }}><GraphicEqIcon className='mcolor-900 mr-1' />Listen...</p>
                    )}


                    <div className='mt-1 flex justify-end w-1/4 gap-3'>
                      <button onClick={() => choiceSpeak(filteredItem.answer)}><CampaignIcon /></button>
                      <button onClick={() => toggleMcqVisibility(filteredItem.answer)}>
                        {hiddenItems.includes(filteredItem.answer) ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </button>
                    </div>
                  </div>
                );
              })
            )}

          </div>

          <div className='w-1/2 px-5 py-8 h-[100vh]' style={{ borderLeft: '2px solid #e0dfdc', overflowY: 'auto' }}>


            <p className='text-center mcolor-800 text-3xl opacity-75 mb-10'>Practice</p>

            {/* how many chances are left? */}
            <div className='flex w-full justify-end'>
              {chanceLeft === 3 && (
                <div className='flex w-full text-red'>
                  <span className='font-medium text-lg'>Chance Left: </span>
                  <div><FavoriteIcon /></div>
                  <div><FavoriteIcon /></div>
                  <div><FavoriteIcon /></div>
                </div>
              )}
              {chanceLeft === 2 && (
                <div className='w-full text-red'>
                  <span className='font-medium text-lg'>Chance Left: </span>
                  <span><FavoriteIcon /></span>
                  <span><FavoriteIcon /></span>
                </div>
              )}
              {chanceLeft === 1 && (
                <div className='flex w-full text-red'>
                  <span className='font-medium text-lg'>Chance Left: </span>
                  <div className='shake-animation pl-1'><FavoriteIcon /></div>
                </div>
              )}
            </div>



            {
              typeOfLearner === 'Auditory' && (
                <AuditoryLearner
                  extractedQA={extractedQA}
                  hideQuestion={hideQuestion}
                  questionIndex={questionIndex}
                  stateQuestion={stateQuestion}
                  hideQuestionBtn={hideQuestionBtn}
                  unhideQuestion={unhideQuestion}
                  unhideQuestionBtn={unhideQuestionBtn}
                  unhideAll={unhideAll}
                  unhideAllBtn={unhideAllBtn}
                  hideAll={hideAll}
                  hideAllBtn={hideAllBtn}
                  unhideAllChoice={unhideAllChoice}
                  unhideAllChoicesBtn={unhideAllChoicesBtn}
                  hideAllChoice={hideAllChoice}
                  hideAllChoicesBtn={hideAllChoicesBtn}
                  shuffledChoices={shuffledChoices}
                  answerSubmitted={answerSubmitted}
                  wrongAnswer={wrongAnswer}
                  answeredWrongVal={answeredWrongVal}
                  wrongAnswer2={wrongAnswer2}
                  answeredWrongVal2={answeredWrongVal2}
                  handleRadioChange={handleRadioChange}
                  selectedChoice={selectedChoice}
                  unhiddenChoice={unhiddenChoice}
                  hideChoiceBtn={hideChoiceBtn}
                  choiceSpeak={choiceSpeak}
                  enabledSubmitBtn={enabledSubmitBtn}
                  submitAnswer={submitAnswer}
                  setSelectedChoice={setSelectedChoice}
                  giveHint={giveHint}
                  remainingHints={remainingHints}
                />
              )
            }

            {typeOfLearner === 'Kinesthetic' && (
              <KinestheticLearner
                extractedQA={extractedQA}
                questionIndex={questionIndex}
                remainingHints={remainingHints}
                giveHint={giveHint}
                kinesthethicAnswers={kinesthethicAnswers}
                borderMedium={borderMedium}
                handleDragOver={handleDragOver}
                removeValueOfIndex={removeValueOfIndex}
                selectedChoice={selectedChoice}
                typeOfLearner={typeOfLearner}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                lastDraggedCharacter={lastDraggedCharacter}
                enabledSubmitBtn={enabledSubmitBtn}
                submitAnswer={submitAnswer}
                chanceLeft={chanceLeft}
                setLastDraggedCharacter={setLastDraggedCharacter}
                setKinesthethicAnswers={setKinesthethicAnswers}
                setSelectedChoice={setSelectedChoice}
                kinestheticAnswer={kinestheticAnswer}
                handleDrop={handleDrop}
              />
            )}

            {typeOfLearner === 'Visual' && (
              <VisualLearner
                extractedQA={extractedQA}
                questionIndex={questionIndex}
                shuffledChoices={shuffledChoices}
                selectedChoice={selectedChoice}
                enabledSubmitBtn={enabledSubmitBtn}
                submitAnswer={submitAnswer}
                setSelectedChoice={setSelectedChoice}
                giveHint={giveHint}
                remainingHints={remainingHints}
                draggedBG={draggedBG}
                borderMedium={borderMedium}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
              />
            )}
          </div>
        </div>
        






      </div>
    </div>
  )
}
