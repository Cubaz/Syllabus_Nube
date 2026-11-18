function Topbar() {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Sistema institucional</p>
        <h2>Panel de control académico</h2>
      </div>

      <div className="topbar-actions">
        <button className="ghost-btn">Nuevo registro</button>
        <div className="user-pill">
          <span className="avatar">A</span>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
