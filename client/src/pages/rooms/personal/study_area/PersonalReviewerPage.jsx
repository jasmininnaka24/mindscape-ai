import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../../../../UserContext';
import { SERVER_URL } from '../../../../urlConfig';
import { fetchUserData } from '../../../../userAPI'; 
import { Sidebar } from '../../../../components/sidebar/Sidebar';
import { motion } from 'framer-motion';

// responsive sizes
import { useResponsiveSizes } from '../../../../components/useResponsiveSizes'; 

// imported icons
import PushPinIcon from '@mui/icons-material/PushPin';


export const PersonalReviewerPage = () => {

  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  const { materialId } = useParams();
  const { user } = useUser()
  const UserId = user?.id;

  // user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    studyProfTarget: 0,
    typeOfLearner: '',
    userImage: ''
  })


  
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



  

  const navigate = useNavigate()

  const [takeAssessment, setTakeAssessment] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialCategory, setMaterialCategory] = useState('');
  const [materialNumQues, setMaterialNumQues] = useState('');
  const [showModal, setShowModal] = useState("");


  // deleting material
  const [recentlyDeletedMaterial, setRecentlyDeletedMaterial] = useState('');
  const [isMaterialDeleted, setIsMaterialDeleted] = useState('hidden');

  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAssessmentModalRem, setShowAssessmentModalRem] = useState(false)


  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchData = async () => {

    const materialDetails = await axios.get(`${SERVER_URL}/studyMaterial/study-material-personal/Personal/${UserId}/${materialId}`);
    
    
    const categoryDetails = await axios.get(`${SERVER_URL}/studyMaterialCategory/get-categoryy/${materialDetails.data.StudyMaterialsCategoryId}`);

    const fetchedQuestions = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${materialDetails.data.id}`);

    setMaterialTitle(materialDetails.data.title);
    setMaterialCategory(categoryDetails.data.category);
    setMaterialNumQues(fetchedQuestions.data.length);


    try {
      const previousSavedData = await axios.get(`${SERVER_URL}/DashForPersonalAndGroup/get-latest-assessment-personal/${materialId}/${UserId}`);
      const fetchedData = previousSavedData.data;

  
      if (fetchedData && fetchedData.length >= 1 && fetchedData[0].assessmentScore !== undefined && fetchedData[0].assessmentScore === 'none') {
        setTakeAssessment(true);
      } else if (fetchedData && fetchedData.length >= 1 && fetchedData[0].assessmentScore !== undefined) {
        setTakeAssessment(true);
      }

      setLoading(false)
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
      getUserData()
      setIsDone(false)
    }
  }, [isDone])

  
  const takeAssessmentBtn = async () => {
    navigate(`/main/personal/study-area/update-material/${materialId}`)
  }


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
      await axios.put(`${SERVER_URL}/studyMaterial/update-data/${materialId}`, {
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
      await axios.delete(`${SERVER_URL}/studyMaterial/delete-material/${id}`)

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




  if (loading) {
    return <div className='min-h-[100vh] w-full flex items-center justify-center'>
      <div class="loader">
        <div class="spinner"></div>
      </div>
    </div>
  } else {
    return (
      <div className='poppins mcolor-900 mbg-200 relative flex'>

        <Sidebar currentPage={'personal-study-area'} />

        <div className={`h-[100vh] flex flex-col items-center justify-between py-2 ${extraLargeDevices && 'w-1/6'} mbg-800`}></div>





        <div className={`flex-1 mbg-200 w-full flex flex-col min-h-[100vh] justify-center items-center px-5`}>

          <motion.div 
            className={`${isMaterialDeleted} mt-5 py-2 mbg-300 mcolor-800 text-center rounded-[5px] text-lg`}
            initial={{ opacity: 0, y: -50 }} // initial state
            animate={{ opacity: 1, y: 0 }}   // animate to this state
            transition={{ duration: 0.5 }}   // transition duration
          >
            {recentlyDeletedMaterial} has been deleted.
          </motion.div>

          <div className='flex gap-5 w-full'>


            <div className='w-full'>
              <div className='mt-3 mb-5'>
                {/* <Navbar linkBack={`/main/personal/study-area`} linkBackName={`Study Area`} currentPageName={'Reviewer Page Preview'} username={'Jennie Kim'}/> */}
              </div>


              <div className={`flex ${(extraLargeDevices || largeDevices) ? 'gap-10' : 'gap-2'} ${(extraSmallDevice) ? 'flex-col-reverse' : 'flex-row'} w-full`}>
                <div className={`${extraSmallDevice ? 'w-full mt-5' : 'w-2/3'} rounded-[5px] py-3 px-5`}>
                  <div className='w-full'>
                    <motion.p className={`${(extraLargeDevices || largeDevices) ? 'text-2xl' : extraSmallDevice ? 'text-xl' : 'text-lg'} font-medium quicksand`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >You have been identified as a <span className='font-bold underline'>{userData.typeOfLearner} Learner</span></motion.p >
                    <br />
                    <motion.p className={`mcolor-900 text-justify my-1 ${(extraLargeDevices || largeDevices) ? 'text-lg' : (mediumDevices || extraSmallDevice) ? 'text-sm' : 'text-xs'}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    ><PushPinIcon className={'text-red mr-1'} />The design and formatting of your study sessions will be tailored to suit your specific learner type. If you wish to explore design and format options for other learner types, you can modify your profile configuration.</motion.p >
                    <br />
                    <motion.p className={`mcolor-900 text-justify my-1 ${(extraLargeDevices || largeDevices) ? 'text-lg' : (mediumDevices || extraSmallDevice) ? 'text-sm' : 'text-xs'}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    ><PushPinIcon className={'text-red mr-1'} />Study Session, which includes a Pomodoro technique, is designed to enhance your productivity and focus. The Pomodoro technique involves structured intervals of focused work, promoting efficient learning and concentration. Stay organized and make the most of your study time with this purposeful approach to learning.</motion.p >
                    <br />
                    <motion.p className={`mcolor-900 text-justify my-1 ${(extraLargeDevices || largeDevices) ? 'text-lg' : (mediumDevices || extraSmallDevice) ? 'text-sm' : 'text-xs'}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.9 }}
                    ><PushPinIcon className={'text-red mr-1'} />Upon completing an assessment, your performance data will be seamlessly integrated into the dashboard. This allows for a comprehensive view of your progress over time, facilitating a deeper understanding of your strengths and areas for improvement. Take advantage of this valuable insight to refine your learning strategy and achieve continuous growth.</motion.p >
                    <br />
                    <motion.p className={`mcolor-900 text-justify my-1 ${(extraLargeDevices || largeDevices) ? 'text-lg' : (mediumDevices || extraSmallDevice) ? 'text-sm' : 'text-xs'}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.3, delay: 1.2 }}
                    ><PushPinIcon className={'text-red mr-1'} />Please be aware that the action of deleting or updating data is irreversible. Exercise caution when making changes to ensure the accuracy and completeness of your information. Prioritize data integrity to maintain a reliable and consistent record of your learning activities within the system.</motion.p >
                  </div>

                  {/* modal */}

                  {showModal && (
                    <motion.div
                      style={{ zIndex: 1000 }}
                      className={`absolute flex flex-col items-center justify-center modal-bg w-full h-full`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className='flex justify-center w-full'>
                        <div className={`mbg-input min-h-[45vh] ${(extraLargeDevices || largeDevices) ? 'w-1/3' : mediumDevices ? 'w-1/2' : smallDevice ? 'w-2/3' : 'w-full mx-2'} z-10 relative p-10 rounded-[5px]`}>

                        <button className='absolute right-4 top-3 text-xl' onClick={() => {
                          setShowModal(false);
                        }}>
                          ✖
                        </button>
                        
                        <div className='h-full flex justify-center items-center'>

                        {showAssessmentModalRem && !showModifyModal &&

                          <div>
                            <p className='mcolor-900 text-2xl font-medium text-center'>Reminder</p>
                            <p className="text-center text-lg font-medium mcolor-800 mt-5">
                              <PushPinIcon className="text-red-dark" />
                              Once you opt to start the assessment, you will no longer be able to modify this study material.
                            </p>

                            <button className='w-full py-2 btn-800 mcolor-100 rounded text-center mt-5' onClick={takeAssessmentBtn}>Continue</button>   
                          </div>
                        }

                        {showModifyModal && !showAssessmentModalRem &&

                          <div>
                            <p className='mcolor-900 text-2xl font-medium text-center'>Reminder</p>
                            <p className='text-center text-lg font-medium mcolor-800 mt-8'><PushPinIcon className='text-red-dark' />You need to take the pre-assessment page first.</p>     
                            <p className='text-center text-lg font-medium mcolor-800 mt-5'><PushPinIcon className='text-red-dark' />Once you start the study session, you won't be able to update the study material anymore.</p>     
                          </div>
                        }

                        </div>

                        </div>
                      </div>
                    </motion.div>
                  )}

                </div>

                <motion.div
                  className={`flex flex-col ${extraSmallDevice ? 'w-full mt-5' : 'w-1/3'} items-center`}>

                  <motion.div className='mbg-input mcolor-700 w-full p-5 rounded shadows'
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <p className={`${(extraLargeDevices || largeDevices || extraSmallDevice) ? 'text-lg' : 'text-sm'} font-bold mb-4`}>Study Material Information:</p>
      
                    <p className={`mt-1 ${(extraLargeDevices || largeDevices || extraSmallDevice) ? 'text-md' : 'text-xs'}`}>Category: <span className='font-bold'>{materialCategory}</span></p>
                    <p className={`mt-1 ${(extraLargeDevices || largeDevices || extraSmallDevice) ? 'text-md' : 'text-xs'}`}>Material Title: <span className='font-bold'>{materialTitle}</span></p>
                    <p className={`mt-1 ${(extraLargeDevices || largeDevices || extraSmallDevice) ? 'text-md' : 'text-xs'}`}>Number of Questions: <span className='font-bold'>{materialNumQues}</span></p>
                  </motion.div>

                  <br />
                  <motion.div className='border-hr w-full'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: .30 }}
                    transition={{ duration: 0.3, delay: 1.7 }}
                  ></motion.div>
                  <br />

                                    

                  <div className='flex flex-col items-center gap-4 w-full h-full'>

                    <motion.div className='flex items-center gap-2 w-full'
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}>
                      <button className={`w-full px-6 py-5 shadows rounded-[5px] ${(extraLargeDevices || largeDevices) ? 'text-lg' : 'text-sm'} btn-primary font-normal`} onClick={startStudySession}>Start Study Session</button>
                    </motion.div>
                      
                    <motion.div className='w-full'
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}>
                        <button className={`w-full px-6 py-5 shadows rounded-[5px] ${(extraLargeDevices || largeDevices) ? 'text-lg' : 'text-sm'} mbg-800 mcolor-100 font-normal`}
                        onClick={() => {
                          setShowModal(true)
                          setShowAssessmentModalRem(true)
                        }}
                        >Take {takeAssessment ? 'Assessment' : 'Pre-Assessment'}</button>
                    </motion.div>

                      <motion.button className={`px-5 py-5 shadows w-full rounded-[5px] ${(extraLargeDevices || largeDevices) ? 'text-lg' : 'text-sm'} mbg-200 mcolor-800 border-medium-800 font-normal`}
                      onClick={() => deleteStudyMaterial(materialId, materialTitle)}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.9 }}
                      >Delete Material</motion.button>

                    {!takeAssessment && (
                      <Link className='w-full' to={`/main/personal/study-area/update-material/${materialId}`}>
                        <motion.button className={`px-5 py-5 shadows w-full rounded-[5px] ${(extraLargeDevices || largeDevices) ? 'text-lg' : 'text-sm'} mbg-200 mcolor-800 border-medium-800 font-normal`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.3, delay: 1.2 }}
                      onClick={() => {
                        setShowModal(true)
                        setShowModifyModal(true)
                      }}
                      >
                          Modify Material
                        </motion.button>
                      </Link>
                      )}

                  </div>
                </motion.div>
              </div>
            </div>



            
          
          </div>
        </div>
  

  
      </div>
    )
  }
}
