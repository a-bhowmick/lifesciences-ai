import React from 'react'

export default function Segmented({ options = [], value, onChange, size = 'md', className = '' }) {
  const sizeCls = size === 'lg'
    ? 'text-sm p-1'
    : 'text-xs p-1'
  const btnPad = size === 'lg' ? 'px-4 py-2' : 'px-3 py-1.5'
  return (
    <div className={`inline-flex items-center rounded-full bg-slate-100 border border-slate-200 ${sizeCls} ${className}`} role="tablist">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`${btnPad} rounded-full transition-colors ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

