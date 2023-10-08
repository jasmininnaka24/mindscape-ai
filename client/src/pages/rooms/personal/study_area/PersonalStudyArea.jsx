import React from 'react';
import { StudyAreaGP } from '../../../../components/study-area/StudyAreaGP';

export const PersonalStudyArea = () => {

  const UserId = 1;

  return (
    <div>
      <StudyAreaGP UserId={UserId} categoryFor={'Personal'} />
    </div>
  )
}
