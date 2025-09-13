import React from 'react'

export default function ChartFrame({ title = 'Chart (illustrative)', height = 180, children }) {
  return (
    <div className="card p-4">
      <div className="text-sm font-medium text-slate-700 mb-2">{title}</div>
      <div className="h-px w-full bg-slate-100 mb-3" />
      <div
        className="w-full bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 text-xs overflow-hidden"
        style={{ height }}
      >
        {children || <span className="px-3">{title}</span>}
      </div>
    </div>
  )
}
