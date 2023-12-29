import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

interface UserAuthContextProps {
  userName: string;
  user: string;
  access: string;
}

const userAuthContext = createContext<UserAuthContextProps | undefined>(undefined);

export function UserAuthContextProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState('');
  const [access, setAccess] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: extractUsername,
        },
        (result) => {
          const extractedUserName = result[0].result;
          setUserName(extractedUserName);
        }
      );
    });
  }, []);

  useEffect(() => {
    /*@ts-ignore */
    chrome.cookies.get({ url: 'https://extintion-web.vercel.app/', name: 'access' },function (cookie) {
        getUser(cookie.value);
        setAccess(cookie.value);
      }
    );
  }, []);

  // Content script to be injected into the LinkedIn page
  const extractUsername = () => {
    const h1Tag = document.querySelector('h1');
    return h1Tag ? h1Tag.innerText : '';
  };

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
        userName,
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
