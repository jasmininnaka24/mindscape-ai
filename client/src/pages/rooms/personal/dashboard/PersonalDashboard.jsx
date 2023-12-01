import React from 'react'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { MainDash } from '../../../../components/dashboard/MainDash'

export const PersonalDashboard = () => {

  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main`} linkBackName={`Main`} currentPageName={'Dashboard'} username={'Jennie Kim'}/>

        <MainDash categoryFor={'Personal'} />
      </div>
    </div>
  )
}
