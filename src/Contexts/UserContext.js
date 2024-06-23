/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const UserContext = createContext();
const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const loggedUserJSON = window.localStorage.getItem("loggedAppUser");

  const fetchIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      sessionStorage.setItem("ip", data.ip);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyToken = (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(process.env.REACT_APP_API_URL + "verifyToken", config)
      .then((res) => {
        const user = JSON.parse(loggedUserJSON);
        setSession(user);
      })
      .catch((error) => {
        console.log(error);
        localStorage.clear();
        sessionStorage.clear();
        Swal.fire({
          icon: "error",
          title: "Your session expired",
          text: "Su sesion caduco, Por favor inicie sesion nuevamente",
        }).then(() => {
          setSession(null);
        });
      });
  };

  useEffect(() => {
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      verifyToken(user.token);
    }
  }, []);

  const url = process.env.REACT_APP_API_URL + "login";
  const login = async (Credentials) => {
    const { data } = await axios.post(url, Credentials);
    fetchIp();
    localStorage.setItem("loggedAppUser", JSON.stringify(data));
    sessionStorage.setItem("email", data.correo);
    sessionStorage.setItem("user", `${data.nombre} ${data.apellido}`);
    setSession(data);
    return {
      success: true,
      data,
    };
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  const data = { session, login, handleLogout };

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

export { UserProvider };
export default UserContext;
