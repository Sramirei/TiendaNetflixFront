/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef, useContext } from "react";
import UserContext from "../../Contexts/UserContext";
import { Navigate } from "react-router-dom";
import "./navigation.css";
import axios from "axios";
import Swal from "sweetalert2";

import Card from "../../Components/Card/Card";
import UserTable from "../../Components/UserTable/UserTable";
import SalesTable from "../../Components/SalesTable/SalesTable";
import SalesUserTable from "../../Components/SalesUserTable/SalesUserTable";
import NetflixTable from "../../Components/NetflixTable/NetflixTable";
import AmazonTable from "../../Components/AmazonTable/AmazonTable";
import DisneyTable from "../../Components/DisneyTable/DisneyTable";
import CrunchyrollTable from "../../Components/CrunchyrollTable/CrunchyrollTable";
import YoutubeTable from "../../Components/YoutubeTable/YoutubeTable";
import HboTable from "../../Components/HboTable/HboTable";
import ParamountTable from "../../Components/ParamountTable/ParamountTable";
import PlexTable from "../../Components/PlexTable/PlexTable";
import SpotifyTable from "../../Components/SpotifyTable/SpotifyTable";
import StarPlusTable from "../../Components/StarPlusTable/StarPlusTable";
import DirecTvTable from "../../Components/DirecTvTable/DirecTvTable";

const Navigation = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const { handleLogout } = useContext(UserContext);
  const user = sessionStorage.getItem("user");
  const emailUser = sessionStorage.getItem("email");
  const ipUser = sessionStorage.getItem("ip");

  // component change
  const handleNavbarClick = (component) => {
    setSelectedComponent(component);
  };

  //Open and close the navbar
  useEffect(() => {
    const navbarToggle = document.querySelector(".navbar-toggle");
    navbarToggle.addEventListener("click", () => {
      setIsOpen(!isOpen);
    });
  }, [isOpen]);

  useEffect(() => {
    const links = document.querySelectorAll("li a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        links.forEach((link) => {
          link.classList.remove("active");
        });
        link.classList.add("active");
        setIsOpen(false);
      });
    });
  }, []);

  // Open and close the user menu
  const userMenuBtnRef = useRef(null);
  const userActionsRef = useRef(null);

  useEffect(() => {
    const userMenuBtn = userMenuBtnRef.current;
    const userActions = userActionsRef.current;

    const toggleUserMenu = () => {
      userActions.classList.toggle("show");
    };

    userMenuBtn.addEventListener("click", toggleUserMenu);

    return () => {
      userMenuBtn.removeEventListener("click", toggleUserMenu);
    };
  }, [userMenuBtnRef, userActionsRef]);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  const editUser = async (userId) => {
    try {
      // Obtener los datos del usuario a editar del servidor
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
            user: user,
            emailUser: emailUser,
            ip: ipUser,
          },
        }
      );
      const userData = response.data[0];
      //console.log(userData);

      const result = await Swal.fire({
        title: "Editar Usuario",
        html:
          '<div class="form-grid">' +
          `<input type="text" id="identificacion" class="swal2-input" placeholder="Identificación" value="${userData.identificacion}">` +
          `<input type="text" id="nombre" class="swal2-input" placeholder="Nombre" value="${userData.nombre}">` +
          `<input type="text" id="apellido" class="swal2-input" placeholder="Apellido" value="${userData.apellido}">` +
          `<input type="text" id="celular" class="swal2-input" placeholder="Celular" value="${userData.celular}">` +
          `<input type="email" id="correo" class="swal2-input" placeholder="Correo" value="${userData.correo}">` +
          `<input type="text" id="empresa" class="swal2-input" placeholder="Empresa" value="${userData.empresa}">` +
          `<input type="text" id="login" class="swal2-input" placeholder="Login" value="${userData.login}">` +
          '<input type="password" id="contrasena" class="swal2-input" placeholder="Contraseña" >' +
          "</div>",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        preConfirm: function () {
          return new Promise(function (resolve) {
            resolve({
              identificacion: document.getElementById("identificacion").value,
              nombre: document.getElementById("nombre").value,
              apellido: document.getElementById("apellido").value,
              celular: document.getElementById("celular").value,
              correo: document.getElementById("correo").value,
              empresa: document.getElementById("empresa").value,
              login: document.getElementById("login").value,
              contrasena: document.getElementById("contrasena").value,
              perfil: session.perfil,
              estado: session.estado,
              cod_precio: session.cod_precio,
            });
          });
        },
      });

      if (result.isConfirmed) {
        const updatedUserData = result.value;
        console.log(updatedUserData);
        // Realizar la solicitud PUT al servidor para actualizar el usuario
        const updateResponse = await axios.put(
          `${process.env.REACT_APP_API_URL}user/${userId}`,
          updatedUserData,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
              user: user,
              emailUser: emailUser,
              ip: ipUser,
            },
          }
        );

        Swal.fire(
          "¡Actualizado!",
          "El usuario ha sido actualizado exitosamente.",
          "success"
        );
        console.log("Usuario actualizado correctamente:", updateResponse.data);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          "Cancelado",
          "No se ha realizado ninguna actualización.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al editar el usuario:", error);
    }
  };

  return (
    <>
      <header>
        <div className="logo">
          <img src="./Img/logo.jpeg" alt="Logo" />
        </div>
        <div className="user-menu">
          <img
            className="user-avatar"
            id="user-menu-btn"
            src={
              process.env.REACT_APP_PUBLIC_URL + "/Img/Navegacion/Perfil2.jpg"
            }
            alt="User Avatar"
            ref={userMenuBtnRef}
          />
          <ul className="user-actions" ref={userActionsRef}>
            <li>
              <a href="#" onClick={() => editUser(session.cod_usuario)}>
                Perfil
              </a>
            </li>
            <li>
              <a href="#" onClick={handleLogout}>
                Cerrar Sesión
              </a>
            </li>
          </ul>
        </div>
      </header>

      <div className="navbar-container">
        <button className="navbar-toggle">&#9776;</button>
        <ul className={`navbar ${isOpen ? "open" : ""}`}>
          <li>
            <a
              onClick={() => handleNavbarClick(<Card session={session} />)}
              className="active"
            >
              Servicios
            </a>
          </li>
          {session.perfil == 1 ? (
            <>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<UserTable session={session} />)
                  }
                >
                  Usuario
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<SalesTable session={session} />)
                  }
                >
                  Ventas General
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<SalesUserTable session={session} />)
                  }
                >
                  Compras
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<NetflixTable session={session} />)
                  }
                >
                  Netflix
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<AmazonTable session={session} />)
                  }
                >
                  Amazon
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<DisneyTable session={session} />)
                  }
                >
                  Disney
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<PlexTable session={session} />)
                  }
                >
                  Plex
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<YoutubeTable session={session} />)
                  }
                >
                  Youtube
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<CrunchyrollTable session={session} />)
                  }
                >
                  Crunchyroll
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<ParamountTable session={session} />)
                  }
                >
                  Paramount
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<SpotifyTable session={session} />)
                  }
                >
                  Spotify
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<StarPlusTable session={session} />)
                  }
                >
                  Star Plus
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<HboTable session={session} />)
                  }
                >
                  Hbo
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<DirecTvTable session={session} />)
                  }
                >
                  DirecTv Go
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a
                  onClick={() =>
                    handleNavbarClick(<SalesUserTable session={session} />)
                  }
                >
                  Compras
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="border-div">{selectedComponent || <Card />}</div>
    </>
  );
};

export default Navigation;
