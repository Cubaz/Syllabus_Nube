const AppError = require("./AppError");
const { hoyIso, validarRegistro } = require("../../../shared/validators.mjs");

const isFutureDate = (date) => date.toISOString().slice(0, 10) > hoyIso();

const transforms = {
  upper: (value) => value.toUpperCase(),
  lower: (value) => value.toLowerCase(),
};

const isBlank = (value) => value === undefined || value === null || value === "";

const parseId = (value, label = "ID") => {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) {
    throw new AppError(`El ${label} no es válido`, 400);
  }
  return BigInt(text);
};

const converters = {
  string: (value, label) => {
    if (typeof value !== "string" && typeof value !== "number") {
      throw new AppError(`El campo ${label} debe ser texto`, 400);
    }
    return String(value).trim();
  },
  int: (value, label) => {
    const number = Number(value);
    if (!Number.isInteger(number)) {
      throw new AppError(`El campo ${label} debe ser un número entero`, 400);
    }
    return number;
  },
  decimal: (value, label) => {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      throw new AppError(`El campo ${label} debe ser un número`, 400);
    }
    return number;
  },
  boolean: (value, label) => {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "false") return value === "true";
    throw new AppError(`El campo ${label} debe ser verdadero o falso`, 400);
  },
  date: (value, label) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new AppError(`El campo ${label} no es una fecha válida`, 400);
    }
    return date;
  },
  id: (value, label) => parseId(value, `campo ${label}`),
};

/**
 * Selecciona solo los campos definidos en el esquema, los convierte a su tipo
 * y valida obligatorios y límites. Con `partial` (actualizaciones) los campos
 * ausentes se ignoran, pero los presentes se validan igual.
 */
const buildData = (payload, schema, { partial = false } = {}) => {
  const source = payload && typeof payload === "object" ? payload : {};
  const data = {};

  for (const [field, rules] of Object.entries(schema)) {
    const { label = field, type = "string", required = false, min, max, transform } = rules;
    let value = source[field];

    if (value === undefined && partial) continue;
    if (typeof value === "string") {
      value = value.trim().replace(/\s+/g, " ");
      if (transform) value = transforms[transform](value);
    }

    if (isBlank(value)) {
      if (required) throw new AppError(`El campo ${label} es obligatorio`, 400);
      if (value !== undefined) data[field] = null;
      continue;
    }

    const converted = converters[type](value, label);

    if (typeof converted === "number") {
      if (min !== undefined && converted < min) {
        throw new AppError(`El campo ${label} debe ser mayor o igual a ${min}`, 400);
      }
      if (max !== undefined && converted > max) {
        throw new AppError(`El campo ${label} debe ser menor o igual a ${max}`, 400);
      }
    }

    data[field] = converted;
  }

  return data;
};

const omit = (schema, ...fields) =>
  Object.fromEntries(Object.entries(schema).filter(([field]) => !fields.includes(field)));

/**
 * Aplica las reglas de formato compartidas con el frontend (shared/validators.mjs).
 * `record` debe ser el registro completo resultante, para validar reglas que
 * dependen de otro campo (por ejemplo, el correo institucional y el número de cuenta).
 */
const assertRules = (entity, record) => {
  const errors = Object.values(validarRegistro(entity, record));
  if (errors.length > 0) {
    throw new AppError(errors.join(". "), 400);
  }
};

module.exports = {
  assertRules,
  buildData,
  isFutureDate,
  omit,
  parseId,
};
