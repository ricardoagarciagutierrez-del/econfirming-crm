import React from 'react'

function formatCLP(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`
  return `$${value}`
}

export default function Header({ totals, onOpenAcceptance }: { totals: { activos: number; monto: number; avgDias: number; criticas: number }, onOpenAcceptance?: () => void }) {
  return (
    <header>
      <div className="bci-header justify-between">
        <div className="bci-logo">
          <img src="/bci-logo.svg" alt="BCI logo" className="w-36 h-9" />
        </div>

        <div>
          <button className="text-sm bci-muted underline" onClick={() => onOpenAcceptance && onOpenAcceptance()}>Criterios de aceptación</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-3 bci-card">
          <div className="text-xs bci-muted">Convenios activos</div>
          <div className="text-lg font-medium">{totals.activos}</div>
        </div>

        <div className="p-3 bci-card">
          <div className="text-xs bci-muted">Monto total en proceso</div>
          <div className="text-lg font-medium">{formatCLP(totals.monto)}</div>
        </div>

        <div className="p-3 bci-card">
          <div className="text-xs bci-muted">Tiempo promedio en etapa</div>
          <div className="text-lg font-medium">{totals.avgDias} días</div>
        </div>

        <div className="p-3 bci-card">
          <div className="text-xs bci-muted">Alertas críticas</div>
          <div className="text-lg font-medium text-rose-600">{totals.criticas}</div>
        </div>
      </div>
    </header>
  )
}
