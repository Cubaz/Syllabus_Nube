import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="page-block">
      <div className="panel-card empty-page">
        <p className="eyebrow">Error 404</p>
        <h3>Página no encontrada</h3>
        <p className="page-description">La dirección que buscas no existe o fue movida.</p>
        <Link to="/" className="primary-btn">Volver al dashboard</Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
