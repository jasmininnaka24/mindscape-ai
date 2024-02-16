import React, { useEffect, useState } from 'react';
import './mainpage.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../UserContext';
import axios from 'axios';
import { SERVER_URL } from '../../urlConfig';
import { fetchUserData } from '../../userAPI';
import { useDropzone } from 'react-dropzone';

import { Sidebar } from '../../components/sidebar/Sidebar';

// animation import
import { motion  } from 'framer-motion';

// responsive sizes
import { useResponsiveSizes } from '../../components/useResponsiveSizes'; 


// icon imports
import LaunchIcon from '@mui/icons-material/Launch';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';


export const MainPage = () => {

  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });


  // other usestates



  const [groupListLength, setGroupListLength] = useState(0);
  const [contributedMaterialsLength, setContributedMaterialsLength] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [personalStudyMaterials, setPersonalStudyMaterials] = useState([]);
  const [personalStudyMaterialsCategory, setPersonalStudyMaterialsCategory] = useState([]);
  const [groupStudyMaterials, setGroupStudyMaterials] = useState([]);
  const [groupStudyMaterialsCategory, setGroupStudyMaterialsCategory] = useState([]);

  const [sharedMaterials, setSharedMaterials] = useState([]);
  const [sharedMaterialsCategory, setSharedMaterialsCategory] = useState([]);
  const [filteredSharedCategories, setFilteredSharedCategories] = useState([]);
  const [groupList, setGroupList] = useState([]);






  // tabs
  const [image, setImage] = useState('');




  const [showPassword, setShowPassword] = useState(false);


  const [loading, setLoading] = useState(true);
  const [loadOnce, setLoadOnce] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);


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

      <Sidebar currentPage={'personal'}/>
        
      <div className={`h-[100vh] flex flex-col items-center justify-between py-2 ${extraLargeDevices && 'w-1/6'} mbg-800`}></div>




      <div className={`flex-1 mbg-200 w-full mx-5 pt-5`}>


        <div className='flex items-center relative my-5'>
          <div className='w-1/3'>
            <input
              type="text"
              placeholder="Search for a user..."
              className="border-thin-800 rounded py-2 px-8 w-full"
              value={searchTerm}
              onChange={(event) => handleSearch(event.target.value)}
            />
          </div>


          {searchTerm && (
            <div className='absolute mbg-100 top-12 p-3 border-thin-800 w-1/3 rounded max-h-[50vh]' style={{ overflowY: 'auto' }}>
              <p className='font-medium mcolor-800 text-lg'>Search Results: </p>
              {searchResults.map((user) => (
                <div key={user.id} className='my-4 flex items-center justify-between' style={{ borderBottom: '1px #999 solid' }}>
                  <p><PersonOutlineIcon className='mr-1' />{user.username}</p>
                  <Link to={`/main/profile/${user.id}`}><LaunchIcon fontSize='small'/></Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
    )
  }
}
