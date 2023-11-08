import React from 'react'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { CategoryList } from '../../../../components/dashboard/CategoryList'

export const PersonalCategoryList = () => {
  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main/personal/dashboard`} linkBackName={`Dashboard`} currentPageName={'Categories'} username={'Jennie Kim'}/>

        <CategoryList />
      </div>
    </div>  
  )
}
