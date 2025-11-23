import React, { useEffect, useState } from 'react';
import { createContext } from 'react';

export const LoginContext = createContext();

export function LoginContextProvider({ children }) {
  const [isLogin, setisLogin] = useState(false);
  const [data, setdata] = useState([]);

  useEffect(() => {
    localStorage.setItem('isLogin', isLogin);
    const info = data.user;
    for (let key in info) {
      localStorage.setItem(`${key}`, info[key]);
    }
  }, [data]);

  return (
    <LoginContext.Provider value={{ isLogin, setisLogin, data, setdata }}>
      {children}
    </LoginContext.Provider>
  );
}
