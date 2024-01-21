import React from 'react'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { MainDash } from '../../../../components/dashboard/MainDash'

export const GroupDashboard = () => {
  return (
    <MainDash categoryFor={'Group'} />
  )
}
