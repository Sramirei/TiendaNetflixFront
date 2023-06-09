import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../Contexts/UserContext";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";

const SalesUserTable = () => {
  const [sales, setSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage] = useState(12);
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

        const salesList = res.data.filter(
          (data) => data.cod_usuario === session.cod_usuario
        );
        setSales(salesList);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (session.token) {
      fetchData();
    }
  }, [session.token]);

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
          </div>

          <div className="table">
            <div className="row header blue">
              <div className="cell">cod_ventas</div>
              <div className="cell">N. Factura</div>
              <div className="cell">Nombre Usuario</div>
              <div className="cell">Producto</div>
              <div className="cell">Cuenta</div>
              <div className="cell">Pantallas</div>
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
                  <div className="cell" data-title="salename">
                    {sale.pantalla}
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

export default SalesUserTable;
