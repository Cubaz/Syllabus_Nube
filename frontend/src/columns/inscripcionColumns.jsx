import GradeBadge from "../components/GradeBadge";
import KeyedValue from "../components/KeyedValue";
import { formatDecimal, fullName, periodLabel, withCode } from "../utils/format";

const alumno = (item) => fullName(item.alumno);
const grupo = (item) => item.grupo?.clave_grupo;
const asignatura = (item) => item.grupo?.programa_asignatura?.asignatura?.nombre;
const periodo = (item) => periodLabel(item.grupo?.periodo_academico);

// Columnas compartidas por Inscripciones y Calificaciones (ambas leen /inscripciones).
export const inscripcionColumns = [
  { key: "id_inscripcion", label: "ID", nowrap: true, filter: "text" },
  {
    key: "alumno",
    label: "Alumno",
    value: (item) => withCode(alumno(item), item.num_cuenta_alumno),
    render: (item) => <KeyedValue label={alumno(item)} code={item.num_cuenta_alumno} />,
    filter: "select",
  },
  {
    key: "grupo",
    label: "Grupo",
    value: (item) => withCode(grupo(item), item.id_grupo),
    render: (item) => <KeyedValue label={grupo(item)} code={item.id_grupo} />,
    filter: "select",
  },
  { key: "asignatura", label: "Asignatura", value: asignatura, filter: "select" },
  { key: "periodo", label: "Periodo", nowrap: true, value: periodo, filter: "select" },
  {
    key: "calificacion_final",
    label: "Calificación final",
    value: (item) => formatDecimal(item.calificacion_final, 1),
    filterValue: (item) => item.calificacion_final,
    render: (item) => <GradeBadge value={item.calificacion_final} />,
    filter: "range",
    filterMin: 0,
    filterMax: 10,
    filterStep: 0.1,
  },
];
