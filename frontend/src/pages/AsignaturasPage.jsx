import EntityPage from "../components/EntityPage";

const fields = [
  {
    name: "codigo",
    label: "Código",
    required: true,
    lockOnEdit: true,
    maxLength: 7,
    transform: "upper",
    placeholder: "Ej. MAT-101",
    hint: "3 letras, guion y 3 dígitos.",
  },
  { name: "nombre", label: "Nombre", required: true, maxLength: 150 },
  { name: "creditos", label: "Créditos", type: "number", required: true, min: 1, max: 30, step: 1, hint: "Entero de 1 a 30." },
  {
    name: "horas_semanales",
    label: "Horas semanales",
    type: "number",
    required: true,
    min: 1,
    max: 40,
    step: 1,
    hint: "Entero de 1 a 40.",
  },
];

const programNames = (item) =>
  (item.programa_asignatura || [])
    .map((relacion) => relacion.programa_academico?.nombre)
    .filter(Boolean);

const columns = [
  { key: "codigo", label: "Código", nowrap: true, filter: "text" },
  { key: "nombre", label: "Nombre", filter: "text" },
  { key: "creditos", label: "Créditos", filter: "range", filterMin: 0, filterStep: 1 },
  { key: "horas_semanales", label: "Horas semanales", filter: "range", filterMin: 0, filterStep: 1 },
  {
    key: "programas",
    label: "Programas",
    value: (item) => programNames(item).join(", "),
    filterValue: programNames,
    filter: "select",
  },
];

function AsignaturasPage() {
  return (
    <EntityPage
      title="Asignaturas"
      endpoint="/asignaturas"
      description="Gestión del catálogo de asignaturas y carga académica."
      fields={fields}
      columns={columns}
      emptyMessage="Aún no hay asignaturas registradas."
      idKey="codigo"
      entity="asignatura"
      describeItem={(item) => item.nombre}
    />
  );
}

export default AsignaturasPage;
