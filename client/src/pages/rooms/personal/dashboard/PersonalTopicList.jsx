import React from 'react'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { TopicList } from '../../../../components/dashboard/TopicList'

export const PersonalTopicList = () => {
  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <TopicList categoryFor={'Personal'} />
      </div>
    </div>  
  )
}
