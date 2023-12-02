import React from 'react'
import { CategoryList } from '../../../../components/dashboard/CategoryList'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'



export const PersonalCategoryList = () => {


  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main/personal/dashboard`} linkBackName={`Dashboard`} currentPageName={'Categories'} username={'Jennie Kim'}/>

        <CategoryList categoryFor={'Personal'} />
      </div>
    </div>   )
}
