import React from 'react'
import { formatNumber, computeAUC, computeReadiness } from '../utils/format'

export default function AIWorkspace({ drug }) {
  const [mode, setMode] = React.useState('CED')
  const [infusion, setInfusion] = React.useState(24)
  const [running, setRunning] = React.useState(false)
  const [result, setResult] = React.useState(null)
  const [worklog, setWorklog] = React.useState([])
  const [scenarios, setScenarios] = React.useState([])
  const [selected, setSelected] = React.useState(new Set())
  const [suggestions, setSuggestions] = React.useState([])

  const ts = () => new Date().toLocaleString()

  const addLog = (title, details) => {
    setWorklog(w => [{ time: ts(), title, details }, ...w])
  }

  const runModeling = async () => {
    setRunning(true)
    addLog('Modeling started', `Scenario: ${mode}${mode !== 'Oral' ? `, ${infusion}h infusion` : ''}`)
    setTimeout(() => {
      const oral = drug.auc?.oralBase || 0
      const ced = computeAUC(drug.auc?.cedBase || 0, Math.min(72, Math.max(6, infusion)))
      const fus = computeAUC(drug.auc?.fusBase || 0, Math.min(72, Math.max(6, infusion)))
      const relCED = oral > 0 ? ced / oral : null
      const relFUS = oral > 0 ? fus / oral : null
      let verdict = 'Requires optimization'
      if (mode === 'CED' && relCED && relCED >= 2) verdict = 'Promising with CED; systemic may be subtherapeutic'
      else if (mode === 'FUS' && relFUS && relFUS >= 2) verdict = 'Promising with FUS-assisted delivery'
      else if (mode === 'Oral' && oral < 1.0) verdict = 'Systemic exposure likely subtherapeutic'
      const readiness = computeReadiness(drug)
      const res = { oral, ced, fus, relCED, relFUS, verdict, readiness }
      setResult(res)
      addLog('Modeling complete', `Oral ${formatNumber(oral,1)} µM·hr; CED ${formatNumber(ced,1)}; FUS ${formatNumber(fus,1)}. Verdict: ${verdict}.`)
      setRunning(false)
    }, 500)
  }

  const saveScenario = () => {
    if (!result) return
    const name = `${mode}${mode !== 'Oral' ? ` ${infusion}h` : ''}`
    const id = `${Date.now()}`
    setScenarios(s => [{ id, name, mode, infusion, result }, ...s])
    addLog('Scenario saved', name)
  }

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const compareTwo = () => {
    const ids = Array.from(selected)
    if (ids.length !== 2) return null
    const [a, b] = ids.map(id => scenarios.find(s => s.id === id)).filter(Boolean)
    if (!a || !b) return null
    const delta = (x, y) => (x == null || y == null) ? null : (x - y)
    return {
      a, b,
      dOral: delta(a.result.oral, b.result.oral),
      dCed: delta(a.result.ced, b.result.ced),
      dFus: delta(a.result.fus, b.result.fus),
    }
  }

  const suggestSynergies = () => {
    const curated = (drug.plausibleCombos || []).map(c => ({ type: 'Curated', ...c }))
    const generated = []
    if ((drug.efflux || []).length && (drug.auc?.fusBase || 0) > 0) {
      generated.push({ type: 'Heuristic', regimen: `${drug.name} + FUS (IV)`, rationale: 'Efflux liability; FUS-assisted BBB opening may improve parenchymal uptake.' })
    }
    setSuggestions([...curated, ...generated])
    addLog('Synergy suggestions generated', `${curated.length} curated, ${generated.length} heuristic`)
  }

  const cmp = compareTwo()

  return (
    <div className="card p-4 no-print">
      <div className="section-title mb-2">AI Workspace</div>
      <div className="text-sm text-slate-700 mb-2">Co-thinking tools for delivery modeling and synergy exploration.</div>

      <div className="grid grid-cols-1 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Delivery:</span>
          <select value={mode} onChange={e => setMode(e.target.value)} className="border rounded-lg px-2 py-1">
            <option>Oral</option>
            <option>CED</option>
            <option>FUS</option>
          </select>
          {(mode === 'CED' || mode === 'FUS') && (
            <>
              <span className="text-slate-600">Infusion:</span>
              <input type="range" min={6} max={72} step={6} value={infusion} onChange={e => setInfusion(Number(e.target.value))} />
              <span className="muted">{infusion}h</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={runModeling} disabled={running}>{running ? 'Running…' : 'Run Modeling'}</button>
          <button className="btn" onClick={saveScenario} disabled={!result}>Save Scenario</button>
          <button className="btn" onClick={suggestSynergies}>Suggest Synergies</button>
        </div>

        {result && (
          <div className="card p-3">
            <div className="text-slate-800 font-medium mb-1">Latest Modeling Summary</div>
            <div className="text-slate-700">Oral: {formatNumber(result.oral,1)} µM·hr; CED: {formatNumber(result.ced,1)}; FUS: {formatNumber(result.fus,1)}</div>
            <div className="text-slate-700">Trialability: {result.verdict}. Readiness: {result.readiness?.tier} ({Math.round(result.readiness?.score || 0)}/100)</div>
          </div>
        )}

        {scenarios.length > 0 && (
          <div className="card p-3">
            <div className="text-slate-800 font-medium mb-1">Saved Scenarios</div>
            <ul className="text-sm text-slate-700 space-y-1">
              {scenarios.map(s => (
                <li key={s.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} />
                  <span className="font-medium">{s.name}</span>
                  <span className="muted">Oral {formatNumber(s.result.oral,1)}, CED {formatNumber(s.result.ced,1)}, FUS {formatNumber(s.result.fus,1)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <button className="btn" disabled={(selected.size !== 2)}>Compare Selected</button>
            </div>
            {cmp && (
              <div className="mt-3 text-sm text-slate-700">
                <div className="font-medium mb-1">Comparison</div>
                <div>{cmp.a.name} vs {cmp.b.name}</div>
                <div>Δ Oral: {formatNumber(cmp.dOral || 0,1)}; Δ CED: {formatNumber(cmp.dCed || 0,1)}; Δ FUS: {formatNumber(cmp.dFus || 0,1)}</div>
              </div>
            )}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="card p-3">
            <div className="text-slate-800 font-medium mb-1">Synergy Suggestions</div>
            <ul className="text-sm text-slate-700 space-y-1">
              {suggestions.map((s, i) => (
                <li key={i}><span className="badge bg-slate-100 text-slate-700 mr-2">{s.type}</span><span className="font-medium">{s.regimen}</span> — {s.rationale}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="card p-3">
          <div className="text-slate-800 font-medium mb-1">AI Worklog</div>
          {worklog.length === 0 && <div className="muted text-sm">No activity yet.</div>}
          <ul className="text-xs text-slate-600 space-y-1">
            {worklog.map((e, i) => (
              <li key={i}><span className="muted">[{e.time}]</span> <span className="font-medium">{e.title}:</span> {e.details}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

