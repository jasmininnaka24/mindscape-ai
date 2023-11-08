import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link } from 'react-router-dom';
import { BarChart } from '../charts/BarChart';
import { PieChart } from '../charts/PieChart';

export const TopicPage = () => {

  const { materialID } = useParams();

  const [studyMaterials, setStudyMaterials] = useState([]);
  const [preparedLength, setPreparedLength] = useState(0)
  const [unpreparedLength, setUnpreparedLength] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const extractedData = await axios.get(`http://localhost:3001/DashForPersonalAndGroup/get-latest-assessment/${materialID}`);

      setStudyMaterials(extractedData.data)
      let data = extractedData.data;

      
      let preparedLength = 0;
      let unpreparedLength = 0;
      
      data.forEach(item => {
        const assessmentImp = parseFloat(item.assessmentImp);
        const assessmentScorePerf = parseFloat(item.assessmentScorePerf);
        const confidenceLevel = parseFloat(item.confidenceLevel);
      
        const totalScore = (assessmentImp + assessmentScorePerf + confidenceLevel) / 3;
      
        if (totalScore >= 90.00) {
          preparedLength += 1;
        } else {
          unpreparedLength += 1;
        }
      });
      

      setPreparedLength(preparedLength)
      setUnpreparedLength(unpreparedLength)
      
      
    }

    fetchData();
  }, [materialID])

  return (
    <div className='flex flex-col'>
      <div className='flex my-10'>
        <div className='w-full'>
        <BarChart
          labelSet={studyMaterials.map(material => new Date(material.updatedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))}
          dataGathered={studyMaterials.map(material => ((parseFloat(material.assessmentImp) + parseFloat(material.assessmentScorePerf) + parseFloat(material.confidenceLevel)) / 3).toFixed(2))}
          maxBarValue={100} labelTop={'Assessment Score Performance'}
        />
        </div>
        <div className='w-1/2 mb-8'>
          <div className='min-h-[40vh]'>
            <PieChart dataGathered={[unpreparedLength, preparedLength]} />
          </div>
        </div>
      </div>

      <div className='my-8 border-medium-800 rounded-[5px]'>
        <table className='w-full rounded-[5px] text-center'>
          <thead className='mbg-300'>
            <tr>
              <td className='text-center text-xl py-3 font-medium px-3'>#</td>
              <td className='text-center text-xl py-3 font-medium'>Date</td>
              <td className='text-center text-xl py-3 font-medium'>Pre-Assessment <br />Score</td>
              <td className='text-center text-xl py-3 font-medium'>Assessment <br /> Score</td>
              <td className='text-center text-xl py-3 font-medium'>Completion <br /> Time</td>
              <td className='text-center text-xl py-3 font-medium'>Improvement</td>
              <td className='text-center text-xl py-3 font-medium'>Score <br /> Performance</td>
              <td className='text-center text-xl py-3 font-medium'>Confidence <br /> Level</td>
              <td className='text-center text-xl py-3 font-medium'>Preparation <br /> Status</td>
              <td className='text-center text-xl py-3 font-medium'>Analysis</td>
            </tr>
          </thead>
          <tbody>
            {studyMaterials.map((item, index) => {
              return <tr className='border-bottom-thin-gray rounded-[5px]' key={index}>

                <td className='text-center py-3 text-lg mcolor-800'>{item.numOfTakes}</td>
                <td className='text-center py-3 text-lg mcolor-800'>{new Date(item.updatedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</td>

                <td className='text-center py-3 text-lg mcolor-800'>{item.preAssessmentScore}/{item.overAllItems}</td>
                <td className='text-center py-3 text-lg mcolor-800'>{item.assessmentScore}/{item.overAllItems}</td>


                <td className='text-center py-3 text-lg mcolor-800'>{item.completionTime} min{item.completionTime < 2 ? '' : 's'}</td>

                <td className='text-center py-3 text-lg mcolor-800'>{item.assessmentImp}%</td>



                <td className='text-center py-3 text-lg mcolor-800'>{item.assessmentScorePerf}%</td>
                <td className='text-center py-3 text-lg mcolor-800'>{item.confidenceLevel}%</td>
                <td className='text-center py-3 text-lg mcolor-800'>{((parseFloat(item.assessmentImp) + parseFloat(item.assessmentScorePerf) + parseFloat(item.confidenceLevel)) / 3).toFixed(2)}%</td>
                <td className='text-center py-3 text-lg mcolor-800'>
                  <Link to={`/main/personal/dashboard/category-list/topic-list/topic-page/${item.id}`}><RemoveRedEyeIcon /></Link>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>  
    </div>  
  )
}
