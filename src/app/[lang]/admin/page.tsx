'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface OverviewData {
  articles: Array<{ id: string; slug: string; category: string; icon: string; sort_order: number }>
  languages: Array<{ code: string; name: string; native_name: string; flag: string }>
  matrix: Record<string, Record<string, string>>
  stats: {
    totalArticles: number
    totalLanguages: number
    totalTranslations: number
    expectedTranslations: number
    published: number
    outdated: number
    missing: number
    glossaryTerms: number
  }
  recentJobs: any[]
}

const STATUS_ICONS: Record<string, string> = {
  published: '✅',
  translated: '✅',
  auto_translated: '🤖',
  reviewed: '✅',
  draft: '📝',
  outdated: '⚠️',
  pending: '⏳',
}

function getStatusIcon(status: string | undefined): string {
  if (!status) return '❌'
  return STATUS_ICONS[status] || '❓'
}

export default function AdminOverviewPage() {
  const params = useParams()
  const lang = params.lang as string
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [translating, setTranslating] = useState<string | null>(null)

  const serviceKey = typeof window !== 'undefined' ? localStorage.getItem('spy-admin-key') || '' : ''

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const key = localStorage.getItem('spy-admin-key')
      if (!key) {
        promptForKey()
        return
      }
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${key}` },
      })
      if (res.status === 401) {
        promptForKey()
        return
      }
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function promptForKey() {
    const key = prompt('Enter admin key (Supabase service role key):')
    if (key) {
      localStorage.setItem('spy-admin-key', key)
      setLoading(true)
      fetchData()
    } else {
      setError('Admin key required')
    }
  }

  async function handleTranslate(articleId: string, slug: string) {
    const key = localStorage.getItem('spy-admin-key')
    if (!key) return
    setTranslating(slug)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article_id: articleId }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      alert(`Translation complete: ${json.results?.length || 0} languages`)
      fetchData()
    } catch (err: any) {
      alert(`Translation failed: ${err.message}`)
    } finally {
      setTranslating(null)
    }
  }

  if (loading) return <div className="admin-loading">Loading...</div>
  if (error) return <div className="admin-error">{error}</div>
  if (!data) return null

  return (
    <div>
      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.stats.totalArticles}</div>
          <div className="admin-stat-label">Articles</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.stats.totalLanguages}</div>
          <div className="admin-stat-label">Languages</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.stats.published}</div>
          <div className="admin-stat-label">Translated</div>
        </div>
        <div className="admin-stat-card" style={data.stats.outdated > 0 ? { borderColor: 'var(--warning)' } : {}}>
          <div className="admin-stat-value" style={data.stats.outdated > 0 ? { color: 'var(--warning)' } : {}}>{data.stats.outdated}</div>
          <div className="admin-stat-label">Outdated</div>
        </div>
        <div className="admin-stat-card" style={data.stats.missing > 0 ? { borderColor: 'var(--danger)' } : {}}>
          <div className="admin-stat-value" style={data.stats.missing > 0 ? { color: 'var(--danger)' } : {}}>{data.stats.missing}</div>
          <div className="admin-stat-label">Missing</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.stats.glossaryTerms}</div>
          <div className="admin-stat-label">Glossary Terms</div>
        </div>
      </div>

      {/* Translation Matrix */}
      <h2 className="admin-section-title">Translation Matrix</h2>
      <div className="admin-matrix-wrapper">
        <table className="admin-matrix">
          <thead>
            <tr>
              <th>Article</th>
              {data.languages.map(l => (
                <th key={l.code} title={l.name}>
                  <span className="admin-matrix-flag">{l.flag}</span>
                  <span className="admin-matrix-code">{l.code.toUpperCase()}</span>
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.articles.map(article => (
              <tr key={article.slug}>
                <td>
                  <Link href={`/${lang}/admin/articles/${article.id}`} className="admin-article-link">
                    <span>{article.icon}</span> {article.slug}
                  </Link>
                </td>
                {data.languages.map(l => (
                  <td key={l.code} className="admin-matrix-cell" title={data.matrix[article.slug]?.[l.code] || 'missing'}>
                    {getStatusIcon(data.matrix[article.slug]?.[l.code])}
                  </td>
                ))}
                <td>
                  <button
                    className="admin-btn admin-btn-sm"
                    onClick={() => handleTranslate(article.id, article.slug)}
                    disabled={translating === article.slug}
                  >
                    {translating === article.slug ? '...' : 'Translate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="admin-legend">
        <span>✅ Published/Translated</span>
        <span>🤖 Auto-translated</span>
        <span>📝 Draft</span>
        <span>⚠️ Outdated</span>
        <span>⏳ Pending</span>
        <span>❌ Missing</span>
      </div>

      {/* Recent Jobs */}
      {data.recentJobs.length > 0 && (
        <>
          <h2 className="admin-section-title">Recent Jobs</h2>
          <div className="admin-jobs-mini">
            {data.recentJobs.map((job: any) => (
              <div key={job.id} className="admin-job-row">
                <span className={`admin-job-status admin-job-status--${job.status}`}>{job.status}</span>
                <span>{job.target_language?.toUpperCase()}</span>
                <span className="admin-job-time">{new Date(job.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
