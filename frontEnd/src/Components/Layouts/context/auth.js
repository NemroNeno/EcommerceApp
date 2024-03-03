import axios from "axios";
import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });


  //axios.defaults.headers.common["Authorization"]=auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parsed = JSON.parse(data);
      console.log("parsed data")
      console.log(parsed);
      setAuth({
        ...auth,
        user: parsed.user,
        token: parsed.token,
      });
    }
    //elint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={[auth,setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

//Custom Hook

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
