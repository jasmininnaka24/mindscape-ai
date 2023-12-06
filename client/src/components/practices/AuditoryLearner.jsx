import React from 'react';
import CampaignIcon from '@mui/icons-material/Campaign';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';


export const AuditoryLearner = (props) => {

  const { extractedQA, hideQuestion, questionIndex, stateQuestion, hideQuestionBtn, unhideQuestion, unhideQuestionBtn, unhideAll, unhideAllBtn, hideAll, hideAllBtn, unhideAllChoice, unhideAllChoicesBtn, hideAllChoice, hideAllChoicesBtn, shuffledChoices, answerSubmitted, wrongAnswer, answeredWrongVal, wrongAnswer2, answeredWrongVal2, handleRadioChange, selectedChoice, unhiddenChoice, hideChoiceBtn, choiceSpeak, enabledSubmitBtn, submitAnswer, setSelectedChoice, giveHint, remainingHints } = props;

  return (
    <div>
      {extractedQA.length > 0 ? (
        <div>

          {/* question */}

          {extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB' ? (

            <div className={'flex justify-between items-center'}>
              <div>
                {(extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB') && (
                  <div className='flex items-center justify-between w-full'>
                    <button className='mcolor-800 mbg-200 border-thin-800 rounded-[5px] px-2 py-1 text-lg mt-2' onClick={giveHint}>Use hint <span className='bg-red mcolor-100 px-2 ml-1 rounded-full text-sm'>{remainingHints}</span></button>
                  </div>
                )}
              </div>
              <div className='relative mt-4 pb-8 text-center text-xl font-medium text-xl mcolor-900'>
                <button className='mx-3 absolute right-7 top-4' onClick={stateQuestion}><CampaignIcon /></button>
                <button className={`ml-3 absolute right-2 top-4 ${hideQuestion !== 'hidden' ? 'hidden' : ''}`} onClick={hideQuestionBtn}><VisibilityIcon /></button>
                <button className={`ml-3 absolute right-2 top-4 ${unhideQuestion !== 'hidden' ? 'hidden' : ''}`} onClick={unhideQuestionBtn}><VisibilityOffIcon /></button>
              </div>
            </div>

          ) : (

            <div>
              <div className='relative pb-8 text-center text-xl font-medium text-xl mcolor-900'>
                <button className='mx-3 absolute right-7 top-4' onClick={stateQuestion}><CampaignIcon /></button>
                <button className={`ml-3 absolute right-2 top-4 ${hideQuestion !== 'hidden' ? 'hidden' : ''}`} onClick={hideQuestionBtn}><VisibilityIcon /></button>
                <button className={`ml-3 absolute right-2 top-4 ${unhideQuestion !== 'hidden' ? 'hidden' : ''}`} onClick={unhideQuestionBtn}><VisibilityOffIcon /></button>
              </div>
            </div>

          )}


          <div className='relative mt-4 pb-8 text-center text-xl font-medium text-xl mcolor-900'>
            <p className='mbg-300 mcolor-900 w-full rounded-[5px] py-4 mcolor-800 px-5'>{hideQuestion !== 'hidden' ? extractedQA[questionIndex].question : `Question...`}</p>
          </div>


          {/* functionality buttons */}
          {(extractedQA[questionIndex].quizType !== 'Identification' && extractedQA[questionIndex].quizType !== 'FITB') && (
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
          )}


          {/* choices */}

          {extractedQA[questionIndex].quizType === 'MCQA' && (
            <form className='grid grid-cols-1 gap-4 mcolor-800'>
            {shuffledChoices.map((choice, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-5 py-2 text-center choice border-thin-800 rounded-[5px]  

                ${answerSubmitted === true && choice.choice === extractedQA[questionIndex].answer ? 'mbg-700 mcolor-100 ' : 'mbg-200 '}

                ${wrongAnswer === true && choice.choice === answeredWrongVal ? 'bg-red mcolor-100 ' : ''}

                ${wrongAnswer2 === true && choice.choice === answeredWrongVal2 ? 'bg-red mcolor-100 ' : ''} 
                
                `}
                >

                <div className='flex items-center'>
                  <input
                    type="radio"
                    name="option"
                    value={choice.choice}
                    id={`choice${index}`} 
                    className={`custom-radio cursor-pointer`}
                    onChange={handleRadioChange}
                    checked={selectedChoice === choice.choice} 
                  />
                  <label htmlFor={`choice${index}`} className={`mr-5 pt-1 cursor-pointer text-xl`}>
                    {unhiddenChoice.includes(choice.choice) ? choice.choice : `Choice ${index + 1}`}
                  </label>
                </div>


                <div className=''>
                  <div className={`flex items-center`}>
                    <label htmlFor={`choice${index}`} className='ml-2 cursor-pointer text-5xl' onClick={() => {choiceSpeak(choice.choice)}}><CampaignIcon /></label>
                    <label htmlFor={`choice${index}`} className='ml-1 cursor-pointer text-5xl' onClick={() => hideChoiceBtn(choice.choice)}>
                      {unhiddenChoice.includes(choice.choice) ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </label>
                  </div>

                </div>
              </div>
            ))}

            </form>
          )}

          {/* true or false choices */}
          {extractedQA[questionIndex].quizType === 'ToF' && (
            <div className='grid grid-cols-1 gap-4 gap-4 mcolor-800'>
              <div
                key={1}
                className={`w-full flex items-center justify-between px-5 py-3 text-center choice border-thin-800 rounded-[5px]  

                ${answerSubmitted === true && 'True' === extractedQA[questionIndex].answer ? 'mbg-700 mcolor-100 ' : 'mbg-200 '}

                ${wrongAnswer === true && 'True' === answeredWrongVal ? 'bg-red mcolor-100 ' : ''}
  
                ${wrongAnswer2 === true && 'True' === answeredWrongVal2 ? 'bg-red mcolor-100 ' : ''} 
                
                `}
                >

                  {/* true */}

                <div className='flex items-center'>
                  <input
                    type="radio"
                    name="option"
                    value={'True'}
                    id={`choice${1}`} 
                    className={`custom-radio cursor-pointer`}
                    onChange={handleRadioChange}
                    checked={selectedChoice === 'True'} 
                  />
                  <label htmlFor={`choice${1}`} className={`mr-5 pt-1 cursor-pointer text-xl`}>
                    {unhiddenChoice.includes('True') ? 'True' : `Choice 1`}
                  </label>
                </div>

                <div className=''>
                  <div className={`flex items-center`}>

                    <label htmlFor={`choice${1}`} className='ml-1 cursor-pointer text-5xl' onClick={() => hideChoiceBtn('True')}>
                      {unhiddenChoice.includes('True') ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </label>
                    <label htmlFor={`choice${1}`} className='ml-2 cursor-pointer text-5xl' onClick={() => {choiceSpeak('True')}}><CampaignIcon /></label>
                  </div>

                </div>
              </div>


              {/* false */}
              <div
                key={2}
                className={`w-full flex items-center justify-between px-5 py-3 text-center choice border-thin-800 rounded-[5px] 

                ${answerSubmitted === true && 'False' === extractedQA[questionIndex].answer ? 'mbg-700 mcolor-100 ' : 'mbg-200 '}

                ${wrongAnswer === true && 'False' === answeredWrongVal ? 'bg-red mcolor-100 ' : ''}
  
                ${wrongAnswer2 === true && 'False' === answeredWrongVal2 ? 'bg-red mcolor-100 ' : ''} 
                
                `}
                >

                <div className='flex items-center'>
                  <input
                    type="radio"
                    name="option"
                    value={'False'}
                    id={`choice${2}`} 
                    className={`custom-radio cursor-pointer`}
                    onChange={handleRadioChange}
                    checked={selectedChoice === 'False'} 
                  />
                  <label htmlFor={`choice${2}`} className={`mr-5 pt-1 cursor-pointer text-xl`}>
                    {unhiddenChoice.includes('False') ? 'False' : `Choice 2`}
                  </label>
                </div>

                <div className=''>
                  <div className={`flex items-center`}>
                    <label htmlFor={`choice${2}`} className='ml-1 cursor-pointer text-5xl' onClick={() => hideChoiceBtn('False')}>
                      {unhiddenChoice.includes('False') ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </label>
                    <label htmlFor={`choice${2}`} className='ml-2 cursor-pointer text-5xl' onClick={() => {choiceSpeak('False')}}><CampaignIcon /></label>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* only for fill in the blanks and identification types of quiz */}
          {(extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB') && (
            <div>
              <input type="text" placeholder='Type here...' className='w-full h-full text-center py-5 my-2 border-medium-800 rounded-[5px] text-xl mcolor-900' value={selectedChoice || ''} onChange={(event) => {
                setSelectedChoice(event.target.value)
              }} style={{ height: '100%' }} />
            </div>
          )}

          {enabledSubmitBtn === true && (
            <div className='flex justify-center mt-8'>
              <button className='w-1/2 py-2 px-5 mbg-700 rounded-[5px] mcolor-100 text-lg' onClick={() => submitAnswer(extractedQA[questionIndex].id)}>Submit Answer</button>
            </div>
          )}


        </div>
        ) : (
          <p className='text-center my-5 text-xl mcolor-500'>Nothing to show</p>
        )
      }
    </div>
  )
}
