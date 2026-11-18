import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../services/api";

function EntityPage({
  title,
  endpoint,
  description,
  fields,
  columns,
  emptyMessage,
  idKey = "id",
  readOnly = false,
}) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.name, ""])),
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const getItemId = (item) => item[idKey] ?? null;

  const loadItems = async () => {
    setLoading(true);
    try {
      const payload = await apiGet(endpoint);
      setItems(payload.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "No se pudo cargar la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [endpoint]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(Object.fromEntries(fields.map((field) => [field.name, ""])));
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(fields.map((field) => {
      const value = String(form[field.name] ?? "").trim();
      let normalizedValue = value;

      if (value === "" && (field.nullable || field.type === "number")) {
        normalizedValue = null;
      } else if (value !== "" && field.type === "number") {
        normalizedValue = Number(value);
      }

      return [field.name, normalizedValue];
    }));

    setSaving(true);
    try {
      if (editingId !== null) {
        await apiPut(`${endpoint}/${encodeURIComponent(editingId)}`, payload);
        setSuccess("Registro actualizado correctamente.");
      } else {
        await apiPost(endpoint, payload);
        setSuccess("Registro guardado correctamente.");
      }

      resetForm();
      setError("");
      await loadItems();
    } catch (err) {
      setError(err.message || "No se pudo guardar el registro");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    const currentId = getItemId(item);
    if (currentId === null) {
      setError(`No se encontró la clave "${idKey}" del registro.`);
      return;
    }

    setEditingId(currentId);
    const nextForm = Object.fromEntries(
      fields.map((field) => {
        const value = item[field.name];
        const normalized = value === null || value === undefined
          ? ""
          : String(value);
        return [
          field.name,
          field.type === "date" ? normalized.slice(0, 10) : normalized,
        ];
      }),
    );
    setForm(nextForm);
    setSuccess("Editando registro seleccionado.");
    setError("");
  };

  const handleDelete = async (item) => {
    const currentId = getItemId(item);
    if (currentId === null) {
      setError(`No se encontró la clave "${idKey}" del registro.`);
      return;
    }

    if (!window.confirm("¿Deseas eliminar este registro? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeletingId(currentId);
    try {
      await apiDelete(`${endpoint}/${encodeURIComponent(currentId)}`);
      setSuccess("Registro eliminado correctamente.");
      setError("");
      if (editingId === currentId) {
        resetForm();
      }
      await loadItems();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el registro");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Módulo</p>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="panel-card info-box">
        <p>{description}</p>
      </div>

      {!readOnly && (
        <div className="form-grid panel-card">
          <form onSubmit={handleSubmit} className="crud-form">
            {fields.map((field) => (
              <label key={field.name} className="field">
                <span>{field.label}</span>
                <input
                  name={field.name}
                  type={field.type || "text"}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder || field.label}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                />
              </label>
            ))}

            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? "Guardando..." : editingId !== null ? "Actualizar" : "Guardar"}
              </button>
              {editingId !== null && (
                <button type="button" className="ghost-btn" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      <div className="panel-card table-wrapper">
        <h4>Registros actuales</h4>

        {loading ? (
          <p>Cargando...</p>
        ) : items.length === 0 ? (
          <p>{emptyMessage}</p>
        ) : (
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                {!readOnly && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const rowId = getItemId(item);
                return (
                  <tr key={rowId}>
                    {columns.map((column) => (
                      <td key={`${rowId}-${column.key}`}>
                        {column.render ? column.render(item) : item[column.key] ?? "-"}
                      </td>
                    ))}
                    {!readOnly && (
                      <td>
                        <div className="row-actions">
                          <button type="button" className="small-btn" onClick={() => handleEdit(item)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="small-btn danger"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === rowId}
                          >
                            {deletingId === rowId ? "Eliminando..." : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default EntityPage;
