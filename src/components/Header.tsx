import React from 'react'

function formatCLP(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`
  return `$${value}`
}

export default function Header({ totals, onOpenAcceptance }: { totals: { activos: number; monto: number; avgDias: number; criticas: number }, onOpenAcceptance?: () => void }) {
  return (
    <header>
      <div className="flex items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">eConfirming · Gestión de Convenios</h1>
        </div>
        <div>
          <button className="text-sm text-slate-600 underline" onClick={() => onOpenAcceptance && onOpenAcceptance()}>Criterios de aceptación</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="border border-slate-200 rounded-sm p-3 bg-white">
          <div className="text-xs text-slate-500">Convenios activos</div>
          <div className="text-lg font-medium text-slate-800">{totals.activos}</div>
        </div>

        <div className="border border-slate-200 rounded-sm p-3 bg-white">
          <div className="text-xs text-slate-500">Monto total en proceso</div>
          <div className="text-lg font-medium text-slate-800">{formatCLP(totals.monto)}</div>
        </div>

        <div className="border border-slate-200 rounded-sm p-3 bg-white">
          <div className="text-xs text-slate-500">Tiempo promedio en etapa</div>
          <div className="text-lg font-medium text-slate-800">{totals.avgDias} días</div>
        </div>

        <div className="border border-slate-200 rounded-sm p-3 bg-white">
          <div className="text-xs text-slate-500">Alertas críticas</div>
          <div className="text-lg font-medium text-rose-600">{totals.criticas}</div>
        </div>
      </div>
    </header>
  )
}
