import { NavLink } from "react-router-dom"
import { Home, History, BarChart2, Trash2 } from "lucide-react"
import "../styles/Sidebar.css"

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>CultivosAPP-SierraSosa</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              <Home size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/historial" className={({ isActive }) => (isActive ? "active" : "")}>
              <History size={20} />
              <span>Historial General</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/graficas" className={({ isActive }) => (isActive ? "active" : "")}>
              <BarChart2 size={20} />
              <span>Gráficas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/parcelas-eliminadas" className={({ isActive }) => (isActive ? "active" : "")}>
              <Trash2 size={20} />
              <span>Parcelas Eliminadas</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>© 2023 CultivosAPP-SierraSosa</p>
      </div>
    </aside>
  )
}

export default Sidebar

