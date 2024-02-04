import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { PieChart } from '../charts/PieChart';
import { useUser } from '../../UserContext';
import { useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../urlConfig';

import { Sidebar } from '../sidebar/Sidebar';
import EqualizerIcon from '@mui/icons-material/Equalizer';


export const TopicList = ({categoryFor}) => {

  const [studyMaterials, setStudyMaterials] = useState([])
  const [materialsTopicsData, setMaterialsTopicsData] = useState([])
  const [preparedLength, setPreparedLength] = useState(0)
  const [unpreparedLength, setUnpreparedLength] = useState(0)
  const location = useLocation();

  const { groupId, categoryID } = useParams()
  const { user } = useUser()
  const { filter, performanceStatus, tag } = location.state;

  const navigate = useNavigate()

  const UserId = user?.id;
  


  
  useEffect(() => {

    async function fetchStudyMaterialsTopicList(filter) {
      try {
  
        let extractedStudyMaterials = [];
        let uniqueIds = new Set();
  
        if (groupId === undefined) {
          // Use Promise.all to wait for all promises to resolve
          await Promise.all(filter.map(async (material, index) => {
            try {
              let materialResponse = await axios.get(`${SERVER_URL}/studyMaterial/all-study-material-personal/${UserId}/${material.id}`);
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
            let materialResponse = await axios.get(`${SERVER_URL}/studyMaterial/all-study-material-group/${groupId}/${material.id}`);
            extractedStudyMaterials.push(materialResponse.data);
          }));
  
        }
  
        
        setStudyMaterials(extractedStudyMaterials.flat());
        
        let extractedStudyMaterialsResponse = extractedStudyMaterials.flat();
  
        let materialsData = await Promise.all(extractedStudyMaterialsResponse.map(async (material) => {
          try {
            let extractedData = [];
        
            if (groupId === undefined) {
              extractedData = await axios.get(`${SERVER_URL}/DashForPersonalAndGroup/get-latest-assessment-personal/${material.id}/${UserId}`);
            } else if (categoryFor === 'Group') {
              extractedData = await axios.get(`${SERVER_URL}/DashForPersonalAndGroup/get-latest-assessment-group/${material.id}/${groupId}`);
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


    fetchStudyMaterialsTopicList(filter)
    
    
  }, [UserId, categoryFor, categoryID, filter, groupId])


  return (
    <div className='poppins mcolor-900 mbg-200 relative flex'>

      <Sidebar currentPage={categoryFor === 'Personal' ? 'personal-study-area' : 'group-study-area'} />

      <div className={`lg:w-1/6 h-[100vh] flex flex-col items-center justify-between py-2 lg:mb-0 ${
        window.innerWidth > 1020 ? '' :
        window.innerWidth <= 768 ? 'hidden' : 'hidden'
      } mbg-800`}></div>

      <div className='flex-1 mbg-200 w-full h-full p-8'>

        <div>
          <div className='flex items-center mt-2'>
            <EqualizerIcon sx={{ fontSize: 38 }} className='mr-1 mb-1 mcolor-700' />
            <div className='mcolor-900 flex justify-between items-center'>
              <div className='flex justify-between items-start'>
                <div className='flex gap-3 items-center text-2xl'>
                  <button onClick={() => {

                    let linkBack = ''
                    if (categoryFor === 'Personal') {
                      linkBack = `/main/personal/dashboard/category-list`
                    } else {
                      linkBack = `/main/group/dashboard/category-list/${groupId}`
                    }

                    navigate(linkBack, {
                      state: {
                        tag: tag
                      }
                    })
                    
                  }}>
                    Categories
                  </button>
                  <i class="fa-solid fa-chevron-right"></i>
                  <p className='font-bold'>Topic List</p>
                </div>
              </div>
            </div>
          </div>



          <div className='my-6 w-full flex items-center justify-center mbg-input rounded border-medium-800 py-4'>
            <div className='w-1/3 min-h-[40vh]'>
              <PieChart dataGathered={[unpreparedLength, preparedLength]} />
            </div>
            <div className='w-1/2'>
              <p className='text-2xl mt-3 mcolor-800 font-medium'>Performance Status: <span className='font-bold color-primary'>{performanceStatus >= 90 ? 'Passing' : 'Requires Improvement'}</span></p>
              <p className='text-2xl mt-3 mcolor-800 font-medium'>Performance in percentile: <span className='font-bold color-primary'>{performanceStatus}%</span></p>
              <p className='text-2xl mt-3 mcolor-800 font-medium'>Target Performance: <span className='font-bold color-primary'>90%</span></p>
            </div>
          </div>

          <div className='border-medium-800 rounded-[5px] overflow-x-auto overflow-container' style={{ height: '100%' }}>
            <table className='p-5 w-full rounded-[5px] text-center'>
              <thead className='mbg-800 mcolor-100'>
                <tr>
                  <td className='text-center py-3 font-medium'>Topic</td>
                  <td className='text-center py-3 font-medium'>Overall <br />Performance</td>
                  <td className='text-center py-3 font-medium'>Latest Assessment <br />% Score</td>
                  <td className='text-center py-3 font-medium'>Confidence Level</td>
                  <td className='text-center py-3 font-medium'>Improvement</td>
                  <td className='text-center py-3 font-medium'>Status</td>
                  <td className='text-center py-3 font-medium'>Records</td>
                </tr>
              </thead>

              <tbody className='mbg-input'>

              {studyMaterials.length > 0 && (
                studyMaterials.map((item, index) => {
                  const materialsTopic = materialsTopicsData[index] && materialsTopicsData[index][0];

                  if (!materialsTopic) {
                    return (
                      <tr key={index}>
                        <td className='py-3 mcolor-800'>{item.title}</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>

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
                        <td className='py-3 mcolor-800'>{item.title}</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>
                        <td className='text-center py-3 mcolor-800'>No record</td>

                      </tr>
                    );
                  }
                  return (
                    <tr className='border-bottom-thin-gray rounded-[5px]' key={index}>
                      <td className='text-center py-3 mcolor-800'>{item.title}</td>
                      <td className='text-center py-3 mcolor-800'>{item.studyPerformance}%</td>
                      <td className='text-center py-3 mcolor-800'>{assessmentImp === 'none' ? 0 : assessmentScorePerf}%</td>
                      <td className='text-center py-3 mcolor-800'>{assessmentImp === 'none' ? 0 : confidenceLevel}%</td>
                      <td className='text-center py-3 mcolor-800'>{assessmentImp === 'none' ? 0 : assessmentImp}%</td>
                      <td className='text-center py-3 mcolor-800'>{item.studyPerformance >= 90 ? 'Prepared' : 'Unprepared'}</td>
                      <td className='text-center py-3 mcolor-800'>
                        {(assessmentImp !== 'none' ) ? (
                          groupId !== undefined ? (
                            <button onClick={() => {
                              navigate(`/main/group/dashboard/category-list/topic-list/topic-page/${groupId}/${categoryID}/${item.id}`, {
                                state: {
                                  filter: filter,
                                  performanceStatus: performanceStatus,
                                  tag: tag
                                }
                              })
                            }}>
                              <RemoveRedEyeIcon />
                            </button>
                            
                          ) : (
                            <button onClick={() => {

                              navigate(`/main/personal/dashboard/category-list/topic-list/topic-page/${categoryID}/${item.id}`, {
                                state: {
                                  filter: filter,
                                  performanceStatus: performanceStatus,
                                  tag: tag
                                }
                              })
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
      </div>
    </div>
  )
}
