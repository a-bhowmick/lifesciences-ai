export function formatNumber(n, digits = 1) {
  return Number(n).toFixed(digits)
}

export function computeAUC(base, infusionHours) {
  // Simple illustrative scaling: linear with infusion duration relative to 24h
  const scale = infusionHours / 24
  return base * scale
}

export function computeRanking(drug, prefs) {
  // Base on BBB, route match, genotype match
  let score = drug.bbb.numeric || 50
  if (prefs.route && drug.suggestedRoutes.includes(prefs.route)) score += 15
  if (prefs.genotype) {
    if (drug.genotypesResponsive.includes(prefs.genotype)) score += 15
    if (drug.resistanceVariants.includes(prefs.genotype)) score -= 10
  }
  // Familiarity boost for well-known repurposed agents
  const hero = ['trametinib', 'panobinostat', 'metformin', 'everolimus']
  if (hero.includes((drug.name || '').toLowerCase())) score += 6
  return score
}

export function explainRanking(drug, prefs) {
  const reasons = []
  reasons.push(`BBB contribution: ${drug.bbb?.label || 'Unknown'} (~${drug.bbb?.numeric ?? 50})`)
  if (prefs.route && drug.suggestedRoutes.includes(prefs.route)) reasons.push(`Route match: ${prefs.route} (+15)`)
  if (prefs.genotype) {
    if ((drug.genotypesResponsive || []).includes(prefs.genotype)) reasons.push(`Genotype responsive: ${prefs.genotype} (+15)`)
    if ((drug.resistanceVariants || []).includes(prefs.genotype)) reasons.push(`Genotype resistance: ${prefs.genotype} (−10)`)
  }
  const hero = ['trametinib', 'panobinostat', 'metformin', 'everolimus']
  if (hero.includes((drug.name || '').toLowerCase())) reasons.push('Clinician-familiar repurposed agent (+6)')
  return reasons
}

export function evidenceLinks(drug) {
  const fda = `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=BasicSearch.process&searchTerm=${encodeURIComponent(drug.name)}`
  const dailymed = `https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(drug.name)}`
  const pubchem = `https://pubchem.ncbi.nlm.nih.gov/compound/${encodeURIComponent(drug.name)}`
  const trials = (drug.trials || []).map(t => ({ label: `ClinicalTrials.gov (${t.nctId})`, url: `https://clinicaltrials.gov/study/${t.nctId}` }))
  return [
    { label: 'FDA Label', url: fda },
    { label: 'DailyMed', url: dailymed },
    { label: 'PubChem', url: pubchem },
    ...trials,
  ]
}

export function computeReadiness(drug, genotypeContext) {
  // Heuristic readiness score with pediatric guardrails
  const bbb = drug.bbb?.numeric ?? 50
  const oral = drug.auc?.oralBase ?? 0
  const ced = drug.auc?.cedBase ?? 0
  const fus = drug.auc?.fusBase ?? 0
  const exposure = Math.max(oral, ced, fus)
  let score = bbb
  if (drug.isFDAApproved) score += 10
  if (drug.approvedForOncology) score += 10
  if (exposure >= 1.0) score += 10
  if ((drug.genotypesResponsive || []).length > 0) score += 5
  if (genotypeContext) {
    if ((drug.genotypesResponsive || []).includes(genotypeContext)) score += 10
    if ((drug.resistanceVariants || []).includes(genotypeContext)) score -= 10
  }
  // pediatric red flags reduce score
  const flags = (drug.tox?.pediatricRedFlags || []).map(s => s.toLowerCase())
  if (flags.some(f => f.includes('seizure'))) score -= 15
  if (flags.some(f => f.includes('marrow') || f.includes('neutrop'))) score -= 10
  if (flags.some(f => f.includes('developmental'))) score -= 15
  score = Math.max(0, Math.min(100, score))
  let tier = 'Consider'
  if (score >= 70) tier = 'Go'
  else if (score < 50) tier = 'No-go'
  // Trialability string
  let trialability = 'Needs BBB carrier optimization'
  if (tier === 'Go' && bbb >= 60 && exposure >= 1.0) {
    trialability = 'Ready for mouse xenograft'
  } else if (tier === 'No-go' && bbb < 40 && exposure < 0.8) {
    trialability = 'Not brain-penetrant, low priority'
  }
  const rationale = []
  rationale.push(`BBB profile: ${drug.bbb?.label || 'Unknown'}`)
  rationale.push(`Exposure proxy (AUC base): ${exposure}`)
  if (drug.isFDAApproved) rationale.push('FDA-approved background')
  if (drug.approvedForOncology) rationale.push('Oncology experience')
  if ((drug.genotypesResponsive || []).length) rationale.push(`Genomic signal: ${drug.genotypesResponsive.join(', ')}`)
  if (flags.length) rationale.push(`Pediatric red flags: ${drug.tox.pediatricRedFlags.join(', ')}`)
  return { score, tier, trialability, rationale }
}
