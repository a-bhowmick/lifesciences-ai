import React from 'react'

export default function Pill({ children, className = '' }) {
  return <span className={`pill ${className}`}>{children}</span>
}

