import React from 'react'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { TopicPage } from '../../../../components/dashboard/TopicPage'
import { useParams } from 'react-router-dom'

export const PersonalTopicPage = () => {

  const { categoryID } = useParams()

  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main/personal/dashboard/category-list/topic-list/${categoryID}`} linkBackName={`Topics`} currentPageName={'Topic'} username={'Jennie Kim'}/>

        <TopicPage />
      </div>
    </div>  
  )
}
