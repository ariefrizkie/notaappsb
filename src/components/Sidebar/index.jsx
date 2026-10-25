import {
  Box,
  ChartLine,
  LayoutDashboard,
  Plus,
  UsersRound,
} from "lucide-react";
import { NavLink } from "react-router";
import logoFg from "../../assets/FG.webp";
import logoFoton from "../../assets/Foton-graphia-color.png";
import { color } from "../../utils/dataColorLight";
import DarkMode from "../DarkMode";

function Sidebar() {
  return (
    <aside
      className={`print:hidden relative group font-manrope w-18 hover:w-48 h-screen shrink-0 flex flex-col justify-between gap-7 py-6 px-3 ${color.bgSidebar} transition-all duration-300 ease-in-out z-50 overflow-hidden shadow-lg`}
    >
      <nav className="flex flex-col gap-7 ">
        <div className="flex gap-3 px-3 h-6">
          <img
            src={logoFg}
            alt="Foton Graphia"
            className="shrink-0 object-contain"
          />
          <img
            src={logoFoton}
            alt="Foton Graphia"
            className="shrink-0 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 object-contain"
          />
        </div>
        <div className="flex flex-col gap-1 dark:text-dark-text">
          <NavLink to="/">
            {({ isActive }) => (
              <div
                className={`${isActive ? `${color.navActive}` : `${color.navHover}`} ${color.textMuted} flex items-center gap-3 h-12 px-3 rounded-lg transition-colors`}
              >
                <LayoutDashboard className="text-xl shrink-0" />
                <span className="font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Dashboard
                </span>
              </div>
            )}
          </NavLink>
          <NavLink to="/nota-baru">
            {({ isActive }) => (
              <div
                className={`${isActive ? `${color.navActive}` : `${color.navHover}`} ${color.textMuted} flex items-center gap-3 h-12 px-3 rounded-lg transition-colors`}
              >
                <Plus className="text-xl shrink-0" />
                <span className="font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Nota Baru
                </span>
              </div>
            )}
          </NavLink>
          <NavLink to="/penjualan">
            {({ isActive }) => (
              <div
                className={`${isActive ? `${color.navActive}` : `${color.navHover}`} ${color.textMuted} flex items-center gap-3 h-12 px-3 rounded-lg transition-colors`}
              >
                <ChartLine className="text-xl shrink-0" />
                <span className="font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Penjualan
                </span>
              </div>
            )}
          </NavLink>
          <NavLink to="/produk">
            {({ isActive }) => (
              <div
                className={`${isActive ? `${color.navActive}` : `${color.navHover}`} ${color.textMuted} flex items-center gap-3 h-12 px-3 rounded-lg transition-colors`}
              >
                <Box className="text-xl shrink-0" />
                <span className="font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Produk
                </span>
              </div>
            )}
          </NavLink>
          <NavLink to="/pelanggan">
            {({ isActive }) => (
              <div
                className={`${isActive ? `${color.navActive}` : `${color.navHover}`} ${color.textMuted} flex items-center gap-3 h-12 px-3 rounded-lg transition-colors`}
              >
                <UsersRound className="text-xl shrink-0" />
                <span className="font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Pelanggan
                </span>
              </div>
            )}
          </NavLink>
        </div>
      </nav>
      <div className={`flex gap-3 items-center`}>
        <DarkMode />
        <div
          className={`font-semibold hover:text-light-nav-active-text hover:dark:text-dark-nav-active-text  text-sm ${color.textMuted} opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap`}
        >
          Foton Graphia
          <br />V 1.4.4
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
