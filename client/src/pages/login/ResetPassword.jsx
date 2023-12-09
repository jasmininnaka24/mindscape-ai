import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export const ResetPassword = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  let { id, token } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const resetData = await axios.get(`http://localhost:3001/users/reset-password/${id}/${token}`)

      setEmail(resetData.data.email);
    }

    fetchData()
  }, [id, token])

  const resetPassword = async (e) => {
    e.preventDefault();

    let data = {
      password: password
    }

    const updatePassword =  await axios.post(`http://localhost:3001/users/reset-password/${id}/${token}`, data);

    alert(updatePassword.data.message)

  }

  return (
    <div>
      <p>Forgot Password</p>

      <form action="">
        <label htmlFor="">Password</label>
        <input type="text" onChange={(e) => setPassword(e.target.value)} placeholder='Type your new password' />  
        <label htmlFor="">Confirm Password</label>
        <input type="text" onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm password' />

        <button onClick={(e) => resetPassword(e)}>Submit</button>  
      </form>  
    </div>
  )
}
