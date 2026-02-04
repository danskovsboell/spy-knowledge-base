'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Translation {
  id: string
  language_code: string
  title: string
  description: string
  content: string | null
  status: string
  translated_by: string | null
  translated_at: string | null
  source_hash: string | null
}

interface ArticleDetail {
  id: string
  slug: string
  category: string
  icon: string
  source_language: string
  kb_translations: Translation[]
}

export default function ArticleEditorPage() {
  const params = useParams()
  const router = useRouter()
  const lang = params.lang as string
  const id = params.id as string

  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [selectedLang, setSelectedLang] = useState('da')
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editContent, setEditContent] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  function getKey(): string {
    return localStorage.getItem('spy-admin-key') || ''
  }

  useEffect(() => {
    fetchArticle()
  }, [id])

  async function fetchArticle() {
    try {
      const key = getKey()
      if (!key) { setLoading(false); return }
      const res = await fetch(`/api/admin/articles?id=${id}`, {
        headers: { Authorization: `Bearer ${key}` },
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setArticle(json.article)

      // Load Danish (source) content for editing
      const da = json.article.kb_translations?.find((t: Translation) => t.language_code === 'da')
      if (da) {
        setEditTitle(da.title)
        setEditDesc(da.description || '')
        setEditContent(da.content || '')
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    const key = getKey()
    if (!key) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: id,
          title: editTitle,
          description: editDesc,
          content: editContent,
        }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      const outdatedMsg = json.outdatedLanguages?.length > 0
        ? ` (${json.outdatedLanguages.length} translations marked as outdated)`
        : ''
      setMessage(`Saved successfully${outdatedMsg}`)
      fetchArticle()
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleTranslateAll() {
    const key = getKey()
    if (!key) return
    setTranslating(true)
    setMessage(null)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article_id: id }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      const successful = json.results?.filter((r: any) => r.status === 'success').length || 0
      setMessage(`Translation complete: ${successful} languages translated`)
      fetchArticle()
    } catch (err: any) {
      setMessage(`Translation error: ${err.message}`)
    } finally {
      setTranslating(false)
    }
  }

  if (loading) return <div className="admin-loading">Loading article...</div>
  if (!article) return <div className="admin-error">Article not found</div>

  const currentTranslation = article.kb_translations?.find(t => t.language_code === selectedLang)

  return (
    <div>
      <div className="admin-editor-header">
        <Link href={`/${lang}/admin`} className="admin-back-link">← Back to Overview</Link>
        <h2 className="admin-editor-title">
          {article.icon} {article.slug}
          <span className="admin-editor-category">{article.category}</span>
        </h2>
      </div>

      {message && (
        <div className={`admin-message ${message.startsWith('Error') ? 'admin-message--error' : 'admin-message--success'}`}>
          {message}
        </div>
      )}

      {/* Source Editor (Danish) */}
      <div className="admin-editor-section">
        <h3 className="admin-section-title">Source Content (Danish)</h3>
        <div className="admin-editor-fields">
          <div className="admin-field">
            <label className="admin-label">Title</label>
            <input
              type="text"
              className="admin-input"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea
              className="admin-textarea admin-textarea--sm"
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              rows={3}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Content (Markdown/HTML)</label>
            <textarea
              className="admin-textarea"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              rows={12}
            />
          </div>
          <div className="admin-editor-actions">
            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="admin-btn admin-btn-secondary" onClick={handleTranslateAll} disabled={translating}>
              {translating ? 'Translating...' : 'Save & Translate All'}
            </button>
          </div>
        </div>
      </div>

      {/* Translations Viewer */}
      <div className="admin-editor-section">
        <h3 className="admin-section-title">Translations</h3>
        <div className="admin-translations-tabs">
          {article.kb_translations?.map(t => (
            <button
              key={t.language_code}
              className={`admin-tab ${selectedLang === t.language_code ? 'active' : ''} ${t.status === 'outdated' ? 'admin-tab--outdated' : ''}`}
              onClick={() => setSelectedLang(t.language_code)}
            >
              {t.language_code.toUpperCase()}
              <span className="admin-tab-status">
                {t.status === 'outdated' ? '⚠️' : t.status === 'auto_translated' ? '🤖' : '✅'}
              </span>
            </button>
          ))}
        </div>

        {currentTranslation ? (
          <div className="admin-translation-view">
            <div className="admin-translation-meta">
              <span>Status: <strong>{currentTranslation.status}</strong></span>
              {currentTranslation.translated_by && (
                <span>By: {currentTranslation.translated_by}</span>
              )}
              {currentTranslation.translated_at && (
                <span>At: {new Date(currentTranslation.translated_at).toLocaleString()}</span>
              )}
            </div>
            <div className="admin-field">
              <label className="admin-label">Title</label>
              <div className="admin-readonly">{currentTranslation.title}</div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Description</label>
              <div className="admin-readonly">{currentTranslation.description}</div>
            </div>
            {currentTranslation.content && (
              <div className="admin-field">
                <label className="admin-label">Content</label>
                <div className="admin-readonly admin-readonly--content">
                  {currentTranslation.content.substring(0, 500)}
                  {currentTranslation.content.length > 500 ? '...' : ''}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="admin-no-translation">No translation for {selectedLang.toUpperCase()}</div>
        )}
      </div>
    </div>
  )
}
