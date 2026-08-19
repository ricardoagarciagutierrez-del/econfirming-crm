import React from 'react'
import { Search } from 'lucide-react'

export default function Header({ onOpenSummary }: { onOpenSummary?: () => void }){
  return (
    <div>
      <div className="bci-topbar" />
      <div className="bci-header px-4 py-3">
        <div className="bci-logo">
          <img src="/bci-logo.svg" alt="BCI logo" className="w-28 h-auto" />
          <div>
            <div className="bci-logo-text">eConfirming CRM</div>
            <div className="muted-sm">Panel de gestión • Banco BCI</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="kpi">
            <div className="value">$ 4.250.000</div>
            <div className="muted-sm">Valor en cartera</div>
          </div>
          <div className="kpi">
            <div className="value">24</div>
            <div className="muted-sm">Convenios activos</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input placeholder="Buscar convenio, cliente o id" className="pl-9 pr-3 py-1 border rounded-md w-64" />
            </div>
            <button className="bci-btn" onClick={onOpenSummary}>Resumen IA</button>
          </div>
        </div>
      </div>
    </div>
  )
}
