import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", to: "/" },
  { label: "Docentes", to: "/docentes" },
  { label: "Alumnos", to: "/alumnos" },
  { label: "Asignaturas", to: "/asignaturas" },
  { label: "Programas", to: "/programas" },
  { label: "Periodos", to: "/periodos" },
  { label: "Grupos", to: "/grupos" },
  { label: "Inscripciones", to: "/inscripciones" },
  { label: "Calificaciones", to: "/calificaciones" },
  { label: "Reportes", to: "/reportes" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-box">
        <div className="brand-mark">UAEH</div>
        <div>
          <p className="eyebrow">Preparatoria</p>
          <h1>Academia</h1>
        </div>
      </div>

      <nav className="nav-menu" aria-label="Menú principal">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>Gestión académica</span>
      </div>
    </aside>
  );
}

export default Sidebar;
