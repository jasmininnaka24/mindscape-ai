import React, { useEffect, useState } from 'react'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../../../../UserContext';
import PushPinIcon from '@mui/icons-material/PushPin';


export const PersonalReviewerPage = () => {

  const { materialId } = useParams();
  const { user } = useUser()
  const UserId = user?.id;

  const navigate = useNavigate()

  const [showNotesReviewer, SetShowNotesReviewer] = useState(true);
  const [showLessonContext, SetShowLessonContext] = useState(false);
  const [notesReviewer, setNotesReviewer] = useState([]);
  const [lessonContext, setLessonContext] = useState("");
  const [takeAssessment, setTakeAssessment] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [showModal, setShowModal] = useState("");


  // deleting material
  const [recentlyDeletedMaterial, setRecentlyDeletedMaterial] = useState('');
  const [isMaterialDeleted, setIsMaterialDeleted] = useState('hidden');

  const [isDone, setIsDone] = useState(false);


  const fetchData = async () => {

    const groupResponse = await axios.get(`http://localhost:3001/studyMaterial/study-material-personal/Personal/${UserId}/${materialId}`);

    setMaterialTitle(groupResponse.data.title);

    await axios.get(`http://localhost:3001/quesRev/study-material-rev/${materialId}`).then((response) => {
      setNotesReviewer(response.data)
    })

    await axios.get(`http://localhost:3001/studyMaterial/study-material-personal/Personal/${UserId}/${materialId}`).then((response) => {
      setLessonContext(response.data.body);
    })

    try {
      const previousSavedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment-personal/${materialId}/${UserId}`);
      const fetchedData = previousSavedData.data;

  
      if (fetchedData && fetchedData.length >= 1 && fetchedData[0].assessmentScore !== undefined && fetchedData[0].assessmentScore === 'none') {
        setTakeAssessment(true);
      } else if (fetchedData && fetchedData.length >= 1 && fetchedData[0].assessmentScore !== undefined) {
        setTakeAssessment(true);
      }
    } catch (error) {
      console.error('Error fetching assessment data:', error);
    }
  }


  useEffect(() => {
    
    
    if (!isDone) {
      setIsDone(true)
    }

  },[UserId])


  useEffect(() => {
    if (isDone) {
      fetchData();
      setIsDone(false)
    }
  }, [isDone])

  



  function generateRandomString() {
    const letters = 'aBcDeFgHiJkLmNoPqRsTuVwXyZ';
    const numbers = '0123456789';
  
    let randomString = '';
  
    // Generate 3 random letters
    for (let i = 0; i < 3; i++) {
      const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
      randomString += randomLetter;
    }
    
    // Generate 4 random numbers
    for (let i = 0; i < 3; i++) {
      const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
      randomString += randomNumber;
    }
    
    // Generate 5 random letters
    for (let i = 0; i < 3; i++) {
      const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
      randomString += randomLetter;
    }
    return randomString;
  }

  const startStudySession = async () => {

    if (takeAssessment) {
      await axios.put(`http://localhost:3001/studyMaterial/update-data/${materialId}`, {
        isStarted: 'true',
        codeDashTrackingNum: generateRandomString(),
      });
  
      navigate(`/main/personal/study-area/personal-review-start/${materialId}`);
    } else {
      setShowModal(true)
    }


  }



  const deleteStudyMaterial = async (id, title) => {
    // Show a confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete ${title}?`);
  
    if (confirmed) {
      await axios.delete(`http://localhost:3001/studyMaterial/delete-material/${id}`)

      setTimeout(() => {
        setIsMaterialDeleted('')
        setRecentlyDeletedMaterial(title)
      }, 100);

      setTimeout(() => {
        setIsMaterialDeleted('hidden')
        setRecentlyDeletedMaterial('')
      }, 1500);

      setTimeout(() => {
        navigate('/main/personal/study-area')
      }, 2000);
    }
  }




  return (
    <div className='container py-8 poppins'>
      <Navbar linkBack={`/main/personal/study-area`} linkBackName={`Study Area`} currentPageName={'Reviewer Page Preview'} username={'Jennie Kim'}/>

      <p className={`${isMaterialDeleted} mt-5 py-2 mbg-300 mcolor-800 text-center rounded-[5px] text-lg`}>{recentlyDeletedMaterial} has been deleted.</p>

      <div>
          <div className='flex justify-between items-center my-5 py-3'>

            {/* modify buttons */}
            <div className='flex items-center gap-3'>
              <button className='px-6 py-2 rounded-[5px] text-lg mbg-200 mcolor-800 border-thin-800 font-normal' onClick={() => deleteStudyMaterial(materialId, materialTitle)}>Delete Material</button>

              {!takeAssessment && (
                <Link to={`/main/personal/study-area/update-material/${materialId}`}>
                  <button className='px-6 py-2 rounded-[5px] text-lg mbg-200 mcolor-800 border-thin-800 font-normal'>Modify Material</button>
                </Link>
              )}
            </div>

            <div className='flex justify-between items-center gap-4'>
              <div className='flex items-center gap-2'>
                <button className='px-6 py-2 rounded-[5px] text-lg mbg-200 mcolor-800 border-thin-800 font-normal' onClick={startStudySession}>Start Study Session</button>
              </div>
              <Link to={`/main/personal/study-area/personal-assessment/${materialId}`}>
                <button className='px-6 py-2 rounded-[5px] text-lg mbg-800 mcolor-100 font-normal'>Take {takeAssessment ? 'Assessment' : 'Pre-Assessment'}</button>
              </Link>
            </div>
          </div>

          <div className='border-medium-800 scroll-box max-h-[70vh] min-h-[70vh] rounded-[5px]'>
            <div className='flex items-center gap-1'>
              <button className={`w-full py-4 rounded-[8px] text-lg font-medium mcolor-800 ${showNotesReviewer === false ? 'mbg-300' : ''}`} onClick={() => {
                SetShowLessonContext(false)
                SetShowNotesReviewer(true)
              }}>Notes Reviewer</button>
              <button className={`w-full py-4 rounded-[8px] text-lg font-medium mcolor-800 ${showLessonContext === false ? 'mbg-300' : ''}`} onClick={() => {
                SetShowLessonContext(true)
                SetShowNotesReviewer(false)
              }}>Lesson Context</button>
            </div>

            {showNotesReviewer === true && (
              <div className='mt-6 mb-5'>
                <div className='flex items-center'>
                  <p className='w-full text-lg mcolor-800 font-bold px-5'>Question: </p>
                  <p className='w-full text-lg mcolor-800 font-bold px-7'>Answer: </p>
                </div>
                {notesReviewer.map((item, index) => {
                  return <div key={index} className='flex gap-3'>
                    <p className='text-start w-full m-3 p-2 mcolor-700 font-medium'>{item.question}</p>
                    <p className='text-start w-full m-3 p-2 mcolor-900 font-medium'>{item.answer}</p>
                  </div>
                })}
              </div>
            )}

            {showLessonContext === true && (
              <div className='px-10 py-8 mcolor-900'>
                {lessonContext}
              </div>
            )}


            {/* modal */}

            {showModal && (
              <div style={{ zIndex: 1000 }} className={`absolute flex flex-col items-center justify-center modal-bg w-full h-full`}>
                <div className='flex justify-center'>
                  <div className='mbg-100 min-h-[45vh] w-[30vw] w-1/3 z-10 relative p-10 rounded-[5px]'>

                  <button className='absolute right-4 top-3 text-xl' onClick={() => {
                    setShowModal(false);
                  }}>
                    ✖
                  </button>
                  
                  <div className='h-full flex justify-center items-center'>
                    <div>
                      <p className='mcolor-900 text-2xl font-medium text-center'>Reminder</p>
                      <p className='text-center text-lg font-medium mcolor-800 mt-8'><PushPinIcon className='text-red-dark' />You need to take the pre-assessment page first.</p>     
                      <p className='text-center text-lg font-medium mcolor-800 mt-5'><PushPinIcon className='text-red-dark' />Once you start the study session, you won't be able to update the study material anymore.</p>     
                    </div>
                  </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        </div>


    </div>
  )
}
