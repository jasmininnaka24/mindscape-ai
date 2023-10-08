import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const DataSubmission = () => {
  const location = useLocation();
  const { selectedStr } = location.state;

  const [sentence, setSentence] = useState("");
  const [newSentence, setNewSentence] = useState("");

  
  const navigate = useNavigate();

  useEffect(() => {
    if (newSentence !== "") {
      setSentence(newSentence);
    } else {
      setSentence(selectedStr);
    }
  }, [newSentence, selectedStr]);
  
  
  async function classifyLearnerType() {


    const url = 'http://127.0.0.1:8000/ls-classification';

    const response = await axios.post(url, {
      text: sentence,
    });

    const learningStyle = response.data.learningStyle;
    const probability = response.data.probability;

    navigate('/data-result', {
      state: {
        sentence: sentence,
        learningStyle: learningStyle,
        probability: probability,
      },
    });
  }

  return (
    <div className='mcolor-900 vh flex flex-col justify-center'  data-aos='fade'>
      <div className="flex flex-col justify-center items-center">
        <div className="breadcrumbs max-width flex justify-center items-center">
          <div className="flex flex-col justify-between items-center">
            <div className="circle active text-4xl pl-4 pt-1">1</div>
            <p className="text-center mcolor-900 text-lg font-medium">Answer Questions</p>
          </div>
          <div className="line"></div>
          <div className="flex flex-col justify-between items-center">
          <div className="circle active text-4xl pl-5 pt-1">2</div>
            <p className="text-center mcolor-900 text-lg font-medium">Data Submission</p>
          </div>
          <div className="line"></div>
          <div className="flex flex-col justify-between items-center">
            <div className="circle text-4xl pl-5 pt-1">3</div>
            <p className="text-center mcolor-900 text-lg font-medium">Type of Learner Result</p>
          </div>
        </div>
      </div>


      <div className='poppins flex justify-center items-center mt-20'>
        <div className="max-width">
            <p className='text-2xl text-center'>"When I'm studying, {selectedStr}"</p>
            <p className='text-center text-2xl mcolor-400 mt-12'>or</p>
            <div className='mt-12 flex items-center gap-5'>
              <p className='text-2xl'>Other answer: </p>
              <textarea onChange={(event) => {
                setNewSentence(event.target.value)
              }} name="" id="" cols="100" rows="1" placeholder='I prefer...' className='border-bottom-thin text-xl p-2 single-line-textarea'></textarea>
            </div>
            <div className='flex justify-end mt-7'>
              <button onClick={classifyLearnerType} className='mbg-800 mcolor-100 px-8 py-2 text-xl rounded-[5px]'>Submit Answer</button>
            </div>
        </div>
      </div>
    </div>
  )
}

