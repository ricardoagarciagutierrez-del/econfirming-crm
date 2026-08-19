import React from 'react'
import Card from './Card'
import { slaDeEtapa } from '../data/model'

export default function Column({ etapa, convenios, onOpen }: { etapa: string; convenios: any[]; onOpen?: (c: any) => void }) {
  return (
    <section className="w-72 bci-card p-3 flex-shrink-0">
      <header className="mb-2">
        <div className="text-sm font-medium">{etapa}</div>
        <div className="text-xs bci-muted">{convenios.length} • SLA {slaDeEtapa(etapa as any)} días</div>
      </header>

      <div className="space-y-3">
        {convenios.map(c => (
          <Card key={c.id} convenio={c} onOpen={() => onOpen && onOpen(c)} />
        ))}
      </div>
    </section>
  )
}
