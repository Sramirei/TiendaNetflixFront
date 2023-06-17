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
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage] = useState(12);
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

  const currentSales = filteredSales.slice(indexOfFirstSales, indexOfLastSales);

  const handleSearch = () => {
    const input = document.getElementById("searchInput");
    setSearchValue(input.value.trim());
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
          cell.font = { size: 12 };
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
        const blob = new Blob([buffer], { type: "application/vnd.ms-excel" });
  
        // Crear un enlace para descargar el archivo
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "ventas.xls";
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
            <button onClick={handleSearch}>Buscar</button>
            <button onClick={exportToExcel}>Descargar Excel</button>
            <button onClick={generarPDF}>Descargar Pdf</button>
          </div>

          <div className="table">
            <div className="row header blue">
              <div className="cell">cod_ventas</div>
              <div className="cell">N. Factura</div>
              <div className="cell">Nombre Usuario</div>
              <div className="cell">Producto</div>
              <div className="cell">Cuenta</div>
              <div className="cell">Contraseña</div>
              <div className="cell">Pantallas</div>
              <div className="cell">perfil</div>
              <div className="cell">Fecha</div>
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
                  <div className="cell" data-title="id">
                    {sale.cod_ventas}
                  </div>
                  <div className="cell" data-title="name">
                    {sale.numero_factura}
                  </div>
                  <div className="cell" data-title="lastName">
                    {sale.nombre_usuario}
                  </div>
                  <div className="cell" data-title="phone">
                    {sale.producto}
                  </div>
                  <div className="cell" data-title="company">
                    {sale.correo_producto}
                  </div>
                  <div className="cell" data-title="company">
                    {sale.contrasena}
                  </div>
                  <div className="cell" data-title="salename">
                    {sale.pantalla}
                  </div>
                  <div className="cell" data-title="salename">
                    {sale.perfil}
                  </div>
                  <div className="cell" data-title="state">
                    {sale.fecha}
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

export default SalesTable;
