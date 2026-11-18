import { formatDecimal } from "../utils/format";

function GradeBadge({ value, digits = 1 }) {
  const formatted = formatDecimal(value, digits);
  if (formatted === null) {
    return <span className="badge pending">Pendiente</span>;
  }

  return <span className="badge grade">{formatted}</span>;
}

export default GradeBadge;
