import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../../UserContext'
import { DateTime, Interval } from 'luxon';
import PushPinIcon from '@mui/icons-material/PushPin';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';


export const MainDash = ({categoryFor}) => {

  const [materialTitle, setMaterialTitle] = useState('')
  const [materialCategory, setMaterialCategory] = useState('')
  const [materialCategories, setMaterialCategories] = useState([])
  const [unattemptedLength, setUnattemptedLength] = useState(0)
  const [familiarLength, setFamiliarLength] = useState(0)
  const [needsPracticeLength, setNeedsPracticeLength] = useState(0)
  const [itemsCount, setItemsCount] = useState(0);
  const [groupStudyPerformance, setGroupStudyPerformance] = useState(0);
  const [listOfTasks, setListOfTasks] = useState([]);
  const [tag, setTag] = useState('Own Record')
  const [ownRecordStudyMaterials, setOwnRecordStudyMaterials] = useState([]);
  const [bookmarkedStudyMaterials, setBookmarkedStudyMaterials] = useState([]);

  const [bookmarkedMaterialsIds, setBookmarkedMaterialsIds] = useState([]);
  const [performanceStatusArr, setPerformanceStatusArr] = useState([])


  const { groupId } = useParams()
  const { user } = useUser()
  const navigate = useNavigate()

  const UserId = user?.id;


  
  useEffect(() => {

    async function fetchLatestMaterialStudied() {
      try {  

        let renderLink = ''

        if (groupId === undefined) {
          renderLink = `http://localhost:3001/tasks/personal/${UserId}`;
        } else {
          renderLink = `http://localhost:3001/tasks/group/${groupId}`;
        }
  
        const tasksResponse = await axios.get(renderLink);
        setListOfTasks(tasksResponse.data);

  

        




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



          if (allStudyMaterials.length > 0) {
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
                const materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-categoryy/${material.StudyMaterialsCategoryId}`);
                return materialCategoryResponse.data; // Return the data from each promise
              })
            );


            let allRecordsOfCategories = fetchedStudyMaterialsCategory
            setOwnRecordStudyMaterials(allRecordsOfCategories)

            fetchedStudyMaterialsCategory = fetchedStudyMaterialsCategory.filter(
              (category, index, self) =>
                index === self.findIndex(t => t.id === category.id)
            );


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

        
        
















        let materialCategoriesOwnRecord = '';
        let materialResponseOwnRecord = '';
        let materialCategoryResponseOwnRecord = '';
        let materialIdResponse = 0




        if (groupId === '' || groupId === null || groupId === undefined) {

          try {
            
            materialResponseOwnRecord = await axios.get(`http://localhost:3001/studyMaterial/latestMaterialStudied/personal/${UserId}`)
            

            materialIdResponse = materialResponseOwnRecord.data[0].StudyMaterialsCategoryId;
            
            materialCategoryResponseOwnRecord = await axios.get(`http://localhost:3001/studyMaterialCategory/get-categoryy/${materialIdResponse}`)
          } catch (error) {
            console.log(error);
          }
          
        } else {

          try {
  
            materialResponseOwnRecord = await axios.get(`http://localhost:3001/studyMaterial/latestMaterialStudied/group/${groupId}`)

            materialIdResponse = materialResponseOwnRecord.data[0].StudyMaterialsCategoryId;
            
            materialCategoryResponseOwnRecord = await axios.get(`http://localhost:3001/studyMaterialCategory/get-categoryy/${materialIdResponse}`)


          } catch (error) {
            console.log(error);
          }
        }
          
        


        console.log();
     

        setMaterialTitle(materialResponseOwnRecord.data[0].title)    
        setMaterialCategory(materialCategoryResponseOwnRecord.data.category)
        setGroupStudyPerformance(materialResponseOwnRecord.data[0].studyPerformance);
    
        
             

        const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialResponseOwnRecord.data[0].id}`);
        const fetchedQA = materialResponse.data;

        setItemsCount(fetchedQA.length)
        
        setUnattemptedLength(fetchedQA.filter(familiar => familiar.response_state === 'Unattempted').length);
        setFamiliarLength(fetchedQA.filter(familiar => familiar.response_state === 'Correct').length);
        setNeedsPracticeLength(fetchedQA.filter(familiar => familiar.response_state === 'Wrong').length);



        
        
      } catch (error) {
        console.error('Error fetching latest material studied:', error);
      }
    }
    
    fetchLatestMaterialStudied();
  

      
  }, [UserId, groupId, tag])


  return (
    <div className='flex items-center justify-between gap-5 my-8'>
      <div className='w-full rounded-[5px]'>
        <div className='w-full border-medium-800 min-h-[37vh] rounded-[5px] relative'>
          <div className='max-h-[36vh] w-full p-5' style={{ overflowY: 'auto' }}>
            <p className='text-2xl font-normal'>List of Tasks</p>

            {listOfTasks
              .filter(task => task.completedTask === 'Uncompleted') 
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
              .map((task, key) => {
                const currentDateTime = DateTime.now();
                const dueDateTime = DateTime.fromISO(task.dueDate);
                const timeDifference = Interval.fromDateTimes(currentDateTime, dueDateTime);

                // Calculate the time difference in days, hours, and minutes
                const { days, hours, minutes } = timeDifference.toDuration(['days', 'hours', 'minutes']).toObject();

                // Round off hours and minutes
                const roundedHours = Math.round(hours);
                const roundedMinutes = Math.round(minutes);

                // Check if the task is overdue
                const isOverdue = timeDifference.isPast;

                // Create an array to store the time parts to include
                const timeParts = [];

                // Conditionally include "days" if days > 0
                if (days > 0) {
                  timeParts.push(`${days} day${days > 1 ? 's' : ''}`);
                }

                // Conditionally include "hours" if roundedHours > 0
                if (roundedHours > 0) {
                  timeParts.push(`${roundedHours} hour${roundedHours > 1 ? 's' : ''}`);
                }

                // Conditionally include "minutes" if roundedMinutes > 0
                if (roundedMinutes > 0) {
                  timeParts.push(`${roundedMinutes} minute${roundedMinutes > 1 ? 's' : ''}`);
                }

                // Format the time difference based on included time parts and overdue status
                let formattedTimeDifference = '';

                if (isOverdue) {
                  formattedTimeDifference = 'On time';
                } else if (timeParts.length === 0) {
                  // Handle case when all time components are zero
                  formattedTimeDifference = `Overdue`;
                } else {
                  // Handle case when the task is not overdue
                  formattedTimeDifference = `${timeParts.join(' ')} from now`;
                }

                const dueDate = new Date(task.dueDate);

                // Format the date as "Month Day, Year"
                const formattedDueDate = dueDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                const formattedTime = dueDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });


                const abbreviatedMonth = formattedDueDate.slice(0, 3);
                const formattedDueDateAbbreviated = `${abbreviatedMonth} ${dueDate.getDate()}, ${dueDate.getFullYear()}`;

      
                return (
                  <div key={key} className='flex items-start justify-between w-full mbg-200 px-4 py-3 border-thin-800 rounded my-3'>
                    <div className='w-3/4'  style={{ whiteSpace: 'pre-wrap' }}>
                      <div><PushPinIcon className='text-red-dark' /> {task.task}</div>
                      <div className='mt-3'><WatchLaterIcon sx={{ fontSize: '22px' }} /> {formattedDueDateAbbreviated}, {formattedTime}</div>
                      <div className={`mt-2`}><PendingActionsIcon/> <span className={`${formattedTimeDifference === 'Overdue' ? 'text-red-dark' : ''}`}>{formattedTimeDifference}</span></div>
                    </div>
                  <br />
                </div>
                )
              })}
          </div>

          <div className='absolute bottom-0 right-0 w-full mbg-200'>
            <div className='flex justify-end py-2 px-4'>
              <Link to={`/main/${groupId === undefined ? 'personal' : 'group'}/tasks/${groupId === undefined ? '' : groupId}`}>
                <button className='px-4 py-1 mbg-800 mcolor-100 rounded'>
                  View all Tasks
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className='w-full border-medium-800 min-h-[37vh] rounded-[5px] py- 5 px-10 mt-10 relative'>

          <div className='flex items-center justify-between'>
            <div>
              <p className='text-lg font-medium mcolor-800 mt-8 mb-1'>Recently Studying</p>
              <p className='font-bold text-xl my-5 mcolor-800'>
                {materialCategory === null || materialTitle === null || materialCategory === undefined || materialTitle === undefined
                  ? 'No material has been studied'
                  : `${materialCategory} - ${materialTitle}`}
              </p>
              <table className='mcolor-800'>
                <thead>
                  <tr>
                    <td className='px-3 border-medium-800'>Unattemted</td>
                    <td className='px-3 border-medium-800'>Familiar</td>
                    <td className='px-3 border-medium-800'>Unfamiliar</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className='text-center'>
                    <td className='px-3 border-medium-800'>{unattemptedLength} item{unattemptedLength < 2 ? '' : 's'}</td>
                    <td className='px-3 border-medium-800'>{familiarLength} item{familiarLength < 2 ? '' : 's'}</td>
                    <td className='px-3 border-medium-800'>{needsPracticeLength} item{needsPracticeLength < 2 ? '' : 's'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className='mt-5'>
              <div className='text-center'>
                <p className='text-4xl mcolor-800 font-medium'>
                  {
                    isNaN((familiarLength / itemsCount) * 100) ? 0 + '%' : ((familiarLength / itemsCount) * 100).toFixed(2) + '%'
                  }
                </p>
                <p className='mt-1 mcolor-400'>Study Performance</p>
              </div>
              <button className='absolute bottom-5 right-5 mbg-800 mcolor-100 px-5 py-2 rounded-[5px]'>View Reviewer</button>
            </div>
          </div>

        </div>


      </div>
      <div className='w-full border-medium-800 rounded-[5px] p-5 min-h-[80vh] relative'>

        <div className='flex items-center justify-between'>
          <p className='font-medium text-2xl mcolor-800'>{tag === 'Own Record' ? 'Own Material' : 'Bookmarked'} Records</p>
          <button className='mbg-700 px-4 py-2 mcolor-100 rounded' onClick={() =>{
            setTag(tag === 'Own Record' ? 'Bookmarked' : 'Own Record')
          }}>Switch to {tag === 'Own Record' ? 'Bookmarked' : 'Own Record'} Records</button>
        </div>

        <br />
        <table className='w-full'>
          <thead className='mbg-300'>
            <tr>
              <td className='w-1/4 text-center text-xl py-3 font-medium'>Categories</td>
              <td className='w-1/2 text-center text-xl py-3 font-medium'>Performance Status</td>
              <td className='w-1/2 text-center text-xl py-3 font-medium'>In Percentage</td>
            </tr>
          </thead>
          <tbody>

          
          {materialCategories && materialCategories.length > 0 ? (
            materialCategories.slice().sort((a, b) => {
              if (tag === 'Own Record') {
                return new Date(a.createdAt) - new Date(b.createdAt);
              } else {
                // No sorting if the tag is not 'Own Record'
                return 0;
              }
            }).map((item, index) => (
              <tr className='border-bottom-thin-gray' key={index}>
                <td className='text-center py-3 text-lg mcolor-800'>{item.category}</td>
                <td className='text-center py-3 text-lg mcolor-800'>{performanceStatusArr[index] >= 90 ? 'Passing' : 'Requires Improvement'}</td>
                <td className='text-center py-3 text-lg mcolor-800'>{performanceStatusArr[index]}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className='text-center py-3 text-lg mcolor-800'>No data available</td>
            </tr>
          )}

          </tbody>
        </table>

        {groupId !== undefined ? (
          <button className='absolute bottom-5 right-5 mbg-800 mcolor-100 px-5 py-2 rounded-[5px]' onClick={() => {
            navigate(`/main/group/dashboard/category-list/${groupId}`, {
            state: {
              tag: tag
            }
          })
          }}>View All Subjects</button>
        ) : (
            <button className='absolute bottom-5 right-5 mbg-800 mcolor-100 px-5 py-2 rounded-[5px]' onClick={() => {
              navigate('/main/personal/dashboard/category-list', {
                state: {
                  tag: tag
                }
              })
            }}>View All Subjects</button>
        )}
      </div>
    </div>
  )
}
