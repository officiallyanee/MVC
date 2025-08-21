import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from '../provider/AuthProvider';

export default function NavBar() {
  const navItems = ["HOME", "MENU", "ORDERS", "ITEMLIST"];
  const { user, logout } = useAuth();
  const location=useLocation();
  const isAdmin = user && user.role === 'admin';
  const isChef = user && user.role === 'chef';

  return (
    <nav className="z-5 left-[24%] top-[4%] absolute inline-flex justify-start items-center gap-[2.7vw]">
      {navItems.map((item) => (
        <NavLink
          key={item}
          to={`/${item.toLowerCase()}`}
          state={
            location.pathname === "/home" || location.pathname === "/"
              ? { from: 'home' } 
              : undefined
          }
          className={({ isActive }) => `cursor-pointer text-center font-normal font-['Pompiere'] tracking-wide text-[clamp(1rem,3.3vw,3rem)] transition-colors duration-300 ${
            isActive ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
          }`}
        >
          {item}
        </NavLink>
      ))}
      {isAdmin && (
        <NavLink
          to="/admin"
          state={
            location.pathname === "/home" || location.pathname === "/"
              ? { from: 'home' } 
              : undefined
          }
          className={({ isActive }) => `cursor-pointer text-center font-normal font-['Pompiere'] tracking-wide text-[clamp(1rem,3.3vw,3rem)] transition-colors duration-300 ${
            isActive ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
          }`}
        >
          ADMIN
        </NavLink>
      )}
      {isChef && (
        <NavLink
          to="/chef"
          state={
            location.pathname === "/home" || location.pathname === "/"
              ? { from: 'home' } 
              : undefined
          }
          className={({ isActive }) => `cursor-pointer text-center font-normal font-['Pompiere'] tracking-wide text-[clamp(1rem,3.3vw,3rem)] transition-colors duration-300 ${
            isActive ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
          }`}
        >
          CHEF
        </NavLink>
      )}
      {user.username!=="" && (
        <button
          onClick={logout}
          className="cursor-pointer text-center font-normal font-['Pompiere'] tracking-wide text-[clamp(1rem,3.3vw,3rem)] transition-colors duration-300 text-white hover:text-yellow-200"
        >
          LOGOUT
        </button>
      )}
    </nav>
  );
}
