import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav>
            <Link to="/">
                <i className="fa fa-home fa-3x"></i>
                <p>Inicio</p>
            </Link>
            <section>
                <input id="searchBar" name="search" placeholder="Buscar productos" />
                <button id="searchButton">
                    <i className="fa fa-search fa-2x" aria-hidden="true"></i>
                </button>
            </section>
            <Link to="/salehistory">
                <i className="fa fa-history fa-3x" aria-hidden="true"></i>
                <p>Historial</p>
            </Link>
            <Link to="/cart">
                <i className="fa fa-cart-plus fa-3x" aria-hidden="true"></i>
                <p>Nueva venta</p>
            </Link>
        </nav>
    )
}