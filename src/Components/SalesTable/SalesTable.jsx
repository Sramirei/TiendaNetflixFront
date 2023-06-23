import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import PacmanLoader from "react-spinners/PacmanLoader";
import UserContext from "../../Contexts/UserContext";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage] = useState(6);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const { session } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_API_URL + 'sales', {
          headers: {
            Authorization: `Bearer ${session.token}`, // Agrega el token de sesión en los encabezados con el formato "Bearer {token}"
          },
        });
        const salesList = res.data;
        setSales(salesList);
        //console.log(salesList);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [updateTrigger]);

  const indexOfLastSales = currentPage * salesPerPage;
  const indexOfFirstSales = indexOfLastSales - salesPerPage;

  const filteredSales = searchValue
    ? sales.filter(
        (sale) =>
          sale.nombre_usuario
            .toUpperCase()
            .includes(searchValue.toUpperCase()) ||
          sale.producto.toUpperCase().includes(searchValue.toUpperCase())
      )
    : sales;

  const filteredSalesByDate = startDate && endDate
    ? filteredSales.filter((sale) => {
        const saleDate = new Date(sale.fecha);
        const rangeStartDate = new Date(startDate);
        const rangeEndDate = new Date(endDate);
        return (
          saleDate >= rangeStartDate &&
          saleDate <= rangeEndDate
        );
      })
    : filteredSales;

  const currentSales = filteredSalesByDate.slice(
    indexOfFirstSales,
    indexOfLastSales
  );

  const handleInputSearch = () => {
    const input = document.getElementById("searchInput");
    setSearchValue(input.value.trim());
  };

  const handleDateSearch = async () => {
    const { value: dateRange } = await Swal.fire({
      title: "Selecciona un rango de fechas",
      html: `
        <label for="start-date"><strong>Desde:</strong></label><br/>
        <input id="start-date" type="date" class="swal2-input" required /><br/>
        <label for="end-date"><strong>Hasta:</strong></label><br/>
        <input id="end-date" type="date" class="swal2-input" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const start = document.getElementById("start-date").value;
        const end = document.getElementById("end-date").value;
        return [start, end];
      },
    });

    if (dateRange && dateRange.length === 2) {
      setStartDate(dateRange[0]);
      setEndDate(dateRange[1]);
    }
  };

  const deleteSale = async (saleId) => {
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
        await axios.delete(
          `${process.env.REACT_APP_API_URL}sales/${saleId}`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`, // Agrega el token de sesión en los encabezados con el formato "Bearer {token}"
            },
          }
        );
  
        Swal.fire("¡Eliminado!", "La venta ha sido eliminada.", "success");
        console.log("Venta eliminada correctamente");
        setUpdateTrigger(!updateTrigger); // Actualiza el estado para volver a cargar las ventas actualizadas
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          "Cancelado",
          "La venta no ha sido eliminada.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
    }
  };

  const exportToExcel = async () => {
    const { value: dateRange } = await Swal.fire({
      title: 'Selecciona un rango de fechas',
      html: `<label for="start-date"><strong>Desde:</strong></label>
             <input id="start-date" type="datetime-local" class="swal2-input" placeholder="Fecha inicial" />
             <label for="end-date"><strong>Hasta:</strong></label>
             <input id="end-date" type="datetime-local" class="swal2-input" placeholder="Fecha final" />`,
      focusConfirm: false,
      preConfirm: () => {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        return [startDate, endDate];
      }
    });
  
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sales");
  
      // Agregar encabezados de columna
      worksheet.addRow([
        "cod_ventas",
        "N. Factura",
        "Identificacion",
        "Nombre Usuario",
        "Producto",
        "Cuenta",
        "Pantallas",
        "perfil",
        "Fecha",
      ]);
  
      // Filtrar las ventas por el rango de fechas seleccionado
      const filteredSales = sales.filter((sale) => {
        const saleDate = new Date(sale.fecha);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
      });
  
      // Agregar datos de ventas filtrados
      filteredSales.forEach((sale) => {
        worksheet.addRow([
          sale.cod_ventas,
          sale.numero_factura,
          sale.identificacion,
          sale.nombre_usuario,
          sale.producto,
          sale.correo_producto,
          sale.pantalla,
          sale.perfil,
          sale.fecha,
        ]);
      });
  
      // Configurar el formato de la celda para texto
      worksheet.columns.forEach((column) => {
        column.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "left" };
          cell.font = { size: 20 };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });
  
      // Generar el archivo Excel
      workbook.xlsx.writeBuffer().then((buffer) => {
        // Crear un objeto Blob para descargar el archivo
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
        // Crear un enlace para descargar el archivo
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "ventas.xlsx";
        link.click();
      });
    }
  };

  const generarPDF = async () => {
    const { value: dateRange } = await Swal.fire({
      title: 'Selecciona un rango de fechas',
      html: `<label for="start-date"><strong>Desde:</strong></label>
             <input id="start-date" type="datetime-local" class="swal2-input" placeholder="Fecha inicial" />
             <label for="end-date"><strong>Hasta:</strong></label>
             <input id="end-date" type="datetime-local" class="swal2-input" placeholder="Fecha final" />`,
      focusConfirm: false,
      preConfirm: () => {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        return [startDate, endDate];
      }
    });
  
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      
      const doc = new jsPDF();
  
      doc.autoTable({
        head: [
          [
            "cod_ventas",
            "N. Factura",
            "Identificacion",
            "Nombre Usuario",
            "Producto",
            "Cuenta",
            "Pantallas",
            "perfil",
            "Fecha",
          ],
        ],
        body: sales
          .filter((sale) => {
            const saleDate = new Date(sale.fecha);
            return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
          })
          .map((sale) => [
            sale.cod_ventas,
            sale.numero_factura,
            sale.identificacion,
            sale.nombre_usuario,
            sale.producto,
            sale.correo_producto,
            sale.pantalla,
            sale.perfil,
            sale.fecha,
          ]),
        startY: 20,
        theme: "grid",
      });
  
      doc.save("Ventas.pdf");
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredSales.length / salesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="TableContainer">
        <div className="wrapper">
          <div className="panel-table">
            <input type="text" id="searchInput" placeholder="Buscar..." />
            <button onClick={handleInputSearch}>Buscar</button>
            <button onClick={handleDateSearch}>Buscar por fecha</button>
            <button onClick={exportToExcel}>Descargar Excel</button>
            <button onClick={generarPDF}>Descargar Pdf</button>
          </div>

          <div className="table">
            <div className="row header blue">
              <div className="cell">cod_ventas</div>
              <div className="cell">N. Factura</div>
              <div className="cell">Identificacion</div>
              <div className="cell">Nombre Usuario</div>
              <div className="cell">Producto</div>
              <div className="cell">Cuenta</div>
              <div className="cell">Contraseña</div>
              <div className="cell">Pantallas</div>
              <div className="cell">perfil</div>
              <div className="cell">Fecha</div>
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
              currentSales.map((sale) => (
                <div className="row" key={sale.cod_ventas}>
                  <div className="cell" data-title="cod_venta">
                    {sale.cod_ventas}
                  </div>
                  <div className="cell" data-title="Numero de Factura">
                    {sale.numero_factura}
                  </div>
                  <div className="cell" data-title="Numero de Factura">
                    {sale.identificacion}
                  </div>
                  <div className="cell" data-title="Nombre usuario">
                    {sale.nombre_usuario}
                  </div>
                  <div className="cell" data-title="Producto">
                    {sale.producto}
                  </div>
                  <div className="cell" data-title="Cuenta">
                    {sale.correo_producto}
                  </div>
                  <div className="cell" data-title="Contraseña">
                    {sale.contrasena}
                  </div>
                  <div className="cell" data-title="Pantalla">
                    {sale.pantalla}
                  </div>
                  <div className="cell" data-title="Perfil">
                    {sale.perfil}
                  </div>
                  <div className="cell" data-title="Fecha">
                    {sale.fecha}
                  </div>
                  <button onClick={() => deleteSale(sale.cod_ventas)}>
                  <i
                    className="fa-solid fa-trash-can"
                    style={{ color: "#ff0000" }}
                  ></i>
                  </button>
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

export default SalesTable;
