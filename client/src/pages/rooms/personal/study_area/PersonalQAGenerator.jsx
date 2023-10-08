import React from 'react';
import { QAGenerator } from '../../../../components/qa-gen/QAGenerator';
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar';

export const PersonalQAGenerator = () => {

  return (
    <div className='mbg-200'>
      <div className='container'>
        <div className='py-10'>
          <Navbar linkBack={'/main/personal/study-area'} linkBackName={'Personal Study Area'} currentPageName={'Generate Reviewer'} username={'Jennie Kim'}/>
        </div>
        <QAGenerator materialFor={'Personal'} />
      </div>
    </div>
  )
}
