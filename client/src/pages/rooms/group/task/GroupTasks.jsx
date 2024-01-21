import React from 'react';
import { Tasks } from '../../../../components/tasks/Tasks';
import { useParams } from 'react-router-dom';

export const GroupTasks = () => {
  
  const { groupId } = useParams()

  return (
    <Tasks room={'Group'} groupId={groupId} />
  )
}
