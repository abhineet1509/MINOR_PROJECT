import { createContext, useState } from "react";

export const AppContext = createContext(); 

const AppContextProvider = ({ children }) => { 
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const [userName, setUserName] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log("ENV BACKEND URL:", import.meta.env.VITE_BACKEND_URL);

  return (
    <AppContext.Provider value={{ backendUrl, isLoggedIn, setIsLoggedin,userName, setUserName }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider; 
