import EntityPage from "../components/EntityPage";

const fields = [
  { name: "codigo", label: "Código", required: true },
  { name: "nombre", label: "Nombre", required: true },
  { name: "creditos", label: "Créditos", type: "number", required: true },
  { name: "horas_semanales", label: "Horas semanales", type: "number", required: true },
];

const columns = [
  { key: "codigo", label: "Código" },
  { key: "nombre", label: "Nombre" },
  { key: "creditos", label: "Créditos" },
  { key: "horas_semanales", label: "Horas/semana" },
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
    />
  );
}

export default AsignaturasPage;
