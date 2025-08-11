import { NavLink } from "react-router-dom";
export default function NavBar() {
  const navItems = ["HOME", "MENU", "ORDERS", "ITEMLIST"];
  return (
    <nav className="left-[28.6%] top-[4%] absolute inline-flex justify-start items-center gap-[2.7vw]">
      {navItems.map((item) => (
        <NavLink
          key={item}
          to={`/${item.toLowerCase()}`}
          className={({ isActive }) => `cursor-pointer text-center font-normal font-['Pompiere'] tracking-wide text-[clamp(1rem,3.3vw,3rem)] transition-colors duration-300 ${
            isActive ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
          }`}
        >
          {item}
        </NavLink>
      ))}
    </nav>
  );
}
