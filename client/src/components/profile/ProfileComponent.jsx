import React, { useEffect, useState } from 'react';
import '../../pages/main/mainpage.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../UserContext';
import axios from 'axios';
import { SERVER_URL } from '../../urlConfig';
import { fetchUserData } from '../../userAPI';
import { useDropzone } from 'react-dropzone';

import { Sidebar } from '../sidebar/Sidebar';


// animation import
import { motion  } from 'framer-motion';

// icons import
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// reesponsive sizes
import { useResponsiveSizes } from '../useResponsiveSizes'; 

// other imports
import { LibraryComponent } from '../library/LibraryComponent'; 


export const ProfileComponent = () => {

  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  const {
    groupList, personalStudyMaterials, personalStudyMaterialsCategory,
    groupStudyMaterials, groupStudyMaterialsCategory, sharedMaterials, sharedMaterialsCategory, currentMaterialTitle, currentMaterialCategory, materialMCQ, materialMCQChoices, materialNotes, currentSharedMaterialIndex, setCurrentSharedMaterialIndex, groupNameValue, setGroupNameValue,
    showModal, setShowModal, showPresentStudyMaterials, setShowPresentStudyMaterials, showMaterialDetails, setShowMaterialDetails, enableBackButton, showBookmarkModal, setShowBookmarkModal, chooseRoom, setChooseRoom, chooseGroupRoom, setChooseGroupRoom, showCreateGroupInput, setShowCreateGroupInput, showContext, setShowContext, context, showNotes, setShowNotes, showQuiz, setShowQuiz, isDone, setIsDone, buttonLoading, buttonLoader, buttonClickedNumber, UserId, userData, viewStudyMaterialDetails, bookmarkMaterial, createGroupBtn, loading, setButtonLoading, setButtonClickedNumber, setUserData, setLoading, setGroupList, setPersonalStudyMaterials, setPersonalStudyMaterialsCategory, setGroupStudyMaterials, setGroupStudyMaterialsCategory, setSharedMaterials, setSharedMaterialsCategory, setFilteredSharedCategories, setBtnClicked, sharedMaterialsCategoryBookmarks, setDeleteModal, setMaterialIdToRemove, setMaterialIdToRemoveBookmarkCounts, buttonLoaderIndex, deleteModal, removeFromLibraryOnly, btnClicked, currentMaterial, deleteInAllRecords, setSharedMaterialsCategoryUsers, setSharedMaterialsCategoryBookmarks, sharedMaterialsCategoryUsers
  } = LibraryComponent();


  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });



  const [groupListLength, setGroupListLength] = useState(0);
  const [contributedMaterialsLength, setContributedMaterialsLength] = useState(0);


  const [showAccountDeletionInputPass, setShowAccountDeletionInputPass] = useState(false)
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);


  // tabs
  const [image, setImage] = useState('');




  const [showPassword, setShowPassword] = useState(false);
  const [passwordVal, setPasswordVal] = useState('')
  const [loadOnce, setLoadOnce] = useState(false);
  const [users, setUsers] = useState([]);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };




  const { user } = useUser();
  const navigate = useNavigate();
  const { userId } = useParams();
  
  const [showMainProfile, setShowMainProfile] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showPasswordSecurity, setShowPasswordSecurity] = useState(false)
  const [showAccountDeletion, setShowAccountDeletion] = useState(false)



  const fetchUserDataFrontend = async () => {
    try {

      const userData = await fetchUserData((!userId || UserId === parseInt(userId, 10)) ? UserId : userId);

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

    if (!userId || UserId === parseInt(userId, 10)) {
      setShowMainProfile(true)
      setShowAccountSettings(false)
    } else {
      setShowMainProfile(false)
      setShowAccountSettings(true)
    }

    try {

      
      
      if (loadOnce) {
        setLoading(true)
        setLoadOnce(false)
      }


      let totalGroups = 0
      const groupListLengthResponse = await axios.get(`${SERVER_URL}/studyGroup/extract-group-through-user/${(!userId || UserId === parseInt(userId, 10)) ? UserId : userId}`)
  
      const groupListMemberLengthResponse = await axios.get(`${SERVER_URL}/studyGroupMembers/get-materialId/${(!userId || UserId === parseInt(userId, 10)) ? UserId : userId}`)
  
      totalGroups += groupListLengthResponse.data.length;
      totalGroups += groupListMemberLengthResponse.data.length;
      
      setGroupListLength(totalGroups)
      
  
      const contributedMaterialsResponse = await axios.get(`${SERVER_URL}/studyMaterial/shared-materials-by-userid/${(!userId || UserId === parseInt(userId, 10)) ? UserId : userId}`)
  
      setContributedMaterialsLength(contributedMaterialsResponse.data.length)
  
  
    
      const fetchPersonalStudyMaterial = async () => {
        const personalStudyMaterial = await axios.get(`${SERVER_URL}/studyMaterial/study-material-category/Personal/${(!userId || UserId === parseInt(userId, 10)) ? UserId : userId}`);
        return personalStudyMaterial.data;
      };
  
      const fetchGroupStudyMaterial = async () => {
        const groupStudyMaterial = await axios.get(`${SERVER_URL}/studyMaterial/study-material-category/Group/${(!userId || UserId === parseInt(userId, 10)) ? UserId : userId}`);
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
            const materialCategorySharedResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/shared-material-category/${material.StudyMaterialsCategoryId}/Group/${(!userId || UserId === parseInt(userId, 10)) ? UserId : userId}`);
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
        const response = await axios.get(`${SERVER_URL}/studyGroup/extract-group-through-user/${(!userId || UserId === parseInt(userId, 10)) ? UserId : userId}`);
        setGroupList(response.data);
  
        if (response.data.length === 0) {
          const userMemberGroupList = await axios.get(`${SERVER_URL}/studyGroupMembers/get-materialId/${(!userId || UserId === parseInt(userId, 10)) ? UserId : userId}`);
  
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
  }, [isDone, UserId, userId])
  


  const updateUserInformation = async (e, buttonclickedNum) => {

    setButtonLoading(true)
    setButtonClickedNumber(buttonclickedNum)

    let data = {
      username: userData.username,
      typeOfLearner: userData.typeOfLearner,
      studyProfTarget: userData.studyProfTarget
    }
    

    await axios.put(`${SERVER_URL}/users/update-user/${(!userId || UserId === parseInt(userId, 10)) ? UserId : userId}`, data).then((response) => {

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

        await axios.put(`${SERVER_URL}/users/update-user-image/${(!userId || UserId === parseInt(userId, 10)) ? UserId : userId}`, data).then((response) => {

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
        url: `${SERVER_URL}/users/${(!userId || UserId === parseInt(userId, 10)) ? UserId : userId}`,
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
      <div className='poppins mcolor-900 mbg-200 relative flex'>
      {/* Toggle button for mobile and tablet sizes */}

      <Sidebar currentPage={(!userId || UserId === parseInt(userId, 10)) && 'profile'}/>
        
      <div className={`h-[100vh] flex flex-col items-center justify-between py-2 ${extraLargeDevices && 'w-1/6'} mbg-800`}></div>

      <div className={`flex-1 mbg-200 w-full ${!extraSmallDevice ? 'mx-5' : ''} pt-5`}>

        {(!userId || UserId === parseInt(userId, 10)) && (
          <div className='mbg-100 p-4 rounded-[1rem]'>
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
        )}

            
        <br />
        <div className={`flex ${(extraLargeDevices || largeDevices) ? 'flex-row justify-between' : 'flex-col-reverse'} relative`}>


          <div className={`${(extraLargeDevices || largeDevices) ? 'w-2/3 pr-5' : 'w-full mt-5'}`}>
            {showMainProfile && (
              <motion.div 
              className='mb-5'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className='shadows p-5 mbg-100 rounded'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <form className={`flex ${extraSmallDevice ? 'flex-col' : 'flex-row'} items-center justify-center px-8 gap-8 pt-5`}>
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

                  <div className={`${extraSmallDevice ? 'text-center' : 'text-start'}`}>
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

                <ul className={`grid ${extraSmallDevice ? 'grid-cols-1' : 'grid-cols-2'} gap-5 my-5`}>
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
                    <input type="text" disabled className='border-medium-800 w-full py-2 rounded mbg-200 px-5' value={userData.email} />
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
                  <button className={`${(buttonLoading && buttonClickedNumber === 2) ? 'mbg-200 mcolor-900 border-thin-800' : 'btn-primary mcolor-100'} px-5 py-2 rounded ${extraSmallDevice ? 'w-full' : ''}`} disabled={(buttonLoading && buttonClickedNumber === 2)} onClick={(e) => updateUserInformation(e, 2)}>
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
                  {sharedMaterials
                    .map((material, index) => {
                      const category = sharedMaterialsCategory[index]?.category || 'Category not available';
                      const user = sharedMaterialsCategoryUsers[index]?.username || 'Deleted user';
                      const userIdMaterial = material?.UserId || 'Deleted user';
                      const bookmarks = sharedMaterialsCategoryBookmarks[index] || [];

                      // Find the latest bookmark timestamp or default to 0 if no bookmarks
                      const latestBookmarkTimestamp = Math.max(...bookmarks.map(bookmark => bookmark.timestamp), 0);

                      return {
                        index,
                        material,
                        category,
                        user,
                        userIdMaterial,
                        bookmarksCount: bookmarks.length,
                        latestBookmarkTimestamp
                      };
                    })
                    .filter(item => item.user === userData?.username) // Filter by the user's username
                    .sort((a, b) => b.latestBookmarkTimestamp - a.latestBookmarkTimestamp)
                    .map(({ index, material, category, user, bookmarksCount, userIdMaterial }) => (
                      <div key={index} className={`my-3 mbg-input border-thin-800 p-4 rounded flex ${(extraLargeDevices || largeDevices || smallDevice) ? 'flex-row justify-between' : 'justify-center flex-col'} items-center`}>
                        <div className={`${(extraLargeDevices || largeDevices || smallDevice) ? 'w-2/3' : 'w-full'}`}>
                          <p className={`font-medium ${extraSmallDevice ? 'text-md' : 'text-lg'}`}>Title: <span className='font-medium'>{material?.title}</span></p>
                          <p className={`${extraSmallDevice ? 'text-xs' : 'text-sm'} mt-1 mcolor-700`}>Category: <span className='font-medium mcolor-800'>{category}</span></p>
                          <p className={`${extraSmallDevice ? 'text-xs' : 'text-sm'} mt-1 mcolor-700`}>Uploader: <span className='font-medium mcolor-800'>{user}</span></p>
                          <p className={`${extraSmallDevice ? 'text-xs' : 'text-sm'} mt-1 mcolor-700`}>Bookmark Count: <span className='font-medium mcolor-800'>{bookmarksCount}</span></p>
                        </div>
                        <div className={`gap-3 ${(extraLargeDevices || largeDevices || smallDevice) ? 'flex-1' : extraSmallDevice ? 'w-full flex flex-col mt-5' : 'w-full flex mt-3'}`}>
                          {user === userData?.username && (
                            <div className={`mbg-100 ${extraSmallDevice ? 'py-2' : 'my-1 py-1'} w-full mcolor-900 border-red-dark text-sm rounded ${userIdMaterial !== UserId && 'hidden'}`}>
                              <button className={`w-full text-red ${mediumDevices ? 'text-xs' : 'text-sm'}`} onClick={() => {
                                if (bookmarksCount > 0) {
                                  alert('This material has been bookmarked by others. You can no longer remove nor delete it.')
                                } else {
                                  setDeleteModal(true)
                                  setMaterialIdToRemove(material.id)
                                  setMaterialIdToRemoveBookmarkCounts(bookmarksCount)
                                }
                              }}>Delete</button>
                            </div>
                          )}
                          <button className={`mbg-200 ${extraSmallDevice ? 'py-2' : 'my-1 py-1'} w-full mcolor-900 border-thin-800 ${mediumDevices ? 'text-xs' : 'text-sm'} rounded`} disabled={buttonLoader} onClick={() => viewStudyMaterialDetails(index, 'shared', 'not filtered', category)}>
                            {(buttonLoader && index === buttonLoaderIndex) ? (
                              <div className="w-full flex items-center justify-center">
                                <div className='btn-spinner'></div>
                              </div>
                            ) : (
                              <div className='w-full'>View</div>
                            )}
                          </button>
                          <button className={`mbg-800-opacity w-full ${extraSmallDevice ? 'py-2' : 'my-1 py-1'} mcolor-100 ${mediumDevices ? 'text-xs' : 'text-sm'} rounded`} onClick={() => {
                            setShowBookmarkModal(true);
                            setChooseRoom(true);
                            setCurrentSharedMaterialIndex(index);
                          }}>Bookmark</button>
                        </div>
                      </div>
                    ))}
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
                    <div className={`relative mbg-100 min-h-[30vh] max-h-[80vh] ${(extraLargeDevices || largeDevices) ? 'w-1/2' : (mediumDevices || smallDevice) ? 'w-2/3' : 'w-full mx-2'} z-10 relative py-5 px-10 rounded-[5px]`} style={{overflowY: 'auto'}}>
                      
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
                                  <button className='mbg-100 mcolor-900 border-thin-800 px-5 py-2 rounded' onClick={() => viewStudyMaterialDetails(index, 'personal', 'not filtered', category)} >View</button>
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
                                  <button className='mbg-100 mcolor-900 border-thin-800 px-5 py-2 rounded' onClick={() => viewStudyMaterialDetails(index, 'group', 'not filtered', category)}>View</button>
                                  {/* <button className='btn-800 mcolor-100 px-5 py-2 rounded' onClick={() => shareMaterial(index, 'Group')}>Share</button> */}
                                </div>
                              </div>
                          })}
                        </div>
                      )}



                    {showMaterialDetails && (
                      <div>

                        
                        {enableBackButton && (
                          <button disabled={buttonLoader || btnClicked} className='mbg-200 mcolor-900 rounded px-4 py-1 rounded border-thin-800' onClick={() => {
                            setShowMaterialDetails(false)
                            setShowPresentStudyMaterials(true)
                          }}>Back</button>
                        )}



                        <div className='my-6'>
                          <p className='mcolor-900 text-center text-xl font-medium'>{currentMaterialTitle} from {currentMaterialCategory}</p>
                          
                          <div className='flex items-center justify-between my-5 gap-1'>
                            <button className={`border-thin-800 w-full rounded py-2 ${showContext ? '' : 'btn-700 mcolor-100'} ${extraSmallDevice ? 'text-xs' : 'text-md'}`} onClick={() => {
                              setShowQuiz(false)
                              setShowNotes(false)
                              setShowContext(true)
                            }}>Context</button>
                            <button className={`border-thin-800 w-full rounded py-2 ${showNotes ? '' : 'btn-700 mcolor-100'} ${extraSmallDevice ? 'text-xs' : 'text-md'}`} onClick={() => {
                              setShowContext(false)
                              setShowQuiz(false)
                              setShowNotes(true)
                            }}>Notes</button>
                            <button className={`border-thin-800 w-full rounded py-2 ${showQuiz ? '' : 'btn-700 mcolor-100'} ${extraSmallDevice ? 'text-xs' : 'text-md'}`} onClick={() => {
                            setShowContext(false)
                            setShowNotes(false)
                            setShowQuiz(true)
                            }}>Quiz</button>
                          </div>


                          {showContext && (
                            <p className={`text-justify my-5 ${extraSmallDevice ? 'text-xs' : smallDevice ? 'text-sm' : 'text-md'}`}>{context}</p>
                          )}

                          {showNotes && (
                            <div className='my-10'>
                              {materialNotes.map((material) => (
                                <div className={`my-5 ${extraSmallDevice ? 'text-xs' : smallDevice ? 'text-sm font-medium' : 'text-md font-medium'}`}>
                                  <p className='color-primary'>Question: <span className='mcolor-900 mb-4'>{material.question}</span></p>
                                  
                                  <p className='color-primary mt-1'>Answer: <span className='mcolor-900'>{material.answer}</span></p>

                                  <div className='border-hr my-5'></div>
                                </div>
                              ))}
                              <div className='mb-[-1.5rem]'></div>
                            </div>
                          )}

                          {showQuiz && (
                            <div className='mt-5'>
                              <br />
                              {materialMCQ.map((material, quesIndex) => (
                                <div className={`${extraSmallDevice ? 'text-xs' : smallDevice ? 'text-sm font-medium' : 'text-md font-medium'} ${(material.quizType === 'MCQA' || material.quizType === 'Identification') ? 'mb-14' : material.quizType !== 'ToF' ? '' : ''}`} key={material.id}>
                                  <p className='mt-2 color-primary'>Question: <span className='mcolor-800 font-medium ml-1'>{material.question}</span></p>
                                  <p className='color-primary'>Answer: <span className='mcolor-800 font-medium ml-1'>{material.answer}</span></p>

                                  {material.quizType === 'MCQA' && (
                                    <p className='mt-5 mb-1'>Choices: </p>
                                  )}

                                  <ul className={`grid grid-cols-${mediumDevices ? '2' : (smallDevice || extraSmallDevice) ? '1' : '3'} gap-3`}>
                                    {materialMCQChoices
                                      .filter((choice) => (choice.QuesAnId === material.id && material.quizType === 'MCQA'))
                                      .map((choice, index) => (
                                        <li key={index} className='btn-300 text-center py-1 rounded'>{choice.choice}</li>
                                      ))}
                                  </ul>

                                  <div className='border-hr mt-10'></div>

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


                {/* delete modal */}
                {deleteModal && (
                  <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                    <div className='flex items-center justify-center h-full'>
                      <div className={`relative mbg-input min-h-[30vh] ${(extraLargeDevices || largeDevices) ? 'w-1/3' : mediumDevices ? 'w-1/2' : smallDevice ? 'w-2/3' : 'w-full mx-2'} z-10 relative py-5 px-5 rounded-[5px]`} style={{overflowY: 'auto'}}>
  
                        <button className='absolute right-5 top-5 font-medium text-xl' onClick={(e) => {
                          e.preventDefault()
                          setDeleteModal(false)
                        }}>&#10006;</button>
  
                        <div className='flex items-center justify-center h-full'>
                          <div className='w-full'>
                            <div>
                              <div className='flex flex-col gap-4'>
                                <br />
                                <button className='btn-300 py-4 rounded text-md font-medium' onClick={removeFromLibraryOnly}>{btnClicked && currentMaterial === 'Removing' ? 'Removing...' : 'Remove From Library Only'}</button>
                                <button className='btn-300 py-4 rounded text-md font-medium' onClick={() => {
                                  deleteInAllRecords()
                                }}>{btnClicked && currentMaterial === 'Deleting' ? 'Deleting...' : 'Delete in All Records'}</button>
                              </div>
                            </div>
                          </div>
                        </div>
  
  
  
                      </div>
                    </div>
                  </div>
                )}



                {/* user choosing where to bookmark */}
                {showBookmarkModal && (
                  <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                    <div className='flex items-center justify-center h-full'>
                      <div className={`relative mbg-input min-h-[30vh] ${(extraLargeDevices || largeDevices) ? 'w-1/3' : mediumDevices ? 'w-1/2' : smallDevice ? 'w-2/3' : 'w-full mx-2'} z-10 relative py-5 px-5 rounded-[5px]`} style={{overflowY: 'auto'}}>

                        <button className='absolute right-5 top-5 font-medium text-xl' disabled={btnClicked || buttonLoading} onClick={() => {
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

                                <button className={`${(buttonLoading && buttonClickedNumber === 4) ? 'btn-300 py-4 rounded text-md font-medium' : 'btn-300 py-4 rounded text-md font-medium'} px-10 py-2 rounded`} disabled={(!btnClicked && buttonLoading && buttonClickedNumber === 4)} onClick={() => bookmarkMaterial(currentSharedMaterialIndex, null, 'Personal', 4)}>
                                  {(buttonLoading && buttonClickedNumber === 4) ? (
                                    <div>Bookmarking to Personal Study Room...</div>
                                  ) : (
                                    btnClicked ? (
                                      <div>Please Wait...</div>
                                      ) : (
                                      <div>Personal Study Room</div>
                                    ) 
                                  )}

                                </button>

                                <button disabled={(btnClicked || ((buttonLoading) && buttonClickedNumber === 4))} className='btn-300 py-4 rounded text-md font-medium'  onClick={() => {
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

                            <button className='mbg-200 mcolor-900 rounded px-4 py-1 rounded border-thin-800' disabled={btnClicked || buttonLoading} onClick={() => {
                              setChooseGroupRoom(false)
                              setChooseRoom(true)
                            }}>Back</button>
                          

                          <div className='mt-5 flex items-center justify-center'>
                            {/* back here */}

                            {showCreateGroupInput === false ? (
                              <button className={`px-4 py-2 rounded btn-800 mcolor-100 ${UserId === undefined && 'mt-5'}`}
                              disabled={btnClicked || buttonLoading} onClick={() => {
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
                                  <button className='px-4 w-full py-2 rounded btn-700 mcolor-100' onClick={createGroupBtn}>Create</button>
                                  <button className='px-4 w-full py-2 rounded mbg-input mcolor-900 border-thin-800' onClick={() => setShowCreateGroupInput(false)}>Cancel</button>
                                </div>
                              </div>
                            )}

                            
                          </div>

                          {showCreateGroupInput === false && (
                            groupList.slice().sort((a, b) => b.id - a.id).map(({ id, groupName}) => (
                              <div key={id} className={`shadows mcolor-900 rounded-[5px] p-5 my-6 mbg-input flex ${extraSmallDevice ? 'flex-col' : 'flex-row'} items-center justify-between relative`}>


                                <p className='px-1'>{groupName}</p>
                  

                                <button className={`${(buttonLoading && buttonClickedNumber === (id+'1')) ? 'mbg-200 mcolor-900 border-thin-800' : 'btn-700 mcolor-100'} px-5 py-2 rounded ${extraSmallDevice && 'mt-3 text-sm'}`} disabled={(!btnClicked && buttonLoading && buttonClickedNumber === (id+'1'))} onClick={() => bookmarkMaterial(currentSharedMaterialIndex, id, 'Group', (id+'1'))}>
                                  {(buttonLoading && buttonClickedNumber === (id+'1')) ? (
                                    <div>Bookmarking...</div>
                                  ) : (
                                    btnClicked ? (
                                      <div>Please Wait...</div>
                                      ) : (
                                    <div>Bookmark</div>
                                    )
                                  )}
                                </button>

                                

                                {/* {expandedGroupId === id && (

                                  <div className='absolute right-0 bottom-0 px-7 mb-[-114px] btn-700 mcolor-100 rounded pt-3 pb-4 opacity-80'>
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
                className='shadows p-5 mbg-100 rounded'
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
                <div className='shadows p-5 mbg-100 rounded mb-5'>

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
                            className='ml-2 focus:outline-none absolute right-2  mcolor-800'
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
            className={`flex justify-center ${(extraLargeDevices || largeDevices) ? 'w-1/3 flex-col' : extraSmallDevice ? 'flex-col' : 'w-full flex-row gap-7'} mbg-800 rounded mcolor-100 py-8 min-h-[20vh] max-h-[50vh]`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={`flex items-center justify-center ${(extraLargeDevices || largeDevices) ? 'w-full' : ''}`}
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
              className={`${(extraLargeDevices || largeDevices || extraSmallDevice) ? 'text-center' : 'text-start'}`}
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
