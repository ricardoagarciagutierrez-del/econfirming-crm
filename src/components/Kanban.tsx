import React from 'react'
import Column from './Column'
import type { Etapa, Convenio } from '../data/model'

export default function Kanban({ etapas, convenios, onOpen }: { etapas: readonly Etapa[]; convenios: Convenio[]; onOpen?: (c: Convenio) => void }) {
  return (
    <div className="overflow-x-auto -mx-3">
      <div className="flex gap-4 px-3" style={{ minWidth: '1200px' }}>
        {etapas.map(etapa => (
          <Column key={etapa} etapa={etapa} convenios={convenios.filter(c => c.etapaActual === etapa)} onOpen={onOpen} />
        ))}
      </div>
    </div>
  )
}
