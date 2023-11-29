import React from 'react'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { UpdateQAGen } from '../../../../components/qa-gen/UpdateQAGen'

export const UpdatePersonalStudyMaterial = () => {
  return (
    <div className='mbg-200'>
      <div className='container'>
        <div className='py-10'>
          <Navbar linkBack={'/main/personal/study-area'} linkBackName={'Personal Study Area'} currentPageName={'Update Reviewer'} username={'Jennie Kim'}/>
        </div>
        <UpdateQAGen categoryFor={'Personal'} />
      </div>
    </div>
  )
}
