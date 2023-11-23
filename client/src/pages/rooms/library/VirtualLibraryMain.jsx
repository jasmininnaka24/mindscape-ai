import React, { useEffect, useState } from 'react'
import { Navbar } from '../../../components/navbar/logged_navbar/navbar'
import axios from 'axios'

export const VirtualLibraryMain = () => {

  const [groupList, setGroupList] = useState([]);

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

  const [currentSharedMaterialIndex, setCurrentSharedMaterialIndex] = useState(0);


  // modals
  const [showModal, setShowModal] = useState(false);
  const [showPresentStudyMaterials, setShowPresentStudyMaterials] = useState(false)
  const [showMaterialDetails, setShowMaterialDetails] = useState(false)
  const [enableBackButton, setEnableBackButton] = useState(false)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [chooseRoom, setChooseRoom] = useState(false);
  const [chooseGroupRoom, setChooseGroupRoom] = useState(false);


  // tabs
  const [showContext, setShowContext] = useState(false);
  const [context, setContext] = useState('')
  const [showNotes, setShowNotes] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const UserId = 1;

  const fetchData = async () => {
 
    // for fetching personal
    const personalStudyMaterial = await axios.get(`http://localhost:3001/studyMaterial/study-material-category/Personal/${UserId}`)
    const filteredPersonalStudyMaterials = personalStudyMaterial.data.filter(item => item.tag === 'Own Record');
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
    const filteredGroupStudyMaterials = groupStudyMaterial.data.filter(item => item.tag === 'Own Record');
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
    
      
      
      
      
    await axios.get(`http://localhost:3001/studyGroup/extract-group-through-user/${UserId}`).then((response) => {
      setGroupList(response.data);
    })



    
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





  const bookmarkMaterial = async (index, id) => {
   
   const title = sharedMaterials[index].title;
   const body = sharedMaterials[index].body;
   const numInp = sharedMaterials[index].numInp;
   const materialId = sharedMaterials[index].StudyMaterialsCategoryId;
   const userId = sharedMaterials[index].UserId;
   ;
   

   let genQAData = []
   
   let genMCQAData = []
   let genToF = []
   let genIdentification = []
   let genFITB = []

   let mcqaDistractors = []
   let tofDistractors = []
   let genQADataRev = []




    const studyMaterialsData = {
      title: title,
      body: body,
      numInp: numInp,
      materialFor: 'Group',
      code: generateRandomString(),
      StudyGroupId: id,
      StudyMaterialsCategoryId: materialId,
      UserId: userId,
      bookmarkedBy: UserId,
      tag: 'Bookmarked'
    };


    
    try {
      let mcqResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${sharedMaterials[index].id}`);

      genQAData = mcqResponse.data

      genMCQAData = genQAData.filter(data => data.quizType === 'MCQA')
      genToF = genQAData.filter(data => data.quizType === 'ToF')
      genIdentification = genQAData.filter(data => data.quizType === 'Identification')
      genFITB = genQAData.filter(data => data.quizType === 'FITB')



    // MCQA Distractors
    if (Array.isArray(genMCQAData)) {
      const materialChoices = genMCQAData.map(async (materialChoice) => {
        try {
          let choiceResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${sharedMaterials[index].id}/${materialChoice.id}`);

            return choiceResponse.data;
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        });
        
        const responses = await Promise.all(materialChoices);
        const allChoices = responses.flat();
        mcqaDistractors = responses;
      }
    

      // True or False distractors

    if (Array.isArray(genToF)) {
      const materialChoices = genToF.map(async (materialChoice) => {
        try {
          let choiceResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${sharedMaterials[index].id}/${materialChoice.id}`);

            return choiceResponse.data;
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        });
        
        const responses = await Promise.all(materialChoices);
        const allChoices = responses.flat();
        tofDistractors = responses;
      }


    } catch (error) {
      console.error('Error fetching study material by ID:', error);
    }

    try {

      let revResponse = await axios.get(`http://localhost:3001/quesRev/study-material-rev/${sharedMaterials[index].id}`);

      genQADataRev = revResponse.data;
      
    } catch (error) {
      console.error('Error fetching study material by ID:', error);
    }






    try {
      const smResponse = await axios.post(
        'http://localhost:3001/studyMaterial',
        studyMaterialsData
      );


      // genMCQAData = genQAData.filter(data => data.quizType === 'MCQA')
      // genToF = genQAData.filter(data => data.quizType === 'ToF')
      // genIdentification = genQAData.filter(data => data.quizType === 'Identification')
      // genFITB = genQAData.filter(data => data.quizType === 'FITB')

      for (let i = 0; i < genMCQAData.length; i++) {      

        const qaData = {
          question: genMCQAData[i].question,
          answer: genMCQAData[i].answer,
          bgColor: genMCQAData[i].bgColor,
          quizType: 'MCQA',
          StudyMaterialId: smResponse.data.id,
          UserId: smResponse.data.UserId,
        };

        const qaResponse = await axios.post(
          'http://localhost:3001/quesAns',
          qaData
        );

        for (let j = 0; j < mcqaDistractors[i].length; j++) {
          let qacData = {
              choice: tofDistractors[i][j].choice, // Extract the string value from the object
              QuesAnId: qaResponse.data.id,
              StudyMaterialId: smResponse.data.id,
              UserId: smResponse.data.UserId,
          };
  
          try {
              await axios.post('http://localhost:3001/quesAnsChoices', qacData);
              console.log("Saved! mcq");
          } catch (error) {
              console.error(error);
          }
        }

      }


      for (let i = 0; i < genQADataRev.length; i++) {      

        const qaDataRev = {
          question:genQADataRev[i].question,
          answer: genQADataRev[i].answer,
          StudyMaterialId: smResponse.data.id,
          UserId: smResponse.data.UserId,
        };

        await axios.post('http://localhost:3001/quesRev', qaDataRev);

      }


      for (let i = 0; i < genToF.length; i++) {

        const trueSentencesData = {
          question: genToF[i].question,
          answer: 'True',
          quizType: 'ToF',
          bgColor: genToF[i].bgColor,
          StudyMaterialId: smResponse.data.id,
          UserId: smResponse.data.UserId,
        };
      
        try {
          // Create the question and get the response
          const qaResponse = await axios.post('http://localhost:3001/quesAns', trueSentencesData);
      
          // Iterate through mcqaDistractors and create question choices
          for (let j = 0; j < tofDistractors[i].length; j++) {
            let qacData = {
                choice: tofDistractors[i][j].choice, // Extract the string value from the object
                QuesAnId: qaResponse.data.id,
                StudyMaterialId: smResponse.data.id,
                UserId: smResponse.data.UserId,
            };
    
            try {
                await axios.post('http://localhost:3001/quesAnsChoices', qacData);
                console.log("Saved! choice");
            } catch (error) {
                console.error(error);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      

      for (let i = 0; i < genFITB.length; i++) {

        const fillInTheBlankData = {
          question: genFITB[i].question,
          answer: genFITB[i].answer,
          quizType: 'FITB',
          bgColor: genFITB[i].bgColor,
          StudyMaterialId: smResponse.data.id,
          UserId: smResponse.data.UserId,
        }

        try {
          await axios.post(
            'http://localhost:3001/quesAns',
            fillInTheBlankData
            );
        } catch (error) {
          console.error();
        }
      }
      

      for (let i = 0; i < genIdentification.length; i++) {

        const identificationData = {
          question: genIdentification[i].question,
          answer: genIdentification[i].answer,
          quizType: 'FITB',
          bgColor: genIdentification[i].bgColor,
          StudyMaterialId: smResponse.data.id,
          UserId: smResponse.data.UserId,
        }

        try {
          await axios.post(
            'http://localhost:3001/quesAns',
            identificationData
            );
        } catch (error) {
          console.error();
        }
      }

 
    } catch (error) {
      console.error('Error saving study material:', error);
    }

    console.log(tofDistractors);
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
                      <button className='mbg-700 mcolor-100 px-5 py-2 rounded' onClick={() => {
                        setShowBookmarkModal(true)
                        setChooseRoom(true)
                        setCurrentSharedMaterialIndex(index)
                        }}>Bookmark</button>
                    </div>
                  </div>
              })}
            </div>

          </div>

          


          {/* user choosing to bookmark */}
          {showBookmarkModal && (
            <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
              <div className='flex items-center justify-center h-full'>
                <div className='relative mbg-100 h-[50vh] w-1/3 z-10 relative py-5 px-5 rounded-[5px]' style={{overflowY: 'auto'}}>

                  <button className='absolute right-5 top-5 font-medium text-xl' onClick={() => {
                    setShowBookmarkModal(false)
                  }}>&#10006;</button>

                {chooseRoom && (
                  <div className='flex items-center justify-center h-full'>
                    <div className='w-full'>
                      <div>
                        <p className='text-lg mb-5'>Bookmark to: </p>
                        <div className='flex flex-col gap-4'>
                          <button className='mbg-300 py-4 rounded text-md font-medium'>Personal Study Room</button>
                          <button className='mbg-300 py-4 rounded text-md font-medium' onClick={() => {
                            setChooseRoom(false)
                            setChooseGroupRoom(true)
                          }}>Group Study Room</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {chooseGroupRoom && (
                  <div>
                    <button className='mbg-200 mcolor-900 rounded px-4 py-1 rounded border-thin-800' onClick={() => {
                      setChooseGroupRoom(false)
                      setChooseRoom(true)
                    }}>Back</button>

                    {groupList.slice().sort((a, b) => b.id - a.id).map(({ id, groupName}) => (
                      <div key={id} className='shadows mcolor-900 rounded-[5px] p-5 my-6 mbg-100 flex items-center justify-between relative'>


                        <p className='px-1'>{groupName}</p>
                       <button  className='px-2 py-2 mbg-700 mcolor-100 rounded text-sm' onClick={() => bookmarkMaterial(currentSharedMaterialIndex, id)}>Bookmark here</button>

                        {/* {expandedGroupId === id && (

                          <div className='absolute right-0 bottom-0 px-7 mb-[-114px] mbg-700 mcolor-100 rounded pt-3 pb-4 opacity-80'>
                            <Link to={`/main/group/study-area/${id}`}>
                              <p className='pt-1'>Study Area</p>
                            </Link>
                            <Link to={`/main/group/tasks/${id}`}>
                              <p className='pt-1'>Tasks</p>
                            </Link>
                            <Link to={`/main/group/dashboard/${id}`}>
                              <p className='pt-1'>Dashboard</p>
                            </Link>
                          </div>
                        )}  */}

                      </div>
                    ))}
                  </div>
                )}
                      



                </div>
              </div>
            </div>
          )}
          
          





















          {/* user sharing */}
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
