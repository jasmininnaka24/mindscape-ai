import React from 'react'
import { Navbar } from '../../../../components/navbar/logged_navbar/navbar'
import { UpdateQAGen } from '../../../../components/qa-gen/UpdateQAGen'
import { useParams } from 'react-router-dom'

export const UpdateGroupStudyMaterial = () => {

  const { groupId, materialID } = useParams()

  return (
    <div className='mbg-200'>
      <div className='container'>
        <div className='py-10'>
          <Navbar linkBack={`/main/group/study-area/group-review/${groupId}/${materialID}`} linkBackName={'Group Study Area'} currentPageName={'Update Reviewer'} username={'Jennie Kim'}/>
        </div>
        <UpdateQAGen categoryFor={'Group'} groupId={groupId} />
      </div>
    </div>  
  )
}
