import EntityPage from "../components/EntityPage";
import { inscripcionColumns } from "../columns/inscripcionColumns";
import { fullName, gradeStatus } from "../utils/format";

const fields = [
  {
    name: "calificacion_final",
    label: "Calificación final",
    type: "number",
    min: 0,
    max: 10,
    step: 0.01,
    placeholder: "0 a 10 (vacío = pendiente)",
    hint: "De 0 a 10, con hasta 2 decimales. Solo si el periodo ya inició.",
  },
];

const extraFilters = [{ key: "estado", label: "Estado", type: "select", value: gradeStatus }];

function CalificacionesPage() {
  return (
    <EntityPage
      title="Calificaciones"
      endpoint="/inscripciones"
      description="Consulta y actualización de calificaciones finales por inscripción. Pulsa «Editar» en una fila para capturar su calificación."
      fields={fields}
      columns={inscripcionColumns}
      filters={extraFilters}
      emptyMessage="Aún no hay inscripciones con calificaciones por capturar."
      idKey="id_inscripcion"
      entity="inscripcion"
      allowCreate={false}
      allowDelete={false}
      describeItem={(item) => fullName(item.alumno) ?? `#${item.id_inscripcion}`}
    />
  );
}

export default CalificacionesPage;
