import axios from 'axios';
import React from 'react'
import { DateTime } from 'luxon';
import { SERVER_URL } from '../../urlConfig';
import { useResponsiveSizes } from '../useResponsiveSizes'; 


export const UpdateTasks = (props) => {

  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();

  const { task, dueDate, room, taskID, listOfTasks, setListOfTasks, setTask, setDueDate, setTaskID, hideModal, closeModal, setIsButtonClicked } = props;



  const updateTask = async (event) => {
    event.preventDefault();
    const data = {
      task: task,
      dueDate: dueDate,
      completedTask: "Uncompleted",
    }

    await axios.put(`${SERVER_URL}/tasks/${taskID}`, data).then((response) => {

      const updatedTask = response.data;

      const updatedList = listOfTasks.map(task => {
        if (task.id === updatedTask.id) {
          return updatedTask;
        }
        return task;
      });

      setListOfTasks(updatedList);
      setTask("");
      setDueDate("");
      setTaskID("");
      setIsButtonClicked(false);
    })
  }

  const selectedDate = DateTime.fromISO(dueDate);
  if (selectedDate < DateTime.now()) {
    console.error("Due date must be in the present or future");
    return;  // Exit the function if the date is in the past
  }


  function getCurrentDateTime() {
    const now = new Date();
    const nextMinute = new Date(now.getTime() + 60000); // Adding 1 minute to the current time
    
    // Get year, month, day, hours, and minutes
    const year = nextMinute.getFullYear();
    const month = (nextMinute.getMonth() + 1).toString().padStart(2, '0');
    const day = nextMinute.getDate().toString().padStart(2, '0');
    const hours = nextMinute.getHours().toString().padStart(2, '0');
    const minutes = nextMinute.getMinutes().toString().padStart(2, '0');
    
    // Construct the date and time string
    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    return currentDateTime;
    
  }
  


  return (
    <form className={`${hideModal} flex flex-col w-full gap-2`} onSubmit={updateTask}>
      <textarea 
        type="text" 
        placeholder='Task...' 
        className='px-4 w-full py-2 text-sm border-thin-800 rounded w-1/2'
        value={task} onChange={(event) => {
        setTask(event.target.value);
      }}
      ></textarea>
      <input 
        type="datetime-local" 
        value={dueDate} 
        className='text-sm border-thin-800 rounded px-4 py-2 w-full'
        onChange={(event) => {
        setDueDate(event.target.value);
        }} 
        min={getCurrentDateTime()}
      />
      <div className='flex items-center justify-end gap-1'>
        <button type='submit' className='px-5 text-sm py-2 rounded-[5px] mbg-800 mcolor-100 '>Update</button>
        <div className='text-4xl cursor-pointer' onClick={closeModal}>&times;</div>
      </div>
    </form>
  )
}
