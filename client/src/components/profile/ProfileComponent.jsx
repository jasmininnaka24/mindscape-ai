import React, { useEffect, useState } from 'react';
import '../../pages/main/mainpage.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../UserContext';
import axios from 'axios';
import { SERVER_URL } from '../../urlConfig';
import { fetchUserData } from '../../userAPI';
import { useDropzone } from 'react-dropzone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { Sidebar } from '../sidebar/Sidebar';


// animation import
import { motion  } from 'framer-motion';


export const ProfileComponent = () => {

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });



  const [groupListLength, setGroupListLength] = useState(0);
  const [contributedMaterialsLength, setContributedMaterialsLength] = useState(0);
  const [showPresentStudyMaterials, setShowPresentStudyMaterials] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [showMainProfile, setShowMainProfile] = useState(true)
  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [showPasswordSecurity, setShowPasswordSecurity] = useState(false)
  const [showAccountDeletion, setShowAccountDeletion] = useState(false)


  const [personalStudyMaterials, setPersonalStudyMaterials] = useState([]);
  const [personalStudyMaterialsCategory, setPersonalStudyMaterialsCategory] = useState([]);
  const [groupStudyMaterials, setGroupStudyMaterials] = useState([]);
  const [groupStudyMaterialsCategory, setGroupStudyMaterialsCategory] = useState([]);

  const [sharedMaterials, setSharedMaterials] = useState([]);
  const [sharedMaterialsCategory, setSharedMaterialsCategory] = useState([]);
  const [filteredSharedCategories, setFilteredSharedCategories] = useState([]);
  const [groupList, setGroupList] = useState([]);




  const [currentMaterialTitle, setCurrentMaterialTitle] = useState('');
  const [currentMaterialCategory, setCurrentMaterialCategory] = useState('');
  const [materialMCQ, setMaterialMCQ] = useState([]);
  const [materialMCQChoices, setMaterialMCQChoices] = useState([]);
  const [materialNotes, setMaterialNotes] = useState([])

  const [showModal, setShowModal] = useState(false);
  const [showMaterialDetails, setShowMaterialDetails] = useState(false)
  const [enableBackButton, setEnableBackButton] = useState(false)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [chooseRoom, setChooseRoom] = useState(false);
  const [currentSharedMaterialIndex, setCurrentSharedMaterialIndex] = useState(0);
  const [showCreateGroupInput, setShowCreateGroupInput] = useState(false);
  const [groupNameValue, setGroupNameValue] = useState('');


  const [chooseGroupRoom, setChooseGroupRoom] = useState(false);
  const [showAccountDeletionInputPass, setShowAccountDeletionInputPass] = useState(false)
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);


  // tabs
  const [showContext, setShowContext] = useState(false);
  const [context, setContext] = useState('')
  const [showNotes, setShowNotes] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [image, setImage] = useState('');




  const [showPassword, setShowPassword] = useState(false);
  const [passwordVal, setPasswordVal] = useState('')

  const [followerAndFollowingModal, setFollowerAndFollowingModal] = useState('hidden')

  const [showFollowerList, setShowFollowerList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);


  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [buttonClickedNumber, setButtonClickedNumber] = useState(0);
  const [loadOnce, setLoadOnce] = useState(false);
  const [dropDownPersonalLinks, setdropDownPersonalLinks] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false); // Declare isTablet outside useEffect



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    studyProfTarget: 0,
    typeOfLearner: '',
    userImage: ''
  })



  const { user } = useUser();
  const navigate = useNavigate();
  const { userId } = useParams();

  const UserId = user?.id;
  


  const fetchUserDataFrontend = async () => {
    try {

      setFollowerAndFollowingModal('hidden')
      setShowFollowerList(false)
      setShowFollowingList(false)

      const userData = await fetchUserData(userId === undefined ? UserId : userId);

      setUserData({
        username: userData.username,
        email: userData.email,
        studyProfTarget: userData.studyProfTarget,
        typeOfLearner: userData.typeOfLearner,
        userImage: userData.userImage
      });

      
   


    } catch (error) {
      console.error(error.message);
    }
  };



  const fetchData = async () => {

    if (loadOnce) {
      setLoading(true)
      setLoadOnce(false)
    }

    let totalGroups = 0
    const groupListLengthResponse = await axios.get(`${SERVER_URL}/studyGroup/extract-group-through-user/${userId === undefined ? UserId : userId}`)

    const groupListMemberLengthResponse = await axios.get(`${SERVER_URL}/studyGroupMembers/get-materialId/${userId === undefined ? UserId : userId}`)

    totalGroups += groupListLengthResponse.data.length;
    totalGroups += groupListMemberLengthResponse.data.length;
    
    setGroupListLength(totalGroups)
    

    const contributedMaterialsResponse = await axios.get(`${SERVER_URL}/studyMaterial/shared-materials-by-userid/${userId === undefined ? UserId : userId}`)

    setContributedMaterialsLength(contributedMaterialsResponse.data.length)



 
    // for fetching personal
    const personalStudyMaterial = await axios.get(`${SERVER_URL}/studyMaterial/shared-materials-by-userid/${userId === undefined ? UserId : userId}`)
    setPersonalStudyMaterials(personalStudyMaterial.data);


    const fetchedPersonalStudyMaterial = personalStudyMaterial.data;

    const fetchedPersonalStudyMaterialCategory = await Promise.all(
      fetchedPersonalStudyMaterial.map(async (material, index) => {
        const materialCategoryResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
        return materialCategoryResponse.data; // Return the data from each promise
      })
    );
      
    setPersonalStudyMaterialsCategory(fetchedPersonalStudyMaterialCategory);
    
    
    const groupStudyMaterial = await axios.get(`${SERVER_URL}/studyMaterial/shared-materials-by-userid/${userId === undefined ? UserId : userId}`)
    const filteredGroupStudyMaterials = groupStudyMaterial.data.filter(item => item.tag === 'Shared');
    setGroupStudyMaterials(filteredGroupStudyMaterials);
    
    
    // console.log(filteredGroupStudyMaterials);
    

    const fetchedGroupStudyMaterialCategory = await Promise.all(
      filteredGroupStudyMaterials.map(async (material, index) => {
        const materialCategoryResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
        return materialCategoryResponse.data; // Return the data from each promise
      })
    );
      
    setGroupStudyMaterialsCategory(fetchedGroupStudyMaterialCategory);
      
    // console.log(fetchedGroupStudyMaterialCategory);
      
      
      
    const sharedStudyMaterial = await axios.get(`${SERVER_URL}/studyMaterial/shared-materials-by-userid/${userId === undefined ? UserId : userId}`);
    const sharedStudyMaterialResponse = sharedStudyMaterial.data;  
    setSharedMaterials(sharedStudyMaterialResponse)

    const fetchedSharedStudyMaterialCategory = await Promise.all(
      sharedStudyMaterialResponse.map(async (material, index) => {
        const materialCategorySharedResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/shared-material-category/${material.StudyMaterialsCategoryId}/Group/${userId === undefined ? UserId : userId}`);
        return materialCategorySharedResponse.data;
      })
    );
          
    setSharedMaterialsCategory(fetchedSharedStudyMaterialCategory);


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
    Promise.all(promiseArray)
      .then(sortedCategoryObjects => {
        // console.log(sortedCategoryObjects);
        setFilteredSharedCategories(sortedCategoryObjects);      

      })
      .catch(error => {
        console.error('Error:', error);
      });
    
      
      
      const response = await axios.get(`${SERVER_URL}/studyGroup/extract-group-through-user/${userId === undefined ? UserId : userId}`);
      setGroupList(response.data);
      
      let dataLength = response.data.length;
      
      if (dataLength !== 0) {
        console.log('its not 0');
      } else {
        const userMemberGroupList = await axios.get(`${SERVER_URL}/studyGroupMembers/get-materialId/${userId === undefined ? UserId : userId}`);
        
        const materialPromises = userMemberGroupList.data.map(async (item) => {
          const material = await axios.get(`${SERVER_URL}/studyGroup/extract-all-group/${item.StudyGroupId}`);
          return material.data;
        });
    
        const materials = await Promise.all(materialPromises);
        setGroupList(materials);
      }


    setLoadOnce(false)
    setLoading(false)

  }
    
  useEffect(() => {

    
    if (!isDone) {
      setIsDone(true)
    }
  
  }, [UserId, userId]);
  
  useEffect(() => {
    if (isDone) {
      fetchData();
      fetchUserDataFrontend()
      setIsDone(false)
    }
  }, [isDone])
  



  const viewStudyMaterialDetails = async (index, materialFor, filter, category) => {
    setButtonLoader(true)
    setShowPresentStudyMaterials(false)

    if (filter === 'not filtered') {
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
  
        mcqResponse = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${personalStudyMaterials[index].id}`);
  
        setContext(personalStudyMaterials[index].body)
      } else if (materialFor === 'group') {
        mcqResponse = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${groupStudyMaterials[index].id}`);
        setContext(groupStudyMaterials[index].body)
      } else {
        mcqResponse = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${sharedMaterials[index].id}`);
        setContext(sharedMaterials[index].body)
      }
      
      setMaterialMCQ(mcqResponse.data);
      
      if (Array.isArray(mcqResponse.data)) {
        const materialChoices = mcqResponse.data.map(async (materialChoice) => {
          try {
            let choiceResponse = []
  
            if (materialFor === 'personal') {
              choiceResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${personalStudyMaterials[index].id}/${materialChoice.id}`);
            } else if (materialFor === 'group') {
              choiceResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${groupStudyMaterials[index].id}/${materialChoice.id}`);
            } else {
              choiceResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${sharedMaterials[index].id}/${materialChoice.id}`);
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
          revResponse = await axios.get(`${SERVER_URL}/quesRev/study-material-rev/${personalStudyMaterials[index].id}`);
        } else if (materialFor === 'group') {
          revResponse = await axios.get(`${SERVER_URL}/quesRev/study-material-rev/${groupStudyMaterials[index].id}`);
        } else {
          revResponse = await axios.get(`${SERVER_URL}/quesRev/study-material-rev/${sharedMaterials[index].id}`);
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

    setButtonLoader(false)
  }





  const bookmarkMaterial = async (index, id, materialFor, buttonclickedNum) => {

    setButtonLoading(true)
    setButtonClickedNumber(buttonclickedNum)


    const groupID = id;
    
    const title = sharedMaterials[index].title;
    const body = sharedMaterials[index].body;
    const numInp = sharedMaterials[index].numInp;
    const materialId = sharedMaterials[index].StudyMaterialsCategoryId;
    const materialForDb = sharedMaterials[index].materialFor;
    const materialCode = sharedMaterials[index].code;
    const materialTag = sharedMaterials[index].tag;
    
 
 
    const savedFunctionality = async () => {
     
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
       materialFor: materialFor,
       code: materialCode,
       StudyGroupId: materialFor === 'Group' ? groupID : null,
       StudyMaterialsCategoryId: materialId,
       UserId: UserId,
       bookmarkedBy: UserId,
       tag: 'Bookmarked'
     };
 
 
     
     try {
       let mcqResponse = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${sharedMaterials[index].id}`);
 
       genQAData = mcqResponse.data
 
       genMCQAData = genQAData.filter(data => data.quizType === 'MCQA')
       genToF = genQAData.filter(data => data.quizType === 'ToF')
       genIdentification = genQAData.filter(data => data.quizType === 'Identification')
       genFITB = genQAData.filter(data => data.quizType === 'FITB')
 
 
 
     // MCQA Distractors
     if (Array.isArray(genMCQAData)) {
       const materialChoices = genMCQAData.map(async (materialChoice) => {
         try {
           let choiceResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${sharedMaterials[index].id}/${materialChoice.id}`);
 
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
           let choiceResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${sharedMaterials[index].id}/${materialChoice.id}`);
 
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
 
       let revResponse = await axios.get(`${SERVER_URL}/quesRev/study-material-rev/${sharedMaterials[index].id}`);
 
       genQADataRev = revResponse.data;
       
     } catch (error) {
       console.error('Error fetching study material by ID:', error);
     }
 
 
 
 
 
 
     try {
       const smResponse = await axios.post(
         `${SERVER_URL}/studyMaterial`,
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
           `${SERVER_URL}/quesAns`,
           qaData
         );
 
         for (let j = 0; j < mcqaDistractors[i].length; j++) {
           let qacData = {
               choice: mcqaDistractors[i][j].choice, // Extract the string value from the object
               QuesAnId: qaResponse.data.id,
               StudyMaterialId: smResponse.data.id,
               UserId: smResponse.data.UserId,
           };
   
           try {
               await axios.post(`${SERVER_URL}/quesAnsChoices`, qacData);
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
 
         await axios.post(`${SERVER_URL}/quesRev`, qaDataRev);
 
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
           const qaResponse = await axios.post(`${SERVER_URL}/quesAns`, trueSentencesData);
       
           // Iterate through mcqaDistractors and create question choices
           for (let j = 0; j < tofDistractors[i].length; j++) {
             let qacData = {
                 choice: tofDistractors[i][j].choice, // Extract the string value from the object
                 QuesAnId: qaResponse.data.id,
                 StudyMaterialId: smResponse.data.id,
                 UserId: smResponse.data.UserId,
             };
     
             try {
                 await axios.post(`${SERVER_URL}/quesAnsChoices`, qacData);
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
             `${SERVER_URL}/quesAns`,
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
             `${SERVER_URL}/quesAns`,
             identificationData
             );
         } catch (error) {
           console.error();
         }
       }
 
  
     } catch (error) {
       console.error('Error saving study material:', error);
     }
     
 
 
     fetchData()

     setButtonLoading(false)
     setButtonClickedNumber(0)
    }
 
 
    if (materialFor === 'Personal') {

      
 
     const personalStudyMaterial = await axios.get(`${SERVER_URL}/studyMaterial/study-material-category/Personal/${UserId}`)
 
     let bookmarkedPersonalMaterial = personalStudyMaterial.data;
 
 
      const filteredMaterialResult = bookmarkedPersonalMaterial.filter(material => (material.code === materialCode && material.materialFor === materialFor && material.UserId === UserId));
 
      if (filteredMaterialResult.length === 0) {

        savedFunctionality()
       } else {
       alert('Already exists.')
       setButtonLoading(false)
       setButtonClickedNumber(0)
      }
 
 
     } else {
 
       const groupStudyMaterial = await axios.get(`${SERVER_URL}/studyMaterial/study-material-category/Group/${UserId}`)
 
       let bookmarkedPersonalMaterial = groupStudyMaterial.data;
 
 
       const filteredMaterialResult = bookmarkedPersonalMaterial.filter(material => (material.code === materialCode && material.materialFor === materialFor && material.StudyGroupId === groupID));
 
 
       if (filteredMaterialResult.length === 0) {
          savedFunctionality()
         } else {
         alert('Already exists.')
         setButtonLoading(false)
         setButtonClickedNumber(0)
       }
     }
     

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


   const createGroupBtn = async () => {

    try {
      const groupData = {
        groupName: groupNameValue,
        role: 'Super Admin',
        code: generateRandomString(),
        UserId: UserId,
      };
      
      if (groupNameValue !== '') {
        await axios.post(`${SERVER_URL}/studyGroup/create-group`, groupData);
  
        fetchData();
        setShowCreateGroupInput(false);
      } else {
        alert('Cannot save an empty field.')
      }

    } catch (error) {
      console.error('Error creating group:', error);
      // Handle errors as needed
    }

  };


  const updateUserInformation = async (e, buttonclickedNum) => {

    setButtonLoading(true)
    setButtonClickedNumber(buttonclickedNum)

    let data = {
      username: userData.username,
      typeOfLearner: userData.typeOfLearner,
      studyProfTarget: userData.studyProfTarget
    }
    

    await axios.put(`${SERVER_URL}/users/update-user/${UserId}`, data).then((response) => {

    if(response.data.error) {

      setTimeout(() => {
        setError(true)
        setMsg(response.data.message)
      }, 100);
      
      setTimeout(() => {
        setError(false)
        setMsg('')
      }, 2500);


    } else {
      setTimeout(() => {
        setError(false)
        setMsg(response.data.message)
      }, 100);
      
      setTimeout(() => {
        setMsg('')
      }, 2500);
    }

    setButtonLoading(false)
    setButtonClickedNumber(0)
  })

    fetchUserDataFrontend()
  }


  const updateUserImage = async (e, buttonclickedNum) => {
    setButtonLoading(true)
    setButtonClickedNumber(buttonclickedNum)
    e.preventDefault();
  
  
    if (image) {
      // Generate frontend filename
  
      // Prepare FormData for image upload
      const formData = new FormData();

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const date = currentDate.getDate().toString().padStart(2, '0');
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const formattedString = `${year}${month}${date}${hours}`;


      formData.append('image', (image)); 
  

  
      try {

        const response = await axios.post(`${SERVER_URL}/upload`, formData);
  
        const serverGeneratedFilename = response.data.filename;

        let data = {
          userImage: serverGeneratedFilename,
        };

        await axios.put(`${SERVER_URL}/users/update-user-image/${UserId}`, data).then((response) => {

          if(response.data.error) {
            setTimeout(() => {
              setError(true)
              setMsg(response.data.message)
            }, 100);
            
            setTimeout(() => {
              setError(false)
              setMsg('')
            }, 2500);      
          } else {
            setTimeout(() => {
              setError(false)
              setMsg(response.data.message)
            }, 100);
            
            setTimeout(() => {
              setMsg('')
            }, 2500);
          }
        })
        
        fetchUserDataFrontend()
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('No image selected!');
    }
    
    setButtonLoading(false)
    setButtonClickedNumber(0)

  };


  const deleteAccount = async (e, buttonclickedNum) => {
    e.preventDefault()
    setButtonClickedNumber(3)
    const confirmDeletion = async () => {

      let data = {
        password: passwordVal,
      }

      await axios({
        method: 'delete',
        url: `${SERVER_URL}/users/${UserId}`,
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
  
      if(response.data.error) {
  
        setTimeout(() => {
          setError(true)
          setMsg(response.data.message)
        }, 100);
        
        setTimeout(() => {
          setError(false)
          setMsg('')
        }, 2500);
  
        
      } else {
        setTimeout(() => {
          setError(false)
          setMsg(response.data.message)
        }, 100);
        
        setTimeout(() => {
          setMsg('')
          sessionStorage.clear();
          navigate('/')
        }, 2500);
        
      }})
  
  
    }


    // Show confirmation prompt
    if (window.confirm('Are you sure you want to delete your account?')) {
      // If confirmed, proceed with deletion
      confirmDeletion();
    } else {
      // If canceled, display a message or perform any other action
      setError(true);
      setMsg('Account deletion canceled.');
      
      // Clear the cancellation message after a delay
      setTimeout(() => {
        setError(false);
        setMsg('');
      }, 2500);
    }

    setButtonClickedNumber(0)
  }
  


  const toggleExpansion = () => {
    setdropDownPersonalLinks(!dropDownPersonalLinks ? true : false);
  };

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    navigate('/')
  };
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/users`);
        let responseData = response.data;
  
        let filteredUsers = responseData.filter(user => user.id !== UserId);
        
        setUsers(filteredUsers)

        setLoading(false)
        
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);


  const handleSearch = async (event) => {
    setSearchTerm(event)
  
    const response = await axios.get(`${SERVER_URL}/users`);
    let responseData = response.data;
  
    // Assuming you want to filter users based on the username field
    let filteredUsers = responseData.filter(user => 
      user.username.toLowerCase().includes(event.toLowerCase())
    );
  
    setSearchResults(filteredUsers);
  };







  const tabVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    active: { borderBottom: '2px solid #fff' },
    inactive: { borderBottom: '2px solid transparent' },
  };


  const tabListVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };


  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };


  if (loading) {
    return <div className='h-[100vh] w-full flex items-center justify-center'>
      <div class="loader">
        <div class="spinner"></div>
      </div>
    </div>
  } else {
    return (
      <div className='poppins mcolor-900 mbg-300 relative flex'>
      {/* Toggle button for mobile and tablet sizes */}

      <Sidebar currentPage={'profile'}/>
        
      <div className={`lg:w-1/6 h-[100vh] flex flex-col items-center justify-between py-2 lg:mb-0 ${
        window.innerWidth > 1020 ? '' :
        window.innerWidth <= 768 ? 'hidden' : 'hidden'
      } mbg-800`}></div>

      {/* Main content */}
      {/* <div className={`mbg-300`}>
        <button onClick={toggleSidebar}>
          {sidebarOpen ? <KeyboardArrowLeftIcon/> : <ChevronRightIcon/>}
        </button>
        
      </div> */}

      <div className={`flex-1 mbg-300 w-full mx-5 pt-5`}>

        <div className='mbg-input p-4 rounded-[1rem]'>
          <motion.ul
            className='mbg-400 w-full rounded-[1rem] flex flex-col items-center lg:flex-row lg:justify-between'
            variants={tabListVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              variants={tabVariants}
              whileTap="active"
              className={`${showMainProfile ? 'btn-800 mcolor-100' : 'mcolor-800'} text-center rounded-[1rem] w-full lg:w-full lg:mr-2 py-2`}
              onClick={() => {
                setShowPasswordSecurity(false);
                setShowAccountSettings(false);
                setShowAccountDeletion(false);
                setShowMainProfile(true);
              }}
            >
              Account Settings
            </motion.button>

            <motion.button
              variants={tabVariants}
              whileTap="active"
              className={`${showAccountSettings ? 'btn-800 mcolor-100' : 'mcolor-800'} text-center rounded-[1rem] w-full lg:w-full lg:mr-2 py-2`}
              onClick={() => {
                setShowMainProfile(false);
                setShowPasswordSecurity(false);
                setShowAccountDeletion(false);
                setShowAccountSettings(true);
              }}
            >
              Contributed Materials
            </motion.button>

            <motion.button
              variants={tabVariants}
              whileTap="active"
              className={`${showPasswordSecurity ? 'btn-800 mcolor-100' : 'mcolor-800'} text-center rounded-[1rem] w-full lg:w-full lg:mr-2 py-2`}
              onClick={() => {
                setShowAccountSettings(false);
                setShowMainProfile(false);
                setShowAccountDeletion(false);
                setShowPasswordSecurity(true);
              }}
            >
              Password & Security
            </motion.button>

            <motion.button
              variants={tabVariants}
              whileTap="active"
              className={`${showAccountDeletion ? 'btn-800 mcolor-100' : 'mcolor-800'} text-center rounded-[1rem] w-full lg:w-full lg:mr-2 py-2`}
              onClick={() => {
                setShowAccountSettings(false);
                setShowMainProfile(false);
                setShowPasswordSecurity(false);
                setShowAccountDeletion(true);
              }}
            >
              Account Deletion
            </motion.button>
          </motion.ul>
        </div>

            
        <br />
        <div className='flex justify-between relative'>


          <div className='w-full lg:w-2/3 pr-5'>
            {showMainProfile && (
              <motion.div 
              className='mb-5'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className='shadows p-5 mbg-input rounded'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <form className='flex items-center justify-center px-8 gap-8 pt-5'>
                  <div className='p-2 rounded-full' {...getRootProps()} style={{ width: '220px', cursor: 'pointer', border: '3px dashed #888' }}>
                    <input {...getInputProps()} name='image' type='file' />
                    {acceptedFiles.length === 0 ? (
                      <img src={`${SERVER_URL}/images/${userData.userImage}`} className='rounded-full' style={{ width: '200px', objectFit: 'cover', height: '200px' }} alt="" />
                    ) : (
                      <>
                        <img src={URL.createObjectURL(acceptedFiles[0])} className='rounded-full' style={{ width: '200px', objectFit: 'cover', height: '200px' }} alt="" />
                      </>
                    )}
                  </div>

                  <div className=''>
                    <p className='text-2xl mb-1 font-medium mcolor-800 mb-1'>Upload a new photo</p>
                    <p className='text-sm opacity-70 mb-4'>Drag and drop an image to the photo or click to select one.</p>

                    <button className={`${(buttonLoading && buttonClickedNumber === 1) ? 'mbg-200 mcolor-900 border-thin-800' : 'btn-primary mcolor-100'} px-10 py-2 rounded`} disabled={(buttonLoading && buttonClickedNumber === 1)} onClick={(e) => updateUserImage(e, 1)}>
                      {(buttonLoading && buttonClickedNumber === 1) ? (
                        <div>Updating...</div>
                      ) : (
                        <div>Update</div>
                      )}
                    </button>
                  </div>
                </form>  
                  
                {!error && msg !== '' && (
                  <div className='green-bg text-center mt-5 rounded py-3 w-full'>
                    {msg}
                  </div>
                )}

                {error && msg !== '' && (
                  <div className='bg-red mcolor-100 text-center mt-5 rounded py-3 w-full'>
                    {msg}
                  </div>
                )}


                {/* Changing information */}
                <br /><br />
                <p className='text-xl mcolor-800 font-medium'>Change your information here: </p>

                <ul className='grid grid-cols-2 gap-5 my-5'>
                  <li className='w-full'>
                    <p className='text-md'>Username</p>
                    <input
                      type="text"
                      className='border-medium-800 w-full py-2 rounded px-5'
                      value={userData.username || ''}
                      onChange={(event) => setUserData({...userData, username: event.target.value})}
                    />


                  </li>
                  <li className='w-full'>
                    <p className='text-md'>Email</p>
                    <input type="text" disabled className='border-medium-800 w-full py-2 rounded mbg-300 px-5' value={userData.email} />
                  </li>
                  
                  <li className='w-full'>
                    <p className='text-md'>Study Target</p>

                    <select
                      name=""
                      id=""
                      className='border-medium-800 w-full py-2 rounded px-5'
                      value={userData.studyProfTarget || ''}
                      onChange={(event) => setUserData({...userData, studyProfTarget: event.target.value}) || ''}
                    >
                      {/* Dynamic default option based on studyProfTarget */}
                      {userData.studyProfTarget && (
                        <option key={userData.studyProfTarget} value={userData.studyProfTarget}>
                          {userData.studyProfTarget}
                        </option>
                      )}

                      {/* Other options excluding the default value */}
                      {[100, 95, 90, 85, 80, 75].map((option) => (
                        option !== userData.studyProfTarget && (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        )
                      ))}
                    </select>
                  </li>


                  <li className='w-full'>
                    <p className='text-md'>Type of Learner</p>
                    <select
                      name=""
                      id=""
                      className='border-medium-800 w-full py-2 rounded px-5'
                      value={userData.typeOfLearner || ''}
                      onChange={(event) => setUserData({...userData, typeOfLearner: event.target.value}) || ''}
                    >
                      {/* Dynamic default option based on typeOfLearner */}
                      {userData.typeOfLearner && (
                        <option key={userData.typeOfLearner} value={userData.typeOfLearner}>
                          {userData.typeOfLearner}
                        </option>
                      )}

                      {/* Other options excluding the default value */}
                      {['Auditory', 'Visual', 'Kinesthetic'].map((option) => (
                        option !== userData.typeOfLearner && (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        )
                      ))}
                    </select>
                  </li>




                </ul>

                <div className='flex items-center justify-end w-full mt-10'>
                  <button className={`${(buttonLoading && buttonClickedNumber === 2) ? 'mbg-200 mcolor-900 border-thin-800' : 'btn-primary mcolor-100'} px-5 py-2 rounded`} disabled={(buttonLoading && buttonClickedNumber === 2)} onClick={(e) => updateUserInformation(e, 2)}>
                      {(buttonLoading && buttonClickedNumber === 2) ? (
                        <div>Updating...</div>
                      ) : (
                        <div>Update Information Details</div>
                      )}
                    </button>
                </div>
              </motion.div>
            </motion.div>
            )}


            {showAccountSettings && (
            <motion.div 
              className='mb-5'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >

              <div>

                <br />
                {contributedMaterialsLength > 0 ? (
                  <p className='mb-3 text-lg text-center'>Contributed Materials</p>
                  ): (
                  <p className='mb-3 text-lg text-center mcolor-500'>No Contributed Materials</p>
                )}

                <ul className='grid grid-cols-1 gap-5'>
                  {sharedMaterials.map((material, index) => {
                    const category = sharedMaterialsCategory[index]?.category || 'Category not available';

                    return <div key={index} className='my-3 shadows mbg-input p-4 rounded flex items-center justify-between'>
                      <div>
                        <p className='font-medium text-lg'>Title: {material.title}</p>
                        <p className='text-sm mt-1'>Category: {category}</p>
                      </div>

                      <div className='flex items-center gap-3'>
                        <button className='mbg-400 mcolor-900 border-thin-800 px-5 py-2 rounded' disabled={buttonLoader} onClick={() => viewStudyMaterialDetails(index, 'shared', 'not filtered', category)}>
                          {
                            buttonLoader ? (
                              <div class="btn-spinner"></div>
                              ) : (
                              <div>View</div>
                            )
                          }
                        </button>
                        <button className='btn-800 mcolor-100 px-5 py-2 rounded' onClick={() => {
                          setShowBookmarkModal(true)
                          
                          setChooseRoom(true)
                          // setChooseGroupRoom(true);
                          
                          setCurrentSharedMaterialIndex(index)
                          
                        }}>Bookmark</button>
                      </div>
                    </div>
                    })
                  }
                </ul>
                </div>


                {/* user sharing */}
                {showModal && (
                <div
                  className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                  <motion.div className='flex items-center justify-center h-full'
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    >
                    <div className='relative mbg-input min-h-[30vh] max-h-[80vh] w-1/2 z-10 relative py-5 px-10 rounded-[5px]' style={{overflowY: 'auto'}}>
                      
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
                            <Link to={'/main/library/generate-quiz'}>
                              <button className='btn-800 mcolor-100 px-5 py-2 rounded border-thin-800'>Generate a new Study Material</button>
                            </Link>
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
                                  <button className='mbg-input mcolor-900 border-thin-800 px-5 py-2 rounded' onClick={() => viewStudyMaterialDetails(index, 'personal', 'not filtered', category)} >View</button>
                                  {/* <button className='btn-800 mcolor-100 px-5 py-2 rounded' onClick={() => shareMaterial(index, 'personal')}>Share</button> */}
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
                                  <button className='mbg-input mcolor-900 border-thin-800 px-5 py-2 rounded' onClick={() => viewStudyMaterialDetails(index, 'group', 'not filtered', category)}>View</button>
                                  {/* <button className='btn-800 mcolor-100 px-5 py-2 rounded' onClick={() => shareMaterial(index, 'Group')}>Share</button> */}
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
                              <button className={`border-thin-800 w-full rounded py-2 ${showContext ? '' : 'btn-800 mcolor-100'}`} onClick={() => {
                                setShowQuiz(false)
                                setShowNotes(false)
                                setShowContext(true)
                              }}>Context</button>
                              <button className={`border-thin-800 w-full rounded py-2 ${showNotes ? '' : 'btn-800 mcolor-100'}`} onClick={() => {
                                setShowContext(false)
                                setShowQuiz(false)
                                setShowNotes(true)
                              }}>Notes</button>
                              <button className={`border-thin-800 w-full rounded py-2 ${showQuiz ? '' : 'btn-800 mcolor-100'}`} onClick={() => {
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
                  </motion.div>
                </div>
                )}



                {/* user choosing to bookmark */}
                {showBookmarkModal && (
                <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                  <motion.div className='flex items-center justify-center h-full'
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    >
                    <div className='relative mbg-input min-h-[30vh] w-1/3 z-10 relative py-5 px-5 rounded-[5px]' style={{overflowY: 'auto'}}>

                      <button className='absolute right-5 top-5 font-medium text-xl' onClick={() => {
                        setShowBookmarkModal(false)
                        setChooseGroupRoom(false)
                        setChooseRoom(false)
                        setShowCreateGroupInput(false);
                      }}>&#10006;</button>

                    {chooseRoom && (
                      <div className='flex h-full py-10'>
                        <div className='w-full'>
                          <div>
                            <p className='text-lg mb-5'>Bookmark to: </p>
                            <div className='flex flex-col gap-4'>

                              <button className={`${(buttonLoading && buttonClickedNumber === 4) ? 'mbg-300 py-4 rounded text-md font-medium' : 'mbg-300 py-4 rounded text-md font-medium'} border-thin-800 px-10 py-2 rounded`} disabled={(buttonLoading && buttonClickedNumber === 4)} onClick={() => bookmarkMaterial(currentSharedMaterialIndex, null, 'Personal', 4)}>
                                {(buttonLoading && buttonClickedNumber === 4) ? (
                                  <div>Bookmarking to Personal Study Room...</div>
                                ) : (
                                  <div>Personal Study Room</div>
                                )}
                              </button>

                              <button className='mbg-300 py-4 rounded text-md font-medium  border-thin-800' onClick={() => {
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
                        

                        <div className='mt-5 flex items-center justify-center'>
                          {/* back here */}

                          {showCreateGroupInput === false ? (
                            <button className={`px-4 py-2 rounded btn-800 mcolor-100 ${userId === undefined && 'mt-5'}`} onClick={() => {
                              setShowCreateGroupInput(true)
                            }}>Create a group</button>
                          ) : (
                            <div className='w-full'>
                              <div className='my-3 border-thin-800 rounded'>
                                <input type="text" placeholder='Group name...' className='w-full py-2 rounded text-center' value={groupNameValue !== '' ? groupNameValue : ''} onChange={(event) => {
                                  setGroupNameValue(event.target.value)
                                }} />
                              </div>
                              <div className='flex items-center justify-center gap-3'>
                                <button className='px-4 w-full py-2 rounded btn-800 mcolor-100' onClick={createGroupBtn}>Create</button>
                                <button className='px-4 w-full py-2 rounded mbg-input mcolor-900 border-thin-800' onClick={() => setShowCreateGroupInput(false)}>Cancel</button>
                              </div>
                            </div>
                          )}

                          
                        </div>

                        {showCreateGroupInput === false && (
                          groupList.slice().sort((a, b) => b.id - a.id).map(({ id, groupName}) => (
                            <div key={id} className='shadows mcolor-900 rounded-[5px] p-5 my-6 mbg-input flex items-center justify-between relative'>


                              <p className='px-1'>{groupName}</p>


                              <button className={`${(buttonLoading && buttonClickedNumber === (id+'1')) ? 'mbg-200 mcolor-900 border-thin-800' : 'btn-800 mcolor-100'} px-5 py-2 rounded`} disabled={(buttonLoading && buttonClickedNumber === (id+'1'))} onClick={() => bookmarkMaterial(currentSharedMaterialIndex, id, 'Group', (id+'1'))}>
                                {(buttonLoading && buttonClickedNumber === (id+'1')) ? (
                                  <div>Bookmarking...</div>
                                ) : (
                                  <div>Bookmark</div>
                                )}
                              </button>

                              {/* {expandedGroupId === id && (

                                <div className='absolute right-0 bottom-0 px-7 mb-[-114px] btn-800 mcolor-100 rounded pt-3 pb-4 opacity-80'>
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
                          ))
                        )}
                        
                      </div>
                    )}
                          



                    </div>
                  </motion.div>
                </div>
                )}
              </motion.div>
            </motion.div>
            )}


            {showPasswordSecurity && (
              <motion.div 
              className='mb-5'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className='shadows p-5 mbg-input rounded'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >

                    <form className='px-8 gap-8 py-5'>
                      <p className='text-2xl mcolor-800 font-medium mb-5'>Resetting Password</p>
                      <p className='mcolor-800'>
                        Begin the password reset process by entering your email address below. Our system will quickly initiate the necessary steps to secure your account. Once submitted, a confirmation email will be sent to the provided address, containing instructions on how to efficiently reset your password.
                      </p>

                      <div className='flex items-center justify-end mt-5'>
                        <Link to={'/verify-email'} className=' py-2 px-5 btn-primary rounded'>
                          Reset Password
                        </Link>
                      </div>
                    </form>
          
              </motion.div>
            </motion.div>
            )}

            {showAccountDeletion && (
              <motion.div 
              className='mb-5'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className='shadows p-5 mbg-input rounded mb-5'>

                  <form className='px-8 gap-8 py-5'>
                    <p className='text-2xl mcolor-800 font-medium mb-5'>Account Deletion</p>
                    <p className='mcolor-800'>
                      Keep in mind that this action is irreversible and will result in the removal of all your information from our system.
                    </p>

                    <div className='flex items-center justify-end mt-5'>
                      <button
                        className='btn-primary px-8 py-2 rounded'
                        onClick={(e) => {
                        e.preventDefault()
                        setShowAccountDeletionInputPass(true)}
                        }>
                        Proceed
                      </button>
                    </div>
                  </form>

                  {!error && msg !== '' && (
                    <div className='green-bg text-center mt-5 rounded py-3 w-full'>
                      {msg}
                    </div>
                  )}

                  {error && msg !== '' && (
                    <div className='bg-red mcolor-100 text-center mt-5 rounded py-3 w-full'>
                      {msg}
                    </div>
                  )}

                  {showAccountDeletionInputPass && (
                    <motion.div
                      className='w-full rounded flex items-center justify-center my-5'
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className='w-1/2 border-thin-800 rounded p-5 mbg-200'>
                        <p className='text-center font-medium text-xl mt-2'>Password Confirmation</p>

                        <motion.div
                          className='flex relative mt-6'
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                        >
                          <input
                            autoComplete='no'
                            placeholder='Enter password...'
                            type={showPassword ? 'text' : 'password'}
                            className='w-full border-thin-800 rounded px-5 py-2'
                            value={passwordVal !== '' ? passwordVal : ''}
                            onChange={(event) => setPasswordVal(event.target.value)}
                          />
                          <motion.button
                            type="button"
                            className='ml-2 focus:outline-none absolute right-2 bottom-2 mcolor-800'
                            onClick={togglePasswordVisibility}
                            whileTap={{ scale: 0.9 }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </motion.button>
                        </motion.div>

                        <motion.button
                          className={`${(buttonLoading && buttonClickedNumber === 3) ? 'mbg-200 mcolor-900 border-thin-800' : 'btn-800 mcolor-100'} w-full py-2 my-4 rounded`}
                          disabled={(buttonLoading && buttonClickedNumber === 3)}
                          onClick={(e) => deleteAccount(e, 3)}
                          whileTap={{ scale: 0.95 }}
                        >
                          {(buttonLoading && buttonClickedNumber === 3) ? (
                            <div>Confirming...</div>
                          ) : (
                            <div>Confirm</div>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                  <br />
                </div>
              </motion.div>
            </motion.div>
            )}
          </div>



          <motion.div
            className={`w-full lg:w-1/3 mbg-800 rounded flex flex-col justify-center mcolor-100 ${
              window.innerWidth > 1300 ? 'h-[48vh]' :
              window.innerWidth > 900 ? 'h-[58vh]' :
              'h-[68vh]'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className='flex items-center justify-center w-full'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                style={{ width: '150px' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <img
                  src={`${SERVER_URL}/images/${userData.userImage}`}
                  className='rounded-full'
                  style={{ width: '150px', objectFit: 'cover', height: '150px' }}
                  alt=""
                />
              </motion.div>
            </motion.div>

            <motion.div
              className='text-center'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <p className='text-2xl mb-1 font-medium text-2xl mb-1 mb-5 mt-3'>
                {userData.username}
              </p>

              <p className='text-md font-medium'>
                {userData.typeOfLearner} Learner
              </p>

              <p className='text-md'>{groupListLength} Group Study Rooms</p>
              <p className='text-md'>
                {contributedMaterialsLength} Study Materials Contributes
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </div>
    )
  }
}
