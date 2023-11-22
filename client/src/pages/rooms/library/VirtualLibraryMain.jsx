import React, { useEffect, useState } from 'react'
import { Navbar } from '../../../components/navbar/logged_navbar/navbar'
import axios from 'axios'

export const VirtualLibraryMain = () => {

  const [personalStudyMaterials, setPersonalStudyMaterials] = useState([]);
  const [personalStudyMaterialsCategory, setPersonalStudyMaterialsCategory] = useState([]);
  const [groupStudyMaterials, setGroupStudyMaterials] = useState([]);
  const [groupStudyMaterialsCategory, setGroupStudyMaterialsCategory] = useState([]);

  const [sharedMaterials, setSharedMaterials] = useState([]);
  const [sharedMaterialsCategory, setSharedMaterialsCategory] = useState([]);

  const [currentMaterialTitle, setCurrentMaterialTitle] = useState('');
  const [currentMaterialCategory, setCurrentMaterialCategory] = useState('');
  const [materialMCQ, setMaterialMCQ] = useState([]);
  const [materialMCQChoices, setMaterialMCQChoices] = useState([]);
  const [materialNotes, setMaterialNotes] = useState([])



  // modals
  const [showModal, setShowModal] = useState(false);
  const [showPresentStudyMaterials, setShowPresentStudyMaterials] = useState(false)
  const [showMaterialDetails, setShowMaterialDetails] = useState(false)
  const [enableBackButton, setEnableBackButton] = useState(false)

  // tabs
  const [showContext, setShowContext] = useState(false);
  const [context, setContext] = useState('')
  const [showNotes, setShowNotes] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const UserId = 1;

  const fetchData = async () => {
 
    // for fetching personal
    const personalStudyMaterial = await axios.get(`http://localhost:3001/studyMaterial/study-material-category/Personal/${UserId}`)
    const filteredPersonalStudyMaterials = personalStudyMaterial.data.filter(item => item.tag !== 'Shared');
    setPersonalStudyMaterials(filteredPersonalStudyMaterials);


    const fetchedPersonalStudyMaterial = personalStudyMaterial.data;

    const fetchedPersonalStudyMaterialCategory = await Promise.all(
      fetchedPersonalStudyMaterial.map(async (material, index) => {
        const materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-lastmaterial/${material.StudyMaterialsCategoryId}/Personal/${UserId}`);
        return materialCategoryResponse.data; // Return the data from each promise
      })
    );
      
    setPersonalStudyMaterialsCategory(fetchedPersonalStudyMaterialCategory);
    
    
    const groupStudyMaterial = await axios.get(`http://localhost:3001/studyMaterial/study-material-category/Group/${UserId}`)
    const filteredGroupStudyMaterials = groupStudyMaterial.data.filter(item => item.tag !== 'Shared');
    setGroupStudyMaterials(filteredGroupStudyMaterials);
    
    
    

    
    const fetchedGroupStudyMaterial = groupStudyMaterial.data;

    const fetchedGroupStudyMaterialCategory = await Promise.all(
      fetchedGroupStudyMaterial.map(async (material, index) => {
        const materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-lastmaterial/${material.StudyMaterialsCategoryId}/Group/${UserId}`);
        return materialCategoryResponse.data; // Return the data from each promise
      })
    );
      
    setGroupStudyMaterialsCategory(fetchedGroupStudyMaterialCategory);
      
      
      
      
    const sharedStudyMaterial = await axios.get(`http://localhost:3001/studyMaterial/shared-materials`);
    const sharedStudyMaterialResponse = sharedStudyMaterial.data;  
    setSharedMaterials(sharedStudyMaterialResponse)

    const fetchedSharedStudyMaterialCategory = await Promise.all(
      sharedStudyMaterialResponse.map(async (material, index) => {
        const materialCategorySharedResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/shared-material-category/${material.StudyMaterialsCategoryId}/Group/${UserId}`);
        return materialCategorySharedResponse.data;
      })
    );
          
    setSharedMaterialsCategory(fetchedSharedStudyMaterialCategory);
    
      
      
      
      




    
  }


  useEffect(() => {
 

    fetchData()
  }, [setPersonalStudyMaterials, setGroupStudyMaterials])


  
  const viewStudyMaterialDetails = async (index, materialFor) => {

    setShowPresentStudyMaterials(false)


    if (materialFor === 'personal') {
      setCurrentMaterialTitle(personalStudyMaterials[index].title)
      setCurrentMaterialCategory(personalStudyMaterialsCategory[index].category)
    } else if (materialFor === 'group') {
      setCurrentMaterialTitle(groupStudyMaterials[index].title)
      setCurrentMaterialCategory(groupStudyMaterialsCategory[index].category)
    } else {
      setCurrentMaterialTitle(sharedMaterials[index].title)
      setCurrentMaterialCategory(sharedMaterialsCategory[index].category)
    }


    try {
      let mcqResponse = []
      if (materialFor === 'personal') {

      mcqResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${personalStudyMaterials[index].id}`);

      setContext(personalStudyMaterials[index].body)
    } else if (materialFor === 'group') {
      mcqResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${groupStudyMaterials[index].id}`);
      setContext(groupStudyMaterials[index].body)
    } else {
      mcqResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${sharedMaterials[index].id}`);
      setContext(sharedMaterials[index].body)
    }
    
    setMaterialMCQ(mcqResponse.data);
    
    if (Array.isArray(mcqResponse.data)) {
      const materialChoices = mcqResponse.data.map(async (materialChoice) => {
        try {
          let choiceResponse = []

          if (materialFor === 'personal') {
            choiceResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${personalStudyMaterials[index].id}/${materialChoice.id}`);
          } else if (materialFor === 'group') {
            choiceResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${groupStudyMaterials[index].id}/${materialChoice.id}`);
          } else {
            choiceResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${sharedMaterials[index].id}/${materialChoice.id}`);
          }
            return choiceResponse.data;
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        });
        
        const responses = await Promise.all(materialChoices);
        const allChoices = responses.flat();
        setMaterialMCQChoices(allChoices);
      }
    } catch (error) {
      console.error('Error fetching study material by ID:', error);
    }

    try {

      let revResponse = []

      if (materialFor === 'personal') {
        revResponse = await axios.get(`http://localhost:3001/quesRev/study-material-rev/${personalStudyMaterials[index].id}`);
      } else if (materialFor === 'group') {
        revResponse = await axios.get(`http://localhost:3001/quesRev/study-material-rev/${groupStudyMaterials[index].id}`);
      } else {
        revResponse = await axios.get(`http://localhost:3001/quesRev/study-material-rev/${sharedMaterials[index].id}`);
      }



      
      setMaterialNotes(revResponse.data);
    } catch (error) {
      console.error('Error fetching study material by ID:', error);
    }
    
    if (materialFor !== 'shared') {
      setShowQuiz(false)
      setShowNotes(false) 
      setShowContext(true)
      setEnableBackButton(true)
    } else {
      setShowModal(true)
      setShowContext(true)
      setEnableBackButton(false)
    }
    setShowMaterialDetails(true)
  }

  const shareMaterial = async (index, materialFor) => {
    let studyMaterialResponse = '';
  
    let data = {
      tag: 'Shared'
    }
  
    let materialArray = materialFor === 'personal' ? personalStudyMaterials : groupStudyMaterials;
  
    if (materialArray && materialArray[index]) {
      if (materialFor === 'personal') {
        studyMaterialResponse = await axios.put(`http://localhost:3001/studyMaterial/update-tag/${personalStudyMaterials[index].id}`, data)
      } else {
        studyMaterialResponse = await axios.put(`http://localhost:3001/studyMaterial/update-tag/${groupStudyMaterials[index].id}`, data)
      }
  
    } else {
      console.error(`Material at index ${index} is undefined.`);
    }

    fetchData()

  }
  



  return (
    <div>
      <div className='poppins mcolor-900 container py-10'>
        <Navbar linkBack={'/main/'} linkBackName={'Main'} currentPageName={'Virtual Library Room'} username={'Jennie Kim'}/>

        <div className='my-10'>
          <div className='flex items-center justify-center'>
            <button className='mbg-300 px-5 py-2 rounded border-thin-800' onClick={() => {
              setShowModal(true);
              setShowPresentStudyMaterials(true);

              }}>Share a Study Material</button>
          </div>
          

          <div className='flex items-center justify-between mt-8'>

            <div className='w-1/2'>

            </div>
            <div className='w-3/4'>
              
              {sharedMaterials.map((material, index) => {
                const category = sharedMaterialsCategory[index]?.category || 'Category not available';

                return <div key={index} className='my-3 mbg-200 border-thin-800 p-4 rounded flex items-center justify-between'>
                    <div>
                      <p className='font-medium text-lg'>Title: {material.title}</p>
                      <p className='text-sm mt-1'>Category: {category}</p>
                    </div>

                    <div className='flex items-center gap-3'>
                      <button className='mbg-100 mcolor-900 border-thin-800 px-5 py-2 rounded' onClick={() => viewStudyMaterialDetails(index, 'shared')}>View</button>
                      <button className='mbg-700 mcolor-100 px-5 py-2 rounded' onClick={() => shareMaterial(index, 'personal')}>Bookmark</button>
                    </div>
                  </div>
              })}
            </div>

          </div>
          

          {showModal && (
            <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
              <div className='flex items-center justify-center h-full'>
                <div className='relative mbg-100 h-[75vh] w-1/2 z-10 relative py-5 px-10 rounded-[5px]' style={{overflowY: 'auto'}}>
                  
                  <button className='absolute right-5 top-5 font-medium text-xl' onClick={() => {
                    setShowMaterialDetails(false)
                    setShowPresentStudyMaterials(false)
                    setShowModal(false)
                  }}>&#10006;</button>

                  {showPresentStudyMaterials && (
                    <div>
                      <p class='text-lg text-color-900 font-medium mb-5 mt-10 mcolor-900 text-center'>Materials that are present in your personal room and those you contributed within collaborative workspaces:</p>

                      <br />
                      <div className='flex items-center justify-center mb-2'>
                        <button className='mbg-700 mcolor-100 px-5 py-2 rounded border-thin-800'>Generate a new Study Material</button>
                      </div>
                      <br />


                      <p>Personal: </p>
                      {personalStudyMaterials.map((material, index) => {
                        const category = personalStudyMaterialsCategory[index]?.category || 'Category not available';

                        return <div key={index} className='my-3 mbg-200 border-thin-800 p-4 rounded flex items-center justify-between'>
                            <div>
                              <p className='font-medium text-lg'>Title: {material.title}</p>
                              <p className='text-sm mt-1'>Category: {category}</p>
                            </div>

                            <div className='flex items-center gap-3'>
                              <button className='mbg-100 mcolor-900 border-thin-800 px-5 py-2 rounded' onClick={() => viewStudyMaterialDetails(index, 'personal')} >View</button>
                              <button className='mbg-700 mcolor-100 px-5 py-2 rounded' onClick={() => shareMaterial(index, 'personal')}>Share</button>
                            </div>
                          </div>
                      })}

                      <br />


                      <p>Group: </p>
                      {groupStudyMaterials.map((material, index) => {
                        const category = groupStudyMaterialsCategory[index]?.category || 'Category not available';

                        return <div key={index} className='my-3 mbg-200 border-thin-800 p-4 rounded flex items-center justify-between'>
                            <div>
                              <p className='font-medium text-lg'>Title: {material.title}</p>
                              <p className='text-sm mt-1'>Category: {category}</p>
                            </div>

                            <div className='flex items-center gap-3'>
                              <button className='mbg-100 mcolor-900 border-thin-800 px-5 py-2 rounded' onClick={() => viewStudyMaterialDetails(index, 'group')}>View</button>
                              <button className='mbg-700 mcolor-100 px-5 py-2 rounded' onClick={() => shareMaterial(index, 'Group')}>Share</button>
                            </div>
                          </div>
                      })}
                    </div>
                  )}



                  {showMaterialDetails && (
                    <div>

                      {enableBackButton && (
                        <button className='mbg-200 mcolor-900 rounded px-4 py-1 rounded border-thin-800' onClick={() => {
                          setShowMaterialDetails(false)
                          setShowPresentStudyMaterials(true)
                        }}>Back</button>
                      )}



                      <div className='my-6'>
                        <p className='mcolor-900 text-center text-xl font-medium'>{currentMaterialTitle} from {currentMaterialCategory}</p>
                        
                        <div className='flex items-center justify-between my-5 gap-1'>
                          <button className='border-thin-800 w-full rounded py-2' onClick={() => {
                            setShowQuiz(false)
                            setShowNotes(false)
                            setShowContext(true)
                          }}>Context</button>
                          <button className='border-thin-800 w-full rounded py-2 mbg-700 mcolor-100' onClick={() => {
                            setShowContext(false)
                            setShowQuiz(false)
                            setShowNotes(true)
                          }}>Notes</button>
                          <button className='border-thin-800 w-full rounded py-2 mbg-700 mcolor-100' onClick={() => {
                          setShowContext(false)
                          setShowNotes(false)
                          setShowQuiz(true)
                          }}>Quiz</button>
                        </div>


                        {showContext && (
                          <p className='text-justify my-5'>{context}</p>
                        )}

                        {showNotes && (
                          <div>
                            {materialNotes.map((material) => (
                              <div className='my-10'>
                                <p className='font-medium mcolor-700'>Question: <span className='mcolor-900 font-medium'>{material.question}</span></p>
                                <p className='font-medium mcolor-700 mt-1'>Answer: <span className='mcolor-900 font-medium'>{material.answer}</span></p>
                              </div>
                            ))}
                            <div className='mb-[-1.5rem]'></div>
                          </div>
                        )}

                        {showQuiz && (
                          <div className='mt-5'>
                            <br />
                            {materialMCQ.map((material, quesIndex) => (
                              <div className={(material.quizType === 'MCQA' || material.quizType === 'Identification') ? 'mb-14' : material.quizType !== 'ToF' ? 'mt-10' : 'mb-5'} key={material.id}>
                                <p className='mt-2 mcolor-900'>{quesIndex + 1}. {material.question} - <span className='mcolor-800 font-bold'>{material.answer}</span></p>

                                {material.quizType === 'MCQA' && (
                                  <p className='mt-2 mb-1'>Choices: </p>
                                )}

                                <ul className='grid-result gap-3' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                  {materialMCQChoices
                                    .filter((choice) => (choice.QuesAnId === material.id && material.quizType === 'MCQA'))
                                    .map((choice, index) => (
                                      <li key={index} className='mbg-300 text-center py-1 rounded'>{choice.choice}</li>
                                    ))}
                                </ul>

                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  )}
                
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
