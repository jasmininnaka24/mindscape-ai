import axios from 'axios';
import React from 'react'

export const UpdateTasks = (props) => {

  const { task, dueDate, room, taskID, listOfTasks, setListOfTasks, setTask, setDueDate, setTaskID, hideModal, closeModal, setIsButtonClicked } = props;

  const updateTask = (event) => {
    event.preventDefault();
    const data = {
      task: task,
      dueDate: dueDate,
      completedTask: "Uncompleted",
      room: room,
      UserId: 2
    }


    axios.put(`http://localhost:3001/tasks/${taskID}`, data).then((response) => {

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

  return (
    <form className={hideModal} onSubmit={updateTask}>
      <input type="text" placeholder='Task...' value={task} onChange={(event) => {
        setTask(event.target.value);
      }} className='px-4 py-1 border mx-1 w-1/2' />
      <input type="datetime-local" value={dueDate} className='mx-1 border px-4' onChange={(event) => {
        setDueDate(event.target.value);
      }} />
      <div className='flex gap-1'>
        <button type='submit' className='px-4 py-1 rounded-[5px] primary-bg accent-color'>Update</button>
        <div className='text-5xl cursor-pointer' onClick={closeModal}>&times;</div>
      </div>
    </form>
  )
}
