import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authTokens, setAuthTokens] = useState(null);
  
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   const sessionId = localStorage.getItem("session_id");
  //   const storedTokens = localStorage.getItem("auth_tokens");
    
  //   if (storedUser && sessionId && storedTokens) {
  //     try {
  //       setUser(JSON.parse(storedUser));
  //       setAuthTokens(JSON.parse(storedTokens));
  //     } catch (error) {
  //       console.error("Error parsing user data:", error);
  //       localStorage.removeItem("user");
  //       localStorage.removeItem("auth_tokens");
  //       localStorage.removeItem("session_id");
  //     }
  //   }
  //   setLoading(false);
  // }, []);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTokens = localStorage.getItem("auth_tokens");
  
    const attemptRelogin = async () => {
      if (!storedTokens) {
        logout();
        return;
      }
  
      try {
        const { apiKey, apiSecret } = JSON.parse(storedTokens);
  
        const response = await fetch("https://portal.meraksecurity.com/api/method/frappe.auth.get_logged_user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${apiKey}:${apiSecret}`,
          },
          credentials: "include", // just in case Frappe still sets cookies
        });
  
        if (!response.ok) {
          throw new Error("Token is invalid or expired");
        }
  
        const result = await response.json();
        console.log("Re-authenticated as:", result.message);
  
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setAuthTokens(JSON.parse(storedTokens));
        }
      } catch (err) {
        console.error("Re-authentication failed:", err);
        logout();
      }
    };
  
    const validateOrRelogin = async () => {
      try {
        const response = await fetch("https://portal.meraksecurity.com/api/method/frappe.auth.get_logged_user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // attempts to use existing cookie session if any
        });
  
        if (response.ok) {
          // Session is valid
          if (storedUser && storedTokens) {
            setUser(JSON.parse(storedUser));
            setAuthTokens(JSON.parse(storedTokens));
          }
        } else {
          // No valid session — attempt re-auth via token
          await attemptRelogin();
        }
      } catch (error) {
        console.error("Error during session validation:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
  
    if (storedTokens) {
      validateOrRelogin();
    } else {
      setLoading(false);
    }
  }, []);
  

  const login = (userData, sessionId, apiKey, apiSecret) => {
    setUser(userData);
    const tokens = { apiKey, apiSecret };
    setAuthTokens(tokens);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("auth_tokens", JSON.stringify(tokens));
    localStorage.setItem("session_id", sessionId);
  };

  const updateUser = (newUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData,
    }));
    localStorage.setItem("user", JSON.stringify({ ...user, ...newUserData }));
  }

  const logout = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("session_id");
    localStorage.removeItem("auth_tokens");
  };

  return (
    <AuthContext.Provider value={{ user, authTokens, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);