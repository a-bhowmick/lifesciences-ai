import React from 'react'

export default function BBBScore({ label, score = 'Medium' }) {
  const color = score === 'High' ? 'bg-green-500' : score === 'Low' ? 'bg-red-500' : 'bg-yellow-500'
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-sm text-slate-700">BBB: {label || score}</span>
    </div>
  )
}

