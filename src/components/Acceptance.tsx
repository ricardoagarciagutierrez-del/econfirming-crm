import React from 'react'
import type { Convenio } from '../data/model'

const CRITERIOS: { code: string; title: string; demo: string }[] = [
  { code: 'E1.1', title: 'Las 6 etapas estandarizadas', demo: 'Ver columnas del Kanban y nombres de etapa' },
  { code: 'E1.3', title: 'Bloqueo hasta aprobar 3 hitos de Configuración', demo: 'Abrir convenio en Configuración con hitos incompletos' },
  { code: 'E1.4', title: 'Bloqueo hasta aprobar 2 hitos de Implementación', demo: 'Abrir convenio en Implementación con hitos incompletos' },
  { code: 'E1.2.1', title: 'Conteo de días en etapa contra el SLA', demo: 'Abrir convenio con SLA excedido y ver semáforo' },
  { code: 'E1.2.2', title: 'Etiquetado y alerta visual de cuello de botella', demo: 'Abrir convenio con blocker vencido' },
  { code: 'E1.3.1', title: 'Responsable nominado obligatorio por etapa', demo: 'Abrir cualquier convenio y verificar responsable' },
  { code: 'E2.1.2', title: 'Bitácora cronológica inalterable', demo: 'Abrir convenio y ver pestaña Bitácora' },
  { code: 'E2.2.1', title: 'Blocker con tipo, responsable y fecha obligatorios', demo: 'Abrir formulario de registrar obstáculo en la ficha' },
  { code: 'E2.3.1', title: 'Checklist obligatorio verificado antes de avanzar', demo: 'Abrir convenio con checklist obligatorio pendiente' },
]

export default function Acceptance({ convenios, onView }: { convenios: Convenio[]; onView: (code: string) => void }){
  return (
    <div className="mt-6">
      <div className="border border-slate-200 bg-white p-4 rounded-sm">
        <h2 className="text-lg font-medium">Criterios de aceptación</h2>
        <p className="text-sm text-slate-600 mt-1">Panel para que un evaluador verifique los criterios definidos en el documento de épicas.</p>

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                <th className="p-2">Criterio</th>
                <th className="p-2">Enunciado</th>
                <th className="p-2">Cómo demostrarlo</th>
                <th className="p-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {CRITERIOS.map(c => (
                <tr key={c.code} className="border-t">
                  <td className="p-2 font-medium">{c.code}</td>
                  <td className="p-2">{c.title}</td>
                  <td className="p-2 text-slate-600">{c.demo}</td>
                  <td className="p-2"><button className="px-2 py-1 border" onClick={() => onView(c.code)}>Ver</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-slate-700">
          <div className="font-medium">Fuera del alcance de este prototipo</div>
          <ul className="list-disc ml-5">
            <li>Épica 3 — Carga masiva de proveedores (Sprint 2)</li>
            <li>Épica 4 — Gantt de integración ERP (Sprint 3)</li>
            <li>Épica 5 — Piezas de marketing y campañas (Sprint 3)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
