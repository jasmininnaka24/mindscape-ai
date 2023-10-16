import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CampaignIcon from '@mui/icons-material/Campaign';


export const PersonalReviewerPageComp = (props) => {

  const { typeOfLearner, materialId } = props;

  const [questionIndex, setQuestionIndex] = useState(0)
  const [extractedQA, setQA] = useState({});
  const [extractedChoices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [failCount, setFailCount] = useState(2);
  const [submittedAnswer, setSubmittedAnswer] = useState("");
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
  
          // Speak the question after setting the state
        } else {
          // Handle the case where there are no questions or invalid questionIndex
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
  

  if (!extractedQA[questionIndex]) {
    return <div>Loading...</div>; 
  }

  const handleRadioChange = (event) => {
    setSelectedChoice(event.target.value);
    console.log(event.target.value);
    speechSynthesis.speak(new SpeechSynthesisUtterance(event.target.value));
  };
  
  const stateQuestion = () => {
    speechSynthesis.speak(new SpeechSynthesisUtterance(extractedQA[questionIndex].question));
  }

  const failCountDefault = (num, val) => {
    let currentFailCount = num
    let submittedAnswerVal = val
    setFailCount(currentFailCount)
    setSubmittedAnswer(submittedAnswerVal)
  }

  const submitAnswer = () => {
    if(selectedChoice === extractedQA[questionIndex].answer){
      alert('Correct')
      setSubmittedAnswer("")
      failCountDefault(2, "")
      setPoints(points + 1)
      let questionIndexVal = (questionIndex + 1) % extractedQA.length;
      setQuestionIndex(questionIndexVal)
    } else {
      if(failCount !== 0) {
        alert('Wrong')
        let currentFailCount = failCount - 1
        failCountDefault(currentFailCount, "")
        if(currentFailCount === 0) {
          setTimeout(() => {
            setSubmittedAnswer("")
            failCountDefault(2, "")
          }, 1000);
        }
      } else {
        let questionIndexVal = (questionIndex + 1) % extractedQA.length;
        setQuestionIndex(questionIndexVal)
      }
      
    }
    
  };


  return (
    <div className='py-8'>
      <div>
        <span className='px-5 py-2 mbg-200 mcolor-800 border-thin-800 rounded-[5px]'>{typeOfLearner} Learner</span>

        <div className='relative mt-10 pb-8 text-center text-xl font-medium text-xl mcolor-900'>
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
                />
                <label htmlFor={`choice${index}`} className='ml-1 cursor-pointer text-5xl'><CampaignIcon /></label>
              </div>
            );
          })}
        </form>

        <div className='flex justify-center mt-8'>
          <button className='w-1/2 py-2 px-5 mbg-700 rounded-[5px] mcolor-100 text-lg' onClick={submitAnswer}>Submit Answer</button>
        </div>

      </div>
    </div>
  )
}
