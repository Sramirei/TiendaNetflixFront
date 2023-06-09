import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./userTable.css";
import Swal from "sweetalert2";
import PacmanLoader from "react-spinners/PacmanLoader";
import UserContext from "../../Contexts/UserContext";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(11);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const { session } = useContext(UserContext);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + 'user', {
        headers: {
          Authorization: `Bearer ${session.token}`, // Agrega el token de sesión en los encabezados con el formato "Bearer {token}"
        },
      })
      .then((res) => {
        const usersList = res.data.filter((data) => data.estado === "Activo");
        setUsers(usersList);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [updateTrigger]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUsers = searchValue
    ? users.filter(
        (user) =>
          user.identificacion
            .toUpperCase()
            .includes(searchValue.toUpperCase()) ||
          user.nombre.toUpperCase().includes(searchValue.toUpperCase())
      )
    : users;

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleSearch = () => {
    const input = document.getElementById("searchInput");
    setSearchValue(input.value.trim());
  };

  const createUser = async () => {
    try {
      const result = await Swal.fire({
        title: "Crear Usuario",
        html:
          '<div class="form-grid">' +
          '<input type="text" id="identificacion" class="swal2-input" placeholder="Identificación">' +
          '<input type="text" id="nombre" class="swal2-input" placeholder="Nombre">' +
          '<input type="text" id="apellido" class="swal2-input" placeholder="Apellido">' +
          '<input type="text" id="celular" class="swal2-input" placeholder="Celular">' +
          '<input type="email" id="correo" class="swal2-input" placeholder="Correo">' +
          '<input type="text" id="empresa" class="swal2-input" placeholder="Empresa">' +
          '<input type="text" id="login" class="swal2-input" placeholder="Login">' +
          '<input type="password" id="contrasena" class="swal2-input" placeholder="Contraseña">' +
          '<select id="perfil" class="swal2-select">' +
          '<option value="2">Usuario</option>' +
          '<option value="1">Admin</option>' +
          "</select>" +
          "</div>",
        showCancelButton: true,
        confirmButtonText: "Crear",
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
              perfil: document.getElementById("perfil").value.toString(),
              estado: "Activo",
              cod_precio: "1",
            });
          });
        },
      });

      if (result.isConfirmed) {
        const userData = result.value;
        //console.log(userData);
        // Realizar la solicitud POST al servidor para crear el usuario
        const response = await axios.post(
          process.env.REACT_APP_API_URL + 'user',
          userData,
          {
            headers: {
              Authorization: `Bearer ${session.token}`, // Agrega el token de sesión en los encabezados con el formato "Bearer {token}"
            },
          }
        );

        Swal.fire(
          "¡Creado!",
          "El usuario ha sido creado exitosamente.",
          "success"
        );
        console.log("Usuario creado correctamente:", response.data);
        setUpdateTrigger(!updateTrigger);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "No se ha creado ningún usuario.", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error al crear el usuario",
        "No se ha creado ningún usuario.",
        `error: ${error.message}`
      );
      console.error("Error al crear el usuario:", error);
    }
  };

  const editUser = async (userId) => {
    try {
      // Obtener los datos del usuario a editar del servidor
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`, // Agrega el token de sesión en los encabezados con el formato "Bearer {token}"
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
          '<select id="perfil" class="swal2-select">' +
          `<option value="1" ${
            userData.perfil === "1" ? "selected" : ""
          }>Usuario</option>` +
          `<option value="2" ${
            userData.perfil === "2" ? "selected" : ""
          }>Admin</option>` +
          "</select>" +
          `<input type="text" id="estado" class="swal2-input" placeholder="Estado" value="${userData.estado}">` +
          `<input type="text" id="cod_precio" class="swal2-input" placeholder="Código de Precio" value="${userData.cod_precio}">` +
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
              perfil: document.getElementById("perfil").value.toString(),
              estado: document.getElementById("estado").value,
              cod_precio: document.getElementById("cod_precio").value,
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
              Authorization: `Bearer ${session.token}`, // Agrega el token de sesión en los encabezados con el formato "Bearer {token}"
            },
          }
        );
        Swal.fire(
          "¡Actualizado!",
          "El usuario ha sido actualizado exitosamente.",
          "success"
        );
        console.log("Usuario actualizado correctamente:", updateResponse.data);
        setUpdateTrigger(!updateTrigger);
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

  const deleteUser = async (userId) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminarlo",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
        buttonsStyling: true,
      });

      if (result.isConfirmed) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}user/${userId}`,
          {
            estado: "Inactivo",
          },
          {
            headers: {
              Authorization: `Bearer ${session.token}`, // Agrega el token de sesión en los encabezados con el formato "Bearer {token}"
            },
          }
        );

        Swal.fire("¡Eliminado!", "Tu archivo ha sido eliminado.", "success");
        console.log("Usuario actualizado correctamente");
        setUpdateTrigger(!updateTrigger);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          "Cancelado",
          "Tu archivo imaginario está a salvo :)",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="TableContainer">
        <div className="wrapper">
          <div className="panel-table">
            <input type="text" id="searchInput" placeholder="Buscar..." />
            <button onClick={handleSearch}>Buscar</button>
            <button className="create" onClick={() => createUser()}>
              Crear Usuario
            </button>
          </div>

          <div className="table">
            <div className="row header blue">
              <div className="cell">Identificacion</div>
              <div className="cell">Nombre</div>
              <div className="cell">Apellido</div>
              <div className="cell">Celular</div>
              <div className="cell">Empresa</div>
              <div className="cell">Usuario</div>
              <div className="cell">Estado</div>
              <div className="cell">Acciones</div>
            </div>

            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "20em",
                }}
              >
                <PacmanLoader
                  color="#000000"
                  loading={loading}
                  size={30}
                  aria-label="Loading"
                  data-testid="loader"
                />
              </div>
            ) : (
              currentUsers.map((user) => (
                <div className="row" key={user.cod_usuario}>
                  <div className="cell" data-title="id">
                    {user.identificacion}
                  </div>
                  <div className="cell" data-title="name">
                    {user.nombre}
                  </div>
                  <div className="cell" data-title="lastName">
                    {user.apellido}
                  </div>
                  <div className="cell" data-title="phone">
                    {user.celular}
                  </div>
                  <div className="cell" data-title="company">
                    {user.empresa}
                  </div>
                  <div className="cell" data-title="username">
                    {user.login}
                  </div>
                  <div className="cell" data-title="state">
                    {user.estado}
                  </div>
                  <div className="cell" data-title="Active">
                    <button onClick={() => deleteUser(user.cod_usuario)}>
                      <i
                        className="fa-solid fa-trash-can"
                        style={{ color: "#ff0000" }}
                      ></i>
                    </button>
                    <button onClick={() => editUser(user.cod_usuario)}>
                      editar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTable;
