const RANGE_TYPES = ["range", "dateRange"];

export const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const isEmpty = (value) => value === null || value === undefined || value === "";

export const getFilterValue = (filter, item) =>
  filter.value ? filter.value(item) : item[filter.key];

// Un atributo puede tener varios valores (por ejemplo, las asignaturas de un programa).
const toValueList = (value) =>
  (Array.isArray(value) ? value : [value]).filter((entry) => !isEmpty(entry));

/**
 * Convierte las columnas que declaran `filter` en definiciones de filtro.
 * La columna aporta la clave, la etiqueta y el valor; `filterValue` permite
 * filtrar por un dato distinto del que se muestra (por ejemplo, la fecha ISO).
 */
export const filtersFromColumns = (columns) =>
  columns
    .filter((column) => column.filter)
    .map((column) => ({
      key: column.key,
      label: column.filterLabel ?? column.label,
      type: column.filter,
      value: column.filterValue ?? column.value,
      min: column.filterMin,
      max: column.filterMax,
      step: column.filterStep,
      options: column.filterOptions,
    }));

export const isFilterActive = (filter, current) => {
  if (RANGE_TYPES.includes(filter.type)) {
    return Boolean(current && (!isEmpty(current.min) || !isEmpty(current.max)));
  }
  return !isEmpty(current);
};

const inRange = (value, { min, max }, parse) => {
  const parsed = parse(value);
  if (parsed === null) return false;
  if (!isEmpty(min) && parsed < parse(min)) return false;
  if (!isEmpty(max) && parsed > parse(max)) return false;
  return true;
};

const parseNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

// Las fechas se comparan como texto AAAA-MM-DD, que conserva el orden cronológico.
const parseDate = (value) => (isEmpty(value) ? null : String(value).slice(0, 10));

export function matchesFilter(filter, current, item) {
  if (!isFilterActive(filter, current)) return true;
  const values = toValueList(getFilterValue(filter, item));
  if (values.length === 0) return false;

  switch (filter.type) {
    case "range":
      return values.some((value) => inRange(value, current, parseNumber));
    case "dateRange":
      return values.some((value) => inRange(value, current, parseDate));
    case "text": {
      const term = normalizeText(current);
      return values.some((value) => normalizeText(value).includes(term));
    }
    default:
      return values.some((value) => String(value) === current);
  }
}

export function buildSelectOptions(filter, items) {
  if (filter.options) return filter.options;

  const unique = new Set();
  items.forEach((item) => {
    toValueList(getFilterValue(filter, item)).forEach((value) => unique.add(String(value)));
  });

  return [...unique]
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true, sensitivity: "base" }))
    .map((value) => ({ value, label: value }));
}
