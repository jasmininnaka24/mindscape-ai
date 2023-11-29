import axios from 'axios';
import React from 'react'
import { DateTime, Interval } from 'luxon';

export const UpdateTasks = (props) => {

  const { task, dueDate, room, taskID, listOfTasks, setListOfTasks, setTask, setDueDate, setTaskID, hideModal, closeModal, setIsButtonClicked } = props;

  const updateTask = async (event) => {
    event.preventDefault();
    const data = {
      task: task,
      dueDate: dueDate,
      completedTask: "Uncompleted",
      room: room,
      UserId: 2
    }

    await axios.put(`http://localhost:3001/tasks/${taskID}`, data).then((response) => {

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
    <form className={hideModal} onSubmit={updateTask}>
      <input 
        type="text" 
        placeholder='Task...' 
        className='px-4 py-1 border-thin-800 rounded mx-1 w-1/2'
        value={task} onChange={(event) => {
        setTask(event.target.value);
      }} />
      <input 
        type="datetime-local" 
        value={dueDate} 
        className='mx-1 border-thin-800 rounded px-4'
        onChange={(event) => {
        setDueDate(event.target.value);
        }} 
        min={getCurrentDateTime()}
      />
      <div className='flex gap-1'>
        <button type='submit' className='px-4 py-1 rounded-[5px] mbg-300 '>Update</button>
        <div className='text-5xl cursor-pointer' onClick={closeModal}>&times;</div>
      </div>
    </form>
  )
}
