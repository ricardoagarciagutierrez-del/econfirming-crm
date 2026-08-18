import React from 'react'
import { AlertCircle } from 'lucide-react'
import { estadoSLA } from '../data/model'

function areaColor(area: string) {
  switch (area) {
    case 'Comercial': return 'bg-amber-100 text-amber-800'
    case 'Legal': return 'bg-indigo-100 text-indigo-800'
    case 'Riesgo': return 'bg-emerald-100 text-emerald-800'
    case 'Producto': return 'bg-sky-100 text-sky-800'
    case 'TI': return 'bg-violet-100 text-violet-800'
    default: return 'bg-slate-100 text-slate-800'
  }
}

export default function Card({ convenio, onOpen }: { convenio: any; onOpen?: () => void }) {
  const sla = estadoSLA(convenio)
  const dias = Math.max(0, Math.round((Date.now() - new Date(convenio.fechaIngresoEtapa).getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <article onClick={onOpen} tabIndex={0} className="cursor-pointer border border-slate-200 rounded-sm p-3 focus:outline-none focus:ring-2 focus:ring-sky-300">
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="font-semibold text-slate-800">{convenio.nombreCliente}</div>
          <div className="text-xs text-slate-500">{convenio.cantidadProveedores} proveedores • ${convenio.montoEstimado.toLocaleString('es-CL')}</div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className={`w-3 h-3 rounded-full ${sla === 'ok' ? 'bg-green-500' : sla === 'riesgo' ? 'bg-amber-400' : 'bg-rose-600'}`} />
          {convenio.blockers.some((b: any) => b.estado === 'Abierto' && new Date(b.fechaCompromiso) < new Date()) && (
            <div title="Blocker abierto" className="text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-600">
        <span className="mr-2">{dias} días en etapa</span>
      </div>

      <div className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500">Actualizado hace {Math.max(0, Math.round((Date.now() - new Date(convenio.ultimaActualizacion).getTime()) / (1000 * 60 * 60 * 24)))} días por {convenio.ultimoActualizadoPor}</div>
    </article>
  )
}
