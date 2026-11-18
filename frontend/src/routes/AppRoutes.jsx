import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import DocentesPage from "../pages/DocentesPage";
import AlumnosPage from "../pages/AlumnosPage";
import AsignaturasPage from "../pages/AsignaturasPage";
import ProgramasPage from "../pages/ProgramasPage";
import PeriodosPage from "../pages/PeriodosPage";
import GruposPage from "../pages/GruposPage";
import InscripcionesPage from "../pages/InscripcionesPage";
import CalificacionesPage from "../pages/CalificacionesPage";
import ReportesPage from "../pages/ReportesPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/docentes" element={<DocentesPage />} />
      <Route path="/alumnos" element={<AlumnosPage />} />
      <Route path="/asignaturas" element={<AsignaturasPage />} />
      <Route path="/programas" element={<ProgramasPage />} />
      <Route path="/periodos" element={<PeriodosPage />} />
      <Route path="/grupos" element={<GruposPage />} />
      <Route path="/inscripciones" element={<InscripcionesPage />} />
      <Route path="/calificaciones" element={<CalificacionesPage />} />
      <Route path="/reportes" element={<ReportesPage />} />
    </Routes>
  );
}

export default AppRoutes;
