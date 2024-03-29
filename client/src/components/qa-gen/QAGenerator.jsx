import React, { createContext, useEffect, useState } from 'react';
import { DropZoneComponent } from './DropZoneComponent';
import { Sidebar } from '../sidebar/Sidebar';
import { Navbar } from '../navbar/logged_navbar/navbar';
import './studyArea.css';

// CRUD Command Imports
import { SavedGeneratedData } from './SavedGeneratedData';
import axios from 'axios';

import { useUser } from '../../UserContext';
import { SERVER_URL } from '../../urlConfig';

import AccountTreeIcon from '@mui/icons-material/AccountTree';

// responsive sizes
import { useResponsiveSizes } from '../useResponsiveSizes'; 



export const PDFDetails = createContext();
export const GeneratedQAResult = createContext();

export const QAGenerator = (props) => {


  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  const { materialFor, groupNameId } = props;  

  const [pdfDetails, setPDFDetails] = useState("");
  const [numInp, setNumInp] = useState(null);
  const [generatedQA, setGeneratedQA] = useState({
    question_answer_pairs: [],
    fill_in_the_blanks: {
      sentences: [],
      answer: [],
    },
  });

  
  const [inputValues, setInputValues] = useState([]);
  const [addedQuestionStr, setAddedQuestionStr] = useState("");
  const [addedAnswerStr, setAddedAnswerStr] = useState("");
  const [addedChoice, setAddedChoice] = useState("");
  const [addedChoices, setAddedChoices] = useState([]);
  const [showMCQAs, setShowMCQAs] = useState(true);
  const [showGenReviewer, setShowGenReviewer] = useState(false);
  const [showTrueOrFalseSentences, setShowTrueOrFalseSentences] = useState(false);
  const [showFillInTheBlanks, setShowFillInTheBlanks] = useState(false);
  const [showIdentification, setShowIdentification] = useState(false)
  const [activeButton, setActiveButton] = useState(1); 
  const [activeBtnMCQAs, setActiveBtnMCQAs] = useState(true); 
  const [activeBtnRev, setActiveBtnRev] = useState(true); 
  const [revQues, setRevQues] = useState("");
  const [revAns, setRevAns] = useState("");
  const [addedTrueSentence, setAddedTrueSentence] = useState("");
  const [addedFITBSentence, setAddedFITBSentence] = useState("");
  const [addedFITBAnswer, setAddedFITBAnswer] = useState("");

  const [studyMaterialCategories, setStudyMaterialCategories] = useState([]);
  const [studyMaterialCategoryId, setStudyMaterialCategoryId] = useState("");

  const { user } = useUser();

  const UserId = user?.id;
  
  const fetchData = async () => {

    let studyMaterialCategoryLink = '';
    let studyMaterialResponse = '';

    if (materialFor === 'Personal') {
      studyMaterialCategoryLink = `${SERVER_URL}/studyMaterialCategory/personal-study-material/${materialFor}/${UserId}`;

      
      studyMaterialResponse = await axios.get(studyMaterialCategoryLink);


    } else if (materialFor === 'Group') {
      studyMaterialCategoryLink = `${SERVER_URL}/studyMaterialCategory/${materialFor}/${groupNameId}`;

      studyMaterialResponse = await axios.get(studyMaterialCategoryLink);

    } else {

      // studyMaterialLink = `${SERVER_URL}/studyMaterial/study-material-group-category/${categoryFor}/${groupNameId}`;
      studyMaterialResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/shared-categories`);
      console.log('API Response:', studyMaterialResponse.data);
      

    }



    // Check if studyMaterialResponse.data is an array before using map
    if (Array.isArray(studyMaterialResponse.data)) {
      const uniqueCategories = [...new Set(studyMaterialResponse.data.map(item => item.category))];
      
      // Sort the unique categories alphabetically
      const sortedCategories = uniqueCategories.sort((a, b) => a.localeCompare(b));
      
      // Create an array of promises for each unique category
      const promiseArray = sortedCategories.map(async (category) => {
        // Find the first occurrence of the category in the original array
        const firstOccurrence = studyMaterialResponse.data.find(item => item.category === category);
      
        // Simulate an asynchronous operation (replace with your actual asynchronous operation)
        await new Promise(resolve => setTimeout(resolve, 100));
      
        // Return a new object with the category details
        return {
          id: firstOccurrence.id,
          category: category,
          categoryFor: firstOccurrence.categoryFor,
          studyPerformance: firstOccurrence.studyPerformance,
          createdAt: firstOccurrence.createdAt,
          updatedAt: firstOccurrence.updatedAt,
          StudyGroupId: firstOccurrence.StudyGroupId,
          UserId: firstOccurrence.UserId
        };
      });
      
      // Use Promise.all to wait for all promises to resolve
      const sortedCategoryObjects = await Promise.all(promiseArray);
      console.log(sortedCategoryObjects);
      setStudyMaterialCategories(sortedCategoryObjects);
      
      if (sortedCategoryObjects.length > 0) {
        setStudyMaterialCategoryId(sortedCategoryObjects[0].id);
      }
    } else {
      console.error("studyMaterialResponse.data is not an array");
    }
    
    

  }


  useEffect(() => {
    // Check if there is data in generatedQA
    if (generatedQA.length > 0) {
      // Find the target element by its ID
      const targetElement = document.getElementById('generated-data');

      if (targetElement) {
        // Scroll to the target element
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    fetchData()

  }, [generatedQA, pdfDetails]);


  useEffect(() => {
    if (!generatedQA.fill_in_the_blanks) {
      setGeneratedQA((prevGeneratedQA) => ({
        ...prevGeneratedQA,
        fill_in_the_blanks: {
          sentences: [],
          answer: [],
        },
      }));
    }
  }, []);


  const revNoteQuestionChange = (event, index) => {
    const updatedPairs = [...generatedQA.reviewer_ques_pairs];
    updatedPairs[index].question = event.target.value;
    setGeneratedQA({ ...generatedQA, reviewer_ques_pairs: updatedPairs });
  };
  
  const revNoteAnswerChange = (event, index) => {
    const updatedPairs = [...generatedQA.reviewer_ques_pairs];
    updatedPairs[index].answer = event.target.value;
    setGeneratedQA({ ...generatedQA, reviewer_ques_pairs: updatedPairs });
  }; 


  const trueSentenceChange = (event, index) => {
    const updatedTS = [...generatedQA.true_or_false_sentences];
    updatedTS[index].sentence = event.target.value;
    setGeneratedQA({ ...generatedQA, true_or_false_sentences: updatedTS });
    console.log(generatedQA.true_or_false_sentences);

  };
  

  const distractorChange = (event, distractorIndex, index) => {
    const updatedTS = [...generatedQA.true_or_false_sentences];
    updatedTS[index].distractors[distractorIndex] = event.target.value;
    setGeneratedQA({ ...generatedQA, true_or_false_sentences: updatedTS });
    console.log(generatedQA.true_or_false_sentences);
  };


  const deleteTrueSentenceItem = (index) => {
    const updatedTS = generatedQA.true_or_false_sentences.filter((item, i) => i !== index);
    setGeneratedQA({ ...generatedQA, true_or_false_sentences: updatedTS });
  }

  const deleteTrueDistractorItem = (index, distractorIndex) => {
    const updatedTS = [...generatedQA.true_or_false_sentences];
    const updatedDistractors = [...updatedTS[index].distractors];
    updatedDistractors.splice(distractorIndex, 1);
    updatedTS[index].distractors = updatedDistractors;
    setGeneratedQA({ ...generatedQA, true_or_false_sentences: updatedTS });
  };
  

  
  const addSentenceAndAnswerToTheList = () => {
    // Ensure that fill_in_the_blanks is defined
    if (!generatedQA.fill_in_the_blanks) {
      setGeneratedQA((prevGeneratedQA) => ({
        ...prevGeneratedQA,
        fill_in_the_blanks: {
          sentences: [],
          answer: [],
        },
      }));
    }
  
    if (addedFITBSentence.trim() === "" || addedFITBAnswer.trim() === "") {
      return alert("Fill out the empty fields.");
    }
  
    const updatedFITB = {
      sentences: [...generatedQA.fill_in_the_blanks.sentences, addedFITBSentence],
      answer: [...generatedQA.fill_in_the_blanks.answer, addedFITBAnswer],
    };
  
    setGeneratedQA((prevGeneratedQA) => ({
      ...prevGeneratedQA,
      fill_in_the_blanks: updatedFITB,
    }));
  
    // Create a new object to ensure state change detection
    setGeneratedQA((prevGeneratedQA) => ({
      ...prevGeneratedQA,
    }));
  
    setAddedFITBSentence("");
    setAddedFITBAnswer("");
  };
  



  const fillInTheBlankSentenceChange = (event, index) => {
    const updatedFITB = {
      ...generatedQA.fill_in_the_blanks,
      sentences: [...generatedQA.fill_in_the_blanks.sentences]
    };
    updatedFITB.sentences[index] = event.target.value;
    setGeneratedQA({ ...generatedQA, fill_in_the_blanks: updatedFITB });
  };

   
  const fillInTheBlankAnswerChange = (event, index) => {
    const updatedFITB = {
      ...generatedQA.fill_in_the_blanks,
      answer: [...generatedQA.fill_in_the_blanks.answer]
    };
    updatedFITB.answer[index] = event.target.value;
    setGeneratedQA({ ...generatedQA, fill_in_the_blanks: updatedFITB });
  };


  const deleteFITBItem = (index) => {
    const updatedSentences = [...generatedQA.fill_in_the_blanks.sentences];
    const updatedAnswers = [...generatedQA.fill_in_the_blanks.answer];
  
    // Remove the sentence and answer at the specified index
    updatedSentences.splice(index, 1);
    updatedAnswers.splice(index, 1);
  
    // Update the state with the modified arrays
    setGeneratedQA({
      ...generatedQA,
      fill_in_the_blanks: {
        sentences: updatedSentences,
        answer: updatedAnswers,
      },
    });
  };



  const showContent = (contentNumber) => {
    setActiveButton(contentNumber);
    // Hide all divs first
    setShowMCQAs(false);
    setShowGenReviewer(false);
    setShowTrueOrFalseSentences(false);
    setShowFillInTheBlanks(false);
    setShowIdentification(false);

    // Show the selected div
    if (contentNumber === 1) {
      setShowMCQAs(true);
    } else if (contentNumber === 2) {
      setShowGenReviewer(true);
    } else if (contentNumber === 3) {
      setShowTrueOrFalseSentences(true);
    } else if (contentNumber === 4) {
      setShowFillInTheBlanks(true);
    } else if (contentNumber === 5) {
      setShowIdentification(true);
    } 
  };

  function shuffleArray(array) {
    if (Array.isArray(array)) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    } else {
      console.error("shuffleArray: Input is not an array");
      return [];
    }
  }

  const choiceHandleInput = (event, index) => {
    const { value } = event.target;
    const updatedValues = [...inputValues];
    updatedValues[index] = value; // Store the value at the corresponding index
    setInputValues(updatedValues);
  };

  const addChoiceBtnFunc = (index) => {
    if(inputValues[index]){
      const updatedPairs = [...generatedQA.question_answer_pairs];
      updatedPairs[index].distractors.push(inputValues[index]);
  
      setGeneratedQA((prevGeneratedQA) => ({
        ...prevGeneratedQA,
        question_answer_pairs: updatedPairs,
      }));
  
      console.log(updatedPairs[index].distractors);
  
      // Clear the input field by resetting the corresponding value
      const updatedValues = [...inputValues];
      updatedValues[index] = '';
      setInputValues(updatedValues);
    } else {
      alert('Field cannot be empty.')
    }
  };

  function handleDeleteChoice(indexToDelete) {
    setAddedChoices((prevChoices) => {
      const updatedChoices = prevChoices.filter((_, index) => index !== indexToDelete);
      return updatedChoices;
    });
  }


  const deleteRevQues = (indexToDel) => {
    setGeneratedQA((prevData) => {
      const updatedRevQues = prevData.reviewer_ques_pairs.filter((_, index) => index !== indexToDel);
      console.log(prevData.reviewer_ques_pairs[indexToDel]); 
      return { ...prevData, reviewer_ques_pairs: updatedRevQues }; 
    });
  }
  
  const addRevItem = () => {
    if (revQues !== '' && revAns !== '') {
      setGeneratedQA((prevData) => {
        const newReviewPairs = Array.isArray(prevData.reviewer_ques_pairs)
          ? [{ question: revQues, answer: revAns }, ...prevData.reviewer_ques_pairs]
          : [{ question: revQues, answer: revAns }];
        return {
          ...prevData,
          reviewer_ques_pairs: newReviewPairs,
        };
      });
  
      setRevQues("");
      setRevAns("");
    } else {
      alert('Field cannot be empty');
    }
  };
  
  
  
  


  return (

    <div className='poppins mcolor-900 mbg-200 relative flex'>

      <Sidebar currentPage={materialFor === 'Personal' ? 'personal-study-area' : 'group-study-area'} />

      <div className={`h-[100vh] flex flex-col items-center justify-between py-2 ${extraLargeDevices && 'w-1/6'} mbg-800`}></div>



      <div className={`flex-1 mbg-200 w-full py-8 ${extraSmallDevice ? 'px-3' : 'px-8'}`}>
        <PDFDetails.Provider value={{ setPDFDetails }}>
          <GeneratedQAResult.Provider value={{ setGeneratedQA, generatedQA }}>

            <div className='flex items-center mt-4'>
              <AccountTreeIcon sx={{ fontSize: 30 }} className='mb-1 mr-3 mcolor-700' />

              {materialFor !== 'Everyone' ? (
                <Navbar linkBack={`/main/${materialFor === 'Personal' ? 'personal' : 'group'}/study-area/${materialFor === 'Personal' ? '' : groupNameId}`} linkBackName={`Study Area`} currentPageName={'Generate Reviewer'} />
              ) : (
                <Navbar linkBack={'/main/library'} linkBackName={'Virtual Library'} currentPageName={'Generate Study Material'} username={'Jennie Kim'}/>
              )}
            </div>

            

            <div className='poppins mcolor-900 my-4'>
              <div className={`border-medium-800 gen-box flex ${(extraSmallDevice || smallDevice) ? 'flex-col h-[160vh]' : 'flex-row h-[80vh]'} justify-between items-center rounded my-3`}>
                <div className={`box1 mbg-100 border-box ${(extraSmallDevice || smallDevice) ? 'h-[80vh] w-full' : 'w-1/2'}`}>
                  <div className='flex justify-center items-center dropzone'>
                    <DropZoneComponent numInp={numInp} setNumInp={setNumInp} setPDFDetails={setPDFDetails} pdfDetails={pdfDetails}  />
                  </div>
                </div>
                <div className={`box2 mbg-100 border-box ${(extraSmallDevice || smallDevice) ? 'h-[80vh] w-full' : 'w-1/2'}`}>
                  <div className='h-full border-none'>
                  <textarea
                    onChange={(event) => {
                      setPDFDetails(event.target.value);
                      console.log(event.target.value);
                    }}
                    value={pdfDetails || ''} 
                    className='w-full h-full p-5 bg-transparent border-thin-800'
                    style={{ resize: 'none', outline: 'none' }}
                  >
                    {pdfDetails}
                  </textarea>

                  </div>
                </div>
              </div>
            </div>


            <div id='generated-data' className='mcolor-900 generated-box flex justify-center'>
            <ol className="poppins w-full">

                <>
                  <div>
                    {/* Save data button */}
                    <div className='flex justify-center my-10'>
                      <SavedGeneratedData generatedQA={generatedQA} setGeneratedQA={setGeneratedQA} pdfDetails={pdfDetails} setPDFDetails={setPDFDetails} numInp={numInp} setNumInp={setNumInp} materialFor={materialFor} groupNameId={groupNameId} studyMaterialCategories={studyMaterialCategories} setStudyMaterialCategories={setStudyMaterialCategories} studyMaterialCategoryId={studyMaterialCategoryId} setStudyMaterialCategoryId={setStudyMaterialCategoryId} />
                    </div>


                    {/* tabs */}
                    <br />
                    <div className={`${(mediumDevices || smallDevice) ? 'grid grid-cols-3' : extraSmallDevice ? 'grid grid-cols-1' : 'flex justify-center items-center'} mb-12 rounded-[5px]`}>
                      <button className={`w-full text-center py-3 ${activeButton === 1 ? 'mbg-100 rounded-[5px] border-medium-800' : 'border-bottom-medium border-r border-solid'} ${(extraSmallDevice || smallDevice) ? 'text-sm' : 'text-md'}`} onClick={() => showContent(1)}>MCQAs</button>
                      <button className={`w-full text-center py-3 ${activeButton === 2 ? 'mbg-100 rounded-[5px] border-medium-800' : 'border-bottom-medium border-r border-solid'} ${(extraSmallDevice || smallDevice) ? 'text-sm' : 'text-md'}`} onClick={() => showContent(2)}>Notes Reviewer</button>
                      <button className={`w-full text-center py-3 ${activeButton === 3 ? 'mbg-100 rounded-[5px] border-medium-800' : 'border-bottom-medium border-r border-solid'} ${(extraSmallDevice || smallDevice) ? 'text-sm' : 'text-md'}`} onClick={() => showContent(3)}>True  Sentences</button>
                      <button className={`w-full text-center py-3 ${activeButton === 4 ? 'mbg-100 rounded-[5px] border-medium-800' : 'border-bottom-medium'} ${(extraSmallDevice || smallDevice) ? 'text-sm' : 'text-md'}`} onClick={() => showContent(4)}>Fill In The Blank</button>
                      <button className={`w-full text-center py-3 ${activeButton === 5 ? 'mbg-100 rounded-[5px] border-medium-800' : 'border-bottom-medium'} ${(extraSmallDevice || smallDevice) ? 'text-sm' : 'text-md'}`} onClick={() => showContent(5)}>Identification</button>
                    </div>


                    {showMCQAs && 
                      <div className='min-h-[90vh]'>
        
                        {/* Add item */}
                        <div className='mb-14 mt-10'>

                        {activeBtnMCQAs === true && 
                        <div>
                          <button onClick={() => {
                            setActiveBtnMCQAs(!activeBtnMCQAs ? true : false)
                          }} className='mcolor-900 border-thin-800 px-5 py-1 rounded-[5px]'>Add Item</button>
                        </div>
                      }

                      
                      {!activeBtnMCQAs && 
                        <div>
                          <div className='my-2'>
                            <div className='flex justify-end text-4xl'>
                              <button onClick={() => {
                                setActiveBtnMCQAs(!activeBtnMCQAs ? true : false)

                                setAddedQuestionStr("");
                                setAddedAnswerStr("");
                                setAddedChoice("");
                                setAddedChoices([]);

                              }} className='dark-text'>×</button>
                            </div>
                            {/* Input for the question */}
                            <input
                              type="text"
                              className='mb-5 brd-btn border-bottom-thin addAChoice w-full bg-transparent border-transparent text-center py-3'
                              placeholder='Question here...'
                              onChange={(event) => {
                                setAddedQuestionStr(event.target.value);
                              }}
                              value={addedQuestionStr}
                            />
                            <ul className="grid-result gap-4">
                              {/* Input for the answer */}
                              <li className="correct-bg rounded-[5px] text-center my-2">
                                <input
                                  type="text"
                                  className='w-full py-4 bg-transparent border-transparent text-center'
                                  placeholder='Answer...'
                                  onChange={(event) => {
                                    setAddedAnswerStr(event.target.value)
                                  }}
                                  value={addedAnswerStr}
                                />
                              </li>
            
                              {/* Choices */}
                              {addedChoices.map((item, index) => {
                                return (
                                <li className="relative wrong-bg rounded-[5px] text-center my-2 flex">
                                  <input
                                    type="text"
                                    className='w-full py-4 bg-transparent border-transparent text-center'
                                    value={item}
                                    onChange={(event) => {
                                      const val = event.target.value;
                                      setAddedChoices((prevChoices) => {
                                        const updatedChoices = [...prevChoices];
                                        updatedChoices[index] = val;
                                        return updatedChoices;
                                      });
                                    }}
                                  />
                                  <div className='absolute right-5 top-3 mbg-100 px-2 rounded-[20px]'>
                                    <button
                                      className='mcolor-900 deleteChoiceBtn relative text-3xl'
                                      onClick={() => handleDeleteChoice(index)}
                                      >
                                      ×
                                    </button>
                                  </div>
                                </li>
                                )
                              })}
        
                              {/* Add a choice */}
                              <div className='my-2 relative '>
                                <input
                                  type="text"
                                  className='brd-btn border-bottom-thin addAChoice w-full py-4 bg-transparent border-transparent text-center rounded-[5px]'
                                  placeholder='Add a choice'
                                  onChange={(event) => {
                                    setAddedChoice(event.target.value);
                                  }}
                                  value={addedChoice}
                                  required
                                />
        
                                <div className='absolute right-5 top-3 mbg-100 px-2 rounded-[20px]'>
                                  <button
                                    className='deleteChoiceBtn relative text-3xl'
                                    onClick={() => {
                                      if(addedChoice !== ""){
                                        setAddedChoices([...addedChoices, addedChoice])
                                        setAddedChoice("");
                                      } else {
                                        alert("Cannot add an empty field.")
                                      }
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </ul>
                          </div>

                          <div className='flex justify-end mt-5'>
                            
                          <button className='mbg-800 mcolor-100 py-2 px-16 rounded-[5px] '
                            onClick={() => {
        
                              let updatedChoices = addedChoices.filter((item) => {
                                return item !== "";
                              })
        
                              if(addedAnswerStr !== "" && addedQuestionStr !== ""){
                                generatedQA.question_answer_pairs.unshift({ question: addedQuestionStr, answer: addedAnswerStr, distractors: updatedChoices })
          
                                setGeneratedQA({ ...generatedQA  });
                                setAddedQuestionStr("");
                                setAddedAnswerStr("");
                                setAddedChoice("");
                                setAddedChoices([]);
                              } else {
                                alert("Fill out the empty fields.");
                              }
                            }}
                            >
                              Add
                            </button>

                          </div>
                        </div>
                      }
                    </div>
        
                        {Array.isArray(generatedQA.question_answer_pairs) && generatedQA.question_answer_pairs.length > 0 && generatedQA.question_answer_pairs.filter((pair) => pair.distractors.length > 0).length > 0 ? (
                          (generatedQA.question_answer_pairs).map((pair, index) => (
                          <li key={index} className="mb-8">


                            {generatedQA.question_answer_pairs[index].distractors.length > 0 && (
                              <div>
                                <div className='flex justify-end'>
                                  {/* Delete button */}
                                  <button className='bg-red mcolor-100 py-1 px-5 rounded-[5px]'
                                    onClick={() => {
                                      setGeneratedQA((prevGeneratedQA) => {
                                        const updatedPairs = prevGeneratedQA.question_answer_pairs.filter((p) => p !== pair);
                                        return {
                                          ...prevGeneratedQA,
                                          question_answer_pairs: updatedPairs,
                                        };
                                      });
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>


                                <div className='my-2'>
                                  {/* Input for the question */}
                                  <textarea 
                                    type="text"
                                    className={`mb-4 brd-btn border-bottom-thin addAChoice w-full bg-transparent border-transparent text-center py-3 ${extraSmallDevice ? 'text-sm' : 'text-md'}`} 
                                    value={pair.question}
                                    onChange={(event) => {
                                      let val = event.target.value;
                                      setGeneratedQA((prevGeneratedQA) => {
                                        const updatedPairs = [...prevGeneratedQA.question_answer_pairs];
                                        const pairToUpdate = updatedPairs.find((p) => p === pair);
                                        if (pairToUpdate) {
                                          const itemIndex = updatedPairs.indexOf(pairToUpdate);
                                          const updatedItem = { ...pairToUpdate };
                                          updatedItem.question = val;
                                          updatedPairs[itemIndex] = updatedItem;
                                        }
                                        return {
                                          ...prevGeneratedQA,
                                          question_answer_pairs: updatedPairs,
                                        };
                                      });
                                    }}
                                    rows={Math.ceil((pair.question ? pair.question.length : 0) / 50)}
                                  >

                                  </textarea>
                                </div>

                                {/* You can add the distractors here */}
                                <ul className={`grid ${(extraSmallDevice) ? 'text-sm grid-cols-1' : 'grid-cols-2'} ${smallDevice && 'text-sm'} gap-3`}>
                                  {/* Input for the answer */}
                                  <li className="correct-bg rounded-[5px] text-center my-2">
                                    <input
                                      type="text"
                                      className='w-full py-4 bg-transparent border-transparent text-center'
                                      value={pair.answer}
                                      onChange={(event) => {
                                        let val = event.target.value;
                                        setGeneratedQA((prevGeneratedQA) => {
                                          const updatedPairs = [...prevGeneratedQA.question_answer_pairs];
                                          const pairToUpdate = updatedPairs.find((p) => p === pair);
                                          if (pairToUpdate) {
                                            const itemIndex = updatedPairs.indexOf(pairToUpdate);
                                            const updatedItem = { ...pairToUpdate };
                                            updatedItem.answer = val;
                                            updatedPairs[itemIndex] = updatedItem;
                                          }
                                          return {
                                            ...prevGeneratedQA,
                                            question_answer_pairs: updatedPairs,
                                          };
                                        });
                                      }}
                                    />
                                  </li>
            
                                    {/* render */}
                                    {pair.distractors.map((distractor, distractorIndex) => (
                                      <li className="relative wrong-bg rounded-[5px] text-center my-2 flex" key={distractorIndex}>
                                        <input
                                          type="text"
                                          className='w-full py-4 bg-transparent border-transparent text-center'
                                          value={distractor}
                                          onChange={(event) => {
                                            let val = event.target.value;
                                            setGeneratedQA((prevGeneratedQA) => {
                                              const updatedPairs = [...prevGeneratedQA.question_answer_pairs];
                                              const pairToUpdate = updatedPairs.find((p) => p === pair);
                                              if (pairToUpdate) {
                                                const itemIndex = updatedPairs.indexOf(pairToUpdate);
                                                const updatedItem = { ...pairToUpdate };
                                                updatedItem.distractors[distractorIndex] = val;
                                                updatedPairs[itemIndex] = updatedItem;
                                              }
                                              return {
                                                ...prevGeneratedQA,
                                                question_answer_pairs: updatedPairs,
                                              };
                                            });
                                          }}
                                        />
                                        <div className='absolute right-5 top-3 mbg-100 px-2 rounded-[20px]'>
                                          <button
                                            className={`mcolor-900 deleteChoiceBtn relative ${(extraSmallDevice || smallDevice) ? 'text-xl' : 'text-3xl'}`}
                                            onClick={() => {
                                              const updatedDistractors = generatedQA.question_answer_pairs[index].distractors.filter((distractor, idx) => {
                                                return idx !== distractorIndex;
                                              });
                                              
                                              // Update the state with the new array
                                              generatedQA.question_answer_pairs[index].distractors = updatedDistractors;
                                              setGeneratedQA({ ...generatedQA });
                                            }}
                                            >
                                            ×
                                          </button>
                                        </div>
            
                                      </li>
                                    ))}
            
                                    {/* Add a choice */}
                                    <div className='my-2 relative' key={index}>
                                      <input
                                        type="text"
                                        className='brd-btn border-bottom-thin  addAChoice w-full py-4 bg-transparent border-transparent text-center rounded-[5px]'
                                        placeholder='Add a choice'
                                        onChange={(event) => choiceHandleInput(event, index)}
                                        value={inputValues[index] || ''} // Use the corresponding value from the array
                                        required
                                      />
            
                                      <div className='absolute right-5 top-3 mbg-100 px-2 rounded-[20px]'>
                                        <button
                                          className='deleteChoiceBtn relative text-3xl'
                                          onClick={() => addChoiceBtnFunc(index)}
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                </ul>
                              </div>
                            )}


                          </li>
                          ))) : (
                            <div className='text-center text-lg font-medium mcolor-500'>No records found</div>
                          )
                        }
                      </div>
                    }


                    {showGenReviewer && (
                      <div className='min-h-[90vh]'>

                        <div>
                          <button
                            onClick={() => {
                              setActiveBtnRev((prevActiveBtnRev) => !prevActiveBtnRev);
                            }}
                            className={`border-medium-800 mcolor-900 px-5 py-1 rounded-[5px] ${!activeBtnRev ? 'hidden' : ''}`}
                          >
                            Add Item
                          </button>
                        </div>
                        
                        <div className='flex justify-end'>
                          <button
                            onClick={() => {
                              setActiveBtnRev((prevActiveBtnRev) => !prevActiveBtnRev);
                            }}
                            className={`text-4xl mcolor-900 px-5 py-1 rounded-[5px] ${activeBtnRev ? 'hidden' : ''}`}
                          >
                            ×
                          </button>
                        </div>
                        

                        {activeBtnRev === false && (
                          <div>
                            <div className='mt-5 mb-10'>
                              <label htmlFor='' className='font-medium'>
                                Enter question:
                              </label>
                              <textarea
                                value={revQues}
                                onChange={(event) => {
                                  setRevQues(event.target.value);
                                }}
                                className='bg-transparent brd-btn w-full border-bottom-thin p-2'
                                placeholder='Question here...'
                                name=''
                                id=''
                                cols='30'
                                rows='1'
                              ></textarea>

                              <label htmlFor='' className='mt-5 font-medium'>
                                Enter answer:
                              </label>
                              <textarea
                                value={revAns}
                                onChange={(event) => {
                                  setRevAns(event.target.value);
                                }}
                                className='bg-transparent brd-btn w-full border-bottom-thin p-2'
                                placeholder='Answer here...'
                                name=''
                                id=''
                                cols='30'
                                rows='1'
                              ></textarea>

                              <div className='flex justify-end mt-5'>
                                <button onClick={addRevItem} className='px-10 py-1 mbg-800 mcolor-100 rounded-[5px]'>
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        )}




                        <br />

                        {generatedQA && generatedQA.reviewer_ques_pairs && generatedQA.reviewer_ques_pairs.length > 0 ? (
                        generatedQA.reviewer_ques_pairs.map((pair, index) => (
                          <li key={index} className='mb-20 text-lg'>
                            <div className='flex justify-end my-5'>
                              <button onClick={() => deleteRevQues(index)} className='bg-red mcolor-100 px-5 py-1 rounded-[5px]'>Delete</button>
                            </div>
                            <ul className={`grid ${(extraSmallDevice) ? 'text-sm grid-cols-1' : 'grid-cols-2'} ${smallDevice && 'text-sm'} gap-2`}>
                              <div className='flex items-center'>
                                <textarea
                                  className='py-5 px-2 outline-none addAChoice w-full h-full wrong-bg brd-btn rounded-[5px] text-center overflow-auto resize-none'
                                  value={pair && pair.question ? `${pair.question}` : ''}
                                  onChange={(event) => revNoteQuestionChange(event, index)}
                                  cols={50} 
                                  rows={Math.ceil((pair && pair.answer ? pair.answer.length : 0) / 50)}      
                                />
                              </div>
      
                              <div className=''>
                                <textarea
                                  className='font-medium py-5 px-2 w-full h-full outline-none addAChoice brd-btn rounded-[5px] text-center overflow-auto resize-none correct-bg opacity-75'
                                  value={pair && pair.answer ? `${pair.answer}` : ''}
                                  onChange={(event) => revNoteAnswerChange(event, index)}
                                  cols={50} 
                                  rows={Math.ceil((pair && pair.answer ? pair.answer.length : 0) / 50)}
                                  
                                  />
                              </div>
                              </ul>
                            </li>
                          ))
                        ) : (
                          <div className='text-center text-lg font-medium mcolor-500'>No records found</div>
                        )}
                      </div>
                    )}





                    {showTrueOrFalseSentences && (
                      <div className='min-h-[90vh]'>

                        {activeBtnMCQAs === true && 
                          <div>
                            <button onClick={() => {
                              setActiveBtnMCQAs(!activeBtnMCQAs ? true : false)
                            }} className='mcolor-900 border-thin-800 px-5 py-1 rounded-[5px]'>Add Item</button>
                          </div>
                        }

                        <br />
                          
                        {!activeBtnMCQAs && 
                          <div>
                            <div className='my-2'>
                              <div className='flex justify-end text-4xl'>
                                <button onClick={() => {
                                  setActiveBtnMCQAs(!activeBtnMCQAs ? true : false)

                                  setAddedQuestionStr("");
                                  setAddedAnswerStr("");
                                  setAddedChoice("");
                                  setAddedChoices([]);

                                }} className='dark-text'>×</button>
                              </div>
                              {/* Input for the question */}
                              <input
                                type="text"
                                className='mb-5 brd-btn border-bottom-thin addAChoice w-full bg-transparent border-transparent text-center py-3'
                                placeholder='Statement here...'
                                onChange={(event) => {
                                  setAddedQuestionStr(event.target.value);
                                }}
                                value={addedQuestionStr}
                              />
                              <ul>

                                {/* Choices */}

                                {addedChoices.map((item, index) => {
                                  return (
                                  <li className="relative wrong-bg rounded-[5px] text-center my-2 flex">
                                    <input
                                      type="text"
                                      className='w-full py-4 bg-transparent border-transparent text-center'
                                      value={item}
                                      onChange={(event) => {
                                        const val = event.target.value;
                                        setAddedChoices((prevChoices) => {
                                          const updatedChoices = [...prevChoices];
                                          updatedChoices[index] = val;
                                          return updatedChoices;
                                        });
                                      }}
                                    />
                                    <div className='absolute right-5 top-3 mbg-100 px-2 rounded-[20px]'>
                                      <button
                                        className='mcolor-900 deleteChoiceBtn relative text-3xl'
                                        onClick={() => handleDeleteChoice(index, item)}
                                        >
                                        ×
                                      </button>
                                    </div>
                                  </li>
                                  )
                                })}

                                {/* Add a choice */}
                                <div className='my-2 relative '>
                                  <input
                                    type="text"
                                    className='brd-btn border-bottom-thin addAChoice w-full py-4 bg-transparent border-transparent text-center rounded-[5px]'
                                    placeholder='Add a choice'
                                    onChange={(event) => {
                                      setAddedChoice(event.target.value);
                                    }}
                                    value={addedChoice}
                                    required
                                  />

                                  <div className='absolute right-5 top-3 mbg-100 px-2 rounded-[20px]'>
                                    <button
                                      className='deleteChoiceBtn relative text-3xl'
                                      onClick={() => {
                                        if(addedChoice !== ""){
                                          setAddedChoices([...addedChoices, addedChoice])
                                          setAddedChoice("");
                                        } else {
                                          alert("Cannot add an empty field.")
                                        }
                                      }}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </ul>
                            </div>

                            <div className='flex justify-end mt-5'>
                              
                            <button className='mbg-800 mcolor-100 py-2 px-16 rounded-[5px]'
                              onClick={() => {
                                let updatedChoices = addedChoices.filter((item) => item.trim() !== ""); // Trim addedChoices to remove any whitespace

                                if (addedQuestionStr.trim() !== "" && updatedChoices.length > 1) {
                                  setGeneratedQA((prevGeneratedQA) => {
                                    // Check if true_or_false_sentences is an array, if not, initialize it
                                    const trueOrFalseSentences = Array.isArray(prevGeneratedQA.true_or_false_sentences)
                                      ? prevGeneratedQA.true_or_false_sentences
                                      : [];

                                    return {
                                      ...prevGeneratedQA,
                                      true_or_false_sentences: [
                                        {
                                          sentence: addedQuestionStr,
                                          answer: addedAnswerStr,
                                          distractors: updatedChoices,
                                        },
                                        ...trueOrFalseSentences,
                                      ],
                                    };
                                  });

                                  setAddedQuestionStr("");
                                  setAddedAnswerStr("");
                                  setAddedChoice("");
                                  setAddedChoices([]);

                                  fetchData();
                                } else {
                                  addedChoices.map((item) => item.trim() === "" && alert("Fill out the empty fields."));

                                  if (updatedChoices.length <= 1) {
                                    alert("Please provide at least two choices to proceed.");
                                  }

                                  if (addedQuestionStr.trim() === "") {
                                    alert("Fill out the empty fields.");
                                  }
                                }
                              }}
                            >
                              Add
                            </button>

                            </div>
                          </div>
                        }

                        <br /><br />
                        
                        {generatedQA.true_or_false_sentences && generatedQA.true_or_false_sentences.length > 0 ? (
                          <table className='w-full'>
                            <thead>
                            <tr className={`${extraSmallDevice ? 'text-sm' : 'text-md'}`}>
                                <th className='pr-5 text-start'>#</th>
                                <th className='text-start w-full'>Sentence</th>
                                <th className='w-1/3'>Action</th>
                              </tr>
                            </thead>

                            {generatedQA.true_or_false_sentences.map((item, index) => (
                              item && item.distractors && item.distractors.length > 0 && (
                                <tr key={index}>
                                  <td className='pr-5'>{index + 1}</td>
                                  <td>
                                    <div className='flex items-center my-3 '>
                                      <textarea
                                        key={index}
                                        value={item.sentence || ''}
                                        onChange={(event) => trueSentenceChange(event, index)}
                                        className={`mt-10 w-full text-start correct-bg mcolor-800 ${(extraLargeDevices || largeDevices) ? 'text-md p-5' : (extraSmallDevice) ? 'text-sm p-2' : 'text-sm p-3'} rounded-[5px]`}
                                        rows={Math.ceil((item.sentence ? item.sentence.length : 0) / 50) + 1}
                                      ></textarea>
                                      <span className={`${(extraLargeDevices || largeDevices) ? 'text-md mx-8' : (extraSmallDevice) ? 'text-sm mx-2' : 'text-sm mx-4'} mt-6`}>True</span>
                                    </div>
                                    {item.distractors.map((distractor, distractorIndex) => (
                                      <div className='flex items-center my-3' key={distractorIndex}>
                                        <textarea
                                          value={distractor || ''}
                                          onChange={(event) => distractorChange(event, distractorIndex, index)}
                                          className={`w-full text-start wrong-bg mcolor-800 text-md rounded-[5px] ${(extraLargeDevices || largeDevices) ? 'text-md p-5' : (extraSmallDevice) ? 'text-sm p-2' : 'text-sm p-3'}`}
                                          rows={Math.ceil((distractor ? distractor.length : 0) / 50) + 1}
                                        ></textarea>
                                        <span className={`ml-3 ${(extraLargeDevices || largeDevices) ? 'text-md' : (extraSmallDevice) ? 'text-sm' : 'text-md'}`}>False</span>
                                        <button
                                          className={`ml-3 text-center ${(extraLargeDevices || largeDevices) ? 'text-md' : (extraSmallDevice) ? 'text-sm' : 'text-md'} mcolor-800 mbg-200 border-thin-800 px-3 py-1 rounded-[5px]`}
                                          onClick={() => {
                                            deleteTrueDistractorItem(index, distractorIndex);
                                          }}
                                        >
                                          x
                                        </button>
                                      </div>
                                    ))}
                                  </td>

                                  <td className='flex justify-center pt-6'>
                                    <button
                                      className={`mt-8 text-center ${(extraLargeDevices || largeDevices) ? 'text-md px-4' : (extraSmallDevice) ? 'text-sm px-2' : 'text-sm px-3'} bg-red mcolor-100 py-1 rounded-[5px]`}
                                      onClick={() => {
                                        deleteTrueSentenceItem(index);
                                      }}
                                    >
                                      Remove all items
                                    </button>
                                  </td>
                                </tr>
                              )
                            ))}
                          </table>
                        ) : (
                          <div className='text-center text-lg font-medium mcolor-500'>No records found</div>
                        )}
                      </div>
                    )}



                    {showFillInTheBlanks && (
                      <div className='min-h-[90vh]'>
                        <div className='flex items-center mb-10'>
                          <input
                            type="text"
                            className='w-full mb-5 brd-btn border-bottom-thin bg-transparent border-transparent px-5 py-3'
                            placeholder='Sentence...'
                            onChange={(event) => {
                              setAddedFITBSentence(event.target.value);
                            }}
                            value={addedFITBSentence}
                          />
                          <input
                            type="text"
                            className='w-1/2 ml-4 mb-5 brd-btn border-bottom-thin bg-transparent border-transparent px-5 py-3'
                            placeholder='Answer...'
                            onChange={(event) => {
                              setAddedFITBAnswer(event.target.value);
                            }}
                            value={addedFITBAnswer}
                          />
                          <button className='mcolor-100 mbg-800 px-10 py-1 ml-4 rounded-[5px]' onClick={addSentenceAndAnswerToTheList}>Add</button>
                        </div>

                        {generatedQA && generatedQA.fill_in_the_blanks && generatedQA.fill_in_the_blanks.sentences && generatedQA.fill_in_the_blanks.sentences.length > 0 ? (
                          <div>
                            <table className={`${(extraSmallDevice || smallDevice) && 'hidden'} w-full`}>
                              <thead>
                                <tr className={`${extraSmallDevice ? 'text-sm' : 'text-md'}`}>
                                  <th className='pr-5 text-start'>#</th>
                                  <th className='pr-5 text-start px-5'>Sentence</th>
                                  <th className='pb-5 text-start px-3'>Answer</th>
                                </tr>
                              </thead>
                              {Array.isArray(generatedQA.fill_in_the_blanks.sentences) &&
                                generatedQA.fill_in_the_blanks.sentences.map((item, index) => (
                                  <tr key={index}>
                                    <td className='pr-5'>{index + 1}</td>
                                    <td className='pr-5 w-3/4 text-justify text-start mcolor-800 text-lg pb-5 px-5'>
                                      <textarea
                                        key={index}
                                        value={item || ''}
                                        onChange={(event) => fillInTheBlankSentenceChange(event, index)}
                                        className={`w-full px-5 pt-4 text-start mcolor-800 ${(extraLargeDevices || largeDevices || mediumDevices) ? 'text-md' : (extraSmallDevice) ? 'text-sm' : 'text-md'} mbg-input border-thin-800 rounded`}
                                        rows={Math.ceil((item || '').length / 50) + 1}
                                      ></textarea>
                                    </td>
                                    <td className='text-center mcolor-800 text-lg flex gap-5'>
                                      <input
                                        key={index}
                                        type="text"
                                        value={(generatedQA.fill_in_the_blanks.answer && generatedQA.fill_in_the_blanks.answer[index]) || ''}
                                        onChange={(event) => fillInTheBlankAnswerChange(event, index)}
                                        className='text-center mbg-200 rounded border-thin-800'
                                      />
                                      <button className='text-center text-md bg-red mcolor-100 px-4 py-1 rounded-[5px]' onClick={() => { deleteFITBItem(index) }}>Remove</button>
                                    </td>
                                  </tr>
                                )).reverse() /* Use reverse() to display items in reverse order */}
                            </table>


                            <div className={`${(extraSmallDevice || smallDevice) ? '' : 'hidden'} w-full`}>
                            {Array.isArray(generatedQA.fill_in_the_blanks.sentences) && generatedQA.fill_in_the_blanks.sentences.reverse().map((item, index) => (
                              <div key={index} className='w-full mb-7'>
                                <div className='flex items-center justify-end'>
                                  <button className={`text-center ${(extraLargeDevices || largeDevices || mediumDevices) ? 'text-md' : (extraSmallDevice) ? 'text-sm' : 'text-md'} bg-red mcolor-100 px-4 py-1 rounded-[5px]`} onClick={() => {deleteFITBItem(index)}}>Remove</button>
                                </div>

                                <div className='text-justify text-start mcolor-800 w-full'>
                                  <p className={`font-medium mb-1 ${extraSmallDevice ? 'text-sm' : 'text-md'}`}>Question: </p>
                                  <textarea
                                    key={index}
                                    value={item || ''} 
                                    onChange={(event) => fillInTheBlankSentenceChange(event, index)}
                                    className={`w-full px-5 pt-4 text-start mcolor-800 ${(extraLargeDevices || largeDevices || mediumDevices) ? 'text-md' : (extraSmallDevice) ? 'text-sm' : 'text-md'} mbg-input border-thin-800 rounded`}
                                    rows={Math.ceil((item || '').length / 50) + 1}
                                  ></textarea>
                                </div>
                                <div className='text-justify text-start mcolor-800 w-full'>
                                <p className={`font-medium mb-1 ${extraSmallDevice ? 'text-sm' : 'text-md'}`}>Answer: </p>
                                  <input
                                    key={index} 
                                    type="text" 
                                    value={(generatedQA.fill_in_the_blanks.answer && generatedQA.fill_in_the_blanks.answer[index]) || ''}
                                    onChange={(event) => fillInTheBlankAnswerChange(event, index)}
                                    className={`text-center border-thin-800 mbg-input rounded w-full ${(extraLargeDevices || largeDevices || mediumDevices) ? 'text-md' : (extraSmallDevice) ? 'text-sm' : 'text-md'}`}
                                  />
                                </div>
                                <div className='border-bottom-thin-gray mt-7'></div>
                              </div>
                            ))}
                            </div>

                          </div>
                        ) : (
                          <div className='text-center text-lg font-medium mcolor-500'>No records found</div>
                        )}
                      </div>
                    )}




                  








                    {showIdentification && (
                      <div className='min-h-[90vh]'>
                        <div className='flex items-center mb-10'>
                          <input
                            type="text"
                            className='w-full mb-5 brd-btn border-bottom-thin bg-transparent border-transparent px-5 py-3'
                            placeholder='Question...'
                            onChange={(event) => setAddedQuestionStr(event.target.value)}
                            value={addedQuestionStr}
                          />
                          <input
                            type="text"
                            className='w-1/2 ml-4 mb-5 brd-btn border-bottom-thin bg-transparent border-transparent px-5 py-3'
                            placeholder='Answer...'
                            onChange={(event) => setAddedAnswerStr(event.target.value)}
                            value={addedAnswerStr}
                          />

                          <button
                            className='mcolor-100 mbg-800 px-10 py-1 ml-4 rounded-[5px]'
                            onClick={() => {
                              if (addedAnswerStr.trim() !== "" && addedQuestionStr.trim() !== "") {
                                const newPair = { question: addedQuestionStr, answer: addedAnswerStr, distractors: [] };
                                setGeneratedQA((prevGeneratedQA) => ({
                                  ...prevGeneratedQA,
                                  question_answer_pairs: Array.isArray(prevGeneratedQA.question_answer_pairs)
                                    ? [newPair, ...prevGeneratedQA.question_answer_pairs]
                                    : [newPair],
                                }));

                                setAddedQuestionStr("");
                                setAddedAnswerStr("");
                              } else {
                                alert("Fill out the empty fields.");
                              }
                            }}
                          >
                            Add
                          </button>
                        </div>

                        {Array.isArray(generatedQA.question_answer_pairs) && generatedQA.question_answer_pairs.length > 0 && generatedQA.question_answer_pairs.filter((pair) => pair.distractors.length === 0).length > 0 ? (
                          <div>
                            <table className={`${(extraSmallDevice || smallDevice) && 'hidden'} w-full`}>
                              <thead>
                                <tr className={`${extraSmallDevice ? 'text-sm' : 'text-md'}`}>
                                  <th className='pr-5 text-start'>#</th>
                                  <th className='text-start pl-5'>Question</th>
                                  <th className='text-start pb-5'>Answer</th>
                                </tr>
                              </thead>
                              <tbody>
                                {shuffleArray(generatedQA.question_answer_pairs)
                                  .filter((pair) => pair.distractors.length === 0)
                                  .map((pair, index) => (
                                    <tr key={index}>
                                      <td className='pr-5'>{index + 1}</td>
                                      <td className='pr-5 w-3/4 text-justify text-start mcolor-800 text-lg pb-5 px-5'>
                                        <textarea
                                          type="text"
                                          className={`w-full px-5 pt-4 text-start mcolor-800 ${(extraLargeDevices || largeDevices || mediumDevices) ? 'text-md' : (extraSmallDevice) ? 'text-sm' : 'text-md'} mbg-input border-thin-800 rounded`}
                                          value={pair.question}
                                          rows={Math.ceil((pair.question || '').length / 50) + 1}
                                          onChange={(event) => {
                                            let val = event.target.value;
                                            setGeneratedQA((prevGeneratedQA) => {
                                              const updatedPairs = Array.isArray(prevGeneratedQA.question_answer_pairs)
                                                ? [...prevGeneratedQA.question_answer_pairs]
                                                : [];
                                              const pairToUpdate = updatedPairs.find((p) => p === pair);
                                              if (pairToUpdate) {
                                                const itemIndex = updatedPairs.indexOf(pairToUpdate);
                                                const updatedItem = { ...pairToUpdate };
                                                updatedItem.question = val;
                                                updatedPairs[itemIndex] = updatedItem;
                                              }
                                              return {
                                                ...prevGeneratedQA,
                                                question_answer_pairs: updatedPairs,
                                              };
                                            });
                                          }}
                                        ></textarea>
                                      </td>
                                      <td className='text-center mcolor-800 text-lg flex gap-5'>
                                        <input
                                          type="text"
                                          className={`text-center border-thin-800 mbg-input rounded w-full ${(extraLargeDevices || largeDevices || mediumDevices) ? 'text-md' : (extraSmallDevice) ? 'text-sm' : 'text-md'}`}
                                          value={pair.answer}
                                          onChange={(event) => {
                                            let val = event.target.value;
                                            setGeneratedQA((prevGeneratedQA) => {
                                              const updatedPairs = Array.isArray(prevGeneratedQA.question_answer_pairs)
                                                ? [...prevGeneratedQA.question_answer_pairs]
                                                : [];
                                              const pairToUpdate = updatedPairs.find((p) => p === pair);
                                              if (pairToUpdate) {
                                                const itemIndex = updatedPairs.indexOf(pairToUpdate);
                                                const updatedItem = { ...pairToUpdate };
                                                updatedItem.answer = val;
                                                updatedPairs[itemIndex] = updatedItem;
                                              }
                                              return {
                                                ...prevGeneratedQA,
                                                question_answer_pairs: updatedPairs,
                                              };
                                            });
                                          }}
                                        />

                                        <button
                                          className='bg-red mcolor-100 py-1 px-5 rounded-[5px]'
                                          onClick={() => {
                                            setGeneratedQA((prevGeneratedQA) => {
                                              const updatedPairs = Array.isArray(prevGeneratedQA.question_answer_pairs)
                                                ? prevGeneratedQA.question_answer_pairs.filter((p) => p !== pair)
                                                : [];
                                              return {
                                                ...prevGeneratedQA,
                                                question_answer_pairs: updatedPairs,
                                              };
                                            });
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>

                            <div className={`${(extraSmallDevice || smallDevice) ? '' : 'hidden'} w-full`}>
                              {Array.isArray(generatedQA.question_answer_pairs) && generatedQA.question_answer_pairs.length > 0 && generatedQA.question_answer_pairs.filter(item => item.quizType === 'Identification')
                              .reverse()
                              .map((item, index) => (
                                <div key={index} className='w-full mb-7'>
                                  <div className='flex items-center justify-end'>
                                    <button className={`text-center ${(extraLargeDevices || largeDevices || mediumDevices) ? 'text-md' : (extraSmallDevice) ? 'text-sm' : 'text-md'} bg-red mcolor-100 px-4 py-1 rounded-[5px]`}                                           onClick={() => {
                                      setGeneratedQA((prevGeneratedQA) => {
                                        const updatedPairs = Array.isArray(prevGeneratedQA.question_answer_pairs)
                                          ? prevGeneratedQA.question_answer_pairs.filter((p) => p !== item)
                                          : [];
                                        return {
                                          ...prevGeneratedQA,
                                          question_answer_pairs: updatedPairs,
                                        };
                                      });
                                    }}>Delete</button>
                                  </div>

                                  <div className='text-justify text-start mcolor-800 w-full'>
                                    <p className={`font-medium mb-1 ${extraSmallDevice ? 'text-sm' : 'text-md'}`}>Question: </p>
                                    <textarea
                                      key={index}
                                      className={`w-full px-5 pt-4 text-start mcolor-800 ${(extraLargeDevices || largeDevices || mediumDevices) ? 'text-md' : (extraSmallDevice) ? 'text-sm' : 'text-md'} mbg-input border-thin-800 rounded`}
                                      value={item.question}
                                      rows={Math.ceil((item.question || '').length / 50) + 1}
                                      onChange={(event) => {
                                        let val = event.target.value;
                                        setGeneratedQA((prevGeneratedQA) => {
                                          const updatedPairs = Array.isArray(prevGeneratedQA.question_answer_pairs)
                                            ? [...prevGeneratedQA.question_answer_pairs]
                                            : [];
                                          const pairToUpdate = updatedPairs.find((p) => p === item);
                                          if (pairToUpdate) {
                                            const itemIndex = updatedPairs.indexOf(pairToUpdate);
                                            const updatedItem = { ...pairToUpdate };
                                            updatedItem.question = val;
                                            updatedPairs[itemIndex] = updatedItem;
                                          }
                                          return {
                                            ...prevGeneratedQA,
                                            question_answer_pairs: updatedPairs,
                                          };
                                        });
                                      }}
                                    ></textarea>
                                  </div>
                                  <div className='text-justify text-start mcolor-800 w-full'>
                                    <p className={`font-medium mb-1 ${extraSmallDevice ? 'text-sm' : 'text-md'}`}>Answer: </p>
                                    <input
                                      key={index} 
                                      type="text" 
                                      className={`text-center border-thin-800 mbg-input rounded w-full ${(extraLargeDevices || largeDevices || mediumDevices) ? 'text-md' : (extraSmallDevice) ? 'text-sm' : 'text-md'}`}
                                      value={item.answer}
                                      onChange={(event) => {
                                        let val = event.target.value;
                                        setGeneratedQA((prevGeneratedQA) => {
                                          const updatedPairs = Array.isArray(prevGeneratedQA.question_answer_pairs)
                                            ? [...prevGeneratedQA.question_answer_pairs]
                                            : [];
                                          const pairToUpdate = updatedPairs.find((p) => p === item);
                                          if (pairToUpdate) {
                                            const itemIndex = updatedPairs.indexOf(pairToUpdate);
                                            const updatedItem = { ...pairToUpdate };
                                            updatedItem.answer = val;
                                            updatedPairs[itemIndex] = updatedItem;
                                          }
                                          return {
                                            ...prevGeneratedQA,
                                            question_answer_pairs: updatedPairs,
                                          };
                                        });
                                      }}
                                    />
                                  </div>
                                  <div className='border-bottom-thin-gray mt-7'></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className='text-center text-lg font-medium mcolor-500'>No records found</div>
                        )}
                      </div>
                    )}




                  </div>
                </>
             
            </ol>


            </div>
          </GeneratedQAResult.Provider>
        </PDFDetails.Provider>
      </div>


    </div>
  );
};

