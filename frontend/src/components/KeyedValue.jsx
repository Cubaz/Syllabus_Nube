function KeyedValue({ label, code }) {
  if (!label && !code) return <span className="muted">—</span>;
  if (!label || label === code) return <span className="nowrap">{code}</span>;

  return (
    <span className="keyed-value">
      <span>{label}</span>
      <small>{code}</small>
    </span>
  );
}

export default KeyedValue;
