import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';


export const PersonalAssessment = () => {

  const { materialId } = useParams();

  const navigate = useNavigate();

  // hooks
  const [materialTitle, setMaterialTitle] = useState('')
  const [materialCategory, setMaterialCategory] = useState('')
  const [extractedQA, setQA] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0)
  const [generatedChoices, setChoices] = useState([]);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState([]);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAssessmentDone, setIsAssessmentDone] = useState(false);
  const [showAssessment, setShowAssessment] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [overAllItems, setOverAllItems] = useState(0);
  const [preAssessmentScore, setPreAssessmentScore] = useState(0);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [assessmentImp, setAssessmentImp] = useState(0);
  const [assessmentScorePerf, setAssessmentScorePerf] = useState(0);
  const [completionTime, setCompletionTime] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [overAllPerformance, setOverAllPerformance] = useState(0);
  const [assessmentCountMoreThanOne, setAssessmentCountMoreThanOne] = useState(false);
  const [lastAssessmentScore, setLastAssessmentScore] = useState(0);

  const UserId = 1;


  useEffect(() => {
    const fetchData = async () => {

      const materialTitleResponse = await axios.get(`http://localhost:3001/studyMaterial/study-material-personal/Personal/${UserId}/${materialId}`)
      setMaterialTitle(materialTitleResponse.data.title)
      

      const materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-lastmaterial/${materialTitleResponse.data.StudyMaterialsCategoryId}/Personal/${UserId}`)
      setMaterialCategory(materialCategoryResponse.data.category)

      const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}`);
      const fetchedQA = materialResponse.data;


      const previousSavedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment/${materialId}`);
      const fetchedData = previousSavedData.data;

      if(fetchedData[0].assessmentScore !== 'none') {
        setAssessmentCountMoreThanOne(true); 
        if(fetchedData.length >= 2) {
          setLastAssessmentScore(fetchedData[1].assessmentScore)
        }
      } 

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
                return item; 
              }
            }
          }
          return item; 
        })
      );
    
      setQA(updatedData);




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

        } catch (error) {
          console.error('Error processing choices:', error);
        }
      }

      
    }

    fetchData();


  }, [materialId, questionIndex])


  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };


  const handleRadioChange = (choice, index) => {
    const selectedChoices = [...selectedChoice];
    selectedChoices[index] = choice;
    setSelectedChoice(selectedChoices);
  };

  const submitAnswer = async () => {
    if (selectedChoice.some(answer => answer === '' || answer === undefined)) {
      alert('There are some empty fields. Answer all items.');
    } else {
      const score = selectedChoice.reduce((totalScore, item, index) => {
        return item.toLowerCase() === extractedQA[index].answer.toLowerCase() ? totalScore + 1 : totalScore;
      }, 0);
  
      const previousSavedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment/${materialId}`);
      const fetchedData = previousSavedData.data;
  
      if (fetchedData.length === 0) {
        let data = {
          dashFor: 'Personal',
          overAllItems: extractedQA.length,
          preAssessmentScore: score,
          StudyGroupId: null,
          StudyMaterialId: materialId,
        }
        axios.post(`http://localhost:3001/DashForPersonalAndGroup/`, data);
        navigate(`/main/personal/study-area/personal-review/${materialId}`);
      } else {
        if (fetchedData[0].assessmentScore === 'none') {
          let data = {
            assessmentScore: score,
            assessmentImp: ((score - fetchedData[0].preAssessmentScore) / (extractedQA.length - fetchedData[0].preAssessmentScore) * 100).toFixed(2),
            assessmentScorePerf: ((score / extractedQA.length) * 100).toFixed(2),
            completionTime: 8,
            confidenceLevel: (((Math.round(13 / 2)) / score) * 100).toFixed(2),
          }
          axios.put(`http://localhost:3001/DashForPersonalAndGroup/update-data/${fetchedData[0].id}`, data);
        } else {
          let improvement = Math.max(0, ((score - fetchedData[0].assessmentScore) / Math.max(extractedQA.length - fetchedData[0].assessmentScore, 1) * 100).toFixed(2));
          let confidence = (((Math.round(extractedQA.length / 2)) / 8) * 100).toFixed(2);
  
          let data = {
            dashFor: 'Personal',
            overAllItems: extractedQA.length,
            preAssessmentScore: fetchedData[0].preAssessmentScore,
            assessmentScore: score,
            assessmentImp: improvement,
            assessmentScorePerf: ((score / extractedQA.length) * 100).toFixed(2),
            completionTime: 8,
            confidenceLevel: 8 >= Math.round(extractedQA.length / 2) ? confidence : 100,
            numOfTakes: fetchedData[0].numOfTakes + 1,
            StudyMaterialId: materialId,
            StudyGroupId: null
          }
  
          const newlyFetchedDashboardData = await axios.post(`http://localhost:3001/DashForPersonalAndGroup/`, data);
          const newlyFetchedDashboardDataValues = newlyFetchedDashboardData.data;
  
          setOverAllItems(newlyFetchedDashboardDataValues.overAllItems);
          setPreAssessmentScore(newlyFetchedDashboardDataValues.preAssessmentScore);
          setAssessmentScore(newlyFetchedDashboardDataValues.assessmentScore);
          setAssessmentImp(newlyFetchedDashboardDataValues.assessmentImp);
          setAssessmentScorePerf(newlyFetchedDashboardDataValues.assessmentScorePerf);
          setCompletionTime(newlyFetchedDashboardDataValues.completionTime);
          setConfidenceLevel(newlyFetchedDashboardDataValues.confidenceLevel);
          setOverAllPerformance((parseFloat(newlyFetchedDashboardDataValues.assessmentImp) + parseFloat(newlyFetchedDashboardDataValues.assessmentScorePerf) + parseFloat(newlyFetchedDashboardDataValues.confidenceLevel) + 90) / 4);
  
          if (newlyFetchedDashboardDataValues.length > 0 && newlyFetchedDashboardDataValues[0].assessmentScore !== 'none') {
            setAssessmentCountMoreThanOne(true); 
            if (newlyFetchedDashboardDataValues.length >= 2) {
              setLastAssessmentScore(newlyFetchedDashboardDataValues[1].assessmentScore);
            }
          }
        }
  
        setScore(score);
        setIsSubmitted(true);
        setShowAssessment(false);
        setShowAnalysis(true);
        setIsAssessmentDone(true);
      }
    }
  };
  

  return (
    <div className='py-8 poppins mbg-200'>


      {showAssessment === true && (
        <div className='container '>
          <p className='text-center text-3xl font-medium mcolor-700 pt-5'>Assessment for {materialTitle} of {materialCategory}</p>

          <br /><br />
          <br /><br />

          {Array.isArray(extractedQA) && shuffledChoices.length > 0 && extractedQA.map((item, index) => (
            <div key={index} className='mb-20'>
              <p className='mcolor-900 text-xl mb-8'>{index + 1}. {item.question}</p>
              <ul className='grid-result gap-4 mcolor-800'>
                {item.quizType === 'MCQA' && (
                  shuffledChoices[index].map((choice, choiceIndex) => (
                    <div
                    key={choiceIndex}
                    className={`flex items-center justify-center px-5 py-3 text-center choice rounded-[5px] 
                    ${(isSubmitted === true && extractedQA[index].answer === choice) ? 'border-thin-800-correct' : 
                    (isSubmitted === true && selectedChoice[index] !== extractedQA[index].answer && selectedChoice[index] === choice) ? 'border-thin-800-wrong' : 'border-thin-800'}`}
                    >

                      <input
                        type="radio"
                        name={`option-${index}`}
                        value={choice}
                        id={`choice-${choiceIndex}-${index}`}
                        className={`custom-radio cursor-pointer`}
                        onChange={() => handleRadioChange(choice, index)}
                        checked={selectedChoice[index] === choice}
                        disabled={isSubmitted} 
                        />

                      <div className=''>
                        <div className={`flex items-center`}>
                          <label htmlFor={`choice-${choiceIndex}-${index}`} className={`mr-5 pt-1 cursor-pointer text-xl`}>
                            {choice}
                          </label>
                        </div>
                      </div>
                    </div>
                  ))
                  )}
              </ul>
              {item.quizType === 'ToF' && (
                <div className='grid-result gap-4 mcolor-800'>
                    <div
                      key={1}
                      className={`flex items-center justify-center px-5 py-3 text-center choice rounded-[5px] 
                      ${(isSubmitted === true && extractedQA[index].answer === 'True') ? 'border-thin-800-correct' : 
                      (isSubmitted === true && selectedChoice[index] !== extractedQA[index].answer && selectedChoice[index] === 'True') ? 'border-thin-800-wrong' : 'border-thin-800'}`}
                      >

                    <input
                      type="radio"
                      name={`option-${index}`}
                      value={'True'}
                      id={`choice-${1}-${index}`}
                      className={`custom-radio cursor-pointer`}
                      onChange={() => handleRadioChange('True', index)}
                      checked={selectedChoice[index] === 'True'}
                      disabled={isSubmitted} 
                      />


                    <div className=''>
                      <div className={`flex items-center`}>
                        <label htmlFor={`choice-${1}-${index}`} className={`mr-5 pt-1 cursor-pointer text-xl`}>
                          {'True'}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div
                      key={2}
                      className={`flex items-center justify-center px-5 py-3 text-center choice rounded-[5px] 
                      ${(isSubmitted === true && extractedQA[index].answer === 'False') ? 'border-thin-800-correct' : 
                      (isSubmitted === true && selectedChoice[index] !== extractedQA[index].answer && selectedChoice[index] === 'False') ? 'border-thin-800-wrong' : 'border-thin-800'}`}
                      >

                      <input
                        type="radio"
                        name={`option-${index}`}
                        value={'False'}
                        id={`choice-${2}-${index}`}
                        className={`custom-radio cursor-pointer`}
                        onChange={() => handleRadioChange('False', index)}
                        checked={selectedChoice[index] === 'False'}
                        disabled={isSubmitted} 
                        />


                      <div className=''>
                        <div className={`flex items-center`}>
                          <label htmlFor={`choice-${2}-${index}`} className={`mr-5 pt-1 cursor-pointer text-xl`}>
                            {'False'}
                          </label>
                        </div>
                      </div>
                    </div>
                </div>
              )}
              {(item.quizType === 'Identification' || item.quizType === 'FITB') && (
                <div>
                  <input
                    className={`mb-5 w-full px-5 py-5 text-lg text-center choice rounded-[5px] ${
                      isSubmitted && selectedChoice[index] && extractedQA[index] &&
                      selectedChoice[index].toLowerCase() === extractedQA[index].answer.toLowerCase()
                        ? 'border-thin-800-correct'
                        : isSubmitted && selectedChoice[index] && extractedQA[index] &&
                        selectedChoice[index].toLowerCase() !== extractedQA[index].answer.toLowerCase()
                        ? 'border-thin-800-wrong'
                        : 'border-thin-800'
                      }`}
                      type="text"
                      placeholder='Answer here...'
                      onChange={(event) => handleRadioChange(event.target.value, index)}
                      disabled={isSubmitted} 
                      />

                  <p className='correct-color text-center text-xl'>
                    {(isSubmitted === true && selectedChoice[index] &&
                      extractedQA[index] &&
                      selectedChoice[index].toLowerCase() !== extractedQA[index].answer.toLowerCase()) && extractedQA[index].answer}
                  </p>
                </div>


                )}
            </div>
          ))}

          {(showAnalysis === false && isAssessmentDone === false) && (
            <div className='flex justify-center mt-8'>
              <button className='w-1/2 py-2 px-5 mbg-800 rounded-[5px] mcolor-100 text-lg' onClick={() => submitAnswer(extractedQA[questionIndex].id)}>Submit Answer</button>
            </div>
          )}

          {(showAnalysis === false && isAssessmentDone === true) && (
            <div className=' flex items-center justify-center gap-5'>
              <button className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4' onClick={() => {
                setShowAssessment(false)
                setShowAnalysis(true)
              }}>View Analysis</button>

              <Link to={`/main/personal/study-area/personal-review/${materialId}`} className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4 text-center'>
                <button>Back to Study Area</button>
              </Link>

              <button className='mbg-800 mcolor-100 px-5 py-3 rounded-[5px] w-1/4'>View Analytics</button>            
            </div>
          )}
        </div>
      )}

      {showAnalysis === true && (
        <div className='mcolor-800 container'>

          <div className='min-h-[90vh] flex items-center justify-between'>
            <div>
              <p className='text-center mx-10 mb-20 text-2xl'>Based in the available information, the analysis classifies that you are <span className='font-bold'>{overAllPerformance.toFixed(2) >= 90 ? 'ready' : 'not yet ready'}</span> to take a real-life exam. You have a substantial <span className='font-bold'>{overAllPerformance.toFixed(2)}%</span> probability of success.</p>

              <br /><br />

              <div className='flex items-center justify-between'>
                <div className='w-full'>
                  
                </div>
                <div className='w-full'>

                  <p className='text-2xl'>{assessmentCountMoreThanOne === true ? 'Last Assessment' : 'Pre-assessment'} score: {assessmentCountMoreThanOne === true ? lastAssessmentScore : preAssessmentScore}/{extractedQA.length}</p>
                  <p className='text-2xl'>Assessment score: {assessmentScore}/{extractedQA.length}</p>
                  <p className='text-2xl font-bold'>Assessment improvement: {assessmentImp}%</p>
                  <p className='text-2xl font-bold'>Assessment score performance: {assessmentScorePerf}%</p>

                  <br /><br />
                  <p className='text-2xl'>Completion time: {completionTime} min{(completionTime > 1) ? 's' : ''}</p>
                  <p className='text-2xl font-bold'>Confidence level: {confidenceLevel}%</p>

                </div>
              </div>
            </div>
          </div>


          <div className='mt-10'>
            <p className='mb-5 font-bold text-2xl text-center'>ANALYSIS</p>
            <p className='text-center text-xl mb-10'>The Assessment Improvement of {assessmentImp}% and Assessment Score performance of {assessmentScorePerf}% indicate significant progress and a high level of achievement in the assessment. However, the Confidence level of 55.56% suggests that there is room for improvement in effective tme utilization for studying.</p>
            <p className='text-center text-xl mb-10'>The data analysis classifies that you are ready to take a real-life exam. as the probability of success is 73.52%, which falls show of the passing grade of 57%. While there has been improvement shown in the assessment, there are still areas that need strengthening.To increase you chance of success. focus on improving your understanding of weak topics identified in the pre-assessment and maximize your study time effectively.</p>
          </div>

          {completionTime < overAllItems && (
            <div className='mt-20'>
              <p className='mb-5 font-bold text-2xl text-center'>Recommendations</p>

              <p className='text-center text-xl mb-10'>
                <CheckIcon className='mr-2' />
                Challenge yourself to finish the assessment under{' '}
                <span className='font-bold'>
                  {`${Math.floor(overAllItems / 120) > 0 ? (Math.floor(overAllItems / 120) === 1 ? '1 hour' : Math.floor(overAllItems / 120) + ' hours') + ' ' : ''}${Math.floor((overAllItems % 120) / 2) > 0 ? (Math.floor((overAllItems % 120) / 2) === 1 ? '1 min' : Math.floor((overAllItems % 120) / 2) + ' mins') + ' ' : ''}${((overAllItems % 2) * 30) > 0 ? ((overAllItems % 2) * 30) + ' second' + (((overAllItems % 2) * 30) !== 1 ? 's' : '') : ''}`}
                </span> 
                {' '}
                to increase the confidence level
              </p>

            </div>
          )}

          <div className='mt-32 flex items-center justify-center gap-5'>
            <button className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4' onClick={() => {
              setShowAssessment(true)
              setShowAnalysis(false)
            }}>Review Answers</button>

            <Link to={`/main/personal/study-area/personal-review/${materialId}`} className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4 text-center'>
              <button>Back to Study Area</button>
            </Link>      

            <button className='mbg-800 mcolor-100 px-5 py-3 rounded-[5px] w-1/4'>View Analytics</button>
          </div>

        </div>
      )}

    </div>
  )
}
