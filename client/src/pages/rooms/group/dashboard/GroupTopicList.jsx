import React from 'react';
import { TopicList } from '../../../../components/dashboard/TopicList';

export const GroupTopicList = () => {
  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <TopicList categoryFor={'Group'} />
      </div>
    </div>  
  )
}
