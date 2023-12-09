
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export const EmailVerification = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [userId, setUserId] = useState(0)
  const param = useParams();

  useEffect(() => {
    const verify = async () => {
      try {
        const url = `http://localhost:3001/users/${param.id}/verify/${param.token}`;

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
      {validUrl ? (
        <div>
          <h1>Email verified successfully.</h1>
          <Link to={`/classification-questions/${userId}`}>Classify Type of Learner</Link>
        </div>
      ) : (
        <div>404 Page Not Found</div>
      )}
    </Fragment>
  );
};
