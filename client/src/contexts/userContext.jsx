import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function useUserContext() {
  return useContext(UserContext);
}

export default function UserProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function authenicate() {
      setLoading(true);
      try {
        const json = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth`, {
          credentials: "include",
        });
        const data = await json.json();
        if (data.success) {
          setIsAuth(true);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }

    authenicate();
  }, []);

  function login(auth) {
    setIsAuth(auth);
    setLoading(false);
  }

  return (
    <UserContext.Provider value={{ isAuth, loading, login }}>
      {children}
    </UserContext.Provider>
  );
}
