import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Segmented from '../components/Segmented'

const APPROVAL_OPTS = [
  { value: 'FDA-approved', label: 'FDA-approved' },
  { value: 'oncology-only', label: 'oncology-only' },
  { value: 'any', label: 'any' },
]

const TUMOR_OPTS = ['DIPG', 'pHGG', 'LGG', 'Medulloblastoma']
const ROUTE_OPTS = ['Systemic', 'CED', 'Intraventricular', 'FUS', 'Nanoparticle']
const GENOTYPE_OPTS = ['H3K27M', 'BRAF V600E', 'EGFRvIII', 'TP53']

export default function Landing() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [scope, setScope] = React.useState(params.get('scope') || 'FDA-approved')
  const [tumor, setTumor] = React.useState(params.get('tumor') || 'DIPG')
  const [route, setRoute] = React.useState(params.get('route') || 'Systemic')
  const [genotype, setGenotype] = React.useState(params.get('genotype') || '')
  const [showAdvanced, setShowAdvanced] = React.useState(!!params.get('genotype'))

  const runQuery = () => {
    const sp = new URLSearchParams()
    sp.set('scope', scope)
    sp.set('tumor', tumor)
    sp.set('route', route)
    if (genotype) sp.set('genotype', genotype)
    navigate(`/results?${sp.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="text-slate-900 font-semibold tracking-tight">Repurposed Drug Discovery — Pediatric Neuro-Oncology</div>
            <div className="text-xs text-slate-500">MVP</div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="max-w-4xl w-full">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-xl p-8 md:p-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 text-center">Query Assistant</h1>

            <div className="mt-8 space-y-6">
              <div className="text-center text-slate-700">
                <div className="text-sm uppercase tracking-wide text-slate-500 mb-2">Approval scope</div>
                <Segmented options={APPROVAL_OPTS} value={scope} onChange={setScope} size="lg" />
              </div>
              <div className="text-center text-slate-700">
                <div className="text-sm uppercase tracking-wide text-slate-500 mb-2">Tumor type</div>
                <Segmented options={TUMOR_OPTS.map(t => ({ value: t, label: t }))} value={tumor} onChange={setTumor} size="lg" />
              </div>
              <div className="text-center text-slate-700">
                <div className="text-sm uppercase tracking-wide text-slate-500 mb-2">Delivery route</div>
                <Segmented options={ROUTE_OPTS.map(r => ({ value: r, label: r }))} value={route} onChange={setRoute} size="lg" />
              </div>
              <div className="text-center text-slate-700">
                <button className="text-xs text-slate-500 underline" onClick={() => setShowAdvanced(v => !v)}>
                  {showAdvanced ? 'Hide genotype (optional)' : 'Add genotype (optional)'}
                </button>
                {showAdvanced && (
                  <div className="mt-3">
                    <Segmented
                      options={[{ value: '', label: 'None' }, ...GENOTYPE_OPTS.map(g => ({ value: g, label: g }))]}
                      value={genotype}
                      onChange={setGenotype}
                      size="lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center">
              <button onClick={runQuery} className="btn btn-primary px-6 py-3 text-base rounded-xl">Run Query →</button>
            </div>

            <div className="mt-6 text-center text-sm text-slate-500">
              Show me the top <span className="font-medium text-slate-700">{scope}</span> drugs for <span className="font-medium text-slate-700">{tumor}</span> via <span className="font-medium text-slate-700">{route}</span>{genotype ? <> in patients with <span className="font-medium text-slate-700">{genotype}</span></> : ''}.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
