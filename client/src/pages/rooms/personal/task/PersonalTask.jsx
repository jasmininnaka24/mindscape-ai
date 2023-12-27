import React from 'react'
import { Tasks } from '../../../../components/tasks/Tasks'


export const PersonalTask = () => {
  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Tasks room={'Personal'} />
      </div>
    </div>
  )
}
