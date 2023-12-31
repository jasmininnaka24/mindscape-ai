import axios from 'axios';
import { SERVER_URL } from './urlConfig';

export const fetchUserData = async (userId) => {
  try {
    const response = await axios.get(`${SERVER_URL}/users/get-user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user data');
  }
};