import React, { useEffect, useState } from 'react'
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

// responsive sizes
import { useResponsiveSizes } from '../useResponsiveSizes'; 



export const Tasks = ({room, groupId}) => {

  const { extraSmallDevice, smallDevice, mediumDevices, largeDevices, extraLargeDevices } = useResponsiveSizes();


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
  const dynamicClassNameForHidden = isButtonClicked ? "flex justify-center" : "hidden flex justify-center";
  const dynamicClassNameForUnhide = isButtonClicked ? "hidden flex justify-center" : "flex justify-center";


  const openModal = (taskId, task, taskDueDate) => {
    setIsButtonClicked(true);
    setTaskID(taskId);
    setTask(task);
    setDueDate(taskDueDate);
    setShowAddTaskModal(false)
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
      <div className='poppins mcolor-900 mbg-200 relative flex'>

        <Sidebar currentPage={room === 'Personal' ? 'personal-study-area' : 'group-study-area'} />

        <div className={`min-h-[100vh] flex flex-col items-center justify-between py-2 ${extraLargeDevices && 'w-1/6'} mbg-800`}></div>


        <div className={`flex-1 mbg-200 w-full py-5 ${extraSmallDevice ? 'px-3' : 'px-8'}`}>
          <p className='mt-5 text-3xl mb-5 font-medium flex items-center mcolor-900'>
            <AddTaskIcon className='mr-1 mcolor-700' fontSize='large' />
            <p>Tasks</p>
          </p>

          <div className={`border-medium-800 flex ${(extraLargeDevices || largeDevices) ? 'flex-row gen-box' : 'flex-col'} justify-between items-center rounded`}>
            <div className={`min-h-[80vh] box1 mbg-input border-box ${(extraLargeDevices || largeDevices) ? 'w-1/2' : 'w-full'}`}>
              <div className='p-7'>
                <div className={`flex ${extraSmallDevice ? 'flex-col-reverse' : 'flex-row  items-center justify-between'}`}>
                  <p className={`${extraSmallDevice ? 'text-sm' : 'text-xl'} font-normal`}>{!showAddTaskModal ? 'List of Tasks' : 'Add a Task'}</p>
                  <div className='flex items-center justify-end inline'>
                    {!isButtonClicked && (
                      !showAddTaskModal ? (
                        <button className={`py-1 ${extraSmallDevice ? 'text-sm px-2' : 'text-md px-4'} mbg-800 mcolor-100 rounded`} onClick={() => setShowAddTaskModal(true)
                        
                        }>Add Task</button>
                        ) : (
                        <button className={`px-4 py-1 text-4xl rounded`} onClick={() => setShowAddTaskModal(false)}>&times;</button>
                      )
                    )
                    }
                  </div>
                </div>
  
                {showAddTaskModal && (
                  <div className='w-full'>
                    {/* Adding a task form */}
                    <AddingTask unhideModal={dynamicClassNameForUnhide} task={task} setTask={setTask} dueDate={dueDate} setDueDate={setDueDate} room={room} setTaskID={setTaskID} listOfTasks={listOfTasks} setListOfTasks={setListOfTasks} UserId={UserId} groupId={groupId} setShowAddTaskModal={setShowAddTaskModal} />
                  </div>
                )}
  
  
  
                {/* Updating a task form */}
                <div className='w-full mt-5'>
                  <UpdateTasks task={task} dueDate={dueDate} room={room} taskID={taskID} listOfTasks={listOfTasks} setListOfTasks={setListOfTasks} setTask={setTask} setDueDate={setDueDate} setTaskID={setTaskID} hideModal={dynamicClassNameForHidden} closeModal={closeModal} setIsButtonClicked={setIsButtonClicked} UserId={UserId} groupId={groupId} />
                </div>
  
                
                {listOfTasks
                  .filter((task) => task.completedTask !== "Completed")
                  .length === 0 && (
                    <p className={`text-center ${extraSmallDevice ? 'text-sm' : 'text-xl'} mcolor-800-opacity my-10`}>No assigned task</p>
                )}

                {/* Unaccomplished Tasks */}
                <div className='my-5'>
                  {/* List of tasks that are need to be accomplished */}
                  {!showAddTaskModal && (
                    listOfTasks
                      .filter(task => task.completedTask === 'Uncompleted' && task.id !== taskID) 
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
                      .map((task, key) => {
                        const currentDateTime = new Date(); // Get the current date and time
                        const dueDateTime = new Date(task.dueDate); // Convert the due date string to a Date object
                        
                        const timeDifference = dueDateTime.getTime() - currentDateTime.getTime(); // Calculate the time difference in milliseconds
                        
                        // Convert the time difference to days, hours, and minutes
                        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                        
                        // Check if the task is overdue
                        const isOverdue = timeDifference < 0;
                        
                        // Create an array to store the time parts to include
                        const timeParts = [];
                        
                        // Conditionally include "days" if days > 0
                        if (days > 0) {
                            timeParts.push(`${days} day${days > 1 ? 's' : ''}`);
                        }
                        
                        // Conditionally include "hours" if hours > 0
                        if (hours > 0) {
                            timeParts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
                        }
                        
                        // Conditionally include "minutes" if minutes > 0
                        if (minutes > 0) {
                            timeParts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
                        }
                        
                        // Format the time difference based on included time parts and overdue status
                        let formattedTimeDifference = '';
                        
                        if (isOverdue) {
                            formattedTimeDifference = 'Overdue';
                        } else if (timeParts.length === 0) {
                            formattedTimeDifference = 'Due now';
                        } else {
                            formattedTimeDifference = `Due in ${timeParts.join(', ')}`;
                        }
                        
                        // Format the due date
                        const formattedDueDate = dueDateTime.toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        });
                        
                        // Format the due time
                        const formattedTime = dueDateTime.toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                        });
                        
                        // Create an abbreviated month
                        const abbreviatedMonth = formattedDueDate.slice(0, 3);
                        const formattedDueDateAbbreviated = `${abbreviatedMonth} ${dueDateTime.getDate()}, ${dueDateTime.getFullYear()}`;                       
    
              
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
                      })
                    )
                  }
                </div>
  
              </div>
            </div>
  
            <div className={`min-h-[80vh] box2 mbg-input border-box ${(extraLargeDevices || largeDevices) ? 'w-1/2' : 'w-full gen-border-top'}`}>
  
              {/* Accomplished Tasks */}
              <div className='scroll-box p-8'>

                <p className={`${extraSmallDevice ? 'text-sm' : 'text-xl'} font-normal`}>Recently Accomplished</p>

                {listOfTasks
                  .filter((task) => task.completedTask === "Completed")
                  .length === 0 && (
                    <p className={`text-center ${extraSmallDevice ? 'text-sm' : 'text-xl'} mcolor-800-opacity my-10`}>No completed task yet</p>
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
