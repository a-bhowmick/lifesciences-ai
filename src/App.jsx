import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import CommandCenter from './pages/CommandCenter'
import DrugDetail from './pages/DrugDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/results" element={<CommandCenter />} />
      <Route path="/drug/:id" element={<DrugDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

