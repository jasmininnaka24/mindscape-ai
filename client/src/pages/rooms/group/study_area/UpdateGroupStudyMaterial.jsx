import React from 'react'
import { UpdateQAGen } from '../../../../components/qa-gen/UpdateQAGen'
import { useParams } from 'react-router-dom'

export const UpdateGroupStudyMaterial = () => {

  const { groupId } = useParams()

  return (
    <UpdateQAGen categoryFor={'Group'} groupId={groupId} />
  )
}
