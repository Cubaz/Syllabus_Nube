import EntityPage from "../components/EntityPage";
import { formatDate } from "../utils/format";

const fields = [
  { name: "anio", label: "Año", type: "number", required: true, min: 2000, max: 2100, step: 1, hint: "De 2000 a 2100." },
  { name: "semestre", label: "Semestre", type: "number", required: true, min: 1, max: 2, step: 1, placeholder: "1 o 2", hint: "1 o 2." },
  {
    name: "fecha_inicio",
    label: "Fecha de inicio",
    type: "date",
    required: true,
    hint: "Semestre 1: enero a junio. Semestre 2: julio a diciembre.",
  },
  {
    name: "fecha_fin",
    label: "Fecha de fin",
    type: "date",
    required: true,
    hint: "Dentro del año del periodo y posterior al inicio.",
  },
];

const columns = [
  { key: "id_periodo", label: "ID", nowrap: true, filter: "text" },
  { key: "anio", label: "Año", filter: "select" },
  { key: "semestre", label: "Semestre", filter: "select" },
  {
    key: "fecha_inicio",
    label: "Fecha de inicio",
    nowrap: true,
    value: (item) => formatDate(item.fecha_inicio),
    filterValue: (item) => item.fecha_inicio,
    filter: "dateRange",
  },
  {
    key: "fecha_fin",
    label: "Fecha de fin",
    nowrap: true,
    value: (item) => formatDate(item.fecha_fin),
    filterValue: (item) => item.fecha_fin,
    filter: "dateRange",
  },
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
      entity="periodo_academico"
      describeItem={(item) => `${item.anio}-${item.semestre}`}
    />
  );
}

export default PeriodosPage;
