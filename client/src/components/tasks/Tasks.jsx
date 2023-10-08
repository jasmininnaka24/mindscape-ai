import React, { useState } from 'react'
import { Navbar } from '../navbar/logged_navbar/navbar';
import { DateTime, Interval } from 'luxon';

// Component imports
import { RenderTasks } from './RenderTasks';
import { AddingTask } from './AddingTask';
import { UpdateTasks } from './UpdateTasks';
import { DeleteTask } from './DeleteTask';
import { CompletedTask } from './CompletedTask';

export const Tasks = (props) => {

  // States
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [listOfTasks, setListOfTasks] = useState([]);
  const [taskID, setTaskID] = useState(0)
  const room = props.room;

  // Modals Functionalities
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const dynamicClassNameForHidden = isButtonClicked ? "mt-10 mr-4 ml-6 flex justify-center" : "hidden mt-10 mx-4 flex justify-center";
  const dynamicClassNameForUnhide = isButtonClicked ? "hidden mt-10 mx-4 flex justify-center" : "mt-10 mx-4 flex justify-center";


  const openModal = (taskId, task, taskDueDate) => {
    setIsButtonClicked(true);
    setTaskID(taskId);
    setTask(task);
    setDueDate(taskDueDate);
  }

  const closeModal = () => {
    setIsButtonClicked(false);
    setTask("");
    setDueDate("");
    setTaskID("");
  }
  

  return (
    <div>
      <div>
        <Navbar page={'Tasks'} username={'Jennie Kim'} />
        <RenderTasks setListOfTasks={setListOfTasks} />
        <div data-aos='fade' className="border gen-box flex justify-between items-center">
          <div className='box1 border-box w-1/2'>
            <div className='scroll-box'>

              {/* Adding a task form */}
              <AddingTask unhideModal={dynamicClassNameForUnhide} task={task} setTask={setTask} dueDate={dueDate} setDueDate={setDueDate} room={room} setTaskID={setTaskID} listOfTasks={listOfTasks} setListOfTasks={setListOfTasks} />



              {/* Updating a task form */}
              <UpdateTasks task={task} dueDate={dueDate} room={room} taskID={taskID} listOfTasks={listOfTasks} setListOfTasks={setListOfTasks} setTask={setTask} setDueDate={setDueDate} setTaskID={setTaskID} hideModal={dynamicClassNameForHidden} closeModal={closeModal} setIsButtonClicked={setIsButtonClicked} />


              {/* Unaccomplished Tasks */}
              <div className='m-5 pr-5'>
                {/* List of tasks that are need to be accomplished */}
                {listOfTasks
                  .filter(task => task.completedTask === 'Uncompleted' && task.id !== taskID) 
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
                  .map((task, key) => {
                    const currentDateTime = DateTime.now();
                    const dueDateTime = DateTime.fromISO(task.dueDate);
                    const timeDifference = Interval.fromDateTimes(currentDateTime, dueDateTime);

                    // Calculate the time difference in days, hours, and minutes
                    const { days, hours, minutes } = timeDifference.toDuration(['days', 'hours', 'minutes']).toObject();

                    // Round off hours and minutes
                    const roundedHours = Math.round(hours);
                    const roundedMinutes = Math.round(minutes);

                    // Check if the task is overdue
                    const isOverdue = timeDifference.isPast;

                    // Create an array to store the time parts to include
                    const timeParts = [];

                    // Conditionally include "days" if days > 0
                    if (days > 0) {
                      timeParts.push(`${days} day${days > 1 ? 's' : ''}`);
                    }

                    // Conditionally include "hours" if roundedHours > 0
                    if (roundedHours > 0) {
                      timeParts.push(`${roundedHours} hour${roundedHours > 1 ? 's' : ''}`);
                    }

                    // Conditionally include "minutes" if roundedMinutes > 0
                    if (roundedMinutes > 0) {
                      timeParts.push(`${roundedMinutes} minute${roundedMinutes > 1 ? 's' : ''}`);
                    }

                    // Format the time difference based on included time parts and overdue status
                    let formattedTimeDifference = '';

                    if (isOverdue) {
                      formattedTimeDifference = 'On time';
                    } else if (timeParts.length === 0) {
                      // Handle case when all time components are zero
                      formattedTimeDifference = `Overdue`;
                    } else {
                      // Handle case when the task is not overdue
                      formattedTimeDifference = `${timeParts.join(' ')} from now`;
                    }

                    const dueDate = new Date(task.dueDate);

                    // Format the date as "Month Day, Year"
                    const formattedDueDate = dueDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });

                    const formattedTime = dueDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
          
                    return (
                      <div key={key}>
                      <div>Task: {task.task}</div>
                      <div>Due Date: {formattedDueDate}, {formattedTime}</div>
                      <div>Task Due: {formattedTimeDifference}</div>
                      <div className='mt-1 flex justify-start items-center gap-3'>
                        <CompletedTask listOfTasks={listOfTasks} setListOfTasks={setListOfTasks} setTask={setTask} setDueDate={setDueDate} setTaskID={setTaskID} taskId={task.id} />
                        <button className='px-3 py-1 rounded-[4px] border' onClick={() => openModal(task.id, task.task, task.dueDate)}>Update</button>
                        <DeleteTask taskId={task.id} listOfTasks={listOfTasks} setListOfTasks={setListOfTasks} />
                      </div>
                      <br />
                    </div>
                    )
                  })}
              </div>

            </div>
          </div>

          <div className='box2 border-box w-1/2'>

            {/* Accomplished Tasks */}
            <div className='scroll-box p-5'>
              <div className='text-3xl font-bold'>Completed Tasks:</div><br />
              {listOfTasks
              .filter((task) => task.completedTask === "Completed")
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((task) => {
                return (
                  <div key={task.id}>
                    <div>Task: {task.task}</div>
                    <div>Status: {task.completedTask}</div>
                    <br />
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
