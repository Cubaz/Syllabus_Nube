import EntityPage from "../components/EntityPage";

const fields = [
  { name: "num_cuenta", label: "Número de cuenta", required: true },
  { name: "nombre", label: "Nombre", required: true },
  { name: "apellidos", label: "Apellidos", required: true },
  { name: "correo_institucional", label: "Correo institucional", nullable: true },
  { name: "telefono", label: "Teléfono", nullable: true },
];

const columns = [
  { key: "num_cuenta", label: "Cuenta" },
  { key: "nombre", label: "Nombre" },
  { key: "apellidos", label: "Apellidos" },
  { key: "correo_institucional", label: "Correo institucional" },
  { key: "telefono", label: "Teléfono" },
];

function AlumnosPage() {
  return (
    <EntityPage
      title="Alumnos"
      endpoint="/alumnos"
      description="Control de alumnos, datos académicos y contacto institucional."
      fields={fields}
      columns={columns}
      emptyMessage="Aún no hay alumnos registrados."
      idKey="num_cuenta"
    />
  );
}

export default AlumnosPage;
