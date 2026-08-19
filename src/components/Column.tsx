import React from 'react'

export default function Column({ title, count, children }: { title: string; count?: number; children?: React.ReactNode }){
  return (
    <div className="w-80 flex-shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        {count != null && <div className="chip">{count}</div>}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}
