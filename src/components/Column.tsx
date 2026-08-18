import React from 'react'
import Card from './Card'
import { slaDeEtapa } from '../data/model'

export default function Column({ etapa, convenios, onOpen }: { etapa: string; convenios: any[]; onOpen?: (c: any) => void }) {
  return (
    <section className="w-72 border border-slate-200 rounded-sm bg-white p-3 flex-shrink-0">
      <header className="mb-2">
        <div className="text-sm font-medium text-slate-800">{etapa}</div>
        <div className="text-xs text-slate-500">{convenios.length} • SLA {slaDeEtapa(etapa as any)} días</div>
      </header>

      <div className="space-y-3">
        {convenios.map(c => (
          <Card key={c.id} convenio={c} onOpen={() => onOpen && onOpen(c)} />
        ))}
      </div>
    </section>
  )
}
