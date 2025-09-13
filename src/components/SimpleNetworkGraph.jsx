import React from 'react'

// Simple, dependency-free SVG network: Drug -> Pathway(Target) -> Partner
export default function SimpleNetworkGraph({
  drugName = 'Drug',
  pathways = [],
  partners = [],
  height = 260,
  padding = { top: 12, right: 16, bottom: 12, left: 16 },
}) {
  const uid = React.useId()
  const width = 640
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const xDrug = padding.left + 80
  const xPath = padding.left + innerW / 2
  const xPartner = width - padding.right - 80

  const placeYs = (n) => {
    if (n <= 0) return []
    const step = innerH / (n + 1)
    return Array.from({ length: n }, (_, i) => padding.top + step * (i + 1))
  }
  const yDrug = padding.top + innerH / 2
  const yPaths = placeYs(pathways.length)
  const yPartners = placeYs(partners.length)

  const hasData = drugName && (pathways.length > 0 || partners.length > 0)

  const markerId = `arrowhead-${uid}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <marker id={markerId} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L6,3 z" fill="#94a3b8" />
        </marker>
      </defs>

      {/* grid backdrop */}
      <rect x={padding.left} y={padding.top} width={innerW} height={innerH} fill="#f8fafc" stroke="#e2e8f0" rx="8" />

      {/* drug node */}
      <circle cx={xDrug} cy={yDrug} r="12" fill="#0ea5e9" />
      <text x={xDrug} y={yDrug + 28} textAnchor="middle" fontSize="11" fill="#0f172a">{drugName}</text>

      {/* pathways */}
      {yPaths.map((y, i) => (
        <g key={`p-${i}`}>
          <line x1={xDrug + 12} y1={yDrug} x2={xPath - 18} y2={y} stroke="#94a3b8" strokeWidth="1.5" markerEnd={`url(#${markerId})`} />
          <circle cx={xPath} cy={y} r="10" fill="#8b5cf6" />
          <text x={xPath} y={y + 24} textAnchor="middle" fontSize="10" fill="#334155">{pathways[i]}</text>
        </g>
      ))}

      {/* partners */}
      {yPartners.map((y, j) => (
        <g key={`pp-${j}`}>
          {/* connect each pathway to partner; if no pathways, connect drug directly */}
          {yPaths.length > 0 ? (
            yPaths.map((yp, i) => (
              <line key={`ln-${i}-${j}`} x1={xPath + 10} y1={yp} x2={xPartner - 18} y2={y} stroke="#94a3b8" strokeWidth="1.2" markerEnd={`url(#${markerId})`} />
            ))
          ) : (
            <line x1={xDrug + 12} y1={yDrug} x2={xPartner - 18} y2={y} stroke="#94a3b8" strokeWidth="1.5" markerEnd={`url(#${markerId})`} />
          )}
          <circle cx={xPartner} cy={y} r="10" fill="#22c55e" />
          <text x={xPartner} y={y + 24} textAnchor="middle" fontSize="10" fill="#334155">{partners[j]}</text>
        </g>
      ))}

      {!hasData && (
        <text x={width/2} y={height/2} textAnchor="middle" fontSize="12" fill="#94a3b8">No network data</text>
      )}

      {/* legend */}
      <g transform={`translate(${padding.left + 8}, ${padding.top + 8})`}>
        <circle cx="0" cy="0" r="5" fill="#0ea5e9" />
        <text x="10" y="3" fontSize="10" fill="#334155">Drug</text>
        <g transform="translate(60,0)">
          <circle cx="0" cy="0" r="5" fill="#8b5cf6" />
          <text x="10" y="3" fontSize="10" fill="#334155">Pathway</text>
        </g>
        <g transform="translate(140,0)">
          <circle cx="0" cy="0" r="5" fill="#22c55e" />
          <text x="10" y="3" fontSize="10" fill="#334155">Partner</text>
        </g>
      </g>
    </svg>
  )
}
