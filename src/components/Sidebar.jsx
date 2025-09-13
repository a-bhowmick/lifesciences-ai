import React from 'react'

export default function Sidebar({ title, children, actions }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-slate-700">{title}</div>
        {actions}
      </div>
      <div className="space-y-2 text-sm text-slate-600">
        {children}
      </div>
    </div>
  )
}

