import axios from 'axios';
import React from 'react';

export const AddingTask = (props) => {

  const { task, dueDate, room, listOfTasks, setListOfTasks, setTask, setDueDate, unhideModal } = props;

  // Adding task to the database
  const addTask = (event) => {
    event.preventDefault();
    const data = {
      task: task,
      dueDate: dueDate,
      completedTask: "Uncompleted",
      room: room,
      UserId: 2
    }

    axios.post("http://localhost:3001/tasks", data).then((response) => {
      setListOfTasks([response.data, ...listOfTasks]);
    })


    setListOfTasks([data, ...listOfTasks]);
    setTask("");
    setDueDate("");
  }

  return (
    <form className={unhideModal} onSubmit={addTask}>
      <input required type="text" placeholder='Task...' value={task} onChange={(event) => {
        setTask(event.target.value);
      }} className='px-4 py-1 border mx-1 w-1/2' />
      <input required type="datetime-local" value={dueDate} className='mx-1 border px-4' onChange={(event) => {
        props.setDueDate(event.target.value);
      }} />
      <button type='submit' className='px-4 py-1 rounded-[5px] primary-bg accent-color'>Add Task</button>
    </form>
  )
}
