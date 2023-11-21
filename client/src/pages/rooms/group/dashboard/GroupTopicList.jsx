import React from 'react';
import { TopicList } from '../../../../components/dashboard/TopicList';
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar';

export const GroupTopicList = () => {
  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main/personal/dashboard/category-list`} linkBackName={`Categories`} currentPageName={'Topics'} username={'Jennie Kim'}/>

        <TopicList categoryFor={'Group'} />
      </div>
    </div>  
  )
}
