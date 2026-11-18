export const getCellValue = (column, item) =>
  column.value ? column.value(item) : item[column.key];

const isEmptyValue = (value) => value === null || value === undefined || value === "";

function DataTable({
  columns,
  items,
  idKey,
  editingId,
  deletingId,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}) {
  const showActions = canEdit || canDelete;

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">{column.label}</th>
            ))}
            {showActions && <th scope="col" className="actions-col">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const itemId = item[idKey];
            const isEditing = editingId !== null && editingId === itemId;
            const isDeleting = deletingId !== null && deletingId === itemId;

            return (
              <tr key={itemId ?? `row-${index}`} className={isEditing ? "is-editing" : undefined}>
                {columns.map((column) => {
                  const value = getCellValue(column, item);
                  return (
                    <td
                      key={column.key}
                      data-label={column.label}
                      className={column.nowrap ? "nowrap" : undefined}
                    >
                      {column.render
                        ? column.render(item)
                        : isEmptyValue(value)
                          ? <span className="muted">—</span>
                          : value}
                    </td>
                  );
                })}
                {showActions && (
                  <td className="actions-col" data-label="Acciones">
                    <div className="row-actions">
                      {canEdit && (
                        <button type="button" className="small-btn" onClick={() => onEdit(item)}>
                          Editar
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          className="small-btn danger"
                          onClick={() => onDelete(item)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Eliminando..." : "Eliminar"}
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
