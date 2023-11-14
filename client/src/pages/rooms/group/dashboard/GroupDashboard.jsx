import React from 'react'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { MainDash } from '../../../../components/dashboard/MainDash'

export const GroupDashboard = () => {
  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>

      <Navbar linkBack={`/main/group/`} linkBackName={`Groups`} currentPageName={'Dashboard'} username={'Jennie Kim'}/>

      <MainDash />
      </div>
    </div>
  )
}
