import React from 'react'
import { Navbar } from '../../../components/navbar/logged_navbar/navbar';
import { QAGenerator } from '../../../components/qa-gen/QAGenerator';

export const GenerateQuiz = () => {
  return (
  <div className='mbg-200'>
    <div className='container'>
      <div className='py-10'>
        <Navbar linkBack={'/main/library'} linkBackName={'Virtual Library'} currentPageName={'Generate Study Material'} username={'Jennie Kim'}/>
      </div>
      <QAGenerator materialFor={'Everyone'} />
    </div>
  </div>
  )
}
