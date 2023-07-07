import React, { useContext } from "react";
import axios from "axios";
import UserContext from "../../Contexts/UserContext";
import Swal from "sweetalert2";
import "./card.css";

const Card = () => {
  const { session } = useContext(UserContext);

  // Función para comprar un servicio
  const buyService = async (service) => {
    try {
      let result;

      // Verificar si el servicio requiere opciones adicionales
      if (
        service === "netflix" ||
        service === "amazon" ||
        service === "disney" ||
        service === "startplus" ||
        service === "plex" ||
        service === "hbo"
      ) {
        // Mostrar formulario con opciones
        result = await Swal.fire({
          title: "Comprar servicio",
          html:
            '<div class="form-grid">' +
            '<select id="pantallas" class="swal2-select">' +
            '<option value="1">1 Pantalla</option>' +
            '<option value="2">2 Pantalla</option>' +
            '<option value="3">3 Pantalla</option>' +
            '<option value="4">4 Pantalla</option>' +
            "</select>" +
            "</div>",
          showCancelButton: true,
          confirmButtonText: "Comprar",
          cancelButtonText: "Cancelar",
          preConfirm: function () {
            return new Promise(function (resolve) {
              resolve({
                cod_usuario: session.cod_usuario,
                producto: service,
                pantalla: document.getElementById("pantallas").value,
                costo: null,
                estado: null,
              });
            });
          },
        });
      } else {
        // Mostrar mensaje simple sin opciones adicionales
        result = await Swal.fire({
          title: "Comprar servicio",
          showCancelButton: true,
          confirmButtonText: "Comprar",
          cancelButtonText: "Cancelar",
          preConfirm: function () {
            return new Promise(function (resolve) {
              resolve({
                cod_usuario: session.cod_usuario,
                producto: service,
                pantalla: "4",
                costo: null,
                estado: null,
              });
            });
          },
        });
      }

      if (result.isConfirmed) {
        const saleData = result.value;
        const response = await axios.post(
          process.env.REACT_APP_API_URL + 'sales',
          saleData,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
        const res = response.data;
        const accountData = await axios.get(
          `${process.env.REACT_APP_API_URL}${service}/${res.cod_producto}`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
        Swal.fire({ 
          icon: "success",
          title: "Compra realizada!",
          html: `<p>La compra fue registrada con éxito.</p>
                 <p>Su cuenta es: <strong>${accountData.data[0].correo}</strong></p>
                 <p>Su Contraseña es: <strong>${accountData.data[0].contrasena}</strong></p>
                 <p>Su perfil es : <strong>${response.data.perfil}</strong></p>
                 <p>Fecha : <strong>${response.data.fecha}</strong></p>`,
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "No se ha comprado ningún Servicio.", "error");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data === "No available accounts found"
      ) {
        Swal.fire("No hay cuentas disponibles.", "Intente más tarde", "error");
      } else {
        Swal.fire(
          "Error al crear la Venta",
          "No se ha creado ninguna Venta.",
          `error: ${error.message}`
        );
      }
    }
  };

  return (
    <>
      <div className="panelContainer">
        <div className="panel task">
          <a href="#" onClick={() => buyService("netflix")}>
            <span></span>
          </a>
        </div>
        <div className="panel comment">
          <a href="#" onClick={() => buyService("disney")}>
            <span></span>
          </a>
        </div>
        <div className="panel reports">
          <a href="#" onClick={() => buyService("amazon")}>
            <span></span>
          </a>
        </div>
        <div className="panel hbo">
          <a href="#" onClick={() => buyService("hbo")}>
            <span></span>
          </a>
        </div>
        <div className="panel star">
          <a href="#" onClick={() => buyService("startplus")}>
            <span></span>
          </a>
        </div>
        <div className="panel paramount">
          <a href="#" onClick={() => buyService("paramount")}>
            <span></span>
          </a>
        </div>
        <div className="panel plex">
          <a href="#" onClick={() => buyService("plex")}>
            <span></span>
          </a>
        </div>
        <div className="panel crunchyroll">
          <a href="#" onClick={() => buyService("crunchyroll")}>
            <span></span>
          </a>
        </div>
        <div className="panel youtube">
          <a href="#" onClick={() => buyService("youtube")}>
            <span></span>
          </a>
        </div>
        <div className="panel spotify">
          <a href="#" onClick={() => buyService("spotify")}>
            <span></span>
          </a>
        </div>
        <div className="panel directv">
          <a href="#" onClick={() => buyService("directv")}>
            <span></span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Card;
