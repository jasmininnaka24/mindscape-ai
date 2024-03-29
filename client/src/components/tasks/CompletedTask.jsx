import axios from 'axios';
import React from 'react'
import DoneIcon from '@mui/icons-material/Done';
import { SERVER_URL } from '../../urlConfig';


export const CompletedTask = (props) => {

  const { taskId, listOfTasks, setListOfTasks, setTask, setDueDate, setTaskID } = props;

  const taskCompleted = async (taskId) => {
      
    await axios.put(`${SERVER_URL}/tasks/completed/${taskId}`).then((response) => {
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
