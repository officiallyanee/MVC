import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import ItemList from './pages/ItemList';
import NavBar from './components/NavBar';  

function App() {
  return (
    
        <div className="w-screen h-screen bg-[#0D3C17] relative flex items-center justify-center overflow-hidden bg-[url('/BG.jpg')] bg-cover bg-center">
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/itemlist" element={<ItemList />} />
        </Routes>
        </div>

  );
}

export default App;