import EntityPage from "../components/EntityPage";

const fields = [
  { name: "id_inscripcion", label: "ID inscripción", type: "number" },
  { name: "calificacion_final", label: "Calificación final", type: "number" },
];

const columns = [
  { key: "id_inscripcion", label: "Inscripción" },
  { key: "calificacion_final", label: "Calificación" },
];

function CalificacionesPage() {
  return (
    <EntityPage
      title="Calificaciones"
      endpoint="/inscripciones"
      description="Consulta y actualización de calificaciones finales por inscripción."
      fields={fields}
      columns={columns}
      emptyMessage="Aún no hay calificaciones registradas."
    />
  );
}

export default CalificacionesPage;
