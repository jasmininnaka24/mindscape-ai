import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link } from 'react-router-dom';
import { BarChart } from '../charts/BarChart';
import { PieChart } from '../charts/PieChart';
import { useUser } from '../../UserContext';
import { useLocation } from 'react-router-dom';
import { fetchUserData } from '../../userAPI';


export const TopicPage = ({categoryFor}) => {

  const { categoryID, materialID, groupId } = useParams();
  const navigate = useNavigate();

  const { user, SERVER_URL } = useUser();
  const UserId = user?.id;

  // user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    studyProfTarget: 0,
    typeOfLearner: '',
    userImage: ''
  })

  const location = useLocation();
  const { filter, performanceStatus, tag } = location.state;


  const [studyMaterials, setStudyMaterials] = useState([]);
  const [preparedLength, setPreparedLength] = useState(0);
  const [unpreparedLength, setUnpreparedLength] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [currentAnalysisId, setCurrectAnalysisId] = useState(0);
  const [currentIndex, setCurrectIndex] = useState(0);
  const [fetchedID, setFetchedID] = useState(0)



  useEffect(() => {
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

    getUserData();
  }, [UserId])




  useEffect(() => {
    const fetchData = async () => {
      const extractedData = await axios.get(`${SERVER_URL}/DashForPersonalAndGroup/get-assessments/${materialID}`);

      setStudyMaterials(extractedData.data)
      const fetchedData = extractedData.data;
      const fetchedId = fetchedData.map((item) => item.id).pop();

      setFetchedID(fetchedId);


      let data = extractedData.data;
      
      let preparedLength = 0;
      let unpreparedLength = 0;
      
      data.forEach(item => {
        const assessmentImp = parseFloat(item.assessmentImp);
        const assessmentScorePerf = parseFloat(item.assessmentScorePerf);
        const confidenceLevel = parseFloat(item.confidenceLevel);
      
        const totalScore = (assessmentImp + assessmentScorePerf + confidenceLevel) / 3;
      
        if (totalScore >= 90.00) {
          preparedLength += 1;
        } else {
          unpreparedLength += 1;
        }
      });
      

      setPreparedLength(preparedLength)
      setUnpreparedLength(unpreparedLength)
      
      
    }

    fetchData();
    
  }, [materialID])




  console.log(studyMaterials[2-1]);

  const generateAnalysis = async (id, index) => {

    setShowLoader(true)
    setShowFirstText(false)
    setShowSecondText(false) 

    let data = {
      last_exam: 'Pre-Assessment',
      last_assessment_score: studyMaterials[index].preAssessmentScore,
      assessment_score: studyMaterials[index].assessmentScore,
      exam_num_of_items: studyMaterials[index].overAllItems,
      assessment_imp: studyMaterials[index].assessmentImp,
      confidence_level: studyMaterials[index].confidenceLevel,
      prediction_val: ((parseFloat(studyMaterials[index].assessmentImp) + parseFloat(studyMaterials[index].assessmentScorePerf) + parseFloat(studyMaterials[index].confidenceLevel)) / 3).toFixed(2),
      prediction_text: ((parseFloat(studyMaterials[index].assessmentImp) + parseFloat(studyMaterials[index].assessmentScorePerf) + parseFloat(studyMaterials[index].confidenceLevel)) / 3).toFixed(2) >= 90 ? 'ready' : 'not yet ready',
      target: 90,
    };
    
    if (studyMaterials.length > 1) {
      if (id !== fetchedID) {
        data.last_exam = 'Assessment';
        data.last_assessment_score = studyMaterials[index + 1].assessmentScore;
      }
    }

    console.log(fetchedID);
    console.log(id);
    console.log(data);
    

    const generateAnalysisUrl = 'https://f92b-34-124-241-52.ngrok.io/generate_analysis';

    const response = await axios.post(generateAnalysisUrl, data);
    console.log(response.data);
    let generatedAnalysisResponse = (response.data.generated_analysis).replace('\n\n\n\n\n', '');

    await axios.put(`${SERVER_URL}/DashForPersonalAndGroup/set-update-analysis/${id}`, {analysis: generatedAnalysisResponse});

    setShowModal(false)
    setShowFirstText(false)
    setShowSecondText(false)
    setShowLoader(false)

    navigate(`/main/personal/dashboard/category-list/topic-list/topic-page/analysis/${categoryID}/${materialID}/${id}`)

  
  }

  const checkIFTheresRecordedAnalysis = (id, index) => {
    
    const analysis = studyMaterials[index].analysis;
    if (analysis === 'No record of analysis yet.') {
      setCurrectAnalysisId(id)
      setCurrectIndex(index)
      setShowModal(true)
      setShowFirstText(true)
    } else {
      if (groupId !== undefined) {
        navigate(`/main/group/dashboard/category-list/topic-list/topic-page/analysis/${groupId}/${categoryID}/${materialID}/${id}`)
      } else {
        navigate(`/main/personal/dashboard/category-list/topic-list/topic-page/analysis/${categoryID}/${materialID}/${id}`)
      }
    }
  }

  return (
    <div>

      {/* navbar */}
      <div className='mcolor-900 flex justify-between items-center'>
        <div className='flex justify-between items-start'>
          <div className='flex gap-3 items-center text-2xl'>
            <button onClick={() => {

              let linkBack = ''
              if (categoryFor === 'Personal') {
                linkBack = `/main/personal/dashboard/category-list/topic-list/${materialID}`
              } else {
                linkBack = `/main/group/dashboard/category-list/topic-list/${groupId}/${materialID}`
              }

              navigate(linkBack, {
                state: {
                  filter: filter,
                  performanceStatus: performanceStatus,
                  tag: tag
                }
              })
            }}>
              Topic List
            </button>
            <i class="fa-solid fa-chevron-right"></i>
            <p className='font-bold'>Topic Page</p>
          </div>
        </div>

        <div className='flex items-center text-xl gap-3'>
          <i class="fa-regular fa-bell"></i>
          <i class="fa-regular fa-user"></i>
          <button className='text-xl'>{userData.username} <i class="fa-solid fa-chevron-down ml-1"></i></button>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='flex my-10'>
          <div className='w-full'>
            <p className='text-center mcolor-800 mb-2 font-bold'>Overall Performance</p>
            <BarChart
              labelSet={studyMaterials.map(material => new Date(material.updatedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))}
              dataGathered={studyMaterials.map(material => ((parseFloat(material.assessmentImp) + parseFloat(material.assessmentScorePerf) + parseFloat(material.confidenceLevel)) / 3).toFixed(2))}
              maxBarValue={100} labelTop={'Assessment Score Performance'}
          />
          </div>
          <div className='w-1/2 mb-8 mt-2'>
            <p className='text-center mcolor-800 mb-2 font-bold mb-2'>Preparation Counts</p>
            <div className='min-h-[40vh]'>
              <PieChart dataGathered={[unpreparedLength, preparedLength]} />
            </div>
          </div>
        </div>

        <div className='my-8 border-medium-800 rounded-[5px]'>
          <table className='w-full rounded-[5px] text-center'>
            <thead className='mbg-300'>
              <tr>
                <td className='text-center text-xl py-3 font-medium px-3'>#</td>
                <td className='text-center text-xl py-3 font-medium'>Date</td>
                <td className='text-center text-xl py-3 font-medium'>Pre-Assessment <br />Score</td>
                <td className='text-center text-xl py-3 font-medium'>Assessment <br /> Score</td>
                <td className='text-center text-xl py-3 font-medium'>Completion <br /> Time</td>
                <td className='text-center text-xl py-3 font-medium'>Improvement</td>
                <td className='text-center text-xl py-3 font-medium'>Score <br /> Performance</td>
                <td className='text-center text-xl py-3 font-medium'>Confidence <br /> Level</td>
                <td className='text-center text-xl py-3 font-medium'>Preparation <br /> Status</td>
              </tr>
            </thead>
            <tbody>
              {studyMaterials.map((item, index) => {
                return <tr className='border-bottom-thin-gray rounded-[5px]' key={index}>

                  <td className='text-center py-3 text-lg mcolor-800'>{item.numOfTakes}</td>
                  <td className='text-center py-3 text-lg mcolor-800'>{new Date(item.updatedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</td>

                  <td className='text-center py-3 text-lg mcolor-800'>{item.preAssessmentScore}/{item.overAllItems}</td>
                  <td className='text-center py-3 text-lg mcolor-800'>{item.assessmentScore}/{item.overAllItems}</td>


                  <td className='text-center py-3 text-lg mcolor-800'>{item.completionTime}</td>

                  <td className='text-center py-3 text-lg mcolor-800'>{item.assessmentImp}%</td>



                  <td className='text-center py-3 text-lg mcolor-800'>{item.assessmentScorePerf}%</td>
                  <td className='text-center py-3 text-lg mcolor-800'>{item.confidenceLevel}%</td>
                  <td className='text-center py-3 text-lg mcolor-800'>{((parseFloat(item.assessmentImp) + parseFloat(item.assessmentScorePerf) + parseFloat(item.confidenceLevel)) / 3).toFixed(2) >= 90 ? 'Prepared' : 'Unprepared'}</td>

                </tr>
              })}
            </tbody>
          </table>
        </div>  

        {showModal === true && (
          <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
            <div className='flex items-center justify-center h-full'>
              <div className='relative mbg-100 min-h-[40vh] w-1/2 z-10 relative p-10 rounded-[5px]'>
                

                {showFirstText === true && (
                  <div>
                    <p className='text-center text-xl font-medium mcolor-800 pt-10'>No analysis has been recorded. Would you like to generate an analysis for the given data?</p>

                    <div className='w-full absolute bottom-10 flex items-center justify-center left-0 gap-4'>
                      <button className='mbg-200 border-thin-800 px-5 py-2 rounded-[5px]' onClick={() => {
                        setShowModal(false)
                        setShowFirstText(false)
                        setShowSecondText(false) 
                      }} >No</button>

                      <button className='mbg-800 mcolor-100 border-thin-800 px-5 py-2 rounded-[5px]' onClick={() => {
                        setShowFirstText(false)
                        setShowSecondText(true) 
                      }}>Yes</button>
                    </div>
                  </div>
                )}




                {showSecondText === true && (
                  <div>

                    <p className='text-center text-xl font-medium mcolor-800 mt-5'>Kindly be advised that the data analysis process by the system AI may require 2-3 minutes, depending on your internet speed. Would you be comfortable waiting for that duration?</p>
                    
                    <div className='w-full absolute bottom-10 flex items-center justify-center left-0 gap-4'>

                      <button className='mbg-200 border-thin-800 px-5 py-2 rounded-[5px]' onClick={() => {
                        setShowModal(false)
                        setShowFirstText(false)
                        setShowSecondText(false) 
                      }} >No</button>

                      <button className='mbg-800 mcolor-100 border-thin-800 px-5 py-2 rounded-[5px]' onClick={() => generateAnalysis(currentAnalysisId, currentIndex)}>Yes</button>
                    </div>

                  </div>
                )}


                {showLoader === true && (
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
    </div>  
  )
}
