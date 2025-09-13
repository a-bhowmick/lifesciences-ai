import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import ChartFrame from '../components/ChartFrame'
import SimpleLineChart from '../components/SimpleLineChart'
import SimpleNetworkGraph from '../components/SimpleNetworkGraph'
import DrugCard from '../components/DrugCard'
import { drugs } from '../data/drugs'
import { computeRanking, explainRanking } from '../utils/format'

export default function CommandCenter() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const scope = params.get('scope') || 'FDA-approved'
  const tumor = params.get('tumor') || 'DIPG'
  const route = params.get('route') || 'Systemic'
  const genotype = params.get('genotype') || ''

  let filtered = drugs
  if (scope === 'FDA-approved') filtered = drugs.filter(d => d.isFDAApproved)
  if (scope === 'oncology-only') filtered = drugs.filter(d => d.isFDAApproved && d.approvedForOncology)

  const heroNames = ['trametinib', 'panobinostat', 'metformin', 'everolimus']
  const ranked = filtered
    .map(d => ({
      drug: d,
      score: computeRanking(d, { route, genotype }),
      reasons: explainRanking(d, { route, genotype }),
      isHero: heroNames.includes(d.name.toLowerCase())
    }))
    .sort((a, b) => {
      if (a.isHero && !b.isHero) return -1
      if (!a.isHero && b.isHero) return 1
      return b.score - a.score
    })

  const recap = (
    <div className="space-y-2 text-sm">
      <div><span className="text-slate-500">Approval scope:</span> <span className="font-medium">{scope}</span></div>
      <div><span className="text-slate-500">Tumor type:</span> <span className="font-medium">{tumor}</span></div>
      <div><span className="text-slate-500">Delivery route:</span> <span className="font-medium">{route}</span></div>
      <div><span className="text-slate-500">Genotype:</span> <span className="font-medium">{genotype || '—'}</span></div>
    </div>
  )

  // Build illustrative PK AUC curves based on the top-ranked drug
  const topDrug = ranked[0]?.drug || drugs[0]
  const times = [0, 6, 12, 24, 48, 72]
  const oralBase = topDrug?.auc?.oralBase || 0
  const cedBase = topDrug?.auc?.cedBase || 0
  const fusBase = topDrug?.auc?.fusBase || 0
  const oralPts = times.map(t => ({ x: t, y: oralBase * (1 - Math.exp(-t / 12)) }))
  const linPlateau = (base, factor = 1) => times.map(t => ({ x: t, y: base * factor * Math.min(t / 24, 1) }))
  const cedPts = linPlateau(cedBase, 1)
  const fusPts = linPlateau(fusBase, 0.8)
  const pathways = topDrug?.repurposingTargets || []
  const partners = topDrug?.synergyPartners || []

  return (
    <Layout
      left={
        <>
          <Sidebar
            title="Query Recap"
            actions={<button className="btn" onClick={() => navigate({ pathname: '/', search: `?${params.toString()}` })}>Edit</button>}
          >
            {recap}
          </Sidebar>
          <div className="card p-4">
            <div className="section-title mb-2">Evidence Sources</div>
            <div className="flex flex-wrap gap-2 text-xs">
              {['FDA Label (placeholder)','PubChem BBB (placeholder)','Pediatric PK (placeholder)','Preclinical CED Model (placeholder)','ClinicalTrials.gov (placeholder)'].map(s => (
                <span key={s} className="pill">{s}</span>
              ))}
            </div>
          </div>
        </>
      }
      center={
        <>
          {ranked.map(({ drug, reasons }, idx) => (
            <DrugCard key={drug.id} drug={drug} rank={idx + 1} prefsReasons={reasons} />
          ))}
          {ranked.length === 0 && (
            <div className="card p-6 text-slate-600">No matches found for selected filters.</div>
          )}
        </>
      }
      right={
        <>
          <ChartFrame title="PK AUC Curves (illustrative)" height={220}>
            <SimpleLineChart
              height={220}
              series={[
                { name: 'Oral', color: '#0072B2', points: oralPts },
                { name: 'CED', color: '#009E73', points: cedPts },
                { name: 'FUS', color: '#E69F00', points: fusPts },
              ]}
            />
          </ChartFrame>
          <ChartFrame title="Pathway Network (illustrative)" height={260}>
            <SimpleNetworkGraph
              height={260}
              drugName={topDrug?.name}
              pathways={pathways}
              partners={partners}
            />
          </ChartFrame>
          <div className="card p-4">
            <div className="section-title mb-2">Shortcuts</div>
            <div className="flex flex-col gap-2">
              <Link to="/" className="btn">New Query</Link>
            </div>
          </div>
        </>
      }
    />
  )
}
