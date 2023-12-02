import React from 'react'
import { CategoryList } from '../../../../components/dashboard/CategoryList'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { useParams } from 'react-router-dom'

export const GroupCategoryList = () => {

  const { groupId } = useParams();

  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main/group/dashboard/${groupId}`} linkBackName={`Dashboard`} currentPageName={'Categories'} username={'Jennie Kim'}/>

        <CategoryList categoryFor={'Group'} />
      </div>
    </div> 
  )
}
