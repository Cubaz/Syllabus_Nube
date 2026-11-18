export const menuItems = [
  { label: "Dashboard", to: "/" },
  { label: "Docentes", to: "/docentes" },
  { label: "Alumnos", to: "/alumnos" },
  { label: "Asignaturas", to: "/asignaturas" },
  { label: "Programas", to: "/programas" },
  { label: "Periodos", to: "/periodos" },
  { label: "Grupos", to: "/grupos" },
  { label: "Inscripciones", to: "/inscripciones" },
  { label: "Calificaciones", to: "/calificaciones" },
  { label: "Reportes", to: "/reportes" },
];

export function getSectionLabel(pathname) {
  const match = menuItems.find((item) => item.to === pathname);
  return match ? match.label : "Página no encontrada";
}
