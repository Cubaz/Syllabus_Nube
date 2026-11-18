import { Link } from "react-router-dom";

function CardStat({ label, value, detail, tone = "default", to }) {
  const content = (
    <>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <small>{detail}</small>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`stat-card ${tone}`}>
        {content}
      </Link>
    );
  }

  return <article className={`stat-card ${tone}`}>{content}</article>;
}

export default CardStat;
