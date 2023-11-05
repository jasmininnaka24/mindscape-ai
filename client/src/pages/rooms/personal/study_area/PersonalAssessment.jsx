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
  const [showSubmittedAnswerModal, setShowSubmittedAnswerModal] = useState(false);
  const [generatedAnalysis, setGeneratedAnalysis] = useState('');
  const [showTexts, setShowTexts] = useState(true);

  const [analysisId, setAnalysisId] = useState(0);

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

      if (fetchedData && Array.isArray(fetchedData) && fetchedData.length > 0) {
        setOverAllItems(fetchedData[0].overAllItems)
      }
      
      if (fetchedData && Array.isArray(fetchedData) && fetchedData.length > 0 && fetchedData[0].assessmentScore !== 'none') {
        setAssessmentCountMoreThanOne(true); 
        if (fetchedData.length >= 2) {
          setLastAssessmentScore(fetchedData[1].assessmentScore);
        }
      } else {
        console.error('Invalid or empty data received:', fetchedData);
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


  }, [materialId, questionIndex, showSubmittedAnswerModal])


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
      



      // for pre-text functionality
      if (fetchedData.length === 0) {

        let confidence = (((Math.round(extractedQA.length / 2)) / 8) * 100).toFixed(2);

        let data = {
          dashFor: 'Personal',
          overAllItems: extractedQA.length,
          preAssessmentScore: score,
          assessmentScorePerf: ((score / extractedQA.length) * 100).toFixed(2),
          completionTime: 8,
          confidenceLevel: 8 >= Math.round(extractedQA.length / 2) ? confidence : 100,
          StudyMaterialId: materialId,
          StudyGroupId: null
        }


        const newlyFetchedDashboardData = await axios.post(`http://localhost:3001/DashForPersonalAndGroup/`, data);

        const newlyFetchedDashboardDataValues = newlyFetchedDashboardData.data;

        setAnalysisId(newlyFetchedDashboardDataValues.id);
        setAssessmentCountMoreThanOne(false)


        navigate(`/main/personal/study-area/personal-review/${materialId}`);
      } 
      
      
      else {

        // for 1st assessment functionalitty
        if (fetchedData[0].assessmentScore === 'none') {

          const improvement = Math.max(0, ((score - fetchedData[0].preAssessmentScore) / Math.max(extractedQA.length - fetchedData[0].preAssessmentScore, 1) * 100).toFixed(2));


          let confidence = (((Math.round(extractedQA.length / 2)) / 8) * 100).toFixed(2);


          let data = {
            assessmentScore: score,
            assessmentImp: parseInt(score) === parseInt(fetchedData[0].preAssessmentScore) ? 100 : improvement,
            assessmentScorePerf: ((score / extractedQA.length) * 100).toFixed(2),
            completionTime: 8,
            confidenceLevel: 8 >= Math.round(extractedQA.length / 2) ? confidence : 100,
          }



          const newlyFetchedDashboardData = await axios.put(`http://localhost:3001/DashForPersonalAndGroup/update-data/${fetchedData[0].id}`, data);
          const newlyFetchedDashboardDataValues = newlyFetchedDashboardData.data;

          setAnalysisId(newlyFetchedDashboardDataValues.id);

          setOverAllItems(newlyFetchedDashboardDataValues.overAllItems);
          setPreAssessmentScore(newlyFetchedDashboardDataValues.preAssessmentScore);
          setAssessmentScore(newlyFetchedDashboardDataValues.assessmentScore);
          setAssessmentImp(newlyFetchedDashboardDataValues.assessmentImp);
          setAssessmentScorePerf(newlyFetchedDashboardDataValues.assessmentScorePerf);
          setCompletionTime(newlyFetchedDashboardDataValues.completionTime);
          setConfidenceLevel(newlyFetchedDashboardDataValues.confidenceLevel);
          setOverAllPerformance((parseFloat(newlyFetchedDashboardDataValues.assessmentImp) + parseFloat(newlyFetchedDashboardDataValues.assessmentScorePerf) + parseFloat(newlyFetchedDashboardDataValues.confidenceLevel) + 90) / 4);
          
          setAssessmentCountMoreThanOne(false)
        } 
        
        
        
        
        // for more than one assesssment functionality
        else {


          const improvement = Math.max(0, ((score - fetchedData[0].assessmentScore) / Math.max(extractedQA.length - fetchedData[0].assessmentScore, 1) * 100).toFixed(2));


          let confidence = (((Math.round(extractedQA.length / 2)) / 8) * 100).toFixed(2);
  
          let data = {
            dashFor: 'Personal',
            overAllItems: extractedQA.length,
            preAssessmentScore: fetchedData[0].preAssessmentScore,
            assessmentScore: score,
            assessmentImp: parseInt(score) === parseInt(fetchedData[0].assessmentScore) ? 100 : improvement,
            assessmentScorePerf: ((score / extractedQA.length) * 100).toFixed(2),
            completionTime: 8,
            confidenceLevel: 8 >= Math.round(extractedQA.length / 2) ? confidence : 100,
            numOfTakes: fetchedData[0].numOfTakes + 1,
            StudyMaterialId: materialId,
            StudyGroupId: null
          }

          setLastAssessmentScore(fetchedData[0].assessmentScore)
          setAssessmentImp(assessmentImp.assessmentImp)
  
          const newlyFetchedDashboardData = await axios.post(`http://localhost:3001/DashForPersonalAndGroup/`, data);
          const newlyFetchedDashboardDataValues = newlyFetchedDashboardData.data;



          setAnalysisId(newlyFetchedDashboardDataValues.id);

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
        setIsAssessmentDone(true);
      }
    }
  };


  const generateAnalysis = async (id) => {

    setShowTexts(false)

    const generateAnalysisUrl = 'https://064a-34-83-254-120.ngrok.io/generate_analysis';

    
    let predictionText = overAllPerformance.toFixed(2) >= 90 ? 'ready' : 'not yet ready';

    let predictionVal = overAllPerformance.toFixed(2);

    let studyProfeciencyTarget = 90;

    
    const previousSavedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment/${materialId}`);
    const fetchedData = previousSavedData.data;    
    
    let lastExamStr = 'Pre-Assessment';
    let lastAssessmentScore = 0;
    let assessmentScore = 0; // Initialize to 0 or any default value if necessary
    let overAllItems = 0; // Initialize to 0 or any default value if necessary
    let assessmentImp = 0; // Initialize to 0 or any default value if necessary
    let confidenceLevel = 0; // Initialize to 0 or any default value if necessary

    
    if (fetchedData.length === 1) {
      lastExamStr = 'Pre-Assessment';
      lastAssessmentScore = fetchedData[0].preAssessmentScore;
      assessmentScore = fetchedData[0].preAssessmentScore;
      overAllItems = fetchedData[0].overAllItems;
      confidenceLevel = fetchedData[0].confidenceLevel;
      assessmentImp = fetchedData[0].assessmentImp;
      
      setAssessmentCountMoreThanOne(false)
    } else if (fetchedData.length > 1) {
      lastExamStr = 'Assessment';
      lastAssessmentScore = fetchedData[0].assessmentScore;
      assessmentScore = fetchedData[0].assessmentScore;
      overAllItems = fetchedData[0].overAllItems;
      assessmentImp = fetchedData[0].assessmentImp;
      confidenceLevel = fetchedData[0].confidenceLevel;

      setAssessmentCountMoreThanOne(true)
    }
    
    let data = {
      last_exam: lastExamStr,
      last_assessment_score: lastAssessmentScore,
      assessment_score: assessmentScore,
      exam_num_of_items: overAllItems,
      assessment_imp: assessmentImp,
      confidence_level: confidenceLevel,
      prediction_val: predictionVal,
      prediction_text: predictionText,
      target: studyProfeciencyTarget,
    }
    
    console.log(fetchedData.length);
    console.log(fetchedData);
    console.log(data);
    
    const response = await axios.post(generateAnalysisUrl, data);
    console.log(response.data);
    let generatedAnalysisResponse = (response.data.generated_analysis).replace('\n\n\n\n\n', '');
    setGeneratedAnalysis(generatedAnalysisResponse)

    const newlyFetchedDashboardData = await axios.put(`http://localhost:3001/DashForPersonalAndGroup/set-update-analysis/${id}`, {analysis: generatedAnalysisResponse});
    const newlyFetchedDashboardDataValues = newlyFetchedDashboardData.data;

    
    setAnalysisId(newlyFetchedDashboardDataValues.id);

    setOverAllItems(newlyFetchedDashboardDataValues.overAllItems);
    setPreAssessmentScore(newlyFetchedDashboardDataValues.preAssessmentScore);
    setAssessmentScore(newlyFetchedDashboardDataValues.assessmentScore);
    setAssessmentImp(newlyFetchedDashboardDataValues.assessmentImp);
    setAssessmentScorePerf(newlyFetchedDashboardDataValues.assessmentScorePerf);
    setCompletionTime(newlyFetchedDashboardDataValues.completionTime);
    setConfidenceLevel(newlyFetchedDashboardDataValues.confidenceLevel);
    setOverAllPerformance((parseFloat(newlyFetchedDashboardDataValues.assessmentImp) + parseFloat(newlyFetchedDashboardDataValues.assessmentScorePerf) + parseFloat(newlyFetchedDashboardDataValues.confidenceLevel) + 90) / 4);



    setShowAnalysis(true)
    setShowAssessment(false);
    setShowSubmittedAnswerModal(false);
  }
  

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
            <div>

              <div>
                <p className='text-center mcolor-500 font-medium mb-8 text-xl'>Your score is: </p>
                <p className='text-center text-6xl font-bold mcolor-800 mb-20'>{score}/{overAllItems}</p>

                <div className=' flex items-center justify-center gap-5'>
                  <button
                    className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4'
                    onClick={() => {
                      console.log('button clicked');
                      setShowSubmittedAnswerModal(true);
                    }}
                  >
                    Analyze the Data
                  </button>

                  <Link to={`/main/personal/study-area/personal-review/${materialId}`} className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4 text-center'>
                    <button>Back to Study Area</button>
                  </Link>

                  <button className='mbg-800 mcolor-100 px-5 py-3 rounded-[5px] w-1/4'>View Analytics</button>            

                </div>
              </div>



              {showSubmittedAnswerModal === true && (
                <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                  <div className='flex items-center justify-center h-full'>
                    <div className='relative mbg-100 min-h-[40vh] w-1/2 z-10 relative p-10 rounded-[5px]'>

                    {showTexts === true ? (
                      <div>
                        <p className='text-center text-xl font-medium mcolor-800 mt-5'>Kindly be advised that the data analysis process by the system AI may require 2-3 minutes, depending on your internet speed. Would you be comfortable waiting for that duration?</p>

                        <div className='w-full absolute bottom-10 flex items-center justify-center left-0 gap-4'>

                          <button className='mbg-200 border-thin-800 px-5 py-2 rounded-[5px]' onClick={() => {
                            setShowSubmittedAnswerModal(false);
                          }} >No</button>


                          <button className='mbg-800 mcolor-100 border-thin-800 px-5 py-2 rounded-[5px]' onClick={() => generateAnalysis(analysisId)}>Yes</button>
                        </div>
                      </div>
                    ) : (
                      <div class="loading-container">
                        <p class="loading-text mcolor-900">Analyzing data...</p>
                        <div class="loading-spinner"></div>
                      </div>                    
                    )}
                    </div>
                  </div>
                </div>

          
              )}
            </div>
          )}
        </div>
      )}

      {showAnalysis === true && (
        <div className='mcolor-800 container'>

          <div className='mt-14 flex items-center justify-between'>
            <div>
              <p className='text-center mx-10 mb-16 text-2xl'>You have a substantial <span className='font-bold'>{overAllPerformance.toFixed(2)}%</span> probability of success of taking the real-life exam and that the analysis classifies that you are <span className='font-bold'>{overAllPerformance.toFixed(2) >= 90 ? 'ready' : 'not yet ready'}</span> to take it as to your preference study profeciency target is <span className='font-bold'>90%</span>.</p>

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



        {generatedAnalysis !== '' && (
          <div>
            <div className='mt-24'>
              <p className='mb-5 font-bold text-2xl text-center'>ANALYSIS</p>
              <p className='text-center text-xl mb-10'>{generatedAnalysis}</p>
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
