import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import io from 'socket.io-client';
import ScrollToBottom from "react-scroll-to-bottom";


// chart
import { BarChartForAnalysis } from '../charts/BarChartForAnalysis';


const socket = io.connect("http://localhost:3001");


export const AssessmentPage = (props) => {

  const { groupId, materialId, username, userId, userListAssessment, setUserListAssessment, selectedAssessmentAnswer, setSelectedAssessmentAnswer, assessementRoom, isRunning, setIsRunning, seconds, setSeconds, setQA, extractedQA, shuffledChoices, setShuffledChoices, isSubmittedButtonClicked, setIsSubmittedButtonClicked, idOfWhoSubmitted, setIdOfWhoSubmitted, usernameOfWhoSubmitted, setUsernameOfWhoSubmitted, score, setScore, isSubmitted, setIsSubmitted, isAssessmentDone, setIsAssessmentDone, showSubmittedAnswerModal, setShowSubmittedAnswerModal, showTexts, setShowTexts, showAnalysis, setShowAnalysis, showAssessment, setShowAssessment, overAllItems, setOverAllItems, preAssessmentScore, setPreAssessmentScore, assessmentScore, setAssessmentScore, assessmentImp, setAssessmentImp, assessmentScorePerf, setAssessmentScorePerf, completionTime, setCompletionTime, confidenceLevel, setConfidenceLevel, overAllPerformance, setOverAllPerformance, assessmentCountMoreThanOne, setAssessmentCountMoreThanOne, generatedAnalysis, setGeneratedAnalysis, shuffledChoicesAssessment, setShuffledChoicesAssessment, extractedQAAssessment, setQAAssessment, assessmentUsersChoices, setAssessmentUsersChoices, message, setMessage, messageList, setMessageList } = props;

  let studyProfeciencyTarget = 90;

  // hooks
  const [materialTitle, setMaterialTitle] = useState('')
  const [materialCategory, setMaterialCategory] = useState('')
  const [lastAssessmentScore, setLastAssessmentScore] = useState(0);
  const [showScoreForPreAssessment, setShowScoreForPreAssessment] = useState(false);

  const [analysisId, setAnalysisId] = useState(0);
  const [categoryID, setCategoryID] = useState(0);
  
  
  
  const UserId = 1;
  
  
  
  useEffect(() => {

    const fetchData = async () => {
      

      const materialTitleResponse = await axios.get(`http://localhost:3001/studyMaterial/study-material/Group/${groupId}/${UserId}/${materialId}`)
      setMaterialTitle(materialTitleResponse.data[0].title)
      

      const materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-lastmaterial/${materialTitleResponse.data[0].StudyMaterialsCategoryId}/${groupId}/Group/${UserId}`)
      setMaterialCategory(materialCategoryResponse.data.category)


      const previousSavedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment/${materialId}`);
      const fetchedData = previousSavedData.data;

      if (fetchedData && Array.isArray(fetchedData) && fetchedData.length > 0) {
        setOverAllItems(fetchedData[0].overAllItems)
      }
      
      if (fetchedData && Array.isArray(fetchedData) && fetchedData.length > 0 && fetchedData[0].assessmentScore !== 'none') {
        if (fetchedData.length >= 2) {
          setLastAssessmentScore(fetchedData[1].assessmentScore);
          setAssessmentCountMoreThanOne(true); 
        }
      } else {
        console.error('Invalid or empty data received:', fetchedData);
      }
    
    }

    if(isAssessmentDone === false) {
      fetchData();
    }


    
    socket.on("assessment_user_list", (updatedData) => {
      setUserListAssessment(updatedData);
    });
    socket.on("selected_assessment_answers", (selectedChoicesData) => {
      setSelectedAssessmentAnswer(selectedChoicesData);
    });

    socket.on('id_of_who_submitted', (id) => {
      setIdOfWhoSubmitted(id);
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

    socket.on("assessment_users_choices", (choices) => {
      setAssessmentUsersChoices(choices);
    });

    socket.on("message_list", (message) => {
      setMessageList(message);
      console.log(message);
    });
    

    if (isAssessmentDone === true) { 
      const targetElement = document.getElementById("currSec");
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }

    
    return () => {
      socket.off('assessment_user_list');
      socket.off('updated_time');
      socket.off('selected_assessment_answers');
      socket.off('disconnect');

    };
    
  }, [groupId, isSubmittedButtonClicked, idOfWhoSubmitted, isAssessmentDone, materialId, setIdOfWhoSubmitted, setIsSubmitted, setScore, setSelectedAssessmentAnswer, seconds, setUserListAssessment, userListAssessment, isRunning, userId, setIsAssessmentDone, showAnalysis, score, isSubmitted, setOverAllItems, setAssessmentCountMoreThanOne, setAssessmentUsersChoices, messageList, setMessageList])




  const handleRadioChange = (choice, index) => {

    const selectedAssessmentAnswers = [...selectedAssessmentAnswer];
    selectedAssessmentAnswers[index] = choice;
    setSelectedAssessmentAnswer(selectedAssessmentAnswers);
  
    socket.emit("updated_answers", { assessementRoom, selectedAssessmentAnswers });
    socket.on("selected_assessment_answers", (selectedChoicesData) => {
      setSelectedAssessmentAnswer(selectedChoicesData);
    });
    
  };

  


  const updateStudyPerformance = async (overallperf) => {
    const updatedStudyPerformance = await axios.put(`http://localhost:3001/studyMaterial/update-study-performance/${materialId}`, {studyPerformance: (overallperf).toFixed(2)});


    const categoryId = updatedStudyPerformance.data.StudyMaterialsCategoryId;
    setCategoryID(categoryId)

    const extractedStudyMaterials = await axios.get(`http://localhost:3001/studyMaterial/all-study-material/${categoryId}`);
    
    const extractedStudyMaterialsResponse = extractedStudyMaterials.data;
    const materialsLength = extractedStudyMaterialsResponse.length;
    
    let calcStudyPerfVal = extractedStudyMaterialsResponse.reduce((sum, item) => sum + item.studyPerformance, 0);
    let overAllCalcVal = (calcStudyPerfVal / materialsLength).toFixed(2);
    
    await axios.put(`http://localhost:3001/studyMaterialCategory/update-study-performance/${categoryId}`, {studyPerformance: overAllCalcVal});
  }




  const dataForSubmittingAnswers = async (userId) => {

    socket.emit('update_time', { room: assessementRoom, timeDurationVal: seconds });
    socket.on("updated_time", (time) => {
      setSeconds(time);
    });

    const score = selectedAssessmentAnswer.reduce((totalScore, item, index) => {
      const qaItem = extractedQAAssessment[index];
      if (qaItem && qaItem.answer !== undefined && qaItem.answer !== null && item) {
        return item.toLowerCase() === qaItem.answer.toLowerCase()
          ? totalScore + 1
          : totalScore;
      } else {
        return totalScore;
      }
    }, 0);
    

    const previousSavedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment/${materialId}`);
    const fetchedData = previousSavedData.data;
    


    let completionTimeCalc = '';
    let extractedQALengthInMinutes = extractedQAAssessment.length * 60;
    let timeleft = extractedQALengthInMinutes - seconds;

    if (seconds === 0) {
        completionTimeCalc = '0 seconds';
    } else {
        const minutes = Math.floor(timeleft / 60);
        const secondsRemainder = timeleft % 60;
    
        if (minutes >= 0) {
            completionTimeCalc += `${minutes} min `;
        }
        
        if (secondsRemainder > 0) {
            completionTimeCalc += (minutes > 0 ? ' ' : '') + `${secondsRemainder} second${secondsRemainder !== 1 ? 's' : ''}`;
        }
    }
    
    
    


    if (idOfWhoSubmitted === userId) {

      // for pre-text functionality
      if (fetchedData.length === 0) {

        let confidence = (((Math.round(extractedQAAssessment.length / 2)) / 8) * 100).toFixed(2);

        let data = {
          dashFor: 'Group',
          overAllItems: extractedQAAssessment.length,
          preAssessmentScore: score,
          assessmentScorePerf: ((score / extractedQAAssessment.length) * 100).toFixed(2),
          completionTime: completionTimeCalc,
          confidenceLevel: completionTimeCalc >= Math.round(extractedQAAssessment.length / 2) ? confidence : 100,
          StudyMaterialId: materialId,
          StudyGroupId: groupId,
        }


        const newlyFetchedDashboardData = await axios.post(`http://localhost:3001/DashForPersonalAndGroup/`, data);

        const newlyFetchedDashboardDataValues = newlyFetchedDashboardData.data;

        setAnalysisId(newlyFetchedDashboardDataValues.id);
        setAssessmentCountMoreThanOne(false);

        setShowScoreForPreAssessment(true)
        // navigate(`/main/personal/study-area/personal-review/${materialId}`);
      } 
      
      
      else {
        // for 1st assessment functionalitty
        if (fetchedData[0].assessmentScore === 'none') {

          const improvement = Math.max(0, ((score - fetchedData[0].preAssessmentScore) / Math.max(extractedQAAssessment.length - fetchedData[0].preAssessmentScore, 1) * 100).toFixed(2));


          let confidence = (((Math.round(extractedQAAssessment.length / 2)) / completionTimeCalc) * 100).toFixed(2);


          let data = {
            assessmentScore: score,
            assessmentImp: parseInt(score) === parseInt(fetchedData[0].preAssessmentScore) ? 100 : improvement,
            assessmentScorePerf: ((score / extractedQAAssessment.length) * 100).toFixed(2),
            completionTime: completionTimeCalc,
            confidenceLevel: completionTimeCalc >= Math.round(extractedQAAssessment.length / 2) ? confidence : 100,
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
          setOverAllPerformance((parseFloat(newlyFetchedDashboardDataValues.assessmentImp) + parseFloat(newlyFetchedDashboardDataValues.assessmentScorePerf) + parseFloat(newlyFetchedDashboardDataValues.confidenceLevel)) / 3);



          
          setAssessmentCountMoreThanOne(false)


          let overallperf = ((parseFloat(newlyFetchedDashboardDataValues.assessmentImp) + parseFloat(newlyFetchedDashboardDataValues.assessmentScorePerf) + parseFloat(newlyFetchedDashboardDataValues.confidenceLevel)) / 3);

          updateStudyPerformance(overallperf)
        } 
        
        
        
        
        // for more than one assesssment functionality
        else {


          const improvement = Math.max(0, ((score - fetchedData[0].assessmentScore) / Math.max(extractedQAAssessment.length - fetchedData[0].assessmentScore, 1) * 100).toFixed(2));
          const validImprovement = isNaN(improvement) ? 0 : improvement;
          

          let confidence = (((Math.round(extractedQAAssessment.length / 2)) / completionTimeCalc) * 100).toFixed(2);

          let data = {
            dashFor: 'Group',
            overAllItems: extractedQAAssessment.length,
            preAssessmentScore: fetchedData[0].preAssessmentScore,
            assessmentScore: score,
            assessmentImp: parseInt(score) === parseInt(fetchedData[0].assessmentScore) ? 100 : validImprovement,
            assessmentScorePerf: ((score / extractedQAAssessment.length) * 100).toFixed(2),
            completionTime: completionTimeCalc,
            confidenceLevel: completionTimeCalc >= Math.round(extractedQAAssessment.length / 2) ? confidence : 100,
            numOfTakes: fetchedData[0].numOfTakes + 1,
            StudyMaterialId: materialId,
            StudyGroupId: groupId
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
          setOverAllPerformance((parseFloat(newlyFetchedDashboardDataValues.assessmentImp) + parseFloat(newlyFetchedDashboardDataValues.assessmentScorePerf) + parseFloat(newlyFetchedDashboardDataValues.confidenceLevel)) / 3);

          if (newlyFetchedDashboardDataValues.length > 0 && newlyFetchedDashboardDataValues[0].assessmentScore !== 'none') {
            if (newlyFetchedDashboardDataValues.length >= 2) {
              setLastAssessmentScore(newlyFetchedDashboardDataValues[1].assessmentScore);
              setAssessmentCountMoreThanOne(true); 
            }
          }

          let overallperf = ((parseFloat(newlyFetchedDashboardDataValues.assessmentImp) + parseFloat(newlyFetchedDashboardDataValues.assessmentScorePerf) + parseFloat(newlyFetchedDashboardDataValues.confidenceLevel)) / 3);

          updateStudyPerformance(overallperf)



        }



        setShowScoreForPreAssessment(false)
        
      }
    }

    if (isSubmittedButtonClicked === true) {
      
      setScore(score);
      setIsSubmitted(true);
      setIsAssessmentDone(true);  

      socket.emit('updated_score', {room: assessementRoom, assessmentScore: score});
      socket.emit('updated_isSubmitted_assess', {room: assessementRoom, isSubmittedChar: true});
      socket.emit('updated_isAssessment_done', {room: assessementRoom, isAssessmentDone: true});
      socket.emit('updated_running', {room: assessementRoom, isRunning: false});

      stopTimer();
                


    }
  
  
  }




  const submitAnswer = () => {

    
    
    if (seconds <= 0 && isRunning) {
      
        dataForSubmittingAnswers(userId);



    } else {
      
      if ((selectedAssessmentAnswer.length !== extractedQAAssessment.length) || selectedAssessmentAnswer.some(answer => answer === '' || answer === undefined)) {
        alert('There are some empty fields');
      } else {
          dataForSubmittingAnswers(userId);

      }
    }

  
  
  };


  const generateAnalysis = async (id) => {

    setShowTexts(false)
    socket.emit('updated_show_texts', {room: assessementRoom, showTexts: false});

    
    const generateAnalysisUrl = 'https://a806-34-124-197-174.ngrok.io/generate_analysis';

    
    let predictionText = overAllPerformance.toFixed(2) >= 90 ? 'ready' : 'not yet ready';

    let predictionVal = overAllPerformance.toFixed(2);
    
    const previousSavedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment/${materialId}`);
    const fetchedData = previousSavedData.data;    
    
    let lastExamStr = 'Pre-Assessment';
    let lastAssessmentScore = 0;
    let assessmentScore = 0; 
    let overAllItems = 0; 
    let assessmentImp = 0; 
    let confidenceLevel = 0; 

    
    if (fetchedData.length === 1) {
      lastExamStr = 'Pre-Assessment';
      lastAssessmentScore = fetchedData[0].preAssessmentScore;
      assessmentScore = fetchedData[0].preAssessmentScore;
      overAllItems = fetchedData[0].overAllItems;
      confidenceLevel = fetchedData[0].confidenceLevel;
      assessmentImp = fetchedData[0].assessmentImp;
      
      setAssessmentCountMoreThanOne(false)
      socket.emit('updated_assessment_count_more_than_one', {room: assessementRoom, assessmentCountMoreThanOne: false});


    } else if (fetchedData.length > 1) {
      lastExamStr = 'Assessment';
      lastAssessmentScore = fetchedData[0].assessmentScore;
      assessmentScore = fetchedData[0].assessmentScore;
      overAllItems = fetchedData[0].overAllItems;
      assessmentImp = fetchedData[0].assessmentImp;
      confidenceLevel = fetchedData[0].confidenceLevel;

      setAssessmentCountMoreThanOne(true)
      socket.emit('updated_assessment_count_more_than_one', {room: assessementRoom, assessmentCountMoreThanOne: true});

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
    

    
    const response = await axios.post(generateAnalysisUrl, data);
    let generatedAnalysisResponse = (response.data.generated_analysis).replace('\n\n\n\n\n', '');

    setGeneratedAnalysis(generatedAnalysisResponse)
    socket.emit('updated_generated_analysis', {room: assessementRoom, generatedAnalysis: generatedAnalysisResponse});


    const newlyFetchedDashboardData = await axios.put(`http://localhost:3001/DashForPersonalAndGroup/set-update-analysis/${id}`, {analysis: generatedAnalysisResponse});
    const newlyFetchedDashboardDataValues = newlyFetchedDashboardData.data;
    
    const dashID = newlyFetchedDashboardDataValues.id;


 
    
    setAnalysisId(dashID);

    setOverAllItems(newlyFetchedDashboardDataValues.overAllItems);
    setPreAssessmentScore(newlyFetchedDashboardDataValues.preAssessmentScore);
    setAssessmentScore(newlyFetchedDashboardDataValues.assessmentScore);
    setAssessmentImp(newlyFetchedDashboardDataValues.assessmentImp);
    setAssessmentScorePerf(newlyFetchedDashboardDataValues.assessmentScorePerf);
    setCompletionTime(newlyFetchedDashboardDataValues.completionTime);
    setConfidenceLevel(newlyFetchedDashboardDataValues.confidenceLevel);
    setOverAllPerformance((parseFloat(newlyFetchedDashboardDataValues.assessmentImp) + parseFloat(newlyFetchedDashboardDataValues.assessmentScorePerf) + parseFloat(newlyFetchedDashboardDataValues.confidenceLevel)) / 3);

    let overallperf = (parseFloat(newlyFetchedDashboardDataValues.assessmentImp) + parseFloat(newlyFetchedDashboardDataValues.assessmentScorePerf) + parseFloat(newlyFetchedDashboardDataValues.confidenceLevel)) / 3;


    setShowAnalysis(true)
    setShowAssessment(false);
    setShowSubmittedAnswerModal(false);

    socket.emit('updated_show_analysis', {room: assessementRoom, showAnalysis: true});
    socket.emit('updated_show_assessment', {room: assessementRoom, showAssessment: false});
    socket.emit('updated_show_submitted_answer_modal', {room: assessementRoom, showSubmittedAnswerModal: false});
    
    socket.emit('updated_over_all_items', {room: assessementRoom, overAllItems: newlyFetchedDashboardDataValues.overAllItems});

    socket.emit('updated_pre_assessment_score', {room: assessementRoom, preAssessmentScore: newlyFetchedDashboardDataValues.preAssessmentScore});

    socket.emit('updated_assessment_score_latest', {room: assessementRoom, assessmentScoreLatest: newlyFetchedDashboardDataValues.assessmentScore});

    socket.emit('updated_assessment_imp', {room: assessementRoom, assessmentImp: newlyFetchedDashboardDataValues.assessmentImp});

    socket.emit('updated_assessment_score_perf', {room: assessementRoom, assessmentScorePerf: newlyFetchedDashboardDataValues.assessmentScorePerf});

    socket.emit('updated_completion_time', {room: assessementRoom, completionTime: newlyFetchedDashboardDataValues.completionTime});
    socket.emit('updated_confidence_level', {room: assessementRoom, confidenceLevel: newlyFetchedDashboardDataValues.confidenceLevel});
    socket.emit('updated_over_all_performance', {room: assessementRoom, overAllPerformance: overallperf});


    
    const targetElement = document.getElementById("currSec");
    targetElement.scrollIntoView({ behavior: 'smooth' })
  }
  



  useEffect(() => {

    let interval;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        // setSeconds(prevSeconds => prevSeconds - 1);

        setSeconds(prevSeconds => {
          const updatedSeconds = prevSeconds - 1;
          socket.emit('update_time', { room: assessementRoom, timeDurationVal: updatedSeconds });
          return updatedSeconds;
        });
        
        socket.on("updated_time", (time) => {
          setSeconds(time);
        });
        
      }, 1000);
    } else if (seconds <= 0 && isRunning) {
      setIsRunning(false);


            

      }
  
    return () => clearInterval(interval);
  }, [assessementRoom, isRunning, seconds, setIsRunning, setSeconds]);
  



  const stopTimer = () => {
    setIsRunning(false);
  };

  const sendMessage = async () => {
    let data = {
      assessementRoom: assessementRoom,
      userId: userId,
      author: username,
      message: message,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
    }

    if (message !== '') {
      await socket.emit('sent_messages', data)
    }

    setMessage('')
  }

  
  

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;






  return (
    <div className='poppins mbg-200 mcolor-900' id='currSec'>

      {showAssessment === true && (
        <div className='flex justify-betweeen'>
          <div className='w-1/2 relative fixed mbg-100 shadows rounded'>
            <div className='fixed'>
              <p className='pt-4 px-5 '>Connected users:</p>
              <ul className='py-2 px-5 rounded-[5px] flex items-center gap-5'>
                {userListAssessment.map(user => (
                  <li key={user.userId}>
                    <p><i className="fa-solid fa-circle text-green-500 mr-1"></i> {user.username.charAt(0).toUpperCase() + user.username.slice(1)}</p>
                  </li>
                ))}
              </ul>
            </div>
            <br /><br />
            <br />
            <div className='flex justify-center'>
              <div className='h-[65vh] border-thin-800 mx-5 mt-6 rounded fixed w-1/3'>

                <div className="chat-window">
                  <div className="chat-header">
                    <p>Live Chat</p>
                  </div>
                  <div className="chat-body">
                    <ScrollToBottom className="message-container">
                      {messageList.map((messageContent) => {
                        return (
                          <div
                            className="message"
                            id={username === messageContent.author ? "you" : "other"}
                          >
                            <div>
                              <div className="message-content">
                                <p>{messageContent.message}</p>
                              </div>
                              <div className="message-meta">
                                <p id="time">{messageContent.time}</p>
                                <p id="author" className='capitalize'>{messageContent.author}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </ScrollToBottom>
                  </div>
                  <div className="chat-footer">
                    <input
                      type="text"
                      placeholder="Hey..."
                      value={message}
                      onChange={(event) => {
                        setMessage(event.target.value);
                      }}
                      onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                      }}
                    />
                    <button onClick={sendMessage}>&#9658;</button>
                  </div>
                </div>
     
              </div>
            </div>

  
          </div>
          <div className='w-3/4 px-10 py-10' id='assessmentSection'>
            <p className='text-center text-3xl font-medium mcolor-700 pt-5'>Assessment for {materialTitle} of {materialCategory}</p>

            {(showAnalysis === false && isAssessmentDone === true) && (
              <div>
                <div>
                  <p className='text-center mcolor-500 font-medium mb-8 text-xl'>Your score is: </p>
                  <p className='text-center text-6xl font-bold mcolor-800 mb-20'>{score}/{extractedQAAssessment.length}</p>

                  <div className=' flex items-center justify-center gap-5'>

                    {(generatedAnalysis === '' && !showScoreForPreAssessment) ? (
                      <button
                        className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4'
                        onClick={() => {
                          setShowSubmittedAnswerModal(true);
                          setIsRunning(false)

                          socket.emit('updated_show_submitted_answer_modal', {room: assessementRoom, showSubmittedAnswerModal: true});

                        }}
                      >
                        Analyze the Data
                      </button>
                    ): (
                      <button
                        className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4'
                        onClick={() => {
                          setShowAnalysis(true)
                          setShowAssessment(false);
                          setShowSubmittedAnswerModal(false);
                          setIsRunning(false)
                        }}
                      >
                        View Analysis
                      </button>
                    )}

                    <Link to={`/main/personal/study-area/personal-review/${materialId}`} className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4 text-center'>
                      <button>Back to Study Area</button>
                    </Link>

                    <Link to={`/main/personal/dashboard/category-list/topic-list/topic-page/${categoryID}/${materialId}`} className='mbg-800 mcolor-100 px-5 py-3 rounded-[5px] w-1/4 text-center'>
                      <button>View Analytics</button>
                    </Link>  
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
                              setIsRunning(false)
                              socket.emit('updated_show_submitted_answer_modal', {room: assessementRoom, showSubmittedAnswerModal: false});

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
            <br /><br />
          
            {isRunning === true && (
              <div className='timer-container px-10 py-3'>
                <div className='rounded-[5px]' style={{ height: "8px", backgroundColor: "#B3C5D4" }}>
                  <div
                    className='rounded-[5px]'
                    style={{
                      width: `${(seconds / (extractedQAAssessment.length * 60)) * 100}%`,
                      height: "100%",
                      backgroundColor: seconds <= 10 ? "#af4242" : "#667F93", 
                    }}
                    />
                </div>


                <h1 className='mcolor-900 text-sm pt-1'>
                  Remaining time:{' '}
                  {hours > 0 && String(hours).padStart(2, "0") + " hours and "}
                  {(hours > 0 || minutes > 0) && String(minutes).padStart(2, "0") + " minutes and "}{String(remainingSeconds).padStart(2, "0") + " seconds"}
                </h1>
              </div>
            )}

            <br /><br />

            {Array.isArray(extractedQAAssessment) && shuffledChoicesAssessment.length > 0 && extractedQAAssessment.map((item, index) => (
              <div key={index} className='mb-20'>
                <p className='mcolor-900 text-xl mb-8'>{index + 1}. {item.question}</p>
                <ul className='grid-result gap-4 mcolor-800'>
                  {item.quizType === 'MCQA' && (
                    shuffledChoicesAssessment[index].map((choice, choiceIndex) => (
                      userListAssessment && userListAssessment.length > 0 && userListAssessment[0] && userListAssessment[0].userId === userId) ? (

                        <div
                        key={choiceIndex}
                        className={`flex items-center justify-center px-5 py-3 text-center choice rounded-[5px] 
                        ${(isSubmitted === true && extractedQAAssessment[index].answer === choice) ? 'border-thin-800-correct' : 
                        (isSubmitted === true && selectedAssessmentAnswer[index] !== extractedQAAssessment[index].answer && selectedAssessmentAnswer[index] === choice) ? 'border-thin-800-wrong' : 'border-thin-800'}`}
                        >


                          <div className='flex items-center justify-center'>
                            <input
                              type="radio"
                              name={`option-${index}`}
                              value={choice}
                              id={`choice-${choiceIndex}-${index}`}
                              className={`custom-radio cursor-pointer`}
                              onClick={() => handleRadioChange(choice, index)}
                              checked={selectedAssessmentAnswer[index] === choice}
                            />
                              <div className={`flex items-center `}>
                                <label htmlFor={`choice-${choiceIndex}-${index}`} className={`mr-5 pt-1 cursor-pointer text-xl`}>
                                  {choice}
                                </label>
                              </div>
                          </div>
                          
  


                        </div>

                      ) : (
                        <div className={`flex items-center justify-center px-5 py-3 text-center choice rounded-[5px] border-thin-800 text-xl ${selectedAssessmentAnswer[index] === choice ? 'mbg-700 mcolor-100' : ''}`}>
                          {choice}
                        </div>
                      ))
                    )}
                </ul>



                {item.quizType === 'ToF' && (
                  <div className='grid-result gap-4 mcolor-800'>
                    {(userListAssessment && userListAssessment.length > 0 && userListAssessment[0] && userListAssessment[0].userId === userId) ? (
                    <div
                      key={1}
                      className={`flex items-center justify-center px-5 py-3 text-center choice rounded-[5px] 
                      ${(isSubmitted === true && extractedQAAssessment[index].answer === 'True') ? 'border-thin-800-correct' : 
                      (isSubmitted === true && selectedAssessmentAnswer[index] !== extractedQAAssessment[index].answer && selectedAssessmentAnswer[index] === 'True') ? 'border-thin-800-wrong' : 'border-thin-800'}`}
                      >

                      <input
                        type="radio"
                        name={`option-${index}`}
                        value={'True'}
                        id={`choice-${1}-${index}`}
                        className={`custom-radio cursor-pointer`}
                        onClick={() => handleRadioChange('True', index)}
                        checked={selectedAssessmentAnswer[index] === 'True'}
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
                    ) : (
                      <div className={`flex items-center justify-center px-5 py-3 text-center choice rounded-[5px] border-thin-800 text-xl ${selectedAssessmentAnswer[index] === 'True' ? 'mbg-700 mcolor-100' : ''}`}>
                      {'True'}
                    </div>
                    )}
                  
                  {(userListAssessment && userListAssessment.length > 0 && userListAssessment[0] && userListAssessment[0].userId === userId) ? (
                    <div
                      key={2}
                      className={`flex items-center justify-center px-5 py-3 text-center choice rounded-[5px] 
                      ${(isSubmitted === true && extractedQAAssessment[index].answer === 'False') ? 'border-thin-800-correct' : 
                      (isSubmitted === true && selectedAssessmentAnswer[index] !== extractedQAAssessment[index].answer && selectedAssessmentAnswer[index] === 'False') ? 'border-thin-800-wrong' : 'border-thin-800'}`}
                      >

                      <input
                        type="radio"
                        name={`option-${index}`}
                        value={'False'}
                        id={`choice-${2}-${index}`}
                        className={`custom-radio cursor-pointer`}
                        onClick={() => handleRadioChange('False', index)}
                        checked={selectedAssessmentAnswer[index] === 'False'}
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
                    ) : (
                      <div className={`flex items-center justify-center px-5 py-3 text-center choice rounded-[5px] border-thin-800 text-xl ${selectedAssessmentAnswer[index] === 'False' ? 'mbg-700 mcolor-100' : ''}`}>
                      {'False'}
                    </div>
                    )}
                  </div>
                )}



                {(item.quizType === 'Identification' || item.quizType === 'FITB') && (
                  <div>


                    <input
                      className={`mb-5 w-full px-5 py-5 text-lg text-center choice rounded-[5px] box-shadoww ${
                        isSubmitted && selectedAssessmentAnswer[index] && extractedQAAssessment[index] &&
                        selectedAssessmentAnswer[index].toLowerCase() === extractedQAAssessment[index].answer.toLowerCase()
                          ? 'border-thin-800-correct'
                          : isSubmitted && selectedAssessmentAnswer[index] && extractedQAAssessment[index] &&
                          selectedAssessmentAnswer[index].toLowerCase() !== extractedQAAssessment[index].answer.toLowerCase()
                          ? 'border-thin-800-wrong'
                          : selectedAssessmentAnswer[index] && extractedQAAssessment[index] && !isSubmitted
                          ? 'border-thin-800'
                          : ''
                      }`}
                      type="text"
                      value={selectedAssessmentAnswer[index] || ''}
                      placeholder='Answer here...'
                      onChange={(event) => handleRadioChange(event.target.value, index)}
                      disabled={userListAssessment && userListAssessment.length > 0 && userListAssessment[0] && userListAssessment[0].userId !== userId} 
                    />


                    <p className='correct-color text-center text-xl'>
                      {isSubmitted === true &&
                      selectedAssessmentAnswer[index] &&
                      extractedQAAssessment[index] &&
                      selectedAssessmentAnswer[index].toLowerCase() !== extractedQAAssessment[index].answer.toLowerCase() 
                      ? extractedQAAssessment[index].answer 
                      : null}
                    </p>

                  </div>


                  )}
              </div>
            ))}


            {(showAnalysis === false && isAssessmentDone === false) && (
              <div className='flex justify-center pt-8 mb-5'>
                <button
                  className={`w-1/2 py-2 px-5 rounded-[5px] text-lg ${isSubmittedButtonClicked === true && idOfWhoSubmitted !== userId && usernameOfWhoSubmitted !== username ? 'disabled-button mbg-300 mcolor-800' : 'mbg-800 mcolor-100 '}`}
                  onClick={() => {

                    socket.emit('submitted_button_clicked', { room: assessementRoom, isAnswersSubmitted: true });

                    if (userListAssessment && userListAssessment.length > 0) {
                      socket.emit('updated_id_of_who_submitted', { room: assessementRoom, idOfWhoSubmitted: userId });
                      socket.emit('updated_username_of_who_submitted', { room: assessementRoom, usernameOfWhoSubmitted: username });

                      if (isSubmittedButtonClicked && idOfWhoSubmitted === userId && usernameOfWhoSubmitted === username) {
                        submitAnswer();
                      }
                    }

                      
                  }}
                  disabled={isSubmittedButtonClicked === true && idOfWhoSubmitted !== userId && usernameOfWhoSubmitted !== username}
                  style={{ cursor: isSubmittedButtonClicked === true && idOfWhoSubmitted !== userId && usernameOfWhoSubmitted !== username ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmittedButtonClicked === true ? 
                    (idOfWhoSubmitted === userId ? 'Confirm Submission' : `${usernameOfWhoSubmitted} clicks the submit button`) : 
                    'Submit Answer'
                  }
                </button>
              </div>
            )}



                  
          </div>
        </div>
      )}

      {showAnalysis === true && (
        <div className='mcolor-800 container'>

          <div className='pt-14 flex items-center justify-between'>
            <div>
              <p className='text-center mx-10 mb-16 text-2xl'>You have a substantial <span className='font-bold'>{overAllPerformance.toFixed(2)}%</span> probability of success of taking the real-life exam and that the analysis classifies that you are <span className='font-bold'>{overAllPerformance.toFixed(2) >= 90 ? 'ready' : 'not yet ready'}</span> to take it as to your preference study profeciency target is <span className='font-bold'>90%</span>.</p>

              <br /><br />

              <div className='flex items-center justify-center'>
                <div className='w-full ml-14'>
                  {assessmentCountMoreThanOne === true ? (
                    <BarChartForAnalysis labelSet={["Pre-Assessment", "Last Assessment", "Latest Assessment"]} dataGathered={[preAssessmentScore, lastAssessmentScore, assessmentScore]} maxBarValue={extractedQAAssessment.length} />
                    ) : (
                    <BarChartForAnalysis labelSet={["Pre-Assessment", "Latest Assessment"]} dataGathered={[preAssessmentScore, assessmentScore]} maxBarValue={extractedQAAssessment.length} />
                  )}
                </div>
                <div className='w-full ml-12'>

                  <p className='text-2xl'>{assessmentCountMoreThanOne === true ? 'Last Assessment' : 'Pre-assessment'} score: {assessmentCountMoreThanOne === true ? lastAssessmentScore : preAssessmentScore}/{extractedQAAssessment.length}</p>
                  <p className='text-2xl'>Assessment score: {assessmentScore}/{extractedQAAssessment.length}</p>
                  <p className='text-2xl font-bold'>Assessment improvement: {assessmentImp}%</p>
                  <p className='text-2xl font-bold'>Assessment score performance: {assessmentScorePerf}%</p>

                  <br /><br />
                  <p className='text-2xl'>Completion time: {completionTime}</p>
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
              {
                (
                  (completionTime && completionTime.match(/(\d+)\s*min/) ? parseInt(completionTime.match(/(\d+)\s*min/)[1], 10) : 0) >= Math.floor(extractedQAAssessment.length / 2) ||
                  assessmentImp < studyProfeciencyTarget ||
                  assessmentScorePerf < studyProfeciencyTarget
                ) && (
                  <div className='mt-20'>
                    <p className='mb-5 font-bold text-2xl text-center'>Recommendations</p>

                    {(completionTime && completionTime.match(/(\d+)\s*min/) ? parseInt(completionTime.match(/(\d+)\s*min/)[1], 10) : 0) >= Math.floor(extractedQAAssessment.length / 2) && (
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
                )
              }



            </div>
          )}







          <div className='mt-32 flex items-center justify-center gap-5'>
            {/* <button className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4' onClick={() => {
              setShowAssessment(true)
              setShowAnalysis(false)
              setIsRunning(false)
            }}>Review Answers</button> */}
            
            {groupId !== undefined ? (

              <Link to={`/main/group/study-area/group-review/${groupId}/${materialId}`} className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4 text-center'>
              <button>Back to Study Area</button>
            </Link>      
            ) : (
              <Link to={`/main/personal/study-area/personal-review/${materialId}`} className='border-thin-800 px-5 py-3 rounded-[5px] w-1/4 text-center'>
              <button>Back to Study Area</button>
            </Link>      
            )}

            {groupId !== undefined ? (
              <Link to={`/main/group/dashboard/category-list/topic-list/topic-page/${groupId}/${categoryID}/${materialId}`} className='mbg-800 mcolor-100 px-5 py-3 rounded-[5px] w-1/4 text-center'>
                <button>View Analytics</button>
              </Link>      
            ) : (
              <Link to={`/main/personal/dashboard/category-list/topic-list/topic-page/${categoryID}/${materialId}`} className='mbg-800 mcolor-100 px-5 py-3 rounded-[5px] w-1/4 text-center'>
                <button>View Analytics</button>
              </Link>      
            )}
          </div>
          <br />
          <br />
        </div>
      )}




    </div>
  )
}
