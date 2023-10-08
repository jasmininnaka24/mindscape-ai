import axios from 'axios';
import React from 'react'

export const CompletedTask = (props) => {

  const { taskId, listOfTasks, setListOfTasks, setTask, setDueDate, setTaskID } = props;

  const taskCompleted = (taskId) => {
      
    axios.put(`http://localhost:3001/tasks/completed/${taskId}`).then((response) => {
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
    <button className='px-3 py-1 rounded-[4px] correct-bg' onClick={() => taskCompleted(taskId)}>Done</button>
  )
}
