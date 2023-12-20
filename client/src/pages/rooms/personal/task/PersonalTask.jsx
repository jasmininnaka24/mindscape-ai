import React from 'react'
import { Tasks } from '../../../../components/tasks/Tasks'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'


export const PersonalTask = () => {
  return (
    <div className='poppins mcolor-900 container py-10'>
      <div>
        <Navbar linkBack={`/main`} linkBackName={`Main`} currentPageName={'Dashboard'} username={'Jennie Kim'}/>

        <Tasks room={'Personal'} />
      </div>
    </div>
  )
}
