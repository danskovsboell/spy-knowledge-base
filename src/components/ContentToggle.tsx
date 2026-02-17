'use client'

import { useState, useEffect, useMemo } from 'react'

type ViewMode = 'support' | 'technical'

interface ContentToggleProps {
  content: string
  className?: string
}

/**
 * ArticleContent with Support/Technisch toggle.
 * 
 * Content sections can be tagged with data-view attributes:
 *   <div data-view="support">Only visible in Support mode</div>
 *   <div data-view="technical">Only visible in Technisch mode</div>
 *   <div data-view="both">Always visible (same as no attribute)</div>
 * 
 * If the content has NO data-view="technical" sections, no toggle is shown.
 */
export default function ContentToggle({ content, className }: ContentToggleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('support')

  const hasTechnicalContent = useMemo(() => {
    return /data-view\s*=\s*["']technical["']/.test(content)
  }, [content])

  // Process content: inject CSS classes based on current view mode
  const processedContent = useMemo(() => {
    if (!hasTechnicalContent) return content

    // Add a wrapper class that CSS uses to show/hide sections
    return content
  }, [content, hasTechnicalContent])

  if (!hasTechnicalContent) {
    return (
      <div
        className={`article-content ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  return (
    <div className={className || ''}>
      <div className="content-toggle-bar">
        <div className="content-toggle-wrapper">
          <button
            className={`content-toggle-btn ${viewMode === 'support' ? 'active' : ''}`}
            onClick={() => setViewMode('support')}
          >
            <span className="toggle-icon">💡</span>
            Support
          </button>
          <button
            className={`content-toggle-btn ${viewMode === 'technical' ? 'active' : ''}`}
            onClick={() => setViewMode('technical')}
          >
            <span className="toggle-icon">⚙️</span>
            Technisch
          </button>
        </div>
        <span className="content-toggle-hint">
          {viewMode === 'support'
            ? 'Praktische workflow & handleidingen'
            : 'API details, code & developer info'}
        </span>
      </div>
      <div
        className={`article-content view-mode-${viewMode}`}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </div>
  )
}
