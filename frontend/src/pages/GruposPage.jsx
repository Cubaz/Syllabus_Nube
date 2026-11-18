import EntityPage from "../components/EntityPage";
import KeyedValue from "../components/KeyedValue";
import { fullName, periodLabel, withCode } from "../utils/format";

const fields = [
  {
    name: "clave_grupo",
    label: "Clave del grupo",
    required: true,
    maxLength: 9,
    transform: "upper",
    placeholder: "Ej. MAT-101-A",
    hint: "Código de la asignatura + guion + letra del grupo.",
  },
  {
    name: "num_cuenta_docente",
    label: "Docente",
    type: "select",
    required: true,
    options: {
      endpoint: "/docentes",
      getValue: (item) => item.num_cuenta,
      getLabel: (item) => withCode(fullName(item), item.num_cuenta),
    },
  },
  {
    name: "id_programa",
    label: "Programa académico",
    type: "select",
    numeric: true,
    required: true,
    options: {
      endpoint: "/programas-academicos",
      getValue: (item) => item.id_programa,
      getLabel: (item) => item.nombre,
    },
  },
  {
    name: "codigo_asignatura",
    label: "Asignatura",
    type: "select",
    required: true,
    options: {
      endpoint: "/asignaturas",
      getValue: (item) => item.codigo,
      getLabel: (item) => withCode(item.nombre, item.codigo),
    },
  },
  {
    name: "id_periodo",
    label: "Periodo",
    type: "select",
    numeric: true,
    required: true,
    options: {
      endpoint: "/periodos-academicos",
      getValue: (item) => item.id_periodo,
      getLabel: (item) => `${item.anio} - Semestre ${item.semestre}`,
    },
  },
];

const docente = (item) => fullName(item.docente);
const asignatura = (item) => item.programa_asignatura?.asignatura?.nombre;
const programa = (item) => item.programa_asignatura?.programa_academico?.nombre;
const periodo = (item) => periodLabel(item.periodo_academico);

const columns = [
  { key: "id_grupo", label: "ID", nowrap: true, filter: "text" },
  { key: "clave_grupo", label: "Clave", nowrap: true, filter: "text" },
  {
    key: "docente",
    label: "Docente",
    value: (item) => withCode(docente(item), item.num_cuenta_docente),
    render: (item) => <KeyedValue label={docente(item)} code={item.num_cuenta_docente} />,
    filter: "select",
  },
  {
    key: "asignatura",
    label: "Asignatura",
    value: (item) => withCode(asignatura(item), item.codigo_asignatura),
    render: (item) => <KeyedValue label={asignatura(item)} code={item.codigo_asignatura} />,
    filter: "select",
  },
  {
    key: "programa",
    label: "Programa",
    value: (item) => withCode(programa(item), item.id_programa),
    render: (item) => <KeyedValue label={programa(item)} code={item.id_programa} />,
    filter: "select",
  },
  {
    key: "periodo",
    label: "Periodo",
    value: (item) => withCode(periodo(item), item.id_periodo),
    render: (item) => <KeyedValue label={periodo(item)} code={item.id_periodo} />,
    filter: "select",
  },
];

function GruposPage() {
  return (
    <EntityPage
      title="Grupos"
      endpoint="/grupos"
      description="Control de los grupos académicos por docente, asignatura y periodo. La asignatura debe pertenecer al programa seleccionado."
      fields={fields}
      columns={columns}
      emptyMessage="Aún no hay grupos registrados."
      idKey="id_grupo"
      entity="grupo"
      describeItem={(item) => item.clave_grupo}
    />
  );
}

export default GruposPage;
