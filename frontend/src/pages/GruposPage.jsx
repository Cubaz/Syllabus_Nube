import EntityPage from "../components/EntityPage";

const fields = [
  { name: "clave_grupo", label: "Clave del grupo", required: true },
  { name: "num_cuenta_docente", label: "Docente", required: true },
  { name: "codigo_asignatura", label: "Asignatura", required: true },
  { name: "id_programa", label: "ID programa", type: "number", required: true },
  { name: "id_periodo", label: "ID periodo", type: "number", required: true },
];

const columns = [
  { key: "id_grupo", label: "ID" },
  { key: "clave_grupo", label: "Clave" },
  { key: "num_cuenta_docente", label: "Docente" },
  { key: "codigo_asignatura", label: "Asignatura" },
  { key: "id_programa", label: "Programa" },
  { key: "id_periodo", label: "Periodo" },
];

function GruposPage() {
  return (
    <EntityPage
      title="Grupos"
      endpoint="/grupos"
      description="Control de los grupos académicos por docente, asignatura y periodo."
      fields={fields}
      columns={columns}
      emptyMessage="Aún no hay grupos registrados."
      idKey="id_grupo"
    />
  );
}

export default GruposPage;
