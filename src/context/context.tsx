import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';

interface UserAuthContextProps {
  user: string;
  access: string;
}

const userAuthContext = createContext<UserAuthContextProps | undefined>(undefined);

export function UserAuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState('');
  const [access, setAccess] = useState('');


  useEffect(() => {
    const cookies = new Cookies()
    const access = cookies.get('access')
        getUser(access);
        setAccess(access);
  }, []);

  async function getUser(tokken: string) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/auth/me/',
      headers: {
        Authorization: `Bearer ${tokken}`,
      },
    };

    try {
      const response = await axios.request(config);
      setUser(response.data.email);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <userAuthContext.Provider
      value={{
        user,
        access,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(userAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthContextProvider');
  }
  return context;
}
