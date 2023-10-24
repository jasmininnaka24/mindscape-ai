import React from 'react';
import CampaignIcon from '@mui/icons-material/Campaign';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';


export const AuditoryLearner = (props) => {

  const { extractedQA, hideQuestion, questionIndex, stateQuestion, hideQuestionBtn, unhideQuestion, unhideQuestionBtn, unhideAll, unhideAllBtn, hideAll, hideAllBtn, unhideAllChoice, unhideAllChoicesBtn, hideAllChoice, hideAllChoicesBtn, shuffledChoices, answerSubmitted, wrongAnswer, answeredWrongVal, wrongAnswer2, answeredWrongVal2, handleRadioChange, selectedChoice, unhiddenChoice, hideChoiceBtn, choiceSpeak, enabledSubmitBtn, submitAnswer } = props;

  return (
    <div>
      {extractedQA.length > 0 ? (
        <div>

          {/* question */}
          <div className='relative mt-4 pb-8 text-center text-xl font-medium text-xl mcolor-900'>
            <p className='mbg-300 mcolor-900 w-full rounded-[5px] py-4 mcolor-800'>{hideQuestion !== 'hidden' ? extractedQA[questionIndex].question : `Question...`}</p>
            <button className='mx-3 absolute right-5 top-4' onClick={stateQuestion}><CampaignIcon /></button>
            <button className={`mx-3 absolute right-12 top-4 ${hideQuestion !== 'hidden' ? 'hidden' : ''}`} onClick={hideQuestionBtn}><VisibilityIcon /></button>
            <button className={`mx-3 absolute right-12 top-4 ${unhideQuestion !== 'hidden' ? 'hidden' : ''}`} onClick={unhideQuestionBtn}><VisibilityOffIcon /></button>
          </div>


          {/* functionality buttons */}

          <div className='flex items-center justify-between'>

            {/* hide and unhide all choices */}
            <div>
              <button className={`mcolor-800 mb-3 cursor-pointer text-xl ${unhideAll !== 'hidden' ? '' : 'hidden'}`} onClick={unhideAllBtn}>
                Unhide All <VisibilityIcon />
              </button>

              <button className={`mcolor-800 mb-3 cursor-pointer text-xl ${hideAll !== 'hidden' ? '' : 'hidden'}`} onClick={hideAllBtn}>
                Hide All <VisibilityOffIcon />
              </button>
            </div>

            {/* Hide and unhide all */}
            <div>
              <button className={`mcolor-800 mb-3 cursor-pointer text-xl ${unhideAllChoice !== 'hidden' ? '' : 'hidden'}`} onClick={unhideAllChoicesBtn}>
                Unhide All Choices <VisibilityIcon />
              </button>

              <button className={`mcolor-800 mb-3 cursor-pointer text-xl ${hideAllChoice !== 'hidden' ? '' : 'hidden'}`} onClick={hideAllChoicesBtn}>
                Hide All Choices <VisibilityOffIcon />
              </button>
            </div>
          </div>


          {/* choices */}
          <form className='grid-result gap-4 mcolor-800'>
          {shuffledChoices.map((choice, index) => (
            <div
              key={index}
              className={`flex items-center justify-center px-5 py-3 text-center choice border-thin-800 rounded-[5px]  

              ${answerSubmitted === true && choice.choice === extractedQA[questionIndex].answer ? 'mbg-700 mcolor-100 ' : 'mbg-200 '}

              ${wrongAnswer === true && choice.choice === answeredWrongVal ? 'bg-red mcolor-100 ' : ''}

              ${wrongAnswer2 === true && choice.choice === answeredWrongVal2 ? 'bg-red mcolor-100 ' : ''} 
              
              `}
              >
              <input
                type="radio"
                name="option"
                value={choice.choice}
                id={`choice${index}`} 
                className={`custom-radio cursor-pointer`}
                onChange={handleRadioChange}
                checked={selectedChoice === choice.choice} 
              />
              <div className=''>
                <div className={`flex items-center`}>
                  <label htmlFor={`choice${index}`} className={`mr-5 pt-1 cursor-pointer text-xl ${unhiddenChoice.includes(choice.choice) ? '' : 'hidden'}`}>
                    {choice.choice}
                  </label>

                  <label htmlFor={`choice${index}`} className='ml-1 cursor-pointer text-5xl' onClick={() => hideChoiceBtn(choice.choice)}>
                    {unhiddenChoice.includes(choice.choice) ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </label>
                  <label htmlFor={`choice${index}`} className='ml-2 cursor-pointer text-5xl' onClick={() => {choiceSpeak(choice.choice)}}><CampaignIcon /></label>
                </div>

              </div>
            </div>
          ))}

          </form>

          {enabledSubmitBtn === true && (
            <div className='flex justify-center mt-8'>
              <button className='w-1/2 py-2 px-5 mbg-700 rounded-[5px] mcolor-100 text-lg' onClick={() => submitAnswer(extractedQA[questionIndex].id)}>Submit Answer</button>
            </div>
          )}
        </div>
      ) : (
        <p className='text-center my-5 text-xl mcolor-500'>Nothing to show</p>
      )}
    </div>
  )
}
