import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../services/api";
import DataTable, { getCellValue } from "./DataTable";
import FilterPanel from "./FilterPanel";
import FormField from "./FormField";
import { filtersFromColumns, isFilterActive, matchesFilter, normalizeText } from "../utils/filters";
import { validarRegistro } from "../utils/validators";

const SUCCESS_TIMEOUT_MS = 4000;
const NO_FIELDS = [];
const NO_FILTERS = [];
const FILTERS_OPEN_QUERY = "(min-width: 1024px)";

const isNumericField = (field) => field.type === "number" || field.numeric;
const isBlank = (value) => value === null || value === undefined || value === "";

const inputTransforms = {
  upper: (value) => value.toUpperCase(),
  lower: (value) => value.toLowerCase(),
  digits: (value) => value.replace(/\D/g, ""),
};

// Un campo de selección puede adjuntar el registro elegido (options.attachAs) para
// reglas que dependen de él; por ejemplo, el periodo del grupo de una inscripción.
const attachSelected = (fields, payload, options) =>
  Object.fromEntries(
    fields
      .filter((field) => field.options?.attachAs && !isBlank(payload[field.name]))
      .map((field) => {
        const selected = (options[field.name] || []).find(
          (option) => option.value === String(payload[field.name]),
        );
        return [field.options.attachAs, selected?.item];
      })
      .filter(([, item]) => item),
  );

// Devuelve { campo: mensaje } usando las mismas reglas que el backend.
const validateForm = (fields, payload, entity, editingItem, options = {}) => {
  const errors = {};
  for (const field of fields) {
    if (field.name in payload && field.required && isBlank(payload[field.name])) {
      errors[field.name] = "Este campo es obligatorio";
    }
  }

  if (entity) {
    const record = { ...(editingItem ?? {}), ...payload, ...attachSelected(fields, payload, options) };
    const toCheck = Object.keys(payload).filter((name) => !errors[name]);
    Object.assign(errors, validarRegistro(entity, record, toCheck));
  }
  return errors;
};

const buildEmptyForm = (fields) =>
  Object.fromEntries(fields.map((field) => [field.name, field.type === "checkbox" ? false : ""]));

const buildFormFromItem = (fields, item) =>
  Object.fromEntries(
    fields.map((field) => {
      const value = item[field.name];
      if (field.type === "checkbox") return [field.name, Boolean(value)];
      const text = value === null || value === undefined ? "" : String(value);
      return [field.name, field.type === "date" ? text.slice(0, 10) : text];
    }),
  );

const buildPayload = (fields, form, isEditing) =>
  Object.fromEntries(
    fields
      .filter((field) => !(isEditing && field.lockOnEdit))
      .map((field) => {
        if (field.type === "checkbox") return [field.name, Boolean(form[field.name])];

        const value = String(form[field.name] ?? "").trim();
        if (value === "") return [field.name, null];
        return [field.name, isNumericField(field) ? Number(value) : value];
      }),
  );

function Alert({ type, message, onClose }) {
  return (
    <div className={`message ${type}`} role={type === "error" ? "alert" : "status"}>
      <span>{message}</span>
      <button type="button" className="message-close" onClick={onClose} aria-label="Cerrar mensaje">
        ×
      </button>
    </div>
  );
}

function EntityPage({
  title,
  endpoint,
  description,
  fields = NO_FIELDS,
  columns,
  filters: extraFilters = NO_FILTERS,
  emptyMessage,
  idKey = "id",
  entity,
  readOnly = false,
  allowCreate = !readOnly,
  allowDelete = !readOnly,
  describeItem,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(() => buildEmptyForm(fields));
  const [fieldErrors, setFieldErrors] = useState({});
  const [options, setOptions] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(
    () => window.matchMedia?.(FILTERS_OPEN_QUERY).matches ?? true,
  );
  const formRef = useRef(null);
  const messagesRef = useRef(null);
  const mountedRef = useRef(true);

  const filters = useMemo(
    () => [...filtersFromColumns(columns), ...extraFilters],
    [columns, extraFilters],
  );
  const editingId = editingItem ? editingItem[idKey] : null;
  const canEdit = !readOnly && fields.length > 0;
  const canDelete = !readOnly && allowDelete;
  const showForm = canEdit && (allowCreate || editingItem !== null);
  const filtersId = `filters${endpoint.replace(/\W+/g, "-")}`;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await apiGet(endpoint);
      if (mountedRef.current) setItems(payload.data || []);
    } catch (err) {
      if (mountedRef.current) setError(err.message || "No se pudo cargar la información");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    const selectFields = fields.filter((field) => field.type === "select" && field.options);
    if (selectFields.length === 0) return undefined;

    let active = true;
    Promise.all(
      selectFields.map(async (field) => {
        const payload = await apiGet(field.options.endpoint);
        return [
          field.name,
          (payload.data || []).map((item) => ({
            value: String(field.options.getValue(item)),
            label: field.options.getLabel(item),
            item,
          })),
        ];
      }),
    )
      .then((entries) => {
        if (active) setOptions(Object.fromEntries(entries));
      })
      .catch((err) => {
        if (active) setError(err.message || "No se pudieron cargar las opciones del formulario");
      });

    return () => {
      active = false;
    };
  }, [fields]);

  useEffect(() => {
    if (!success) return undefined;
    const timer = window.setTimeout(() => setSuccess(""), SUCCESS_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (error) messagesRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [error]);

  const activeFilterCount = filters.filter((filter) =>
    isFilterActive(filter, filterValues[filter.key]),
  ).length;
  const searchTerm = normalizeText(query);
  const isFiltering = activeFilterCount > 0 || searchTerm !== "";

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const passesFilters = filters.every((filter) =>
          matchesFilter(filter, filterValues[filter.key], item),
        );
        if (!passesFilters) return false;
        if (!searchTerm) return true;

        return columns.some((column) => {
          const value = getCellValue(column, item);
          return value !== null && value !== undefined && normalizeText(value).includes(searchTerm);
        });
      }),
    [items, columns, filters, filterValues, searchTerm],
  );

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleFilterChange = (key, value) => {
    setFilterValues((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilterValues({});
    setQuery("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const transform = inputTransforms[fields.find((field) => field.name === name)?.transform];
    const nextValue = type === "checkbox" ? checked : transform ? transform(value) : value;

    setForm((current) => ({ ...current, [name]: nextValue }));
    setFieldErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  // Al salir de un campo con contenido se revisa su formato (lo obligatorio se revisa al guardar).
  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (isBlank(value)) return;

    const payload = buildPayload(fields, { ...form, [name]: value }, editingItem !== null);
    const errors = validateForm(fields, payload, entity, editingItem, options);
    setFieldErrors((current) => ({ ...current, [name]: errors[name] }));
  };

  const resetForm = () => {
    setForm(buildEmptyForm(fields));
    setFieldErrors({});
    setEditingItem(null);
  };

  const focusField = (name) => {
    formRef.current?.querySelector(`[name="${name}"]`)?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    const payload = buildPayload(fields, form, editingItem !== null);
    const errors = validateForm(fields, payload, entity, editingItem, options);
    setFieldErrors(errors);

    const firstInvalid = fields.find((field) => errors[field.name]);
    if (firstInvalid) {
      focusField(firstInvalid.name);
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await apiPut(`${endpoint}/${encodeURIComponent(editingId)}`, payload);
        setSuccess("Registro actualizado correctamente.");
      } else {
        await apiPost(endpoint, payload);
        setSuccess("Registro guardado correctamente.");
      }

      resetForm();
      await loadItems();
    } catch (err) {
      setError(err.message || "No se pudo guardar el registro");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm(buildFormFromItem(fields, item));
    setFieldErrors({});
    clearMessages();

    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current
        ?.querySelector("input:not(:disabled), select:not(:disabled), textarea:not(:disabled)")
        ?.focus({ preventScroll: true });
    });
  };

  const handleDelete = async (item) => {
    const itemId = item[idKey];
    if (!window.confirm("¿Deseas eliminar este registro? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeletingId(itemId);
    clearMessages();
    try {
      await apiDelete(`${endpoint}/${encodeURIComponent(itemId)}`);
      setSuccess("Registro eliminado correctamente.");
      if (editingId === itemId) resetForm();
      await loadItems();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el registro");
    } finally {
      setDeletingId(null);
    }
  };

  const formTitle = editingItem
    ? `Editar registro${describeItem ? `: ${describeItem(editingItem)}` : ""}`
    : "Nuevo registro";

  const renderTableContent = () => {
    if (loading) return <p className="empty-state">Cargando...</p>;
    if (items.length === 0) return <p className="empty-state">{emptyMessage}</p>;
    if (filteredItems.length === 0) {
      return (
        <div className="empty-state no-results">
          <p>No hay registros que coincidan con la búsqueda o los filtros.</p>
          <button type="button" className="ghost-btn small" onClick={clearFilters}>
            Limpiar búsqueda y filtros
          </button>
        </div>
      );
    }

    return (
      <DataTable
        columns={columns}
        items={filteredItems}
        idKey={idKey}
        editingId={editingId}
        deletingId={deletingId}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  };

  return (
    <section className="page-block">
      <header className="page-header">
        <p className="eyebrow">Módulo</p>
        <h3>{title}</h3>
        {description && <p className="page-description">{description}</p>}
      </header>

      {(error || success) && (
        <div className="messages" ref={messagesRef}>
          {error && <Alert type="error" message={error} onClose={() => setError("")} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}
        </div>
      )}

      {showForm && (
        <div className={`panel-card form-card ${editingItem ? "editing" : ""}`} ref={formRef}>
          <div className="card-header">
            <h4>{formTitle}</h4>
          </div>

          <form onSubmit={handleSubmit} className="crud-form" noValidate>
            {fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={form[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={saving || Boolean(editingItem && field.lockOnEdit)}
                options={options[field.name]}
                error={fieldErrors[field.name]}
              />
            ))}

            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? "Guardando..." : editingItem ? "Actualizar" : "Guardar"}
              </button>
              {editingItem && (
                <button type="button" className="ghost-btn" onClick={resetForm} disabled={saving}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="panel-card table-card">
        <div className="card-header">
          <h4>
            Registros actuales
            {!loading && (
              <span className="count-badge">
                {isFiltering ? `${filteredItems.length} de ${items.length}` : items.length}
              </span>
            )}
          </h4>
          {items.length > 0 && (
            <div className="table-toolbar">
              <input
                type="search"
                className="search-input"
                placeholder="Buscar..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label={`Buscar en ${title}`}
              />
              {filters.length > 0 && (
                <button
                  type="button"
                  className={`ghost-btn filter-toggle ${filtersOpen ? "active" : ""}`}
                  onClick={() => setFiltersOpen((open) => !open)}
                  aria-expanded={filtersOpen}
                  aria-controls={filtersId}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 5h16l-6 7.5V19l-4 2v-8.5L4 5z" />
                  </svg>
                  Filtros
                  {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
                </button>
              )}
            </div>
          )}
        </div>

        {filters.length > 0 && items.length > 0 && filtersOpen && (
          <FilterPanel
            id={filtersId}
            filters={filters}
            items={items}
            values={filterValues}
            onChange={handleFilterChange}
            onClear={clearFilters}
            activeCount={activeFilterCount}
            canClear={isFiltering}
          />
        )}

        {renderTableContent()}
      </div>
    </section>
  );
}

export default EntityPage;
