import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { SERVER_URL } from '../../urlConfig';


export const SavedGeneratedData = (props) => {

  const [studyMaterialTitle, setStudyMaterialTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const { user } = useUser();

  const userId = user?.id;

  

  const { generatedQA, setGeneratedQA, pdfDetails, setPDFDetails, numInp, setNumInp, materialFor, groupNameId, studyMaterialCategories, setStudyMaterialCategories, studyMaterialCategoryId, setStudyMaterialCategoryId } = props;

  const genQAData = generatedQA.question_answer_pairs;
  const genQADataRev = generatedQA.reviewer_ques_pairs;
  const genTrueSentences = generatedQA.true_or_false_sentences;
  const genFillInTheBlanks = generatedQA.fill_in_the_blanks;

  const navigate = useNavigate();


  useEffect(() => {

    const fetchData = async () => {
      if (materialFor !== 'Everyone') {
        
        let studyMaterialCatPersonalLink = '';
    
        if (materialFor === 'Personal') {
          studyMaterialCatPersonalLink = `${SERVER_URL}/studyMaterialCategory/personal-study-material/${materialFor}/${userId}`;
        } else if (materialFor === 'Group') {
          studyMaterialCatPersonalLink = `${SERVER_URL}/studyMaterialCategory/${materialFor}/${groupNameId}`;
        } 
      
  
  
        await axios.get(studyMaterialCatPersonalLink).then((response) => {
  
          setStudyMaterialCategories(response.data);
          // Set studyMaterialCategoryId to the first category's ID
          if (response.data.length > 0) {
            setStudyMaterialCategoryId(response.data[0].id);
          }
          
        })
      } 
    }

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
  


  return (
    <form>
      <input required type="text" onChange={(event) => {setStudyMaterialTitle(event.target.value)}} placeholder='Title...' className='border-hard-800 rounded-[5px] py-2 px-5' />



      

      <select
        required
        className='border-hard-800 rounded-[5px] py-2 px-2 mx-3 outline-none'
        onChange={(event) => setStudyMaterialCategoryId(event.target.value)}
      >
        {studyMaterialCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.category}
          </option>
        ))}
      </select>



      <button
        onClick={saveGeneratedDataBtn}
        className={`mbg-800 mcolor-100 px-10 py-2 text-xl font-bold rounded-[5px] ${isLoading ? 'wrong-bg' : ''}`}
        disabled={isLoading} 
      >
        {isLoading ? 'Saving...' : 'Save Data'}
      </button>
    </form>
  )
}


