import React from 'react';
import { Tasks } from '../../../../components/tasks/Tasks';
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar';
import { useParams } from 'react-router-dom';

export const GroupTasks = () => {
  
  const { groupId } = useParams()

  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main`} linkBackName={`Main`} currentPageName={'Dashboard'} username={'Jennie Kim'}/>

        <Tasks room={'Group'} groupId={groupId} />
      </div>
    </div>
  )
}
