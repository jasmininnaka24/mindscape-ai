import axios from 'axios';
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';

export const DeleteTask = (props) => {

  const { taskId, listOfTasks, setListOfTasks } = props;

  const deleteTask = async () => {
    console.log(taskId, listOfTasks);
    // Show a confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete?");
  
    if (confirmed) {
       await axios.delete(`http://localhost:3001/tasks/${taskId}`).then(() => {
        const updatedTasks = listOfTasks.filter((task) => task.id !== taskId);  
        setListOfTasks(updatedTasks);
        }
      );
    }

  };
  return (
    <button className='px-2 py-1 text-red-dark' onClick={deleteTask}>
      <DeleteIcon fontSize='medium' />
    </button>
  )
}
