import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MenuPage from './pages/Menu';
import Orders from './pages/Orders';
import ItemList from './pages/ItemList';
import NavBar from './components/NavBar';  
import Animation from './pages/Animation';
import Login from './pages/Login';
import { AuthProvider } from './provider/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import Admin from './pages/Admin';
import Chef from './pages/Chef';

function App() {
  const location = useLocation();
  return (
       
        <AuthProvider>
           <div className="w-screen h-screen bg-[#0D3C17] relative flex items-center justify-center overflow-hidden bg-[url('/BG.jpg')] bg-cover bg-center">
        <NavBar></NavBar>
        <Animation activePage={location.pathname}></Animation>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/home" element={null} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/itemlist" element={<ItemList />} />
          <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredPermissions={['admin']}>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chef" 
          element={
            <ProtectedRoute requiredPermissions={['chef']}>
              <Chef />
            </ProtectedRoute>
          } 
        />
        </Routes>
        </div>
        </AuthProvider>
  );
}

export default App;