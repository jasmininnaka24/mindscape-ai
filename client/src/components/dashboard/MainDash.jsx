import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUser } from '../../UserContext'


export const MainDash = () => {

  const [materialTitle, setMaterialTitle] = useState('')
  const [materialCategory, setMaterialCategory] = useState('')
  const [materialCategories, setMaterialCategories] = useState([])
  const [unattemptedLength, setUnattemptedLength] = useState(0)
  const [familiarLength, setFamiliarLength] = useState(0)
  const [needsPracticeLength, setNeedsPracticeLength] = useState(0)
  const [itemsCount, setItemsCount] = useState(0);
  const [groupStudyPerformance, setGroupStudyPerformance] = useState(0);



  const { groupId } = useParams()
  const { user } = useUser()

  const UserId = user?.id;


  
  useEffect(() => {

    async function fetchLatestMaterialStudied() {
      try {  

        let response = '';

        if (groupId !== undefined) {
          response = await axios.get(`http://localhost:3001/studyMaterial/latestMaterialStudied/group/${groupId}`)
        } else {
          response = await axios.get(`http://localhost:3001/studyMaterial/latestMaterialStudied/personal/${UserId}`)
        }

        const latestMaterialStudied = response.data;
        
        const materialId = latestMaterialStudied[0].id;

        console.log(materialId);

        let materialCategories = '';
        let materialTitleResponse = '';
        let materialCategoryResponse = '';

        if (groupId === '' || groupId === null || groupId === undefined) {
          materialCategories = await axios.get(`http://localhost:3001/studyMaterialCategory/personal-study-material/Personal/${UserId}`)

          materialTitleResponse = await axios.get(`http://localhost:3001/studyMaterial/latestMaterialStudied/personal/${UserId}`)
          
          materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-categoryy/${materialTitleResponse.data[0].StudyMaterialsCategoryId}`)
          
        } else {
          materialCategories = await axios.get(`http://localhost:3001/studyMaterialCategory/Group/${groupId}`)

          materialTitleResponse = await axios.get(`http://localhost:3001/studyMaterial/latestMaterialStudied/group/${groupId}`)
          
          materialCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-categoryy/${materialTitleResponse.data.StudyMaterialsCategoryId}`)
        }
        


        console.log(materialCategories.data);
        
        const materialCategoriesResponse = materialCategories.data;
        
        setMaterialCategories(materialCategoriesResponse)
        if (groupId !== undefined) {
          
          setMaterialTitle(materialTitleResponse.data[0].title)       
          setMaterialCategory(materialCategories.data[0].category)
          setGroupStudyPerformance(materialTitleResponse.data[0].studyPerformance);
        } else {
          
          setMaterialTitle(materialTitleResponse.data.title)       
          setMaterialCategory(materialCategoryResponse.data.category)
          setGroupStudyPerformance(materialTitleResponse.data[0].studyPerformance);

        }

        const materialResponse = await axios.get(`http://localhost:3001/quesAns/study-material-mcq/${materialId}`);
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
  

      
  }, [UserId, groupId])


  return (
    <div className='flex items-center justify-between gap-5 my-8'>
      <div className='w-full rounded-[5px]'>
        <div className='w-full border-medium-800 min-h-[37vh] rounded-[5px] p-5'></div>

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
        <p className='font-medium text-2xl mcolor-800'>Academic Categories</p>
        <br />
        <table className='w-full'>
          <thead className='mbg-300'>
            <tr>
              <td className='w-1/2 text-center text-xl py-3 font-medium'>Categories</td>
              <td className='w-1/2 text-center text-xl py-3 font-medium'>Performance Status</td>
            </tr>
          </thead>
          <tbody>
            {materialCategories.map((item, index) => {
              return <tr className='border-bottom-thin-gray' key={index}>
                <td className='text-center py-3 text-lg mcolor-800'>{item.category}</td>
                <td className='text-center py-3 text-lg mcolor-800'>{item.studyPerformance >= 90 ? 'Passing' : 'Requires Improvement'}</td>
              </tr>
            })}
          </tbody>
        </table>

        {groupId !== undefined ? (
          <Link to={`/main/group/dashboard/category-list/${groupId}`}>
          <button className='absolute bottom-5 right-5 mbg-800 mcolor-100 px-5 py-2 rounded-[5px]'>View All Subjects</button>
        </Link>
        ) : (
          <Link to={'/main/personal/dashboard/category-list'}>
          <button className='absolute bottom-5 right-5 mbg-800 mcolor-100 px-5 py-2 rounded-[5px]'>View All Subjects</button>
          </Link>
        )}
      </div>
    </div>
  )
}
