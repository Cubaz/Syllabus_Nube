import { useEffect, useState } from "react";
import CardStat from "../components/CardStat";
import { apiGet } from "../services/api";

const initialMetrics = [
  { label: "Docentes", value: "—", detail: "Registrados", tone: "primary" },
  { label: "Alumnos", value: "—", detail: "Registrados", tone: "success" },
  { label: "Asignaturas", value: "—", detail: "Registradas", tone: "accent" },
  { label: "Grupos", value: "—", detail: "Registrados", tone: "warning" },
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

        const registros = inscripciones.data;
        const calificaciones = registros
          .filter((item) => item.calificacion_final !== null && item.calificacion_final !== undefined)
          .map((item) => Number(item.calificacion_final))
          .filter(Number.isFinite);
        const promedio = calificaciones.length
          ? (calificaciones.reduce((total, grade) => total + grade, 0) / calificaciones.length).toFixed(2)
          : null;

        setMetrics([
          { ...initialMetrics[0], value: String(docentes.data.length) },
          { ...initialMetrics[1], value: String(alumnos.data.length) },
          { ...initialMetrics[2], value: String(asignaturas.data.length) },
          { ...initialMetrics[3], value: String(grupos.data.length) },
        ]);
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

  return (
    <section className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Resumen institucional</p>
          <h3>Dashboard</h3>
        </div>
      </div>

      <div className="stats-grid">
        {metrics.map((metric) => (
          <CardStat
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={metric.tone}
          />
        ))}
      </div>

      {error && <div className="message error">{error}</div>}

      <div className="panel-grid">
        <article className="panel-card">
          <h4>Indicadores principales</h4>
          <ul className="list-plain">
            <li>Promedio de calificaciones: {summary?.promedio ?? "Sin calificaciones registradas"}</li>
            <li>Inscripciones: {summary?.inscripciones ?? "Cargando..."}</li>
            <li>Calificaciones pendientes: {summary?.calificacionesPendientes ?? "Cargando..."}</li>
          </ul>
        </article>

        <article className="panel-card">
          <h4>Actividades recientes</h4>
          <ul className="list-plain">
            <li>Datos sincronizados desde los registros actuales de la API.</li>
            <li>Las calificaciones pendientes no se incluyen en el promedio.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export default DashboardPage;
