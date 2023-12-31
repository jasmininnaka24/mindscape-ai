import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useUser } from '../../UserContext';
import { useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../urlConfig';


export const CategoryList = ({categoryFor}) => {

  const { groupId } = useParams()
  const { user } = useUser();
  const location = useLocation();
  const { tag } = location.state;


  const [materialCategories, setMaterialCategories] = useState([])
  const [materialsTopicsLength, setMaterialsTopicsLength] = useState([])
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
            studyMaterialResponse = await axios.get(`${SERVER_URL}/studyMaterial/study-material-category/Personal/${UserId}`);

          } else {
            studyMaterialResponse = await axios.get(`${SERVER_URL}/studyMaterial/study-material-group-category/Group/${groupId}`);
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



        if (tag === 'Own Record') {
        

          if (ownRecordMaterials.length > 0) {
            fetchedStudyMaterialsCategory = await Promise.all(
              ownRecordMaterials.map(async (material, index) => {
                const materialCategoryResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
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
                const materialCategoryResponse = await axios.get(`${SERVER_URL}/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
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

        
        
    
        
        
      } catch (error) {
        console.error('Error fetching latest material studied:', error);
      }
    }
    
    fetchLatestMaterialStudied();
  


      
  }, [UserId, groupId, tag])


    

  
  
  useEffect(() => {
    // console.log('Study Materials:', studyMaterials)
  }, [UserId, categoryFor, categoryID, groupId, studyMaterials]);





  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
       

        <div className='my-8 border-medium-800 min-h-[40vh] rounded-[5px]'>

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
                {materialCategories.slice().sort((a, b) => {
                  if (tag === 'Own Record') {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                  } else {
                    // No sorting if the tag is not 'Own Record'
                    return 0;
                  }
                }).map((item, index) => {
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
                        setFilteredOwnRecord(filteredOwnRecord)
                        let performanceStatusGet = performanceStatusArr[index]

                        let filter = (tag === 'Own Record' || tag === 'Shared') ? filteredOwnRecord : filteredBookmarks;
                        let user = categoryFor.toLowerCase()

                        
                        let linkBack = ''
                        if (categoryFor === 'Personal') {
                          linkBack = `/main/${user}/dashboard/category-list/topic-list/${item.id}`
                        } else {
                          linkBack = `/main/${user}/dashboard/category-list/topic-list/${groupId}/${item.id}`
                        }
                        
                        navigate(linkBack, {
                            state: {
                              filter: filter,
                              performanceStatus: performanceStatusGet,
                              tag: tag
                            }
                          })
                        }

                        
                      }>
                        <RemoveRedEyeIcon />
                      </button>   

                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          
        </div>  
    </div>
  </div>  
  )
}
