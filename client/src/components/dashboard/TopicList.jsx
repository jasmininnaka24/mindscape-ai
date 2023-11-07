import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export const TopicList = () => {

  const [studyMaterials, setStudyMaterials] = useState([])
  const [materialsTopicsData, setMaterialsTopicsData] = useState([])

  const { categoryID } = useParams()

  const UserId = 1;
  
  useEffect(() => {
    async function fetchLatestMaterialStudied() {
      try {
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
          const filteredMaterialsData = materialsData.filter(data => data !== null); // Remove null values if any
    
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
    <div className='my-8 border-medium-800 min-h-[80vh] rounded-[5px]'>
      <table className='w-full rounded-[5px] text-center'>
        <thead className='mbg-300'>
          <tr>
            <td className='text-center text-xl py-3 font-medium'>Topic</td>
            <td className='text-center text-xl py-3 font-medium'>Latest Study <br />Profeciency</td>
            <td className='text-center text-xl py-3 font-medium'>Latest Assessment <br />% Score</td>
            <td className='text-center text-xl py-3 font-medium'>Confidence Level</td>
            <td className='text-center text-xl py-3 font-medium'>Improvement</td>
            <td className='text-center text-xl py-3 font-medium'>Status</td>
            <td className='text-center text-xl py-3 font-medium'>Records</td>
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
                <Link to={``}><RemoveRedEyeIcon /></Link>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>  
  )
}
