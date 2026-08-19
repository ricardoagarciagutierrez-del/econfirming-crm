import React from 'react'
import { AlertTriangle, Clock, Flag } from 'lucide-react'

type Props = {
  id?: string
  title: string
  subtitle?: string
  amount?: number
  days?: number
  sla?: 'ok'|'warn'|'danger'
  blocked?: boolean
  onClick?: () => void
}

export default function Card({ title, subtitle, amount, days, sla='ok', blocked=false, onClick }: Props){
  const slaClass = sla === 'ok' ? 'sla-ok' : sla === 'warn' ? 'sla-warn' : 'sla-danger'
  return (
    <article className="bci-card cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          {subtitle && <div className="muted-sm">{subtitle}</div>}
        </div>
        <div className="flex flex-col items-end gap-2">
          {amount != null && <div className="font-bold">{amount.toLocaleString('es-CL', {style:'currency', currency:'CLP'})}</div>}
          <div className="flex items-center gap-2">
            <span className={`sla-dot ${slaClass}`} />
            <div className="muted-sm">{days ?? '-'} días</div>
            {blocked && <AlertTriangle className="text-rose-600" size={16} />}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 muted-sm">
        <Clock size={14} />
        <div>Actualizado hace 2d por Juan Pérez</div>
      </div>
    </article>
  )
}
