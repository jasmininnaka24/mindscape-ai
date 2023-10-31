import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import catsImage1 from '../../assets/castImage1.png';
import catsImage2 from '../../assets/catsImage2.png';
import catsImage3 from '../../assets/catsImage3.png';


export const KinestheticLearner = (props) => {

  const { extractedQA, questionIndex, remainingHints, giveHint, kinesthethicAnswers, borderMedium, handleDropKinesthetic, handleDragOver, removeValueOfIndex, selectedChoice, typeOfLearner, handleDragStart, handleDragEnd, lastDraggedCharacter, enabledSubmitBtn, submitAnswer, chanceLeft } = props;

  return (
    <div>
      {extractedQA.length > 0 ? (
        <div className='flex items-center'>

          {/* question */}
          <div className='w-1/2 mt-5'>
            <div className='relative mt-4 pb-5 text-center text-xl font-medium text-xl mcolor-900'>
              <p className='mbg-300 mcolor-900 w-full rounded-[5px] p-5 mcolor-800'>{extractedQA[questionIndex].question}</p>
            </div>

            <div>

              {/* remaining hints and hint button */}
              {extractedQA[questionIndex].quizType !== 'ToF' && (
                <div className='flex items-center justify-start'>
                  <p className='mcolor-800 text-lg mt-2 font-medium'>Remaining Hints: {remainingHints}</p>
                  <button className='mcolor-800 mbg-200 border-thin-800 rounded-[5px] px-2 py-1 text-lg mt-2 font-medium ml-5' onClick={giveHint}>Use hint</button>
                </div>
              )}

              <div className='flex items-center w-full mt-4'>
                <p className='mr-4 text-lg mcolor-900'>Answer: </p>
                {
                  extractedQA[questionIndex].quizType !== 'ToF' ? (
                    Array.from({ length: extractedQA[questionIndex].answer.length }).map((_, index) => (
                      <span
                      key={index}
                      className={`w-full text-center mx-1 rounded-[5px] ${
                        extractedQA[questionIndex].answer[index] !== ' ' ? (kinesthethicAnswers[index] === ' '? `py-5 mbg-200 mcolor-900 ${borderMedium}` : `py-2 mbg-700 mcolor-100 cursor-pointer ${borderMedium}`) : ''
                      }`}
            
                      onDrop={(e) => handleDropKinesthetic(e, index)} 
                      onDragOver={handleDragOver}
                      onClick={() => removeValueOfIndex(index)}
                    >
                        {kinesthethicAnswers[index]}
                      </span>
                    ))
                  ) : (
                    <div className="w-full text-center mx-1 rounded-[5px] cursor-pointer mbg-200 mcolor-900 min-h-[50px] flex items-center justify-center border-medium-800"
                      onDrop={(e) => handleDropKinesthetic(e)} 
                      onDragOver={handleDragOver}
                      onClick={() => removeValueOfIndex()}
                    >
                      {selectedChoice}
                    </div>
                  )
                }

              </div>

            </div>
            

            {(typeOfLearner === 'kinesthetic' && extractedQA[questionIndex].quizType !== 'ToF') ? (
              <div class="keyboard w-full mt-5">
                <div class="row">
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '1')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '1' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>1</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '2')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '2' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>2</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '3')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '3' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>3</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '4')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '4' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>4</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '5')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '5' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>5</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '6')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '6' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>6</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '7')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '7' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>7</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '8')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '8' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>8</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '9')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '9' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>9</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '0')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '0' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>0</div>
                </div>
                <div class="row">
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'Q')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'Q' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>Q</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'W')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'W' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>W</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'E')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'E' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>E</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'R')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'R' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>R</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'T')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'T' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>T</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'Y')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'Y' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>Y</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'U')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'U' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>U</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'I')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'I' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>I</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'O')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'O' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>O</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'P')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'P' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>P</div>
                </div>
                <div class="row flex items-center justify-center">
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'A')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'A' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>A</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'S')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'S' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>S</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'D')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'D' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>D</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'F')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'F' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>F</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'G')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'G' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>G</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'H')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'H' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>H</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'J')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'J' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>J</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'K')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'K' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>K</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'L')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'L' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>L</div>
                </div>
                <div class="row flex items-center justify-center">
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'Z')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'Z' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>Z</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'X')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'X' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>X</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'C')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'C' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>C</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'V')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'V' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>V</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'B')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'B' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>B</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'N')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'N' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>N</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'M')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'M' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>M</div>
                  <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, '-')}  
                  onDragEnd={handleDragEnd}
                  className={`key border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === '-' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>-</div>
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-between mt-8'>
                <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'True')}  
                  onDragEnd={handleDragEnd}
                  className={`w-full text-center border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'True' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>True</div>
                <div 
                draggable="true" 
                onDragStart={(e) => handleDragStart(e, 'False')}  
                onDragEnd={handleDragEnd}
                className={`w-full text-center border-thin-800 rounded-[3px] m-1 px-3 py-3 ${lastDraggedCharacter === 'False' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>False</div>
              </div>
            )}

            {enabledSubmitBtn === true && (
              <div className='flex justify-center mt-8'>
                <button className='w-1/2 py-2 px-5 mbg-800 rounded-[5px] mcolor-100 text-lg' onClick={() => submitAnswer(extractedQA[questionIndex].id)}>Submit Answer</button>
              </div>
            )}
          </div>


          <div className='w-1/2 mt-5'>
              {typeOfLearner === 'kinesthetic' ? (
              chanceLeft === 3 ? (
                <div className='w-full mcolor-800 flex justify-end pb-5'>
                  <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
                  <div><FavoriteIcon/></div>
                  <div><FavoriteIcon/></div>
                  <div><FavoriteIcon/></div>
                </div>
              ) : chanceLeft === 2 ? (
                <div className='w-full mcolor-800 flex justify-end pb-5'>
                  <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
                  <span><FavoriteIcon/></span>
                  <span><FavoriteIcon/></span>
                </div>
              ) : chanceLeft === 1 ? (
                <div className='w-full mcolor-800 flex justify-end pb-5'>
                  <span className='mcolor-800 font-medium text-lg'>Chance Left: </span>
                  <div className='shake-animation pl-1'><FavoriteIcon/></div>
                </div>
              ) : null
            ) : null}

            <div className='flex justify-end'>
              {chanceLeft === 3 && (
                <img className='float-animation' src={catsImage1} style={{width: '80%'}} alt="" />
              )}

              {chanceLeft === 2 && (
                <img className='float-animation' src={catsImage2} style={{width: '80%'}} alt="" />
              )}

              {chanceLeft === 1 && (
                <img className='shake-game-animation' src={catsImage2} style={{width: '80%'}} alt="" />
              )}

              {chanceLeft === 0 && (
                <img className='shake-game-animation1' src={catsImage3} style={{width: '80%'}} alt="" />
              )}
            </div>

          </div>

        </div>
        ) : (
          <p className='text-center my-5 text-xl mcolor-500'>Nothing to show</p>
        )
      }
    </div>
  )
}
