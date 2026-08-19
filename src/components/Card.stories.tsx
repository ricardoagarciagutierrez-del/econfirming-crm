import React from 'react'
import Card from './Card'

export default { title: 'Card', component: Card }

export const Ok = () => <Card title="Comercio XYZ" subtitle="Pago a 30d" amount={1250000} days={2} sla="ok" />
export const Warn = () => <Card title="Comercio ABC" subtitle="Pago a 15d" amount={450000} days={15} sla="warn" />
export const DangerBlocked = () => <Card title="Comercio QWE" subtitle="Pago atrasado" amount={90000} days={40} sla="danger" blocked />
