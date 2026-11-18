import EntityPage from "../components/EntityPage";

const columns = [
  { key: "anio", label: "Año" },
  { key: "semestre", label: "Semestre" },
  { key: "id_grupo", label: "Grupo" },
  { key: "programa_academico", label: "Programa" },
  { key: "asignatura", label: "Asignatura" },
  { key: "cuenta_alumno", label: "Cuenta del alumno" },
  { key: "alumno", label: "Alumno" },
  { key: "docente", label: "Docente" },
  {
    key: "calificacion_final",
    label: "Calificación",
    render: (item) => item.calificacion_final ?? "Pendiente",
  },
  { key: "promedio_grupal", label: "Promedio grupal" },
];

function ReportesPage() {
  return (
    <EntityPage
      title="Reportes semestrales"
      endpoint="/reportes/calificaciones"
      description="Reporte de calificaciones por periodo, grupo y alumno."
      fields={[]}
      columns={columns}
      emptyMessage="No hay reportes disponibles para este periodo."
      idKey="id_inscripcion"
      readOnly
    />
  );
}

export default ReportesPage;
