import { NavLink } from "react-router-dom";
import { menuItems } from "../routes/navigation";

function Sidebar({ open, visible, isDesktop, onHide }) {
  return (
    <aside
      id="sidebar"
      className={`sidebar ${open ? "open" : ""}`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="brand-box">
        <div className="brand-mark" aria-hidden="true">ICBI</div>
        <div className="brand-text">
          <p className="eyebrow">UAEH</p>
          <h1>Gestión académica</h1>
        </div>
        <button
          type="button"
          className="icon-btn sidebar-close"
          onClick={onHide}
          aria-label={isDesktop ? "Ocultar menú" : "Cerrar menú"}
          title={isDesktop ? "Ocultar menú" : undefined}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {isDesktop ? <path d="M15 6l-6 6 6 6" /> : <path d="M6 6l12 12M18 6L6 18" />}
          </svg>
        </button>
      </div>

      <nav className="nav-menu" aria-label="Menú principal">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>Instituto de Ciencias Básicas e Ingeniería</span>
      </div>
    </aside>
  );
}

export default Sidebar;
