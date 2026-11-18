import EntityPage from "../components/EntityPage";

const fields = [
  { name: "nombre", label: "Nombre del programa", required: true },
  { name: "descripcion", label: "Descripción", nullable: true },
];

const columns = [
  { key: "id_programa", label: "ID" },
  { key: "nombre", label: "Programa" },
  { key: "descripcion", label: "Descripción" },
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
    />
  );
}

export default ProgramasPage;
