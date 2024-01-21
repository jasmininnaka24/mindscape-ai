import React from 'react'
import VpnKeyIcon from '@mui/icons-material/VpnKey';


export const VisualLearner = (props) => {

  const { extractedQA, questionIndex, shuffledChoices, selectedChoice, enabledSubmitBtn, submitAnswer, setSelectedChoice, giveHint, remainingHints, draggedBG, borderMedium, handleDrop, handleDragOver, handleDragStart, handleDragEnd } = props;


  return (
    <div className=''>
      {extractedQA.length > 0 ? (
        <div>

          {/* question */}
          <div className='relative mt-4 pb-8 text-center text-lg font-medium mcolor-900'>
            <div className={`w-full mbg-300 mcolor-900 border-thin-800 w-full rounded-[5px] mcolor-800`}>

              <div className='flex items-center justify-end w-full px-4 py-2'>
                {/* <p className='mcolor-800 text-lg mt-2 font-medium'>Type: {
                  (extractedQA[questionIndex].quizType === 'ToF' && 'True or False') ||
                  (extractedQA[questionIndex].quizType === 'FITB' && 'Fill In The Blanks') ||
                  (extractedQA[questionIndex].quizType === 'Identification' && 'Identification') ||
                  (extractedQA[questionIndex].quizType === 'MCQA' && 'MCQA')
                }</p> */}

                <div>
                  {(extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB') && (
                    <div className='flex items-center justify-between w-full'>
                      <button className='mcolor-800 mbg-200 border-thin-800 rounded-[5px] px-2 py-1 text-lg mt-2' onClick={giveHint}>Use hint <span className='bg-red mcolor-100 px-2 ml-1 rounded-full text-sm'>{remainingHints}</span></button>
                    </div>
                  )}
                </div>
              </div>

              {/* questions */}
              {extractedQA[questionIndex].quizType === 'FITB' ? (

                <p className='py-5 px-5 text-justify'>{extractedQA[questionIndex].question}</p>
                
              ) : (
                <p className='py-5 px-5 text-center'>{extractedQA[questionIndex].question}</p>
              )}

              <div className='flex justify-center pb-8'>
                <div
                  className={`flex items-center justify-between dragHere w-full mx-10 h-[12vh] rounded-[5px] px-10 ${draggedBG} ${borderMedium}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >

                    {/* key here */}
                    <div className={`${(extractedQA[questionIndex].bgColor !== 'none' || extractedQA[questionIndex].bgColor !== '') ? `${extractedQA[questionIndex].bgColor}-key` : 'mbg-300'}`}><VpnKeyIcon /></div>

                    {/* answer */}
                    <div className='' draggable onDragStart={(e) => handleDragStart(e, selectedChoice)}>
                      {(extractedQA[questionIndex].quizType === 'MCQA' || extractedQA[questionIndex].quizType === 'ToF') && (
                        <p className={`py-7 ${(selectedChoice === '' || selectedChoice === null) ? 'mcolor-400' : 'mcolor-900'}`}>{(selectedChoice === '' || selectedChoice === null) ? 'Drag here...' : selectedChoice}</p>
                      )}


                      { (extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB') && (
                        <input type="text" placeholder='Type here...' className='w-full h-full text-center py-5 my-2 bg-transparent' value={selectedChoice || ''} onChange={(event) => {
                          setSelectedChoice(event.target.value)
                        }} style={{ height: '100%' }} />
                      )}

                    </div>
                </div>
              </div>
            </div>

            {/* choices */}
            {(extractedQA[questionIndex].quizType === 'MCQA') && (
              <form className='w-full flex flex-col gap-3 mcolor-800 mt-8'>
              {shuffledChoices.map((choice, index) => (
                <div>
                  {choice.choice !== selectedChoice && (
                    <div
                      key={index}
                      className={`flex items-center justify-center px-5 py-2 text-center choice border-thin-800 rounded-[5px] mbg-200`}
                      draggable="true" 
                      onDragStart={(e) => handleDragStart(e, choice.choice)}  
                      onDragEnd={handleDragEnd}
                    >
                      <div>
                        <div className={`flex items-center`}>
                        <label 
                          htmlFor={`choice${index}`} 
                          className={`pt-1 cursor-pointer text-lg text-center`}
                        >
                          {choice.choice}
                        </label>

                        </div>

                      </div>
                    </div>
                  )}
                </div>
              ))}
              </form>
             )}

            {extractedQA[questionIndex].quizType === 'ToF' && (
              <div className='w-full grid grid-cols-2 gap-4 mcolor-800 mt-8'>
                <div
                  className={`flex items-center justify-center px-5 py-3 text-center choice border-thin-800 rounded-[5px] ${selectedChoice === 'True' ? draggedBG : 'mbg-100'}`}
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'True')}  
                  onDragEnd={handleDragEnd}
                >
                  <div>
                    <div className={`flex items-center`}>
                    <label 
                      className={`mr-5 pt-1 cursor-pointer text-xl`}
                    >
                      True
                    </label>

                    </div>

                  </div>
                </div>
                <div
                  className={`flex items-center justify-center px-5 py-3 text-center choice border-thin-800 rounded-[5px] ${selectedChoice === 'False' ? draggedBG : 'mbg-100'}`}
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'False')}  
                  onDragEnd={handleDragEnd}
                >
                  <div>
                    <div className={`flex items-center`}>
                    <label 
                      className={`mr-5 pt-1 cursor-pointer text-xl`}
                    >
                      False
                    </label>

                    </div>

                  </div>
                </div>

              </div>
            )}



          </div>



          {enabledSubmitBtn === true && (
            <div className='flex justify-center'>
              <button className='w-1/2 py-2 px-5 mbg-800 rounded-[5px] mcolor-100 text-lg' onClick={() => submitAnswer(extractedQA[questionIndex].id)}>Submit Answer</button>
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
