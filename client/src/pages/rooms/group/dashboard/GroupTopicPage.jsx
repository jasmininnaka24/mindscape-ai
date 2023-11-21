import React from 'react'
import { TopicPage } from '../../../../components/dashboard/TopicPage'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'

export const GroupTopicPage = () => {
  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main/personal/dashboard/category-list/topic-list/:categoryId`} linkBackName={`Topics`} currentPageName={'Topic'} username={'Jennie Kim'}/>

        <TopicPage />
      </div>
    </div>    )
}
