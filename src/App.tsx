import React from 'react'
import Header from './components/Header'
import Column from './components/Column'
import Card from './components/Card'

const SAMPLE = Array.from({length:3}).map((_,i)=>({ id: `c-${i}`, title: `Convenio ${i+1}`, subtitle: `Cliente ${['A','B','C'][i]}`, amount: (i+1)*1250000, days: 2+i, sla: i===2? 'warn':'ok', blocked: i===1 }))

export default function App(){
	return (
		<div className="min-h-screen">
			<Header />
			<main className="p-6">
				<section className="mb-6">
					<div className="grid grid-cols-3 gap-4">
						<div className="bci-card p-4">KPIs placeholder</div>
						<div className="bci-card p-4">Acciones rápidas</div>
						<div className="bci-card p-4">Filtros / timeline</div>
					</div>
				</section>

				<section>
					<div className="flex gap-6 overflow-auto">
						<Column title="Identificación" count={SAMPLE.length}>
							{SAMPLE.map(s=> <Card key={s.id} title={s.title} subtitle={s.subtitle} amount={s.amount} days={s.days} sla={s.sla as any} blocked={s.blocked} />)}
						</Column>
						<Column title="Aprobación" count={2}>
							{SAMPLE.map(s=> <Card key={s.id+'a'} title={s.title} subtitle={s.subtitle} amount={s.amount} days={s.days+2} />)}
						</Column>
						<Column title="Implementación" count={1}>
							{SAMPLE.slice(0,1).map(s=> <Card key={s.id+'b'} title={s.title} subtitle={s.subtitle} amount={s.amount} days={s.days+4} sla={'danger'} />)}
						</Column>
						<Column title="Producción" count={0} />
						<Column title="Seguimiento" count={0} />
						<Column title="Cerrado" count={0} />
					</div>
				</section>
			</main>
		</div>
	)
}

