import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useUser } from '../../UserContext';
import { useLocation } from 'react-router-dom';
import { PieChart } from '../charts/PieChart';
import Category from '@mui/icons-material/Category';
import { Navbar } from '../navbar/logged_navbar/navbar';


export const CategoryList = () => {

  const { groupId } = useParams()
  const { user } = useUser();
  const location = useLocation();
  const { tag } = location.state;


  const [materialCategories, setMaterialCategories] = useState([])
  const [materialsTopicsLength, setMaterialsTopicsLength] = useState([])
  const [categoryFor, setCategoryFor] = useState('Personal')
  const [bookmarkedStudyMaterials, setBookmarkedStudyMaterials] = useState([]);
  const [ownRecordStudyMaterials, setOwnRecordStudyMaterials] = useState([]);

  const [showCategories, setShowCategories] = useState(true)
  const [showTopicList, setShowTopicList] = useState(false)

  const [preparedLength, setPreparedLength] = useState(0)
  const [unpreparedLength, setUnpreparedLength] = useState(0)
  const [extractedCategory, setExtractedCategory] = useState([])
  const [studyMaterials, setStudyMaterials] = useState([])
  const [materialsTopicsData, setMaterialsTopicsData] = useState([])
  const [categoryID, setCategoryID] = useState(0);
  const [filteredBookmarks, setFilteredBookmarks] = useState([])
  const [filteredOwnRecord, setFilteredOwnRecord] = useState([])
  const [performanceStatus, setPerformanceStatus] = useState(0)
  const [performanceStatusArr, setPerformanceStatusArr] = useState([])

  
  const UserId = user?.id;
  const navigate = useNavigate()
  
  useEffect(() => {

    async function fetchLatestMaterialStudied() {
      try {  

        let studyMaterialResponse = []
        let ownRecordMaterials = [];
        let bookmarkedMaterials = [];
        let fetchedStudyMaterialsCategory = [];

        try {

          if (groupId === undefined) {
            studyMaterialResponse = await axios.get(`http://localhost:3001/studyMaterial/study-material-category/Personal/${UserId}`);

          } else {
            studyMaterialResponse = await axios.get(`http://localhost:3001/studyMaterial/study-material-group-category/Group/${groupId}`);
          }

          const allStudyMaterials = studyMaterialResponse.data;
      
          if (Array.isArray(allStudyMaterials)) {
            ownRecordMaterials = allStudyMaterials.filter(material => (material.tag === 'Own Record' || material.tag === 'Shared'));
            bookmarkedMaterials = allStudyMaterials.filter(material => material.tag === 'Bookmarked');
          } else {
            console.error('Error: Data is not an array', allStudyMaterials);
          }

        } catch (error) {
          console.error('Error fetching latest material studied:', error);
        }



        let studyPerf = 0;
        if (tag === 'Own Record') {
        

          if (ownRecordMaterials.length > 0) {
            fetchedStudyMaterialsCategory = await Promise.all(
              ownRecordMaterials.map(async (material, index) => {
                const materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
                studyPerf += material.studyPerformance
                return materialCategoryResponse.data; // Return the data from each promise
              })
            );

            let allRecordsOfCategories = fetchedStudyMaterialsCategory
            setOwnRecordStudyMaterials(allRecordsOfCategories)

            fetchedStudyMaterialsCategory = fetchedStudyMaterialsCategory.filter(
              (category, index, self) =>
                index === self.findIndex(t => t.id === category.id)
            );
            
            console.log(allRecordsOfCategories);
            console.log(ownRecordMaterials);


            // Step 1: Create an object to store category values and corresponding material studyPerformances
            const categoryPerformanceMap = {};

            ownRecordMaterials.forEach(material => {
                const categoryId = material.StudyMaterialsCategoryId;
                const studyPerformance = material.studyPerformance;

                if (!categoryPerformanceMap[categoryId]) {
                    categoryPerformanceMap[categoryId] = [];
                }

                categoryPerformanceMap[categoryId].push(studyPerformance);
            });

            // Step 2: Create the desired output format (flat array)
            const flatResult = Object.keys(categoryPerformanceMap).map(categoryId => {
                const studyPerformances = categoryPerformanceMap[categoryId];
                const averagePerformance = studyPerformances.reduce((sum, val) => sum + val, 0) / studyPerformances.length;

                return parseFloat(averagePerformance.toFixed(2));
            });



            setPerformanceStatusArr(flatResult);



          }

        } else {

          if (bookmarkedMaterials.length > 0) {
            fetchedStudyMaterialsCategory = await Promise.all(
              bookmarkedMaterials.map(async (material, index) => {
                const materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
                return materialCategoryResponse.data; 
                })
              );
              
              let allRecordsOfCategories = fetchedStudyMaterialsCategory
              setBookmarkedStudyMaterials(allRecordsOfCategories)

              fetchedStudyMaterialsCategory = fetchedStudyMaterialsCategory.filter(
                (category, index, self) =>
                index === self.findIndex(t => t.category === category.category)
              );
                
            
            
            // Step 1: Create an object to store category values and corresponding studyPerformances
            const categoryPerformanceMap = {};

            allRecordsOfCategories.forEach(category => {
                const categoryId = category.id;
                const categoryValue = category.category;

                if (!categoryPerformanceMap[categoryValue]) {
                    categoryPerformanceMap[categoryValue] = [];
                }

                categoryPerformanceMap[categoryValue].push(categoryId);
            });

            // Step 2: Create the desired output format
            const result = Object.keys(categoryPerformanceMap).map(category => {
                const categoryIds = categoryPerformanceMap[category];
                const studyPerformances = categoryIds.map(categoryId => {
                    const material = bookmarkedMaterials.find(mat => mat.StudyMaterialsCategoryId === categoryId);
                    return material ? material.studyPerformance : 0;
                });

                // Calculate average studyPerformance for each category
                const averagePerformance = studyPerformances.reduce((sum, val) => sum + val, 0) / studyPerformances.length;

                return averagePerformance;
            });

            setPerformanceStatusArr(result);




          }
          

        }

        setMaterialCategories(fetchedStudyMaterialsCategory)
        setPerformanceStatus(studyPerf)

        
        
    
        
        
      } catch (error) {
        console.error('Error fetching latest material studied:', error);
      }
    }
    
    fetchLatestMaterialStudied();
  


      
  }, [UserId, groupId, tag])











  async function fetchStudyMaterialsTopicList(filter,user) {
    try {

      let extractedStudyMaterials = [];
      let uniqueIds = new Set();

      if (groupId === undefined) {
        // Use Promise.all to wait for all promises to resolve
        await Promise.all(filter.map(async (material, index) => {
          try {
            let materialResponse = await axios.get(`http://localhost:3001/studyMaterial/all-study-material-personal/${UserId}/${material.id}`);
            // Check if the ID is already in the set
            if (!uniqueIds.has(material.id)) {
              extractedStudyMaterials.push(materialResponse.data);
              uniqueIds.add(material.id); // Add the ID to the set
            }
          } catch (error) {
            console.error(`Error fetching study material: ${error.message}`);
          }
        }));
      } else {

        // Use Promise.all to wait for all promises to resolve
        await Promise.all(filter.map(async (material, index) => {
          let materialResponse = await axios.get(`http://localhost:3001/studyMaterial/all-study-material-group/${groupId}/${material.id}`);
          extractedStudyMaterials.push(materialResponse.data);
        }));

      }

      
      setStudyMaterials(extractedStudyMaterials.flat());
      
      let extractedStudyMaterialsResponse = extractedStudyMaterials.flat();

      let materialsData = await Promise.all(extractedStudyMaterialsResponse.map(async (material) => {
        try {
          let extractedData = [];
      
          if (groupId === undefined) {
            extractedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment-personal/${material.id}/${UserId}`);
          } else if (categoryFor === 'Group') {
            extractedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment-group/${material.id}/${groupId}`);
          }
      
          return extractedData.data;
        } catch (error) {
          console.error('Error fetching study materials:', error);
          return null; // Handle the error accordingly
        }
      }));
      

      // const materialsData = await Promise.all(promises);
      const filteredMaterialsData = materialsData.filter(data => data !== null);

      let preparedCount = 0;
      let unpreparedCount = 0;
  
      extractedStudyMaterialsResponse.forEach(item => {

        if (item.studyPerformance >= 90.00) {
          preparedCount += 1;
        } else {
          unpreparedCount += 1;
        }
      });
  
      setPreparedLength(preparedCount);
      setUnpreparedLength(unpreparedCount);
      setMaterialsTopicsData(filteredMaterialsData);


    } catch (error) {
      console.error('Error fetching latest material studied:', error);
    }

  }
  
    

  
  
  useEffect(() => {
    // console.log('Study Materials:', studyMaterials)
  }, [UserId, categoryFor, categoryID, groupId, studyMaterials]);





  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main/personal/dashboard`} linkBackName={`Dashboard`} currentPageName={'Categories'} username={'Jennie Kim'}/>
        
        <Navbar linkBack={`/main/personal/dashboard/category-list`} linkBackName={`Categories`} currentPageName={'Topics'} username={'Jennie Kim'}/>

        <div className='my-8 border-medium-800 min-h-[40vh] rounded-[5px]'>

          {showCategories ? (
            <table className='w-full rounded-[5px]'>
              <thead className='mbg-300'>
                <tr>
                  <td className='text-center text-xl py-3 font-medium'>Categories</td>
                  <td className='text-center text-xl py-3 font-medium'>Performance Percentile</td>
                  <td className='text-center text-xl py-3 font-medium'>Performance Status</td>
                  <td className='text-center text-xl py-3 font-medium'>Number of Topics</td>
                  <td className='text-center text-xl py-3 font-medium'>View Topics</td>
                </tr>
              </thead>
              <tbody>
              {materialCategories.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((item, index) => {
                  return <tr className='border-bottom-thin-gray rounded-[5px]' key={index}>
                    <td className='text-center py-3 text-lg mcolor-800'>{item.category}</td>
                    <td className='text-center py-3 text-lg mcolor-800 w-1/4'>{performanceStatusArr[index]}%</td>
                    <td className='text-center py-3 text-lg mcolor-800'>{performanceStatusArr[index] >= 90 ? 'Passing' : 'Requires Improvement'}</td>


                    <td className='text-center py-3 text-lg mcolor-800'>
                      {(tag === 'Own Record' || tag === 'Shared') ? (
                          (() => {

                            const filteredOwnRecord = ownRecordStudyMaterials.filter(material => material.id === item.id);
                            return filteredOwnRecord.length;
                          })()

                          ) : (
                          (() => {
                            const filteredBookmarks = bookmarkedStudyMaterials.filter(material => material.category.toLowerCase() === item.category.toLowerCase());
                            return filteredBookmarks.length;
                          })()
                        )
                      }
                    </td>

                    <td className='text-center py-3 text-lg mcolor-800'>
                  
                      <button onClick={() => {
                        const filteredBookmarks = bookmarkedStudyMaterials.filter(material => material.category.toLowerCase() === item.category.toLowerCase());

                        const filteredOwnRecord = ownRecordStudyMaterials.filter(material => material.id === item.id);

                        
                        setShowCategories(false)
                        setFilteredBookmarks(filteredBookmarks)

                        let filter = (tag === 'Own Record' || tag === 'Shared') ? filteredOwnRecord : filteredBookmarks;
                        let user = categoryFor === 'Personal' ? UserId : groupId
                        fetchStudyMaterialsTopicList(filter,user);

                        
                      }}>
                        <RemoveRedEyeIcon />
                      </button>   

                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          ) : (
            <div>
              <div className='mb-12 w-full flex items-center justify-center'>
                <div className='w-1/3 min-h-[40vh] mt-10'>
                  <PieChart dataGathered={[unpreparedLength, preparedLength]} />
                </div>
                <div className='w-1/2 mt-10'>
                  <p className='text-2xl mt-3'>Performance Status: <span className='font-bold'>{performanceStatus >= 90 ? 'Passing' : 'Requires Improvement'}</span></p>
                  <p className='text-2xl mt-3'>Performance in percentile: <span className='font-bold'>{performanceStatus}%</span></p>
                  <p className='text-2xl mt-3'>Target Performance: <span className='font-bold'>90%</span></p>
                </div>
              </div>
              <div className='border-medium-800 rounded-[5px] overflow-x-auto overflow-container' style={{ height: '100%' }}>
                <table className='p-5 w-full rounded-[5px] text-center'>
                  <thead className='mbg-300'>
                    <tr>
                      <td className='text-center text-xl py-3 font-medium px-8'>Topic</td>
                      <td className='text-center text-xl py-3 font-medium px-8'>Overall <br />Performance</td>
                      <td className='text-center text-xl py-3 font-medium px-8'>Latest Assessment <br />% Score</td>
                      <td className='text-center text-xl py-3 font-medium px-8'>Confidence Level</td>
                      <td className='text-center text-xl py-3 font-medium px-8'>Improvement</td>
                      <td className='text-center text-xl py-3 font-medium px-8'>Status</td>
                      <td className='text-center text-xl py-3 font-medium px-8'>Records</td>
                    </tr>
                  </thead>
                  <tbody>

                  {studyMaterials.length > 0 && (
                    studyMaterials.map((item, index) => {
                      const materialsTopic = materialsTopicsData[index] && materialsTopicsData[index][0];

                      if (!materialsTopic) {
                        return (
                          <tr key={index}>
                            <td className='py-3 text-lg mcolor-800'>{item.title}</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>

                          </tr>
                        );
                      }

                      const assessmentScorePerf = materialsTopic.assessmentScorePerf || 'none';
                      const confidenceLevel = materialsTopic.confidenceLevel || 'none';
                      const assessmentImp = materialsTopic.assessmentImp || 'none';

                      // Check if assessmentImp is 'none', if true, skip rendering the row
                      if (assessmentImp === 'none') {
                        return (
                          <tr key={index}>
                            <td className='py-3 text-lg mcolor-800'>{item.title}</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>
                            <td className='text-center py-3 text-lg mcolor-800'>No record</td>

                          </tr>
                        );
                      }
                      return (
                        <tr className='border-bottom-thin-gray rounded-[5px]' key={index}>
                          <td className='text-center py-3 text-lg mcolor-800'>{item.title}</td>
                          <td className='text-center py-3 text-lg mcolor-800'>{item.studyPerformance}%</td>
                          <td className='text-center py-3 text-lg mcolor-800'>{assessmentImp === 'none' ? 0 : assessmentScorePerf}%</td>
                          <td className='text-center py-3 text-lg mcolor-800'>{assessmentImp === 'none' ? 0 : confidenceLevel}%</td>
                          <td className='text-center py-3 text-lg mcolor-800'>{assessmentImp === 'none' ? 0 : assessmentImp}%</td>
                          <td className='text-center py-3 text-lg mcolor-800'>{item.studyPerformance >= 90 ? 'Prepared' : 'Unprepared'}</td>
                          <td className='text-center py-3 text-lg mcolor-800'>
                            {(assessmentImp !== 'none' ) ? (
                              groupId !== undefined ? (
                                <button onClick={() => {
                                  navigate(`/main/group/dashboard/category-list/topic-list/topic-page/${groupId}/${categoryID}/${item.id}`)
                                }}>
                                  <RemoveRedEyeIcon />
                                </button>
                                
                              ) : (
                                <button onClick={() => {
        
                                  navigate(`/main/personal/dashboard/category-list/topic-list/topic-page/${categoryID}/${item.id}`)
                                }}>
                                  <RemoveRedEyeIcon />
                                </button>
                              )
                            ) : (
                              <div>No Record</div>
                            )
                            }
                          </td>
                        </tr>
                      );
                    })
                  )}
                  






    

                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>  
    </div>
  </div>  
  )
}
