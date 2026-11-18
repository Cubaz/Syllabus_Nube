import EntityPage from "../components/EntityPage";
import { inscripcionColumns } from "../columns/inscripcionColumns";
import { fullName, gradeStatus, periodLabel, withCode } from "../utils/format";

const fields = [
  {
    name: "num_cuenta_alumno",
    label: "Alumno",
    type: "select",
    required: true,
    options: {
      endpoint: "/alumnos",
      getValue: (item) => item.num_cuenta,
      getLabel: (item) => withCode(fullName(item), item.num_cuenta),
    },
  },
  {
    name: "id_grupo",
    label: "Grupo",
    type: "select",
    numeric: true,
    required: true,
    options: {
      endpoint: "/grupos",
      attachAs: "grupo",
      getValue: (item) => item.id_grupo,
      getLabel: (item) => {
        const asignatura = item.programa_asignatura?.asignatura?.nombre ?? item.codigo_asignatura;
        const periodo = periodLabel(item.periodo_academico);
        return [item.clave_grupo, asignatura, periodo].filter(Boolean).join(" · ");
      },
    },
  },
  {
    name: "calificacion_final",
    label: "Calificación final",
    type: "number",
    min: 0,
    max: 10,
    step: 0.01,
    placeholder: "0 a 10 (opcional)",
    hint: "De 0 a 10, hasta 2 decimales. Solo si el periodo ya inició; vacío = pendiente.",
  },
];

const extraFilters = [{ key: "estado", label: "Estado", type: "select", value: gradeStatus }];

function InscripcionesPage() {
  return (
    <EntityPage
      title="Inscripciones"
      endpoint="/inscripciones"
      description="Registro de inscripción de alumnos en grupos y control de calificaciones finales."
      fields={fields}
      columns={inscripcionColumns}
      filters={extraFilters}
      emptyMessage="Aún no hay inscripciones registradas."
      idKey="id_inscripcion"
      entity="inscripcion"
      describeItem={(item) => `#${item.id_inscripcion}`}
    />
  );
}

export default InscripcionesPage;
