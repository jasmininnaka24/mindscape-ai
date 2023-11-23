import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navbar } from '../navbar/logged_navbar/navbar';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const StudyAreaGP = (props) => {
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { id } = useParams();
  const groupNameId = id;

  const { UserId, categoryFor } = props;
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
  const [isCodeCopied, setIsCodeCopied] = useState("");
  const [isGroupNameChanged, setIsGroupNameChanged] = useState("");
  const [prevGroupName, setPrevGroupName] = useState("");
  const [savedGroupNotif, setSavedGroupNotif] = useState('hidden');
  const [userList, setUserList] = useState([]);
  const [tempUserList, setTempUserList] = useState([]);
  const [groupMemberIndex, setGroupMemberIndex] = useState("");

  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({}); 





  // shared materials usestates
  const [sharedMaterials, setSharedMaterials] = useState([]);
  const [sharedMaterialsCategories, setSharedMaterialsCategories] = useState([]);






  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };  

  const addToModalList = () => {
    if(currentModalVal !== '') {
      setModalList([...modalList, currentModalVal]);
      setCurrentModalVal("")
    } else {
      alert("Does not accept empty field.")
    }
  }
  
  const saveCategories = () => {
    if (modalList.length > 0) {
      modalList.forEach((item, index) => {
        let categoryData = {
          category: item,
          categoryFor: categoryFor,
          StudyGroupId: groupNameId,
          UserId: UserId,
        };
  
        axios.post(`http://localhost:3001/studyMaterialCategory/`, categoryData)
          .then(response => {
            // Handle success if needed
          })
          .catch(error => {
            // Handle error if needed
          });
      });
  
      setHidden("hidden")
      setModalList([]);
      setCurrentModalVal("");
      setCategoryModal("hidden");
      
      setTimeout(() => {
        setSavedGroupNotif("")
      }, 500);
      setTimeout(() => {
        setSavedGroupNotif("hidden")
        window.location.reload();
      }, 1800);
    } else {
      alert("Cannot save empty field.");
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
            const response = await axios.put(`http://localhost:3001/studyGroup/update-group/${groupId}`, {
              groupName: groupName,
            });
    
            // console.log(groupName);
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

  const removeSelectedUser = (itemId, groupNameId) => {
    const updatedTempUserList = tempUserList.filter(user => user.id !== itemId);

    const updatedUserList = userList.filter(user => user.id !== itemId);  
    setTempUserList(updatedTempUserList);
    setUserList(updatedUserList);

    axios.delete(`http://localhost:3001/studyGroupMembers/remove-member/${groupNameId}/${itemId}`).then(response => {
      // console.log(response.data); 
    }).catch(error => {
      console.error(error);
    });
  };


  // console.log(groupMemberIndex);
  useEffect(() => {
    const fetchData = async () => {
      const reloadParamExists = searchParams.has('reload');
  
      if (reloadParamExists) {
        window.location.reload();
        if (categoryFor === 'Personal') {
          navigate(`/main/personal/study-area/`);
        } else {
          navigate(`/main/group/study-area/${id}`);
        }
      }
  
      let studyMaterialCategoryLink = '';
      let studyMaterialLink = '';
  
      if (categoryFor === 'Personal') {
        studyMaterialCategoryLink = `http://localhost:3001/studyMaterialCategory/personal-study-material/${categoryFor}/${UserId}`;
        studyMaterialLink = `http://localhost:3001/studyMaterial/study-material-category/${categoryFor}/${UserId}`;
      } else {
        studyMaterialCategoryLink = `http://localhost:3001/studyMaterialCategory/${categoryFor}/${groupNameId}`;
        studyMaterialLink = `http://localhost:3001/studyMaterial/study-material-group-category/${categoryFor}/${groupNameId}`;
      }
  
      if (categoryFor === 'Group') {
        try {
          const groupResponse = await axios.get(`http://localhost:3001/studyGroup/extract-all-group/${groupNameId}`);
          setCode(groupResponse.data.code);
          setGroupName(groupResponse.data.groupName);
          setPrevGroupName(groupResponse.data.groupName);
  
          const userResponse = await axios.get(`http://localhost:3001/studyGroupMembers/get-members/${groupNameId}`);
          setGroupMemberIndex(userResponse.data);
  
          const userListResponse = userResponse.data;
          const allUserResponses = [];
  
          for (const user of userListResponse) {
            try {
              const userDetails = await axios.get(`http://localhost:3001/users/get-user/${user.UserId}`);
              allUserResponses.push(userDetails.data);
  
              if (allUserResponses.length === userListResponse.length) {
                setUserList(allUserResponses);
                setTempUserList(allUserResponses);
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          }
        } catch (error) {
          console.error("Error fetching group data:", error);
        }
      }
  
      try {
        const catPersonalResponse = await axios.get(studyMaterialCategoryLink);
        setMaterialCategories(catPersonalResponse.data);
        console.log(catPersonalResponse.data);
  
        const groupResponse = await axios.get(studyMaterialLink);
        let sortedData = groupResponse.data.sort((a, b) => b.id - a.id);

        let ownOrSharedRecords = sortedData.filter(tag => tag.tag !== 'Bookmarked');
        let bookmarkedStudyMaterials = groupResponse.data.filter(tag => tag.tag === 'Bookmarked');


        
        
        setSharedMaterials(bookmarkedStudyMaterials);

        const fetchedSharedStudyMaterialCategory = await Promise.all(
          bookmarkedStudyMaterials.map(async (material, index) => {
            const materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
            return materialCategoryResponse.data; // Return the data from each promise
          })
        );


        setSharedMaterialsCategories(fetchedSharedStudyMaterialCategory)
        setSudyMaterialsCategory(ownOrSharedRecords);
  
        const lastMaterial = sortedData.length > 0 ? sortedData[0] : null;
        setLastMaterial(lastMaterial);






  
        if (lastMaterial && lastMaterial.StudyMaterialsCategoryId && categoryFor) {
          let studyLastMaterialLink;
  
          if (categoryFor === 'Personal') {
            studyLastMaterialLink = `http://localhost:3001/studyMaterialCategory/get-lastmaterial/${lastMaterial.StudyMaterialsCategoryId}/${categoryFor}/${UserId}`;
          } else {
            studyLastMaterialLink = `http://localhost:3001/studyMaterialCategory/get-lastmaterial/${lastMaterial.StudyMaterialsCategoryId}/${groupNameId}/${categoryFor}/${UserId}`;
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
        } else {
          console.error('Missing required data for constructing the URL and making the request');
        }
  
        if (lastMaterial) {
          try {
            const mcqResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${lastMaterial.id}`);
            setMaterialMCQ(mcqResponse.data);
  
            if (Array.isArray(mcqResponse.data)) {
              const materialChoices = mcqResponse.data.map(async (materialChoice) => {
                try {
                  const choiceResponse = await axios.get(`http://localhost:3001/quesAnsChoices/study-material/${lastMaterial.id}/${materialChoice.id}`);
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
            const revResponse = await axios.get(`http://localhost:3001/quesRev/study-material-rev/${lastMaterial.id}`);
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
    };
  
    fetchData();

  }, [UserId, categoryFor, groupNameId, navigate, currentModalVal, modalList, isCodeCopied]);
  

  
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


  return (
    <div className="relative poppins mcolor-900 flex justify-start items-start">
      
      {/* modal */}
        <div style={{ zIndex: 1000 }} className={`${hidden} absolute py-24 top-0 left-0 bottom-0 modal-bg w-full h-full`}>
          <div className='flex justify-center'>
            <div className='mbg-100 min-h-[45vh] w-1/3 z-10 relative p-10 rounded-[5px]'>

            <button className='absolute right-4 top-3 text-xl' onClick={() => {
              setHidden("hidden");
              setCategoryModal("hidden");
              setGroupMemberModal("hidden");
              }}>
              ✖
            </button>

            <div className={categoryModal}>
              <p className='text-center text-2xl font-medium mcolor-800 my-5'>Add a category</p>
              <div className="groupName flex flex-col">

                <div className='relative'>
                  <input type="text" placeholder='Group name...' className='border-medium-800-scale px-5 py-2 w-full rounded-[5px] outline-none border-none' onChange={(event) => {setCurrentModalVal(event.target.value)}} value={currentModalVal === '' ? '' : currentModalVal} />
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
                  <input type="text" value={groupName} className='border-thin-800 text-center w-full py-2 rounded-[3px]' onChange={(event) => setGroupName(event.target.value)} />
                  <button onClick={changeGroupName} className='px-4 py-2 mbg-800 mcolor-100 rounded-[3px] border-thin-800'>Change</button>
                </div>
                {isGroupNameChanged !== '' && (
                  <p className='text-center mcolor-700 my-3'>{isGroupNameChanged}</p>
                  )}

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
   
      {/* Side */}
      <div className={`flex flex-col justify-between h-[100vh] w-1/4 p-5 sidebar mbg-300 mcolor-900`} style={{ overflowY: 'auto' }}>
        <div className="my-5 shelf-categories">
          
          <p className="text-2xl mb-10 font-bold text-center opacity-90">{categoryFor === 'Group' ? `${groupName.toUpperCase()}'S ` : 'PERSONAL'} SHELF</p>
          <div>
            {materialCategories.length > 0 ? (
              <div>
                <span>{categoryFor === 'Personal' ? 'My' : 'Our'} Study Material</span>
                <button onClick={toggleExpand} className='ml-2'>{!isExpanded ? <i className="fa-solid fa-chevron-down"></i> : <i className="fa-solid fa-chevron-up"></i>}</button>
              </div>
              ) : (
                <p className='text-center'>No materials saved.</p>
              )}
            <div className={`expandable-container ${isExpanded ? 'expanded' : ''}`}>
              {materialCategories.length > 0 && (
                isExpanded && materialCategories.map((category) => (
                <div className="shelf-category my-5" key={category.id}>
                  <div className="shadows mbg-100 mt-2 mcolor-900 p-4 rounded-[5px]">
                    <div className='flex items-center'>
                      <div className="text-lg font-medium">{category.category}</div>
                      <button onClick={() => toggleExpandId(category.id)} className='ml-2'>
                        {!expandedCategories[category.id] ? (
                          <i className="fa-solid fa-chevron-down"></i>
                        ) : (
                          <i className="fa-solid fa-chevron-up"></i>
                        )}
                      </button>
                    </div>
                    {/* Check if the category is expanded before rendering the study materials */}
                    <div>
                      
                    </div>
                    {expandedCategories[category.id] && (
                      studyMaterialsCategory
                        .filter((material) => material.StudyMaterialsCategoryId === category.id)
                        .map((material, index) => (
                          <p key={index} className='mt-2'>
                            <i className="fa-solid fa-book mr-2"></i>
                            {material.title}
                          </p>
                        ))
                    )}


                    {expandedCategories[category.id] && studyMaterialsCategory
                      .filter((material) => material.StudyMaterialsCategoryId === category.id)
                      .length === 0 && (
                        <p className='text-center mt-2'>No own record of study material under this category</p>
                      )}




                  </div>
                </div>
                ))
              )}
            </div>
          </div>

          {/* <div>
            <div>
              <span>{categoryFor === 'Personal' ? 'My' : 'Our'} Bookmarks</span>
              <button onClick={toggleExpand} className='ml-2'>{!isExpanded ? <i className="fa-solid fa-chevron-down"></i> : <i className="fa-solid fa-chevron-up"></i>}</button>
            </div>
          </div> */}
          
          <p className='mb-5 mt-5'>Bookmarked Materials:</p>
          {sharedMaterials.map((material, index) => (
            <p key={index} className='mt-2 shadows mcolor-900 rounded-[5px] p-5 my-3   mbg-100'>
              <i className="fa-solid fa-book mr-2"></i>
              {material.title} - {sharedMaterialsCategories[index]?.category || 'No Category'}
            </p>
          ))}

        </div>
      </div>

      <div className='py-6 px-10 w-3/4 '>
        
        <Navbar linkBack={`/main/${categoryForToLower}/`} linkBackName={`${categoryFor === 'Personal' ? 'Personal Study Area' : 'Groups'}`} currentPageName={'Study Area'} username={'Jennie Kim'}/>
        

        <div className='flex justify-between items-center mt-10 mb-6'>

          <button className='rounded-[8px] px-6 py-2 font-medium font-lg mbg-800 mcolor-100' onClick={() => {
            materialCategories.length > 0 ? (
              navigate(`/main/${categoryForToLower}/study-area/qa-gen/${categoryFor === 'Group' ? groupNameId : ''}`)
            ) : (
              alert('No category saved. Add a category first.')
            )
          }}>Create Reviewer</button>

          <div>
            <button className='mx-1 mbg-300 mcolor-800 px-6 py-2 rounded-[5px] font-medium font-lg' onClick={() => {
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

        <p className={`${savedGroupNotif} my-5 py-2 mbg-300 mcolor-800 text-center rounded-[5px] text-lg`}>New categories added!</p>


        <div>
          {lastMaterial !== null ? (
            <div className='relative'>
              <p className='text-xl mcolor-900 mb-3'>Latest Uploaded Reviewer: {lastMaterial.title} from {materialCategory}</p>

              <section className="border scroll-box max-h-[63vh] min-h-[63vh]">
                <div className='gap-2 flex justify-between items-start'>
                  <button
                    onClick={() => showContent(1)}
                    className={`w-full py-3 text-lg rounded-[5px] font-medium ${activeButton === 1 ? '' : 'mbg-300'}`}
                  >
                    Lesson
                  </button>
                  {/* <button
                    onClick={() => showContent(2)}
                    className={`w-full py-3 text-lg rounded-[5px] font-medium ${activeButton === 2 ? '' : 'mbg-300'}`}
                  >
                    Questions and Answers
                  </button> */}
                  <button
                    onClick={() => showContent(3)}
                    className={`w-full py-3 text-lg rounded-[5px] font-medium ${activeButton === 3 ? '' : 'mbg-300'}`}
                  >
                    Notes Reviewer
                  </button>
                </div>
                <div className='p-10'>
                  {showLesson && lastMaterial && <div>{lastMaterial.body}</div>}
                  {/* {showMCQAs && materialMCQ && (
                    <div>
                      {materialMCQ.map((material) => (
                        <div className='mb-10' key={material.id}>
                          <p className='my-2 mcolor-900 font-bold'>{material.question}</p>
                          <p className='font-medium'>Answer: <span className='text-emerald-500'>{material.answer}</span></p>
                          <ul>
                            {materialMCQChoices.filter((choice) => choice.QuesAnId === material.id).map((choice, index) => (
                              <li key={index}>{choice.choice}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )} */}
                  {showRev && materialRev && (
                    <div>
                      {materialRev.map((material) => (
                        <div className='mb-10'>
                          <p className='my-1 mcolor-900 font-bold'>{material.question}</p>
                          <p className='font-medium mcolor-700'>Answer: <span className='mcolor-900 font-medium'>{material.answer}</span></p>
                        </div>
                      ))}
                      <div className='mb-[-1.5rem]'></div>
                    </div>
                  )}
                </div>
              </section>
              <div className='flex items-center justify-end absolute right-0 bottom-[-.8rem]'>
                <Link to={`/main/${categoryForToLower}/study-area/${categoryFor.toLowerCase()}-review/${groupNameId !== undefined ? groupNameId + '/' : ''}${lastMaterial.id}`} className='mbg-800 mcolor-100 rounded-[5px] px-12 py-2'>View Reviewer</Link>
              </div>
            </div>
          ) : (
            <div className='pt-10 text-center text-xl'>No Uploaded Reviewer Appears.</div>
          )}
        </div>
      </div>
    </div>
  );
};
