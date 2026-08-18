export const ETAPAS = [
  'Precalificación del Lead',
  'Prospección',
  'Configuración',
  'Implementación',
  'Firma de Convenio',
  'Onboarding Proveedores',
] as const

export type Etapa = (typeof ETAPAS)[number]

export type EstadoHito = 'Pendiente' | 'En curso' | 'Aprobado'

export type Hito = {
  id: string
  nombre: string
  etapa: Etapa
  estado: EstadoHito
  responsable: string
  fechaActualizacion: string
}

export type BlockerTipo = 'Legal' | 'TI' | 'Riesgo' | 'Comercial' | 'Operativo'
export type BlockerEstado = 'Abierto' | 'Resuelto'

export type Blocker = {
  id: string
  tipo: BlockerTipo
  descripcion: string
  responsableResolucion: string
  fechaCompromiso: string // ISO date
  estado: BlockerEstado
}

export type EntradaBitacora = {
  id: string
  fecha: string
  autor: string
  tipo: 'Reunión' | 'Llamada' | 'Correo' | 'Minuta' | 'Acuerdo' | 'Cambio de etapa'
  detalle: string
}

export type ItemChecklist = {
  id: string
  nombre: string
  obligatorio: boolean
  estado: 'Pendiente' | 'Cargado' | 'Aprobado'
}

export type Contacto = {
  id: string
  nombre: string
  cargo: string
  area: 'Legal' | 'CFO' | 'Tesorería' | 'TI' | 'Comercial'
  email: string
  telefono: string
}

export type Convenio = {
  id: string
  nombreCliente: string
  rutCliente: string
  montoEstimado: number // CLP
  cantidadProveedores: number
  etapaActual: Etapa
  areaResponsable: string
  responsableNombre: string
  fechaIngresoEtapa: string // ISO
  ultimaActualizacion: string // ISO
  ultimoActualizadoPor: string
  hitos: Hito[]
  bitacora: EntradaBitacora[]
  blockers: Blocker[]
  checklist: ItemChecklist[]
  contactos: Contacto[]
}

export const SLA_POR_ETAPA: Record<Etapa, number> = {
  'Precalificación del Lead': 5,
  'Prospección': 10,
  'Configuración': 20,
  'Implementación': 45,
  'Firma de Convenio': 10,
  'Onboarding Proveedores': 30,
}

function daysBetween(isoDate: string, from = new Date()): number {
  const then = new Date(isoDate)
  const diff = from.getTime() - then.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function slaDeEtapa(etapa: Etapa): number {
  return SLA_POR_ETAPA[etapa]
}

export function diasEnEtapa(convenio: Convenio): number {
  return daysBetween(convenio.fechaIngresoEtapa)
}

export function estadoSLA(convenio: Convenio): 'ok' | 'riesgo' | 'excedido' {
  const dias = diasEnEtapa(convenio)
  const sla = slaDeEtapa(convenio.etapaActual)
  if (dias > sla) return 'excedido'
  if (dias > Math.floor(sla * 0.7)) return 'riesgo'
  return 'ok'
}

// --- Datos semilla ---
// Fechas elegidas para que, respecto a 2026-08-18, algunos convenios excedan SLA

const now = '2026-08-18T12:00:00.000Z'

export const CONVENIOS_SEED: Convenio[] = [
  {
    id: 'c-walmart',
    nombreCliente: 'Walmart Chile',
    rutCliente: '96.123.456-7',
    montoEstimado: 1540000000,
    cantidadProveedores: 120,
    etapaActual: 'Precalificación del Lead',
    areaResponsable: 'Comercial',
    responsableNombre: 'María Pérez',
    fechaIngresoEtapa: '2026-08-10T09:00:00.000Z',
    ultimaActualizacion: now,
    ultimoActualizadoPor: 'María Pérez',
    hitos: [],
    bitacora: [
      { id: 'b-w-1', fecha: '2026-08-10T09:15:00.000Z', autor: 'María Pérez', tipo: 'Reunión', detalle: 'Kickoff con contacto comercial.' },
      { id: 'b-w-2', fecha: '2026-08-12T11:00:00.000Z', autor: 'Analista Riesgo', tipo: 'Llamada', detalle: 'Consulta inicial sobre antecedentes financieros.' },
      { id: 'b-w-3', fecha: '2026-08-15T14:30:00.000Z', autor: 'María Pérez', tipo: 'Correo', detalle: 'Envío de formularios para precalificación.' },
    ],
    blockers: [],
    checklist: [
      { id: 'ch-w-1', nombre: 'Formulario precalificación', obligatorio: true, estado: 'Cargado' },
      { id: 'ch-w-2', nombre: 'Documento RUT', obligatorio: false, estado: 'Pendiente' },
    ],
    contactos: [
      { id: 'ct-w-1', nombre: 'Carlos Ruiz', cargo: 'Gerente Comercial', area: 'Comercial', email: 'c.ruiz@walmart.cl', telefono: '+56-9-1111-2222' },
    ],
  },

  {
    id: 'c-cencosud',
    nombreCliente: 'Cencosud',
    rutCliente: '96.234.567-8',
    montoEstimado: 860000000,
    cantidadProveedores: 80,
    etapaActual: 'Prospección',
    areaResponsable: 'Comercial',
    responsableNombre: 'Andrés Gómez',
    // Excedido: ingreso hace mucho más que SLA(10)
    fechaIngresoEtapa: '2026-05-01T10:00:00.000Z',
    ultimaActualizacion: '2026-07-20T09:00:00.000Z',
    ultimoActualizadoPor: 'Andrés Gómez',
    hitos: [],
    bitacora: [
      { id: 'b-cen-1', fecha: '2026-05-01T10:10:00.000Z', autor: 'Andrés Gómez', tipo: 'Reunión', detalle: 'Primer contacto comercial.' },
      { id: 'b-cen-2', fecha: '2026-06-10T12:00:00.000Z', autor: 'Analista Producto', tipo: 'Correo', detalle: 'Solicitud de datos adicionales.' },
      { id: 'b-cen-3', fecha: '2026-06-25T09:30:00.000Z', autor: 'Andrés Gómez', tipo: 'Llamada', detalle: 'Seguimiento sin respuesta.' },
      { id: 'b-cen-4', fecha: '2026-07-20T09:00:00.000Z', autor: 'Andrés Gómez', tipo: 'Minuta', detalle: 'Revisión interna de riesgo/comercial.' },
    ],
    blockers: [
      { id: 'bl-cen-1', tipo: 'Riesgo', descripcion: 'Falta de información financiera consolidada', responsableResolucion: 'Equipo Riesgo', fechaCompromiso: '2026-06-15T00:00:00.000Z', estado: 'Abierto' },
    ],
    checklist: [
      { id: 'ch-cen-1', nombre: 'Datos financieros 3 últimos años', obligatorio: true, estado: 'Pendiente' },
      { id: 'ch-cen-2', nombre: 'Contacto tesorería', obligatorio: true, estado: 'Cargado' },
    ],
    contactos: [
      { id: 'ct-cen-1', nombre: 'Laura Martínez', cargo: 'Tesorería', area: 'Tesorería', email: 'l.martinez@cencosud.cl', telefono: '+56-2-2222-3333' },
    ],
  },

  {
    id: 'c-watts',
    nombreCliente: "Watt's",
    rutCliente: '76.345.678-9',
    montoEstimado: 42000000,
    cantidadProveedores: 12,
    etapaActual: 'Configuración',
    areaResponsable: 'Producto',
    responsableNombre: 'Sofía Morales',
    fechaIngresoEtapa: '2026-07-20T08:00:00.000Z',
    ultimaActualizacion: now,
    ultimoActualizadoPor: 'Sofía Morales',
    hitos: [
      { id: 'h-wt-1', nombre: 'Aprobación de riesgo', etapa: 'Configuración', estado: 'Aprobado', responsable: 'Equipo Riesgo', fechaActualizacion: '2026-07-25T10:00:00.000Z' },
      { id: 'h-wt-2', nombre: 'Propuesta comercial al pagador', etapa: 'Configuración', estado: 'Aprobado', responsable: 'Comercial', fechaActualizacion: '2026-07-30T11:00:00.000Z' },
      { id: 'h-wt-3', nombre: 'NDA pagador', etapa: 'Configuración', estado: 'Pendiente', responsable: 'Legal', fechaActualizacion: '2026-08-02T09:00:00.000Z' },
    ],
    bitacora: [
      { id: 'b-wt-1', fecha: '2026-07-20T08:10:00.000Z', autor: 'Sofía Morales', tipo: 'Reunión', detalle: 'Revisión de alcance técnico.' },
      { id: 'b-wt-2', fecha: '2026-07-25T10:05:00.000Z', autor: 'Analista Riesgo', tipo: 'Correo', detalle: 'Riesgo aprobado con condiciones.' },
      { id: 'b-wt-3', fecha: '2026-07-30T11:15:00.000Z', autor: 'Comercial', tipo: 'Minuta', detalle: 'Propuesta enviada al pagador.' },
      { id: 'b-wt-4', fecha: '2026-08-02T09:10:00.000Z', autor: 'Legal', tipo: 'Llamada', detalle: 'Pendiente firma NDA.' },
    ],
    blockers: [],
    checklist: [
      { id: 'ch-wt-1', nombre: 'Propuesta firmada (borrador)', obligatorio: true, estado: 'Pendiente' },
      { id: 'ch-wt-2', nombre: 'NDA recibido', obligatorio: true, estado: 'Pendiente' },
    ],
    contactos: [
      { id: 'ct-wt-1', nombre: 'Javier Soto', cargo: 'Gerente TI', area: 'TI', email: 'j.soto@watts.cl', telefono: '+56-9-3333-4444' },
    ],
  },

  {
    id: 'c-falabella',
    nombreCliente: 'Falabella',
    rutCliente: '60.456.789-0',
    montoEstimado: 600000000,
    cantidadProveedores: 200,
    etapaActual: 'Configuración',
    areaResponsable: 'Comercial',
    responsableNombre: 'Diego Fernández',
    fechaIngresoEtapa: '2026-07-01T09:00:00.000Z',
    ultimaActualizacion: '2026-08-10T10:00:00.000Z',
    ultimoActualizadoPor: 'Diego Fernández',
    // Configuración con 2 hitos aprobados y 1 pendiente -> regla de bloqueo demostrable
    hitos: [
      { id: 'h-f-1', nombre: 'Aprobación de riesgo', etapa: 'Configuración', estado: 'Aprobado', responsable: 'Riesgo', fechaActualizacion: '2026-07-05T10:00:00.000Z' },
      { id: 'h-f-2', nombre: 'Propuesta comercial al pagador', etapa: 'Configuración', estado: 'Aprobado', responsable: 'Comercial', fechaActualizacion: '2026-07-12T11:00:00.000Z' },
      { id: 'h-f-3', nombre: 'NDA pagador', etapa: 'Configuración', estado: 'Pendiente', responsable: 'Legal', fechaActualizacion: '2026-07-20T09:00:00.000Z' },
    ],
    bitacora: [
      { id: 'b-f-1', fecha: '2026-07-01T09:10:00.000Z', autor: 'Diego Fernández', tipo: 'Reunión', detalle: 'Inicio de configuración con equipos internos.' },
      { id: 'b-f-2', fecha: '2026-07-05T10:20:00.000Z', autor: 'Riesgo', tipo: 'Correo', detalle: 'Condiciones aprobadas.' },
      { id: 'b-f-3', fecha: '2026-07-12T11:10:00.000Z', autor: 'Comercial', tipo: 'Minuta', detalle: 'Propuesta enviada.' },
      { id: 'b-f-4', fecha: '2026-07-20T09:05:00.000Z', autor: 'Legal', tipo: 'Llamada', detalle: 'Pendiente recepción NDA.' },
    ],
    blockers: [],
    checklist: [
      { id: 'ch-f-1', nombre: 'Formato de propuesta', obligatorio: true, estado: 'Aprobado' },
      { id: 'ch-f-2', nombre: 'NDA firmado', obligatorio: true, estado: 'Pendiente' },
    ],
    contactos: [
      { id: 'ct-f-1', nombre: 'Alejandra Ruiz', cargo: 'Head Comercial', area: 'Comercial', email: 'a.ruiz@falabella.cl', telefono: '+56-2-4444-5555' },
    ],
  },

  {
    id: 'c-ccu',
    nombreCliente: 'CCU',
    rutCliente: '80.123.456-1',
    montoEstimado: 300000000,
    cantidadProveedores: 45,
    etapaActual: 'Implementación',
    areaResponsable: 'TI',
    responsableNombre: 'Laura Vega',
    // Excedido: entrada antigua relative to SLA(45) -> make very old
    fechaIngresoEtapa: '2026-05-01T08:00:00.000Z',
    ultimaActualizacion: '2026-06-15T16:00:00.000Z',
    ultimoActualizadoPor: 'Laura Vega',
    hitos: [
      { id: 'h-ccu-1', nombre: 'Integración TI', etapa: 'Implementación', estado: 'En curso', responsable: 'Equipo TI', fechaActualizacion: '2026-06-01T09:00:00.000Z' },
      { id: 'h-ccu-2', nombre: 'Borrador del contrato', etapa: 'Implementación', estado: 'Pendiente', responsable: 'Legal', fechaActualizacion: '2026-06-10T10:00:00.000Z' },
    ],
    bitacora: [
      { id: 'b-ccu-1', fecha: '2026-05-01T08:10:00.000Z', autor: 'Laura Vega', tipo: 'Reunión', detalle: 'Planificación de integración.' },
      { id: 'b-ccu-2', fecha: '2026-05-20T09:00:00.000Z', autor: 'Equipo TI', tipo: 'Minuta', detalle: 'Arquitectura definida.' },
      { id: 'b-ccu-3', fecha: '2026-06-01T09:05:00.000Z', autor: 'Laura Vega', tipo: 'Correo', detalle: 'Solicitud de APIs al proveedor.' },
      { id: 'b-ccu-4', fecha: '2026-06-15T16:05:00.000Z', autor: 'Legal', tipo: 'Correo', detalle: 'Borrador enviado.' },
      { id: 'b-ccu-5', fecha: '2026-07-01T10:00:00.000Z', autor: 'Laura Vega', tipo: 'Llamada', detalle: 'Retrasos por proveedor.' },
    ],
    blockers: [
      { id: 'bl-ccu-1', tipo: 'TI', descripcion: 'API de proveedor no disponible', responsableResolucion: 'Proveedor X', fechaCompromiso: '2026-06-15T00:00:00.000Z', estado: 'Abierto' },
    ],
    checklist: [
      { id: 'ch-ccu-1', nombre: 'Pruebas integración', obligatorio: true, estado: 'Pendiente' },
      { id: 'ch-ccu-2', nombre: 'Plan de rollback', obligatorio: false, estado: 'Aprobado' },
    ],
    contactos: [
      { id: 'ct-ccu-1', nombre: 'Pablo Torres', cargo: 'Jefe TI', area: 'TI', email: 'p.torres@ccu.cl', telefono: '+56-9-5555-6666' },
    ],
  },

  {
    id: 'c-sodimac',
    nombreCliente: 'Sodimac',
    rutCliente: '60.987.654-3',
    montoEstimado: 980000000,
    cantidadProveedores: 150,
    etapaActual: 'Firma de Convenio',
    areaResponsable: 'Legal',
    responsableNombre: 'Ignacio Ruiz',
    fechaIngresoEtapa: '2026-07-25T09:00:00.000Z',
    ultimaActualizacion: now,
    ultimoActualizadoPor: 'Ignacio Ruiz',
    hitos: [],
    bitacora: [
      { id: 'b-so-1', fecha: '2026-07-25T09:10:00.000Z', autor: 'Ignacio Ruiz', tipo: 'Minuta', detalle: 'Revisión final de cláusulas.' },
      { id: 'b-so-2', fecha: '2026-07-28T10:00:00.000Z', autor: 'Legal', tipo: 'Correo', detalle: 'Comentarios enviados a comercial.' },
      { id: 'b-so-3', fecha: '2026-08-05T15:00:00.000Z', autor: 'Comercial', tipo: 'Reunión', detalle: 'Coordinación de firma.' },
    ],
    blockers: [],
    checklist: [
      { id: 'ch-so-1', nombre: 'Contrato final', obligatorio: true, estado: 'Cargado' },
      { id: 'ch-so-2', nombre: 'Autorización CFO', obligatorio: true, estado: 'Pendiente' },
    ],
    contactos: [
      { id: 'ct-so-1', nombre: 'Marcela Díaz', cargo: 'Legal Senior', area: 'Legal', email: 'm.diaz@sodimac.cl', telefono: '+56-2-6666-7777' },
    ],
  },

  {
    id: 'c-copec',
    nombreCliente: 'Copec',
    rutCliente: '78.123.321-4',
    montoEstimado: 450000000,
    cantidadProveedores: 60,
    etapaActual: 'Precalificación del Lead',
    areaResponsable: 'Comercial',
    responsableNombre: 'Rodrigo Silva',
    // Excedido intentionally
    fechaIngresoEtapa: '2026-04-15T08:00:00.000Z',
    ultimaActualizacion: '2026-05-10T09:00:00.000Z',
    ultimoActualizadoPor: 'Rodrigo Silva',
    hitos: [],
    bitacora: [
      { id: 'b-co-1', fecha: '2026-04-15T08:10:00.000Z', autor: 'Rodrigo Silva', tipo: 'Reunión', detalle: 'Contacto inicial con compras.' },
      { id: 'b-co-2', fecha: '2026-04-20T09:00:00.000Z', autor: 'Comercial', tipo: 'Correo', detalle: 'Envío de ficha.' },
      { id: 'b-co-3', fecha: '2026-05-01T11:00:00.000Z', autor: 'Rodrigo Silva', tipo: 'Llamada', detalle: 'Sin respuesta del cliente.' },
    ],
    blockers: [],
    checklist: [
      { id: 'ch-co-1', nombre: 'Ficha completa', obligatorio: true, estado: 'Pendiente' },
    ],
    contactos: [
      { id: 'ct-co-1', nombre: 'Fernando López', cargo: 'Compras', area: 'Comercial', email: 'f.lopez@copec.cl', telefono: '+56-9-7777-8888' },
    ],
  },

  {
    id: 'c-colbun',
    nombreCliente: 'Colbún',
    rutCliente: '91.234.567-2',
    montoEstimado: 220000000,
    cantidadProveedores: 25,
    etapaActual: 'Onboarding Proveedores',
    areaResponsable: 'Operaciones',
    responsableNombre: 'Patricia Ortega',
    fechaIngresoEtapa: '2026-07-05T09:00:00.000Z',
    ultimaActualizacion: now,
    ultimoActualizadoPor: 'Patricia Ortega',
    hitos: [],
    bitacora: [
      { id: 'b-co2-1', fecha: '2026-07-05T09:10:00.000Z', autor: 'Patricia Ortega', tipo: 'Reunión', detalle: 'Inicio onboarding proveedores.' },
      { id: 'b-co2-2', fecha: '2026-07-12T10:00:00.000Z', autor: 'Operaciones', tipo: 'Minuta', detalle: 'Checklist enviado a proveedores.' },
      { id: 'b-co2-3', fecha: '2026-07-20T11:15:00.000Z', autor: 'Patricia Ortega', tipo: 'Llamada', detalle: 'Confirmación de documentación.' },
      { id: 'b-co2-4', fecha: '2026-08-01T09:00:00.000Z', autor: 'Operaciones', tipo: 'Correo', detalle: 'Recordatorio de entregables.' },
    ],
    blockers: [
      // Blocker abierto y vencido
      { id: 'bl-col-1', tipo: 'Comercial', descripcion: 'Proveedor principal no responde contrato', responsableResolucion: 'Proveedor Y', fechaCompromiso: '2026-07-20T00:00:00.000Z', estado: 'Abierto' },
    ],
    checklist: [
      { id: 'ch-col-1', nombre: 'Documentos de proveedor', obligatorio: true, estado: 'Cargado' },
      { id: 'ch-col-2', nombre: 'Validación bancaria', obligatorio: true, estado: 'Pendiente' },
    ],
    contactos: [
      { id: 'ct-col-1', nombre: 'Marcos Pérez', cargo: 'Coordinador Proveedores', area: 'Operativo', email: 'm.perez@colbun.cl', telefono: '+56-9-9999-0000' },
    ],
  },

  {
    id: 'c-entel',
    nombreCliente: 'Entel',
    rutCliente: '99.111.222-3',
    montoEstimado: 1250000000,
    cantidadProveedores: 300,
    etapaActual: 'Prospección',
    areaResponsable: 'Comercial',
    responsableNombre: 'Natalia Fuentes',
    fechaIngresoEtapa: '2026-08-01T09:00:00.000Z',
    ultimaActualizacion: now,
    ultimoActualizadoPor: 'Natalia Fuentes',
    hitos: [],
    bitacora: [
      { id: 'b-en-1', fecha: '2026-08-01T09:10:00.000Z', autor: 'Natalia Fuentes', tipo: 'Reunión', detalle: 'Presentación comercial.' },
      { id: 'b-en-2', fecha: '2026-08-05T11:00:00.000Z', autor: 'Comercial', tipo: 'Correo', detalle: 'Envío de propuesta preliminar.' },
      { id: 'b-en-3', fecha: '2026-08-10T12:00:00.000Z', autor: 'Natalia Fuentes', tipo: 'Llamada', detalle: 'Coordinación con tesorería.' },
    ],
    blockers: [],
    checklist: [
      { id: 'ch-en-1', nombre: 'Análisis preliminar', obligatorio: true, estado: 'Aprobado' },
    ],
    contactos: [
      { id: 'ct-en-1', nombre: 'Rocío Herrera', cargo: 'Head Tesorería', area: 'Tesorería', email: 'r.herrera@entel.cl', telefono: '+56-2-1010-2020' },
    ],
  },
]

export default CONVENIOS_SEED
