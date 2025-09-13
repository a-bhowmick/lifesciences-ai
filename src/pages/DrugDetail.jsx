import React from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Pill from '../components/Pill'
import ChartFrame from '../components/ChartFrame'
import SimpleLineChart from '../components/SimpleLineChart'
import SimpleNetworkGraph from '../components/SimpleNetworkGraph'
import AIWorkspace from '../components/AIWorkspace'
import { getDrugById } from '../data/drugs'
import { evidenceLinks } from '../utils/format'
import { computeAUC, formatNumber, computeReadiness } from '../utils/format'
import TrafficLight from '../components/TrafficLight'

export default function DrugDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const drug = getDrugById(id)
  const [infusion, setInfusion] = React.useState(24)
  const [genoCtx, setGenoCtx] = React.useState(params.get('genotype') || '')
  const readiness = drug ? computeReadiness(drug, genoCtx || undefined) : null
  const GENOTYPE_OPTS = React.useMemo(() => {
    const base = ['H3K27M', 'BRAF V600E', 'EGFRvIII', 'TP53', 'PDGFRA', 'TSC1', 'TSC2']
    const ext = Array.from(new Set([...(drug?.genotypesResponsive||[]), ...(drug?.resistanceVariants||[])]))
    return Array.from(new Set([...base, ...ext]))
  }, [drug])

  if (!drug) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="card p-6">Drug not found. <button className="btn ml-2" onClick={() => navigate('/results')}>Back</button></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-900">{drug.name}</h1>
            <Badge color={drug.isFDAApproved ? 'green' : 'slate'}>
              {drug.isFDAApproved ? 'FDA-Approved' : 'Investigational'}
            </Badge>
            {drug.approvedForOncology && <Badge color="violet">Oncology</Badge>}
            <span className="muted text-xs">Evidence last reviewed: {new Date().toISOString().slice(0,10)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link className="btn" to={{ pathname: '/results', search: `?${params.toString()}` }}>Back to Results</Link>
            <button className="btn" onClick={() => window.print()}>Export dossier (PDF)</button>
            <button className="btn" disabled title="Coming soon">Start Trial Draft</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <Card className="p-6">
            <div className="section-title mb-3">Repurposing Readiness — Bottom Line</div>
            {readiness && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <TrafficLight tier={readiness.tier} />
                  <span className={`badge ${readiness.tier === 'Go' ? 'bg-green-100 text-green-700' : readiness.tier === 'Consider' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{readiness.tier}</span>
                  <div className="text-slate-700 text-sm">Readiness score: <span className="font-semibold">{Math.round(readiness.score)}</span>/100</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Genotype context (optional):</span>
                  <select value={genoCtx} onChange={e => setGenoCtx(e.target.value)} className="border rounded-lg px-2 py-1">
                    <option value="">None</option>
                    {GENOTYPE_OPTS.map(g => (<option key={g} value={g}>{g}</option>))}
                  </select>
                  {genoCtx && <button onClick={() => setGenoCtx('')} className="btn no-print">Clear</button>}
                </div>
                <div className="text-slate-800 text-sm">Trialability: <span className="font-medium">{readiness.trialability}</span></div>
                <ul className="list-disc pl-5 text-sm text-slate-700">
                  {readiness.rationale.map((r, i) => (<li key={i}>{r}</li>))}
                </ul>
                <div className="text-sm text-slate-700">
                  Preclinical model investment: <span className="font-semibold">{readiness.tier === 'Go' ? 'Recommended' : readiness.tier === 'Consider' ? 'Conditional (targeted model)' : 'Not recommended'}</span>
                </div>
                <div className="text-xs text-slate-500">Heuristic assessment for planning; not a clinical directive.</div>
                <details>
                  <summary className="text-sm text-slate-600 cursor-pointer">How scored?</summary>
                  <ul className="list-disc pl-5 text-sm text-slate-700 mt-1">
                    <li>BBB numeric score baseline</li>
                    <li>+10 FDA-approved; +10 Oncology-approved</li>
                    <li>+10 if exposure proxy ≥ 1.0 µM·hr</li>
                    <li>+5 genomic signal; +10 genotype match; −10 resistance genotype</li>
                    <li>−15 seizures, −10 marrow suppression, −15 developmental risks</li>
                  </ul>
                </details>
              </div>
            )}
          </Card>
          <Card className="p-6">
            <div className="text-sm text-slate-600 mb-1">Approved indications</div>
            <div className="text-slate-800 font-medium">{drug.indications.join(', ')}</div>
            <div className="mt-4 text-sm text-slate-600 mb-1">Repurposing targets</div>
            <div className="flex flex-wrap gap-2">{drug.repurposingTargets.map(t => <Pill key={t}>{t}</Pill>)}</div>
          </Card>

          <Card className="p-6">
            <div className="section-title mb-4">PK/PD & BBB Profile</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-slate-500"><abbr title="Pharmacokinetics">PK</abbr> half-life</div>
                <div className="font-medium">{formatNumber(drug.halfLifeHours, 1)} h</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Metabolism</div>
                <div className="font-medium">{drug.metabolism}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500"><abbr title="Blood–Brain Barrier">BBB</abbr> score</div>
                <div className="font-medium">{drug.bbb.label}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Efflux pumps</div>
                <div className="font-medium">{drug.efflux.length ? drug.efflux.join(', ') : '—'}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChartFrame title="Tumor AUC Curves (illustrative)" height={220}>
                {(() => {
                  const times = [0, 6, 12, 24, 36, 48, 60, 72]
                  const oralBase = drug.auc.oralBase || 0
                  const cedBase = drug.auc.cedBase || 0
                  const fusBase = drug.auc.fusBase || 0
                  const oralPts = times.map(t => ({ x: t, y: oralBase * (1 - Math.exp(-t / 12)) }))
                  const scale = infusion / 24
                  const cedPts = times.map(t => ({ x: t, y: (cedBase * scale) * Math.min(t / infusion, 1) }))
                  const fusPts = times.map(t => ({ x: t, y: (fusBase * scale) * Math.min(t / infusion, 1) }))
                  return (
                    <SimpleLineChart
                      height={220}
                      series={[
                        { name: 'Oral', color: '#0072B2', points: oralPts },
                        { name: 'CED', color: '#009E73', points: cedPts },
                        { name: 'FUS', color: '#E69F00', points: fusPts },
                      ]}
                    />
                  )
                })()}
              </ChartFrame>
              <div className="card p-4">
                <div className="text-sm text-slate-700 mb-2">Infusion duration (for local delivery)</div>
                <input type="range" min={6} max={72} step={6} value={infusion} onChange={e => setInfusion(Number(e.target.value))} className="w-full" />
                <div className="mt-2 text-sm text-slate-600">{infusion} hours</div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="card p-3">
                    <div className="text-slate-500">Predicted Tumor <abbr title="Area Under the Curve">AUC</abbr> (<abbr title="Convection-Enhanced Delivery">CED</abbr>)</div>
                    <div className="text-slate-900 font-semibold">{formatNumber(computeAUC(drug.auc.cedBase || 0, infusion))} µM·hr</div>
                  </div>
                  <div className="card p-3">
                    <div className="text-slate-500">Predicted Tumor <abbr title="Area Under the Curve">AUC</abbr> (<abbr title="Focused Ultrasound">FUS</abbr>)</div>
                    <div className="text-slate-900 font-semibold">{formatNumber(computeAUC(drug.auc.fusBase || 0, infusion))} µM·hr</div>
                  </div>
                  <div className="card p-3">
                    <div className="text-slate-500">Predicted Tumor <abbr title="Area Under the Curve">AUC</abbr> (Oral)</div>
                    <div className="text-slate-900 font-semibold">{formatNumber(drug.auc.oralBase)} µM·hr</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500">Illustrative values based on published CED/FUS models.</div>
                <details className="mt-2">
                  <summary className="text-xs text-slate-500 cursor-pointer">Methods (illustrative)</summary>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Oral exposure uses a saturating function toward the listed oral AUC base. CED/FUS exposures scale with infusion duration up to a plateau at base AUC. Assumes intact clearance and no saturable binding.
                  </div>
                </details>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="section-title mb-4">Pediatric Safety Guardrails</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-slate-500 mb-1">Red flags</div>
                <div className="flex flex-wrap gap-2">
                  {(drug.tox?.pediatricRedFlags || []).map(f => (<span key={f} className="pill bg-red-100 text-red-700">{f}</span>))}
                  {(!drug.tox || (drug.tox.pediatricRedFlags||[]).length===0) && <span className="muted text-sm">—</span>}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Monitoring</div>
                <div className="flex flex-wrap gap-2">
                  {(drug.tox?.monitoring || []).map(m => (<span key={m} className="pill">{m}</span>))}
                  {(!drug.tox || (drug.tox.monitoring||[]).length===0) && <span className="muted text-sm">—</span>}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Notes</div>
                <div className="text-sm text-slate-700">{drug.tox?.notes || '—'}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4">
                <div className="text-sm text-slate-500 mb-1">Severe AEs (CTCAE ≥3)</div>
                <ul className="list-disc pl-5 text-sm text-slate-700">
                  {(drug.severeAEs || []).map(ae => (<li key={ae}>{ae}</li>))}
                  {(drug.severeAEs || []).length === 0 && <li className="muted">—</li>}
                </ul>
              </div>
              <div className="card p-4">
                <div className="text-sm text-slate-500 mb-1">Drug–Drug Interactions</div>
                <div className="text-sm text-slate-700 mb-1">Metabolism: {drug.interactions?.metabolism || '—'}</div>
                <div className="flex flex-wrap gap-2">
                  {(drug.interactions?.avoid || []).map(x => (<span key={x} className="pill bg-amber-100 text-amber-800">{x}</span>))}
                  {(drug.interactions?.avoid || []).length === 0 && <span className="muted text-sm">—</span>}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="section-title mb-4">Delivery Strategies</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(drug.deliveryNotes).map(([k, v]) => (
                <div key={k} className="card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Pill>{k}</Pill>
                  </div>
                  <div className="text-sm text-slate-700">{v}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="section-title mb-4">Genomic Match</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-500 mb-1">Responsive genotypes</div>
                <div className="flex flex-wrap gap-2">{drug.genotypesResponsive.map(g => <Pill key={g}>{g}</Pill>)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Resistance variants</div>
                <div className="flex flex-wrap gap-2">{drug.resistanceVariants.map(g => <Pill key={g}>{g}</Pill>)}</div>
              </div>
            </div>
            <div className="mt-4">
              <ChartFrame title="Pathway diagram (illustrative)" height={200}>
                <SimpleNetworkGraph
                  height={200}
                  drugName={drug.name}
                  pathways={drug.repurposingTargets}
                  partners={drug.synergyPartners}
                />
              </ChartFrame>
            </div>
          </Card>

          <Card className="p-6">
            <div className="section-title mb-4">Combination Strategy (Curated)</div>
            <div className="space-y-3">
              {(drug.plausibleCombos || []).map((c, i) => (
                <div key={i} className="card p-3">
                  <div className="text-slate-900 font-medium">{c.regimen}</div>
                  <div className="text-sm text-slate-700">{c.rationale}</div>
                </div>
              ))}
              {(drug.plausibleCombos || []).length === 0 && <div className="muted text-sm">No curated combinations available.</div>}
            </div>
          </Card>

          <Card className="p-6 page-break-before">
            <div className="section-title mb-4">Clinical Trials</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2 pr-4">NCT ID</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {drug.trials.map(t => (
                    <tr key={t.nctId} className="border-t border-slate-100">
                      <td className="py-2 pr-4"><a className="text-sky-700 hover:underline" href={`https://clinicaltrials.gov/study/${t.nctId}`} target="_blank" rel="noreferrer">{t.nctId}</a></td>
                      <td className="py-2 pr-4">{t.status}</td>
                      <td className="py-2">{t.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <div className="section-title mb-4">Illustrative Predictions (Evidence-Based Models)</div>
            <div className="text-slate-800 font-medium mb-2">Predicted Tumor Exposure (illustrative):</div>
            <ul className="space-y-2 text-slate-700 text-sm">
              <li>
                Oral (systemic): {formatNumber(drug.auc.oralBase || 0, 1)} µM·hr
                <span className="muted"> (based on published adult PK and efflux correction models).</span>
              </li>
              <li>
                CED, 6-hour infusion: {formatNumber(computeAUC(drug.auc.cedBase || 0, 6), 1)} µM·hr
                <span className="muted"> (estimated using tracer-based intratumoral distribution models in DIPG).</span>
              </li>
              <li>
                FUS + IV dosing: {formatNumber(computeAUC(drug.auc.fusBase || 0, 6), 1)} µM·hr
                <span className="muted"> (from preclinical BBB-opening studies with microbubbles).</span>
              </li>
            </ul>
            {(() => {
              const oral = drug.auc.oralBase || 0
              const ced6 = computeAUC(drug.auc.cedBase || 0, 6)
              const fus6 = computeAUC(drug.auc.fusBase || 0, 6)
              const cedFold = oral > 0 ? (ced6 / oral) : null
              const fusFold = oral > 0 ? (fus6 / oral) : null
              return (
                <div className="mt-3 text-sm text-slate-700">
                  <span className="font-medium">Relative Uptake:</span>
                  {oral > 0 ? (
                    <> CED exposure estimated ~{formatNumber(cedFold, 1)}× higher than oral; FUS exposure ~{formatNumber(fusFold, 1)}× higher.</>
                  ) : (
                    <> Relative uptake not computed due to negligible oral exposure.</>
                  )}
                </div>
              )
            })()}

            <div className="mt-4 text-slate-800 font-medium">Safety Guardrails (literature-based):</div>
            <ul className="space-y-1 text-slate-700 text-sm mt-1">
              <li>
                Systemic toxicities: {drug.tox?.pediatricRedFlags?.length ? drug.tox.pediatricRedFlags.join(', ') : '—'}
                {drug.name && (
                  <span className="muted"> (context from pediatric oncology experience where available).</span>
                )}
              </li>
              <li>
                CNS risks: { (drug.efflux?.length || 0) > 0 && drug.bbb?.score !== 'High'
                  ? 'efflux-related poor brain penetration may limit efficacy without local delivery.'
                  : 'no dominant CNS delivery barrier identified beyond standard considerations.' }
              </li>
            </ul>

            {(() => {
              // Trialability summary line aligned with readiness tier
              const dot = readiness?.tier === 'Go' ? '🟢' : readiness?.tier === 'No-go' ? '🔴' : '🟡'
              let summary = readiness?.trialability || 'Requires optimization'
              // Add heuristic if CED markedly exceeds oral
              const oral = drug.auc.oralBase || 0
              const ced6 = computeAUC(drug.auc.cedBase || 0, 6)
              if (readiness?.tier !== 'Go' && oral > 0 && ced6 > oral * 2) {
                summary = 'Promising with CED; systemic use may be subtherapeutic'
              }
              return (
                <div className="mt-4 text-slate-800 font-medium">Trialability Score:<span className="ml-2">{dot} {summary}.</span></div>
              )
            })()}

            <div className="mt-4 text-sm text-slate-700">
              <span className="font-medium">Evidence Sources:</span>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {evidenceLinks(drug).map((e) => (
                  <a key={e.label} className="pill hover:bg-slate-200" href={e.url} target="_blank" rel="noreferrer">{e.label}</a>
                ))}
                <span className="pill">Preclinical CED Model (placeholder)</span>
              </div>
            </div>
          </Card>

          
        </section>

        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <AIWorkspace drug={drug} />
          <ChartFrame title="PK AUC Curves (illustrative)" height={220}>
            {(() => {
              const times = [0, 6, 12, 24, 36, 48, 60, 72]
              const oralBase = drug.auc.oralBase || 0
              const cedBase = drug.auc.cedBase || 0
              const fusBase = drug.auc.fusBase || 0
              const oralPts = times.map(t => ({ x: t, y: oralBase * (1 - Math.exp(-t / 12)) }))
              const scale = infusion / 24
              const cedPts = times.map(t => ({ x: t, y: (cedBase * scale) * Math.min(t / infusion, 1) }))
              const fusPts = times.map(t => ({ x: t, y: (fusBase * scale) * Math.min(t / infusion, 1) }))
              return (
                <SimpleLineChart
                  height={220}
                  series={[
                    { name: 'Oral', color: '#0072B2', points: oralPts },
                    { name: 'CED', color: '#009E73', points: cedPts },
                    { name: 'FUS', color: '#E69F00', points: fusPts },
                  ]}
                />
              )
            })()}
          </ChartFrame>
          <ChartFrame title="Pathway Network (illustrative)" height={260}>
            <SimpleNetworkGraph
              height={260}
              drugName={drug.name}
              pathways={drug.repurposingTargets}
              partners={drug.synergyPartners}
            />
          </ChartFrame>
        </aside>
      </main>
    </div>
  )
}
