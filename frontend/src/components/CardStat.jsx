function CardStat({ label, value, detail, tone = "default" }) {
  return (
    <article className={`stat-card ${tone}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

export default CardStat;
