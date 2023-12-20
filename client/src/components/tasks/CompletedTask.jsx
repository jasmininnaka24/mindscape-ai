import axios from 'axios';
import React from 'react'
import DoneIcon from '@mui/icons-material/Done';
import { useUser } from '../../UserContext';


export const CompletedTask = (props) => {

  const { taskId, listOfTasks, setListOfTasks, setTask, setDueDate, setTaskID } = props;

  const { SERVER_URL } = useUser()

  const taskCompleted = async (taskId) => {
      
    await axios.put(`${'http://localhost:3001'}/tasks/completed/${taskId}`).then((response) => {
      const updatedTask = response.data;

      const updatedList = listOfTasks.map(task => {
        if (task.id === updatedTask.id) {
          return updatedTask;
        }
        // Otherwise, return the original task
        return task;
      });

      setListOfTasks(updatedList);
      setTask("");
      setDueDate("");
      setTaskID("");
    });

  };

  return (
    <button className='py-1 text-greenn' onClick={() => taskCompleted(taskId)}><DoneIcon fontSize='medium' /></button>
  )
}
