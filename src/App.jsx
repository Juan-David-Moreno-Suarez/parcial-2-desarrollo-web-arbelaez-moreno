import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import SaleHistory from './pages/SaleHistory'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import NewProduct from './pages/newProduct'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App  