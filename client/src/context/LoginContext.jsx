import React, { useState } from "react";
import { createContext } from "react";


export const LoginContext = createContext();


export function LoginContextProvider({ children }) {

    const [isLogin, setisLogin] = useState(false);
    const [data, setdata] = useState(null);

    return (
        <LoginContext.Provider value={{ isLogin, setisLogin, data, setdata }}>
            {children}
        </LoginContext.Provider>
    )

}

