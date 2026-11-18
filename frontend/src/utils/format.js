export function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDecimal(value, digits = 2) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return number.toFixed(digits);
}

export function gradeStatus(item) {
  const grade = item.calificacion_final;
  return grade === null || grade === undefined || grade === "" ? "Pendiente" : "Calificada";
}

export function fullName(person) {
  if (!person) return null;
  return [person.nombre, person.apellidos].filter(Boolean).join(" ");
}

export function withCode(label, code) {
  if (code === null || code === undefined || code === "") return label ?? null;
  return label ? `${label} (${code})` : String(code);
}

export function periodLabel(periodo) {
  return periodo ? `${periodo.anio}-${periodo.semestre}` : null;
}

export const yesNo = (value) => (value ? "Sí" : "No");
