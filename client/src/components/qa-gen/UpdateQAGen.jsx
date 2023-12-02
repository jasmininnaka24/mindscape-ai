import React, { useEffect, useRef, useState } from 'react'
import { useUser } from '../../UserContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { debounce } from 'lodash'; // or any other debounce implementation



export const UpdateQAGen = ({ groupId, categoryFor }) => {

  const textAreaRef = useRef(null);

  const { user } = useUser()
  const UserId = user?.id;

  const { materialID } = useParams();
  const navigate = useNavigate()
  const [materialCategory, setMaterialCategory] = useState([]); 
  const [materialCategoryId, setMaterialCategoryId] = useState([]); 
  const [studyMaterial, setStudyMaterial] = useState([]);
  const [studyMaterialCategories, setStudyMaterialCategories] = useState([]);
  const [pdfDetails, setPDFDetails] = useState('')
  const [materialMCQ, setMaterialMCQ] = useState([])
  const [materialMCQChoices, setMaterialMCQChoices] = useState([])
  const [materialMCQChoicesUnflat, setMaterialMCQChoicesUnflat] = useState([])
  const [materialTitle, setMaterialTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false); 

  const [activeButton, setActiveButton] = useState(1); 
  const [showMCQAs, setShowMCQAs] = useState(true);
  const [showGenReviewer, setShowGenReviewer] = useState(false);
  const [showTrueOrFalseSentences, setShowTrueOrFalseSentences] = useState(false);
  const [showFillInTheBlanks, setShowFillInTheBlanks] = useState(false);
  const [showIdentification, setShowIdentification] = useState(false)

  const [isChanged, setIsChanged] = useState();

  // MCQA
  const [activeBtnMCQAs, setActiveBtnMCQAs] = useState(true); 
  const [addedQuestionStr, setAddedQuestionStr] = useState("");
  const [addedAnswerStr, setAddedAnswerStr] = useState("");
  const [addedChoice, setAddedChoice] = useState("");
  const [addedChoices, setAddedChoices] = useState([]);


  // QA Rev
  const [materialRev, setMaterialRev] = useState([]);
  const [activeBtnRev, setActiveBtnRev] = useState(true); 
  const [revQues, setRevQues] = useState("");
  const [revAns, setRevAns] = useState("");
  
  const fetchData = async () => {
    let studyMaterialLink = `http://localhost:3001/studyMaterial/get-material/${materialID}`;
    let studyMaterialCategoryLink = '';

    if (categoryFor === 'Personal') {
      studyMaterialCategoryLink = `http://localhost:3001/studyMaterialCategory/personal-study-material/${categoryFor}/${UserId}`;
    } else {
      studyMaterialCategoryLink = `http://localhost:3001/studyMaterialCategory/${categoryFor}/${groupId}`;
    }

    try {

      const categoriesResponse = await axios.get(studyMaterialCategoryLink);
      setStudyMaterialCategories(categoriesResponse.data)


      
      const materialResponse = await axios.get(studyMaterialLink);
      setStudyMaterial(materialResponse.data);


      
      const categoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-categoryy/${materialResponse.data.StudyMaterialsCategoryId}`);

      setMaterialCategory(categoryResponse.data);
      setMaterialCategoryId(categoryResponse.data.id);


      let mcqResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialID}`);

      if (categoryFor === 'Personal') {
        setPDFDetails(materialResponse.data.body)
        setMaterialTitle(materialResponse.data.title);

      } else if (categoryFor === 'Group') {
        setPDFDetails(materialResponse.data.body)
        setMaterialTitle(materialResponse.data.title);
        // console.log(materialResponse.data.body);
        
      }
      
      setMaterialMCQ(mcqResponse.data);
      


      if (Array.isArray(mcqResponse.data)) {
        const materialChoices = mcqResponse.data.map(async (materialChoice) => {
          try {
            let choiceResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${materialID}/${materialChoice.id}`);
  

              return choiceResponse.data;
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          });
          
          const responses = await Promise.all(materialChoices);
          const allChoices = responses.flat();
          setMaterialMCQChoices(allChoices);

          setMaterialMCQChoicesUnflat(responses)
          console.log(responses);

        }


  
    } catch (error) {
      console.error('Error:', error);
    }
  }  

  const fetchRevData = async () => {
    const revResponse = await axios.get(`http://localhost:3001/quesRev/study-material-rev/${materialID}`);
    setMaterialRev(revResponse.data);
  }

  useEffect(() => {

    fetchData()
    fetchRevData()


    console.log('mounted');

    return () => { 
        console.log('unmounted')
    }

  }, [UserId, categoryFor, groupId])

   let backgroundColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray']
   let randomIndex = ''
   let randomColor = ''



   function generateRandomString() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
  
    let randomString = '';
  
    // Generate 3 random letters
    for (let i = 0; i < 5; i++) {
      const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
      randomString += randomLetter;
    }
    
    // Generate 4 random numbers
    for (let i = 0; i < 5; i++) {
      const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
      randomString += randomNumber;
    }
    
    // Generate 5 random letters
    for (let i = 0; i < 5; i++) {
      const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
      randomString += randomLetter;
    }
    return randomString;
  }





  const saveGeneratedDataBtn = async (e) => {

    e.preventDefault();

    let hasEmptyFields = false;

    for (let i = 0; i < materialMCQ.length; i++) {

      const qaData = {
        question: materialMCQ[i].question,
        answer: materialMCQ[i].answer,
      };

      if (
        qaData.question === "" ||
        qaData.answer === "" 
      ) {
        hasEmptyFields = true;
        alert("Cannot have empty fields.");
        break; 
      }
      
    }

    for (let i = 0; i < materialRev.length; i++) {

      const qaData = {
        question: materialRev[i].question,
        answer: materialRev[i].answer,
      };

      if (
        qaData.question === "" ||
        qaData.answer === "" 
      ) {
        hasEmptyFields = true;
        alert("Cannot have empty fields.");
        break; 
      }
      
    }

    for (let i = 0; i < materialMCQChoices.length; i++) {

      const qaData = {
        choice: materialMCQChoices[i].choice,
      };

      if (
        qaData.choice === "" 
      ) {
        hasEmptyFields = true;
        alert("Cannot have empty fields.");
        break; 
      }
      
    }


    if (!hasEmptyFields) {
      setIsLoading(true); 

      try {

        setIsLoading(false);
        
        
        // Back to Personal Study Area
        
        setPDFDetails('');
        if (categoryFor === 'Personal') {
          navigate(`/main/personal/study-area`);
        } else if (categoryFor === 'Group') {
          navigate(`/main/group/study-area/${groupId}`);
        }
      


      } catch(err) {
      }

    }
   
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

    setRevQues('')
    setRevAns('')
    setRevQues("");
    setRevAns("");
    setAddedQuestionStr("");
    setAddedAnswerStr("");
    setAddedChoice("");
    setAddedChoices([]);
    setActiveBtnMCQAs(true)
    setActiveBtnRev(true)
  };






  function handleDeleteChoiceAdd(indexToDelete, choice) {

    const confirmed = window.confirm(`Are you sure you want to remove ${choice}?`);

    if (confirmed) {
      setAddedChoices((prevChoices) => {
        const updatedChoices = prevChoices.filter((_, index) => index !== indexToDelete);
        return updatedChoices;
      });
    }
  }




  const handleQuestionChange = async (id, newValue, type) => {

    let updatedMaterialData = []
    let qaId = 0
    
    const qaData = {
      question: newValue,
    };

    if (type === 'MCQA' || type === 'ToF' || type === 'FITB' || type === 'Identification') {
      
      updatedMaterialData = [...materialMCQ];
      qaId = materialMCQ.findIndex(item => item.id === id);
      
    } else {

      updatedMaterialData = [...materialRev];
      qaId = materialRev.findIndex(item => item.id === id);
    }

    if (qaId !== -1) {
      updatedMaterialData[qaId].question = newValue;
    }


    if (type === 'MCQA' || type === 'ToF' || type === 'FITB' || type === 'Identification') {
      setMaterialMCQ(updatedMaterialData)
      await axios.put(`http://localhost:3001/quesAns/update-question/${id}`, qaData);
    } else {
      setMaterialRev(updatedMaterialData)
      await axios.put(`http://localhost:3001/quesRev/update-rev-question/${id}`, qaData);
    }

  };


  


  const handleAnswerChange = async (id, newValue, type) => {
    let updatedMaterialData = []
    let qaId = 0


    const qaData = {
      answer: newValue,
    };



    if (type === 'MCQA' || type === 'ToF' || type === 'FITB' || type === 'Identification') {
      
      updatedMaterialData = [...materialMCQ];
      qaId = materialMCQ.findIndex(item => item.id === id);

    } else {

      updatedMaterialData = [...materialRev];
      qaId = materialRev.findIndex(item => item.id === id);
    }

    if (qaId !== -1) {
      updatedMaterialData[qaId].answer = newValue;
    }


    if (type === 'MCQA' || type === 'ToF' || type === 'FITB' || type === 'Identification') {
      setMaterialMCQ(updatedMaterialData)
      await axios.put(`http://localhost:3001/quesAns/update-answer/${id}`, qaData);
    } else {
      setMaterialRev(updatedMaterialData)
      await axios.put(`http://localhost:3001/quesRev/update-rev-answer/${id}`, qaData);
    }
  };


  const handleChoiceChange = async (choiceId, newValue) => {


    const qaData = {
      choice: newValue,
    };



    setMaterialMCQChoices(prevMaterialMCQChoices => {



      const updatedMaterialMCQChoices = [...prevMaterialMCQChoices];
      const choiceIndex = updatedMaterialMCQChoices.findIndex(choice => choice.id === choiceId);
      
      if (choiceIndex !== -1) {
        updatedMaterialMCQChoices[choiceIndex].choice = newValue;
      }

      return updatedMaterialMCQChoices;
    });


    await axios.put(`http://localhost:3001/quesAnsChoices/update-choices/${choiceId}`, qaData);

  };


  const handleDeleteMaterialMCQItem = async (mcqId) => {

    const confirmed = window.confirm(`Are you sure you want to remove this item?`);

    if (confirmed) {

      await axios.delete(`http://localhost:3001/quesAns/delete-qa/${mcqId}`)
      fetchData();
    }

  };


  const handleDeleteChoice = async (choice, choiceId, type) => {

    const confirmed = window.confirm(`Are you sure you want to remove ${type === 'MCQA' ? choice : 'this item'}?`);

    if (confirmed) {

      await axios.delete(`http://localhost:3001/quesAnsChoices/delete-choice/${choiceId}`)
      
      fetchData();
    }
    
  };
  
  


  // material revs

  const deleteRevQues = async (id) => {
    
    const confirmed = window.confirm(`Are you sure you want to remove this item?`);
    
    if(confirmed) {
      await axios.delete(`http://localhost:3001/quesRev/delete-rev/${id}`)
      
      fetchRevData()
    }
  }



  const addRevItem = async () => {
    if (revQues !== '' && revAns !== '') {
      let data = {
        question: revQues,
        answer: revAns,
        StudyMaterialId: materialID,
        UserId: UserId,
      }

      await axios.post('http://localhost:3001/quesRev', data);
      
      fetchRevData()

  

    } else {
      alert('Field cannot be empty');
    }
  
  };
  
  

  const addItem = async (type) => {
    if (revQues !== '' && revAns !== '') {


      randomIndex = Math.floor(Math.random() * backgroundColors.length);
      randomColor = backgroundColors[randomIndex];


      const qaData = {
        question: addedQuestionStr,
        answer: addedAnswerStr,
        bgColor: randomColor,
        quizType: type === 'FITB' ? 'FITB' : 'Identification',
        StudyMaterialId: materialID,
        UserId: UserId,
      };

      await axios.post('http://localhost:3001/quesAns', qaData);

      
      fetchData()

      setRevQues("");
      setRevAns("");
    } else {
      alert('Field cannot be empty');
    }
  
  };
  


  const handleTitleChange = async (newValue, materialId) => {

    if (newValue !== '') {
      const studyMaterialsData = {
        title: newValue,
      };
      
      setMaterialTitle(newValue)
      await axios.put(`http://localhost:3001/studyMaterial/update-study-title/${materialId}`, studyMaterialsData);


    }

    
  }


  const handleBodyChange = async (newValue) => {
    const studyMaterialsData = {
      body: newValue,
    };

    setPDFDetails(newValue)
    await axios.put(`http://localhost:3001/studyMaterial/update-study-body/${materialID}`, studyMaterialsData);

  }


  const handleCategoryIdChange = async (newValue) => {
    const studyMaterialsData = {
      StudyMaterialsCategoryId: parseInt(newValue, 10),
    };

    setMaterialCategoryId(newValue)
    await axios.put(`http://localhost:3001/studyMaterial/update-study-categorId/${materialID}`, studyMaterialsData);
    
  }
  


  return (
    <div>
      <div className='poppins mcolor-900'>
        <div  className="border-hard-800 gen-box flex justify-between items-center rounded">
          <div className='h-full w-full border-none'>
            <textarea
              onChange={(event) => handleBodyChange(event.target.value)}
              className='w-full h-full p-5 bg-transparent border-thin-800'
              style={{ resize: 'none', outline: 'none' }}
              value={pdfDetails}
            ></textarea>
          </div>
        </div>


        <br /><br />
        <div className='flex justify-center mb-10'>
          <form>
            <input required type="text" value={materialTitle !== '' ? materialTitle : ''} onChange={(event) => handleTitleChange(event.target.value, materialID)} placeholder='Title...' className='border-hard-800 rounded-[5px] py-2 px-5' />

            <select
              required
              className='border-hard-800 rounded-[5px] py-2 px-2 mx-3 outline-none'
              onChange={(event) => handleCategoryIdChange(event.target.value)}
              value={materialCategoryId}
            >
              {/* Display the current category at the top */}
              <option key={materialCategoryId} value={materialCategoryId}>
                {studyMaterialCategories.find(category => category.id === parseInt(materialCategoryId, 10))?.category || 'Select a category'}
              </option>

              {/* Map over other categories */}
              {studyMaterialCategories.map((category) => (
                // Skip the current category as it's already displayed at the top
                category.id !== parseInt(materialCategoryId, 10) && (
                  <option key={category.id} value={category.id}>
                    {category.category}
                  </option>
                )
              ))}
            </select>



            <button
              onClick={(e) => saveGeneratedDataBtn(e)}
              className={`mbg-800 mcolor-100 px-10 py-2 text-xl font-bold rounded-[5px] ${isLoading ? 'wrong-bg' : ''}`}
              disabled={isLoading} 
            >
              {isLoading ? 'Saving...' : 'Update Data'}
            </button>
          </form>
        </div>

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
                              onClick={() => handleDeleteChoiceAdd(index, item)}
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
                    
                  <button
                    className='mbg-800 mcolor-100 py-2 px-16 rounded-[5px]'
                    onClick={() => {
                      let updatedChoices = addedChoices.filter((item) => item.trim() !== ""); 

                      if (addedAnswerStr.trim() !== "" && addedQuestionStr.trim() !== "" && updatedChoices.length > 1) {
            
                        const saveQuesAndAns = async () => {

                          randomIndex = Math.floor(Math.random() * backgroundColors.length);
                          randomColor = backgroundColors[randomIndex];


                          const qaData = {
                            question: addedQuestionStr,
                            answer: addedAnswerStr,
                            bgColor: randomColor,
                            quizType: 'MCQA',
                            StudyMaterialId: materialID,
                            UserId: UserId,
                          };
              
                          const qaResponse = await axios.post(
                            'http://localhost:3001/quesAns',
                            qaData
                          );
                          
                          for (let j = 0; j < updatedChoices.length; j++) {
                            let qacData = {
                              choice: updatedChoices[j],
                              QuesAnId: qaResponse.data.id,
                              StudyMaterialId: materialID,
                              UserId: UserId,
                            };
                
                            if (qacData.choice !== "") {
                              await axios.post(
                                'http://localhost:3001/quesAnsChoices',
                                qacData
                              );
                              console.log("Saved!");
                            }
                          }
                        }


                        saveQuesAndAns()

                        
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
                        
                        if (addedAnswerStr.trim() === "" || addedQuestionStr.trim() === "") {
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
            </div>


            {materialMCQ.filter(item => item.quizType === 'MCQA').length !== 0 ? (
              materialMCQ
              .filter(item => item.quizType === 'MCQA')
              .reverse()
              .map((item, index) => (
                  <div key={item.id} className="mb-8">
  
                    <div className='flex justify-end mb-4'>
                      {/* Delete button */}
                      <button
                        className='bg-red mcolor-100 py-1 px-5 rounded-[5px]'
                        onClick={() => handleDeleteMaterialMCQItem(item.id)}
                      >
                        Delete
                      </button>
                    </div>
  
  
                    <input  
                      className='mb-4 brd-btn border-bottom-thin  addAChoice w-full bg-transparent border-transparent text-center py-3' 
                      value={item.question}
                      onChange={(e) => handleQuestionChange(item.id, e.target.value, 'MCQA')}
                      />
  
                    <ul className="grid-result gap-4">
                      <li className="correct-bg rounded-[5px] text-center my-2">
                        <input
                          type="text"
                          className='w-full py-4 bg-transparent border-transparent text-center'
                          value={item.answer}
                          onChange={(e) => handleAnswerChange(item.id, e.target.value, 'MCQA')}
                        />
                      </li>
                      {materialMCQChoices
                        .filter(choice => choice.QuesAnId === item.id)
                        .map((choice, choiceIndex) => (
                          <div key={choice.id}>
                            <li className="relative wrong-bg rounded-[5px] text-center my-2 flex" key={choiceIndex}>
                              <input
                                type="text"
                                className='w-full py-4 bg-transparent border-transparent text-center'
                                value={choice.choice}
                                onChange={(event) => handleChoiceChange(choice.id, event.target.value)}
                              />
                              <div className='absolute right-5 top-3 mbg-100 px-2 rounded-[20px]'>
                                <button
                                  className='mcolor-900 deleteChoiceBtn relative text-3xl'
                                  onClick={() => handleDeleteChoice(choice.choice, choice.id, 'MCQA')}
                                  >
                                  ×
                                </button>
                              </div>
                            </li>
  
                          </div>
                        ))}
                    </ul>
  
                  </div>
                ))
              ) : (
                <div className='text-center text-lg font-medium mcolor-500'>No records found</div>
              )
              
            }

          </div>
        }

        {showGenReviewer && (
          <div className='min-h-[90vh]'>

            <div>
              <button onClick={() => {
                setActiveBtnRev(activeBtnRev === false ? true : false)
              }} className={`border-hard-800 mcolor-900 px-5 py-1 rounded-[5px] ${activeBtnRev === false ? 'hidden' : ''}`}>Add Item</button>
            </div>
            
            <div className='flex justify-end' >
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
            
            <ul>
              {materialRev.length !== 0 ? (
                materialRev.slice().reverse().map((material, index) => (
                  <li key={index} className='mb-20 text-lg'>
                    <div className='flex justify-end my-5'>
                      <button onClick={() => deleteRevQues(material.id)} className='bg-red mcolor-100 px-5 py-1 rounded-[5px]'>Delete</button>
                    </div>
  
                    <ul className="grid-result gap-2">
                      <div className='flex items-center'>
                        <textarea
                          className='py-5 px-2 outline-none addAChoice w-full h-full wrong-bg brd-btn rounded-[5px] text-center overflow-auto resize-none'
                          value={material.question ? `${material.question}` : ''}
                          onChange={(event) => handleQuestionChange(material.id, event.target.value, 'Rev')}
                          cols={50} 
                          rows={Math.ceil((material.question ? material.question.length : 0) / 50)}
  
                          />
  
                      </div>
                      <div className=''>
                        <textarea
                          className='font-medium py-5 px-2 w-full h-full outline-none addAChoice brd-btn rounded-[5px] text-center overflow-auto resize-none correct-bg opacity-75'
                          value={material.answer ? `${material.answer}` : ''}
                          onChange={(event) => handleAnswerChange(material.id, event.target.value, 'Rev')}
                          cols={50} 
                          rows={Math.ceil((material.answer ? material.answer.length : 0) / 50)}
                          
                          />
                      </div>
                    </ul>
  
  
                  </li>
                )) 
                ) : (
                <div className='text-center text-lg font-medium mcolor-500'>No records found</div>
                )
              }
            </ul>

          </div>
        )}




        {showTrueOrFalseSentences && (
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
                              onClick={() => handleDeleteChoiceAdd(index, item)}
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
                    
                  <button
                    className='mbg-800 mcolor-100 py-2 px-16 rounded-[5px]'
                    onClick={() => {
                      let updatedChoices = addedChoices.filter((item) => item.trim() !== ""); // Trim addedChoices to remove any whitespace

                      if (addedQuestionStr.trim() !== "" && updatedChoices.length > 1) {

                        const saveQuesAndAns = async () => {

                          randomIndex = Math.floor(Math.random() * backgroundColors.length);
                          randomColor = backgroundColors[randomIndex];


                          const qaData = {
                            question: addedQuestionStr,
                            answer: 'True',
                            bgColor: randomColor,
                            quizType: 'ToF',
                            StudyMaterialId: materialID,
                            UserId: UserId,
                          };

                          const qaResponse = await axios.post(
                            'http://localhost:3001/quesAns',
                            qaData
                          );
                          
                          for (let j = 0; j < updatedChoices.length; j++) {
                            let qacData = {
                              choice: updatedChoices[j],
                              QuesAnId: qaResponse.data.id,
                              StudyMaterialId: materialID,
                              UserId: UserId,
                            };
                
                            if (qacData.choice !== "") {
                              await axios.post(
                                'http://localhost:3001/quesAnsChoices',
                                qacData
                              );
                              console.log("Saved!");
                            }
                          }
                        }


                        saveQuesAndAns()

                        
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
            </div>
            
            {materialMCQ.filter(item => item.quizType === 'ToF').length !== 0 ? (
            <table className='w-full'>
              <thead>
                <tr className='text-lg'>
                  <th className='pr-5 text-start'>#</th>
                  <th className='text-start w-full'>Sentence</th>
                  <th className='w-1/3'>Action</th>
                </tr>
              </thead>
              {materialMCQ
                .filter(item => item.quizType === 'ToF')
                .reverse()
                .map((item, index) => (
                  <tr key={index}>
                    <td className='pr-5'>{index + 1}</td>
                    <td>
                      <div className='flex items-center my-3 '>
                        <textarea
                          key={index}
                          value={item.question || ''}
                          onChange={(event) => handleQuestionChange(item.id, event.target.value, 'ToF')}
                          className='mt-10 w-full px-5 pt-4 text-start correct-bg mcolor-800 text-lg rounded-[5px]'
                        ></textarea>
                        <span className='mx-8 mt-6'>True</span>
                      </div>
                      {materialMCQChoices
                        .filter(choice => item.id === choice.QuesAnId)
                        .map((choice, choiceIndex) => (
                          <div className='flex items-center my-3' key={choiceIndex}>
                            <textarea
                              value={choice.choice || ''}
                              className='w-full px-5 pt-4 text-start wrong-bg mcolor-800 text-lg rounded-[5px]'
                              onChange={(event) => handleChoiceChange(choice.id, event.target.value)}
                            ></textarea>
                            <span className='ml-3'>False</span>
                            <button
                              className='ml-3 text-center text-lg mcolor-800 mbg-200 border-thin-800 px-3 py-1 rounded-[5px]'
                              onClick={() => handleDeleteChoice(choice.choice, choice.id, 'ToF')}
                            >
                              x
                            </button>
                          </div>
                        ))}
                    </td>

                    <td className='flex justify-center pt-6'>
                      <button
                        className='mt-6 text-center text-lg bg-red mcolor-100 px-4 py-1 rounded-[5px]'
                        onClick={() => handleDeleteMaterialMCQItem(item.id)}
                      >
                        Remove all items
                      </button>
                    </td>
                  </tr>
                ))}

            </table>
            ) : (
              <div className='text-center text-lg font-medium mcolor-500'>No records found</div>
            )}
          </div>
        )}


        {showFillInTheBlanks && (
          <div className='min-h-[90vh]'>
             <div>
                <button onClick={() => {
                  setActiveBtnRev(activeBtnRev === false ? true : false)
                }} className={`border-hard-800 mcolor-900 px-5 py-1 rounded-[5px] ${activeBtnRev === false ? 'hidden' : ''}`}>Add Item</button>
              </div>
              
              <div className='flex justify-end' >
                <button onClick={() => {
                  setActiveBtnRev(activeBtnRev === false ? true : false)
                }} className={`text-4xl mcolor-900 px-5 py-1 rounded-[5px] ${activeBtnRev === true ? 'hidden' : ''}`}> × </button>
              </div>

              {activeBtnRev === false && (
                <div className='mt-5 mb-10'>

                  <label htmlFor="" className='font-medium'>Enter statement:</label>
                  <textarea value={revQues ? `${revQues}` : ''} onChange={(event) => {
                    setRevQues(event.target.value);
                  }} className='bg-transparent brd-btn w-full border-bottom-thin p-2' placeholder='Statement here...' name="" id="" cols="30" rows="1"></textarea>


                  <label htmlFor="" className='mt-5 font-medium'>Enter answer:</label>
                  <textarea value={revAns ? `${revAns}` : ''} onChange={(event) => {
                    setRevAns(event.target.value);
                  }} className='bg-transparent brd-btn w-full border-bottom-thin p-2' placeholder='Answer here...' name="" id="" cols="30" rows="1"></textarea>


                  <div className='flex justify-end mt-5'>
                    <button onClick={() => {

                      const saveData = async () => {

                        randomIndex = Math.floor(Math.random() * backgroundColors.length);
                        randomColor = backgroundColors[randomIndex];

                        const qaData = {
                          question: revQues,
                          answer: revAns,
                          bgColor: randomColor,
                          quizType: 'FITB',
                          StudyMaterialId: materialID,
                          UserId: UserId,
                        };
            
                        await axios.post('http://localhost:3001/quesAns', qaData);
                      }

                      if (revQues === '' || revAns === '') {
                        return alert('Cannot add an empty field')
                      } else {
                        saveData()
                        
                        fetchData()
                        setRevAns('')
                        setRevQues('')
                      }


                    }} className='px-10 py-1 mbg-800 mcolor-100 rounded-[5px]'>Add</button>
                  </div>
                </div>
              )}

              {materialMCQ.filter(item => item.quizType === 'FITB').length !== 0 ? (
                <div>
                  <table className='w-full'>
                    <thead>
                      <tr className='text-lg'>
                        <th className='pr-5 text-start'>#</th>
                        <th className='pr-5 text-start px-5'>Sentence</th>
                        <th className='pb-5 text-start px-3'>Answer</th>
                      </tr>
                    </thead>
                    {materialMCQ
                      .filter(item => item.quizType === 'FITB')
                      .reverse()
                      .map((item, index) => (
                        <tr key={index}>
                          <td className='pr-5'>{index+1}</td>
                          <td className='pr-5 w-3/4 text-justify text-start mcolor-800 text-lg pb-5 px-5'>
                          <textarea
                            key={index}
                            value={item.question || ''} 
                            onChange={(e) => handleQuestionChange(item.id, e.target.value, 'FITB')}
                            className='w-full px-5 pt-4 text-start mcolor-800 text-lg'
                            rows={Math.ceil((item.question ? item.question.length : 0) / 50) + 1}
                          ></textarea>
                          </td>
                          <td className='text-center mcolor-800 text-lg flex gap-5'>   
                            <input
                              key={index} 
                              type="text" 
                              value={item.answer || ''}
                              onChange={(e) => handleAnswerChange(item.id, e.target.value, 'FITB')}
                              className='text-center'
                            />
                            <button className='text-center text-lg bg-red mcolor-100 px-4 py-1 rounded-[5px]' onClick={() => {handleDeleteMaterialMCQItem(item.id)}}>Remove</button>
                          </td>
                        </tr>
                      ))}
                  </table>
                </div>
                ) : (
                  <div className='text-center text-lg font-medium mcolor-500'>No records found</div>
                )
              }
          </div>
        )}


        {showIdentification && (
          <div className='min-h-[90vh]'>
            <div>
              <button onClick={() => {
                setActiveBtnRev(activeBtnRev === false ? true : false)
              }} className={`border-hard-800 mcolor-900 px-5 py-1 rounded-[5px] ${activeBtnRev === false ? 'hidden' : ''}`}>Add Item</button>
            </div>
            
            <div className='flex justify-end' >
              <button onClick={() => {
                setActiveBtnRev(activeBtnRev === false ? true : false)
              }} className={`text-4xl mcolor-900 px-5 py-1 rounded-[5px] ${activeBtnRev === true ? 'hidden' : ''}`}> × </button>
            </div>

            {activeBtnRev === false && (
              <div className='mt-5 mb-10'>

                <label htmlFor="" className='font-medium'>Enter Question:</label>
                <textarea value={revQues ? `${revQues}` : ''} onChange={(event) => {
                  setRevQues(event.target.value);
                }} className='bg-transparent brd-btn w-full border-bottom-thin p-2' placeholder='Question here...' name="" id="" cols="30" rows="1"></textarea>


                <label htmlFor="" className='mt-5 font-medium'>Enter answer:</label>
                <textarea value={revAns ? `${revAns}` : ''} onChange={(event) => {
                  setRevAns(event.target.value);
                }} className='bg-transparent brd-btn w-full border-bottom-thin p-2' placeholder='Answer here...' name="" id="" cols="30" rows="1"></textarea>


                <div className='flex justify-end mt-5'>
                  <button onClick={() => {

                    const saveData = async () => {

                      randomIndex = Math.floor(Math.random() * backgroundColors.length);
                      randomColor = backgroundColors[randomIndex];

                      const qaData = {
                        question: revQues,
                        answer: revAns,
                        bgColor: randomColor,
                        quizType: 'Identification',
                        StudyMaterialId: materialID,
                        UserId: UserId,
                      };
          
                      await axios.post('http://localhost:3001/quesAns', qaData);
                    }

                    if (revQues === '' || revAns === '') {
                      return alert('Cannot add an empty field')
                    } else {
                      saveData()
                      
                      fetchData()
                      setRevQues('')
                      setRevAns('')
                    }


                  }} className='px-10 py-1 mbg-800 mcolor-100 rounded-[5px]'>Add</button>
                </div>
              </div>
            )}

            {materialMCQ.filter(item => item.quizType === 'Identification').length !== 0 ? (
              <div>
                <table className='w-full'>
                  <thead>
                    <tr className='text-lg'>
                      <th className='pr-5 text-start'>#</th>
                      <th className='pr-5 text-start px-5'>Sentence</th>
                      <th className='pb-5 text-start px-3'>Answer</th>
                    </tr>
                  </thead>
                  {materialMCQ
                    .filter(item => item.quizType === 'Identification')
                    .reverse()
                    .map((item, index) => (
                      <tr key={index}>
                        <td className='pr-5'>{index+1}</td>
                        <td className='pr-5 w-3/4 text-justify text-start mcolor-800 text-lg pb-5 px-5'>
                        <textarea
                          key={index}
                          value={item.question || ''} 
                          onChange={(e) => handleQuestionChange(item.id, e.target.value, 'Identification')}
                          className='w-full px-5 pt-4 text-start mcolor-800 text-lg'
                          rows={Math.ceil((item.question ? item.question.length : 0) / 50) + 1}
                        ></textarea>
                        </td>
                        <td className='text-center mcolor-800 text-lg flex gap-5'>   
                          <input
                            key={index} 
                            type="text" 
                            value={item.answer || ''}
                            onChange={(e) => handleAnswerChange(item.id, e.target.value, 'Identification')}
                            className='text-center'
                          />
                          <button className='text-center text-lg bg-red mcolor-100 px-4 py-1 rounded-[5px]' onClick={() => {handleDeleteMaterialMCQItem(item.id)}}>Remove</button>
                        </td>
                      </tr>
                    ))}
                </table>
              </div>
             ) : (
              <div className='text-center text-lg font-medium mcolor-500'>No records found</div>
             )}

          </div>
        )}


          
      </div>
    </div>
  )
}