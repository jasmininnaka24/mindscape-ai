import axios from 'axios';
import React from 'react';
import { DateTime } from 'luxon';  // Import Luxon DateTime for date manipulation
import { useUser } from '../../UserContext';


export const AddingTask = (props) => {
  const { task, dueDate, room, listOfTasks, setListOfTasks, setTask, setDueDate, unhideModal, UserId, groupId } = props;


  const { SERVER_URL } = useUser();


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
    <form className={unhideModal} onSubmit={addTask}>
      <input
        required
        type="text"
        placeholder='Task...'
        value={task}
        onChange={(event) => {
          setTask(event.target.value);
        }}
        className='px-4 py-1 border-thin-800 rounded mx-1 w-1/2'
      />

      <input
        required
        type="datetime-local"
        value={dueDate}
        className='mx-1 border-thin-800 rounded px-4'
        onChange={(event) => {
          setDueDate(event.target.value);
        }}
        min={getCurrentDateTime()}
      />

      <button type='submit' className='px-4 py-1 rounded mbg-700 mcolor-100'>Add Task</button>
    </form>
  );
};
