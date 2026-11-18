function Topbar({ sidebarVisible, onMenuClick }) {
  const label = sidebarVisible ? "Ocultar menú" : "Mostrar menú";

  return (
    <header className="topbar">
      <div className="topbar-start">
        <button
          type="button"
          className="icon-btn menu-btn"
          onClick={onMenuClick}
          aria-label={label}
          title={label}
          aria-controls="sidebar"
          aria-expanded={sidebarVisible}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <div className="topbar-title">
          <p className="eyebrow">ICBI · UAEH</p>
          <h2>
            <span className="title-long">Panel de control académico</span>
            <span className="title-short">ICBI · UAEH</span>
          </h2>
        </div>
      </div>

      <div className="user-pill">
        <span className="avatar" aria-hidden="true">A</span>
        <span className="user-name">Admin</span>
      </div>
    </header>
  );
}

export default Topbar;
