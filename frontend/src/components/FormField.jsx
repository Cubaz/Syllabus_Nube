function FormField({ field, value, onChange, onBlur, disabled, options, error }) {
  const id = `field-${field.name}`;
  const hintId = field.hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const commonProps = {
    id,
    name: field.name,
    onChange,
    onBlur,
    disabled,
    "aria-required": field.required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  };

  const messages = (
    <>
      {field.hint && <small id={hintId} className="field-hint">{field.hint}</small>}
      {error && <small id={errorId} className="field-error">{error}</small>}
    </>
  );

  if (field.type === "checkbox") {
    return (
      <div className="field field-check-wrapper">
        <label className="field-check" htmlFor={id}>
          <input {...commonProps} type="checkbox" checked={Boolean(value)} />
          <span>{field.label}</span>
        </label>
        {messages}
      </div>
    );
  }

  let control;
  if (field.type === "select") {
    control = (
      <select {...commonProps} value={value}>
        <option value="">{options ? "Selecciona una opción" : "Cargando opciones..."}</option>
        {(options || []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (field.type === "textarea") {
    control = (
      <textarea
        {...commonProps}
        value={value}
        rows={3}
        maxLength={field.maxLength}
        placeholder={field.placeholder || field.label}
      />
    );
  } else {
    control = (
      <input
        {...commonProps}
        type={field.type || "text"}
        value={value}
        placeholder={field.placeholder || field.label}
        min={field.min}
        max={field.max}
        step={field.step}
        maxLength={field.maxLength}
        inputMode={field.inputMode}
        autoComplete="off"
      />
    );
  }

  return (
    <div className={`field ${field.full ? "field-full" : ""} ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>
        {field.label}
        {field.required && <span className="required-mark" aria-hidden="true"> *</span>}
      </label>
      {control}
      {messages}
    </div>
  );
}

export default FormField;
