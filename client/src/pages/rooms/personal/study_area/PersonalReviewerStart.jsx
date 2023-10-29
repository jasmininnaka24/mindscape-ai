import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import FavoriteIcon from '@mui/icons-material/Favorite';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import catsImage1 from '../../../../assets/castImage1.png';
import catsImage2 from '../../../../assets/catsImage2.png';
import catsImage3 from '../../../../assets/catsImage3.png'

// component imports
import { AuditoryLearner } from '../../../../components/practices/AuditoryLearner';
import { VisualLearner } from '../../../../components/practices/VisualLearner';


export const PersonalReviewerStart = () => {

  const { materialId } = useParams();

  const [questionIndex, setQuestionIndex] = useState(0)
  const [extractedQA, setQA] = useState({});
  const [typeOfLearner, setTypeOfLearner] = useState('kinesthetic')
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

  const [enabledSubmitBtn, setEnabledSubmitBtn] = useState(true);


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
      const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${id}`);
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


        if (filteredDataValue !== 'Correct' && filteredDataValue !== 'Wrong' && filteredDataValue !== 'Unattempted') {

          console.log('All items');
          
          const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}`);
          const fetchedQA = materialResponse.data;


          const updatedData = await Promise.all(
            fetchedQA.map(async (item) => {
              if (item.quizType === 'ToF') {
                const randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber % 2 === 0) {
                  try {
                    const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${item.id}`);
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
          console.log(updatedData);
        


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


            
          
          
            const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${updatedData[questionIndex].id}`);

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

          console.log('correct items');

          const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}/${filteredDataValue}`);

          
          const fetchedQA = materialResponse.data;

          const updatedData = await Promise.all(
            fetchedQA.map(async (item) => {
              if (item.quizType === 'ToF') {
                const randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber % 2 === 0) {
                  try {
                    const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${item.id}`);
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
          console.log(updatedData);

          
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

          
          
          
            const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${updatedData[questionIndex].id}`);
            setChoices(choicesResponse.data);
  
            let shuffledArray = shuffleArray([...choicesResponse.data, { choice: updatedData[questionIndex].answer }])
            setShuffledChoices(shuffledArray);
          }





          setCorrectAnswerCounts(updatedData.length);




        } else if(filteredDataValue === 'Wrong') { 

          console.log('Wrong clicked');
          const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}/${filteredDataValue}`);

          
          const fetchedQA = materialResponse.data;
          const updatedData = await Promise.all(
            fetchedQA.map(async (item) => {
              if (item.quizType === 'ToF') {
                const randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber % 2 === 0) {
                  try {
                    const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${item.id}`);
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
          console.log(updatedData);

          
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

          
          
          
            const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${updatedData[questionIndex].id}`);
            setChoices(choicesResponse.data);
  
            let shuffledArray = shuffleArray([...choicesResponse.data, { choice: updatedData[questionIndex].answer }])
            setShuffledChoices(shuffledArray);

          }



          setWrongAnswerCounts(updatedData.length);




          
          
        } else if(filteredDataValue === 'Unattempted') { 


          console.log('Unattempted clicked');
          const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}/${filteredDataValue}`);

          
          const fetchedQA = materialResponse.data;
          const updatedData = await Promise.all(
            fetchedQA.map(async (item) => {
              if (item.quizType === 'ToF') {
                const randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber % 2 === 0) {
                  try {
                    const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${item.id}`);
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
          console.log(updatedData);

          
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

          
            const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${updatedData[questionIndex].id}`);
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

    if (questionIndex >= 0 && questionIndex < extractedQA.length && typeOfLearner === 'kinesthetic') {

      let arrays = Array.from({ length: extractedQA[questionIndex].answer.length }, (_, index) => ` `);
      setKinesthethicAnswers(arrays);

    }


    return () => {
      speechSynthesis.cancel();
    };
  }, [materialId, filteredDataValue, questionIndex, speechSynthesis, correctAnswerCounts, wrongAnswerCounts, unattemptedCounts]);
  
  
  

  console.log(kinesthethicAnswers);

  

  const handleRadioChange = (event) => {
    setSelectedChoice(event.target.value);
  };
  
  const stateQuestion = () => {
    let questionText = extractedQA[questionIndex].question.replace('_________', 'blank').replace(/\([^)]+\)/g, '');  
    let questionUtterance = new SpeechSynthesisUtterance(questionText);
  
    speechSynthesis.speak(questionUtterance);
  }
  
  
  const choiceSpeak = (choice) => {
    speechSynthesis.speak(new SpeechSynthesisUtterance(choice));
  }

  const currectCounts = async (choice, responseStateInp) => {
    const data = {
      response_state: responseStateInp, 
    };
    
    await axios.put(`http://localhost:3001/quesAns/update-response-state/${materialId}/${choice}`, data);
    
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

    await axios.put(`http://localhost:3001/quesAns/update-stoppedAt/${materialId}/${currentQuestionId}`, data);
  }





  
  const wrongFunctionality = (choice) => {
    let backgroundColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray'];
    let extractedBG = extractedQA[questionIndex].bgColor;
    backgroundColors = backgroundColors.filter(color => color !== extractedBG);
    
   
    backgroundColors = shuffleArray(backgroundColors);
  
    const chooseBGColor = (num) => {
      setDraggedBG(`${backgroundColors[num]}-bg`)
    }
    if(chanceLeft !== 0) {
      // alert('Wrong')
      speechSynthesis.speak(new SpeechSynthesisUtterance('Wrong answer!'));
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

          let questionIndexVal = (questionIndex + 1) % extractedQA.length;
          setQuestionIndex(questionIndexVal)
          currectQuestion('1', questionIndexVal)
        }, typeOfLearner === 'kinesthetic' ? 6000 : 3000);
        

      } else {
        chooseBGColor(0)
      }
    }
  }

  const correctFunctionality = (choice, typeOfLearner) => {
    if(selectedChoice === ((typeOfLearner === 'kinesthetic' && extractedQA[questionIndex].quizType !== 'ToF') ? extractedQA[questionIndex].answer.toLowerCase() : extractedQA[questionIndex].answer)){
      setTimeout(() => {
        unhideAllBtn()
        setAnswerSubmitted(true)
        setEnabledSubmitBtn(false)
        let bgColor = extractedQA[questionIndex].bgColor;
        setDraggedBG(`${bgColor}-bg`)
        setBorderMedium('border-bold-100')
        speechSynthesis.speak(new SpeechSynthesisUtterance('Correct answer!'));
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

        let questionIndexVal = (questionIndex + 1) % extractedQA.length;
        setQuestionIndex(questionIndexVal);
        currectQuestion('1', questionIndexVal)
      }, 4000);

    } else {
      wrongFunctionality(choice)
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
    if (typeOfLearner === 'kinesthetic' && remainingHints > 0) {

        if (remainingHints === 3) {
          giveHintAtIndex(2)
        } else if (remainingHints === 2) {
          giveHintAtIndex(1)
        } else if (remainingHints === 1) {
          giveHintAtIndex(0)
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

  







  return (
    <div className='py-8 container poppins'>

      <Navbar linkBack={`/main/personal/study-area/personal-review/${materialId}`} linkBackName={`Reviewer Page Preview`} currentPageName={'Reviewer Page'} username={'Jennie Kim'}/>


      <div className='my-5 py-3'>

        <div className='mt-5 flex items-center justify-between'>
          {/* how many chance are left? */}
          {typeOfLearner !== 'kinesthetic' ? (
            chanceLeft === 3 ? (
              <div className='w-full mcolor-800 flex'>
                <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
                <div><FavoriteIcon/></div>
                <div><FavoriteIcon/></div>
                <div><FavoriteIcon/></div>
              </div>
            ) : chanceLeft === 2 ? (
              <div className='w-full mcolor-800'>
                <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
                <span><FavoriteIcon/></span>
                <span><FavoriteIcon/></span>
              </div>
            ) : chanceLeft === 1 ? (
              <div className='w-full mcolor-800 flex'>
                <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
                <div className='shake-animation pl-1'><FavoriteIcon/></div>
              </div>
            ) : null
          ) : null}


          {/* what type of learner? */}
          <span className='w-full px-5 py-2 mbg-200 mcolor-800 border-thin-800 rounded-[5px] text-center'>Auditory Learner</span>

          {/* pomodoro time */}
          <div className='w-full flex justify-end'>
            <span className='mcolor-800 font-medium text-lg'>Time Left: 20:21</span>
          </div>
        </div>


        {/* filtering */}
        <select
          className="mt-12 border-thin-800 px-3 py-1 rounded-[5px] outline-none border-none mcolor-900"
          value={filteredDataValue}
          onChange={(e) => setFilteredDataValue(e.target.value)}
        >
          <option value="">All Items</option>
          <option value="Correct">Correct Answers</option>
          <option value="Wrong">Wrong Answers</option>
          <option value="Unattempted">Unattempted Items</option>
        </select>


        {/* response statements counts */}
        <div className='mt-5 flex items-center justify-between'>
          {filteredDataValue === 'Unattempted' && (
            <span className='mcolor-800 font-medium text-lg'>Unattempted: {unattemptedCounts}</span>
            )}
          {filteredDataValue === 'Correct' && (
            <span className='mcolor-800 font-medium text-lg'>Correct Answer: {correctAnswerCounts}</span>
            )}
          {filteredDataValue === 'Wrong' && (
            <span className='mcolor-800 font-medium text-lg'>Wrong Answer: {wrongAnswerCounts}</span>
            )}


        </div>

        {filteredDataValue === '' && (
          <div className='mt-5 flex items-center justify-between'>
            <span className='mcolor-800 font-medium text-lg'>Unattempted: {unattemptedCounts}</span>
            <span className='mcolor-800 font-medium text-lg'>Correct Answer: {correctAnswerCounts}</span>
            <span className='mcolor-800 font-medium text-lg'>Wrong Answer: {wrongAnswerCounts}</span>
          </div>
        )}




        {/* Auditory learner */}
        {/* <AuditoryLearner extractedQA={extractedQA} hideQuestion={hideQuestion} questionIndex={questionIndex} stateQuestion={stateQuestion} hideQuestionBtn={hideQuestionBtn} unhideQuestion={unhideQuestion} unhideQuestionBtn={unhideQuestionBtn} unhideAll={unhideAll} unhideAllBtn={unhideAllBtn} hideAll={hideAll} hideAllBtn={hideAllBtn} unhideAllChoice={unhideAllChoice} unhideAllChoicesBtn={unhideAllChoicesBtn} hideAllChoice={hideAllChoice} hideAllChoicesBtn={hideAllChoicesBtn} shuffledChoices={shuffledChoices} answerSubmitted={answerSubmitted} wrongAnswer={wrongAnswer} answeredWrongVal={answeredWrongVal} wrongAnswer2={wrongAnswer2} answeredWrongVal2={answeredWrongVal2} handleRadioChange={handleRadioChange
        } selectedChoice={selectedChoice} unhiddenChoice={unhiddenChoice} hideChoiceBtn={hideChoiceBtn} choiceSpeak={choiceSpeak} enabledSubmitBtn={enabledSubmitBtn} submitAnswer={submitAnswer} setSelectedChoice={setSelectedChoice} giveHint={giveHint} remainingHints={remainingHints} /> */}




        {/* Kinesthetic Learners */}

        {extractedQA.length > 0 ? (
        <div className='flex items-center'>

          {/* question */}
          <div className='w-1/2 mt-5'>
            <div className='relative mt-4 pb-5 text-center text-xl font-medium text-xl mcolor-900'>
              <p className='mbg-300 mcolor-900 w-full rounded-[5px] p-5 mcolor-800'>{extractedQA[questionIndex].question}</p>
            </div>

            <div>

              {/* remaining hints and hint button */}
              {extractedQA[questionIndex].quizType !== 'ToF' && (
                <div className='flex items-center justify-start'>
                  <p className='mcolor-800 text-lg mt-2 font-medium'>Remaining Hints: {remainingHints}</p>
                  <button className='mcolor-800 mbg-200 border-thin-800 rounded-[5px] px-2 py-1 text-lg mt-2 font-medium ml-5' onClick={giveHint}>Use hint</button>
                </div>
              )}

              <div className='flex items-center w-full mt-4'>
                <p className='mr-4 text-lg mcolor-900'>Answer: </p>
                {
                  extractedQA[questionIndex].quizType !== 'ToF' ? (
                    Array.from({ length: extractedQA[questionIndex].answer.length }).map((_, index) => (
                      <span
                      key={index}
                      className={`w-full text-center mx-1 rounded-[5px] ${
                        extractedQA[questionIndex].answer[index] !== ' ' ? (kinesthethicAnswers[index] === ' '? `py-5 mbg-200 mcolor-900 ${borderMedium}` : `py-2 mbg-700 mcolor-100 cursor-pointer ${borderMedium}`) : ''
                      }`}
            
                      onDrop={(e) => handleDropKinesthetic(e, index)} 
                      onDragOver={handleDragOver}
                      onClick={() => removeValueOfIndex(index)}
                    >
                        {kinesthethicAnswers[index]}
                      </span>
                    ))
                  ) : (
                    <div className="w-full text-center mx-1 rounded-[5px] cursor-pointer mbg-200 mcolor-900 min-h-[50px] flex items-center justify-center border-medium-800"
                      onDrop={(e) => handleDropKinesthetic(e)} 
                      onDragOver={handleDragOver}
                      onClick={() => removeValueOfIndex()}
                    >
                      {selectedChoice}
                    </div>
                  )
                }

              </div>

            </div>
            

            {(typeOfLearner === 'kinesthetic' && extractedQA[questionIndex].quizType !== 'ToF') ? (
              <div class="keyboard w-full mt-5">
                <div class="row">
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '1')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '1' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>1</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '2')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '2' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>2</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '3')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '3' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>3</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '4')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '4' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>4</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '5')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '5' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>5</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '6')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '6' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>6</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '7')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '7' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>7</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '8')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '8' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>8</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '9')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '9' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>9</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '0')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '0' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>0</div>
                </div>
                <div class="row">
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'Q')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'Q' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>Q</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'W')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'W' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>W</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'E')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'E' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>E</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'R')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'R' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>R</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'T')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'T' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>T</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'Y')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'Y' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>Y</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'U')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'U' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>U</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'I')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'I' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>I</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'O')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'O' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>O</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'P')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'P' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>P</div>
                </div>
                <div class="row flex items-center justify-center">
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'A')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'A' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>A</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'S')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'S' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>S</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'D')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'D' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>D</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'F')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'F' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>F</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'G')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'G' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>G</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'H')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'H' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>H</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'J')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'J' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>J</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'K')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'K' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>K</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'L')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'L' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>L</div>
                </div>
                <div class="row flex items-center justify-center">
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'Z')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'Z' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>Z</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'X')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'X' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>X</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'C')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'C' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>C</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'V')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'V' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>V</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'B')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'B' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>B</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'N')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'N' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>N</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'M')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'M' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>M</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '-')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '-' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>-</div>
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-between mt-8'>
                <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'True')}  
                  onDragEnd={handleDragEnd}
                  className={`w-full text-center border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'True' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>True</div>
                <div 
                draggable="true" 
                onDragStart={(e) => handleDragStart(e, 'False')}  
                onDragEnd={handleDragEnd}
                className={`w-full text-center border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'False' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>False</div>
              </div>
            )}

            {enabledSubmitBtn === true && (
              <div className='flex justify-center mt-8'>
                <button className='w-1/2 py-2 px-5 mbg-800 rounded-[5px] mcolor-100 text-lg' onClick={() => submitAnswer(extractedQA[questionIndex].id)}>Submit Answer</button>
              </div>
            )}
          </div>


          <div className='w-1/2 mt-5'>
              {typeOfLearner === 'kinesthetic' ? (
              chanceLeft === 3 ? (
                <div className='w-full mcolor-800 flex justify-end pb-5'>
                  <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
                  <div><FavoriteIcon/></div>
                  <div><FavoriteIcon/></div>
                  <div><FavoriteIcon/></div>
                </div>
              ) : chanceLeft === 2 ? (
                <div className='w-full mcolor-800 flex justify-end pb-5'>
                  <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
                  <span><FavoriteIcon/></span>
                  <span><FavoriteIcon/></span>
                </div>
              ) : chanceLeft === 1 ? (
                <div className='w-full mcolor-800 flex justify-end pb-5'>
                  <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
                  <div className='shake-animation pl-1'><FavoriteIcon/></div>
                </div>
              ) : null
            ) : null}

            <div className='flex justify-end'>
              {chanceLeft === 3 && (
                <img className='float-animation' src={catsImage1} style={{width: '80%'}} alt="" />
              )}

              {chanceLeft === 2 && (
                <img className='float-animation' src={catsImage2} style={{width: '80%'}} alt="" />
              )}

              {chanceLeft === 1 && (
                <img className='shake-game-animation' src={catsImage2} style={{width: '80%'}} alt="" />
              )}

              {chanceLeft === 0 && (
                <img className='shake-game-animation1' src={catsImage3} style={{width: '80%'}} alt="" />
              )}
            </div>

          </div>

        </div>
        ) : (
          <p className='text-center my-5 text-xl mcolor-500'>Nothing to show</p>
        )
      }





        {/* Visual Learners */}
        {/* <VisualLearner extractedQA={extractedQA} questionIndex={questionIndex} shuffledChoices={shuffledChoices} selectedChoice={selectedChoice} enabledSubmitBtn={enabledSubmitBtn} submitAnswer={submitAnswer} setSelectedChoice={setSelectedChoice} giveHint={giveHint} remainingHints={remainingHints} draggedBG={draggedBG} borderMedium={borderMedium} handleDrop={handleDrop} handleDragOver={handleDragOver} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd}  />
 */}





      </div>
    </div>
  )
}
