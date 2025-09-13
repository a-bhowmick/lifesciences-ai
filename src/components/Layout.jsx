import React from 'react'

export default function Layout({ left, center, right }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-slate-900 font-semibold">Repurposed Drug Discovery — Pediatric Neuro-Oncology</div>
          <div className="text-sm text-slate-500">Phase 3 — Command Center</div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        {left && <aside className="col-span-12 lg:col-span-3 space-y-4">{left}</aside>}
        {center && <section className="col-span-12 lg:col-span-6 space-y-4">{center}</section>}
        {right && <aside className="col-span-12 lg:col-span-3 space-y-4">{right}</aside>}
      </main>
    </div>
  )
}

