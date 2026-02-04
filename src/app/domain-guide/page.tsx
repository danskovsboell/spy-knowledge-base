'use client'

import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'

export default function DomainGuidePage() {
  const [content, setContent] = useState('')

  useEffect(() => {
    fetch('/spy-domain-guide.md')
      .then(r => r.text())
      .then(setContent)
      .catch(() => setContent('Kunne ikke indlæse domain guide.'))
  }, [])

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href="/">Oversigt</a> → Dokumentation → Domain Guide
        </div>
        <h1>SPY Domain Guide</h1>
        <p>Overordnet domæneguide for SPY&apos;s forretningsmodel, begreber og dataflows</p>
      </div>
      <div className="markdown-content">
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <p>Indlæser...</p>
        )}
      </div>
    </>
  )
}
