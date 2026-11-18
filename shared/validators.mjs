/**
 * Reglas de validación compartidas por el frontend (Vite) y el backend (Node).
 * Cada validador recibe un valor no vacío y devuelve un mensaje de error o null.
 */

const LETRAS = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ";
const NOMBRE_RE = new RegExp(`^[${LETRAS}]+(?:[ '-][${LETRAS}]+)*$`);
const TEXTO_RE = /^[\p{L}\p{N}\s.,;:()¿?¡!"'#°º%&/-]+$/u;
const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CORREO_UAEH_RE = /^([a-z]{2})(\d{6})@uaeh\.edu\.mx$/;

// Concordancia: "El nombre debe…" / "Los apellidos deben…".
const debe = (etiqueta) => (/^(Los|Las) /.test(etiqueta) ? "deben" : "debe");
const puede = (etiqueta) => (/^(Los|Las) /.test(etiqueta) ? "pueden" : "puede");

// ---------------------------------------------------------------------------
// CURP: 4 letras del nombre, fecha AAMMDD, sexo, entidad, 3 consonantes
// internas, homoclave (dígito si nació antes de 2000, letra a partir de 2000)
// y dígito verificador.
// ---------------------------------------------------------------------------

export const ENTIDADES_CURP = [
  "AS", "BC", "BS", "CC", "CL", "CM", "CS", "CH", "DF", "DG", "GT", "GR", "HG", "JC", "MC", "MN",
  "MS", "NT", "NL", "OC", "PL", "QT", "QR", "SP", "SL", "SR", "TC", "TS", "TL", "VZ", "YN", "ZS",
  "NE",
];

// Combinaciones que RENAPO sustituye (la segunda letra se cambia por X).
const PALABRAS_INCONVENIENTES = new Set(`
  BACA BAKA BUEI BUEY CACA CACO CAGA CAGO CAKA CAKO COGE COGI COJA COJE COJI COJO COLA CULO
  FALO FETO GETA GUEI GUEY JETA JOTO KACA KACO KAGA KAGO KAKA KAKO KOGE KOGI KOJA KOJE KOJI
  KOJO KOLA KULO LILO LOCA LOCO LOKA LOKO MAME MAMO MEAR MEAS MEON MIAR MION MOCO MOKO MULA
  MULO NACA NACO PEDA PEDO PENE PIPI PITO POPO PUTA PUTO QULO RATA ROBA ROBE ROBO RUIN SENO
  TETA VACA VAGA VAGO VAKA VUEI VUEY WUEI WUEY
`.trim().split(/\s+/));

const CURP_RE = /^[A-Z][AEIOUX][A-Z]{2}(\d{2})(\d{2})(\d{2})[HMX]([A-Z]{2})[B-DF-HJ-NP-TV-Z]{3}([A-Z\d])(\d)$/;
const ALFABETO_CURP = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ";

export function digitoVerificadorCurp(curp17) {
  const suma = [...curp17].reduce(
    (total, caracter, indice) => total + ALFABETO_CURP.indexOf(caracter) * (18 - indice),
    0,
  );
  return String((10 - (suma % 10)) % 10);
}

const esFechaValida = (anio, mes, dia) => {
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return fecha.getUTCFullYear() === anio && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia;
};

export function validarCurp(valor) {
  const curp = String(valor).toUpperCase();
  if (curp.length !== 18) return "La CURP debe tener exactamente 18 caracteres";

  const partes = CURP_RE.exec(curp);
  if (!partes) {
    return "La CURP no tiene un formato válido (4 letras, 6 dígitos de fecha, sexo H/M/X, entidad, 3 consonantes, homoclave y dígito)";
  }

  const [, aa, mm, dd, entidad, homoclave, digito] = partes;
  if (PALABRAS_INCONVENIENTES.has(curp.slice(0, 4))) {
    return "Las 4 primeras letras de la CURP forman una palabra no permitida";
  }

  const siglo = /\d/.test(homoclave) ? 1900 : 2000;
  const anio = siglo + Number(aa);
  if (!esFechaValida(anio, Number(mm), Number(dd))) {
    return "La fecha de nacimiento de la CURP no es válida";
  }
  if (Date.UTC(anio, Number(mm) - 1, Number(dd)) > Date.now()) {
    return "La fecha de nacimiento de la CURP no puede ser futura";
  }

  if (!ENTIDADES_CURP.includes(entidad)) return "La clave de entidad federativa de la CURP no es válida";
  if (digitoVerificadorCurp(curp.slice(0, 17)) !== digito) return "El dígito verificador de la CURP no es válido";
  return null;
}

// Partículas que la CURP omite en nombres y apellidos compuestos ("De la Cruz" → C).
const PARTICULAS = new Set([
  "DA", "DAS", "DE", "DEL", "DER", "DI", "DIE", "DD", "EL", "LA", "LAS", "LE", "LES", "LOS",
  "MAC", "MC", "VAN", "VON", "Y",
]);

const palabrasCurp = (texto) =>
  String(texto ?? "")
    .normalize("NFD")
    .replace(/N\u0303/g, "X")
    .replace(/n\u0303/g, "x")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z ]/g, " ")
    .split(/\s+/)
    .filter((palabra) => palabra && !PARTICULAS.has(palabra));

export const anioNacimientoCurp = (curp) => {
  const texto = String(curp).toUpperCase();
  return (/\d/.test(texto[16]) ? 1900 : 2000) + Number(texto.slice(4, 6));
};

/**
 * Comprueba que las iniciales de la CURP correspondan a la persona:
 * posición 1 = inicial del primer apellido, posición 3 = inicial del segundo
 * apellido (X si no tiene) y posición 4 = inicial de alguno de sus nombres
 * (RENAPO usa el segundo nombre cuando el primero es María o José).
 */
export function validarCurpConPersona(curp, nombre, apellidos) {
  const [paterno, materno] = palabrasCurp(apellidos);
  const nombres = palabrasCurp(nombre);
  if (!paterno || nombres.length === 0) return null;

  const clave = String(curp).toUpperCase();
  const coincide =
    clave[0] === paterno[0] &&
    clave[2] === (materno ? materno[0] : "X") &&
    nombres.some((n) => n[0] === clave[3]);

  return coincide ? null : "La CURP no corresponde al nombre y apellidos registrados";
}

// ---------------------------------------------------------------------------
// NSS (IMSS): 11 dígitos = subdelegación (2) + año de afiliación (2) +
// año de nacimiento (2) + consecutivo (4) + dígito verificador (Luhn).
// ---------------------------------------------------------------------------

export function digitoVerificadorNss(nss10) {
  const suma = [...nss10].reverse().reduce((total, caracter, indice) => {
    let digito = Number(caracter);
    if (indice % 2 === 0) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    return total + digito;
  }, 0);
  return String((10 - (suma % 10)) % 10);
}

export function validarNss(valor) {
  const nss = String(valor);
  if (!/^\d{11}$/.test(nss)) return "El NSS debe tener exactamente 11 dígitos";
  if (digitoVerificadorNss(nss.slice(0, 10)) !== nss[10]) return "El dígito verificador del NSS no es válido";
  return null;
}

/**
 * Con una CURP válida se conoce el año de nacimiento completo, así que el NSS
 * debe tener ese mismo año (posiciones 5-6) y un año de afiliación (3-4) que
 * no sea anterior al nacimiento ni posterior al año actual.
 */
export function validarNssConCurp(nss, curp) {
  if (!curp || validarCurp(curp)) return null;

  const nacimiento = anioNacimientoCurp(curp);
  const nacimientoNss = String(nss).slice(4, 6);
  if (nacimientoNss !== String(nacimiento).slice(2)) {
    return `El año de nacimiento del NSS (${nacimientoNss}) no coincide con el de la CURP (${String(nacimiento).slice(2)})`;
  }

  const afiliacion = Number(String(nss).slice(2, 4));
  const actual = new Date().getFullYear();
  const posible = [1900 + afiliacion, 2000 + afiliacion].some((anio) => anio >= nacimiento && anio <= actual);
  return posible ? null : "El año de afiliación del NSS no puede ser anterior al nacimiento ni futuro";
}

// ---------------------------------------------------------------------------
// Datos de personas
// ---------------------------------------------------------------------------

export function validarNumeroCuenta(valor) {
  return /^\d{6}$/.test(String(valor)) ? null : "El número de cuenta debe tener exactamente 6 dígitos";
}

// En México los números tienen 10 dígitos y la lada nunca empieza con 0 ni con 1.
export function validarTelefono(valor) {
  const telefono = String(valor);
  if (!/^\d{10}$/.test(telefono)) return "El teléfono debe tener exactamente 10 dígitos";
  if (!/^[2-9]/.test(telefono)) return "El teléfono no puede empezar con 0 ni con 1";
  return null;
}

export function validarCorreoInstitucional(valor, numeroCuenta) {
  const partes = CORREO_UAEH_RE.exec(String(valor).toLowerCase());
  if (!partes) {
    return "El correo institucional debe ser 2 letras + número de cuenta + @uaeh.edu.mx (ej. ab123456@uaeh.edu.mx)";
  }
  if (numeroCuenta && partes[2] !== String(numeroCuenta)) {
    return "El número del correo institucional debe coincidir con el número de cuenta";
  }
  return null;
}

export function validarCorreo(valor, etiqueta = "El correo") {
  const correo = String(valor);
  if (correo.length > 150) return `${etiqueta} no puede tener más de 150 caracteres`;
  return CORREO_RE.test(correo) ? null : `${etiqueta} no tiene un formato válido`;
}

export function validarNombrePersona(valor, etiqueta, maximo) {
  const texto = String(valor);
  if (texto.length < 2) return `${etiqueta} ${debe(etiqueta)} tener al menos 2 caracteres`;
  if (texto.length > maximo) return `${etiqueta} no ${puede(etiqueta)} tener más de ${maximo} caracteres`;
  return NOMBRE_RE.test(texto)
    ? null
    : `${etiqueta} solo ${puede(etiqueta)} contener letras, espacios, apóstrofos y guiones`;
}

export function validarTexto(valor, etiqueta, { minimo = 1, maximo }) {
  const texto = String(valor);
  if (texto.length < minimo) return `${etiqueta} ${debe(etiqueta)} tener al menos ${minimo} caracteres`;
  if (texto.length > maximo) return `${etiqueta} no ${puede(etiqueta)} tener más de ${maximo} caracteres`;
  return TEXTO_RE.test(texto) ? null : `${etiqueta} contiene caracteres no permitidos`;
}

// ---------------------------------------------------------------------------
// Datos académicos
// ---------------------------------------------------------------------------

export function validarCodigoAsignatura(valor) {
  return /^[A-Z]{3}-\d{3}$/.test(String(valor))
    ? null
    : "El código debe tener 3 letras mayúsculas, guion y 3 dígitos (ej. MAT-101)";
}

export function validarClaveGrupo(valor, codigoAsignatura) {
  const clave = String(valor);
  if (!/^[A-Z]{3}-\d{3}-[A-Z]$/.test(clave)) {
    return "La clave del grupo debe ser el código de la asignatura, guion y una letra (ej. MAT-101-A)";
  }
  if (codigoAsignatura && !clave.startsWith(`${codigoAsignatura}-`)) {
    return `La clave del grupo debe iniciar con el código de la asignatura (${codigoAsignatura})`;
  }
  return null;
}

export function validarEntero(valor, etiqueta, minimo, maximo) {
  const numero = Number(valor);
  if (!Number.isInteger(numero)) return `${etiqueta} ${debe(etiqueta)} ser un número entero`;
  if (numero < minimo || numero > maximo) return `${etiqueta} ${debe(etiqueta)} estar entre ${minimo} y ${maximo}`;
  return null;
}

export function validarCalificacion(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return "La calificación debe ser un número";
  if (numero < 0 || numero > 10) return "La calificación debe estar entre 0 y 10";
  if (!/^\d+(\.\d{1,2})?$/.test(String(valor))) return "La calificación admite como máximo 2 decimales";
  return null;
}

const aFechaIso = (valor) =>
  valor instanceof Date ? valor.toISOString().slice(0, 10) : String(valor).slice(0, 10);

// Fecha local de hoy en formato AAAA-MM-DD.
export const hoyIso = () => {
  const hoy = new Date();
  const dosDigitos = (n) => String(n).padStart(2, "0");
  return `${hoy.getFullYear()}-${dosDigitos(hoy.getMonth() + 1)}-${dosDigitos(hoy.getDate())}`;
};

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fechaLegible = (iso) => `${Number(iso.slice(8, 10))} ${MESES[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;

/**
 * La calificación final solo puede capturarse a partir de la fecha de inicio
 * del periodo al que pertenece el grupo.
 */
export function validarCalificacionEnPeriodo(fechaInicioPeriodo, hoy = hoyIso()) {
  if (!fechaInicioPeriodo) return null;
  const inicio = aFechaIso(fechaInicioPeriodo);
  return hoy < inicio
    ? `No se puede capturar la calificación antes de que inicie el periodo (${fechaLegible(inicio)})`
    : null;
}

const validarFechaPeriodo = (etiqueta) => (valor, registro) => {
  const fecha = aFechaIso(valor);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return `${etiqueta} no es una fecha válida`;
  if (registro.anio && Number(fecha.slice(0, 4)) !== Number(registro.anio)) {
    return `${etiqueta} debe pertenecer al año del periodo (${registro.anio})`;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Reglas por entidad. Cada regla recibe (valor, registro completo).
// ---------------------------------------------------------------------------

const reglasPersona = {
  num_cuenta: validarNumeroCuenta,
  nombre: (v) => validarNombrePersona(v, "El nombre", 100),
  apellidos: (v) => validarNombrePersona(v, "Los apellidos", 150),
  direccion: (v) => validarTexto(v, "La dirección", { minimo: 5, maximo: 250 }),
  telefono: validarTelefono,
  correo_institucional: (v, r) => validarCorreoInstitucional(v, r.num_cuenta),
  correo_personal: (v) => {
    const error = validarCorreo(v, "El correo personal");
    if (error) return error;
    if (/@uaeh\.edu\.mx$/i.test(String(v))) {
      return "El correo personal no puede ser de @uaeh.edu.mx (para eso está el institucional)";
    }
    return null;
  },
  nss: (v, r) => validarNss(v) || validarNssConCurp(v, r.curp),
  curp: (v, r) => validarCurp(v) || validarCurpConPersona(v, r.nombre, r.apellidos),
};

export const reglas = {
  docente: reglasPersona,
  alumno: reglasPersona,
  asignatura: {
    codigo: validarCodigoAsignatura,
    nombre: (v) => validarTexto(v, "El nombre", { minimo: 3, maximo: 150 }),
    creditos: (v) => validarEntero(v, "Los créditos", 1, 30),
    horas_semanales: (v) => validarEntero(v, "Las horas semanales", 1, 40),
  },
  programa_academico: {
    nombre: (v) => validarTexto(v, "El nombre", { minimo: 3, maximo: 150 }),
    descripcion: (v) => validarTexto(v, "La descripción", { maximo: 500 }),
  },
  periodo_academico: {
    anio: (v) => validarEntero(v, "El año", 2000, 2100),
    semestre: (v) => validarEntero(v, "El semestre", 1, 2),
    fecha_inicio: (v, r) => {
      const error = validarFechaPeriodo("La fecha de inicio")(v, r);
      if (error) return error;
      // Semestre 1: enero–junio; semestre 2: julio–diciembre.
      const mes = Number(aFechaIso(v).slice(5, 7));
      if (Number(r.semestre) === 1 && mes > 6) return "En el semestre 1 la fecha de inicio debe estar entre enero y junio";
      if (Number(r.semestre) === 2 && mes < 7) return "En el semestre 2 la fecha de inicio debe estar entre julio y diciembre";
      return null;
    },
    fecha_fin: (v, r) => {
      const error = validarFechaPeriodo("La fecha de fin")(v, r);
      if (error) return error;
      if (r.fecha_inicio && aFechaIso(v) <= aFechaIso(r.fecha_inicio)) {
        return "La fecha de fin debe ser posterior a la fecha de inicio";
      }
      return null;
    },
  },
  grupo: {
    clave_grupo: (v, r) => validarClaveGrupo(v, r.codigo_asignatura),
  },
  inscripcion: {
    // El registro puede traer el grupo con su periodo (grupo.periodo_academico).
    calificacion_final: (v, r) =>
      validarCalificacion(v) || validarCalificacionEnPeriodo(r.grupo?.periodo_academico?.fecha_inicio),
  },
};

const estaVacio = (valor) => valor === undefined || valor === null || valor === "";

/**
 * Valida los campos indicados de un registro y devuelve { campo: mensaje }.
 * Los campos vacíos se omiten: la obligatoriedad se revisa aparte.
 */
export function validarRegistro(entidad, registro, campos = Object.keys(registro)) {
  const reglasEntidad = reglas[entidad] || {};
  const errores = {};

  for (const campo of campos) {
    const regla = reglasEntidad[campo];
    const valor = registro[campo];
    if (!regla || estaVacio(valor)) continue;

    const error = regla(valor, registro);
    if (error) errores[campo] = error;
  }

  return errores;
}
