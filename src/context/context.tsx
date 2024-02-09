import { createContext, useContext, useEffect, useState } from 'react';

interface UserAuthContextProps {
  userName: string;
  access: string;
  hash:string;
  state:boolean;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>
  setState: React.Dispatch<React.SetStateAction<boolean>>

}

const userAuthContext = createContext<UserAuthContextProps | undefined>(undefined);

export function UserAuthContextProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState('sssss');
  const [access, setAccess] = useState('');
  const [hash, setHash] = useState('')
  const [state, setState] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      const tokken = document.getElementById('tokken');
      if (tokken?.textContent) {
        setAccess(tokken?.textContent);
      }
    }, 3000);
  }, [])


  return (
    <userAuthContext.Provider
      value={{
        userName,
        access,
        hash,
        state,
        setState,
        setHash,
        setUserName
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
