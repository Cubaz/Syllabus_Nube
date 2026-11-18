const AppError = require("../utils/AppError");
const translatePrismaError = require("../utils/prismaError");

const notFoundHandler = (req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404));
};

const normalizeError = (err) => {
  if (err instanceof AppError) return err;

  const prismaError = translatePrismaError(err);
  if (prismaError) return prismaError;

  if (err?.type === "entity.parse.failed") {
    return new AppError("El cuerpo de la petición no es un JSON válido", 400);
  }

  const statusCode = err?.statusCode || err?.status;
  if (statusCode >= 400 && statusCode < 500) {
    return new AppError(err.message, statusCode);
  }

  return new AppError("Error interno del servidor", 500);
};

const errorHandler = (err, req, res, _next) => {
  const error = normalizeError(err);

  if (error.statusCode >= 500) {
    console.error("[ERROR]", req.method, req.originalUrl, err);
  } else if (process.env.NODE_ENV !== "production") {
    console.warn("[WARN]", req.method, req.originalUrl, error.statusCode, error.message);
  }

  res.status(error.statusCode).json({
    ok: false,
    message: error.message,
    error: error.statusCode >= 500 ? "InternalServerError" : "ClientError",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
