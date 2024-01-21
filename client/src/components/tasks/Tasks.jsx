import React, { useEffect, useState } from 'react'
import { Navbar } from '../navbar/logged_navbar/navbar';
import { DateTime, Interval } from 'luxon';
import { useUser } from '../../UserContext';
import { SERVER_URL } from '../../urlConfig';
import { Sidebar } from '../sidebar/Sidebar';


// Component imports
import { AddingTask } from './AddingTask';
import { UpdateTasks } from './UpdateTasks';
import { DeleteTask } from './DeleteTask';
import { CompletedTask } from './CompletedTask';
import axios from 'axios';


// icon imports
import PushPinIcon from '@mui/icons-material/PushPin';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import AddTaskIcon from '@mui/icons-material/AddTask';

export const Tasks = ({room, groupId}) => {

  // States
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [listOfTasks, setListOfTasks] = useState([]);
  const [taskID, setTaskID] = useState(0);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [loading, setLoading] = useState(true);

  const { user } = useUser()
  const UserId = user?.id;

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


  
  useEffect(() => {

    const fetchData = async () => {

      let renderLink = ''

      if (room === 'Personal') {
        renderLink = `${SERVER_URL}/tasks/personal/${UserId}`
      } else {
        renderLink = `${SERVER_URL}/tasks/group/${groupId}`
      }

      await axios.get(renderLink).then((response) => {
        setListOfTasks(response.data);
      });


      setLoading(false)
    }

    fetchData()

  }, [setListOfTasks, UserId, room, groupId, SERVER_URL, setLoading]); 
  

  
  if (loading) {
    return <div className='h-[100vh] w-full flex items-center justify-center'>
      <div class="loader">
        <div class="spinner"></div>
      </div>
    </div>
  } else {
    return (
      <div className='poppins mcolor-900 mbg-300 relative flex'>

        <Sidebar currentPage={room === 'Personal' ? 'personal-study-area' : 'group-study-area'} />

        <div className={`lg:w-1/6 h-[100vh] flex flex-col items-center justify-between py-2 lg:mb-0 ${
        window.innerWidth > 1020 ? '' :
        window.innerWidth <= 768 ? 'hidden' : 'hidden'
      } mbg-800`}></div>

        <div className='flex-1 mbg-300 w-full p-6'>
          <p className='text-3xl mb-5 font-medium flex items-center mcolor-900'>
            <AddTaskIcon className='mr-1 mcolor-700' fontSize='large' />
            <p>Tasks</p>
          </p>

          <div className="border-medium-800 gen-box flex justify-between items-center rounded">
            <div className='box1 mbg-input border-box w-1/2'>
              <div className='scroll-box p-7'>
                <div className='flex items-center justify-between'>
                  <p className='text-2xl font-normal'>List of Tasks</p>
                  {!showAddTaskModal ? (
                    <button className='px-7 py-1 text-lg mbg-800 mcolor-100 rounded' onClick={() => setShowAddTaskModal(true)}>Add Task</button>
                    ) : (
                    <button className='px-7 py-1 text-4xl rounded' onClick={() => setShowAddTaskModal(false)}>&times;</button>
                  )}
                </div>
  
                {showAddTaskModal && (
                  <div>
                    {/* Adding a task form */}
                    <AddingTask unhideModal={dynamicClassNameForUnhide} task={task} setTask={setTask} dueDate={dueDate} setDueDate={setDueDate} room={room} setTaskID={setTaskID} listOfTasks={listOfTasks} setListOfTasks={setListOfTasks} UserId={UserId} groupId={groupId} />
                  </div>
                )}
  
  
  
                {/* Updating a task form */}
                <UpdateTasks task={task} dueDate={dueDate} room={room} taskID={taskID} listOfTasks={listOfTasks} setListOfTasks={setListOfTasks} setTask={setTask} setDueDate={setDueDate} setTaskID={setTaskID} hideModal={dynamicClassNameForHidden} closeModal={closeModal} setIsButtonClicked={setIsButtonClicked} UserId={UserId} groupId={groupId} />
  
                
                {listOfTasks
                  .filter((task) => task.completedTask !== "Completed")
                  .length === 0 && (
                    <p className='text-center text-xl mcolor-800-opacity my-10'>No assigned task</p>
                )}

                {/* Unaccomplished Tasks */}
                <div className='my-5'>
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
  
  
                      const abbreviatedMonth = formattedDueDate.slice(0, 3);
                      const formattedDueDateAbbreviated = `${abbreviatedMonth} ${dueDate.getDate()}, ${dueDate.getFullYear()}`;
  
            
                      return (
                        <div key={key} className='flex items-start justify-between w-full mbg-200 px-4 py-3 border-thin-800 rounded my-5'>
                          <div className='w-3/4'  style={{ whiteSpace: 'pre-wrap' }}>
                            <div><PushPinIcon className='text-red-dark' /> {task.task}</div>
                            <div className='mt-3'><WatchLaterIcon sx={{ fontSize: '22px' }} /> {formattedDueDateAbbreviated}, {formattedTime}</div>
                            <div className={`mt-2`}><PendingActionsIcon/> <span className={`${formattedTimeDifference === 'Overdue' ? 'text-red-dark' : ''}`}>{formattedTimeDifference}</span></div>
                          </div>
                          <div className='mt-1 flex items-center justify-end w-1/4'>
                            <CompletedTask listOfTasks={listOfTasks} setListOfTasks={setListOfTasks} setTask={setTask} setDueDate={setDueDate} setTaskID={setTaskID} taskId={task.id} UserId={UserId} groupId={groupId} />
                            <DeleteTask taskId={task.id} listOfTasks={listOfTasks} setListOfTasks={setListOfTasks} UserId={UserId} groupId={groupId} />
                            <button className='py-1' onClick={() => openModal(task.id, task.task, task.dueDate)}><EditIcon UserId={UserId} groupId={groupId} /></button>
                          </div>
                        <br />
                      </div>
                      )
                    })}
                </div>
  
              </div>
            </div>
  
            <div className='box2 mbg-input border-box w-1/2 '>
  
              {/* Accomplished Tasks */}
              <div className='scroll-box p-8'>

                <p className='text-2xl font-normal'>Recently Accomplished</p>

                {listOfTasks
                  .filter((task) => task.completedTask === "Completed")
                  .length === 0 && (
                    <p className='text-center text-xl mcolor-800-opacity my-10'>No completed task yet</p>
                )}


                {listOfTasks
                .filter((task) => task.completedTask === "Completed")
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((task) => {
  
                  const dueDate = new Date(task.updatedAt);
  
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
  
  
                  const abbreviatedMonth = formattedDueDate.slice(0, 3);
                  const formattedDueDateAbbreviated = `${abbreviatedMonth} ${dueDate.getDate()}, ${dueDate.getFullYear()}`;
  
                  return (
                    <div key={task.id} className='flex items-start justify-between w-full mbg-200 px-4 py-3 border-thin-800 rounded my-5'>
                      <div>
                        <div><DoneIcon /> {task.task}</div>
                        <div className='my-1'><WatchLaterIcon sx={{ fontSize: '22px' }} /> {formattedDueDateAbbreviated} - {formattedTime}</div>
                      </div>
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
}
