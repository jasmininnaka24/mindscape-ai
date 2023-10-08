import axios from 'axios';
import React from 'react'

export const DeleteTask = (props) => {

  const { taskId, listOfTasks, setListOfTasks } = props;

  const deleteTask = () => {
    console.log(taskId, listOfTasks);
    // Show a confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete?");
  
    if (confirmed) {
      axios.delete(`http://localhost:3001/tasks/${taskId}`).then(() => {
        const updatedTasks = listOfTasks.filter((task) => task.id !== taskId);  
        setListOfTasks(updatedTasks);
        }
      );
    }

  };
  return (
    <button className='px-3 py-1 rounded-[4px] wrong-bg' onClick={deleteTask}>
      Delete
    </button>
  )
}
