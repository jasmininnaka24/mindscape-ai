import React, { createContext, useEffect, useState } from 'react';
import { DropZoneComponent } from './DropZoneComponent';

import './studyArea.css';

// CRUD Command Imports
import { SavedGeneratedData } from './SavedGeneratedData';
import axios from 'axios';

import { useUser } from '../../UserContext';


export const PDFDetails = createContext();
export const GeneratedQAResult = createContext();

export const QAGenerator = (props) => {


  const { materialFor, groupNameId } = props;  

  const [pdfDetails, setPDFDetails] = useState("");
  const [numInp, setNumInp] = useState(null);
  const [generatedQA, setGeneratedQA] = useState({});
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

    if (materialFor === 'Personal') {
      studyMaterialCategoryLink = `http://localhost:3001/studyMaterialCategory/personal-study-material/${materialFor}/${UserId}`;

      
      const sharedStudyMaterialResponse = await axios.get(studyMaterialCategoryLink);
      console.log(sharedStudyMaterialResponse.data);


    } else if (materialFor === 'Group') {
      studyMaterialCategoryLink = `http://localhost:3001/studyMaterialCategory/${materialFor}/${groupNameId}`;

      const sharedStudyMaterialResponse = await axios.get(studyMaterialCategoryLink);
      console.log(sharedStudyMaterialResponse.data);

    } else {

      // studyMaterialLink = `http://localhost:3001/studyMaterial/study-material-group-category/${categoryFor}/${groupNameId}`;

      const sharedStudyMaterialResponse = await axios.get(`http://localhost:3001/studyMaterial/shared-materials`);
      console.log('API Response:', sharedStudyMaterialResponse.data);
      
      const fetchedSharedStudyMaterialCategory = await Promise.all(
        sharedStudyMaterialResponse.data.map(async (material, index) => {
          const materialCategorySharedResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/shared-material-category/${material.StudyMaterialsCategoryId}/Group/${UserId}`);
          return materialCategorySharedResponse.data;
        })
      );
  
      const uniqueCategories = [...new Set(fetchedSharedStudyMaterialCategory.map(item => item.category))];
  
      // Sort the unique categories alphabetically
      const sortedCategories = uniqueCategories.sort((a, b) => a.localeCompare(b));
      
      // Create an array of promises for each unique category
      const promiseArray = sortedCategories.map(async (category) => {
        // Find the first occurrence of the category in the original array
        const firstOccurrence = fetchedSharedStudyMaterialCategory.find(item => item.category === category);
      
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

  
  const addSentenceToTheList = () => {
    if (addedTrueSentence.trim() === "") {
      return;
    }
  
    const updatedTS = [addedTrueSentence, ...generatedQA.true_or_false_sentences];
    setGeneratedQA({ ...generatedQA, true_or_false_sentences: updatedTS });
  
    setAddedTrueSentence("");
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
  
  // console.log(generatedQA.true_or_false_sentences[0].distractors.length);

  
  const addSentenceAndAnswerToTheList = () => {
    if (addedFITBSentence.trim() === "" || addedFITBAnswer.trim() === "") {
      return alert("Fill out the empty fields.");
      ;
    }
  
    const updatedSentences = [addedFITBSentence, ...generatedQA.fill_in_the_blanks.sentences];
    const updatedAnswers = [addedFITBAnswer, ...generatedQA.fill_in_the_blanks.answer];
    
    const updatedFITB = {
      ...generatedQA.fill_in_the_blanks,
      sentences: updatedSentences,
      answer: updatedAnswers,
    };
  
    setGeneratedQA({ ...generatedQA, fill_in_the_blanks: updatedFITB });
  
    setAddedFITBSentence("");
    setAddedFITBAnswer("");
  };
  
  // console.log(generatedQA.question_answer_pairs[0].distractors.length);


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
    const shuffledArray = [...array];
    // for (let i = shuffledArray.length - 1; i > 0; i--) {
    //   const j = Math.floor(Math.random() * (i + 1));
    //   [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    // }
    return shuffledArray;
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
      setGeneratedQA((prevData) => ({
        ...prevData,
        reviewer_ques_pairs: [
          { question: revQues, answer: revAns },
          ...prevData.reviewer_ques_pairs,
        ],
      }));

      setRevQues("");
      setRevAns("");
      // setActiveBtnRev(true);

    } else {
      alert('Field cannot be empty');
    }
  
  };
  
  
  


  return (
    <PDFDetails.Provider value={{ setPDFDetails }}>
      <GeneratedQAResult.Provider value={{ setGeneratedQA, generatedQA }}>
        <div className='poppins mcolor-900'>
          <div data-aos='fade' className="border-hard-800 gen-box flex justify-between items-center rounded">
            <div className='box1 border-box w-1/2'>
              <div className='flex justify-center items-center dropzone'>
                <DropZoneComponent numInp={numInp} setNumInp={setNumInp} setPDFDetails={setPDFDetails} pdfDetails={pdfDetails}  />
              </div>
            </div>
            <div className='box2 border-box w-1/2'>
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


        <div id='generated-data' className='mcolor-900 generated-box flex justify-center mt-10 py-12'>
        <ol className="poppins pl-6 w-full">
          {generatedQA.question_answer_pairs && generatedQA.question_answer_pairs.length > 0 ? (
            <>
              <div>
                {/* Save data button */}
                <div className='flex justify-center mb-10'>
                  <SavedGeneratedData generatedQA={generatedQA} setGeneratedQA={setGeneratedQA} pdfDetails={pdfDetails} setPDFDetails={setPDFDetails} numInp={numInp} setNumInp={setNumInp} materialFor={materialFor} groupNameId={groupNameId} studyMaterialCategories={studyMaterialCategories} setStudyMaterialCategories={setStudyMaterialCategories} studyMaterialCategoryId={studyMaterialCategoryId} setStudyMaterialCategoryId={setStudyMaterialCategoryId} />
                </div>


                {/* tabs */}
                <br />
                <div className='flex justify-center items-center mb-12 rounded-[5px]'>
                  <button className={`w-full text-center py-3 ${activeButton === 1 ? 'mbg-300 rounded-[5px] border-medium-800' : 'border-bottom-medium border-r border-solid border-gray-500'}`} onClick={() => showContent(1)}>MCQAs</button>
                  <button className={`w-full text-center py-3 ${activeButton === 2 ? 'mbg-300 rounded-[5px] border-medium-800' : 'border-bottom-medium border-r border-solid border-gray-500'}`} onClick={() => showContent(2)}>Notes Reviewer</button>
                  <button className={`w-full text-center py-3 ${activeButton === 3 ? 'mbg-300 rounded-[5px] border-medium-800' : 'border-bottom-medium border-r border-solid border-gray-500'}`} onClick={() => showContent(3)}>True  Sentences</button>
                  <button className={`w-full text-center py-3 ${activeButton === 4 ? 'mbg-300 rounded-[5px] border-medium-800' : 'border-bottom-medium'}`} onClick={() => showContent(4)}>Fill In The Blank</button>
                  <button className={`w-full text-center py-3 ${activeButton === 5 ? 'mbg-300 rounded-[5px] border-medium-800' : 'border-bottom-medium'}`} onClick={() => showContent(5)}>Identification</button>
                </div>


                {showMCQAs && 
                  <div className='min-h-[90vh]'>
    
                    {/* Add item */}
                    <div className='mb-14 mt-10'>

                      {activeBtnMCQAs === true && 
                        <div>
                          <button onClick={() => {
                            setActiveBtnMCQAs(activeBtnMCQAs === false ? true : false)
                          }} className='mcolor-900 border-hard-800 px-5 py-1 rounded-[5px]'>Add Item</button>
                        </div>
                      }

                      
                      {activeBtnMCQAs === false && 
                        <div>
                          <div className='my-2'>
                            <div className='flex justify-end text-4xl'>
                              <button onClick={() => {
                                setActiveBtnMCQAs(activeBtnMCQAs === false ? true : false)

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
    
                    {shuffleArray(generatedQA.question_answer_pairs).map((pair, index) => (
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
                              <input
                                type="text"
                                className='mb-4 brd-btn border-bottom-thin  addAChoice w-full bg-transparent border-transparent text-center py-3'
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
                              />
                            </div>

                            {/* You can add the distractors here */}
                            <ul className="grid-result gap-4">
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
                                        className='mcolor-900 deleteChoiceBtn relative text-3xl'
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
                    ))}
                  </div>
                }


                {showGenReviewer && (
                  <div className='min-h-[90vh]'>
                    <br />

                    <div>
                      <button onClick={() => {
                        setActiveBtnRev(activeBtnRev === false ? true : false)
                      }} className={`border-hard-800 mcolor-900 px-5 py-1 rounded-[5px] ${activeBtnRev === false ? 'hidden' : ''}`}>Add Item</button>
                    </div>
                    
                    <div className='flex justify-end' data-aos="fade">
                      <button onClick={() => {
                        setActiveBtnRev(activeBtnRev === false ? true : false)
                      }} className={`text-4xl mcolor-900 px-5 py-1 rounded-[5px] ${activeBtnRev === true ? 'hidden' : ''}`}> × </button>
                    </div>
                    

                    {activeBtnRev === false && (
                      <div >
                        <div className='mt-5 mb-10'>

                          <label htmlFor="" className='font-medium'>Enter question:</label>
                          <textarea value={revQues ? `${revQues}` : ''} onChange={(event) => {
                            setRevQues(event.target.value);
                          }} className='bg-transparent brd-btn w-full border-bottom-thin p-2' placeholder='Question here...' name="" id="" cols="30" rows="1"></textarea>


                          <label htmlFor="" className='mt-5 font-medium'>Enter answer:</label>
                          <textarea value={revAns ? `${revAns}` : ''} onChange={(event) => {
                            setRevAns(event.target.value);
                          }} className='bg-transparent brd-btn w-full border-bottom-thin p-2' placeholder='Answer here...' name="" id="" cols="30" rows="1"></textarea>


                          <div className='flex justify-end mt-5'>
                            <button onClick={addRevItem} className='px-10 py-1 mbg-800 mcolor-100 rounded-[5px]'>Add</button>
                          </div>
                        </div>
                      </div>
                    )}




                    <br />
                    {generatedQA.reviewer_ques_pairs.map((pair, index) => (
                      <li key={index} className='mb-20 text-lg'>

                        <div className='flex justify-end my-5'>
                          <button onClick={() => deleteRevQues(index)} className='bg-red mcolor-100 px-5 py-1 rounded-[5px]'>Delete</button>
                        </div>


                        <ul className="grid-result gap-2">
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
                    ))}




     
                  </div>
                )}





                {showTrueOrFalseSentences && (
                  <div className='min-h-[90vh]'>

                      {activeBtnMCQAs === true && 
                        <div>
                          <button onClick={() => {
                            setActiveBtnMCQAs(activeBtnMCQAs === false ? true : false)
                          }} className='mcolor-900 border-hard-800 px-5 py-1 rounded-[5px]'>Add Item</button>
                        </div>
                      }

                      
                      {activeBtnMCQAs === false && 
                        <div>
                          <div className='my-2'>
                            <div className='flex justify-end text-4xl'>
                              <button onClick={() => {
                                setActiveBtnMCQAs(activeBtnMCQAs === false ? true : false)

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
                            
                            <button className='mbg-800 mcolor-100 py-2 px-16 rounded-[5px] '
                            onClick={() => {
                              let updatedChoices = addedChoices.filter((item) => item.trim() !== ""); // Trim addedChoices to remove any whitespace

                                if (addedQuestionStr.trim() !== "" && updatedChoices.length > 1) {

                                  generatedQA.true_or_false_sentences.unshift({ sentence: addedQuestionStr, answer: addedAnswerStr, distractors: updatedChoices })


                                  
                                  setAddedQuestionStr("");
                                  setAddedAnswerStr("");
                                  setAddedChoice("");
                                  setAddedChoices([]);

                                  
                                  fetchData()

                                } else {


                                  addedChoices.map((item) => item.trim() === "" && alert("Fill out the empty fields."))

                                  if (updatedChoices.length <= 1 ) {
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


                    <table className='w-full'>
                      <thead>
                        <tr className='text-lg'>
                          <th className='pr-5 text-start'>#</th>
                          <th className='text-start w-full'>Sentence</th>
                          <th className='w-1/3'>Action</th>
                        </tr>
                      </thead>
                      {generatedQA.true_or_false_sentences.map((item, index) => (
                        <tr key={index}>
                          <td className='pr-5'>{index+1}</td>
                          <td>
                            <div className='flex items-center my-3 '>
                              <textarea
                                key={index}
                                value={item.sentence || ''}
                                onChange={(event) => trueSentenceChange(event, index)}
                                className='mt-10 w-full px-5 pt-4 text-start correct-bg mcolor-800 text-lg rounded-[5px]'
                                ></textarea>
                                <span className='mx-8 mt-6'>True</span>
                            </div>
                            {item.distractors.map((distractor, distractorIndex) => (
                              <div className='flex items-center my-3'>
                                <textarea
                                  key={distractorIndex}
                                  value={distractor || ''}
                                  onChange={(event) => distractorChange(event, distractorIndex, index)}
                                  className='w-full px-5 pt-4 text-start wrong-bg mcolor-800 text-lg rounded-[5px]'
                                  ></textarea>
                                <span className='ml-3'>False</span>
                                <button className='ml-3 text-center text-lg mcolor-800 mbg-200 border-thin-800 px-3 py-1 rounded-[5px]' onClick={() => {deleteTrueDistractorItem(index, distractorIndex)}}>x</button>
                              </div>
                            ))}
                          </td>

                          <td className='flex justify-center pt-6'>
                            <button className='mt-6 text-center text-lg bg-red mcolor-100 px-4 py-1 rounded-[5px]' onClick={() => {deleteTrueSentenceItem(index)}}>Remove all items</button>
                          </td>
                        </tr>
                      ))}
                    </table>
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
                    <table className='w-full'>
                      <thead>
                        <tr className='text-lg'>
                          <th className='pr-5 text-start'>#</th>
                          <th className='pr-5 text-start px-5'>Sentence</th>
                          <th className='pb-5 text-start px-3'>Answer</th>
                        </tr>
                      </thead>
                      {Array.isArray(generatedQA.fill_in_the_blanks.sentences) &&
                        generatedQA.fill_in_the_blanks.sentences.map((item, index) => (
                          <tr key={index}>
                            <td className='pr-5'>{index+1}</td>
                            <td className='pr-5 w-3/4 text-justify text-start mcolor-800 text-lg pb-5 px-5'>
                            <textarea
                              key={index}
                              value={item || ''} 
                              onChange={(event) => fillInTheBlankSentenceChange(event, index)}
                              className='w-full px-5 pt-4 text-start mcolor-800 text-lg'
                              rows={Math.ceil((generatedQA.fill_in_the_blanks.sentences[index] || '').length / 50) + 1}
                            ></textarea>
                            </td>
                            <td className='text-center mcolor-800 text-lg flex gap-5'>   
                              <input
                                key={index} 
                                type="text" 
                                value={generatedQA.fill_in_the_blanks.answer[index] || ''}
                                onChange={(event) => fillInTheBlankAnswerChange(event, index)}
                                className='text-center'
                              />
                              <button className='text-center text-lg bg-red mcolor-100 px-4 py-1 rounded-[5px]' onClick={() => {deleteFITBItem(index)}}>Remove</button>
                            </td>
                          </tr>
                        ))}
                    </table>
                  </div>
                )}





                {showIdentification && (
                  <div>
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

                      <button className='mcolor-100 mbg-800 px-10 py-1 ml-4 rounded-[5px]' 
                        onClick={() => {
                          if (addedAnswerStr.trim() !== "" && addedQuestionStr.trim() !== "") {
                            const newPair = { question: addedQuestionStr, answer: addedAnswerStr, distractors: [] }; // Add an empty array for distractors
                            setGeneratedQA(prevState => ({
                              ...prevState,
                              question_answer_pairs: [newPair, ...prevState.question_answer_pairs],
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


                    <table className='w-full'>
                      <thead>
                        <tr className='text-lg'>
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
                                  className='w-full px-5 pt-4 text-start mcolor-800 text-lg'
                                  value={pair.question}
                                  rows={Math.ceil((pair.question || '').length / 50) + 1}

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
                                ></textarea>
                              </td>
                              <td className='text-center mcolor-800 text-lg flex gap-5'>
                                <input
                                  type="text"
                                  className='text-center'
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
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}


              </div>
            </>
          ) : null}
        </ol>


        </div>
      </GeneratedQAResult.Provider>
    </PDFDetails.Provider>
  );
};

