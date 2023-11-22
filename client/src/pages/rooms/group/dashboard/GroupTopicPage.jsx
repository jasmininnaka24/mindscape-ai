import React from 'react'
import { TopicPage } from '../../../../components/dashboard/TopicPage'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { useParams } from 'react-router-dom'

export const GroupTopicPage = () => {

  const { groupId, categoryID } = useParams();

  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main/group/dashboard/category-list/topic-list/${groupId}/${categoryID}`} linkBackName={`Topics`} currentPageName={'Topic'} username={'Jennie Kim'}/>

        <TopicPage />
      </div>
    </div>    )
}
