
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { SERVER_URL } from '../../urlConfig';


export const EmailVerification = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [userId, setUserId] = useState(0)
  const param = useParams();

  useEffect(() => {
    const verify = async () => {
      try {
        const url = `${SERVER_URL}/users/${param.id}/verify/${param.token}`;

        const { data } = await axios.get(url);

        setValidUrl(true);
        setUserId(data.UserId);

      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };

    verify();
  }, [param.id, param.token]);

  return (
    <Fragment>
      {validUrl && (
        <div className='mbg-200 h-[100vh] w-full flex items-center justify-center poppins mcolor-800'>
          <div className="shadows mbg-100 rounded w-1/3 p-8 flex flex-col items-center justify-center">
            <br />
            <div>
              <div className='text-emerald-500'>
                <i className="checkmark text-8xl pl-8 pr-11 py-1 rounded-full" style={{background: '#f0eeeb', color: '#9ABC66'}}>✓</i>
              </div>
            </div>

            <br /><br />
            <h1 className='text-3xl font-medium' style={{ color: '#9ABC66' }}>Success</h1> 

            <p className='text-center mcolor-800 my-3'>You're successfully registered! Click the button below for the next process.</p>
            <br />

            <Link className='mbg-700 mcolor-100 rounded px-5 py-2' to={`/classification-questions/${userId}`}>Classify Type of Learner</Link>
          </div>
        </div>
      )}
    </Fragment>
  );
};
