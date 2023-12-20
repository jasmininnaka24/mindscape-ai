import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { BarChartForAnalysis } from '../charts/BarChartForAnalysis';

import { useUser } from '../../UserContext';

export const Analysis = () => {

  const { SERVER_URL } = useUser();

  const { groupId, categoryID, materialID, dashID } = useParams();

  let studyProfeciencyTarget = 90;

  // hooks
  const [fetchedData, setFetchedData] = useState([])
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
  const [generatedAnalysis, setGeneratedAnalysis] = useState('');

  const [fetchedID, setFetchedID] = useState(0)
  const UserId = 1;

  useEffect(() => {
    const fetchData = async () => {

      const materialResponse = await axios.get(`${'http://localhost:3001'}/DashForPersonalAndGroup/get-dash-data/${dashID}`);
      const fetchedQA = materialResponse.data;

      setPreAssessmentScore(fetchedQA.preAssessmentScore)
      setAssessmentScore(fetchedQA.assessmentScore)
      setOverAllItems(fetchedQA.overAllItems)
      setAssessmentImp(fetchedQA.assessmentImp)
      setAssessmentScorePerf(fetchedQA.assessmentScorePerf)
      setCompletionTime(fetchedQA.completionTime)
      setConfidenceLevel(fetchedQA.confidenceLevel)
      setGeneratedAnalysis(fetchedQA.analysis)
      setOverAllPerformance(((parseFloat(fetchedQA.assessmentImp) + parseFloat(fetchedQA.assessmentScorePerf) + parseFloat(fetchedQA.confidenceLevel)) / 3).toFixed(2))


      const previousSavedData = await axios.get(`${'http://localhost:3001'}/DashForPersonalAndGroup/get-assessments/${materialID}`);
      const fetchedData = previousSavedData.data;
      setFetchedData(fetchedData);

      const fetchedId = fetchedData.map((item) => item.id).pop();

      setFetchedID(fetchedId);



      if (fetchedData && Array.isArray(fetchedData) && fetchedData.length > 0 && fetchedData[0].assessmentScore !== 'none') {
        if (fetchedData.length >= 2) {
          setLastAssessmentScore(fetchedData[1].assessmentScore);
          setAssessmentCountMoreThanOne(true); 
        }
      } else {
        console.error('Invalid or empty data received:', fetchedData);
      }
    }

    fetchData();

    


  }, [])



  return (
    <div className='py-8 poppins mbg-200 mcolor-900 min-h-[100vh]' id='currSec'>
      <div className='mcolor-800 container'>

        <div className='mt-14 flex items-center justify-between'>
          <div>
            <p className='text-center mx-10 mb-16 text-2xl'>You have a substantial <span className='font-bold'>{overAllPerformance}%</span> probability of success of taking the real-life exam and that the analysis classifies that you are <span className='font-bold'>{overAllPerformance >= 90 ? 'ready' : 'not yet ready'}</span> to take it as to your preference study profeciency target is <span className='font-bold'>90%</span>.</p>

            <br /><br />


            <div className='flex items-center justify-center'>
              <div className='w-full ml-14'>
                {parseInt(fetchedID) === parseInt(dashID) ? (
                  <BarChartForAnalysis labelSet={["Pre-Assessment", "Latest Assessment"]} dataGathered={[preAssessmentScore, assessmentScore]} maxBarValue={overAllItems} />
                  ) : (
                  <BarChartForAnalysis labelSet={["Pre-Assessment", "Last Assessment", "Latest Assessment"]} dataGathered={[preAssessmentScore, lastAssessmentScore, assessmentScore]} maxBarValue={overAllItems} />
                )}
              </div>
              <div className='w-full ml-12'>

                <p className='text-2xl'>{parseInt(fetchedID) !== parseInt(dashID) ? 'Last Assessment' : 'Pre-assessment'} score: {parseInt(fetchedID) !== parseInt(dashID) ? lastAssessmentScore : preAssessmentScore}/{overAllItems}</p>                
                
                <p className='text-2xl'>Assessment score: {assessmentScore}/{overAllItems}</p>
                <p className='text-2xl font-bold'>Assessment improvement: {assessmentImp}%</p>
                <p className='text-2xl font-bold'>Assessment score performance: {assessmentScorePerf}%</p>

                <br /><br />
                <p className='text-2xl'>Completion time: {completionTime}</p>
                <p className='text-2xl font-bold'>Confidence level: {confidenceLevel}%</p>

              </div>
            </div>
          </div>
        </div>



        <div>
          <div className='mt-24'>
            <p className='mb-5 font-bold text-2xl text-center'>ANALYSIS</p>
            <p className='text-center text-xl mb-10'>{generatedAnalysis}</p>
          </div>


        {(completionTime >= Math.floor(overAllItems/2) || assessmentImp < studyProfeciencyTarget || assessmentScorePerf < studyProfeciencyTarget) && (
          <div className='mt-20'>
            <p className='mb-5 font-bold text-2xl text-center'>Recommendations</p>

            {completionTime >= Math.floor(overAllItems/2) && (
              <p className='text-center text-xl mb-4'>
                <CheckIcon className='mr-2' />
                Challenge yourself to finish the assessment under{' '}
                <span className='font-bold'>
                  {`${Math.floor(overAllItems / 120) > 0 ? (Math.floor(overAllItems / 120) === 1 ? '1 hour' : Math.floor(overAllItems / 120) + ' hours') + ' ' : ''}${Math.floor((overAllItems % 120) / 2) > 0 ? (Math.floor((overAllItems % 120) / 2) === 1 ? '1 min' : Math.floor((overAllItems % 120) / 2) + ' mins') + ' ' : ''}${((overAllItems % 2) * 30) > 0 ? ((overAllItems % 2) * 30) + ' second' + (((overAllItems % 2) * 30) !== 1 ? 's' : '') : ''}`}
                </span> 
                {' '}
                to increase the confidence level until it gets to 100%.
              </p>
            )}


            {assessmentImp < studyProfeciencyTarget && (
              <p className='text-center text-xl mb-4'>
                <CheckIcon className='mr-2' />
                You may consider revisiting the lesson/quiz practice to enhance your understanding, which will lead to an increase in your <span className='font-bold'>Assessment Improvement</span> when you retake the quiz.
              </p>
            )}


            {assessmentScorePerf < studyProfeciencyTarget && (
              <p className='text-center text-xl mb-4'>
                <CheckIcon className='mr-2' />
                You can aim for a quiz score of 90% or higher, which will significantly enhance your overall <span className='font-bold'>Assessment Performance</span> reaching the 90% benchmark.
              </p>
            )}

          </div>
        )}
      </div>







      <div className='mt-32 flex items-center justify-center gap-5'>
        {/* <button className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4' onClick={() => {
          setShowAssessment(true)
          setShowAnalysis(false)
          setIsRunning(false)
        }}>Review Answers</button> */}

        {groupId !== undefined ? (

          <Link to={`/main/group/study-area/group-review/${groupId}/${materialID}`} className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4 text-center'>
          <button>Go to Study Area</button>
          </Link>      
          ) : (
          <Link to={`/main/personal/study-area/personal-review/${materialID}`} className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4 text-center'>
          <button>Go to Study Area</button>
          </Link>      
          )}

          {groupId !== undefined ? (
          <Link to={`/main/group/dashboard/category-list/topic-list/topic-page/${groupId}/${categoryID}/${materialID}`} className='mbg-800 mcolor-100 px-5 py-3 rounded-[5px] w-1/4 text-center'>
            <button>View Analytics</button>
          </Link>      
          ) : (
          <Link to={`/main/personal/dashboard/category-list/topic-list/topic-page/${categoryID}/${materialID}`} className='mbg-800 mcolor-100 px-5 py-3 rounded-[5px] w-1/4 text-center'>
            <button>View Analytics</button>
          </Link>      
        )}     
      </div>

      </div>
    </div>
  )
}
