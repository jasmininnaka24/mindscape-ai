import axios from 'axios';
import { useEffect } from 'react';
import { useUser } from '../../UserContext';


export const RenderTasks = ({ setListOfTasks, UserId, groupId, room }) => {

  const { SERVER_URL } = useUser()

  useEffect(() => {

    const fetchData = async () => {

      let renderLink = ''

      if (room === 'Personal') {
        renderLink = `${SERVER_URL}/tasks/personal/${UserId}`
      } else {
        renderLink = `${SERVER_URL}/tasks/group/${groupId}`
      }

      await axios.get(renderLink).then((response) => {
        setListOfTasks(response.data);
      });
    }

    fetchData()

  }, [setListOfTasks, UserId, room, groupId]); 
};
