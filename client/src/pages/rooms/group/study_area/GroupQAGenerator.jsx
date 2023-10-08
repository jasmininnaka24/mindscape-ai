import React from 'react';
import { QAGenerator } from '../../../../components/qa-gen/QAGenerator';
import { useParams } from 'react-router-dom';
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar';


export const GroupQAGenerator = () => {
  const { id } = useParams();
  return (
    <div className='mbg-200'>
      <div className='container'>
        <div className='py-10'>
          <Navbar linkBack={`/main/group/study-area/${id}`} linkBackName={'Group Study Area'} currentPageName={'Generate Reviewer'} username={'Jennie Kim'}/>
        </div>
        <QAGenerator materialFor={'Group'} groupNameId={id} />
      </div>
    </div>
  )
}




