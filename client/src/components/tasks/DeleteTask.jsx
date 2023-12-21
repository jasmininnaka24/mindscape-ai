import axios from 'axios';
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { useUser } from '../../UserContext';


export const DeleteTask = (props) => {

  const { taskId, listOfTasks, setListOfTasks } = props;

  const { SERVER_URL } = useUser()

  const deleteTask = async () => {
    console.log(taskId, listOfTasks);
    // Show a confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete?");
  
    if (confirmed) {
       await axios.delete(`${SERVER_URL}/tasks/${taskId}`).then(() => {
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
