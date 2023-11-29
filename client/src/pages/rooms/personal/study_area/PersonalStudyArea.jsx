import React from 'react';
import { StudyAreaGP } from '../../../../components/study-area/StudyAreaGP';
import { useUser } from '../../../../UserContext';

export const PersonalStudyArea = () => {

  const { user } = useUser()
  const UserId = user?.id;

  return (
    <div>
      <StudyAreaGP UserId={UserId} categoryFor={'Personal'} />
    </div>
  )
}
