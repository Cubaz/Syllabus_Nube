import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardStat from "../components/CardStat";
import { apiGet } from "../services/api";

const initialMetrics = [
  { label: "Docentes", value: "—", detail: "Registrados", tone: "primary", to: "/docentes" },
  { label: "Alumnos", value: "—", detail: "Registrados", tone: "success", to: "/alumnos" },
  { label: "Asignaturas", value: "—", detail: "Registradas", tone: "accent", to: "/asignaturas" },
  { label: "Grupos", value: "—", detail: "Registrados", tone: "warning", to: "/grupos" },
];

const quickLinks = [
  { label: "Inscribir alumno", description: "Asignar un alumno a un grupo", to: "/inscripciones" },
  { label: "Capturar calificaciones", description: "Actualizar calificaciones finales", to: "/calificaciones" },
  { label: "Ver reportes", description: "Calificaciones por periodo y grupo", to: "/reportes" },
];

function DashboardPage() {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const [docentes, alumnos, asignaturas, grupos, inscripciones] = await Promise.all([
          apiGet("/docentes"),
          apiGet("/alumnos"),
          apiGet("/asignaturas"),
          apiGet("/grupos"),
          apiGet("/inscripciones"),
        ]);
        if (!active) return;

        const registros = inscripciones.data || [];
        const calificaciones = registros
          .filter((item) => item.calificacion_final !== null && item.calificacion_final !== undefined)
          .map((item) => Number(item.calificacion_final))
          .filter(Number.isFinite);
        const promedio = calificaciones.length
          ? (calificaciones.reduce((total, grade) => total + grade, 0) / calificaciones.length).toFixed(2)
          : null;

        const counts = [docentes, alumnos, asignaturas, grupos].map((payload) => (payload.data || []).length);
        setMetrics(initialMetrics.map((metric, index) => ({ ...metric, value: String(counts[index]) })));
        setSummary({
          inscripciones: registros.length,
          calificacionesPendientes: registros.length - calificaciones.length,
          promedio,
        });
        setError("");
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "No se pudo cargar el resumen académico.");
        }
      }
    };

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const loadingText = error ? "—" : "Cargando...";

  return (
    <section className="page-block">
      <header className="page-header">
        <p className="eyebrow">Resumen institucional</p>
        <h3>Dashboard</h3>
        <p className="page-description">Vista general de la información académica registrada.</p>
      </header>

      {error && (
        <div className="message error" role="alert">
          <span>{error}</span>
        </div>
      )}

      <div className="stats-grid">
        {metrics.map((metric) => (
          <CardStat
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={metric.tone}
            to={metric.to}
          />
        ))}
      </div>

      <div className="panel-grid">
        <article className="panel-card">
          <h4>Indicadores principales</h4>
          <dl className="kpi-list">
            <div>
              <dt>Promedio de calificaciones</dt>
              <dd>{summary ? summary.promedio ?? "Sin calificaciones" : loadingText}</dd>
            </div>
            <div>
              <dt>Inscripciones</dt>
              <dd>{summary ? summary.inscripciones : loadingText}</dd>
            </div>
            <div>
              <dt>Calificaciones pendientes</dt>
              <dd>{summary ? summary.calificacionesPendientes : loadingText}</dd>
            </div>
          </dl>
          <p className="card-note">Las calificaciones pendientes no se incluyen en el promedio.</p>
        </article>

        <article className="panel-card">
          <h4>Accesos rápidos</h4>
          <ul className="quick-links">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="quick-link">
                  <strong>{link.label}</strong>
                  <span>{link.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

export default DashboardPage;
