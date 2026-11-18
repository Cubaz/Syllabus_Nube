import EntityPage from "../components/EntityPage";
import { personaFields } from "../fields/personaFields";
import { fullName } from "../utils/format";

const fields = personaFields;

const columns = [
  { key: "num_cuenta", label: "Número de cuenta", nowrap: true, filter: "text" },
  { key: "nombre", label: "Nombre", filter: "text" },
  { key: "apellidos", label: "Apellidos", filter: "text" },
  { key: "direccion", label: "Dirección", filter: "text" },
  { key: "correo_institucional", label: "Correo institucional", filter: "text" },
  { key: "correo_personal", label: "Correo personal", filter: "text" },
  { key: "telefono", label: "Teléfono", nowrap: true, filter: "text" },
  { key: "nss", label: "NSS", nowrap: true, filter: "text" },
  { key: "curp", label: "CURP", nowrap: true, filter: "text" },
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
      entity="alumno"
      describeItem={fullName}
    />
  );
}

export default AlumnosPage;
