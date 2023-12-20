import axios from 'axios';
import { useEffect } from 'react';
import { useUser } from '../../UserContext';


export const RenderTasks = ({ setListOfTasks, UserId, groupId, room }) => {

  const { SERVER_URL } = useUser()

  useEffect(() => {

    const fetchData = async () => {

      let renderLink = ''

      if (room === 'Personal') {
        renderLink = `${'http://localhost:3001'}/tasks/personal/${UserId}`
      } else {
        renderLink = `${'http://localhost:3001'}/tasks/group/${groupId}`
      }

      await axios.get(renderLink).then((response) => {
        setListOfTasks(response.data);
      });
    }

    fetchData()

  }, [setListOfTasks, UserId, room, groupId]); 
};
