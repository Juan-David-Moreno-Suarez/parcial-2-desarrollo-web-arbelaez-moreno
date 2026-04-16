import { Link } from 'react-router-dom'
import '../styles/style.css'
import { useEffect } from 'react'
import CategoryList from '../components/APIComponents'

function Home() {
    return (
        <div className='home-content'>
            <img src="/img/logo.png" alt="Logo" />
            <h1>Bienvenido</h1>
            <h4>al punto de venta</h4>
            <h2>Elige a dónde quieres ir</h2>
            <nav className='home-nav'>
                <Link to="/catalogue">
                    <i className="fa fa-archive fa-2x" aria-hidden="true"></i>
                    Catálogo
                </Link>
                <Link to="/cart">
                    <i className="fa fa-cart-plus fa-2x" aria-hidden="true"></i>
                    Nueva venta
                </Link>
                <Link to="/salehistory">
                    <i className="fa fa-history fa-2x" aria-hidden="true"></i>
                    Historial
                </Link>
                <Link to="/providers">
                    <i class="fa-solid fa-address-book"></i>
                    Proveedores
                </Link>
                <Link to="/categories">
                    <i class="fa-solid fa-book"></i>
                    Categorias
                </Link>
                <Link to="/clients">
                    <i class="fa-solid fa-user"></i>
                    Clientes
                </Link>
            </nav>
        </div>
    )
}

export default Home