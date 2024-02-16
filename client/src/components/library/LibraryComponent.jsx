import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../urlConfig'; 
import { fetchUserData } from '../../userAPI'; 
import { useUser } from '../../UserContext';


export const LibraryComponent = () => {


  const [groupList, setGroupList] = useState([]);

  const [personalStudyMaterials, setPersonalStudyMaterials] = useState([]);
  const [personalStudyMaterialsCategory, setPersonalStudyMaterialsCategory] = useState([]);
  const [groupStudyMaterials, setGroupStudyMaterials] = useState([]);
  const [groupStudyMaterialsCategory, setGroupStudyMaterialsCategory] = useState([]);

  const [sharedMaterials, setSharedMaterials] = useState([]);
  const [sharedMaterialsCategory, setSharedMaterialsCategory] = useState([]);
  const [sharedMaterialsCategoryUsers, setSharedMaterialsCategoryUsers] = useState([]);
  const [sharedMaterialsCategoryBookmarks, setSharedMaterialsCategoryBookmarks] = useState([]);

  const [currentMaterialTitle, setCurrentMaterialTitle] = useState('');
  const [currentMaterialCategory, setCurrentMaterialCategory] = useState('');
  const [materialMCQ, setMaterialMCQ] = useState([]);
  const [materialMCQChoices, setMaterialMCQChoices] = useState([]);
  const [materialNotes, setMaterialNotes] = useState([])

  const [currentSharedMaterialIndex, setCurrentSharedMaterialIndex] = useState(0);

  const [filteredSharedCategories, setFilteredSharedCategories] = useState([]);
  const [filteredStudyMaterialsByCategory, setFilteredStudyMaterialsByCategory] = useState([]);

  const [currentFilteredCategory, setCurrentFilteredCategory] = useState('');
  const [currentFilteredCategoryUsers, setCurrentFilteredCategoryUsers] = useState('');
  const [currentFilteredCategoryBookmarks, setCurrentFilteredCategoryBookmarks] = useState('');


  const [groupNameValue, setGroupNameValue] = useState('');

  // search
  const [searchValue, setSearchValue] = useState('');
  const [searchCategoryValue, setSearchCategoryValue] = useState('');
  const [searchedMaterials, setSearchedMaterials] = useState([]);
  const [searchedMaterialsCategories, setSearchedMaterialsCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState([]);
  const [searchCategoryUsers, setSearchCategoryUsers] = useState([]);
  const [searchCategoryBookmarks, setSearchCategoryBookmarks] = useState([]);
  const [searchCategoryMaterials, setSearchCategoryMaterials] = useState([]);
  const [searchedCategories, setSearchedCategories] = useState([]);

  // modals
  const [showModal, setShowModal] = useState(false);
  const [showPresentStudyMaterials, setShowPresentStudyMaterials] = useState(false)
  const [showMaterialDetails, setShowMaterialDetails] = useState(false)
  const [enableBackButton, setEnableBackButton] = useState(false)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [chooseRoom, setChooseRoom] = useState(false);
  const [chooseGroupRoom, setChooseGroupRoom] = useState(false);
  
  const [showCreateGroupInput, setShowCreateGroupInput] = useState(false);


  // tabs
  const [showContext, setShowContext] = useState(false);
  const [context, setContext] = useState('')
  const [showNotes, setShowNotes] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);


  const [isDone, setIsDone] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [materialIdToRemove, setMaterialIdToRemove] = useState(false);
  const [materialIdToRemoveBookmarkCounts, setMaterialIdToRemoveBookmarkCounts] = useState(false);
  const [filteredCategoryCounts, setFilteredCategoryCounts] = useState(0);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [buttonLoaderIndex, setButtonLoaderIndex] = useState(0);
  const [currentMaterial, setCurrentMaterial] = useState('');
  const [buttonClickedNumber, setButtonClickedNumber] = useState(0);
  const [loadOnce, setLoadOnce] = useState(false);
  const [btnClicked, setBtnClicked] = useState(false);

  // toggling
  const [toggledCategory, setToggledCategory] = useState('hidden');

  const { user } = useUser()
  const UserId = user?.id;


  // user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    studyProfTarget: 0,
    typeOfLearner: '',
    userImage: ''
  })

  const toggleCategory = () => {
    setToggledCategory(toggledCategory === 'hidden' ? '' : 'hidden');
  }

  const getUserData = async () => {
    const userData = await fetchUserData(UserId);
    setUserData({
      username: userData?.username,
      email: userData?.email,
      studyProfTarget: userData?.studyProfTarget,
      typeOfLearner: userData?.typeOfLearner,
      userImage: userData?.userImage
    });
  }


  const fetchData = async () => {
    try {

      
      
      if (loadOnce) {
        setLoading(true)
        setLoadOnce(false)
      }
    
      const fetchPersonalStudyMaterial = async () => {
        const personalStudyMaterial = await axios.get(`${SERVER_URL}/studyMaterial/study-material-category/Personal/${UserId}`);
        return personalStudyMaterial.data;
      };
  
      const fetchGroupStudyMaterial = async () => {
        const groupStudyMaterial = await axios.get(`${SERVER_URL}/studyMaterial/study-material-category/Group/${UserId}`);
        console.log(groupStudyMaterial.data);
        return groupStudyMaterial.data;
      };
  
      const fetchSharedStudyMaterial = async () => {
        const sharedStudyMaterial = await axios.get(`${SERVER_URL}/studyMaterial/shared-materials`);
        return sharedStudyMaterial.data;
      };
  
      const fetchSharedMaterialCategory = async () => {
        const sharedStudyMaterialResponse = await fetchSharedStudyMaterial();
  
        const fetchedSharedStudyMaterialCategory = await Promise.all(
          sharedStudyMaterialResponse.map(async (material, index) => {
            const materialCategorySharedResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/shared-material-category/${material.StudyMaterialsCategoryId}/Group/${UserId}`);
            return materialCategorySharedResponse.data;
          })
        );
  
        setSharedMaterialsCategory(fetchedSharedStudyMaterialCategory);
  
        const uniqueCategories = [...new Set(fetchedSharedStudyMaterialCategory.map(item => item.category))];
        const sortedCategories = uniqueCategories.sort((a, b) => a.localeCompare(b));
  
        const promiseArray = sortedCategories.map(async (category) => {
          const firstOccurrence = fetchedSharedStudyMaterialCategory.find(item => item.category === category);
          await new Promise(resolve => setTimeout(resolve, 100));
  
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
  
        const sortedCategoryObjects = await Promise.all(promiseArray);
        setFilteredSharedCategories(sortedCategoryObjects);
      };
  
      const fetchSharedMaterialDetails = async () => {
        const sharedStudyMaterialResponse = await fetchSharedStudyMaterial();
  
        const sortedDataUsers = await Promise.all(
          sharedStudyMaterialResponse.map(async (user) => {
            const response = await axios.get(`${SERVER_URL}/users/get-user/${user.UserId}`);
            return response.data;
          })
        );
        setSharedMaterialsCategoryUsers(sortedDataUsers);
  
        const sortedDataBookmarksCounts = await Promise.all(
          sharedStudyMaterialResponse.map(async (user) => {
            const response = await axios.get(`${SERVER_URL}/studyMaterial/bookmark-counts/${user.code}`);
            return response.data;
          })
        );
        setSharedMaterialsCategoryBookmarks(sortedDataBookmarksCounts);
  
        setSharedMaterials(sharedStudyMaterialResponse);
      };
  
      const fetchGroups = async () => {
        const response = await axios.get(`${SERVER_URL}/studyGroup/extract-group-through-user/${UserId}`);
        setGroupList(response.data);
  
        if (response.data.length === 0) {
          const userMemberGroupList = await axios.get(`${SERVER_URL}/studyGroupMembers/get-materialId/${UserId}`);
  
          const materialPromises = userMemberGroupList.data.map(async (item) => {
            const material = await axios.get(`${SERVER_URL}/studyGroup/extract-all-group/${item.StudyGroupId}`);
            return material.data;
          });
  
          const materials = await Promise.all(materialPromises);
          setGroupList(materials);
        }
      };
  
      const [personalStudyMaterial, groupStudyMaterial] = await Promise.all([
        fetchPersonalStudyMaterial(),
        fetchGroupStudyMaterial()
      ]);
  
      const filteredPersonalStudyMaterials = personalStudyMaterial.filter(item => item.tag === 'Own Record');
      setPersonalStudyMaterials(filteredPersonalStudyMaterials);
  
      const fetchedPersonalStudyMaterialCategory = await Promise.all(
        personalStudyMaterial.map(async (material, index) => {
          const materialCategoryResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
          return materialCategoryResponse.data;
        })
      );
      setPersonalStudyMaterialsCategory(fetchedPersonalStudyMaterialCategory);
  
      const filteredGroupStudyMaterials = groupStudyMaterial.filter(item => item.tag === 'Own Record');
      setGroupStudyMaterials(filteredGroupStudyMaterials);
  
      const fetchedGroupStudyMaterialCategory = await Promise.all(
        filteredGroupStudyMaterials.map(async (material, index) => {
          const materialCategoryResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
          return materialCategoryResponse.data;
        })
      );
      setGroupStudyMaterialsCategory(fetchedGroupStudyMaterialCategory);
  
      await Promise.all([
        fetchSharedMaterialCategory(),
        fetchSharedMaterialDetails(),
        fetchGroups()
      ]);
  
      setLoading(false);
      setBtnClicked(false)
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setBtnClicked(false)
    }
  };    

  const viewStudyMaterialDetails = async (index, materialFor, filter, category) => {
    setButtonLoader(true);
    setButtonLoaderIndex(index)
    setShowPresentStudyMaterials(false);
  
    let materialData, mcqResponse, materialId, choicesUrl;
  
    if (filter === 'filtered') {
      materialData = filteredStudyMaterialsByCategory[index];
    } else if (filter === 'searched') {
      materialData = searchedMaterials[index];
    } else if (filter === 'category') {
      materialData = searchCategoryMaterials[index];
    } else {
      materialData =
        materialFor === 'personal'
          ? personalStudyMaterials[index]
          : materialFor === 'group'
          ? groupStudyMaterials[index]
          : sharedMaterials[index];
    }
  
    setCurrentMaterialTitle(materialData.title);
    setCurrentMaterialCategory(category);
  
    try {
      materialId = materialData.id;
      const baseUrl = `${SERVER_URL}/quesAns/study-material-mcq/${materialId}`;
  
      mcqResponse = await axios.get(baseUrl);
      setContext(materialData.body);
      setMaterialMCQ(mcqResponse.data);
  
      if (Array.isArray(mcqResponse.data)) {
        choicesUrl = `${SERVER_URL}/quesAnsChoices/study-material/${materialId}`;
        const materialChoices = mcqResponse.data.map(async (materialChoice) => {
          try {
            const choiceResponse = await axios.get(`${choicesUrl}/${materialChoice.id}`);
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
      const revResponse = await axios.get(`${SERVER_URL}/quesRev/study-material-rev/${materialId}`);
      setMaterialNotes(revResponse.data);
    } catch (error) {
      console.error('Error fetching study material by ID:', error);
    }
  
    if (materialFor !== 'shared') {
      setShowQuiz(false);
      setShowNotes(false);
      setShowContext(true);
      setEnableBackButton(true);
    } else {
      setShowModal(true);
      setShowContext(true);
      setEnableBackButton(false);
    }
  
    setShowMaterialDetails(true);
    setButtonLoader(false);
    setButtonLoaderIndex(0)
  };
  
  const shareMaterial = async (index, materialFor, materialTitle) => {
    setBtnClicked(true)
    setButtonLoaderIndex(index)
    setCurrentMaterial(materialTitle)
    try {
      let materialArray, materialId, categoryData;
  
      if (materialFor === 'personal') {
        materialArray = personalStudyMaterials;
      } else if (materialFor === 'group') {
        materialArray = groupStudyMaterials;
      }
  
      if (materialArray && materialArray.length > index) {
        materialId = materialArray[index].id;
  
        await axios.put(`${SERVER_URL}/studyMaterial/update-tag/${materialId}`, { tag: 'Shared' });
  
        categoryData = {
          isShared: true,
        };
  
        const studyMaterialResponse = await axios.put(
          `${SERVER_URL}/studyMaterialCategory/update-shared/${materialArray[index].StudyMaterialsCategoryId}`,
          categoryData
        );
  
        if (currentMaterialCategory !== '') {
          // Fetch the newly shared material
          const newSharedMaterial = await axios.get(`${SERVER_URL}/studyMaterial/get-material/${studyMaterialResponse.data.id}`);
  
          // Update the state with the new material added to the beginning of the array
          setFilteredStudyMaterialsByCategory(prevMaterials => [newSharedMaterial.data, ...prevMaterials]);
        }
      } else {
        console.error(`Material at index ${index} is undefined or out of bounds.`);
      }
  
    } catch (error) {
      fetchData();
      console.error('Error sharing material:', error);
    }
    fetchData();
    setBtnClicked(false)
    setButtonLoaderIndex(0)
  };
  
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

  const bookmarkMaterial = async (index, id, materialFor, buttonclickedNum) => {

    setBtnClicked(true)



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
      setBtnClicked(false)
      setButtonLoading(true)
      setButtonClickedNumber(buttonclickedNum)
  
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
     setBtnClicked(false)
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
      setBtnClicked(false)
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
         setBtnClicked(false)
         setButtonLoading(false)
         setButtonClickedNumber(0)
       }
     }
     

   }

  const filterMaterial = async (categoryTitle) => {
    try {
      const filteredCategory = sharedMaterialsCategory.filter(category => category.category === categoryTitle);
  
      const uniqueIds = new Set();
      const filteredUniqueCategory = filteredCategory.filter(category => {
        // Check if the id is already in the Set
        if (!uniqueIds.has(category.id)) {
          // If not, add the id to the Set and keep this entry
          uniqueIds.add(category.id);
          return true;
        }
        // If the id is already in the Set, filter out this entry
        return false;
      });
  
      const matchingMaterials = sharedMaterials.filter(material =>
        filteredUniqueCategory.some(categoryItem => categoryItem.id === material.StudyMaterialsCategoryId)
      );
  
      setFilteredStudyMaterialsByCategory(matchingMaterials);
  
      const userIdPromises = matchingMaterials.map(async (user) => {
        const response = await axios.get(`${SERVER_URL}/users/get-user/${user.UserId}`);
        return response.data;
      });
  
      const bookmarksCountPromises = matchingMaterials.map(async (user) => {
        const response = await axios.get(`${SERVER_URL}/studyMaterial/bookmark-counts/${user.code}`);
        return response.data;
      });
  
      // Use Promise.all to execute asynchronous operations concurrently
      const [sortedDataUsers, sortedDataBookmarksCounts] = await Promise.all([
        Promise.all(userIdPromises),
        Promise.all(bookmarksCountPromises)
      ]);
  
      setCurrentFilteredCategoryUsers(sortedDataUsers);
      setCurrentFilteredCategoryBookmarks(sortedDataBookmarksCounts);
      setCurrentFilteredCategory(categoryTitle);
    } catch (error) {
      console.error('Error filtering material:', error);
    }
  };

  const handleSearchChange = async (value) => {
    try {
      // Convert the input value to lowercase
      const lowercaseValue = value.toLowerCase();
  
      // Filter shared materials based on case-insensitive title or body comparison
      const filteredMaterials = sharedMaterials.filter(material => {
        const lowercaseTitle = material?.title.toLowerCase();
        const lowercaseBody = material.body.toLowerCase();
        return lowercaseTitle.includes(lowercaseValue) || lowercaseBody.includes(lowercaseValue);
      });
  
      // Filter shared categories based on case-insensitive category comparison
      const filteredCategories = filteredSharedCategories.filter(category => {
        const lowercaseCategory = category.category.toLowerCase();
        return lowercaseCategory.includes(lowercaseValue);
      });
  
      // Remove duplicate StudyMaterialsCategoryId entries
      const uniqueIds = new Set();
      const filteredUniqueCategory = filteredMaterials.filter(category => {
        if (!uniqueIds.has(category.id)) {
          uniqueIds.add(category.id);
          return true;
        }
        return false;
      });
  
      const matchingMaterials = filteredUniqueCategory.filter(biologyItem =>
        sharedMaterials.some(material => biologyItem.id === material.StudyMaterialsCategoryId)
      );
  
      // Use Promise.all with map for asynchronous operations
      const [fetchedSharedStudyMaterialCategory, fetchedSearchCategoryMaterials] = await Promise.all([
        Promise.all(filteredMaterials.map(async material => {
          const materialCategorySharedResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/shared-material-category/${material.StudyMaterialsCategoryId}/Group/${UserId}`);
          return materialCategorySharedResponse.data;
        })),
        Promise.all(filteredCategories.map(async material => {
          const sharedStudyMaterial = await axios.get(`${SERVER_URL}/studyMaterial/shared-materials/${material.id}`);
          return sharedStudyMaterial.data;
        }))
      ]);
  
      setSearchedMaterials(filteredUniqueCategory);
      setSearchCategory(fetchedSharedStudyMaterialCategory);
  
      // Use Promise.all with map for asynchronous operations
      const sortedDataBookmarksCounts = await Promise.all(
        matchingMaterials.map(async user => {
          const response = await axios.get(`${SERVER_URL}/studyMaterial/bookmark-counts/${user.code}`);
          return response.data;
        })
      );
  
      setSearchCategoryBookmarks(sortedDataBookmarksCounts);
  
      // Use Promise.all with map for asynchronous operations
      const sortedDataUsers = await Promise.all(
        fetchedSharedStudyMaterialCategory.map(async user => {
          const response = await axios.get(`${SERVER_URL}/users/get-user/${user.UserId}`);
          return response.data;
        })
      );
  
      setSearchCategoryUsers(sortedDataUsers);
  
      setSearchedMaterialsCategories(filteredCategories);
      setSearchCategoryMaterials(fetchedSearchCategoryMaterials.flat());
    } catch (error) {
      console.error('Error handling search change:', error);
    }
  };

  const handleCategorySearch = async (value) => {
    const lowercaseValue = value.toLowerCase();
  
    const filteredCategories = filteredSharedCategories.filter(category =>
      category.category.toLowerCase().includes(lowercaseValue)
    );
  
    setSearchedCategories(filteredCategories);
  };
  
  const createGroupBtn = async () => {
    try {
      if (groupNameValue.trim() !== '') {
        const groupData = {
          groupName: groupNameValue.trim(),
          role: 'Super Admin',
          code: generateRandomString(),
          UserId: UserId,
        };
  
        await axios.post(`${SERVER_URL}/studyGroup/create-group`, groupData);
  
        fetchData();
        setShowCreateGroupInput(false);
      } else {
        alert('Cannot save an empty field.');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  }; 

  const removeFromLibraryOnly = async () => {
    setBtnClicked(true)
    setCurrentMaterial('Removing')
    try {
      const data = {
        tag: 'Own Record'
      };
  
      await axios.put(`${SERVER_URL}/studyMaterial/update-tag/${materialIdToRemove}`, data);
  
      const materialIndexToRemove = filteredStudyMaterialsByCategory.findIndex(material => material.id === materialIdToRemove);
  
      if (materialIndexToRemove !== -1) {
        const updatedFilteredStudyMaterials = [
          ...filteredStudyMaterialsByCategory.slice(0, materialIndexToRemove),
          ...filteredStudyMaterialsByCategory.slice(materialIndexToRemove + 1)
        ];
    
        setFilteredStudyMaterialsByCategory(updatedFilteredStudyMaterials);
      } else {
        console.error(`Material with ID ${materialIdToRemove} not found in filteredStudyMaterialsByCategory.`);
      }
  
      fetchData();
      setDeleteModal(false);
    } catch (error) {
      console.error('Error removing from library:', error);
    }

    fetchData()
  };
  
  const deleteInAllRecords = async () => {
    setBtnClicked(true)
    setCurrentMaterial('Deleting')
    try {
      await axios.delete(`${SERVER_URL}/studyMaterial/delete-material/${materialIdToRemove}`);
  
      const updatedFilteredStudyMaterials = filteredStudyMaterialsByCategory.filter(material => material.id !== materialIdToRemove);
  
      setFilteredStudyMaterialsByCategory(updatedFilteredStudyMaterials);
      fetchData();
      setDeleteModal(false);
    } catch (error) {
      console.error('Error deleting in all records:', error);
    }
    fetchData()
    setBtnClicked(false)
  };
  



  return {
    viewStudyMaterialDetails,
    shareMaterial,
    generateRandomString,
    bookmarkMaterial,
    filterMaterial,
    handleSearchChange,
    handleCategorySearch,
    createGroupBtn,
    removeFromLibraryOnly,
    deleteInAllRecords,
    fetchData,
    getUserData,
    toggleCategory,
    groupList,
    setGroupList,
    personalStudyMaterials,
    setPersonalStudyMaterials,
    personalStudyMaterialsCategory,
    setPersonalStudyMaterialsCategory,
    groupStudyMaterials,
    setGroupStudyMaterials,
    groupStudyMaterialsCategory,
    setGroupStudyMaterialsCategory,
    sharedMaterials,
    setSharedMaterials,
    sharedMaterialsCategory,
    setSharedMaterialsCategory,
    sharedMaterialsCategoryUsers,
    setSharedMaterialsCategoryUsers,
    sharedMaterialsCategoryBookmarks,
    setSharedMaterialsCategoryBookmarks,
    currentMaterialTitle,
    setCurrentMaterialTitle,
    currentMaterialCategory,
    setCurrentMaterialCategory,
    materialMCQ,
    setMaterialMCQ,
    materialMCQChoices,
    setMaterialMCQChoices,
    materialNotes,
    setMaterialNotes,
    currentSharedMaterialIndex,
    setCurrentSharedMaterialIndex,
    filteredSharedCategories,
    setFilteredSharedCategories,
    filteredStudyMaterialsByCategory,
    setFilteredStudyMaterialsByCategory,
    currentFilteredCategory,
    setCurrentFilteredCategory,
    currentFilteredCategoryUsers,
    setCurrentFilteredCategoryUsers,
    currentFilteredCategoryBookmarks,
    setCurrentFilteredCategoryBookmarks,
    groupNameValue,
    setGroupNameValue,
    searchValue,
    setSearchValue,
    searchCategoryValue,
    setSearchCategoryValue,
    searchedMaterials,
    setSearchedMaterials,
    searchedMaterialsCategories,
    setSearchedMaterialsCategories,
    searchCategory,
    setSearchCategory,
    searchCategoryUsers,
    setSearchCategoryUsers,
    searchCategoryBookmarks,
    setSearchCategoryBookmarks,
    searchCategoryMaterials,
    setSearchCategoryMaterials,
    searchedCategories,
    setSearchedCategories,
    showModal,
    setShowModal,
    showPresentStudyMaterials,
    setShowPresentStudyMaterials,
    showMaterialDetails,
    setShowMaterialDetails,
    enableBackButton,
    setEnableBackButton,
    showBookmarkModal,
    setShowBookmarkModal,
    chooseRoom,
    setChooseRoom,
    chooseGroupRoom,
    setChooseGroupRoom,
    showCreateGroupInput,
    setShowCreateGroupInput,
    showContext,
    setShowContext,
    context,
    setContext,
    showNotes,
    setShowNotes,
    showQuiz,
    setShowQuiz,
    isDone,
    setIsDone,
    deleteModal,
    setDeleteModal,
    materialIdToRemove,
    setMaterialIdToRemove,
    materialIdToRemoveBookmarkCounts,
    setMaterialIdToRemoveBookmarkCounts,
    filteredCategoryCounts,
    setFilteredCategoryCounts,
    msg,
    setMsg,
    error,
    setError,
    loading,
    setLoading,
    buttonLoading,
    setButtonLoading,
    buttonLoader,
    setButtonLoader,
    buttonLoaderIndex,
    setButtonLoaderIndex,
    currentMaterial,
    setCurrentMaterial,
    buttonClickedNumber,
    setButtonClickedNumber,
    loadOnce,
    setLoadOnce,
    btnClicked,
    setBtnClicked,
    toggledCategory,
    setToggledCategory,
    user,
    UserId,
    userData,
    setUserData,
  };
}
