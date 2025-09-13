import React from 'react'

// Traffic light indicator: green/yellow/red based on tier
export default function TrafficLight({ tier = 'Consider' }) {
  const active = tier === 'Go' ? 'green' : tier === 'No-go' ? 'red' : 'yellow'
  const dot = (color) => (
    <span
      className={`inline-block w-3 h-3 rounded-full ${
        color === 'green' ? 'bg-green-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
      } ${active === color ? 'opacity-100' : 'opacity-30'}`}
      aria-label={`${color} indicator`}
    />
  )
  return (
    <div className="flex items-center gap-1.5" title={`Readiness: ${tier}`}>
      {dot('red')}
      {dot('yellow')}
      {dot('green')}
    </div>
  )
}

