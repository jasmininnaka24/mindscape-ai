import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user information from session storage on component mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const setUserInformation = (userInfo) => {
    setUser(userInfo);
    sessionStorage.setItem('user', JSON.stringify(userInfo));
  };

  return (
    <UserContext.Provider value={{ user, setUserInformation }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
