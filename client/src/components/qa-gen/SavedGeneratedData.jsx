import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SavedGeneratedData = (props) => {

  const [studyMaterialTitle, setStudyMaterialTitle] = useState("");
  const [studyMaterialCategories, setStudyMaterialCategories] = useState([]);
  const [studyMaterialCategoryId, setStudyMaterialCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  
  const { generatedQA, setGeneratedQA, pdfDetails, setPDFDetails, numInp, setNumInp, materialFor, groupNameId } = props;

  const genQAData = generatedQA.question_answer_pairs;
  const genQADataRev = generatedQA.reviewer_ques_pairs;
  const genTrueSentences = generatedQA.true_or_false_sentences;
  const genFillInTheBlanks = generatedQA.fill_in_the_blanks;
  const userId = 1;

  const navigate = useNavigate();




  useEffect(() => {
    let studyMaterialCatPersonalLink = '';

    if (materialFor === 'Personal') {
      studyMaterialCatPersonalLink = `http://localhost:3001/studyMaterialCategory/${materialFor}/${userId}`;
    } else {
      studyMaterialCatPersonalLink = `http://localhost:3001/studyMaterialCategory/${materialFor}/${groupNameId}/${userId}`;
    }
    


    axios.get(studyMaterialCatPersonalLink).then((response) => {
        setStudyMaterialCategories(response.data);
        
        // Set studyMaterialCategoryId to the first category's ID
        if (response.data.length > 0) {
          setStudyMaterialCategoryId(response.data[0].id);
        }
      })
      
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
      numInp: numInp,
      materialFor: materialFor,
      code: materialFor === 'Group' ? generateRandomString() : "None",
      StudyGroupId: materialFor === 'Group' ? groupNameId : null,
      StudyMaterialsCategoryId: studyMaterialCategoryId,
      UserId: userId
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

        const trueSentencesData = {
          question: genTrueSentences[i].sentence,
          answer: 'True',
          quizType: 'ToF'

          
        }

      
        const qaDataRev = {
          question: genQADataRev[i].question,
          answer: genQADataRev[i].answer,
        };

  
        if (
          qaData.question === "" ||
          qaData.answer === "" ||
          qaDataRev.question === "" ||
          qaDataRev.answer === "" ||
          trueSentencesData.question === '' ||
          trueSentencesData.answer === '' 
        ) {
          hasEmptyFields = true;
          alert("Cannot have empty fields.");
          break; 
        }

        
      }


      for (let i = 0; i < genTrueSentences.length; i++) {

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




      
      

  
      if (!hasEmptyFields) {
        setIsLoading(true); 

        try {
          const smResponse = await axios.post(
            'http://localhost:3001/studyMaterial',
            studyMaterialsData
          );
  
          for (let i = 0; i < genQAData.length; i++) {
            const qaData = {
              question: genQAData[i].question,
              answer: genQAData[i].answer,
              quizType: genQAData[i].distractors.length > 0 ? 'MCQA' : 'Identification',
              StudyMaterialId: smResponse.data.id,
              UserId: smResponse.data.UserId,
            };
  
            const qaDataRev = {
              question: genQADataRev[i].question,
              answer: genQADataRev[i].answer,
              StudyMaterialId: smResponse.data.id,
              UserId: smResponse.data.UserId,
            };
  
            const qaResponse = await axios.post(
              'http://localhost:3001/quesAns',
              qaData
            );
  
            for (let j = 0; j < genQAData[i].distractors.length; j++) {
              let qacData = {
                choice: genQAData[i].distractors[j],
                QuesAnId: qaResponse.data.id,
                StudyMaterialId: smResponse.data.id,
                UserId: smResponse.data.UserId,
              };
  
              if (qacData.choice !== "") {
                await axios.post(
                  'http://localhost:3001/quesAnsChoices',
                  qacData
                );
                console.log("Saved!");
              }
            }
  
            await axios.post('http://localhost:3001/quesRev', qaDataRev);
            console.log('Saved rev!');
          }

          for (let i = 0; i < genTrueSentences.length; i++) {
            const trueSentencesData = {
              question: genTrueSentences[i].sentence,
              answer: 'True',
              quizType: 'ToF',
              StudyMaterialId: smResponse.data.id,
              UserId: smResponse.data.UserId,
            };
          
            try {
              // Create the question and get the response
              const qaResponse = await axios.post('http://localhost:3001/quesAns', trueSentencesData);
          
              // Iterate through distractors and create question choices
              for (let j = 0; j < genTrueSentences[i].distractors.length; j++) {
                let qacData = {
                  choice: genTrueSentences[i].distractors[j],
                  QuesAnId: qaResponse.data.id, // Link the question choice to the question ID
                  StudyMaterialId: smResponse.data.id,
                  UserId: smResponse.data.UserId,
                };
          
                if (qacData.choice !== "") {
                  await axios.post('http://localhost:3001/quesAnsChoices', qacData);
                  console.log("Saved!");
                }
              }
            } catch (error) {
              console.error(error);
            }
          }
          

          for (let i = 0; i < genFillInTheBlanks.sentences.length; i++) {
            const fillInTheBlank = {
              question: genFillInTheBlanks.sentences[i],
              answer: genFillInTheBlanks.answer[i],
              quizType: 'FITB',
              StudyMaterialId: smResponse.data.id,
              UserId: smResponse.data.UserId,
            }

            try {
              await axios.post(
                'http://localhost:3001/quesAns',
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
            navigate(`/main/personal/study-area?reload`);
          } else if (materialFor === 'Group') {
            navigate(`/main/group/study-area/${groupNameId}?reload`);
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


