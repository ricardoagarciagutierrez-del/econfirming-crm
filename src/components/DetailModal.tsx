import React, { useMemo, useState } from 'react'
import type { Convenio, Etapa, Hito, EntradaBitacora, ItemChecklist, Blocker } from '../data/model'
import { ETAPAS } from '../data/model'

function formatDateISO(date = new Date()) { return new Date(date).toISOString() }

export default function DetailModal({ convenio, onClose, onSave }: { convenio: Convenio; onClose: () => void; onSave: (c: Convenio) => void }) {
  const [tab, setTab] = useState<'bitacora'|'hitos'|'doc'|'contactos'>('bitacora')
  const [local, setLocal] = useState<Convenio>({...convenio})
  const [showBlockerForm, setShowBlockerForm] = useState(false)
  const [blockerForm, setBlockerForm] = useState<Partial<Blocker>>({tipo: 'Operativo'})
  const [entryText, setEntryText] = useState('')
  const [entryTipo, setEntryTipo] = useState<EntradaBitacora['tipo']>('Reunión')

  // recompute missing requirements for advancing
  function missingToAdvance(c: Convenio): string[] {
    const missing: string[] = []
    // checklist
    const pendientes = c.checklist.filter(i => i.obligatorio && i.estado !== 'Aprobado')
    pendientes.forEach(i => missing.push(`Checklist pendiente: ${i.nombre}`))

    if (c.etapaActual === 'Configuración') {
      const required = ['Aprobación de riesgo','Propuesta comercial al pagador','NDA pagador']
      required.forEach(r => {
        const h = c.hitos.find(h => h.nombre === r)
        if (!h || h.estado !== 'Aprobado') missing.push(`Hito pendiente: ${r}`)
      })
    }

    if (c.etapaActual === 'Implementación') {
      const required = ['Integración TI','Borrador del contrato']
      required.forEach(r => {
        const h = c.hitos.find(h => h.nombre === r)
        if (!h || h.estado !== 'Aprobado') missing.push(`Hito pendiente: ${r}`)
      })
    }

    return missing
  }

  const missing = useMemo(() => missingToAdvance(local), [local])

  function changeHitoEstado(hitoId: string, estado: Hito['estado']){
    const updated = {...local, hitos: local.hitos.map(h => h.id === hitoId ? {...h, estado, fechaActualizacion: formatDateISO()} : h)}
    setLocal(updated)
  }

  function attachChecklist(itemId: string){
    const updated = {...local, checklist: local.checklist.map(i => i.id === itemId ? {...i, estado: 'Cargado'} : i)}
    setLocal(updated)
  }

  function addBitacora(){
    if (!entryText.trim()) return
    const entry: EntradaBitacora = { id: `b-${Date.now()}`, fecha: formatDateISO(), autor: local.responsableNombre, tipo: entryTipo, detalle: entryText }
    const updated = {...local, bitacora: [entry, ...local.bitacora], ultimaActualizacion: formatDateISO(), ultimoActualizadoPor: local.responsableNombre}
    setLocal(updated)
    setEntryText('')
  }

  function registerBlocker(){
    if (!blockerForm.tipo || !blockerForm.responsableResolucion || !blockerForm.fechaCompromiso) return
    const nb: Blocker = { id: `bl-${Date.now()}`, tipo: blockerForm.tipo as any, descripcion: blockerForm.descripcion||'', responsableResolucion: blockerForm.responsableResolucion as string, fechaCompromiso: blockerForm.fechaCompromiso as string, estado: 'Abierto' }
    const updated = {...local, blockers: [nb, ...local.blockers], ultimaActualizacion: formatDateISO(), ultimoActualizadoPor: local.responsableNombre}
    setLocal(updated)
    setShowBlockerForm(false)
    setBlockerForm({tipo: 'Operativo'})
  }

  function tryAdvance(){
    const miss = missingToAdvance(local)
    if (miss.length) return
    const idx = ETAPAS.indexOf(local.etapaActual as Etapa)
    if (idx < 0 || idx === ETAPAS.length - 1) return
    const next = ETAPAS[idx + 1]
    const updated: Convenio = {...local, etapaActual: next, fechaIngresoEtapa: formatDateISO(), ultimaActualizacion: formatDateISO(), ultimoActualizadoPor: local.responsableNombre, bitacora: [{ id: `b-${Date.now()}`, fecha: formatDateISO(), autor: local.responsableNombre, tipo: 'Cambio de etapa', detalle: `Avanzó a ${next}` }, ...local.bitacora ]}
    setLocal(updated)
    onSave(updated)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[900px] max-w-full bg-white border border-slate-200 rounded-sm shadow-lg">
        <header className="p-4 border-b border-slate-100 flex justify-between items-start gap-4">
          <div>
            <div className="text-lg font-semibold text-slate-800">{local.nombreCliente}</div>
            <div className="text-sm text-slate-600">{local.montoEstimado.toLocaleString('es-CL')} • {local.etapaActual} • {local.responsableNombre}</div>
            <div className="mt-2 flex gap-2">
              {local.blockers.map(b => (
                <div key={b.id} className={`text-xs px-2 py-1 border ${new Date(b.fechaCompromiso) < new Date() && b.estado === 'Abierto' ? 'border-rose-600 text-rose-600' : 'border-slate-200 text-slate-600'}`}>{b.tipo}: {b.responsableResolucion}</div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <button className="text-sm text-slate-600 mr-2" onClick={() => setShowBlockerForm(s => !s)}>Registrar obstáculo</button>
            <button className="px-3 py-1 bg-sky-600 text-white rounded-sm" onClick={() => { onSave(local); onClose() }}>Cerrar</button>
          </div>
        </header>

        <div className="p-4">
          {showBlockerForm && (
            <div className="mb-4 p-3 border border-slate-100 rounded-sm">
              <div className="flex gap-2">
                <select value={blockerForm.tipo} onChange={e => setBlockerForm({...blockerForm, tipo: e.target.value as any})} className="border px-2 py-1">
                  <option>Legal</option>
                  <option>TI</option>
                  <option>Riesgo</option>
                  <option>Comercial</option>
                  <option>Operativo</option>
                </select>
                <input placeholder="Responsable" value={blockerForm.responsableResolucion||''} onChange={e => setBlockerForm({...blockerForm, responsableResolucion: e.target.value})} className="border px-2 py-1 flex-1" />
                <input type="date" value={blockerForm.fechaCompromiso?.slice(0,10)||''} onChange={e => setBlockerForm({...blockerForm, fechaCompromiso: e.target.value + 'T00:00:00.000Z'})} className="border px-2 py-1" />
                <button className="px-3 bg-emerald-600 text-white" onClick={registerBlocker}>Guardar</button>
              </div>
            </div>
          )}

          <nav className="flex gap-3 mb-4">
            <button className={`px-3 py-1 ${tab==='bitacora'?'bg-slate-100':''}`} onClick={() => setTab('bitacora')}>Bitácora</button>
            <button className={`px-3 py-1 ${tab==='hitos'?'bg-slate-100':''}`} onClick={() => setTab('hitos')}>Hitos y avance</button>
            <button className={`px-3 py-1 ${tab==='doc'?'bg-slate-100':''}`} onClick={() => setTab('doc')}>Documentación</button>
            <button className={`px-3 py-1 ${tab==='contactos'?'bg-slate-100':''}`} onClick={() => setTab('contactos')}>Contactos</button>
          </nav>

          {tab === 'bitacora' && (
            <section>
              <div className="space-y-3 max-h-64 overflow-auto mb-3">
                {local.bitacora.sort((a,b)=> b.fecha.localeCompare(a.fecha)).map(e => (
                  <div key={e.id} className="p-2 border-b border-slate-100">
                    <div className="text-xs text-slate-500">{new Date(e.fecha).toLocaleString()} · {e.autor} · {e.tipo}</div>
                    <div className="mt-1 text-sm text-slate-800">{e.detalle}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3">
                <select value={entryTipo} onChange={e => setEntryTipo(e.target.value as any)} className="border px-2 py-1 mr-2">
                  <option>Reunión</option>
                  <option>Llamada</option>
                  <option>Correo</option>
                  <option>Minuta</option>
                  <option>Acuerdo</option>
                </select>
                <input className="border px-2 py-1 w-80 mr-2" placeholder="Detalle" value={entryText} onChange={e => setEntryText(e.target.value)} />
                <button className="px-3 py-1 bg-sky-600 text-white" onClick={addBitacora}>Agregar</button>
              </div>
            </section>
          )}

          {tab === 'hitos' && (
            <section>
              <div className="space-y-2 mb-4">
                {local.hitos.map(h => (
                  <div key={h.id} className="flex items-center justify-between p-2 border border-slate-100 rounded-sm">
                    <div>
                      <div className="text-sm font-medium">{h.nombre}</div>
                      <div className="text-xs text-slate-500">Responsable: {h.responsable}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={h.estado} onChange={e => changeHitoEstado(h.id, e.target.value as any)} className="border px-2 py-1">
                        <option>Pendiente</option>
                        <option>En curso</option>
                        <option>Aprobado</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex items-start gap-4">
                <div>
                  <button disabled={missing.length>0} className={`px-3 py-1 ${missing.length>0? 'bg-slate-200 text-slate-400':'bg-emerald-600 text-white'}`} onClick={tryAdvance}>Avanzar a la siguiente etapa</button>
                </div>
                {missing.length>0 && (
                  <div className="text-sm text-rose-600">
                    <div className="font-medium">Bloqueos:</div>
                    <ul className="list-disc ml-5">
                      {missing.map(m => <li key={m}>{m}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {tab === 'doc' && (
            <section>
              <div className="space-y-2">
                {local.checklist.map(i => (
                  <div key={i.id} className="flex items-center justify-between border p-2 rounded-sm">
                    <div>
                      <div className="text-sm">{i.nombre} {i.obligatorio && <span className="text-xs text-rose-600">(Obligatorio)</span>}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-slate-600">{i.estado}</div>
                      {i.estado === 'Pendiente' && <button className="px-2 py-1 bg-slate-100" onClick={() => attachChecklist(i.id)}>Adjuntar</button>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'contactos' && (
            <section>
              <div className="space-y-3">
                {['Legal','CFO','Tesorería','TI','Comercial','Operativo'].map(area => {
                  const group = local.contactos.filter(ct => ct.area === (area as any))
                  if (!group.length) return null
                  return (
                    <div key={area}>
                      <div className="text-sm font-medium">{area}</div>
                      <div className="mt-1 border rounded-sm">
                        {group.map(g => (
                          <div key={g.id} className="p-2 border-b last:border-b-0 flex justify-between">
                            <div>
                              <div className="font-medium">{g.nombre}</div>
                              <div className="text-xs text-slate-500">{g.cargo} • {g.email}</div>
                            </div>
                            <div className="text-xs text-slate-500">{g.telefono}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
