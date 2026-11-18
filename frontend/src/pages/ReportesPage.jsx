import EntityPage from "../components/EntityPage";
import GradeBadge from "../components/GradeBadge";
import { formatDecimal, gradeStatus } from "../utils/format";

const gradeRange = { filter: "range", filterMin: 0, filterMax: 10, filterStep: 0.1 };

const columns = [
  { key: "periodo", label: "Periodo", nowrap: true, value: (item) => `${item.anio}-${item.semestre}`, filter: "select" },
  { key: "clave_grupo", label: "Grupo", nowrap: true, value: (item) => item.clave_grupo ?? item.id_grupo, filter: "select" },
  { key: "programa_academico", label: "Programa", filter: "select" },
  { key: "asignatura", label: "Asignatura", filter: "select" },
  { key: "cuenta_alumno", label: "Cuenta", nowrap: true, filter: "text" },
  { key: "alumno", label: "Alumno", filter: "select" },
  { key: "docente", label: "Docente", filter: "select" },
  {
    key: "calificacion_final",
    label: "Calificación",
    value: (item) => formatDecimal(item.calificacion_final, 1),
    filterValue: (item) => item.calificacion_final,
    render: (item) => <GradeBadge value={item.calificacion_final} />,
    ...gradeRange,
  },
  {
    key: "promedio_grupal",
    label: "Promedio grupal",
    value: (item) => formatDecimal(item.promedio_grupal),
    filterValue: (item) => item.promedio_grupal,
    ...gradeRange,
  },
];

const extraFilters = [{ key: "estado", label: "Estado", type: "select", value: gradeStatus }];

function ReportesPage() {
  return (
    <EntityPage
      title="Reportes semestrales"
      endpoint="/reportes/calificaciones"
      description="Reporte de calificaciones por periodo, grupo y alumno."
      columns={columns}
      filters={extraFilters}
      emptyMessage="No hay reportes disponibles para este periodo."
      idKey="id_inscripcion"
      readOnly
    />
  );
}

export default ReportesPage;
