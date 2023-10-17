import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CampaignIcon from '@mui/icons-material/Campaign';
import { useParams } from 'react-router-dom';
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import FavoriteIcon from '@mui/icons-material/Favorite';

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
        const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}`);
        const fetchedQA = materialResponse.data;
        setQA(fetchedQA);
  
        if (fetchedQA.length > 0 && questionIndex < fetchedQA.length) {
          const choicesResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialId}/${fetchedQA[questionIndex].id}`);
          setChoices(choicesResponse.data);
  
          let shuffledArray = shuffleArray([...choicesResponse.data, { choice: fetchedQA[questionIndex].answer }])
          setShuffledChoices(shuffledArray);
  
          const unattemptedCount = fetchedQA.filter(question => question.response_state === 'Unattempted').length;
          const correctCount = fetchedQA.filter(question => question.response_state === 'Correct').length;
          const wrongCount = fetchedQA.filter(question => question.response_state === 'Wrong').length;
          setUnattemptedCounts(unattemptedCount);
          setCorrectAnswerCounts(correctCount);
          setWrongAnswerCounts(wrongCount);

          const questionId = fetchedQA.filter(question => question.stoppedAt === '1')[0].id;

          const foundIndex = fetchedQA.findIndex(question => question.id === questionId);
          
          if (foundIndex !== -1) {
            setQuestionIndex(foundIndex);
            console.log(foundIndex);
          } else {
            console.error('Question not found in fetchedQA array');
          }
          


        } else {
          console.error("No questions available or invalid question index.");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
  
    fetchData();
  
    // Clean up the speech synthesis on component unmount or when question changes
    return () => {
      speechSynthesis.cancel();
    };
  }, [materialId, questionIndex, speechSynthesis]);

  
  

  const handleRadioChange = (event) => {
    setSelectedChoice(event.target.value);
    console.log(event.target.value);
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
      alert('Correct')
      setSubmittedAnswer("")
      setChanceLeft(2)
      setPoints(points + 1)
      currectQuestion('0', questionIndex)
      let questionIndexVal = (questionIndex + 1) % extractedQA.length;
      setQuestionIndex(questionIndexVal);
      currectQuestion('1', questionIndexVal)
      currectCounts(choice, "Correct")


    } else {
      if(chanceLeft !== 0) {
        alert('Wrong')
        let currentChanceCount = chanceLeft - 1
        setChanceLeft(currentChanceCount)
        if(currentChanceCount === 0) {
          setChanceLeft(2)
          currectCounts(choice, "Wrong")
          setTimeout(() => {
            setSubmittedAnswer("")
          }, 1000);
          currectQuestion('0', questionIndex)
          let questionIndexVal = (questionIndex + 1) % extractedQA.length;
          setQuestionIndex(questionIndexVal)
          currectQuestion('1', questionIndexVal)
        }
      }
      
    }
    
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


        {/* response statements counts */}
        <div className='mt-16 flex items-center justify-between'>
          <span className='mcolor-800 font-medium text-lg'>Unattempted: {unattemptedCounts}</span>
          <span className='mcolor-800 font-medium text-lg'>Correct Answer: {correctAnswerCounts}</span>
          <span className='mcolor-800 font-medium text-lg'>Wrong Answer: {wrongAnswerCounts}</span>
        </div>



        <div className='relative mt-4 pb-8 text-center text-xl font-medium text-xl mcolor-900'>
          <p className='mbg-300 mcolor-900 w-full rounded-[5px] py-4 mcolor-800'>Question {questionIndex + 1}</p>
          <button className='mx-3 absolute right-5 top-4' onClick={stateQuestion}><CampaignIcon /></button>
        </div>

        <form className='grid-result gap-4'>
          {shuffledChoices.map((choice, index) => {
            return (
              <div
                key={index}
                className='flex justify-center mbg-200 px-5 py-3 text-5xl text-center mcolor-800 choice border-thin-800 rounded-[5px]'
              >
                <input
                  type="radio"
                  name="option"
                  value={choice.choice}
                  id={`choice${index}`} 
                  className='custom-radio mt-1 cursor-pointer hidden'
                  onChange={handleRadioChange}
                  checked={selectedChoice === choice.choice} 
                  onClick={() => {choiceSpeak(choice.choice)}}
                />
                <label htmlFor={`choice${index}`} className='ml-1 cursor-pointer text-5xl'><CampaignIcon /></label>
              </div>
            );
          })}
        </form>

        <div className='flex justify-center mt-8'>
          <button className='w-1/2 py-2 px-5 mbg-700 rounded-[5px] mcolor-100 text-lg' onClick={() => submitAnswer(extractedQA[questionIndex].id)}>Submit Answer</button>
        </div>

      </div>
    </div>
  )
}
