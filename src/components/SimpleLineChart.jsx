import React from 'react'

// Lightweight SVG line chart for illustrative curves.
// Props:
// - series: [{ name, color, points: [{x, y}] }]
// - xLabel, yLabel, padding, height
export default function SimpleLineChart({
  series = [],
  xLabel = 'Time (h)',
  yLabel = 'Tumor AUC (µM·hr)',
  height = 200,
  padding = { top: 12, right: 16, bottom: 28, left: 40 },
}) {
  const width = 640 // viewBox width; scales with container

  // drop series that are entirely zeros or invalid
  const filtered = series
    .map(s => ({ ...s, points: (s.points || []).filter(p => Number.isFinite(p.x) && Number.isFinite(p.y)) }))
    .filter(s => s.points.length > 0 && s.points.some(p => p.y > 0))

  const allX = filtered.flatMap(s => s.points.map(p => p.x))
  const allY = filtered.flatMap(s => s.points.map(p => p.y))
  const xMin = Math.min(0, ...allX)
  const xMax = Math.max(1, ...allX)
  const yMin = 0
  const yMax = Math.max(1, ...allY)

  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const sx = (x) => padding.left + ((x - xMin) / (xMax - xMin)) * innerW
  const sy = (y) => padding.top + innerH - ((y - yMin) / (yMax - yMin)) * innerH

  // ticks
  const xTicks = 5
  const yTicks = 4
  const xTickVals = Array.from({ length: xTicks + 1 }, (_, i) => xMin + (i * (xMax - xMin)) / xTicks)
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => yMin + (i * (yMax - yMin)) / yTicks)

  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x)} ${sy(p.y)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* grid */}
      {xTickVals.map((tx, i) => (
        <line key={`xg-${i}`} x1={sx(tx)} x2={sx(tx)} y1={padding.top} y2={height - padding.bottom} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {yTickVals.map((ty, i) => (
        <line key={`yg-${i}`} x1={padding.left} x2={width - padding.right} y1={sy(ty)} y2={sy(ty)} stroke="#e5e7eb" strokeWidth="1" />
      ))}

      {/* axes */}
      <line x1={padding.left} x2={width - padding.right} y1={height - padding.bottom} y2={height - padding.bottom} stroke="#94a3b8" />
      <line x1={padding.left} x2={padding.left} y1={padding.top} y2={height - padding.bottom} stroke="#94a3b8" />

      {/* ticks/labels */}
      {xTickVals.map((tx, i) => (
        <text key={`xt-${i}`} x={sx(tx)} y={height - padding.bottom + 16} textAnchor="middle" fontSize="10" fill="#64748b">{Math.round(tx)}</text>
      ))}
      {yTickVals.map((ty, i) => (
        <text key={`yt-${i}`} x={padding.left - 6} y={sy(ty) + 3} textAnchor="end" fontSize="10" fill="#64748b">{Math.round(ty)}</text>
      ))}

      {/* series paths */}
      {filtered.map((s, idx) => (
        <g key={idx}>
          <path d={toPath(s.points)} fill="none" stroke={s.color || '#0ea5e9'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {s.points.map((p, i) => (
            <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="2" fill={s.color || '#0ea5e9'} />
          ))}
        </g>
      ))}

      {/* legend */}
      <g transform={`translate(${padding.left}, ${padding.top - 4})`}>
        {filtered.map((s, i) => (
          <g key={`leg-${i}`} transform={`translate(${i * 140}, 0)`}>
            <rect width="10" height="2" y="6" fill={s.color || '#0ea5e9'} />
            <text x="16" y="10" fontSize="10" fill="#334155">{s.name}</text>
          </g>
        ))}
      </g>

      {/* axis titles */}
      <text x={(width - padding.right)} y={height - 4} textAnchor="end" fontSize="10" fill="#64748b">{xLabel}</text>
      <text x={0} y={12} textAnchor="start" fontSize="10" fill="#64748b">{yLabel}</text>
      {filtered.length === 0 && (
        <text x={width/2} y={height/2} textAnchor="middle" fontSize="12" fill="#94a3b8">No curves available</text>
      )}
    </svg>
  )
}
