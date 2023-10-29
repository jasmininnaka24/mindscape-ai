import React from 'react'
import VpnKeyIcon from '@mui/icons-material/VpnKey';


export const VisualLearner = (props) => {

  const { extractedQA, questionIndex, shuffledChoices, selectedChoice, enabledSubmitBtn, submitAnswer, setSelectedChoice, giveHint, remainingHints, draggedBG, borderMedium, handleDrop, handleDragOver, handleDragStart, handleDragEnd } = props;


  return (
    <div>
      {extractedQA.length > 0 ? (
        <div>

          {/* question */}
          <div className='flex items-center justify-between gap-4 relative mt-4 pb-8 text-center text-xl font-medium text-xl mcolor-900'>
            <div className={`relative w-full ${extractedQA[questionIndex].bgColor !== 'none' ? `${extractedQA[questionIndex].bgColor}-bg` : 'mbg-300'} mcolor-900 min-h-[50vh] w-full rounded-[5px] pt-14 mcolor-800`}>
              <p className='mcolor-800 text-lg mt-2 font-medium absolute top-3 left-5'>Type: {
                (extractedQA[questionIndex].quizType === 'ToF' && 'True or False') ||
                (extractedQA[questionIndex].quizType === 'FITB' && 'Fill In The Blanks') ||
                (extractedQA[questionIndex].quizType === 'Identification' && 'Identification') ||
                (extractedQA[questionIndex].quizType === 'MCQA' && 'MCQA')
              }</p>

              { (extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB') && (
                <div>
                  <p className='mcolor-800 text-lg mt-2 font-medium absolute top-10 left-5'>Remaining Hints: {remainingHints}</p>
                  <button className='mcolor-800 mbg-200 border-thin-800 rounded-[5px] px-2 py-1 text-lg mt-2 font-medium absolute bottom-5 left-5' onClick={giveHint}>Use hint</button>
                </div>
              )}

              {/* questions */}
              {extractedQA[questionIndex].quizType === 'ToF' ? (

                <p className='p-10'>{extractedQA[questionIndex].question}</p>
                
              ) : (
                <p className='p-10'>{extractedQA[questionIndex].question}</p>
              )}

              <div className='flex justify-center'>
                <div
                  className={`dragHere w-1/2 h-[12vh] rounded-[5px] absolute bottom-14 flex justify-between items-center px-10 ${draggedBG} ${borderMedium}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >

                    {/* key here */}
                    <div className={`${extractedQA[questionIndex].bgColor !== 'none' ? `${extractedQA[questionIndex].bgColor}-key` : 'mbg-300'}`}><VpnKeyIcon /></div>

                    {/* answer */}
                    <div className='' draggable onDragStart={(e) => handleDragStart(e, selectedChoice)}>
                      {(extractedQA[questionIndex].quizType === 'MCQA' || extractedQA[questionIndex].quizType === 'ToF') && (
                        <p className={`py-7 ${selectedChoice === '' ? 'mcolor-400' : 'mcolor-900'}`}>{selectedChoice === '' ? 'Drag here...' : selectedChoice}</p>
                      )}


                      { (extractedQA[questionIndex].quizType === 'Identification' || extractedQA[questionIndex].quizType === 'FITB') && (
                        <input type="text" placeholder='Type here...' className='w-full h-full text-center py-5 my-2' value={selectedChoice || ''} onChange={(event) => {
                          setSelectedChoice(event.target.value)
                        }} style={{ height: '100%' }} />
                      )}

                    </div>
                </div>
              </div>
            </div>

            {/* choices */}
            {(extractedQA[questionIndex].quizType === 'MCQA') && (
              <form className='w-1/2 flex flex-col gap-4 mcolor-800'>
              {shuffledChoices.map((choice, index) => (
                <div>
                  {choice.choice !== selectedChoice && (
                    <div
                      key={index}
                      className={`flex items-center justify-center px-5 py-3 text-center choice border-thin-800 rounded-[5px]`}
                      draggable="true" 
                      onDragStart={(e) => handleDragStart(e, choice.choice)}  
                      onDragEnd={handleDragEnd}
                    >
                      <div>
                        <div className={`flex items-center`}>
                        <label 
                          htmlFor={`choice${index}`} 
                          className={`mr-5 pt-1 cursor-pointer text-xl`}
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
                <div className='w-1/2 flex flex-col gap-4 mcolor-800'>
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
