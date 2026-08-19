import React, { useState } from 'react'
import type { Convenio } from '../data/model'

function localSummary(convenios: Convenio[]) {
  const total = convenios.length
  const excedidos = convenios.filter(c => {
    const sla = ((): number => {
      const map: Record<string, number> = {
        'Precalificación del Lead': 5,
        'Prospección': 10,
        'Configuración': 20,
        'Implementación': 45,
        'Firma de Convenio': 10,
        'Onboarding Proveedores': 30,
      }
      return map[c.etapaActual] || 0
    })()
    const dias = Math.floor((Date.now() - new Date(c.fechaIngresoEtapa).getTime()) / (1000*60*60*24))
    return dias > sla
  }).length

  const blockersVencidos = convenios.filter(c => c.blockers.some(b => b.estado === 'Abierto' && new Date(b.fechaCompromiso) < new Date())).length

  const titular = `${excedidos} de ${total} convenios con riesgo por SLA`
  const hallazgos = [] as string[]
  if (excedidos) hallazgos.push(`${excedidos} convenios excedieron SLA`)
  if (blockersVencidos) hallazgos.push(`${blockersVencidos} blockers vencidos`) 
  const accion = excedidos ? `Revisar convenios excedidos (ej. priorizar ${convenios.find(c=>true)?.nombreCliente})` : 'Pipeline operando dentro de SLA'

  return { titular, hallazgos, accionRecomendada: accion }
}

export default function Summary({ convenios }: { convenios: Convenio[] }){
  const [resumen, setResumen] = useState<any>(localSummary(convenios))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cfoOpen, setCfoOpen] = useState(false)
  const [cfoText, setCfoText] = useState('')

  async function refresh(){
    setLoading(true); setError(null)
    try{
      const payload = { total: convenios.length }
      const resp = await fetch('/api/resumen', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ pipeline: payload, conveniosCount: convenios.length }) })
      const data = await resp.json()
      if (!resp.ok || data.error) {
        // fallback local
        setResumen(localSummary(convenios))
        setError('Fallo en análisis remoto; usando resumen local')
      } else {
        setResumen(data.resumen)
      }
    }catch(e){
      setResumen(localSummary(convenios))
      setError('Fallo de red; usando resumen local')
    } finally { setLoading(false) }
  }

  function genCFO(){
    const text = `Resumen ejecutivo: ${resumen.titular}\n\nHallazgos:\n- ${resumen.hallazgos?.join('\n- ')}\n\nAcción recomendada: ${resumen.accionRecomendada}`
    setCfoText(text); setCfoOpen(true)
  }

  return (
    <section className="mb-6">
      <div className="border border-slate-200 bg-white p-4 rounded-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-slate-500">Resumen ejecutivo</div>
            <div className="text-lg font-medium text-slate-800">{resumen.titular}</div>
            <ul className="mt-2 list-disc ml-5 text-sm text-slate-700">
              {(resumen.hallazgos||[]).map((h:any, i:number)=>(<li key={i}>{h}</li>))}
            </ul>
            <div className="mt-2 text-sm text-slate-700">Acción recomendada: {resumen.accionRecomendada}</div>
          </div>

          <div className="flex flex-col gap-2">
            <button className="px-3 py-1 bci-btn" onClick={refresh}>{loading ? 'Analizando...' : 'Actualizar análisis'}</button>
            <button className="px-3 py-1 border bci-muted" onClick={genCFO}>Generar reporte para el CFO</button>
          </div>
        </div>
        {error && <div className="mt-2 text-xs text-rose-600">{error}</div>}
      </div>

      {cfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setCfoOpen(false)} />
          <div className="relative bg-white p-4 rounded-sm border max-w-xl w-full">
            <h3 className="font-medium">Reporte para el CFO</h3>
            <pre className="mt-2 text-sm whitespace-pre-wrap">{cfoText}</pre>
            <div className="mt-3 flex justify-end gap-2">
              <button className="px-3 py-1 border bci-muted" onClick={()=>{navigator.clipboard.writeText(cfoText)}}>Copiar</button>
              <button className="px-3 py-1 bci-btn" onClick={()=>setCfoOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
