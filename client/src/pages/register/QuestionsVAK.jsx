import React from 'react';
import './qavak.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const ClassificationQuestions = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();




  const radioButtons = document.querySelectorAll('.form__radio-input');
    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener('change', () => {
        console.log("Selected value:", radioButton.value);
      });
    });

  async function handleButtonClick() {
    const selectedRadioButton = document.querySelector('input[name="size"]:checked');

    if (selectedRadioButton) {


      const data = selectedRadioButton.value;
      console.log("Selected value:", data);

      navigate('/data-submission', {
        state: {
          selectedStr: data,
          id
        },
      });

    } else {
      console.log("No radio button selected");
    }
  }

  const visual = "I find that watching videos or looking at infographics helps me grasp new ideas quickly, as visual representations stick in my mind. I enjoy using mind maps and visual note-taking techniques to organize my thoughts and study materials, making the learning process more engaging for me.";

  const auditory = "I enjoy listening to recorded lectures or audio summaries to reinforce my understanding of a topic. I find it beneficial to read information aloud to myself. I orefer podcasts or audiobooks to absorb new information.";

  const kinesthethic = "I feel more engaged when participating in hands-on activities during my learning process. I prefer using interactive materials, such as quizzes or games, to reinforce my knowledge. I likely retain information when I take frequent breaks to practice what I have learned.";

  return (
    <div className='mcolor-900 vh flex flex-col justify-center' data-aos='fade'>
      <div className="flex flex-col justify-center items-center">
        <div className="breadcrumbs max-width flex justify-center items-center">
          <div className="flex flex-col justify-between items-center">
            <div className="circle active text-4xl pl-4 pt-1">1</div>
            <p className="text-center mcolor-900 text-lg font-medium">Answer Questions</p>
          </div>
          <div className="line"></div>
          <div className="flex flex-col justify-between items-center">
          <div className="circle text-4xl pl-5 pt-1">2</div>
            <p className="text-center mcolor-900 text-lg font-medium">Data Submission</p>
          </div>
          <div className="line"></div>
          <div className="flex flex-col justify-between items-center">
            <div className="circle text-4xl pl-5 pt-1">3</div>
            <p className="text-center mcolor-900 text-lg font-medium">Type of Learner Result</p>
          </div>
        </div>
      </div>

      <div className='flex justify-center items-center mt-10'>
        <div className="max-width">
          <p className='text-3xl'>When studying...</p>
          <form className='mt-8'>
            <div className="form__group">
              <div className="form__radio-group">
                <input type="radio" name="size" id="visual" className="form__radio-input" value={visual} />
                <label className="form__label-radio" for="visual">
                  <span className="form__radio-button"></span>
                  <span className='font-normal'>{visual}</span>
                </label>
              </div>
              <div className="form__radio-group mt-5">
                <input type="radio" name="size" id="auditory" className="form__radio-input" value={auditory} />
                <label className="form__label-radio" for="auditory">
                  <span className="form__radio-button"></span>
                  <span className='font-normal'>{auditory}</span>
                </label>
              </div>
              <div className="form__radio-group mt-5">
                <input type="radio" name="size" id="kinesthethic" className="form__radio-input"  value={kinesthethic}/>
                <label className="form__label-radio" for="kinesthethic">
                  <span className="form__radio-button"></span>
                  <span className='font-normal'>{kinesthethic}</span>
                </label>
              </div>
            </div>
          </form>
          <div className='flex justify-end mt-5'>
            <button onClick={handleButtonClick} className='mbg-800 mcolor-100 px-8 py-2 text-xl rounded-[5px]'>Submit Answer</button>
          </div>
        </div>
      </div>
    </div>
  )
}
