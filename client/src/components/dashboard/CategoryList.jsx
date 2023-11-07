import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


export const CategoryList = () => {

  const [materialCategories, setMaterialCategories] = useState([])
  const [materialsTopicsLength, setMaterialsTopicsLength] = useState([])

  const UserId = 1;
  
  useEffect(() => {

    async function fetchLatestMaterialStudied() {
      try {  



        const materialCategories = await axios.get(`http://localhost:3001/studyMaterialCategory/Personal/${UserId}`)
        
        const materialCategoriesResponse = materialCategories.data;
        setMaterialCategories(materialCategoriesResponse)

    
        const fetchMaterialsLength = async () => {
          const lengths = [];
          
          for (const category of materialCategoriesResponse) {
            try {
              const extractedStudyMaterials = await axios.get(`http://localhost:3001/studyMaterial/all-study-material/${category.id}`);
              const extractedStudyMaterialsResponse = extractedStudyMaterials.data;
              const materialsLength = extractedStudyMaterialsResponse.length;
              lengths.push(materialsLength);
            } catch (error) {
              console.error('Error fetching study materials:', error);
              lengths.push(0); 
            }
          }

          setMaterialsTopicsLength(prevState => [...prevState, ...lengths]);
        };

        fetchMaterialsLength();


        
      } catch (error) {
        console.error('Error fetching latest material studied:', error);
      }
    }
    
    fetchLatestMaterialStudied();
  


      
  }, [])



  return (
    <div className='my-8 border-medium-800 min-h-[80vh] rounded-[5px]'>
      <table className='w-full rounded-[5px]'>
        <thead className='mbg-300'>
          <tr>
            <td className='text-center text-xl py-3 font-medium'>Categories</td>
            <td className='text-center text-xl py-3 font-medium'>Performance Status</td>
            <td className='text-center text-xl py-3 font-medium'>Number of Topics</td>
            <td className='text-center text-xl py-3 font-medium'>View Topics</td>
          </tr>
        </thead>
        <tbody>
          {materialCategories.map((item, index) => {
            return <tr className='border-bottom-thin-gray rounded-[5px]' key={index}>
              <td className='text-center py-3 text-lg mcolor-800'>{item.category}</td>
              <td className='text-center py-3 text-lg mcolor-800'>{item.studyPerformance >= 90 ? 'Passing' : 'Requires Improvement'}</td>
              <td className='text-center py-3 text-lg mcolor-800'>{materialsTopicsLength[index]}</td>
              <td className='text-center py-3 text-lg mcolor-800'>
                <Link to={`/main/personal/dashboard/category-list/topic-list/${item.id}`}><RemoveRedEyeIcon /></Link>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>  
  )
}
