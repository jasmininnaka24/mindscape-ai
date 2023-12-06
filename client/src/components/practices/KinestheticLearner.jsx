import React, { useEffect, useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import catsImage1 from '../../assets/castImage1.png';
import catsImage2 from '../../assets/catsImage2.png';
import catsImage3 from '../../assets/catsImage3.png';


export const KinestheticLearner = (props) => {

  const { extractedQA, questionIndex, remainingHints, giveHint, kinesthethicAnswers, borderMedium, handleDragOver, removeValueOfIndex, selectedChoice, typeOfLearner, handleDragStart, handleDragEnd, lastDraggedCharacter, enabledSubmitBtn, submitAnswer, chanceLeft, setLastDraggedCharacter, setKinesthethicAnswers, setSelectedChoice, kinestheticAnswer, handleDrop } = props;


  const [shuffledCharacters, setShuffledCharacters] = useState([]);
  const [draggedCharacters, setDraggedCharacters] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledCharactersWithId, setShuffledCharactersWithId] = useState([]);


  // Function to perform Fisher-Yates shuffle
  const shuffleArray = (array, originalOrder) => {
    const nonSpaceCharacters = array.filter((char) => char !== ' ');
  
    // Shuffle the characters until the shuffled order is different from the original order
    let shuffledArray;
    do {
      for (let i = nonSpaceCharacters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nonSpaceCharacters[i], nonSpaceCharacters[j]] = [nonSpaceCharacters[j], nonSpaceCharacters[i]];
      }
  
      shuffledArray = array.map((char) => (char === ' ' ? char : nonSpaceCharacters.shift()));
    } while (JSON.stringify(shuffledArray) === JSON.stringify(originalOrder));
  
    return shuffledArray;
  };




  

  useEffect(() => {
    // Ensure that extractedQA and extractedQA[questionIndex] are defined
    if (extractedQA && extractedQA[questionIndex]) {
      // Shuffle the characters once on component mount
      const initialShuffledCharacters = Array.from(extractedQA[questionIndex].answer).filter((char) => char !== ' ');
      setOriginalOrder(initialShuffledCharacters.slice()); // Save the original order

      // Use shuffleArray to create shuffledCharactersWithId
      const shuffledArray = shuffleArray(initialShuffledCharacters, initialShuffledCharacters);
      const shuffledCharactersWithId = shuffledArray.map((char, index) => ({
        id: `${char}-${index}`, // Use a unique identifier for each character
        char,
      }));
      setShuffledCharactersWithId(shuffledCharactersWithId);

      // Initialize draggedCharacters array for the current question
      setDraggedCharacters([]);
    }
  }, [extractedQA, questionIndex]);




  const handleDropKinesthetic = (e, index) => {
    e.preventDefault();
  
    // Check if the target index already has a value
    if (kinesthethicAnswers[index] !== ' ') {
      console.log('Target index already has a value. Drop ignored.');
      return;
    }
  
    const droppedChoiceText = e.dataTransfer.getData('text/plain');
  
    if (extractedQA[questionIndex].quizType !== 'ToF') {
      const draggedAnswers = [...kinesthethicAnswers];
      draggedAnswers[index] = droppedChoiceText;
      setKinesthethicAnswers(draggedAnswers);
      setSelectedChoice(draggedAnswers.join('').toLowerCase());
    } else {
      setSelectedChoice(droppedChoiceText);
    }
    setLastDraggedCharacter(droppedChoiceText);
  
    // Remove the dropped character from shuffledCharactersWithId, including identical characters
    setShuffledCharactersWithId((prevChars) => {
      const removedIndex = prevChars.findIndex((char) => char.char === droppedChoiceText);
  
      if (removedIndex !== -1) {
        // Remove the dropped character by index
        return [...prevChars.slice(0, removedIndex), ...prevChars.slice(removedIndex + 1)];
      }
  
      return prevChars;
    });
  
    // Remove the dropped character from shuffledCharacters if it was originally part of the shuffled characters
    setShuffledCharacters((prevChars) =>
      prevChars.filter((char) => char !== droppedChoiceText)
    );
  };
  
  
  

  function handleDragStartKinesthetic(e, char) {
    // Set the lastDraggedCharacter state
    setLastDraggedCharacter(char);
    e.dataTransfer.setData("text/plain", char);

  }
  
  function handleDragEndKinesthetic() {
    // Handle any cleanup or additional logic after dragging ends
    setShuffledCharacters((prevShuffledCharacters) => {
      const indexToRemove = shuffledCharacters.findIndex(
        (char) => lastDraggedCharacter === char
      );
      if (indexToRemove !== -1) {
        // Remove the dragged character by index
        return [
          ...prevShuffledCharacters.slice(0, indexToRemove),
          ...prevShuffledCharacters.slice(indexToRemove + 1),
        ];
      }
      return prevShuffledCharacters;
    });
  }


  const removeValueOfIndexKinesthetic = (index) => {
    if (extractedQA[questionIndex].quizType !== 'ToF') {
      const draggedAnswers = [...kinesthethicAnswers];
      const removedCharacter = draggedAnswers[index];
  
      // Check if there is a value to remove
      if (removedCharacter !== ' ') {
        // Find the original index of the removed character
        const originalIndex = originalOrder.indexOf(removedCharacter);
  
        // Create a copy of shuffledCharactersWithId to avoid mutating the state directly
        const newShuffledCharactersWithId = [...shuffledCharactersWithId];
  
        // Insert the removed character back to its original position
        newShuffledCharactersWithId.splice(originalIndex, 0, {
          id: `${removedCharacter}-${originalIndex}`,
          char: removedCharacter,
        });
  
        // Update the state with the new order
        setShuffledCharactersWithId(newShuffledCharactersWithId);
      }
  
      // Reset the answer at the dragged index
      draggedAnswers[index] = ' ';
      setKinesthethicAnswers(draggedAnswers);
    } else {
      setSelectedChoice('');
    }
    setLastDraggedCharacter('');
  };
  
  


  return (
    <div>
      {extractedQA.length > 0 ? (
        <div className='flex items-center'>

          {/* question */}
          <div className='w-full'>
            <div className='relative mt-4 pb-5 text-center text-xl font-medium text-xl mcolor-900'>
              <p className='mbg-300 mcolor-900 w-full rounded-[5px] p-5 mcolor-800'>{extractedQA[questionIndex].question}</p>
            </div>

            <div>

              {/* remaining hints and hint button */}
              <div>
                {(extractedQA[questionIndex].quizType !== 'ToF') && (
                  <div className='w-full flex items-center'>
                    <button className='mcolor-800 mbg-200 border-thin-800 rounded-[5px] px-2 py-1 text-lg mt-2' onClick={giveHint}>Use hint <span className='bg-red mcolor-100 px-2 ml-1 rounded-full text-sm'>{remainingHints}</span></button>
                    <p className='text-lg ml-4 font-bold mcolor-900'>{kinestheticAnswer.toUpperCase()}</p>
                  </div>
                )}
              </div>

              <div className='flex items-center w-full mt-4'>
              {
                extractedQA[questionIndex].quizType !== 'ToF' ? (
                  Array.from({ length: extractedQA[questionIndex].answer.length }).map((_, index) => {
                    const answer = kinesthethicAnswers && kinesthethicAnswers[index];

                    return (
                      <span
                        key={index}
                        className={`w-full text-center mx-1 rounded cursor-pointer ${
                          extractedQA[questionIndex].answer[index] !== ' '
                            ? answer === ' '
                              ? `py-5 mbg-200 mcolor-900 ${borderMedium}`
                              : `py-2 mbg-700 mcolor-100 ${borderMedium} not-allowed`
                            : ''
                        }`}
                        onDrop={(e) => handleDropKinesthetic(e, index)}
                        onDragOver={handleDragOver}
                        onClick={() => removeValueOfIndexKinesthetic(index)}
                        draggable={answer === ' '} // Set draggable attribute conditionally
                      >
                        {answer && answer.toUpperCase()}
                      </span>
                    );
                  })
                ) : (
                  <div
                    className={`w-full text-center mx-1 rounded-[5px] cursor-pointer mbg-200 min-h-[50px] flex items-center justify-center border-medium-800 ${
                      selectedChoice === '' ? 'mcolor-500' : 'mcolor-900'
                    }`}
                    onDrop={(e) => handleDrop(e)}
                    onDragOver={handleDragOver}
                    onClick={() => removeValueOfIndex()}
                    draggable={selectedChoice === ''} // Set draggable attribute conditionally
                  >
                    {selectedChoice || 'Drag here'}
                  </div>
                )
              }




              </div>

            </div>
            

            {(typeOfLearner === 'Kinesthetic' && extractedQA[questionIndex].quizType !== 'ToF') ? (
              <div class="w-full mt-5 flex items-center justify-center mbg-300 min-h-[10vh] px-4 rounded">
                <div class="flex flex-wrap justify-center"> 
                {shuffledCharactersWithId.map((item) => {
                  const isDragged = lastDraggedCharacter === item.char;

                  return (
                    <div
                      key={item.id}
                      draggable={'True'}
                      onDragStart={(e) => handleDragStartKinesthetic(e, item.char)}
                      onDragEnd={handleDragEndKinesthetic}
                      className={`key cursor-pointer border-thin-800 text-center rounded-[3px] m-1 px-8 py-3 mbg-200 mcolor-900'
                      }`}
                    >
                      {item.char.toUpperCase()}
                    </div>
                  );
                })}


                </div>
              </div>
            ) : (
              <div className='flex items-center justify-between mt-8'>
                <div 
                  draggable="true" 
                  onDragStart={(e) => handleDragStart(e, 'True')}  
                  onDragEnd={handleDragEnd}
                  className={`w-full text-center border-thin-800 rounded cursor-pointer m-1 px-3 py-3 ${lastDraggedCharacter === 'True' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>True</div>
                <div 
                draggable="true" 
                onDragStart={(e) => handleDragStart(e, 'False')}  
                onDragEnd={handleDragEnd}
                className={`w-full text-center border-thin-800 rounded cursor-pointer m-1 px-3 py-3 ${lastDraggedCharacter === 'False' ? 'mbg-700 mcolor-100' : 'mbg-200 mcolor-900'}`}>False</div>
              </div>
            )}

            {enabledSubmitBtn === true && (
              <div className='flex justify-center mt-8'>
                <button className='w-1/2 py-2 px-5 mbg-800 rounded-[5px] mcolor-100 text-lg' onClick={() => submitAnswer(extractedQA[questionIndex].id)}>Submit Answer</button>
              </div>
            )}
          </div>


          <div className='full mt-5'>
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

            {/* <div className='flex justify-end'>
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
            </div> */}

          </div>

        </div>
        ) : (
          <p className='text-center my-5 text-xl mcolor-500'>Nothing to show</p>
        )
      }
    </div>
  )
}
