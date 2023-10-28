import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CampaignIcon from '@mui/icons-material/Campaign';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

// component imports
import { AuditoryLearner } from '../../../../components/practices/AuditoryLearner';



export const PersonalReviewerStart = () => {

  const { materialId } = useParams();

  const [questionIndex, setQuestionIndex] = useState(0)
  const [extractedQA, setQA] = useState({});
  const [questionData, setQuestionData] = useState({});
  const [generatedChoices, setChoices] = useState([]);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [shuffledChoicesTOF, setShuffledChoicesTOF] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [, setSubmittedAnswer] = useState("");
  const [unattemptedCounts, setUnattemptedCounts] = useState(0);
  const [correctAnswerCounts, setCorrectAnswerCounts] = useState(0);
  const [wrongAnswerCounts, setWrongAnswerCounts] = useState(0);
  const [chanceLeft, setChanceLeft] = useState(2);
  const [points, setPoints] = useState(0);
  const [filteredDataValue, setFilteredDataValue] = useState('');
  const [remainingHints, setRemainingHints] = useState(3);
  const [draggedBG, setDraggedBG] = useState('mbg-100');
  const [borderMedium, setBorderMedium] = useState('border-medium-800');
  
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

    console.log(extractedQA);


    return () => {
      speechSynthesis.cancel();
    };
  }, [materialId, filteredDataValue, questionIndex, speechSynthesis, correctAnswerCounts, wrongAnswerCounts, unattemptedCounts]);
  
  
  

  

  

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
          setSelectedChoice('')
          setRemainingHints(3);
          chooseBGColor(1)



        }, 500);
        
        setTimeout(() => {
          setAnsweredWrongVal('')
          setAnsweredWrongVal2('')
          setAnswerSubmitted(false)
          setChanceLeft(2)
          currectCounts(choice, "Wrong")
          hideAllBtn()
          setSubmittedAnswer("")
          setWrongAnswer(false)      
          setWrongAnswer2(false)      
          setEnabledSubmitBtn(true)      
          currectQuestion('0', questionIndex)
          chooseBGColor('mbg-300')

          let questionIndexVal = (questionIndex + 1) % extractedQA.length;
          setQuestionIndex(questionIndexVal)
          currectQuestion('1', questionIndexVal)
        }, 3000);
        

      } else {
        chooseBGColor(0)
      }
    }
  }

  const submitAnswer = (choice) => {
    
    if(selectedChoice === extractedQA[questionIndex].answer){
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
        setChanceLeft(2)
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

        let questionIndexVal = (questionIndex + 1) % extractedQA.length;
        setQuestionIndex(questionIndexVal);
        currectQuestion('1', questionIndexVal)
      }, 4000);

    } else {
      wrongFunctionality(choice)
    }
    
  };

  const giveHint =() => {
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
          {chanceLeft === 2 && (
            <div className='w-full mcolor-800'>
              <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
              <span><FavoriteIcon/></span>
              <span><FavoriteIcon/></span>
            </div>
          )}
          {chanceLeft === 1 && (
            <div className='w-full mcolor-800 flex'>
              <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
              <div className='shake-animation pl-1'><FavoriteIcon/></div>
            </div>
          )}

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
        <AuditoryLearner extractedQA={extractedQA} hideQuestion={hideQuestion} questionIndex={questionIndex} stateQuestion={stateQuestion} hideQuestionBtn={hideQuestionBtn} unhideQuestion={unhideQuestion} unhideQuestionBtn={unhideQuestionBtn} unhideAll={unhideAll} unhideAllBtn={unhideAllBtn} hideAll={hideAll} hideAllBtn={hideAllBtn} unhideAllChoice={unhideAllChoice} unhideAllChoicesBtn={unhideAllChoicesBtn} hideAllChoice={hideAllChoice} hideAllChoicesBtn={hideAllChoicesBtn} shuffledChoices={shuffledChoices} answerSubmitted={answerSubmitted} wrongAnswer={wrongAnswer} answeredWrongVal={answeredWrongVal} wrongAnswer2={wrongAnswer2} answeredWrongVal2={answeredWrongVal2} handleRadioChange={handleRadioChange
        } selectedChoice={selectedChoice} unhiddenChoice={unhiddenChoice} hideChoiceBtn={hideChoiceBtn} choiceSpeak={choiceSpeak} enabledSubmitBtn={enabledSubmitBtn} submitAnswer={submitAnswer} setSelectedChoice={setSelectedChoice} giveHint={giveHint} remainingHints={remainingHints} />




        {/* Kinesthetic Learners */}







        {/* Visual Learners */}







      </div>
    </div>
  )
}
