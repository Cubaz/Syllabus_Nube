import EntityPage from "../components/EntityPage";

const fields = [
  { name: "nombre", label: "Nombre del programa", required: true, maxLength: 150, hint: "De 3 a 150 caracteres." },
  { name: "descripcion", label: "Descripción", type: "textarea", maxLength: 500, full: true, hint: "Hasta 500 caracteres." },
];

const subjectNames = (item) =>
  (item.programa_asignatura || [])
    .map((relacion) => relacion.asignatura?.nombre)
    .filter(Boolean);

const columns = [
  { key: "id_programa", label: "ID", nowrap: true, filter: "text" },
  { key: "nombre", label: "Programa", filter: "text" },
  { key: "descripcion", label: "Descripción", filter: "text" },
  {
    key: "asignaturas",
    label: "Asignaturas",
    value: (item) => subjectNames(item).join(", "),
    filterValue: subjectNames,
    filter: "select",
  },
];

function ProgramasPage() {
  return (
    <EntityPage
      title="Programas académicos"
      endpoint="/programas-academicos"
      description="Administración de programas académicos y su oferta curricular."
      fields={fields}
      columns={columns}
      emptyMessage="Aún no hay programas académicos registrados."
      idKey="id_programa"
      entity="programa_academico"
      describeItem={(item) => item.nombre}
    />
  );
}

export default ProgramasPage;
