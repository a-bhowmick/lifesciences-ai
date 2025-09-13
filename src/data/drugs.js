// Curated dataset for pediatric neuro-oncology repurposing
// Notes: Trial IDs are provided as real NCT identifiers where widely referenced; details are illustrative.

export const drugs = [
  {
    id: 'dasatinib',
    name: 'Dasatinib',
    isFDAApproved: true,
    approvedForOncology: true,
    indications: ['CML', 'ALL'],
    repurposingTargets: ['PDGFR', 'SRC'],
    bbb: { score: 'Low', label: 'Low (efflux-limited)', numeric: 35 },
    efflux: ['P-gp', 'BCRP'],
    metabolism: 'CYP3A4',
    halfLifeHours: 4,
    roa: ['Oral'],
    suggestedRoutes: ['Systemic', 'FUS', 'CED'],
    synergyPartners: ['Everolimus'],
    plausibleCombos: [
      { regimen: 'Dasatinib + Everolimus', rationale: 'PDGFR/SRC + mTOR co-inhibition; evidence of synergy and improved CNS levels with mTOR inhibition.' }
    ],
    trials: [
      { nctId: 'NCT03352427', status: 'Completed', notes: 'Dasatinib + Everolimus in glioma (illustrative)' }
    ],
    genotypesResponsive: ['PDGFRA'],
    resistanceVariants: ['ABC transporter upregulation'],
    deliveryNotes: {
      Systemic: 'Oral dosing; limited by efflux pumps at BBB.',
      CED: 'Bypasses BBB; consider solubility and pH.',
      FUS: 'FUS-assisted BBB modulation may improve CNS exposure.',
      Intraventricular: 'Less favored; target distribution uncertain.',
      Nanoparticle: 'Investigational to evade efflux.'
    },
    tox: {
      pediatricRedFlags: ['Marrow suppression', 'Bleeding risk', 'Pleural effusion'],
      monitoring: ['CBC', 'LFTs', 'Fluid status'],
      notes: 'Hematologic toxicity is dose-limiting; CNS hemorrhage risk in context of tumor vascularity should be considered.'
    },
    severeAEs: ['Grade ≥3 thrombocytopenia', 'Neutropenia'],
    interactions: {
      metabolism: 'CYP3A4',
      avoid: ['Strong CYP3A4 inhibitors/inducers']
    },
    auc: { oralBase: 0.8, cedBase: 3.6, fusBase: 1.6 }
  },
  {
    id: 'panobinostat',
    name: 'Panobinostat',
    isFDAApproved: true,
    approvedForOncology: true,
    indications: ['Multiple Myeloma'],
    repurposingTargets: ['HDAC'],
    bbb: { score: 'Medium', label: 'Moderate (variable CNS exposure)', numeric: 55 },
    efflux: ['P-gp'],
    metabolism: 'CYP3A4 (minor)',
    halfLifeHours: 30,
    roa: ['Oral'],
    suggestedRoutes: ['CED', 'Systemic', 'FUS'],
    synergyPartners: ['Re-irradiation'],
    plausibleCombos: [
      { regimen: 'Panobinostat + ONC201', rationale: 'Epigenetic reprogramming plus DRD2/ClpP modulation in H3K27M glioma.' },
      { regimen: 'Panobinostat + Re-irradiation', rationale: 'Radiosensitization potential via chromatin remodeling.' }
    ],
    trials: [
      { nctId: 'NCT02717455', status: 'Completed', notes: 'Panobinostat in DIPG (illustrative)' }
    ],
    genotypesResponsive: ['H3K27M'],
    resistanceVariants: ['HDAC mutations (rare)'],
    deliveryNotes: {
      Systemic: 'Oral feasible; CNS levels variable.',
      CED: 'Favorable for local delivery; HDAC target enriched.',
      FUS: 'Potential to enhance parenchymal exposure.',
      Intraventricular: 'Consider CSF clearance.',
      Nanoparticle: 'Investigational.'
    },
    tox: {
      pediatricRedFlags: ['Marrow suppression', 'QT prolongation'],
      monitoring: ['CBC', 'ECG', 'Electrolytes'],
      notes: 'Hematologic toxicity common; monitor QT especially with other QT-prolonging agents.'
    },
    severeAEs: ['Grade ≥3 thrombocytopenia', 'Neutropenia'],
    interactions: {
      metabolism: 'CYP3A4 (minor)',
      avoid: ['QT-prolonging agents']
    },
    auc: { oralBase: 0.9, cedBase: 4.2, fusBase: 2.1 }
  },
  {
    id: 'everolimus',
    name: 'Everolimus',
    isFDAApproved: true,
    approvedForOncology: true,
    indications: ['TSC-related SEGA', 'Renal angiomyolipoma'],
    repurposingTargets: ['mTORC1'],
    bbb: { score: 'Medium', label: 'Moderate (brain-penetrant)', numeric: 60 },
    efflux: ['P-gp'],
    metabolism: 'CYP3A4',
    halfLifeHours: 30,
    roa: ['Oral'],
    suggestedRoutes: ['Systemic', 'FUS'],
    synergyPartners: ['Dasatinib'],
    plausibleCombos: [
      { regimen: 'Everolimus + Dasatinib', rationale: 'mTOR pathway blockade mitigates feedback; may improve dasatinib CNS exposure.' }
    ],
    trials: [
      { nctId: 'NCT01204450', status: 'Completed', notes: 'Everolimus in pediatric brain tumors (illustrative)' }
    ],
    genotypesResponsive: ['TSC1', 'TSC2'],
    resistanceVariants: ['PIK3CA activation'],
    deliveryNotes: {
      Systemic: 'Standard pediatric dosing experience exists.',
      CED: 'Local delivery not typical for mTOR inhibitor.',
      FUS: 'Rationale for enhanced delivery.',
      Intraventricular: 'Limited utility.',
      Nanoparticle: 'Investigational.'
    },
    tox: {
      pediatricRedFlags: ['Mucositis', 'Immunosuppression'],
      monitoring: ['CBC', 'Trough levels where applicable', 'Lipids', 'Glucose'],
      notes: 'Risk of infections; stomatitis common; consider growth impact in long courses.'
    },
    severeAEs: ['Serious infections', 'Stomatitis'],
    interactions: {
      metabolism: 'CYP3A4',
      avoid: ['Strong CYP3A4 inhibitors/inducers']
    },
    auc: { oralBase: 1.1, cedBase: 2.8, fusBase: 1.6 }
  },
  {
    id: 'onc201',
    name: 'ONC201 (Dordaviprone)',
    isFDAApproved: false,
    approvedForOncology: false,
    indications: ['Investigational'],
    repurposingTargets: ['DRD2 antagonist', 'ClpP agonist'],
    bbb: { score: 'High', label: 'High (CNS-penetrant)', numeric: 80 },
    efflux: [],
    metabolism: 'Non-CYP predominant',
    halfLifeHours: 8,
    roa: ['Oral'],
    suggestedRoutes: ['Systemic'],
    synergyPartners: ['Panobinostat'],
    plausibleCombos: [
      { regimen: 'ONC201 + Panobinostat', rationale: 'Orthogonal mechanisms; early signals in H3K27M context.' }
    ],
    trials: [
      { nctId: 'NCT03416530', status: 'Active', notes: 'H3K27M glioma' }
    ],
    genotypesResponsive: ['H3K27M'],
    resistanceVariants: ['DRD2 loss'],
    deliveryNotes: {
      Systemic: 'Oral; demonstrated CNS activity in H3K27M glioma.',
      CED: 'Not typical.',
      FUS: 'Not required given penetration.',
      Intraventricular: 'Not pursued.',
      Nanoparticle: 'Not required.'
    },
    tox: {
      pediatricRedFlags: ['GI upset'],
      monitoring: ['Clinical tolerance'],
      notes: 'Generally well tolerated in early pediatric use.'
    },
    severeAEs: [],
    interactions: {
      metabolism: 'Non-CYP predominant',
      avoid: []
    },
    auc: { oralBase: 1.6, cedBase: 0, fusBase: 0 }
  },
  {
    id: 'trametinib',
    name: 'Trametinib',
    isFDAApproved: true,
    approvedForOncology: true,
    indications: ['Melanoma', 'Solid tumors with BRAF V600'],
    repurposingTargets: ['MEK1/2'],
    bbb: { score: 'Medium', label: 'Moderate', numeric: 55 },
    efflux: ['P-gp'],
    metabolism: 'Non-CYP predominant',
    halfLifeHours: 120,
    roa: ['Oral'],
    suggestedRoutes: ['Systemic'],
    synergyPartners: ['Dabrafenib'],
    plausibleCombos: [
      { regimen: 'Trametinib + Dabrafenib', rationale: 'Clinically established doublet for BRAF V600E; pediatric applicability in LGG.' }
    ],
    trials: [
      { nctId: 'NCT02684058', status: 'Completed', notes: 'Pediatric LGG BRAF V600E' }
    ],
    genotypesResponsive: ['BRAF V600E'],
    resistanceVariants: ['NRAS activation'],
    deliveryNotes: {
      Systemic: 'Effective in BRAF-altered pediatric glioma.',
      CED: 'Not typical.',
      FUS: 'Optional.',
      Intraventricular: 'Not typical.',
      Nanoparticle: 'Investigational.'
    },
    tox: {
      pediatricRedFlags: ['Cardiomyopathy risk', 'Ocular toxicity'],
      monitoring: ['Echocardiogram', 'Ophthalmology exam'],
      notes: 'Monitor cardiac function and ocular symptoms; rash common.'
    },
    severeAEs: ['Cardiomyopathy', 'Retinal pigment epithelial detachment'],
    interactions: {
      metabolism: 'Non-CYP predominant',
      avoid: ['Caution with other cardiotoxic agents']
    },
    auc: { oralBase: 1.0, cedBase: 0, fusBase: 0 }
  },
  {
    id: 'bevacizumab',
    name: 'Bevacizumab',
    isFDAApproved: true,
    approvedForOncology: true,
    indications: ['Multiple solid tumors'],
    repurposingTargets: ['VEGF-A'],
    bbb: { score: 'Low', label: 'Large molecule; limited BBB', numeric: 25 },
    efflux: [],
    metabolism: 'Proteolysis',
    halfLifeHours: 360,
    roa: ['IV'],
    suggestedRoutes: ['Systemic'],
    synergyPartners: ['Irinotecan'],
    plausibleCombos: [
      { regimen: 'Bevacizumab + Irinotecan', rationale: 'Common salvage pairing; symptomatic edema benefit from anti-VEGF.' }
    ],
    trials: [
      { nctId: 'NCT01390948', status: 'Completed', notes: 'Pediatric brain tumors (illustrative)' }
    ],
    genotypesResponsive: [],
    resistanceVariants: ['VEGF pathway redundancy'],
    deliveryNotes: {
      Systemic: 'IV anti-VEGF; symptomatic edema benefit.',
      CED: 'Not suitable (antibody).',
      FUS: 'Investigational for antibody delivery.',
      Intraventricular: 'Not standard.',
      Nanoparticle: 'N/A.'
    },
    tox: {
      pediatricRedFlags: ['Hemorrhage', 'Hypertension', 'Proteinuria', 'Wound healing delay'],
      monitoring: ['Blood pressure', 'Urinalysis (protein)', 'Bleeding risk'],
      notes: 'Avoid around surgeries; monitor for hemorrhage and hypertension.'
    },
    severeAEs: ['CNS hemorrhage', 'Gastrointestinal perforation'],
    interactions: {
      metabolism: 'Proteolysis',
      avoid: ['Surgical procedures (perioperative)']
    },
    auc: { oralBase: 0, cedBase: 0, fusBase: 0 }
  }
  ,
  {
    id: 'metformin',
    name: 'Metformin',
    isFDAApproved: true,
    approvedForOncology: false,
    indications: ['Type 2 Diabetes Mellitus'],
    repurposingTargets: ['AMPK activation', 'mTOR axis (indirect)'],
    bbb: { score: 'Low', label: 'Limited BBB penetration', numeric: 35 },
    efflux: ['OCT transporters (uptake dependent)'],
    metabolism: 'Renal elimination (unchanged)',
    halfLifeHours: 6,
    roa: ['Oral'],
    suggestedRoutes: ['Systemic'],
    synergyPartners: ['Everolimus'],
    plausibleCombos: [
      { regimen: 'Metformin + Everolimus', rationale: 'AMPK activation complements mTORC1 inhibition; metabolic vulnerability exploitation.' }
    ],
    trials: [
      { nctId: 'NCT02149459', status: 'Completed', notes: 'Metformin in pediatric CNS tumors (illustrative context)' }
    ],
    genotypesResponsive: [],
    resistanceVariants: [],
    deliveryNotes: {
      Systemic: 'Well-tolerated; CNS exposure limited; signal may be systemic-metabolic.',
      CED: 'Not typical.',
      FUS: 'Not typical.',
      Intraventricular: 'Not applicable.',
      Nanoparticle: 'Investigational for CNS delivery.'
    },
    tox: {
      pediatricRedFlags: ['Lactic acidosis (rare, renal impairment)'],
      monitoring: ['Renal function', 'Clinical tolerance'],
      notes: 'Generally well tolerated; GI upset common.'
    },
    severeAEs: ['Lactic acidosis (rare)'],
    interactions: {
      metabolism: 'Renal elimination',
      avoid: ['Iodinated contrast (hold around imaging)']
    },
    auc: { oralBase: 0.6, cedBase: 0, fusBase: 0 }
  }
]

export function getDrugById(id) {
  return drugs.find(d => d.id === id)
}
