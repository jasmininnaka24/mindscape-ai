import React from 'react'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { TopicList } from '../../../../components/dashboard/TopicList'

export const PersonalTopicList = () => {
  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main/personal/dashboard/category-list`} linkBackName={`Categories`} currentPageName={'Topics'} username={'Jennie Kim'}/>

        <TopicList categoryFor={'Personal'} />
      </div>
    </div>  
  )
}
