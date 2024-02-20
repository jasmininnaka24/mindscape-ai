import axios from 'axios';
import React from 'react';
import { DateTime } from 'luxon';  // Import Luxon DateTime for date manipulation
import { SERVER_URL } from '../../urlConfig';
import { useResponsiveSizes } from '../useResponsiveSizes'; 


export const AddingTask = (props) => {

  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


  const { task, dueDate, room, listOfTasks, setListOfTasks, setTask, setDueDate, unhideModal, UserId, groupId, setShowAddTaskModal } = props;


  // Adding task to the database
  const addTask = async (event) => {
    event.preventDefault();

    // Check if the selected date is in the past
    const selectedDate = DateTime.fromISO(dueDate);
    if (selectedDate < DateTime.now()) {
      console.error("Due date must be in the present or future");
      return;  // Exit the function if the date is in the past
    }

    const data = {
      task: task,
      dueDate: dueDate,
      completedTask: "Uncompleted",
      room: room,
      [room === 'Personal' ? 'UserId' : 'StudyGroupId']: room === 'Personal' ? UserId : groupId,
    };

    try {
      const response = await axios.post(`${SERVER_URL}/tasks`, data);
      setListOfTasks([response.data, ...listOfTasks]);
    } catch (error) {
      console.error("Error adding task:", error);
    }

    setTask("");
    setDueDate("");
    setShowAddTaskModal(false)
  };

  function getCurrentDateTime() {
    const now = new Date();
    const nextMinute = new Date(now.getTime() + 60000); // Adding 1 minute to the current time
    const year = nextMinute.getFullYear();
    const month = (nextMinute.getMonth() + 1).toString().padStart(2, '0');
    const day = nextMinute.getDate().toString().padStart(2, '0');
    const hours = nextMinute.getHours().toString().padStart(2, '0');
    const minutes = nextMinute.getMinutes().toString().padStart(2, '0');
  
    // Format: "YYYY-MM-DDTHH:mm"
    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    return currentDateTime;
  }
  

  return (
    <form className={`${unhideModal} flex flex-col w-full gap-2`} onSubmit={addTask}>
      <textarea 
        required
        type="text"
        placeholder='Task...'
        value={task}
        onChange={(event) => {
          setTask(event.target.value);
        }}
        className='px-4 w-full py-2 text-sm border-thin-800 rounded mx-1 w-1/2'
      ></textarea>

      <input
        required
        type="datetime-local"
        value={dueDate}
        className='mx-1 text-sm border-thin-800 rounded px-4 py-2 w-full'
        onChange={(event) => {
          setDueDate(event.target.value);
        }}
        min={getCurrentDateTime()}
      />

      <div className='flex items-center justify-end gap-1'>
        <button type='submit' className='px-5 text-sm py-2 rounded-[5px] mbg-800 mcolor-100 '>Add Task</button>
      </div>
    </form>
  );
};
