import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Card from './Card'
import Badge from './Badge'
import Pill from './Pill'
import BBBScore from './BBBScore'

export default function DrugCard({ drug, rank, recap, prefsReasons }) {
  const location = useLocation()
  const search = location.search || ''
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">{rank != null ? `${rank}. ` : ''}{drug.name}</h3>
            <Badge color={drug.isFDAApproved ? 'green' : 'slate'}>
              {drug.isFDAApproved ? 'FDA-Approved' : 'Investigational'}
            </Badge>
            {drug.approvedForOncology && <Badge color="violet">Oncology</Badge>}
          </div>
          <div className="mt-1 text-sm text-slate-600">{drug.indications.join(', ')}</div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={{ pathname: `/drug/${drug.id}`, search }} className="btn">View Details</Link>
          <button className="btn" disabled title="Coming soon">Compare</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <BBBScore score={drug.bbb.score} label={drug.bbb.label} />
          <div className="text-sm text-slate-700">Efflux: <span className="muted">{drug.efflux.join(', ') || '—'}</span></div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-slate-700">PK t1/2: <span className="muted">{drug.halfLifeHours} h</span></div>
          <div className="text-sm text-slate-700">Route: <span className="muted">{drug.roa.join(', ')}</span></div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-slate-700">Suggested Delivery</div>
          <div className="flex flex-wrap gap-2">
            {drug.suggestedRoutes.map(r => (<Pill key={r}>{r}</Pill>))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-slate-700">Synergy</div>
          <div className="flex flex-wrap gap-2">
            {drug.synergyPartners.map(p => (<Pill key={p}>{p}</Pill>))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-700">Trials:</span>
        {drug.trials.map(t => (
          <a key={t.nctId} href={`https://clinicaltrials.gov/study/${t.nctId}`} target="_blank" rel="noreferrer" className="pill hover:bg-slate-200">
            {t.nctId}
          </a>
        ))}
      </div>

      {prefsReasons && prefsReasons.length > 0 && (
        <details className="mt-3">
          <summary className="text-sm text-slate-600 cursor-pointer">Why ranked here</summary>
          <ul className="mt-2 text-sm text-slate-700 list-disc pl-5">
            {prefsReasons.map((r, i) => (<li key={i}>{r}</li>))}
          </ul>
        </details>
      )}
    </Card>
  )
}
