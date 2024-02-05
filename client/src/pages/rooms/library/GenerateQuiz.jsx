import React from 'react'
import { Navbar } from '../../../components/navbar/logged_navbar/navbar';
import { QAGenerator } from '../../../components/qa-gen/QAGenerator';

export const GenerateQuiz = () => {
  return (
    <QAGenerator materialFor={'Everyone'} />
    )
}
