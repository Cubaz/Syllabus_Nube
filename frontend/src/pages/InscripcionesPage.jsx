import EntityPage from "../components/EntityPage";

const fields = [
  { name: "num_cuenta_alumno", label: "Alumno", required: true },
  { name: "id_grupo", label: "ID del grupo", type: "number", required: true },
  { name: "calificacion_final", label: "Calificación final", type: "number", nullable: true, min: 0, max: 10, step: 0.01, placeholder: "0 a 10" },
];

const columns = [
  { key: "id_inscripcion", label: "ID" },
  { key: "num_cuenta_alumno", label: "Alumno" },
  { key: "id_grupo", label: "Grupo" },
  { key: "calificacion_final", label: "Calificación" },
];

function InscripcionesPage() {
  return (
    <EntityPage
      title="Inscripciones"
      endpoint="/inscripciones"
      description="Registro de inscripción de alumnos en grupos y control de calificaciones finales."
      fields={fields}
      columns={columns}
      emptyMessage="Aún no hay inscripciones registradas."
      idKey="id_inscripcion"
    />
  );
}

export default InscripcionesPage;
