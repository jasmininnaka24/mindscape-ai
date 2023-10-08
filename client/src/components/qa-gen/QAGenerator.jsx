import React, { createContext, useEffect, useState } from 'react';
import { DropZoneComponent } from './DropZoneComponent';

import './studyArea.css';

// CRUD Command Imports
import { SavedGeneratedData } from './SavedGeneratedData';


export const PDFDetails = createContext();
export const GeneratedQAResult = createContext();

export const QAGenerator = (props) => {

  const { materialFor, groupNameId } = props;  

  const [pdfDetails, setPDFDetails] = useState("");
  const [numInp, setNumInp] = useState(0);
  const [generatedQA, setGeneratedQA] = useState({});
  const [inputValues, setInputValues] = useState([]);
  const [addedQuestionStr, setAddedQuestionStr] = useState("");
  const [addedAnswerStr, setAddedAnswerStr] = useState("");
  const [addedChoice, setAddedChoice] = useState("");
  const [addedChoices, setAddedChoices] = useState([]);
  const [showMCQAs, setShowMCQAs] = useState(true);
  const [showGenReviewer, setShowGenReviewer] = useState(false);
  const [activeButton, setActiveButton] = useState(1); 
  const [activeBtnMCQAs, setActiveBtnMCQAs] = useState(true); 
  const [activeBtnRev, setActiveBtnRev] = useState(true); 
  const [revQues, setRevQues] = useState("");
  const [revAns, setRevAns] = useState("");

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
  }, [generatedQA]);



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
  
  

  const showContent = (contentNumber) => {
    setActiveButton(contentNumber);
    // Hide all divs first
    setShowMCQAs(false);
    setShowGenReviewer(false);

    // Show the selected div
    if (contentNumber === 1) {
      setShowMCQAs(true);
    } else if (contentNumber === 2) {
      setShowGenReviewer(true);
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
  
    console.log(generatedQA.reviewer_ques_pairs);
  };
  
  
  


  return (
    <PDFDetails.Provider value={{ setPDFDetails }}>
      <GeneratedQAResult.Provider value={{ setGeneratedQA, generatedQA }}>
        <div className='poppins mcolor-900'>
          <div data-aos='fade' className="border-hard-800 gen-box flex justify-between items-center">
            <div className='box1 border-box w-1/2'>
              <div className='flex justify-center items-center dropzone'>
                <DropZoneComponent numInp={numInp} setNumInp={setNumInp} setPDFDetails={setPDFDetails} pdfDetails={pdfDetails} />
              </div>
            </div>
            <div className='box2 border-box w-1/2'>
              <div className='h-full border-none'>
                <textarea onChange={(event) => {
                   setPDFDetails(event.target.value)
                   console.log(event.target.value); 
                }} value={pdfDetails ? `${pdfDetails}` : ''} className='w-full h-full p-5 bg-transparent border-thin-800' style={{ resize: 'none', outline: 'none' }}>
                  {pdfDetails}
                </textarea>
              </div>
            </div>
          </div>
        </div>


        <div id='generated-data' className='mcolor-900 generated-box flex justify-center mt-10 py-12'>
        <ol className="poppins pl-6 generatedResult">
          {generatedQA.question_answer_pairs && generatedQA.question_answer_pairs.length > 0 ? (
            <>
              <div>
                {/* Save data button */}
                <div className='flex justify-center mb-10'>
                  <SavedGeneratedData generatedQA={generatedQA} setGeneratedQA={setGeneratedQA} pdfDetails={pdfDetails} setPDFDetails={setPDFDetails} numInp={numInp} setNumInp={setNumInp} materialFor={materialFor} groupNameId={groupNameId} />
                </div>


                {/* tabs */}
                <br />
                <div className='flex justify-center items-center mb-12 rounded-[5px]'>
                  <button className={`w-1/2 text-center py-3 ${activeButton === 1 ? 'mbg-300 rounded-[5px] border-medium-800' : 'border-bottom-medium'}`} onClick={() => showContent(1)}>Generated MCQAs</button>
                  <button className={`w-1/2 text-center py-3 ${activeButton === 2 ? 'mbg-300 rounded-[5px] border-medium-800' : 'border-bottom-medium'}`} onClick={() => showContent(2)}>Generated Notes Reviewer</button>
                </div>


                {showMCQAs && 
                  <div>
    
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
                      </li>
                    ))}
                  </div>
                }


                {showGenReviewer && (
                  <div>
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

                        <textarea
                          className='w-1/2 pb-1 p-2 outline-none addAChoice bg-transparent brd-btn'
                          value={pair && pair.question ? `${pair.question}` : ''}
                          onChange={(event) => revNoteQuestionChange(event, index)}
                          rows={4} // Set the number of visible rows as needed
                          cols={50} // Set the number of visible columns as needed
                        />
                        <textarea
                          className='w-1/2 font-medium p-2 outline-none addAChoice bg-transparent brd-btn'
                          value={pair && pair.answer ? `${pair.answer}` : ''}
                          onChange={(event) => revNoteAnswerChange(event, index)}
                          rows={4} // Set the number of visible rows as needed
                          cols={50} // Set the number of visible columns as needed
                        />
                      </li>
                    ))}
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

