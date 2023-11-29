import React, { useEffect, useState } from 'react'
import { Navbar } from '../navbar/logged_navbar/navbar';
import axios from 'axios';
import io from 'socket.io-client';
import { useUser } from '../../UserContext';
import { Link, useNavigate } from 'react-router-dom';

const socket = io.connect("http://localhost:3001");



export const PreJoinPage = (props) => {

  const { user } = useUser();
  const navigate = useNavigate()

  const { joinRoom, materialId, groupId, setShowPreJoin, setShowAssessmentPage, userId, assessementRoom, setUserListAssessment, selectedAssessmentAnswer, setSelectedAssessmentAnswer,  isRunning, setIsRunning, setSeconds, itemCount, setQA, extractedQA, shuffledChoices, setShuffledChoices, isSubmittedButtonClicked, setIsSubmittedButtonClicked, idOfWhoSubmitted, setIdOfWhoSubmitted, usernameOfWhoSubmitted, setUsernameOfWhoSubmitted, score, setScore, isSubmitted, setIsSubmitted, isAssessmentDone, setIsAssessmentDone, showSubmittedAnswerModal, setShowSubmittedAnswerModal, showTexts, setShowTexts, showAnalysis, setShowAnalysis, showAssessment, setShowAssessment, overAllItems, setOverAllItems, preAssessmentScore, setPreAssessmentScore, assessmentScore, setAssessmentScore, assessmentImp, setAssessmentImp, assessmentScorePerf, setAssessmentScorePerf, completionTime, setCompletionTime, confidenceLevel, setConfidenceLevel, overAllPerformance, setOverAllPerformance, assessmentCountMoreThanOne, setAssessmentCountMoreThanOne, generatedAnalysis, setGeneratedAnalysis, shuffledChoicesAssessment, setShuffledChoicesAssessment, extractedQAAssessment, setQAAssessment, assessmentUsersChoices, setAssessmentUsersChoices, message, setMessage, messageList, setMessageList } = props;









  const UserId = user?.id;
  const username = user?.username;

  const [showNotesReviewer, SetShowNotesReviewer] = useState(true);
  const [showLessonContext, SetShowLessonContext] = useState(false);
  const [notesReviewer, setNotesReviewer] = useState([]);
  const [lessonContext, setLessonContext] = useState("");
  const [takeAssessment, setTakeAssessment] = useState(false);

  // deleting material
  const [recentlyDeletedMaterial, setRecentlyDeletedMaterial] = useState('');
  const [isMaterialDeleted, setIsMaterialDeleted] = useState('hidden');
  const [materialTitle, setMaterialTitle] = useState('');


  useEffect(() => {
    
    const fetchData = async () => {
      try {
        
        await axios.get(`http://localhost:3001/quesRev/study-material-rev/${materialId}`).then((response) => {
          setNotesReviewer(response.data)
        })
    
        await axios.get(`http://localhost:3001/studyMaterial/study-material/Group/${groupId}/${UserId}/${materialId}`).then((response) => {
          setLessonContext(response.data[0].body);
          setMaterialTitle(response.data[0].title);
          console.log();
        })
        
        const previousSavedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment/${materialId}`);
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
    

    fetchData();


  },[UserId, groupId, materialId])


  const startStudySession = async () => {

    joinRoom();

  }

  const takeAssessmentBtn = async () => {
    setShowPreJoin(false);
    setShowAssessmentPage(true);
  
    let data = {
      room: assessementRoom,
      username: username,
      userId: userId,
      selectedAssessmentAnswer: selectedAssessmentAnswer,
      timeDurationVal: itemCount,
      isAnswersSubmitted: isSubmittedButtonClicked,
      idOfWhoSubmitted: idOfWhoSubmitted,
      usernameOfWhoSubmitted: usernameOfWhoSubmitted,
      assessmentScore: score,
      isSubmittedChar: isSubmitted,
      isAssessmentDone: isAssessmentDone,
      isRunning: true,
      showSubmittedAnswerModal: showSubmittedAnswerModal,
      showTexts: showTexts,
      showAnalysis: showAnalysis,
      showAssessment: showAssessment,
      overAllItems: overAllItems, 
      preAssessmentScore: preAssessmentScore, 
      assessmentScoreLatest: assessmentScore, 
      assessmentImp: assessmentImp,
      assessmentScorePerf: assessmentScorePerf,
      completionTime: completionTime, 
      confidenceLevel: confidenceLevel, 
      overAllPerformance: overAllPerformance, 
      assessmentCountMoreThanOne: assessmentCountMoreThanOne,
      generatedAnalysis: generatedAnalysis,
      shuffledChoicesAssess: shuffledChoicesAssessment,
      extractedQAAssessment: extractedQAAssessment,
      assessmentUsersChoices: assessmentUsersChoices,
      messageList: messageList
    };  

  
    socket.emit('join_assessment_room', data);
  
    socket.on('assessment_user_list', (updatedData) => {
      setUserListAssessment(updatedData);
    });
  
    socket.on('selected_assessment_answers', (selectedChoicesData) => {
      setSelectedAssessmentAnswer(selectedChoicesData);
    });
  
    socket.on('updated_time', (time) => {
      setSeconds(time);
    });
  
    socket.on('is_running', (isrunning) => {
      setIsRunning(isrunning);
    });
  
    socket.on('submitted_button_response', (isSubmittedButtonTrue) => {
      setIsSubmittedButtonClicked(isSubmittedButtonTrue);
    });
  
    socket.on('id_of_who_submitted', (id) => {
      setIdOfWhoSubmitted(id);
    });
  
    socket.on('username_of_who_submitted', (username) => {
      setUsernameOfWhoSubmitted(username);
    });
  
    socket.on('assessment_score', (score) => {
      setScore(score);
    });
  
    socket.on('isSubmitted_assess', (isSubmitted) => {
      setIsSubmitted(isSubmitted);
    });
  
    socket.on('isAssessment_done', (isAssessmentDone) => {
      setIsAssessmentDone(isAssessmentDone);
    });
  
    socket.on('show_submitted_answer_modal', (submittedModal) => {
      setShowSubmittedAnswerModal(submittedModal);
    });
  
    socket.on('show_texts', (showTexts) => {
      setShowTexts(showTexts);
    });
  
    socket.on('show_assessment', (showAssessment) => {
      setShowAssessment(showAssessment);
    });
  
    socket.on('show_analysis', (showAnalysis) => {
      setShowAnalysis(showAnalysis);
    });
  
    socket.on('over_all_items', (data) => {
      setOverAllItems(data);
    });
  
    socket.on('pre_assessment_score', (data) => {
      setPreAssessmentScore(data);
    });
  
    socket.on('assessment_score_latest', (data) => {
      setAssessmentScore(data);
    });
  
    socket.on('assessment_imp', (data) => {
      setAssessmentImp(data);
    });
  
    socket.on('assessment_score_perf', (data) => {
      setAssessmentScorePerf(data);
    });
  
    socket.on('completion_time', (data) => {
      setCompletionTime(data);
    });
  
    socket.on('confidence_level', (data) => {
      setConfidenceLevel(data);
    });
  
    socket.on('over_all_performance', (data) => {
      setOverAllPerformance(data);
    });
  
    socket.on('assessment_count_more_than_one', (data) => {
      setAssessmentCountMoreThanOne(data);
    });
  
    socket.on('generated_analysis', (data) => {
      setGeneratedAnalysis(data);
    });

    socket.on('shuffled_choices_assessment', (data) => {
      setShuffledChoicesAssessment(data);
    });

    socket.on('extracted_QA_assessment', (data) => {
      setQAAssessment(data);
    });

    socket.on('assessment_users_choices', (data) => {
      setAssessmentUsersChoices(data);
    });

    socket.on("message_list", (message) => {
      if (message.length !== 0) {
        setMessageList(message)
      }
    });

  };
  

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
      <Navbar linkBack={`/main/group/study-area/${groupId}`} linkBackName={`Study Area`} currentPageName={'Reviewer Page Preview'} username={'Jennie Kim'}/>
      <div>

          <div className='flex justify-between items-center my-5 py-3'>


            {/* modify buttons */}
            <div className='flex items-center gap-3'>
              <button className='px-6 py-2 rounded-[5px] text-lg mbg-200 mcolor-800 border-thin-800 font-normal' onClick={() => deleteStudyMaterial(materialId, materialTitle)}>Delete Material</button>

              {!takeAssessment && (
                <Link to={`/main/group/study-area/update-material/${groupId}/${materialId}`}>
                  <button className='px-6 py-2 rounded-[5px] text-lg mbg-200 mcolor-800 border-thin-800 font-normal'>Modify Material</button>
                </Link>
              )}
            </div>



            <div className='flex justify-between items-center gap-4'>
              <div className='flex items-center gap-2'>

              
                <button className='px-6 py-2 rounded-[5px] text-lg mbg-200 mcolor-800 border-thin-800 font-normal' onClick={startStudySession}>Join Study Room</button>
              </div>


              <button className='px-6 py-2 rounded-[5px] text-lg mbg-800 mcolor-100 font-normal' onClick={takeAssessmentBtn}>
                Take {takeAssessment ? 'Assessment' : 'Pre-Assessment'}
              </button>

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

            {showNotesReviewer && (
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

            {showLessonContext && (
              <div className='px-10 py-8 mcolor-900'>
                {lessonContext}
              </div>
            )}


          </div>
        </div>
    </div>  
  )
}
