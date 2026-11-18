import EntityPage from "../components/EntityPage";
import { personaFields } from "../fields/personaFields";
import { fullName, yesNo } from "../utils/format";

const fields = [
  ...personaFields,
  { name: "sindicalizado", label: "Docente sindicalizado", type: "checkbox" },
];

const columns = [
  { key: "num_cuenta", label: "Número de cuenta", nowrap: true, filter: "text" },
  { key: "nombre", label: "Nombre", filter: "text" },
  { key: "apellidos", label: "Apellidos", filter: "text" },
  { key: "direccion", label: "Dirección", filter: "text" },
  {
    key: "sindicalizado",
    label: "Sindicalizado",
    value: (item) => yesNo(item.sindicalizado),
    filter: "select",
    filterOptions: [
      { value: "Sí", label: "Sí" },
      { value: "No", label: "No" },
    ],
  },
  { key: "correo_institucional", label: "Correo institucional", filter: "text" },
  { key: "correo_personal", label: "Correo personal", filter: "text" },
  { key: "telefono", label: "Teléfono", nowrap: true, filter: "text" },
  { key: "nss", label: "NSS", nowrap: true, filter: "text" },
  { key: "curp", label: "CURP", nowrap: true, filter: "text" },
];

function DocentesPage() {
  return (
    <EntityPage
      title="Docentes"
      endpoint="/docentes"
      description="Administración de docentes, datos personales y contacto institucional."
      fields={fields}
      columns={columns}
      emptyMessage="Aún no hay docentes registrados."
      idKey="num_cuenta"
      entity="docente"
      describeItem={fullName}
    />
  );
}

export default DocentesPage;
