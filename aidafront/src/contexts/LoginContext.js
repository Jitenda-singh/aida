import React, { useContext, useState } from "react";
const LoginContext = React.createContext();

export const LoginContextProvider = (props) => {
  const [token, setToken] = useState({});
  return (
    <LoginContext.Provider value={{ token, setToken }}>
      {props.children}
    </LoginContext.Provider>
  );
}

export function useLoginContext() {
  return useContext(LoginContext)
}