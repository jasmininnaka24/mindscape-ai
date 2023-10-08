import axios from 'axios';
import { useEffect } from 'react';

export const RenderTasks = ({ setListOfTasks }) => {
  useEffect(() => {
    axios.get("http://localhost:3001/tasks").then((response) => {
      setListOfTasks(response.data);
    });
  }, [setListOfTasks]); // Include setListOfTasks in the dependency array
};
