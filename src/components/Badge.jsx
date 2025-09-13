import React from 'react'

export default function Badge({ color = 'slate', children }) {
  const colorMap = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-sky-100 text-sky-700',
    violet: 'bg-violet-100 text-violet-700'
  }
  return (
    <span className={`badge ${colorMap[color] || colorMap.slate}`}>{children}</span>
  )
}

