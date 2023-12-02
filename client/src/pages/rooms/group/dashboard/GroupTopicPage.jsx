import React from 'react'
import { TopicPage } from '../../../../components/dashboard/TopicPage'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { useParams } from 'react-router-dom'

export const GroupTopicPage = () => {

  const { groupId, categoryID } = useParams();

  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <TopicPage categoryFor={'Group'} />
      </div>
    </div>    
    )
}
