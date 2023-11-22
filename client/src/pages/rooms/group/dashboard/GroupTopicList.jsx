import React from 'react';
import { TopicList } from '../../../../components/dashboard/TopicList';
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar';
import { useParams } from 'react-router-dom';

export const GroupTopicList = () => {

  const { groupId } = useParams();

  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main/group/dashboard/category-list/${groupId}`} linkBackName={`Categories`} currentPageName={'Topics'} username={'Jennie Kim'}/>

        <TopicList categoryFor={'Group'} />
      </div>
    </div>  
  )
}
