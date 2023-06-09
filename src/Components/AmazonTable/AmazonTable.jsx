import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PacmanLoader from "react-spinners/PacmanLoader";
import UserContext from "../../Contexts/UserContext";

const AmazonTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountPerPage] = useState(11);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const { session } = useContext(UserContext);

  // process.env.REACT_APP_API_URL + 'amazon'

  //console.log(session.token);

  useEffect(() => {
    setLoading(true); // Establecer carga en true antes de la solicitud

    axios
      .get(process.env.REACT_APP_API_URL + 'amazon', {
        headers: {
          Authorization: `Bearer ${session.token}`, // Agrega el token de sesión en los encabezados con el formato "Bearer {token}"
        },
      })
      .then((res) => {
        const accountsList = res.data;
        setAccounts(accountsList);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false); // Establecer carga en false cuando la solicitud se complete
      });
  }, [updateTrigger]);

  const indexOfLastAccount = currentPage * accountPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountPerPage;

  const filteredAccount = searchValue
    ? accounts.filter(
        (account) =>
          account.correo.toUpperCase().includes(searchValue.toUpperCase()) ||
          account.pantalla.toUpperCase().includes(searchValue.toUpperCase())
      )
    : accounts;

  const currentAccounts = filteredAccount.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  const handleSearch = () => {
    const input = document.getElementById("searchInput");
    setSearchValue(input.value.trim());
  };

  const createAccounts = async () => {
    try {
      const result = await Swal.fire({
        title: "Crear Cuenta",
        html:
          '<div class="form-grid">' +
          '<input type="text" id="correo" class="swal2-input" placeholder="correo">' +
          '<input type="text" id="contrasena" class="swal2-input" placeholder="contraseña">' +
          "</div>",
        showCancelButton: true,
        confirmButtonText: "Crear",
        cancelButtonText: "Cancelar",
        preConfirm: function () {
          return new Promise(function (resolve) {
            resolve({
              correo: document.getElementById("correo").value,
              contrasena: document.getElementById("contrasena").value,
              pantalla: "4",
              usado: "0",
            });
          });
        },
      });

      if (result.isConfirmed) {
        const accountData = result.value;
        //console.log(accountData);
        const response = await axios.post(
          process.env.REACT_APP_API_URL + 'amazon',
          accountData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${session.token}`,
            },
          }
        );

        Swal.fire("¡Creado!", "La cuenta fue Creada.", "success");
        console.log("Cuenta creada correctamente:", response.data);
        setUpdateTrigger(!updateTrigger);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "No se ha creado ningúna cuenta.", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error al crear la cuenta",
        "No se ha creado ningúna cuenta.",
        `error: ${error.message}`
      );
      console.error("Error al crear la cuenta:", error);
    }
  };

  const editAccount = async (accountId) => {
    try {
      // Obtener los datos de la cuenta a editar del servidor
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}amazon/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`, // Agrega el token de sesión en los encabezados con el formato "Bearer {token}"
          },
        }
      );
      const accountData = response.data[0];
      //console.log(accountData);

      const result = await Swal.fire({
        title: "Editar Cuenta",
        html:
          '<div class="form-grid">' +
          `<input type="text" id="correo" class="swal2-input" placeholder="correo" value="${accountData.correo}">` +
          `<input type="text" id="contrasena" class="swal2-input" placeholder="contrasena" value="${accountData.contrasena}">` +
          "</div>",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        preConfirm: function () {
          return new Promise(function (resolve) {
            resolve({
              correo: document.getElementById("correo").value,
              contrasena: document.getElementById("contrasena").value,
              pantalla: accountData.pantalla,
              usado: accountData.usado,
            });
          });
        },
      });

      if (result.isConfirmed) {
        const updatedAccountData = result.value;
        console.log(updatedAccountData);
        // Realizar la solicitud PUT al servidor para actualizar el usuario
        const updateResponse = await axios.put(
          `${process.env.REACT_APP_API_URL}amazon/${accountId}`,
          updatedAccountData,
          {
            headers: {
              Authorization: `Bearer ${session.token}`, // Agrega el token de sesión en los encabezados con el formato "Bearer {token}"
            },
          }
        );

        Swal.fire(
          "¡Actualizado!",
          "La cuenta ha sido actualizada exitosamente.",
          "success"
        );
        console.log("Cuenta actualizada correctamente:", updateResponse.data);
        setUpdateTrigger(!updateTrigger);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          "Cancelado",
          "No se ha realizado ninguna actualización.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al editar la cuenta:", error);
    }
  };

  const deleteAccount = async (accountId) => {
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
        await axios.delete(`${process.env.REACT_APP_API_URL}amazon/${accountId}`, {
          headers: {
            Authorization: `Bearer ${session.token}`, // Agrega el token de sesión en los encabezados con el formato "Bearer {token}"
          },
        });

        Swal.fire("¡Eliminado!", "Tu archivo ha sido eliminado.", "success");
        console.log("Cuenta actualizada correctamente");
        setUpdateTrigger(!updateTrigger);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          "Cancelado",
          "Tu archivo imaginario está a salvo :)",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al actualizar la cuenta:", error);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredAccount.length / accountPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="TableContainer">
        <div className="wrapper">
          <div className="panel-table">
            <input type="text" id="searchInput" placeholder="Buscar..." />
            <button onClick={handleSearch}>Buscar</button>
            <button className="create" onClick={() => createAccounts()}>
              Crear Cuenta
            </button>
          </div>

          <div className="table">
            <div className="row header blue">
              <div className="cell">Correo</div>
              <div className="cell">Contraseña</div>
              <div className="cell">Pantallas</div>
              <div className="cell">Usadas</div>
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
              currentAccounts.map((account) => (
                <div className="row" key={account.id}>
                  <div className="cell" data-title="id">
                    {account.correo}
                  </div>
                  <div className="cell" data-title="name">
                    {account.contrasena}
                  </div>
                  <div className="cell" data-title="lastName">
                    {account.pantalla}
                  </div>
                  <div className="cell" data-title="phone">
                    {account.usado}
                  </div>
                  <div className="cell" data-title="Active">
                    <button onClick={() => deleteAccount(account.id)}>
                      <i
                        className="fa-solid fa-trash-can"
                        style={{ color: "#ff0000" }}
                      ></i>
                    </button>
                    <button onClick={() => editAccount(account.id)}>
                      <i
                        className="fa-regular fa-pen-to-square"
                        style={{ color: "#005eff" }}
                      ></i>
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

export default AmazonTable;
