import React, { useEffect, useState } from 'react'
import { useUser } from '../../UserContext'
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { fetchUserData } from '../../userAPI';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const ProfileComponent = () => {


  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };


  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });



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

  const [following, setFollowing] = useState(false);

  const [followingUsers, setFollowingUsers] = useState([]);
  const [followerUsers, setFollowerUsers] = useState([]);


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
      const userData = await fetchUserData(userId === undefined ? UserId : userId);

      setUserData({
        username: userData.username,
        email: userData.email,
        studyProfTarget: userData.studyProfTarget,
        typeOfLearner: userData.typeOfLearner,
        userImage: userData.userImage
      });

      const isFollowingResponse = await axios.get(`http://localhost:3001/followers/following/${userId === undefined ? UserId : userId}`);
      
      let isFollowing = isFollowingResponse.data;

      console.log(isFollowing);
      
      if (isFollowing === null) {
        setFollowing(false)
      } else {
        setFollowing(true)
      }
      
      const followerResponse = await axios.get(`http://localhost:3001/followers/get-follower-list/${userId === undefined ? UserId : userId}`);
      
      const followingResponse = await axios.get(`http://localhost:3001/followers/get-following-list/${userId === undefined ? UserId : userId}`);


      setFollowingUsers(followingResponse.data);
      setFollowerUsers(followerResponse.data);

    } catch (error) {
      console.error(error.message);
    }
  };



  const followUser = async (e) => {
    e.preventDefault();

    let data = {
      FollowingId: userId,
      FollowerId: UserId
    }

    await axios.post(`http://localhost:3001/followers/follow`, data);
    fetchUserDataFrontend();
  }

  const unfollowUser = async (e) => {
    e.preventDefault();

    await axios.delete(`http://localhost:3001/followers/unfollow/${userId}/${UserId}`);
    
    fetchUserDataFrontend();
  }



  // for image upload


  const fetchData = async () => {


    
    const contributedMaterialsResponse = await axios.get(`http://localhost:3001/studyMaterial/shared-materials-by-userid/${userId === undefined ? UserId : userId}`)

    setContributedMaterialsLength(contributedMaterialsResponse.data.length)



 
    // for fetching personal
    const personalStudyMaterial = await axios.get(`http://localhost:3001/studyMaterial/shared-materials-by-userid/${userId === undefined ? UserId : userId}`)
    setPersonalStudyMaterials(personalStudyMaterial.data);


    const fetchedPersonalStudyMaterial = personalStudyMaterial.data;

    const fetchedPersonalStudyMaterialCategory = await Promise.all(
      fetchedPersonalStudyMaterial.map(async (material, index) => {
        const materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
        return materialCategoryResponse.data; // Return the data from each promise
      })
    );
      
    setPersonalStudyMaterialsCategory(fetchedPersonalStudyMaterialCategory);
    
    
    const groupStudyMaterial = await axios.get(`http://localhost:3001/studyMaterial/shared-materials-by-userid/${userId === undefined ? UserId : userId}`)
    const filteredGroupStudyMaterials = groupStudyMaterial.data.filter(item => item.tag === 'Shared');
    setGroupStudyMaterials(filteredGroupStudyMaterials);
    
    
    // console.log(filteredGroupStudyMaterials);
    

    const fetchedGroupStudyMaterialCategory = await Promise.all(
      filteredGroupStudyMaterials.map(async (material, index) => {
        const materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
        return materialCategoryResponse.data; // Return the data from each promise
      })
    );
      
    setGroupStudyMaterialsCategory(fetchedGroupStudyMaterialCategory);
      
    // console.log(fetchedGroupStudyMaterialCategory);
      
      
      
    const sharedStudyMaterial = await axios.get(`http://localhost:3001/studyMaterial/shared-materials-by-userid/${userId === undefined ? UserId : userId}`);
    const sharedStudyMaterialResponse = sharedStudyMaterial.data;  
    setSharedMaterials(sharedStudyMaterialResponse)

    const fetchedSharedStudyMaterialCategory = await Promise.all(
      sharedStudyMaterialResponse.map(async (material, index) => {
        const materialCategorySharedResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/shared-material-category/${material.StudyMaterialsCategoryId}/Group/${userId === undefined ? UserId : userId}`);
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
    
      
      
      const response = await axios.get(`http://localhost:3001/studyGroup/extract-group-through-user/${userId === undefined ? UserId : userId}`);
      setGroupList(response.data);
      
      let dataLength = response.data.length;
      
      if (dataLength !== 0) {
        console.log('its not 0');
      } else {
        const userMemberGroupList = await axios.get(`http://localhost:3001/studyGroupMembers/get-materialId/${userId === undefined ? UserId : userId}`);
        
        const materialPromises = userMemberGroupList.data.map(async (item) => {
          const material = await axios.get(`http://localhost:3001/studyGroup/extract-all-group/${item.StudyGroupId}`);
          return material.data;
        });
    
        const materials = await Promise.all(materialPromises);
        setGroupList(materials);
      }





    
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
  }





  const bookmarkMaterial = async (index, id, materialFor) => {

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
               choice: mcqaDistractors[i][j].choice, // Extract the string value from the object
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
 
 
 
     fetchData()
    }
 
 
    if (materialFor === 'Personal') {
 
     const personalStudyMaterial = await axios.get(`http://localhost:3001/studyMaterial/study-material-category/Personal/${UserId}`)
 
     let bookmarkedPersonalMaterial = personalStudyMaterial.data;
 
 
      const filteredMaterialResult = bookmarkedPersonalMaterial.filter(material => (material.code === materialCode && material.materialFor === materialFor && material.UserId === UserId));
 
      if (filteredMaterialResult.length === 0) {
        savedFunctionality()
       } else {
       alert('Already exists.')
      }
 
 
     } else {
 
       const groupStudyMaterial = await axios.get(`http://localhost:3001/studyMaterial/study-material-category/Group/${UserId}`)
 
       let bookmarkedPersonalMaterial = groupStudyMaterial.data;
 
 
       const filteredMaterialResult = bookmarkedPersonalMaterial.filter(material => (material.code === materialCode && material.materialFor === materialFor && material.StudyGroupId === groupID));
 
 
       if (filteredMaterialResult.length === 0) {
         savedFunctionality()
         } else {
         alert('Already exists.')
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
        await axios.post('http://localhost:3001/studyGroup/create-group', groupData);
  
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


  const updateUserInformation = async () => {

    let data = {
      username: userData.username,
      typeOfLearner: userData.typeOfLearner,
      studyProfTarget: userData.studyProfTarget
    }
    

    await axios.put(`http://localhost:3001/users/update-user/${UserId}`, data).then((response) => {

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
  }


  const updateUserImage = async (e) => {
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

        const response = await axios.post('http://localhost:3001/upload', formData);
  
        const serverGeneratedFilename = response.data.filename;

        let data = {
          userImage: serverGeneratedFilename,
        };

        await axios.put(`http://localhost:3001/users/update-user-image/${UserId}`, data).then((response) => {

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
  };


  const deleteAccount = async (e) => {
    e.preventDefault()
    const confirmDeletion = async () => {

      let data = {
        password: passwordVal,
      }

      await axios({
        method: 'delete',
        url: `http://localhost:3001/users/${UserId}`,
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

  }
  

  // Function to format follower count
  const formatFollowerCount = (count) => {
    if (typeof count === 'number' && !isNaN(count)) {
      if (count >= 1000 && count < 1000000) {
        return (count / 1000).toFixed(1) + 'k';
      } else if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
      } else {
        return count.toString();
      }
    } else {
      return '0';
    }
  };
  



  return (
    <div className='poppins flex w-full mcolor-900 mbg-200 mbg- min-h-[100vh]'>

      <div className='container flex'>

        <div className='w-1/3 p-5 my-8'>

          <div className={`${showMainProfile ? 'shadows' : 'border-thin-800'} p-5 mbg-100 rounded my-5 cursor-pointer`} onClick={() => {
            setShowPasswordSecurity(false)
            setShowAccountSettings(false)
            setShowAccountDeletion(false)
            setShowMainProfile(true)
          }}>
            <p className='text-2xl mb-1text-2xl mb-1'>Main Profile</p>
            <p className='opacity-75 text-sm'>{(!userId || UserId === parseInt(userId, 10)) ? 'Discover your details, contributions, and connections.' : `Discover ${userData.username}'s details, contributions, and connections.`}</p>
          </div>

          {(!userId || UserId === parseInt(userId, 10)) && (
            <div>
              <div className={`${showAccountSettings ? 'shadows' : 'border-thin-800'} p-5 mbg-100 rounded my-5 cursor-pointer`} onClick={() => {
                setShowMainProfile(false)
                setShowPasswordSecurity(false)
                setShowAccountDeletion(false)
                setShowAccountSettings(true)
              }}>
                <p className='text-2xl mb-1'>Account Settings</p>
                <p className='opacity-75 text-sm'>Customize your information details and preferences.</p>
              </div>
              <div className={`${showPasswordSecurity ? 'shadows' : 'border-thin-800'} p-5 mbg-100 rounded my-5 cursor-pointer`} onClick={() => {
                setShowAccountSettings(false)
                setShowMainProfile(false)
                setShowAccountDeletion(false)
                setShowPasswordSecurity(true)
              }}>
                <p className='text-2xl mb-1'>Password & Security</p>
                <p className='opacity-75 text-sm'>Ensure the safety of your account with advanced security settings.</p>
              </div>
              <div className={`${showAccountDeletion ? 'shadows' : 'border-thin-800'} p-5 mbg-100 rounded my-5 cursor-pointer`} onClick={() => {
                setShowAccountSettings(false)
                setShowMainProfile(false)
                setShowPasswordSecurity(false)
                setShowAccountDeletion(true)
              }}>
                <p className='text-2xl mb-1'>Account Deletion</p>
                <p className='opacity-75 text-sm'>To permanently delete your account, including all associated data, please proceed with caution.</p>

              </div>
            </div>
          )}
        </div>



        <div className='flex-1 p-5 my-8'>

          {showMainProfile && (
            <div>
              <div className='shadows p-5 mbg-100 rounded my-5'>

                <div className='flex items-center px-8 gap-8 pt-5'>
                  <div style={{ width: '200px' }}>
                  <img src={`http://localhost:3001/images/${userData.userImage}`} className='rounded-full' style={{ width: '200px', objectFit: 'cover', height: '200px' }} alt="" />
                  </div>

                  <div className=''>
                    <p className='text-2xl mb-1 font-medium text-2xl mb-1 mcolor-800 mb-5'>{userData.username}</p>

                    <p className='opacity-80 text-md font-medium'>
                      {userData.typeOfLearner} Learner | {formatFollowerCount(followerUsers.length)} Follower{followerUsers.length > 1 ? 's' : ''} | {formatFollowerCount(followingUsers.length)} Following{following.length > 1 ? 's' : ''}
                    </p>

                    <p className='opacity-75 text-md'>5 Group Study Rooms</p>
                    <p className='opacity-75 text-md'>{contributedMaterialsLength} Study Materials Contributes</p>


                    {(!userId || UserId === parseInt(userId, 10)) ? (
                      <div>
                        <button className='mbg-700 mcolor-100 w-full mt-3 py-2 rounded' onClick={() => {
                          setShowMainProfile(false)
                          setShowPasswordSecurity(false)
                          setShowAccountSettings(true)
                        }}>Update Profile Details</button>
                        <button className='mbg-200 mcolor-900 border-thin-800 w-full mt-3 py-2 rounded' onClick={() => {
                          setShowMainProfile(false)
                          setShowPasswordSecurity(false)
                          setShowAccountSettings(true)
                        }}>Follower and Following List</button>
                      </div>
                      ) : (
                        <div className=''>
                          <button className='mbg-700 mcolor-100 w-full mt-3 py-2 rounded' onClick={(e) => {
                            followUser(e)
                          }}>{!following ? 'Follow' : 'Following'}</button>

                          {following && (
                            <button className='mbg-200 mcolor-900 border-thin-800 w-full mt-3 py-2 rounded' onClick={(e) => {
                              unfollowUser(e)
                            }}>Unfollow</button>
                          )}
                      </div>
                    )}


                  </div>
                </div>

                {contributedMaterialsLength > 0 ? (
                  <p className='mt-8 mb-3 text-lg'>Contributed Materials</p>
                  ): (
                  <p className='mt-8 mb-3 text-lg text-center mcolor-500'>No Contributed Materials</p>
                )}

                <ul className='grid grid-cols-1 gap-5'>
                  {sharedMaterials.map((material, index) => {
                    const category = sharedMaterialsCategory[index]?.category || 'Category not available';

                    return <div key={index} className='my-3 mbg-200 border-thin-800 p-4 rounded flex items-center justify-between'>
                      <div>
                        <p className='font-medium text-lg'>Title: {material.title}</p>
                        <p className='text-sm mt-1'>Category: {category}</p>
                      </div>

                      <div className='flex items-center gap-3'>
                        <button className='mbg-100 mcolor-900 border-thin-800 px-5 py-2 rounded' onClick={() => viewStudyMaterialDetails(index, 'shared', 'not filtered', category)}>View</button>
                        <button className='mbg-700 mcolor-100 px-5 py-2 rounded' onClick={() => {
                          setShowBookmarkModal(true)
                          
                          userId !== undefined ? setChooseRoom(true) : setChooseGroupRoom(true);
                          
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
                            <Link to={'/main/library/generate-quiz'}>
                              <button className='mbg-700 mcolor-100 px-5 py-2 rounded border-thin-800'>Generate a new Study Material</button>
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
                                  <button className='mbg-100 mcolor-900 border-thin-800 px-5 py-2 rounded' onClick={() => viewStudyMaterialDetails(index, 'personal', 'not filtered', category)} >View</button>
                                  {/* <button className='mbg-700 mcolor-100 px-5 py-2 rounded' onClick={() => shareMaterial(index, 'personal')}>Share</button> */}
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
                                  <button className='mbg-100 mcolor-900 border-thin-800 px-5 py-2 rounded' onClick={() => viewStudyMaterialDetails(index, 'group', 'not filtered', category)}>View</button>
                                  {/* <button className='mbg-700 mcolor-100 px-5 py-2 rounded' onClick={() => shareMaterial(index, 'Group')}>Share</button> */}
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



              {/* user choosing to bookmark */}
              {showBookmarkModal && (
                <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                  <div className='flex items-center justify-center h-full'>
                    <div className='relative mbg-100 h-[60vh] w-1/3 z-10 relative py-5 px-5 rounded-[5px]' style={{overflowY: 'auto'}}>

                      <button className='absolute right-5 top-5 font-medium text-xl' onClick={() => {
                        setShowBookmarkModal(false)
                        setChooseGroupRoom(false)
                        setChooseRoom(false)
                        setShowCreateGroupInput(false);
                      }}>&#10006;</button>

                    {chooseRoom && userId !== undefined && (
                      <div className='flex h-full py-10'>
                        <div className='w-full'>
                          <div>
                            <p className='text-lg mb-5'>Bookmark to: </p>
                            <div className='flex flex-col gap-4'>

                              <button className='mbg-300 py-4 rounded text-md font-medium' onClick={() => bookmarkMaterial(currentSharedMaterialIndex, null, 'Personal')}>Personal Study Room</button>
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

                        {userId !== undefined && (
                          <button className='mbg-200 mcolor-900 rounded px-4 py-1 rounded border-thin-800' onClick={() => {
                            setChooseGroupRoom(false)
                            setChooseRoom(true)
                          }}>Back</button>
                        )}

                        <div className='mt-5 flex items-center justify-center'>
                          {/* back here */}

                          {showCreateGroupInput === false ? (
                            <button className={`px-4 py-2 rounded mbg-700 mcolor-100 ${userId === undefined && 'mt-5'}`} onClick={() => {
                              setShowCreateGroupInput(true)
                            }}>Create a group</button>
                          ) : (
                            <div className='flex items-center gap-3'>
                              <div className='my-3 border-thin-800 rounded'>
                                <input type="text" placeholder='Group name...' className='w-full py-2 rounded text-center' value={groupNameValue !== '' ? groupNameValue : ''} onChange={(event) => {
                                  setGroupNameValue(event.target.value)
                                }} />
                              </div>
                              <button className='px-4 py-2 rounded mbg-700 mcolor-100' onClick={createGroupBtn}>Create</button>
                              <button className='px-4 py-2 rounded mbg-100 mcolor-900 border-thin-800' onClick={() => setShowCreateGroupInput(false)}>Cancel</button>
                            </div>
                          )}

                          
                        </div>

                        {showCreateGroupInput === false && (
                          groupList.slice().sort((a, b) => b.id - a.id).map(({ id, groupName}) => (
                            <div key={id} className='shadows mcolor-900 rounded-[5px] p-5 my-6 mbg-100 flex items-center justify-between relative'>


                              <p className='px-1'>{groupName}</p>
                            <button  className='px-2 py-2 mbg-700 mcolor-100 rounded text-sm' onClick={() => bookmarkMaterial(currentSharedMaterialIndex, id, 'Group')}>Bookmark here</button>

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
                          ))
                        )}
                        
                      </div>
                    )}
                          



                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {showAccountSettings && (
            <div>
              <div className='shadows p-5 mbg-100 rounded my-5'>
                <form className='flex items-center px-8 gap-8 pt-5'>
                <div {...getRootProps()} style={{ width: '200px', cursor: 'pointer', border: '10px doubled #888' }}>
                  <input {...getInputProps()} name='image' type='file' />
                  {acceptedFiles.length === 0 ? (
                    <img src={`http://localhost:3001/images/${userData.userImage}`} className='rounded-full' style={{ width: '200px', objectFit: 'cover', height: '200px' }} alt="" />
                  ) : (
                    <>
                      <img src={URL.createObjectURL(acceptedFiles[0])} className='rounded-full' style={{ width: '200px', objectFit: 'cover', height: '200px' }} alt="" />
                    </>
                  )}
                </div>

                  <div className=''>
                    <p className='text-2xl mb-1 font-medium mcolor-800 mb-1'>Upload a new photo</p>
                    <p className='text-sm opacity-70 mb-4'>Drag and drop an image to the photo or click to select one.</p>
                    <button className='mbg-700 mcolor-100 px-10 py-2 rounded' onClick={(e) => updateUserImage(e)}>Update</button>
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
                      value={userData.studyProfTarget || 0}
                      onChange={(event) => setUserData({...userData, studyProfTarget: parseInt(event.target.value, 10) || 0})}
                      >
                      {/* Dynamic default option based on updatedStudyTarget */}
                      {userData.studyProfTarget && (
                        <option key={userData.studyProfTarget} value={userData.studyProfTarget}>
                          {userData.studyProfTarget}%
                        </option>
                      )}

                      {/* Other options */}
                      {[100, 95, 90, 85, 80, 75].map((option) => (
                        option !== userData.studyProfTarget && (
                          <option key={option} value={option}>
                            {option}%
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
                      onChange={(event) => setUserData({...userData, typeOfLearner: event.target.value})}
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
                  <button className='mbg-700 mcolor-100 py-2 px-5 rounded' onClick={updateUserInformation}>Update Information Details</button>
                </div>
              </div>
            </div>
          )}

          {showPasswordSecurity && (
            <div>
              <div className='shadows p-5 mbg-100 rounded my-5'>

                  <form className='px-8 gap-8 py-5'>
                    <p className='text-2xl mcolor-800 font-medium mb-5'>Resetting Password</p>
                    <p className='mcolor-800'>
                      Begin the password reset process by entering your email address below. Our system will quickly initiate the necessary steps to secure your account. Once submitted, a confirmation email will be sent to the provided address, containing instructions on how to efficiently reset your password.
                    </p>

                    <div className='flex items-center justify-end mt-5'>
                      <Link to={'/verify-email'} className=' py-2 px-5 mbg-700 mcolor-100 rounded'>
                        Reset Password
                      </Link>
                    </div>
                  </form>
        
              </div>
            </div>
          )}

          {showAccountDeletion && (
            <div>
              <div className='shadows p-5 mbg-100 rounded my-5'>

                <form className='px-8 gap-8 py-5'>
                  <p className='text-2xl mcolor-800 font-medium mb-5'>Account Deletion</p>
                  <p className='mcolor-800'>
                    Keep in mind that this action is irreversible and will result in the removal of all your information from our system.
                  </p>

                  <div className='flex items-center justify-end mt-5'>
                    <button
                      className='mbg-700 mcolor-100 px-8 py-2 rounded'
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
                  <div className='w-full rounded flex items-center justify-center my-5'>
                    <div className='w-1/2 border-thin-800 rounded p-5 mbg-200'>
                      <p className='text-center font-medium text-xl mt-2'>Password Confirmation</p>

                      <div className='flex relative mt-6'>
                        <input
                          autoComplete='no'
                          placeholder='Enter password...'
                          type={showPassword ? 'text' : 'password'}
                          className='w-full border-thin-800 rounded px-5 py-2'
                          value={passwordVal !== '' ? passwordVal : ''}
                          onChange={(event) => setPasswordVal(event.target.value)}
                        />
                        <button
                          type="button"
                          className='ml-2 focus:outline-none absolute right-2 bottom-2 mcolor-800'
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </button>
                      </div>


                      <button className='w-full mbg-700 mcolor-100 rounded py-2 my-4' onClick={(e) => deleteAccount(e)}>
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
                <br />
              </div>
            </div>
          )}

        </div>



    
      </div>

    </div>
  )
}
