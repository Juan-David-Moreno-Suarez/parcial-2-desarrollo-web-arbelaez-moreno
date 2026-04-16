import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import SaleHistory from './pages/SaleHistory'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import NewProduct from './pages/newProduct'
import EditProduct from './pages/EditProduct'
import Purchase from './pages/Purchase'
import Providers from './pages/Providers'
import Clients from './pages/Clients'
import Categories from './pages/Categories'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/salehistory" element={<SaleHistory />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path='/newProduct' element={<NewProduct/>} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/editProduct/:id" element={<EditProduct />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/providers" element={<Providers/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App  