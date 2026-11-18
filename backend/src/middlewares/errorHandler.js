const AppError = require("../utils/AppError");

const notFoundHandler = (req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", {
      path: req.originalUrl,
      method: req.method,
      statusCode,
      message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    ok: false,
    message,
    error: statusCode >= 500 ? "InternalServerError" : "ClientError",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
