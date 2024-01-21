import React from 'react';
import { QAGenerator } from '../../../../components/qa-gen/QAGenerator';
import { useParams } from 'react-router-dom';

export const GroupQAGenerator = () => {
  const { id } = useParams();
  return (
    <QAGenerator materialFor={'Group'} groupNameId={id} />
  )
}




