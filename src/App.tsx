import React, { useMemo, useState } from 'react'
import { CONVENIOS_SEED, ETAPAS, diasEnEtapa, estadoSLA, type Convenio } from './data/model'
import Header from './components/Header'
import Kanban from './components/Kanban'
import Summary from './components/Summary'
import DetailModal from './components/DetailModal'
import Acceptance from './components/Acceptance'

export default function App() {
  const [convenios, setConvenios] = useState(CONVENIOS_SEED)
  const [selected, setSelected] = useState<Convenio | null>(null)
  const [showAcceptance, setShowAcceptance] = useState(false)

  const totals = useMemo(() => {
    const activos = convenios.length
    const monto = convenios.reduce((s, c) => s + c.montoEstimado, 0)
    const avgDias = Math.round(convenios.reduce((s, c) => s + diasEnEtapa(c), 0) / (convenios.length || 1))
    const criticas = convenios.filter(c => estadoSLA(c) === 'excedido' || c.blockers.some(b => b.estado === 'Abierto' && new Date(b.fechaCompromiso) < new Date())).length
    return { activos, monto, avgDias, criticas }
  }, [convenios])

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="max-w-[1200px] mx-auto p-6">
        <Header totals={totals} onOpenAcceptance={() => setShowAcceptance(true)} />
        <Summary convenios={convenios} />
        <main className="mt-6">
          {showAcceptance ? (
            <Acceptance convenios={convenios} onView={(code) => {
              // Find appropriate convenio for each criterion
              let target: Convenio | undefined
              if (code === 'E1.3') {
                target = convenios.find(c => c.etapaActual === 'Configuración' && c.hitos.some(h => h.estado !== 'Aprobado'))
              } else if (code === 'E1.4') {
                target = convenios.find(c => c.etapaActual === 'Implementación' && c.hitos.some(h => h.estado !== 'Aprobado'))
              } else if (code === 'E1.2.1') {
                target = convenios.find(c => estadoSLA(c) === 'excedido')
              } else if (code === 'E1.2.2' || code === 'E2.1.2') {
                target = convenios.find(c => c.blockers.some(b => b.estado === 'Abierto'))
              } else if (code === 'E2.3.1') {
                target = convenios.find(c => c.checklist.some(i => i.obligatorio && i.estado !== 'Aprobado'))
              } else {
                target = convenios[0]
              }

              if (target) {
                setSelected(target)
                setShowAcceptance(false)
              }
            }} />
          ) : (
            <Kanban etapas={ETAPAS} convenios={convenios} onOpen={(c) => setSelected(c)} />
          )}
        </main>
        {selected && (
          <DetailModal
            convenio={selected}
            onClose={() => setSelected(null)}
            onSave={(updated) => {
              setConvenios(prev => prev.map(p => p.id === updated.id ? updated : p))
              setSelected(updated)
            }}
          />
        )}
      </div>
    </div>
  )
}
