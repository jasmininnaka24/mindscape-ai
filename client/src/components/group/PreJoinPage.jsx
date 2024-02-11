import React, { useEffect, useState } from 'react'
import { Navbar } from '../navbar/logged_navbar/navbar';
import axios from 'axios';
import io from 'socket.io-client';
import { useUser } from '../../UserContext';
import { fetchUserData } from '../../userAPI';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PushPinIcon from '@mui/icons-material/PushPin';
import { SERVER_URL } from '../../urlConfig';
import { Sidebar } from '../sidebar/Sidebar';
import { motion } from 'framer-motion';


// responsive sizes
import { useResponsiveSizes } from '../useResponsiveSizes'; 


const socket = io(SERVER_URL, {
  credentials: true,
  transports: ['websocket'],
});



export const PreJoinPage = (props) => {

  const { user } = useUser();
  const { groupId, materialId } = useParams();
  const navigate = useNavigate();

  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  const { joinRoom, setShowPreJoin, setShowAssessmentPage, userId, assessementRoom, setUserListAssessment, selectedAssessmentAnswer, setSelectedAssessmentAnswer,  isRunning, setIsRunning, setSeconds, itemCount, setQA, extractedQA, shuffledChoices, setShuffledChoices, isSubmittedButtonClicked, setIsSubmittedButtonClicked, idOfWhoSubmitted, setIdOfWhoSubmitted, usernameOfWhoSubmitted, setUsernameOfWhoSubmitted, score, setScore, isSubmitted, setIsSubmitted, isAssessmentDone, setIsAssessmentDone, showSubmittedAnswerModal, setShowSubmittedAnswerModal, showTexts, setShowTexts, showAnalysis, setShowAnalysis, showAssessment, setShowAssessment, overAllItems, setOverAllItems, preAssessmentScore, setPreAssessmentScore, assessmentScore, setAssessmentScore, assessmentImp, setAssessmentImp, assessmentScorePerf, setAssessmentScorePerf, completionTime, setCompletionTime, confidenceLevel, setConfidenceLevel, overAllPerformance, setOverAllPerformance, assessmentCountMoreThanOne, setAssessmentCountMoreThanOne, generatedAnalysis, setGeneratedAnalysis, shuffledChoicesAssessment, setShuffledChoicesAssessment, extractedQAAssessment, setQAAssessment, assessmentUsersChoices, setAssessmentUsersChoices, message, setMessage, messageList, setMessageList, isStartAssessmentButtonStarted, setIsStartAssessmentButtonStarted } = props;




  const UserId = user?.id;


  
  // user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    studyProfTarget: 0,
    typeOfLearner: '',
    userImage: ''
  })
  




  const [showNotesReviewer, SetShowNotesReviewer] = useState(true);
  const [showLessonContext, SetShowLessonContext] = useState(false);
  const [notesReviewer, setNotesReviewer] = useState([]);
  const [lessonContext, setLessonContext] = useState("");
  const [takeAssessment, setTakeAssessment] = useState(false);
  const [showModal, setShowModal] = useState("");
  const [userUploaderId, setUserUploaderId] = useState(0);
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAssessmentModalRem, setShowAssessmentModalRem] = useState(false)


  // deleting material
  const [recentlyDeletedMaterial, setRecentlyDeletedMaterial] = useState('');
  const [isMaterialDeleted, setIsMaterialDeleted] = useState('hidden');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialCategory, setMaterialCategory] = useState('');
  const [materialNumQues, setMaterialNumQues] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(true);

  

  const getUserData = async () => {
    if (UserId === undefined) {
      navigate(`/login?group_session&groupId=${groupId}&materialId=${materialId}`);
      return;
    }
  
    try {
      const userData = await fetchUserData(UserId);
      const { username, email, studyProfTarget, typeOfLearner, userImage } = userData || {};
  
      setUserData({
        username,
        email,
        studyProfTarget,
        typeOfLearner,
        userImage
      });
  
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

  useEffect(() => {
    
    
    if (!isDone) {
      setIsDone(true)
    }

  },[UserId])



  useEffect(() => {
    if (isDone) {
      getUserData();
      setIsDone(false)
    }
  }, [isDone])


  
  useEffect(() => {
    
    const fetchData = async () => {
      try {
    
        const materialDetails = await axios.get(`${SERVER_URL}/studyMaterial/get-material/${materialId}`);

        const categoryDetails = await axios.get(`${SERVER_URL}/studyMaterialCategory/get-categoryy/${materialDetails.data.StudyMaterialsCategoryId}`);

        const fetchedQuestions = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${materialDetails.data.id}`);

        
        setMaterialTitle(materialDetails.data.title);
        setUserUploaderId(materialDetails.data.UserId)
        setMaterialCategory(categoryDetails.data.category);
        setMaterialNumQues(fetchedQuestions.data.length);
        
        const previousSavedData = await axios.get(`${SERVER_URL}/DashForPersonalAndGroup/get-latest-assessment-group/${materialId}/${groupId}`);


        console.log(previousSavedData.data);
        const fetchedData = previousSavedData.data;
    
        if (fetchedData && fetchedData.length >= 1 && fetchedData[0].assessmentScore !== undefined && fetchedData[0].assessmentScore === 'none') {
          setTakeAssessment(true);
        } else if (fetchedData && fetchedData.length >= 1 && fetchedData[0].assessmentScore !== undefined) {
          setTakeAssessment(true);
        }
      } catch (error) {
        console.error('Error fetching assessment data:', error);
      }

      setLoading(false)
    }
    
    
    fetchData(); 



  },[SERVER_URL, UserId, groupId, materialId])


  const startStudySession = async () => {

    if (takeAssessment) {
      joinRoom();
    } else {
      setShowModal(true)
    }

  }

  const takeAssessmentBtn = async () => {


    setShowPreJoin(false);
    setShowAssessmentPage(true);
  
    const socketListeners = {
      'assessment_user_list': setUserListAssessment,
      'selected_assessment_answers': setSelectedAssessmentAnswer,
      'updated_time': setSeconds,
      'is_running': setIsRunning,
      'submitted_button_response': setIsSubmittedButtonClicked,
      'id_of_who_submitted': setIdOfWhoSubmitted,
      'username_of_who_submitted': setUsernameOfWhoSubmitted,
      'assessment_score': setScore,
      'isSubmitted_assess': setIsSubmitted,
      'isAssessment_done': setIsAssessmentDone,
      'show_submitted_answer_modal': setShowSubmittedAnswerModal,
      'show_texts': setShowTexts,
      'show_assessment': setShowAssessment,
      'show_analysis': setShowAnalysis,
      'over_all_items': setOverAllItems,
      'pre_assessment_score': setPreAssessmentScore,
      'assessment_score_latest': setAssessmentScore,
      'assessment_imp': setAssessmentImp,
      'assessment_score_perf': setAssessmentScorePerf,
      'completion_time': setCompletionTime,
      'confidence_level': setConfidenceLevel,
      'over_all_performance': setOverAllPerformance,
      'assessment_count_more_than_one': setAssessmentCountMoreThanOne,
      'generated_analysis': setGeneratedAnalysis,
      'shuffled_choices_assessment': setShuffledChoicesAssessment,
      'extracted_QA_assessment': setQAAssessment,
      'assessment_users_choices': setAssessmentUsersChoices,
      'message_list': (message) => {
        if (message.length > 0) {
          setMessageList(message);
        }
      },
      'assessment_started': setIsStartAssessmentButtonStarted,
    };
  
    Object.entries(socketListeners).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
  
    const data = {
      room: assessementRoom,
      username: userData?.username,
      userId,
      selectedAssessmentAnswer,
      timeDurationVal: itemCount,
      isAnswersSubmitted: isSubmittedButtonClicked,
      idOfWhoSubmitted,
      usernameOfWhoSubmitted,
      assessmentScore: score,
      isSubmittedChar: isSubmitted,
      isAssessmentDone,
      isRunning: false,
      showSubmittedAnswerModal,
      showTexts,
      showAnalysis,
      showAssessment,
      overAllItems,
      preAssessmentScore,
      assessmentScoreLatest: assessmentScore,
      assessmentImp,
      assessmentScorePerf,
      completionTime,
      confidenceLevel,
      overAllPerformance,
      assessmentCountMoreThanOne,
      generatedAnalysis,
      shuffledChoicesAssess: shuffledChoicesAssessment,
      extractedQAAssessment,
      assessmentUsersChoices,
      messageList,
      isStudyStarted: isStartAssessmentButtonStarted,
    };
  
    socket.emit('join_assessment_room', data);
  };
  
  

  const deleteStudyMaterial = async (id, title) => {

    if (userUploaderId === UserId) {
      // navigate(`/main/group/study-area/update-material/${groupId}/${materialId}`)
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
    } else {
      setShowModal(true)
      setShowDeleteModal(true)
    }
    
  }



  if (loading) {
    return <div className='h-[100vh] w-full flex items-center justify-center'>
      <div class="loader">
        <div class="spinner"></div>
      </div>
    </div>
  } else {
    return (
      <div className='poppins mcolor-900 mbg-200 relative flex'>

        <Sidebar currentPage={'group-study-area'} />

        <div className={`h-[100vh] flex flex-col items-center justify-between py-2 ${extraLargeDevices && 'w-1/6'} mbg-800`}></div>


        <div className='flex-1 mbg-200 w-full flex flex-col min-h-[100vh] justify-center items-center px-5'>

          <motion.div 
            className={`${isMaterialDeleted} mt-5 py-2 green-bg w-full mcolor-800 text-center rounded-[5px] text-lg`}
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
                    >Group Learning Collaboration</motion.p >
                    <br />
                    <motion.p className={`mcolor-900 text-justify my-1 ${(extraLargeDevices || largeDevices) ? 'text-lg' : (mediumDevices || extraSmallDevice) ? 'text-sm' : 'text-xs'}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    ><PushPinIcon className='text-red mr-1' />Your study sessions will be designed and formatted to accommodate the needs of group learners. If you want to explore design and format options tailored for other learning styles, you can adjust your profile configuration accordingly.</motion.p >
                    <br />
                    <motion.p className={`mcolor-900 text-justify my-1 ${(extraLargeDevices || largeDevices) ? 'text-lg' : (mediumDevices || extraSmallDevice) ? 'text-sm' : 'text-xs'}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    ><PushPinIcon className='text-red mr-1' />Study Session, incorporating the Pomodoro technique, is meticulously crafted to amplify group productivity and focus. Through the Pomodoro technique's structured intervals of concentrated work, we foster efficient learning and collective concentration. Embrace this purposeful approach to learning, enhancing organization and maximizing study time within your group.</motion.p >
                    <br />
                    <motion.p className={`mcolor-900 text-justify my-1 ${(extraLargeDevices || largeDevices) ? 'text-lg' : (mediumDevices || extraSmallDevice) ? 'text-sm' : 'text-xs'}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.9 }}
                    ><PushPinIcon className='text-red mr-1' />After finishing an assessment, your group's performance data will seamlessly merge into the dashboard. This feature enables a comprehensive group overview of progress over time, fostering a deeper understanding of collective strengths and areas for improvement. Leverage this valuable insight to refine your group's learning strategy and pursue continuous growth together.</motion.p >
                    <br />
                    <motion.p className={`mcolor-900 text-justify my-1 ${(extraLargeDevices || largeDevices) ? 'text-lg' : (mediumDevices || extraSmallDevice) ? 'text-sm' : 'text-xs'}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.3, delay: 1.2 }}
                    ><PushPinIcon className='text-red mr-1' />Please note that only the uploader of study materials has the authority to delete or update data. Be mindful that these actions are irreversible. Exercise caution when making changes to ensure the accuracy and completeness of your information. Prioritize data integrity to maintain a reliable and consistent record of your learning activities within the system.</motion.p >
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
                      <div className='flex justify-center'>
                        <div className='mbg-100 min-h-[45vh] w-[30vw] w-1/3 z-10 relative p-10 rounded-[5px]'>

                        <button className='absolute right-4 top-3 text-xl' onClick={() => {
                          setShowModal(false);
                          setShowDeleteModal(false)
                          setShowModifyModal(false)
                          setShowAssessmentModalRem(false)
                        }}>
                          ✖
                        </button>
                        
                        <div className='h-full flex justify-center items-center'>
                          {showAssessmentModalRem && !showModifyModal && !showDeleteModal &&
                            <div>
                              <p className='mcolor-900 text-2xl font-medium text-center'>Reminder</p>
                              <p className="text-center text-lg font-medium mcolor-800 mt-5">
                                <PushPinIcon className="text-red-dark" />
                                Once you opt to start the assessment alongside others, {userUploaderId === UserId ? "you will no longer be able to modify this study material" : "the creator of this study material will no longer be able to make alterations to it"}.
                              </p>

                              <button className='w-full py-2 btn-800 mcolor-100 rounded text-center mt-5' onClick={takeAssessmentBtn}>Continue</button>   
                            </div>
                          }

                          {showModifyModal && !showDeleteModal && !showAssessmentModalRem &&
                            <div>
                              <p className='mcolor-900 text-2xl font-medium text-center'>Reminder</p>
                              <p className='text-center text-lg font-medium mcolor-800 mt-5'><PushPinIcon className='text-red-dark' />Modifications are only allowed by the individual who uploaded this material.</p>     
                            </div>
                          }

                          {!showModifyModal && !showAssessmentModalRem && showDeleteModal &&
                            <div>
                              <p className='mcolor-900 text-2xl font-medium text-center'>Reminder</p>
                              <p className='text-center text-lg font-medium mcolor-800 mt-5'><PushPinIcon className='text-red-dark' />Only the person who uploaded this study material is permitted to delete it.</p>     
                            </div>
                          }


                          {!showModifyModal && !showDeleteModal && !showAssessmentModalRem && 
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

                  <motion.div className='btn-light mcolor-700 w-full p-5 rounded shadows'
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
                      <button className={`w-full px-6 py-5 shadows rounded-[5px] ${(extraLargeDevices || largeDevices) ? 'text-lg' : 'text-sm'} btn-primary font-normal`} onClick={startStudySession}>Join Study Session</button>
                    </motion.div>
                      
                    <motion.div className='w-full'
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      onClick={() => {
                        setShowModal(true)
                        setShowAssessmentModalRem(true)
                      }}
                      >
                      <button className={`w-full px-6 py-5 shadows rounded-[5px] ${(extraLargeDevices || largeDevices) ? 'text-lg' : 'text-sm'} mbg-800 mcolor-100 font-normal`} onClick={() => {
                        setShowAssessmentModalRem(true)
                      }}>Take {takeAssessment ? 'Assessment' : 'Pre-Assessment'}</button>
                    </motion.div>

                      <motion.button className={`px-5 py-5 shadows w-full rounded-[5px] ${(extraLargeDevices || largeDevices) ? 'text-lg' : 'text-sm'} mbg-200 mcolor-800 border-medium-800 font-normal`}
                      onClick={() => deleteStudyMaterial(materialId, materialTitle)}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.9 }}

                      >Delete Material</motion.button>

                    {!takeAssessment && (
                      <motion.button className={`px-5 py-5 shadows w-full rounded-[5px] ${(extraLargeDevices || largeDevices) ? 'text-lg' : 'text-sm'} mbg-200 mcolor-800 border-medium-800 font-normal`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.3, delay: 1.2 }}
                      onClick={() => {
                        if (userUploaderId === UserId) {
                          navigate(`/main/group/study-area/update-material/${groupId}/${materialId}`)
                        } else {
                          setShowModal(true)
                          setShowModifyModal(true)
                        }
                      }}
                      >
                        Modify Material
                      </motion.button>
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