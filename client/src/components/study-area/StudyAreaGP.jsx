import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navbar } from '../navbar/logged_navbar/navbar';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { SearchFunctionality } from '../search/SearchFunctionality';
import { SERVER_URL } from '../../urlConfig';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

import { Sidebar } from '../sidebar/Sidebar';


import { useUser } from '../../UserContext';
import { fetchUserData } from '../../userAPI';

export const StudyAreaGP = (props) => {
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { id } = useParams();
  const groupNameId = id;


  const { user } = useUser();

  const UserId = user?.id;

  // user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    studyProfTarget: 0,
    typeOfLearner: '',
    userImage: ''
  })
  

  const getUserData = async () => {
    const userData = await fetchUserData(UserId);
    setUserData({
      username: userData.username,
      email: userData.email,
      studyProfTarget: userData.studyProfTarget,
      typeOfLearner: userData.typeOfLearner,
      userImage: userData.userImage
    });
  }



  const { categoryFor } = props;
  const categoryForToLower = categoryFor.toLowerCase();

  const [showLesson, setShowLesson] = useState(true);
  const [, setShowMCQAs] = useState(false);
  const [showRev, setShowRev] = useState(false);
  const [activeButton, setActiveButton] = useState(1);
  const [studyMaterialsCategory, setSudyMaterialsCategory] = useState([]);
  const [lastMaterial, setLastMaterial] = useState(null);
  const [, setMaterialMCQ] = useState({});
  const [materialRev, setMaterialRev] = useState({});
  const [materialMCQChoices, setMaterialMCQChoices] = useState([]);
  const [materialCategory, setMaterialCategory] = useState('');
  const [materialCategories, setMaterialCategories] = useState([]); 
  const [hidden, setHidden] = useState("hidden");
  const [currentModalVal, setCurrentModalVal] = useState("");
  const [modalList, setModalList] = useState([]);
  const [categoryModal, setCategoryModal] = useState("hidden")
  const [groupMemberModal, setGroupMemberModal] = useState("hidden")
  const [code, setCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [userHost, setUserHost] = useState("");
  const [userHostId, setUserHostId] = useState("");
  const [isCodeCopied, setIsCodeCopied] = useState("");
  const [isGroupNameChanged, setIsGroupNameChanged] = useState("");
  const [prevGroupName, setPrevGroupName] = useState("");
  const [savedGroupNotif, setSavedGroupNotif] = useState('hidden');
  const [userList, setUserList] = useState([]);
  const [tempUserList, setTempUserList] = useState([]);
  const [groupMemberIndex, setGroupMemberIndex] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarkExpanded, setIsBookmarkExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({}); 
  const [expandedSharedCategories, setExpandedSharedCategories] = useState({}); 
  const [data, setData] = useState([]);
  const [listedData, setListedData] = useState([]);
  const [searchTermApp, setSearchTermApp] = useState('');
  const [selectedDataId, setSelectedDataId] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);
  const [isDone, setIsDone] = useState(false);



  // shared materials usestates
  const [sharedMaterials, setSharedMaterials] = useState([]);
  const [sharedMaterialsCategoriesOrig, setSharedMaterialsCategoriesOrig] = useState([]);
  const [sharedMaterialsCategories, setSharedMaterialsCategories] = useState([]);
  const [sharedMaterialsCategoriesEach, setSharedMaterialsCategoriesEach] = useState([])

  // deleting material
  const [recentlyDeletedMaterial, setRecentlyDeletedMaterial] = useState('');
  const [isMaterialDeleted, setIsMaterialDeleted] = useState('hidden');

  // editing category
  const [currentCategoryIdToEdit, setCurrentCategoryIdToEdit] = useState(0);
  const [currentCategoryToEdit, setCurrentCategoryToEdit] = useState(0);
  const [editCategoryModal, setEditCategoryModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };  

  const toggleBookmarksExpand = () => {
    setIsBookmarkExpanded(!isBookmarkExpanded);
  };  

  const addToModalList = async () => {
    if (currentModalVal !== '') {

      const onholdModalList = modalList.filter(value => value.trim().toLowerCase() === currentModalVal.trim().toLowerCase());


      if (onholdModalList.length > 0) {
        alert(`${currentModalVal} is already in the list.`);
      } else {
        let categoryExists = '';
        
        try {
          if (categoryFor === 'Personal') {
            categoryExists = await axios.get(`${SERVER_URL}/studyMaterialCategory/get-category-value/${UserId}/${currentModalVal}`);
          } else {
            categoryExists = await axios.get(`${SERVER_URL}/studyMaterialCategory/get-category-value-group/${groupNameId}/${currentModalVal}`);
          }
  
          console.log(categoryExists.data);
    
          // Check if categoryExists.data is truthy before accessing its length
          if (categoryExists.data === null) {
            setModalList([...modalList, currentModalVal]);
            setCurrentModalVal('');
          } else {
            alert(`${currentModalVal} already exists in your shelf.`);
          }
        } catch (error) {
          console.error('Error checking category existence:', error);
          // Handle error, e.g., show an alert or log it
        }
      }

    } else {
      alert('Does not accept an empty field.');
    }
  };
  
  const displayError = (message, duration = 2500) => {
    setError(true);
    setMsg(message);
    setTimeout(() => {
      setError(false);
      setMsg('');
    }, duration);
  };
  
  const saveCategories = async () => {
    try {
      if (modalList.length > 0) {
        // Use Promise.all to wait for all axios.post calls to complete
        await Promise.all(modalList.map(async (item, index) => {
          const categoryData = {
            category: item,
            categoryFor: categoryFor,
            StudyGroupId: groupNameId,
            UserId: UserId,
          };
  
          try {
            // Use await to wait for the axios.post call to complete
            const response = await axios.post(`${SERVER_URL}/studyMaterialCategory/`, categoryData);
  
            if (response.data.error) {
              displayError(response.data.message);
            } else {
              displayError(response.data.message, 100);
              setHidden("hidden");
              setCategoryModal("hidden");
              setGroupMemberModal("hidden");
            }
          } catch (error) {
            // Handle specific error or log it
            console.error("Error saving category:", error);
            displayError("Failed to save category. Please try again.");
          }
        }));
        
        fetchData();

        setCurrentModalVal('')
        setModalList([])
      } else {
        displayError("Cannot save empty field.");
      }
    } catch (error) {
      // Handle general error if needed
      console.error("Error saving categories:", error);
    }


  };
  

  const copyGroupCode = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setTimeout(() => {
          setIsCodeCopied("Copied to clipboard")
        }, 100);
        setTimeout(() => {
          setIsCodeCopied("")
        }, 2000);
      })
      .catch(err => {
        // Error handling
        console.error('Failed to copy text: ', err);
      });
  };

  const changeGroupName = () => {
    if (groupName.trim() !== '') {
      if(groupName !== prevGroupName) {
        const updateGroupName = async () => {
          let groupId = groupNameId;
          try {
            const response = await axios.put(`${SERVER_URL}/studyGroup/update-group/${groupId}`, {
              groupName: groupName,
            });
            setGroupName(response.data.groupName); 
            setPrevGroupName(response.data.groupName);
            

  
            setTimeout(() => {
              setIsGroupNameChanged(`Group name is changed to ${response.data.groupName}`);
            }, 500);
            
            setTimeout(() => {
              setIsGroupNameChanged('');
            }, 1800);
            
          } catch (error) {
            console.error('Error updating group name:', error);
            // Handle error if needed
          }
        };
        updateGroupName();
      } else {
        setTimeout(() => {
          setIsGroupNameChanged(`The group name remains unchanged. Cannot apply any changes.`);
        }, 500);
        
        setTimeout(() => {
          setIsGroupNameChanged('');
        }, 5000);
      }
    } else {
      alert('Cannot save an empty group name.');
    }
  };

  const removeSelectedUser = async (itemId, groupNameId) => {
    const updatedTempUserList = tempUserList.filter(user => user.id !== itemId);

    const updatedUserList = userList.filter(user => user.id !== itemId);  
    setTempUserList(updatedTempUserList);
    setUserList(updatedUserList);

    await axios.delete(`${SERVER_URL}/studyGroupMembers/remove-member/${groupNameId}/${itemId}`).then(response => {
      // console.log(response.data); 
    }).catch(error => {
      console.error(error);
    });

    fetchGroupMemberList()
  };



  const fetchFollowerData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/users`);
      let responseData = response.data;

      let filteredUsers = responseData.filter(user => user.id !== UserId);
  
  
      // Create an array to store all the Axios requests
      const axiosRequests = filteredUsers.map(async (item) =>
        await axios.get(`${SERVER_URL}/users/get-user/${item.id}`)
      );



      Promise.all(axiosRequests)
        .then((responses) => {
          const names = responses.map((response) => response.data);
          const uniqueNames = Array.from(new Set(names));
          setData(uniqueNames);
          setListedData(uniqueNames);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });

    } catch (error) {
      console.error('Error fetching follower list:', error);
    }
  };



  const fetchGroupMemberList = async () => {
    const userResponse = await axios.get(`${SERVER_URL}/studyGroupMembers/get-members/${groupNameId}`);
    setGroupMemberIndex(userResponse.data);

    const userListResponse = userResponse.data;
    const allUserResponses = [];

    for (const user of userListResponse) {
      try {
        const userDetails = await axios.get(`${SERVER_URL}/users/get-user/${user.UserId}`);
        allUserResponses.push(userDetails.data);

        if (allUserResponses.length === userListResponse.length) {
          setUserList(allUserResponses);
          setTempUserList(allUserResponses);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  }




  const handleSearch = (searchTerm) => {
    setSearchTermApp(searchTerm); 
  };


  const fetchData = async () => {
    const reloadParamExists = searchParams.has('reload');

    if (reloadParamExists) {
      if (categoryFor === 'Personal') {
        navigate(`/main/personal/study-area/`);
      } else {
        navigate(`/main/group/study-area/${id}`);
      }
    }

    let studyMaterialCategoryLink = '';
    let studyMaterialLink = '';

    if (categoryFor === 'Personal') {
      studyMaterialCategoryLink = `${SERVER_URL}/studyMaterialCategory/personal-study-material/${categoryFor}/${UserId}`;
      studyMaterialLink = `${SERVER_URL}/studyMaterial/study-material-category/${categoryFor}/${UserId}`;
    } else {
      studyMaterialCategoryLink = `${SERVER_URL}/studyMaterialCategory/${categoryFor}/${groupNameId}`;
      studyMaterialLink = `${SERVER_URL}/studyMaterial/study-material-group-category/${categoryFor}/${groupNameId}`;
    }

    if (categoryFor === 'Group') {
      try {
        const groupResponse = await axios.get(`${SERVER_URL}/studyGroup/extract-all-group/${groupNameId}`);
        setCode(groupResponse.data.code);
        setGroupName(groupResponse.data.groupName);
        setPrevGroupName(groupResponse.data.groupName);

        console.log(groupResponse.data.UserId);

        const userHostResponse = await axios.get(`${SERVER_URL}/users/get-user/${groupResponse.data.UserId}`);

        setUserHost(userHostResponse.data.username)
        setUserHostId(userHostResponse.data.id)

        fetchGroupMemberList()
        fetchFollowerData()

      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    }

    try {
      const catPersonalResponse = await axios.get(studyMaterialCategoryLink);
      setMaterialCategories(catPersonalResponse.data);


      const groupResponse = await axios.get(studyMaterialLink);
      let sortedData = groupResponse.data.sort((a, b) => b.id - a.id);

      let ownOrSharedRecords = sortedData.filter(tag => tag.tag !== 'Bookmarked');
      let bookmarkedStudyMaterials = groupResponse.data.filter(tag => tag.tag === 'Bookmarked');


      
      
      setSharedMaterials(bookmarkedStudyMaterials);




      const fetchedSharedStudyMaterialCategory = await Promise.all(
        bookmarkedStudyMaterials.map(async (material, index) => {
          const materialCategoryResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
          return materialCategoryResponse.data; // Return the data from each promise
        })
      );

      setSharedMaterialsCategoriesOrig(fetchedSharedStudyMaterialCategory)
      
      // Use a custom filter to remove objects with duplicate id values
      const uniqueCategories = fetchedSharedStudyMaterialCategory.filter(
        (category, index, self) =>
          index ===
          self.findIndex(
            (t) => t.id === category.id
          )
      );
      
      setSharedMaterialsCategories(uniqueCategories);
      setSharedMaterialsCategoriesEach(fetchedSharedStudyMaterialCategory);
      



      setSudyMaterialsCategory(ownOrSharedRecords);

      const lastMaterial = ownOrSharedRecords.length > 0 ? ownOrSharedRecords[0] : null;
      setLastMaterial(lastMaterial);






      if (lastMaterial && lastMaterial.StudyMaterialsCategoryId && categoryFor) {
        let studyLastMaterialLink;

        if (categoryFor === 'Personal') {
          studyLastMaterialLink = `${SERVER_URL}/studyMaterialCategory/get-categoryy/${lastMaterial.StudyMaterialsCategoryId}`;
        } else {
          studyLastMaterialLink = `${SERVER_URL}/studyMaterialCategory/get-categoryy/${lastMaterial.StudyMaterialsCategoryId}`;
        }

        try {
          const lastMaterialResponse = await axios.get(studyLastMaterialLink);

          if (lastMaterialResponse.data && lastMaterialResponse.data.category) {
            setMaterialCategory(lastMaterialResponse.data.category);
          } else {
            console.log('Category not found in the response data');
          }
        } catch (error) {
          console.error('Error fetching last material data:', error);
        }
      }

      if (lastMaterial) {
        try {
          const mcqResponse = await axios.get(`${SERVER_URL}/quesAns/study-material-mcq/${lastMaterial.id}`);
          setMaterialMCQ(mcqResponse.data);

          if (Array.isArray(mcqResponse.data)) {
            const materialChoices = mcqResponse.data.map(async (materialChoice) => {
              try {
                const choiceResponse = await axios.get(`${SERVER_URL}/quesAnsChoices/study-material/${lastMaterial.id}/${materialChoice.id}`);
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
          const revResponse = await axios.get(`${SERVER_URL}/quesRev/study-material-rev/${lastMaterial.id}`);
          setMaterialRev(revResponse.data);
        } catch (error) {
          console.error('Error fetching study material by ID:', error);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }

    const initialExpandedState = {};
    materialCategories.forEach((category) => {
      initialExpandedState[category.id] = true;
    });
    setExpandedCategories(initialExpandedState);


    const initialSharedExpandedState = {};
    sharedMaterialsCategories.forEach((category) => {
      initialSharedExpandedState[category.id] = true; // Update to use the id
    });
    setExpandedSharedCategories(initialSharedExpandedState);
    
    setLoading(false)
  };

  
  useEffect(() => {

    
    if (!isDone) {
      setIsDone(true)
    }
  
  }, [UserId]);

  useEffect(() => {
    if (isDone) {
      fetchData();
      getUserData()
      setIsDone(false)
    }
  }, [isDone])

  

  
  const choicesById = {};

  materialMCQChoices.forEach((choice) => {
    if (!choicesById[choice.QuesAnId]) {
      choicesById[choice.QuesAnId] = [];
    }
    choicesById[choice.QuesAnId].push(choice.choice);
  });

  const showContent = (contentNumber) => {
    setActiveButton(contentNumber);
    // Hide all divs first
    setShowLesson(false);
    setShowMCQAs(false);
    setShowRev(false);

    // Show the selected div
    if (contentNumber === 1) {
      setShowLesson(true);
    } else if (contentNumber === 2) {
      setShowMCQAs(true);
    } else if (contentNumber === 3) {
      setShowRev(true);
    }
  };

  const toggleExpandId = (categoryId) => {
    setExpandedCategories((prevExpandedCategories) => ({
      ...prevExpandedCategories,
      [categoryId]: !prevExpandedCategories[categoryId], // Toggle the state
    }));
  };

  const toggleSharedExpandId = (categoryId) => {
    setExpandedSharedCategories((prevExpandedCategories) => ({
      ...prevExpandedCategories,
      [categoryId]: !prevExpandedCategories[categoryId], // Toggle the state
    }));
  };


  const deleteStudyMaterial = async (id, title, code, tag) => {
    // Show a confirmation dialog
    
    
    let response = await axios.get(`${SERVER_URL}/studyMaterial/bookmark-counts/${code}`);
    console.log(response.data.length)

    if (response.data.length === 0 || tag === 'Bookmarked') {
      const confirmed = window.confirm(`Are you sure you want to delete ${title}?`);

      if (confirmed) {
        await axios.delete(`${SERVER_URL}/studyMaterial/delete-material/${id}`).then(() => {
          const updatedMaterials = studyMaterialsCategory.filter((material) => material.id !== id);  
          setSudyMaterialsCategory(updatedMaterials);
          }
        );
  
  
        setTimeout(() => {
          setIsMaterialDeleted('')
          setRecentlyDeletedMaterial(title)
        }, 100);
  
        setTimeout(() => {
          setIsMaterialDeleted('hidden')
          setRecentlyDeletedMaterial('')
  
          fetchData()
        }, 1500);
      }
    } else {
      alert(`Cannot be deleted. This study material is shared in the virtual library room.`);
    }

  }


  const addToChosenData = async () => {

    console.log(groupMemberIndex);
    console.log(selectedDataId);
    
    const isUserInGroup = groupMemberIndex.some(member => member.UserId === selectedDataId);
    
    if (selectedDataId !== '') {
      if (isUserInGroup || isUserInGroup === selectedDataId) {
        // User is in the group, handle accordingly
        alert('This user is already in this group.')
      } else {

        const groupMemberData = {
          role: 'Member',
          StudyGroupId: groupNameId,
          UserId: selectedDataId,
        };

        await axios.post(`${SERVER_URL}/studyGroupMembers/add-member`, groupMemberData);
        setSearchTermApp('')
        fetchGroupMemberList()
      } 
    } else {
      alert(`No ${searchTermApp} username found`);
    }
    
  }


  const deleteGroup = async (e) => {
    e.preventDefault();

    console.log(groupNameId);

    await axios.delete(`${SERVER_URL}/studyGroup/delete-group/${groupNameId}`).then((response) => {

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
          setHidden("hidden");
          setCategoryModal("hidden");
          setGroupMemberModal("hidden");
          setError(false)
          setMsg(response.data.message)
        }, 100);
        
        setTimeout(() => {
          setMsg('')
          navigate('/main/group')
        }, 2500);
      }
    })

  }

  const leaveGroup = async (e) => {
    e.preventDefault();

    console.log(groupNameId);

    await axios.delete(`${SERVER_URL}/studyGroupMembers/remove-member/${groupNameId}/${UserId}`).then((response) => {

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
          setGroupMemberModal('hidden')
          setError(false)
          setMsg(response.data.message)
        }, 100);

        setTimeout(() => {
          setMsg('')
          navigate(`/main/group`)
        }, 2500);
      }
    })

  }


  const editCategory = async () => {
    try {
      // Ask for confirmation
      let data = {
        category: currentCategoryToEdit
      }
  
      const response = await axios.put(`${SERVER_URL}/studyMaterialCategory/update-category/${currentCategoryIdToEdit}`, data);
  
      setEditCategoryModal(false) 
      
      setTimeout(() => {
        setError(false);
        fetchData()
        setMsg(`Successfully updated`);
      }, 100);

      setTimeout(() => {
        setError(false);
        setMsg('');
      }, 2500);
      

    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };





  const deleteCategoryMaterials = async (categoryId, category) => {
    try {
      // Ask for confirmation
  
  
      const response = await axios.get(`${SERVER_URL}/studyMaterial/get-material-from-categoryId/${categoryId}`);
  
      let responseData = response.data;
      let filteredData = responseData.filter(item => item.tag === 'Shared');
      let notSharedData = responseData.filter(item => item.tag !== 'Shared');
  
      console.log(responseData);
  
      if (filteredData.length > 0) {
        return alert(`${category} cannot be deleted. Some study materials that ${categoryFor === 'Personal' ? 'you have' : 'your group has'} shared in the virtual library room are found in this category.`);
      } else {

        if (window.confirm(`Are you sure you want to remove ${category}?`)){

          
          // Reset message after a delay or any other desired logic
          setTimeout(() => {
            setError(false);
            setMsg(`${category} has been successfully removed.`);
          }, 100);
    
          setTimeout(() => {
            setError(false);
            setMsg('');
              if (categoryFor === 'Personal') {
                navigate(`/main/personal/study-area/`);
              } else {
                navigate(`/main/group/study-area/${groupNameId}`);
              }
          }, 2500);

          await axios.delete(`${SERVER_URL}/studyMaterialCategory/delete-category/${categoryId}/${category}`);

    
          fetchData();
        }
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }

    fetchData()
  };
  

  const deleteCategoryMaterialsShared = async (categoryName) => {
    try {
      // Ask for confirmation
      const confirmDelete = window.confirm(`Are you sure you want to remove ${categoryName} category and all the study materials of it?`);
  
      if (confirmDelete) {
        const materialCategory = sharedMaterialsCategoriesOrig.filter((material) => material.category === categoryName);
  
        // Initialize an array to store the filtered materials
        let filteredMaterialsArray = [];
  
        materialCategory.forEach((material) => {
          // Filter materials based on the condition and concatenate the results to the array
          filteredMaterialsArray = filteredMaterialsArray.concat(
            sharedMaterials.filter((res) => res.StudyMaterialsCategoryId === material.id)
          );
        });

        // Reset message after a delay or any other desired logic
        setTimeout(() => {
          setError(false);
          setMsg(`${categoryName} has been successfully removed.`);
        }, 100);
  
        setTimeout(() => {
          setError(false);
          setMsg('');
          if (categoryFor === 'Personal') {
            navigate(`/main/personal/study-area`)
          } else {
            navigate(`/main/personal/study-area/${groupNameId}`)
          }
        }, 1500);


  
        // Execute asynchronous operations sequentially using a for...of loop
        for (const item of filteredMaterialsArray) {
          await axios.delete(`${SERVER_URL}/studyMaterial/delete-material/${item.id}`);
          await axios.delete(`${SERVER_URL}/DashForPersonalAndGroup/get-dash-data/${item.id}`);
        }
  
        // Update sharedMaterials by directly modifying the state
        setSharedMaterials((prevSharedMaterials) =>
          prevSharedMaterials.filter(
            (item) => !filteredMaterialsArray.some((deletedItem) => deletedItem.id === item.id)
          )
        );
        
      }
    } catch (error) {
      console.error('Error deleting materials:', error);
    }
    fetchData()

  };
  
  
  
  
  if (loading) {
    return <div className='h-[100vh] w-full flex items-center justify-center'>
      <div class="loader">
        <div class="spinner"></div>
      </div>
    </div>
  } else {
    return (
      <div className='poppins mcolor-900 mbg-200 relative flex'>

        <Sidebar currentPage={categoryFor === 'Personal' ? 'personal-study-area' : 'group-study-area'} />


        <div className={`lg:w-1/6 h-[100vh] flex flex-col items-center justify-between py-2 lg:mb-0 ${
        window.innerWidth > 1020 ? '' :
        window.innerWidth <= 768 ? 'hidden' : 'hidden'
      } mbg-800`}></div>


        <div className='flex-1 mbg-200 w-full pt-5 flex'>
          {/* modal */}
          <div style={{ zIndex: 1000 }} className={`${hidden} absolute flex items-center justify-center modal-bg w-full h-full`}>
            <div className='flex justify-center'>
              <div className='mbg-100 max-h-[60vh] w-[40vw] w-1/3 z-10 relative p-10 rounded-[5px]' style={{ overflowY: 'auto' }}>
    
              <button className='absolute right-4 top-3 text-xl' onClick={() => {
                setHidden("hidden");
                setCategoryModal("hidden");
                setGroupMemberModal("hidden");
                setCurrentModalVal('')
                setModalList([])
                }}>
                ✖
              </button>
    
              <div className={categoryModal}>
                <p className='text-center text-2xl font-medium mcolor-800 my-5'>Add a category</p>
                <div className="groupName flex flex-col">
    
                  <div className='relative'>
                    <input type="text" placeholder='Category...' className='border-medium-800-scale px-5 py-2 w-full rounded-[5px] outline-none border-none' onChange={(event) => {setCurrentModalVal(event.target.value)}} value={currentModalVal === '' ? '' : currentModalVal} />
                    <button onClick={addToModalList} className='absolute right-5 top-1 text-3xl'>+</button>
                  </div>
    
                  <ul className='mt-3'>
                    {/* list of members that will be added */}
                    {
                      modalList.length > 0 && (
                        modalList.map((item, index) => {
                          return (
                            <div className='relative flex items-center my-2 text-lg' key={index}>
                              <span>
                                <CategoryIcon fontSize='small' /> <span className='ml-1'>{item}</span>
                              </span>
                              <button
                                className='absolute right-4 text-xl'
                                onClick={() => {
                                  const updatedList = modalList.filter((_, i) => i !== index);
                                  setModalList(updatedList);
                                }}
                              >
                                ✖
                              </button>
                            </div>
                          );
                        })
                      )
                    }
    
                  </ul>
    
                  <button onClick={saveCategories} className='mt-3 mbg-800 mcolor-100 py-2 rounded-[5px]'>Add</button>
    
                </div>
              </div>
              
    
    
    
              {categoryFor === 'Group' && (
    
                <div className={`${groupMemberModal} mt-5`}>
    
                  {!error && msg !== '' && (
                    <div className='green-bg text-center mt-5 rounded py-3 w-full mb-5'>
                      {msg}
                    </div>
                  )}
    
                  {error && msg !== '' && (
                    <div className='bg-red mcolor-100 text-center mt-5 rounded py-3 w-full mb-5'>
                      {msg}
                    </div>
                  )}
    
                  <p className='mb-2 text-lg mcolor-900'>Group Code:</p>
                  <div className='w-full flex items-center'>
                    <input type="text" value={code} disabled className='mbg-200 border-thin-800 text-center w-full py-2 rounded-[3px]' />
                    <button onClick={copyGroupCode} className='px-7 py-2 mbg-800 mcolor-100 rounded-[3px] border-thin-800'>Copy</button>
                  </div>
                  {isCodeCopied !== '' && (
                    <p className='text-center mcolor-700 mt-2'>{isCodeCopied}</p>
                  )}
    
    
                  <br />
                  <p className='mb-2 text-lg mcolor-900'>Group Name:</p>
                  <div className='flex items-center'>
                    <input type="text" value={groupName} className={`border-thin-800 text-center w-full py-2 rounded-[3px] ${(msg !== '' || UserId !== userHostId) ? 'mbg-200' :  ''}`} disabled={msg !== '' || UserId !== userHostId} onChange={(event) => setGroupName(event.target.value)} />
    
                    <button
                      onClick={changeGroupName}
                      className='px-4 py-2 mbg-800 mcolor-100 rounded-[3px] border-thin-800'
                      disabled={msg !== '' || UserId !== userHostId}
                    >
                      Change
                    </button>
    
    
                  </div>
                  {isGroupNameChanged !== '' && (
                    <p className='text-center mcolor-700 my-3'>{isGroupNameChanged}</p>
                    )}
    
    
                  {msg === '' && (
                    (UserId === userHostId) ? (
                      <button className='bg-red mcolor-100 rounded py-2 text-center my-5 w-full' onClick={(e) => deleteGroup(e)}>
                        Delete Group
                      </button>
                    ) : ( 
                      <button className='bg-red mcolor-100 rounded py-2 text-center my-5 w-full' onClick={(e) => leaveGroup(e)}>
                        Leave Group
                      </button>
                    )
                  )}
    
                  <br /><br />
                  <p className='mb-2 text-lg mcolor-900'>Group Host:</p>
                  <div className='flex justify-between my-2'>
                    <span>
                      <i className="fa-regular fa-user mr-3"></i>{`@${userHost}` || 'Deleted User'}
                    </span>
                  </div>
    
                    <br />
    
    
    
                    {/* add group member */}
                    <p className='mb-1'>Add a group member: </p>
                    <div className='relative'>
                      <SearchFunctionality data={data} onSearch={handleSearch} setSearchTermApp={setSearchTermApp} setSelectedDataId={setSelectedDataId} filteredData={filteredData} setFilteredData={setFilteredData} searchTermApp={searchTermApp} searchAssetFor={'search-username-for-group-creation'} />
                      <button className='absolute right-5 top-1 text-3xl' onClick={addToChosenData}>+</button>
                    </div>
    
    
    
                    <br />
                    <p className='mcolor-900 my-3'>Group Members:</p>
                    <ul className='mt-5'>
                    {Array.isArray(groupMemberIndex) &&
                      groupMemberIndex.map((user, indexGroup) => {
                        let targetValue = user.UserId;
                        let filteredData = tempUserList.filter(item => item.id === targetValue);
    
                        // Check if the user is found in tempUserList
                        if (!filteredData[0]) {
                          // User not found, skip rendering this list item
                          return null;
                        }
    
                        return (
                          <li key={indexGroup} className='flex justify-between my-2'>
                            <span>
                              <i className="fa-regular fa-user mr-3"></i>@{filteredData[0]?.username}
                            </span>
    
                            {(msg !== '' || UserId === userHostId) && (
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this user?')) {
                                    removeSelectedUser(filteredData[0]?.id, groupNameId);
                                  }
                                }}
                                className='text-lg'
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            )}
                          </li>
                        );
                      })}
    
    
    
                    </ul>
                    {/* {userList !== tempUserList && (
                      <div>
                        <button onClick={updateUserList} className='mt-2 mbg-800 mcolor-100 w-full py-2 rounded-[5px]'>Update User List</button>
    
                        {isUserListUpdated !== "" && (
                          <p className='text-center mcolor-700 my-3'>{isUserListUpdated}</p>
                        )}
                      </div>
                    )} */}
                </div>
    
              )}
        
              </div>
            </div>
          </div>
      

    
          <div className='py-4 px-10 w-3/4 '>    

    
            <div className='flex justify-between items-center mb-6'>
        
              <h3 className='text-center text-2xl font-medium'><LocalLibraryIcon className='mb-1 mr-1 mcolor-800-opacity' fontSize='large' /> Study Area</h3>

              <div>

                <button className='rounded-[8px] px-6 py-2 font-medium font-lg btn-primary' onClick={() => {
                  materialCategories.length > 0
                    ? navigate(`/main/${categoryForToLower}/study-area/qa-gen/${categoryFor === 'Group' ? groupNameId : ''}`, {
                        state: {
                          categoryFor: categoryFor,
                        },
                      })
                    : alert('No category saved. Add a category first.');
                }}>Create Reviewer</button>


                <button className='mx-1 mbg-800 mcolor-100 px-6 py-2 rounded-[5px] font-medium text-md' onClick={() => {
                  setHidden("")
                  setCategoryModal("")
                  }}>Add Category</button>
                {categoryFor === 'Group' && (
                  <button className='mcolor-800 py-2 rounded-[5px] font-medium font-lg' onClick={() => {
                    setHidden("")
                    setGroupMemberModal("")
                    }}>
                      <MoreVertIcon fontSize='medium' />
                  </button>
                )}
              </div>
            </div>
    
    
            {!error && msg !== '' && (
              <div className='green-bg text-center mt-5 rounded py-3 w-full mb-5'>
                {msg}
              </div>
            )}
    
    
            <p className={`${savedGroupNotif} my-5 py-2 mbg-200 mcolor-800 text-center rounded-[5px] text-lg`}>New categories added!</p>
    
            <p className={`${isMaterialDeleted} my-5 py-2 green-bg mcolor-800 text-center rounded-[5px] text-lg`}>{recentlyDeletedMaterial} has been deleted.</p>
    
            {/* latest added reviewer */}
            <div className=''>
              {lastMaterial !== null ? (
                <div className='mbg-100 shadows px-5 py-5 rounded'>
                  <div className='relative'>
                    <p className='text-xl mcolor-900 mb-5'>Last Uploaded Reviewer: {lastMaterial.title} from {materialCategory}</p>
      
                    <section className="border mbg-100 scroll-box max-h-[68vh] min-h-[68vh]">
                      <div className='gap-2 flex justify-between items-start mx-5 mt-8'>
                        <button
                          onClick={() => showContent(1)}
                          className={`w-full py-2 rounded text-lg ${activeButton === 1 ? 'border-medium-800 mcolor-800 font-bold' : 'border-medium-700 mcolor-700 font-medium'}`}
                        >
                          Lesson
                        </button>

                        <button
                          onClick={() => showContent(3)}
                          className={`w-full py-2 rounded text-lg ${activeButton === 3 ? 'border-medium-800 mcolor-800 font-bold' : 'border-medium-700 mcolor-700 font-medium'}`}
                        >
                          Notes Reviewer
                        </button>

                        <Link to={`/main/${categoryForToLower}/study-area/${categoryFor.toLowerCase()}-review/${groupNameId !== undefined ? groupNameId + '/' : ''}${lastMaterial.id}`} className='mbg-800 mcolor-100 w-full py-2 rounded text-lg text-center border-medium-800'>
                          <button>
                            View Reviewer
                          </button>
                        </Link>

                      </div>
                      <div className='p-5'>
                        {showLesson && lastMaterial && <div>
                          
                          <p className='mbg-200 p-5 border-thin-800 rounded my-5'>
                            <h3 className='font-medium mcolor-700 text-2xl text-center pt-3 pb-5'><span className='font-bold mcolor-800'>{lastMaterial.title}</span></h3>
                            {lastMaterial.body}
                          </p>
                          
                          </div>
                        }
      
                        {showRev && materialRev && (
                          <div>

                            <h3 className='font-medium mcolor-700 text-2xl text-center mb-5 mt-3'><span className='font-bold mcolor-800'>Key Points</span></h3>

                            {materialRev && Array.isArray(materialRev) && materialRev.map((material) => (
                              <div className='mb-10 mt-2 p-5 mbg-200 border-thin-800 rounded' key={material.question}>
                                <p className='my-1 font-medium'><span className='mbg-700 mcolor-100 px-2 rounded'>Question:</span> <span className='mcolor-800 font-medium'>{material.question}</span></p>
                                <p className='border-hr my-2'></p>
                                <p className='font-medium'><span className='mbg-700 mcolor-100 px-2 rounded'>Answer:</span> <span className='mcolor-800 font-medium'>{material.answer}</span></p>
                              </div>
                            ))}
      
                            <div className='mb-[-1.5rem]'></div>
                          </div>
                        )}
                      </div>
                    </section>
                    <div className='flex items-center w-[98%] absolute left-0 mbg-100 py-2 bottom-[.0rem] ml-1 mb-[.16rem] rounded'>

                    </div>
                  </div>
                </div>
              ) : (
                <div className='pt-3 text-center text-xl'>No Uploaded Reviewer Appears.</div>
              )}
            </div>


          </div>

          {/* Side */}
          <div className={`flex flex-col justify-between w-1/4 h-[95vh] p-5 sidebar mbg-800 mcolor-100 rounded`} style={{ overflowY: 'auto' }}>
            <div className="my-5 shelf-categories">
              
              <p className="text-2xl mb-10 font-bold text-center opacity-90">{categoryFor === 'Group' ? `${groupName.toUpperCase()}'S ` : 'PERSONAL'} SHELF</p>
              
              <div>
                {materialCategories.length > 0 ? (
                  <div className='mbg-100 mcolor-900 rounded px-4 py-2 mb-2'>
                    <span>{categoryFor === 'Personal' ? 'My' : 'Our'} Study Material</span>
                    <button onClick={toggleExpand} className='ml-2'>{!isExpanded ? <i className="fa-solid fa-chevron-down"></i> : <i className="fa-solid fa-chevron-up"></i>}</button>
                  </div>
                  ) : (
                    <p className='text-center mcolor-100 opacity-50'>No materials saved.</p>
                  )}
                <div className={`expandable-container ${isExpanded ? 'expanded' : ''}`}>
                  {materialCategories.length > 0 && (
                    isExpanded && materialCategories.map((category) => (
                    <div className="shelf-category my-2" key={category.id}>
                      <div className="mbg-200 mt-2 mcolor-900 px-4 py-1 rounded-[5px]">
    
                      <div className='flex items-center justify-between' style={expandedCategories[category.id] ? { borderBottom: 'solid 1px #999', paddingBottom: '.5rem', marginBottom: '.2rem' } : {}}>
    
                          <div className='flex items-center'>
                            <div className="text-md font-medium">{category.category}</div>
                            <button onClick={() => toggleExpandId(category.id)} className='ml-2'>
                              {!expandedCategories[category.id] ? (
                                <i className="fa-solid fa-chevron-down"></i>
                              ) : (
                                <i className="fa-solid fa-chevron-up"></i>
                              )}
                            </button>
                          </div>
    
                          {/* delete this */}
                          <div>
                            <button onClick={async () => {
    
                              const response = await axios.get(`${SERVER_URL}/studyMaterial/get-material-from-categoryId/${category.id}`);
                                
                              let responseData = response.data;
                              let filteredData = responseData.filter(item => item.tag === 'Shared');
    
                              console.log(responseData);
    
                              if (filteredData.length > 0) {
                                return alert(`${category.category} cannot be edited. Some study materials that ${categoryFor === 'Personal' ? 'you have' : 'your group has'} shared in the virtual library room are found in this category.`);
                              } else {
                                setCurrentCategoryIdToEdit(category.id)
                                setCurrentCategoryToEdit(category.category)
                                setEditCategoryModal(true)
                              }
    
                              }}><BorderColorIcon className='mcolor-900' sx={{fontSize: '18px'}} /></button>
                            <button onClick={() => deleteCategoryMaterials(category.id, category.category)}><DeleteIcon className='text-red' sx={{fontSize: '20px'}} /></button>
                          </div>
                        </div>
    
                        {editCategoryModal && (
                          <div style={{ zIndex: 1000 }} className={`absolute flex items-center justify-center modal-bg w-full h-full`}>
                            <div className='flex justify-center'>
                              <div className='mbg-100 max-h-[60vh] w-[30vw] w-1/3 z-10 relative p-10 rounded-[5px]' style={{ overflowY: 'auto' }}>
    
                              <button className='absolute right-4 top-3 text-xl' onClick={() => {
                                setEditCategoryModal(false);
                                }}>
                                ✖
                              </button>
    
                              <p className='text-center text-2xl mcolor-800 font-medium'>Edit Category</p>
                              
                              <br />
    
    
                              <div className='w-full'>
                                <input className='border-thin-800 rounded py-2 text-center w-full' type="text" placeholder='Type category...' onChange={(e) => setCurrentCategoryToEdit(e.target.value)} value={currentCategoryToEdit} />
                                <br />
                                <button onClick={editCategory} className='mt-3 w-full mbg-800 mcolor-100 py-2 rounded'>Update</button>
                              </div>
    
                              </div>
                            </div>
                          </div>
                        )}
    
    
    
                        {/* Check if the category is expanded before rendering the study materials */}
                  
                        {expandedCategories[category.id] && (
                          studyMaterialsCategory
                            .filter((material) => material.StudyMaterialsCategoryId === category.id)
                            .map((material, index) => (
                              <div className='flex items-center justify-between'>
                                <p key={index} className='mt-2'>
                                  <i className="fa-solid fa-book mr-2"></i>
                                  {material.title}
                                </p>
    
                                <div>
                                  <button 
                                    onClick={() => deleteStudyMaterial(material.id, material.title, material.code, material.tag)}
                                    >
                                      <DeleteIcon sx={{fontSize: '20px'}} />
                                  </button>
    
                                  <Link to={`/main/${categoryForToLower}/study-area/${categoryFor.toLowerCase()}-review/${groupNameId !== undefined ? groupNameId + '/' : ''}${material.id}`}>
                                    <OpenInNewIcon sx={{fontSize: '20px'}} />
                                  </Link>
                                </div>
                              </div>
                            ))
                        )}
    
    
                        {expandedCategories[category.id] && studyMaterialsCategory
                          .filter((material) => material.StudyMaterialsCategoryId === category.id)
                          .length === 0 && (
                            <p className='text-center'>No record</p>
                          )}
    
    
    
    
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </div>
    
              <div className='mt-10'>
                {sharedMaterialsCategories.length > 0 ? (
                  <div>
                    <span>Bookmarked Materials:</span>
                    <button onClick={toggleBookmarksExpand} className='ml-2'>
                      {!isBookmarkExpanded ? <i className="fa-solid fa-chevron-down"></i> : <i className="fa-solid fa-chevron-up"></i>}
                    </button>
                  </div>
                ) : (
                  <p className='text-center mcolor-100 opacity-50'>No bookmarks saved.</p>
                )}
                <div className={`expandable-container ${isBookmarkExpanded ? 'expanded' : ''}`}>
                  {sharedMaterialsCategories.length > 0 && (
                    isBookmarkExpanded && [...new Set(sharedMaterialsCategories.map(category => category.category))].map((categoryName, index) => (
                      <div className="shelf-category my-5" key={categoryName}>
                        <div className="mbg-200 mt-2 mcolor-900 px-4 py-1 rounded-[5px]">
                          <div className='flex items-center justify-between' style={expandedSharedCategories[categoryName] ? { borderBottom: 'solid 1px #999', paddingBottom: '.5rem', marginBottom: '.2rem' } : {}}>
                            <div className='flex items-center'>
                              <div className="text-lg font-medium">{categoryName}</div>
                              <button onClick={() => toggleSharedExpandId(categoryName)} className='ml-2'>
                                {!expandedSharedCategories[categoryName] ? (
                                  <i className="fa-solid fa-chevron-down"></i>
                                ) : (
                                  <i className="fa-solid fa-chevron-up"></i>
                                )}
                              </button>
                            </div>
                            
                            {/* delete this */}
                            <div>
                              <button onClick={() => deleteCategoryMaterialsShared(categoryName)}><DeleteIcon className='text-red' sx={{fontSize: '20px'}} /></button>
                            </div>
                            
                          </div>
                          {/* Check if the category is expanded before rendering the study materials */}
                          {expandedSharedCategories[categoryName] && (
                            sharedMaterials
                              .filter((material) => sharedMaterialsCategoriesEach.find(category => category.category === categoryName))
                              .map((material, index) => {
                                const matchingCategory = sharedMaterialsCategoriesEach.find(category => category.category === categoryName);
    
                                // Check if the material's category matches the current categoryName
                                if (matchingCategory && sharedMaterialsCategoriesEach[index].category === categoryName) {
                                  return (
                                    <div key={material.id} className='flex items-center justify-between'>
                                      <p className='mt-2'>
                                        <i className="fa-solid fa-book mr-2"></i>
                                        {material.title}
                                      </p>
                                      <div>
                                        <button
                                          onClick={() => deleteStudyMaterial(material.id, material.title, material.code, material.tag)}
                                        >
                                          <DeleteIcon sx={{ fontSize: '20px' }} />
                                        </button>
                                        <Link to={`/main/${categoryForToLower}/study-area/${categoryFor.toLowerCase()}-review/${groupNameId !== undefined ? groupNameId + '/' : ''}${material.id}`}>
                                          <OpenInNewIcon sx={{ fontSize: '20px' }} />
                                        </Link>
                                      </div>
                                    </div>
                                  );
                                }
    
                                return null; // Skip rendering if the material is not in the current category
                              })
                          )}
    
    
                          {expandedSharedCategories[categoryName] && sharedMaterials
                            .filter((material) => sharedMaterialsCategoriesEach.find(category => category.category === categoryName)).length === 0 && (
                              <p className='text-center mt-2'>No record</p>
                            )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
    
            </div>
          </div>

        </div>        
      </div>
    );
  }
};
