import { useMemo } from "react";
import { buildSelectOptions } from "../utils/filters";

function FilterPanel({ id, filters, items, values, onChange, onClear, activeCount, canClear }) {
  const selectOptions = useMemo(
    () =>
      Object.fromEntries(
        filters
          .filter((filter) => filter.type === "select")
          .map((filter) => [filter.key, buildSelectOptions(filter, items)]),
      ),
    [filters, items],
  );

  return (
    <div id={id} className="filter-panel" role="region" aria-label="Filtros de búsqueda">
      <div className="filter-grid">
        {filters.map((filter) => {
          const controlId = `filter-${filter.key}`;
          const current = values[filter.key];

          if (filter.type === "range" || filter.type === "dateRange") {
            const range = current || { min: "", max: "" };
            const isDate = filter.type === "dateRange";
            return (
              <fieldset key={filter.key} className={`field filter-range ${isDate ? "date-range" : ""}`}>
                <legend>{filter.label}</legend>
                <div className="range-inputs">
                  <input
                    type={isDate ? "date" : "number"}
                    inputMode={isDate ? undefined : "decimal"}
                    placeholder="Mín."
                    aria-label={`${filter.label} ${isDate ? "desde" : "mínimo"}`}
                    value={range.min}
                    min={filter.min}
                    max={filter.max}
                    step={filter.step}
                    onChange={(event) => onChange(filter.key, { ...range, min: event.target.value })}
                  />
                  <span aria-hidden="true">–</span>
                  <input
                    type={isDate ? "date" : "number"}
                    inputMode={isDate ? undefined : "decimal"}
                    placeholder="Máx."
                    aria-label={`${filter.label} ${isDate ? "hasta" : "máximo"}`}
                    value={range.max}
                    min={filter.min}
                    max={filter.max}
                    step={filter.step}
                    onChange={(event) => onChange(filter.key, { ...range, max: event.target.value })}
                  />
                </div>
              </fieldset>
            );
          }

          return (
            <label key={filter.key} className="field" htmlFor={controlId}>
              <span>{filter.label}</span>
              {filter.type === "text" ? (
                <input
                  id={controlId}
                  type="text"
                  placeholder={filter.placeholder || `Filtrar por ${filter.label.toLowerCase()}`}
                  value={current ?? ""}
                  onChange={(event) => onChange(filter.key, event.target.value)}
                />
              ) : (
                <select
                  id={controlId}
                  value={current ?? ""}
                  onChange={(event) => onChange(filter.key, event.target.value)}
                >
                  <option value="">Todos</option>
                  {selectOptions[filter.key].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </label>
          );
        })}
      </div>

      <div className="filter-footer">
        <span className="muted">
          {activeCount === 0
            ? "Sin filtros aplicados"
            : `${activeCount} ${activeCount === 1 ? "filtro aplicado" : "filtros aplicados"}`}
        </span>
        <button type="button" className="ghost-btn small" onClick={onClear} disabled={!canClear}>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
