const express = require("express");
const cors = require("cors");
const docenteRoutes = require("./routes/docenteRoutes");
const alumnoRoutes = require("./routes/alumnoRoutes");
const asignaturaRoutes = require("./routes/asignaturaRoutes");
const programaAcademicoRoutes = require("./routes/programaAcademicoRoutes");
const periodoAcademicoRoutes = require("./routes/periodoAcademicoRoutes");
const grupoRoutes = require("./routes/grupoRoutes");
const inscripcionRoutes = require("./routes/inscripcionRoutes");
const reporteRoutes = require("./routes/reporteRoutes");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const app = express();

app.disable("x-powered-by");

app.set("json replacer", (_key, value) =>
  typeof value === "bigint" ? value.toString() : value,
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Backend funcionando correctamente" });
});

app.use("/api/docentes", docenteRoutes);
app.use("/api/alumnos", alumnoRoutes);
app.use("/api/asignaturas", asignaturaRoutes);
app.use("/api/programas-academicos", programaAcademicoRoutes);
app.use("/api/periodos-academicos", periodoAcademicoRoutes);
app.use("/api/grupos", grupoRoutes);
app.use("/api/inscripciones", inscripcionRoutes);
app.use("/api/reportes", reporteRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
