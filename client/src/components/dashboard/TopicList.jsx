import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { PieChart } from '../charts/PieChart';
import Category from '@mui/icons-material/Category';

export const TopicList = ({categoryFor}) => {

  const [studyMaterials, setStudyMaterials] = useState([])
  const [materialsTopicsData, setMaterialsTopicsData] = useState([])
  const [preparedLength, setPreparedLength] = useState(0)
  const [unpreparedLength, setUnpreparedLength] = useState(0)
  const [extractedCategory, setExtractedCategory] = useState([])

  const { categoryID } = useParams()

  const UserId = 1;
  
  useEffect(() => {
    async function fetchLatestMaterialStudied() {
      try {
        const extractedCategoryResponse = await axios.get(`http://localhost:3001/studyMaterialCategory/get-lastmaterial/${categoryID}/${categoryFor}/${UserId}`);
        const extractedCategoryData = extractedCategoryResponse.data;
        setExtractedCategory(extractedCategoryData)

        const extractedStudyMaterials = await axios.get(`http://localhost:3001/studyMaterial/all-study-material/${categoryID}`);
        const extractedStudyMaterialsResponse = extractedStudyMaterials.data;
        setStudyMaterials(extractedStudyMaterialsResponse);
    



        const fetchMaterialsLength = async () => {
          const promises = extractedStudyMaterialsResponse.map(async (material) => {
            try {
              const extractedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment/${material.id}`);
              return extractedData.data;
            } catch (error) {
              console.error('Error fetching study materials:', error);
              return null; // Handle the error accordingly
            }
          });
    
          const materialsData = await Promise.all(promises);
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
        };
    
        fetchMaterialsLength();
          


        

        
      } catch (error) {
        console.error('Error fetching latest material studied:', error);
      }
    }
    
    fetchLatestMaterialStudied();
    

    
  }, [categoryID])



  return (
    <div className='my-8'>
        <div className='mb-12 w-full flex items-center justify-center'>
          <div className='w-1/3 min-h-[40vh] mt-10'>
            <PieChart dataGathered={[unpreparedLength, preparedLength]} />
          </div>
          <div className='w-1/2 mt-10'>
            <p className='text-2xl mt-3'>Performance Status: <span className='font-bold'>{extractedCategory.studyPerformance >= 90 ? 'Passing' : 'Requires Improvement'}</span></p>
            <p className='text-2xl mt-3'>Performance in percentile: <span className='font-bold'>{extractedCategory.studyPerformance}%</span></p>
            <p className='text-2xl mt-3'>Target Performance: <span className='font-bold'>90%</span></p>
          </div>
        </div>
      <div className='border-medium-800 min-h-[80vh] rounded-[5px] overflow-x-auto overflow-container'>
        <table className='p-5 w-full rounded-[5px] text-center'>
          <thead className='mbg-300'>
            <tr>
              <td className='text-center text-xl py-3 font-medium px-10'>Topic</td>
              <td className='text-center text-xl py-3 font-medium px-10'>Study <br />Performance</td>
              <td className='text-center text-xl py-3 font-medium px-10'>Latest Assessment <br />% Score</td>
              <td className='text-center text-xl py-3 font-medium px-10'>Confidence Level</td>
              <td className='text-center text-xl py-3 font-medium px-10'>Improvement</td>
              <td className='text-center text-xl py-3 font-medium px-10'>Status</td>
              <td className='text-center text-xl py-3 font-medium px-10'>Records</td>
            </tr>
          </thead>
          <tbody>
            {studyMaterials.map((item, index) => {
              const assessmentScorePerf = materialsTopicsData[index]?.[0]?.assessmentScorePerf || 'N/A';
              const confidenceLevel = materialsTopicsData[index]?.[0]?.confidenceLevel || 'N/A';
              const assessmentImp = materialsTopicsData[index]?.[0]?.assessmentImp || 'N/A';

              return <tr className='border-bottom-thin-gray rounded-[5px]' key={index}>
                <td className='text-center py-3 text-lg mcolor-800'>{item.title}</td>
                <td className='text-center py-3 text-lg mcolor-800'>{item.studyPerformance}%</td>
                <td className='text-center py-3 text-lg mcolor-800'>{assessmentScorePerf}%</td>
                <td className='text-center py-3 text-lg mcolor-800'>{confidenceLevel}%</td>
                <td className='text-center py-3 text-lg mcolor-800'>{assessmentImp}%</td>
                <td className='text-center py-3 text-lg mcolor-800'>{item.studyPerformance >= 90 ? 'Prepared' : 'Unprepared'}</td>
                <td className='text-center py-3 text-lg mcolor-800'>
                  <Link to={`/main/personal/dashboard/category-list/topic-list/topic-page/${categoryID}/${item.id}`}><RemoveRedEyeIcon /></Link>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>  
  )
}
