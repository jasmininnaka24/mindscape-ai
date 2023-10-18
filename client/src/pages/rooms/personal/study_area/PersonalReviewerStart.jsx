import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CampaignIcon from '@mui/icons-material/Campaign';
import { useParams } from 'react-router-dom';
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';



export const PersonalReviewerStart = () => {

  const { materialId } = useParams();

  const [questionIndex, setQuestionIndex] = useState(0)
  const [extractedQA, setQA] = useState({});
  const [extractedChoices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [unattemptedCounts, setUnattemptedCounts] = useState(0);
  const [correctAnswerCounts, setCorrectAnswerCounts] = useState(0);
  const [wrongAnswerCounts, setWrongAnswerCounts] = useState(0);
  const [chanceLeft, setChanceLeft] = useState(2);
  const [points, setPoints] = useState(0);
  const [filteredDataValue, setFilteredDataValue] = useState('')
  
  // for hide and unhide
  const [hideQuestion, setHideQuestion] = useState('hidden');
  const [unhideQuestion, setUnideQuestion] = useState('');
  const [hideChoice, setHideChoice] = useState('hidden');
  const [unhideChoice, setUnideChoice] = useState('');
  const [unhiddenChoice, setUnhiddenChoice] = useState([]);
  const [hiddenChoice, setHiddenChoice] = useState([]);
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


  const speechSynthesis = window.speechSynthesis;
  

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };


  useEffect(() => {
    async function fetchData() {
      try {


        if (filteredDataValue !== 'Correct' && filteredDataValue !== 'Wrong' && filteredDataValue !== 'Unattempted') {

          console.log('All items');
          
          const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}`);
          const fetchedQA = materialResponse.data;
          
          setQA(fetchedQA)


          if(fetchedQA.length > 0) {
            const filteredQuestions = fetchedQA.filter(question => question.stoppedAt === '1');
          
            if (filteredQuestions.length > 0) {
              const questionIndexGet = filteredQuestions[0].id;
              const foundIndex = fetchedQA.findIndex(question => question.id === questionIndexGet);
              if (foundIndex !== -1) {
                setQuestionIndex(foundIndex);
              } else {
                setQuestionIndex(0);
              }
            } else {
              setQuestionIndex(0);
            } 

          
          
          
            const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${fetchedQA[questionIndex].id}`);
            setChoices(choicesResponse.data);
  
            let shuffledArray = shuffleArray([...choicesResponse.data, { choice: fetchedQA[questionIndex].answer }])
            setShuffledChoices(shuffledArray);
          }
  
          const unattemptedCount = fetchedQA.filter(question => question.response_state === 'Unattempted').length;
          const correctCount = fetchedQA.filter(question => question.response_state === 'Correct').length;
          const wrongCount = fetchedQA.filter(question => question.response_state === 'Wrong').length;
          setUnattemptedCounts(unattemptedCount);
          setCorrectAnswerCounts(correctCount);
          setWrongAnswerCounts(wrongCount);



          

        } 
        
        // this is for correct answers
        else if(filteredDataValue === 'Correct') {

          console.log('correct items');

          const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}/${filteredDataValue}`);

          
          const fetchedQA = materialResponse.data;
          setQA(fetchedQA)

          
          if(fetchedQA.length > 0) {
            const filteredQuestions = fetchedQA.filter(question => question.stoppedAt === '1');
          
            if (filteredQuestions.length > 0) {
              const questionIndexGet = filteredQuestions[0].id;
              const foundIndex = fetchedQA.findIndex(question => question.id === questionIndexGet);
              if (foundIndex !== -1) {
                setQuestionIndex(foundIndex);
              } else {
                setQuestionIndex(0);
              }
            } else {
              setQuestionIndex(0);
            } 

          
          
          
            const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${fetchedQA[questionIndex].id}`);
            setChoices(choicesResponse.data);
  
            let shuffledArray = shuffleArray([...choicesResponse.data, { choice: fetchedQA[questionIndex].answer }])
            setShuffledChoices(shuffledArray);
          }





          setCorrectAnswerCounts(fetchedQA.length);
















        } else if(filteredDataValue === 'Wrong') { 

          console.log('Wrong clicked');
          const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}/${filteredDataValue}`);

          
          const fetchedQA = materialResponse.data;
          setQA(fetchedQA)

          
          if(fetchedQA.length > 0) {
            const filteredQuestions = fetchedQA.filter(question => question.stoppedAt === '1');
          
            if (filteredQuestions.length > 0) {
              const questionIndexGet = filteredQuestions[0].id;
              const foundIndex = fetchedQA.findIndex(question => question.id === questionIndexGet);
              if (foundIndex !== -1) {
                setQuestionIndex(foundIndex);
              } else {
                setQuestionIndex(0);
              }
            } else {
              setQuestionIndex(0);
            } 

          
          
          
            const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${fetchedQA[questionIndex].id}`);
            setChoices(choicesResponse.data);
  
            let shuffledArray = shuffleArray([...choicesResponse.data, { choice: fetchedQA[questionIndex].answer }])
            setShuffledChoices(shuffledArray);
          }



          setWrongAnswerCounts(fetchedQA.length);




          
          
        } else if(filteredDataValue === 'Unattempted') { 


          console.log('Unattempted clicked');
          const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}/${filteredDataValue}`);

          
          const fetchedQA = materialResponse.data;
          setQA(fetchedQA)

          
          if(fetchedQA.length > 0) {
            const filteredQuestions = fetchedQA.filter(question => question.stoppedAt === '1');
          
            if (filteredQuestions.length > 0) {
              const questionIndexGet = filteredQuestions[0].id;
              const foundIndex = fetchedQA.findIndex(question => question.id === questionIndexGet);
              if (foundIndex !== -1) {
                setQuestionIndex(foundIndex);
              } else {
                setQuestionIndex(0);
              }
            } else {
              setQuestionIndex(0);
            } 

          
          
          
            const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${fetchedQA[questionIndex].id}`);
            setChoices(choicesResponse.data);
  
            let shuffledArray = shuffleArray([...choicesResponse.data, { choice: fetchedQA[questionIndex].answer }])
            setShuffledChoices(shuffledArray);
          }





          setUnattemptedCounts(fetchedQA.length);

        } else {
          console.error("No questions available or invalid question index.");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
  
    fetchData();
    return () => {
      speechSynthesis.cancel();
    };
  }, [materialId, filteredDataValue, questionIndex, speechSynthesis, correctAnswerCounts, wrongAnswerCounts, unattemptedCounts]);
  
  
  

  

  
  

  const handleRadioChange = (event) => {
    setSelectedChoice(event.target.value);
  };
  
  const stateQuestion = () => {
    speechSynthesis.speak(new SpeechSynthesisUtterance(extractedQA[questionIndex].question));
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

  const submitAnswer = (choice) => {
    if(selectedChoice === extractedQA[questionIndex].answer){
      setTimeout(() => {
        unhideAllBtn()
        setAnswerSubmitted(true)
        setEnabledSubmitBtn(false)
      }, 500);
      console.log(choice);
      setTimeout(() => {
        setAnswerSubmitted(false)
        setSubmittedAnswer("")
        setChanceLeft(2)
        setPoints(points + 1)
        currectQuestion('0', questionIndex)
        currectCounts(choice, "Correct")
        hideAllBtn()
        setEnabledSubmitBtn(true)
        let questionIndexVal = (questionIndex + 1) % extractedQA.length;
        setQuestionIndex(questionIndexVal);
        currectQuestion('1', questionIndexVal)
      }, 4000);

    } else {
      if(chanceLeft !== 0) {
        alert('Wrong')
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
            setEnabledSubmitBtn(true)      
            currectQuestion('0', questionIndex)
            let questionIndexVal = (questionIndex + 1) % extractedQA.length;
            setQuestionIndex(questionIndexVal)
            currectQuestion('1', questionIndexVal)
          }, 3000);
          

        }
      }
      
    }
    
  };


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
    const allChoices = shuffledChoices.map(choice => choice.choice);
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
            <div className='w-full mcolor-800'>
              <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
              <span><FavoriteIcon/></span>
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





        {extractedQA.length > 0 ? (
          <div>

            {/* question */}
            <div className='relative mt-4 pb-8 text-center text-xl font-medium text-xl mcolor-900'>
              <p className='mbg-300 mcolor-900 w-full rounded-[5px] py-4 mcolor-800'>{hideQuestion !== 'hidden' ? extractedQA[questionIndex].question : `Question...`}</p>
              <button className='mx-3 absolute right-5 top-4' onClick={stateQuestion}><CampaignIcon /></button>
              <button className={`mx-3 absolute right-12 top-4 ${hideQuestion !== 'hidden' ? 'hidden' : ''}`} onClick={hideQuestionBtn}><VisibilityIcon /></button>
              <button className={`mx-3 absolute right-12 top-4 ${unhideQuestion !== 'hidden' ? 'hidden' : ''}`} onClick={unhideQuestionBtn}><VisibilityOffIcon /></button>
            </div>


            {/* functionality buttons */}

            <div className='flex items-center justify-between'>

              {/* hide and unhide all choices */}
              <div>
                <button className={`mcolor-800 mb-3 cursor-pointer text-xl ${unhideAll !== 'hidden' ? '' : 'hidden'}`} onClick={unhideAllBtn}>
                  Unhide All <VisibilityIcon />
                </button>

                <button className={`mcolor-800 mb-3 cursor-pointer text-xl ${hideAll !== 'hidden' ? '' : 'hidden'}`} onClick={hideAllBtn}>
                  Hide All <VisibilityOffIcon />
                </button>
              </div>

              {/* Hide and unhide all */}
              <div>
                <button className={`mcolor-800 mb-3 cursor-pointer text-xl ${unhideAllChoice !== 'hidden' ? '' : 'hidden'}`} onClick={unhideAllChoicesBtn}>
                  Unhide All Choices <VisibilityIcon />
                </button>

                <button className={`mcolor-800 mb-3 cursor-pointer text-xl ${hideAllChoice !== 'hidden' ? '' : 'hidden'}`} onClick={hideAllChoicesBtn}>
                  Hide All Choices <VisibilityOffIcon />
                </button>
              </div>
            </div>


            {/* choices */}
            <form className='grid-result gap-4 mcolor-800'>
            {shuffledChoices.map((choice, index) => (
              <div
                key={index}
                className={`flex items-center justify-center px-5 py-3 text-center choice border-thin-800 rounded-[5px]  

                ${answerSubmitted === true && choice.choice === extractedQA[questionIndex].answer ? 'mbg-700 mcolor-100 ' : 'mbg-200 '}

                ${wrongAnswer === true && choice.choice === answeredWrongVal ? 'bg-red mcolor-100 ' : ''}

                ${wrongAnswer2 === true && choice.choice === answeredWrongVal2 ? 'bg-red mcolor-100 ' : ''} 
                
                `}
                >
                <input
                  type="radio"
                  name="option"
                  value={choice.choice}
                  id={`choice${index}`} 
                  className={`custom-radio cursor-pointer`}
                  onChange={handleRadioChange}
                  checked={selectedChoice === choice.choice} 
                />
                <div className=''>
                  <div className={`flex items-center`}>
                    <label htmlFor={`choice${index}`} className={`mr-5 pt-1 cursor-pointer text-xl ${unhiddenChoice.includes(choice.choice) ? '' : 'hidden'}`}>
                      {choice.choice}
                    </label>

                    <label htmlFor={`choice${index}`} className='ml-1 cursor-pointer text-5xl' onClick={() => hideChoiceBtn(choice.choice)}>
                      {unhiddenChoice.includes(choice.choice) ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </label>
                    <label htmlFor={`choice${index}`} className='ml-2 cursor-pointer text-5xl' onClick={() => {choiceSpeak(choice.choice)}}><CampaignIcon /></label>
                  </div>

                </div>
              </div>
            ))}

            </form>

            {enabledSubmitBtn === true && (
              <div className='flex justify-center mt-8'>
                <button className='w-1/2 py-2 px-5 mbg-700 rounded-[5px] mcolor-100 text-lg' onClick={() => submitAnswer(extractedQA[questionIndex].id)}>Submit Answer</button>
              </div>
            )}
          </div>
        ) : (
          <p className='text-center my-5 text-xl mcolor-500'>Nothing to show</p>
        )}
      </div>
    </div>
  )
}
