import React from 'react';
import { Tasks } from '../../../../components/tasks/Tasks';
import { useParams } from 'react-router-dom';

export const GroupTasks = () => {
  
  const { groupId } = useParams()

  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>

        <Tasks room={'Group'} groupId={groupId} />
      </div>
    </div>
  )
}
