import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { SERVER_URL } from '../../urlConfig';

// icon imports
import DeleteIcon from '@mui/icons-material/Delete';

// responsive sizes
import { useResponsiveSizes } from '../useResponsiveSizes'; 


export const SavedGeneratedData = (props) => {

  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  const [studyMaterialTitle, setStudyMaterialTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [modalAddCategory, setModalAddCategory] = useState(false); 
  const [currentCategoryToAdd, setCurrentCategoryToAdd] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);
  const [categoryListOFUser, setCategoryListOFUser] = useState([]);


  const { user } = useUser();

  const userId = user?.id;

  

  const { generatedQA, setGeneratedQA, pdfDetails, setPDFDetails, numInp, setNumInp, materialFor, groupNameId, studyMaterialCategories, setStudyMaterialCategories, studyMaterialCategoryId, setStudyMaterialCategoryId } = props;

  const genQAData = generatedQA.question_answer_pairs;
  const genQADataRev = generatedQA.reviewer_ques_pairs;
  const genTrueSentences = generatedQA.true_or_false_sentences;
  const genFillInTheBlanks = generatedQA.fill_in_the_blanks;

  const navigate = useNavigate();


  const fetchData = async () => {

    let studyMaterialCategoryLink = '';

    if (materialFor === 'Personal') {
      studyMaterialCategoryLink = `${SERVER_URL}/studyMaterialCategory/personal-study-material/${materialFor}/${userId}`;

      
      await axios.get(studyMaterialCategoryLink);


    } else if (materialFor === 'Group') {
      studyMaterialCategoryLink = `${SERVER_URL}/studyMaterialCategory/${materialFor}/${groupNameId}`;

      await axios.get(studyMaterialCategoryLink);

    } else {
      const studyCategoriesIAdded = await axios.get(`${SERVER_URL}/studyMaterialCategory/categories-i-added/${materialFor}/${userId}`);
      setCategoryListOFUser(studyCategoriesIAdded.data);
      console.log('Added: ', studyCategoriesIAdded.data);
      console.log('UserId: ', userId);
      
      let sharedStudyMaterialResponse = [];
      
      const sharedCategories = await axios.get(`${SERVER_URL}/studyMaterialCategory/shared-categories`);
      sharedStudyMaterialResponse.push(...sharedCategories.data);
      
      const sharedCategoriesEveryone = await axios.get(`${SERVER_URL}/studyMaterialCategory/shared-categories-everyone`);
      sharedStudyMaterialResponse.push(...sharedCategoriesEveryone.data);
      
      console.log('API Response:', sharedStudyMaterialResponse);
      
      // Check if sharedStudyMaterialResponse is an array before using map
      if (Array.isArray(sharedStudyMaterialResponse)) {
        const uniqueCategories = [...new Set(sharedStudyMaterialResponse.map(item => item.category))];
        
        // Sort the unique categories alphabetically
        const sortedCategories = uniqueCategories.sort((a, b) => a.localeCompare(b));
        
        // Create an array of promises for each unique category
        const promiseArray = sortedCategories.map(async (category) => {
          // Find the first occurrence of the category in the original array
          const firstOccurrence = sharedStudyMaterialResponse.find(item => item.category === category);
        
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
        console.error("sharedStudyMaterialResponse is not an array");
      }
      
      
    }

    

  }

  useEffect(() => {


    fetchData();
    
  },[groupNameId, materialFor]);

  
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

  const saveGeneratedDataBtn = async (event) => {
    event.preventDefault();


    const studyMaterialsData = {
      title: studyMaterialTitle,
      body: pdfDetails,
      numInp: numInp === null ? 'No max value' : numInp,
      materialFor: materialFor,
      code: generateRandomString(),
      StudyGroupId: materialFor === 'Group' ? groupNameId : null,
      StudyMaterialsCategoryId: studyMaterialCategoryId,
      UserId: userId,
      tag: materialFor === 'Everyone' ? 'Shared' : 'Own Record'
    };
  
    if (
      studyMaterialsData.title !== "" &&
      studyMaterialsData.StudyMaterialsCategoryId !== "" &&
      studyMaterialsData.body !== "" &&
      studyMaterialsData.UserId !== ""
    ) {

      let hasEmptyFields = false;
  
      for (let i = 0; i < genQAData.length; i++) {


        const qaData = {
          question: genQAData[i].question,
          answer: genQAData[i].answer,
          quizType: 'MCQA',
        };

        if (
          qaData.question === "" ||
          qaData.answer === "" 
        ) {
          hasEmptyFields = true;
          alert("Cannot have empty fields.");
          break; 
        }


        for (let j = 0; j < genQAData[i].distractors.length; j++) {
          let qacData = {
            choice: genQAData[i].distractors[j],
          };

          console.log(qacData.choice);

          if (qacData.choice === "") {
            hasEmptyFields = true;
            alert("Cannot have empty fields.");
            break;
          } 
        }
      

        
      }
  




      for (let i = 0; i < genTrueSentences.length; i++) {

        const trueSentencesData = {
          question: genTrueSentences[i].sentence,
          answer: 'True',
          quizType: 'ToF'
        }


        if (
          trueSentencesData.question === '' ||
          trueSentencesData.answer === '' 
        ) {
          hasEmptyFields = true;
          alert("Cannot have empty fields.");
          break; 
        } 



        for (let j = 0; j < genTrueSentences[i].distractors.length; j++) {
          let qacData = {
            choice: genTrueSentences[i].distractors[j],
          };

          console.log(qacData.choice);

          if (qacData.choice === "") {
            hasEmptyFields = true;
            alert("Cannot have empty fields.");
            break;
          } 
        }
      
   

  
      }

      for (let i = 0; i < genFillInTheBlanks.sentences.length; i++) {
        const fillInTheBlank = {
          question: genFillInTheBlanks.sentences[i],
          answer: genFillInTheBlanks.answer[i],
        }

        if (
          fillInTheBlank.question === "" ||
          fillInTheBlank.answer === ""  
        ) {
          hasEmptyFields = true;
          alert("Cannot have empty fields.");
          break; 
        }
      }


      
      for (let i = 0; i < genQADataRev.length; i++) {
        const qaRev = {
          question: genQADataRev[i].question,
          answer: genQADataRev[i].answer,
        }

        if (
          qaRev.question === "" ||
          qaRev.answer === ""  
        ) {
          hasEmptyFields = true;
          alert("Cannot have empty fields.");
          break; 
        }
      }




      let backgroundColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
      let randomIndex = ''
      let randomColor = ''
      
      

  
      if (!hasEmptyFields) {
        setIsLoading(true); 

        try {
          const smResponse = await axios.post(
            `${SERVER_URL}/studyMaterial`,
            studyMaterialsData
          );
  
          for (let i = 0; i < genQAData.length; i++) {

            randomIndex = Math.floor(Math.random() * backgroundColors.length);
            randomColor = backgroundColors[randomIndex];

            const qaData = {
              question: genQAData[i].question,
              answer: genQAData[i].answer,
              bgColor: randomColor,
              quizType: genQAData[i].distractors.length > 0 ? 'MCQA' : 'Identification',
              StudyMaterialId: smResponse.data.id,
            };
  

            const qaResponse = await axios.post(
              `${SERVER_URL}/quesAns`,
              qaData
            );
  
            for (let j = 0; j < genQAData[i].distractors.length; j++) {
              let qacData = {
                choice: genQAData[i].distractors[j],
                QuesAnId: qaResponse.data.id,
                StudyMaterialId: smResponse.data.id,
              };
  
              if (qacData.choice !== "") {
                await axios.post(
                  `${SERVER_URL}/quesAnsChoices`,
                  qacData
                );
                console.log("Saved!");
              }
            }
   
          }


          for (let i = 0; i < genQADataRev.length; i++) {

            const qaDataRev = {
              question: genQADataRev[i].question,
              answer: genQADataRev[i].answer,
              StudyMaterialId: smResponse.data.id,
            };
  
            await axios.post(`${SERVER_URL}/quesRev`, qaDataRev);
            console.log('Saved rev!');
          }




          for (let i = 0; i < genTrueSentences.length; i++) {

            randomIndex = Math.floor(Math.random() * backgroundColors.length);
            randomColor = backgroundColors[randomIndex];

            const trueSentencesData = {
              question: genTrueSentences[i].sentence,
              answer: 'True',
              quizType: 'ToF',
              bgColor: randomColor,
              StudyMaterialId: smResponse.data.id,
            };
          
            try {
              // Create the question and get the response
              const qaResponse = await axios.post(`${SERVER_URL}/quesAns`, trueSentencesData);
          
              // Iterate through distractors and create question choices
              for (let j = 0; j < genTrueSentences[i].distractors.length; j++) {
                let qacData = {
                  choice: genTrueSentences[i].distractors[j],
                  QuesAnId: qaResponse.data.id, // Link the question choice to the question ID
                  StudyMaterialId: smResponse.data.id,
                };
          
                if (qacData.choice !== "") {
                  await axios.post(`${SERVER_URL}/quesAnsChoices`, qacData);
                  console.log("Saved!");
                }
              }
            } catch (error) {
              console.error(error);
            }
          }
          

          for (let i = 0; i < genFillInTheBlanks.sentences.length; i++) {

            randomIndex = Math.floor(Math.random() * backgroundColors.length);
            randomColor = backgroundColors[randomIndex];

            const fillInTheBlank = {
              question: genFillInTheBlanks.sentences[i],
              answer: genFillInTheBlanks.answer[i],
              quizType: 'FITB',
              bgColor: randomColor,
              StudyMaterialId: smResponse.data.id,
            }

            try {
              await axios.post(
                `${SERVER_URL}/quesAns`,
                fillInTheBlank
                );
            } catch (error) {
              console.error();
            }
          }



          setIsLoading(false);
          setStudyMaterialTitle('');
          setStudyMaterialCategoryId('');
          setGeneratedQA({});
          setPDFDetails('');
          setNumInp('');
  
          // Back to Personal Study Area
          if (materialFor === 'Personal') {
            navigate(`/main/personal/study-area`);
          } else if (materialFor === 'Group') {
            navigate(`/main/group/study-area/${groupNameId}`);
          }
        } catch (error) {
          console.error('Error saving study material:', error);
        }
      }
    } else {
      alert('Title/Category/PDF Details/Number of items input value missing.');
    }
  };


  const addCategory = async () => {
    try {
      // Ask for confirmation
  
      let getSameCategoryValue = await axios.get(`${SERVER_URL}/studyMaterialCategory/study-material-category/${currentCategoryToAdd}/0`);
      

      
      if (getSameCategoryValue.data.length === 0) {
        console.log(getSameCategoryValue.data);

        let data = {
          category: currentCategoryToAdd,
          categoryFor: materialFor,
          isShared: false,
          UserId: userId
        }



        await axios.post(`${SERVER_URL}/studyMaterialCategory/`, data);

        setTimeout(() => {
          setError(false);
          setMsg(`Successfully added!`);
        }, 100);
  
        setTimeout(() => {
          setError(false);
          setMsg('');
          setCurrentCategoryToAdd('')
          fetchData()
        }, 2500);
      } else {
        setTimeout(() => {
          setError(true);
          setMsg(`${currentCategoryToAdd} already exists`);
        }, 100);
  
        setTimeout(() => {
          setError(false);
          setMsg('');
        }, 2500);
      }
      
  
      

    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };


  const deleteCategory = async (categoryId, category) => {
    const confirmed = window.confirm(`Deleting ${category} will affect the study materials associated with it. Are you certain you want to proceed with deleting this category?`);

    if (confirmed) {

      await axios.delete(`${SERVER_URL}/studyMaterialCategory/delete-category/${categoryId}/${category}`).then((response) => {

        if (response.error) {
          setTimeout(() => {
            setError(true);
            setMsg(`Something wrong occured.`);
          }, 100);
    
          setTimeout(() => {
            setError(false);
            setMsg('');
          }, 2500);
        } else {
          setTimeout(() => {
            setError(false);
            setMsg(`${category} is successfully deleted.`);
          }, 100);
    
          setTimeout(() => {
            setMsg('');
            fetchData()
          }, 2500);

        }

      });
      
    }
  }

  


  return (

    <div className='w-full flex items-center justify-center'>
      <form className={`flex ${extraSmallDevice ? 'flex-col w-full' : 'flex-row gap-3'}`}>
        <input required type="text" onChange={(event) => {setStudyMaterialTitle(event.target.value)}} placeholder='Title...' className={`border-medium-800 rounded-[5px] py-2 px-5 ${extraSmallDevice ? 'w-full my-2 text-sm' : 'text-md'}`} />    

        <select
          required
          className={`border-medium-800 rounded-[5px] py-2 px-2 outline-none ${extraSmallDevice ? 'text-sm w-full my-2' : 'text-md'}`}
          onChange={(event) => setStudyMaterialCategoryId(event.target.value)}
        >
          {studyMaterialCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category}
            </option>
          ))}
        </select>
        

        {materialFor === 'Everyone' && (
          <button className={`border-medium-800 rounded-[5px] py-2 px-2 outline-none ${extraSmallDevice ? 'text-sm w-full my-2' : 'text-md'}`}
          onClick={(e) => {
            e.preventDefault();
            setModalAddCategory(true);
          }}>
            Add Category
          </button>
        )}

        <button
          onClick={saveGeneratedDataBtn}
          className={`mbg-800 mcolor-100 py-2 ${extraSmallDevice ? 'text-sm px-5 w-full my-2 text-md' : smallDevice ? 'text-md px-5' : 'text-lg px-10'} font-medium rounded-[5px] ${isLoading ? 'wrong-bg' : ''}`}
          disabled={isLoading} 
        >
          {isLoading ? 'Saving...' : 'Save Data'}
        </button>
      </form>
      
      {modalAddCategory && (
        <div style={{ zIndex: 1000 }} className={`absolute flex items-center justify-center modal-bg w-full h-full`}>
          <div className='flex justify-center w-full'>
            <div className={`mbg-100 max-h-[80vh] ${(extraLargeDevices || largeDevices) ? 'w-1/3' : mediumDevices ? 'w-1/2' : smallDevice ? 'w-2/3' : 'w-full mx-2'} z-10 relative p-10 rounded-[5px]`} style={{ overflowY: 'auto' }}>

            <button className='absolute right-4 top-3 text-xl' onClick={() => {
              setModalAddCategory(false)
              }}>
              ✖
            </button>

            <p className='text-center text-2xl mcolor-800 font-medium'>Add Category</p>
            
            <br />


            <div className='w-full'>
              <input className='border-thin-800 rounded py-2 text-center w-full' type="text" placeholder='Type category...' onChange={(e) => setCurrentCategoryToAdd(e.target.value)} value={currentCategoryToAdd} />
              <br />
              <button onClick={addCategory} className='mt-3 w-full mbg-800 mcolor-100 py-2 rounded'>Add</button>

              <br /><br />
              <p className={`${error ? 'bg-red mcolor-100 opacity-50' : 'green-bg mcolor-800'} rounded mt-2 text-center ${msg !== '' && 'py-1'}`}>{msg}</p>


              {categoryListOFUser.length > 0 && (
              <div>
                <br />
                <h3 className='text-center font-medium mcolor-800-opacity text-sm'>Categories you added in the library that are not yet bookmarked by others:</h3>
                <br />
                <ul>
                  {categoryListOFUser.map((category, index) => (
                    <li key={index} className='mb-2'>
                      <div className='flex items-center justify-between'>
                        <div>{category.category}</div>
                        <button className='text-red' onClick={() => deleteCategory(category.id, category.category)}><DeleteIcon /></button>
                      </div>
                      <div className='border-bottom-thin-gray'></div>
                    </li>
                  ))}
                </ul>
              </div>
              )}




            </div>


            </div>
          </div>
        </div>
      )}

    </div>
  )
}


