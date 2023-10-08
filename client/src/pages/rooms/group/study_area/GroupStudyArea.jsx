import React from 'react';
import { StudyAreaGP } from '../../../../components/study-area/StudyAreaGP';

export const GroupStudyArea = () => {

  const UserId = 1

  return (
    <div>
      <StudyAreaGP UserId={UserId} categoryFor={'Group'} />
    </div>
  )
}
