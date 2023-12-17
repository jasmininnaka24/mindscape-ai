import axios from 'axios';

export const fetchUserData = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3001/users/get-user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user data');
  }
};