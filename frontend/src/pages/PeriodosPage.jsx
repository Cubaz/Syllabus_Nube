import EntityPage from "../components/EntityPage";

const fields = [
  { name: "anio", label: "Año", type: "number", required: true },
  { name: "semestre", label: "Semestre", type: "number", required: true },
  { name: "fecha_inicio", label: "Fecha de inicio", type: "date", required: true },
  { name: "fecha_fin", label: "Fecha de fin", type: "date", required: true },
];

const columns = [
  { key: "id_periodo", label: "ID" },
  { key: "anio", label: "Año" },
  { key: "semestre", label: "Semestre" },
  { key: "fecha_inicio", label: "Inicio" },
  { key: "fecha_fin", label: "Fin" },
];

function PeriodosPage() {
  return (
    <EntityPage
      title="Periodos académicos"
      endpoint="/periodos-academicos"
      description="Registro de ciclos escolares y vigencia del calendario académico."
      fields={fields}
      columns={columns}
      emptyMessage="Aún no hay periodos académicos registrados."
      idKey="id_periodo"
    />
  );
}

export default PeriodosPage;
