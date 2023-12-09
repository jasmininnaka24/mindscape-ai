import axios from 'axios';
import React, { useState } from 'react'

export const ForgotPassword = () => {

  const [email, setEmail] = useState('');

  const submitForgotPasswordInfo = async (e) => {
    e.preventDefault();

    let data = {
      email: email
    }


    const sendData = await axios.post(`http://localhost:3001/users/forgot-password`, data);

    alert(sendData.data.message)
    
  }

  return (
    <div>
      <form action="">
        <h3>Forgot Password</h3>

        <div>
          <label htmlFor="">Email Address</label>
          <input type="email" placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <button onClick={(e) => submitForgotPasswordInfo(e)}>Submit</button>
        </div>
      </form>
    </div>
  )
}
