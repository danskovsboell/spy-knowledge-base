'use client'

import React, { useState } from 'react'

/* ─── SPY dark mode color palette ─── */
const C = {
  dark:       '#0d0d0d',
  black:      '#1a1a1a',
  card:       '#222222',
  cardHover:  '#2a2a2a',
  elevated:   '#2d2d2d',
  subtle:     '#1f1f1f',
  gold:       '#c9a227',
  goldLight:  '#d4b652',
  goldDark:   '#a68820',
  white:      '#ffffff',
  grayLight:  '#cccccc',
  gray:       '#888888',
  grayDark:   '#333333',
  dimmed:     '#666666',
  border:     '#333333',
  blue:       '#3498db',
  blueBg:     'rgba(52, 152, 219, 0.15)',
  purple:     '#9b59b6',
  purpleBg:   'rgba(155, 89, 182, 0.15)',
  green:      '#27ae60',
  greenBg:    'rgba(39, 174, 96, 0.12)',
  orange:     '#e67e22',
  orangeBg:   'rgba(230, 126, 34, 0.12)',
  red:        '#e74c3c',
  cyan:       '#1abc9c',
  cyanBg:     'rgba(26, 188, 156, 0.12)',
}

const section: React.CSSProperties = { maxWidth: 1000, margin: '0 auto', padding: '32px 0' }
const heading: React.CSSProperties = { fontSize: 26, fontWeight: 700, marginBottom: 8, color: C.white, fontFamily: "'Cormorant', Georgia, serif" }
const sub: React.CSSProperties = { fontSize: 15, color: C.gray, marginBottom: 24, lineHeight: 1.6 }
const card: React.CSSProperties = { background: C.card, borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, marginBottom: 16 }

/* ─── Section 1: Video Introduction ─── */
function VideoSection() {
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>🎬 See It In Action</h2>
      <p style={sub}>Watch how easy it is to build a professional B2B landingpage in under a minute</p>
      
      <div style={card}>
        {/* Main Tutorial Video */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.gold, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📖</span> Tutorial: Building Your First Landingpage
          </div>
          <div style={{ 
            position: 'relative', 
            borderRadius: 12, 
            overflow: 'hidden',
            border: `2px solid ${C.border}`,
            background: C.dark,
          }}>
            <video 
              controls 
              style={{ width: '100%', display: 'block' }}
              poster="/videos/landingpage-editor-overview.png"
            >
              <source src="/videos/landingpage-builder-guide.mp4" type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>
          <div style={{ fontSize: 12, color: C.dimmed, marginTop: 8, textAlign: 'center' }}>
            20 seconds · Shows drag & drop, configuration, preview, and publish
          </div>
        </div>

        {/* Tip Box */}
        <div style={{ 
          background: C.greenBg, 
          borderRadius: 8, 
          padding: 16, 
          border: `1px solid ${C.green}30`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>💡</span>
          <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.5 }}>
            <strong style={{ color: C.green }}>Tip:</strong> Upload your own product videos, runway shows, or brand content 
            directly in the editor – they'll be automatically optimized for fast streaming.
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section 2: Editor Overview ─── */
function EditorOverview() {
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>🖥️ The Editor Interface</h2>
      <p style={sub}>SPY's powerful and intuitive drag-and-drop editor makes page building effortless</p>
      
      <div style={card}>
        {/* Four Panels Explanation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div style={{ background: C.subtle, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.gold}` }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 8 }}>Left Panel: Components</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>
              Browse all available components organized by category. Simply drag any component onto the canvas to add it to your page.
            </div>
          </div>
          <div style={{ background: C.subtle, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.blue}` }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎨</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 8 }}>Center: Live Canvas</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>
              See your page come to life in real-time. Drag components, reorder elements, and watch changes appear instantly.
            </div>
          </div>
          <div style={{ background: C.subtle, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.purple}` }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 8 }}>Right Panel: Settings</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>
              Configure the selected component. Adjust text, colors, sizes, filters, and more with instant visual feedback.
            </div>
          </div>
          <div style={{ background: C.subtle, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.green}` }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👁️</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 8 }}>Preview Mode</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>
              Switch to Preview Mode to see exactly how your customers will experience the page – without any editor UI.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Component Card ─── */
interface ComponentCardProps {
  icon: string
  name: string
  category: string
  categoryColor: string
  description: string
  features: string[]
  example?: string
}

function ComponentCard({ icon, name, category, categoryColor, description, features, example }: ComponentCardProps) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div 
      style={{ 
        background: C.subtle, 
        borderRadius: 12, 
        border: `1px solid ${C.border}`,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ 
            width: 56, 
            height: 56, 
            borderRadius: 12, 
            background: C.card, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: 28,
            border: `1px solid ${C.border}`,
            flexShrink: 0,
          }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ 
                fontSize: 10, 
                fontWeight: 700, 
                color: categoryColor, 
                textTransform: 'uppercase', 
                letterSpacing: 1,
                padding: '2px 8px',
                background: `${categoryColor}15`,
                borderRadius: 4,
              }}>
                {category}
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 17, color: C.white, marginBottom: 6 }}>{name}</div>
            <div style={{ fontSize: 13, color: C.gray, lineHeight: 1.5 }}>{description}</div>
          </div>
          <div style={{ 
            color: C.dimmed, 
            fontSize: 18,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}>
            ▼
          </div>
        </div>
      </div>
      
      {expanded && (
        <div style={{ 
          padding: '0 20px 20px 20px', 
          borderTop: `1px solid ${C.border}`,
          marginTop: 0,
          paddingTop: 16,
          background: C.card,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.gold, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Features
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, color: C.grayLight, fontSize: 13, lineHeight: 1.8 }}>
            {features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
          {example && (
            <div style={{ 
              marginTop: 16, 
              padding: 12, 
              background: C.subtle, 
              borderRadius: 8, 
              fontSize: 12, 
              color: C.dimmed,
              fontStyle: 'italic',
              border: `1px solid ${C.border}`,
            }}>
              💡 {example}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Section 3: All Components ─── */
function ComponentsSection() {
  const components = [
    // Layout
    {
      icon: '⬜',
      name: 'Split',
      category: 'Layout',
      categoryColor: C.blue,
      description: 'Divide your page into multiple columns with customizable widths and gaps.',
      features: [
        'Choose 2, 3, or 4 column layouts',
        'Adjustable column widths (50/50, 70/30, etc.)',
        'Advanced: manually specify custom column ratios',
        'Configurable gap spacing between columns',
        'Responsive: stacks on mobile devices',
      ],
      example: 'Use Split to place an image next to text, or create a product grid layout.',
    },
    {
      icon: '↕️',
      name: 'Space',
      category: 'Layout',
      categoryColor: C.blue,
      description: 'Add vertical breathing room between sections of your page.',
      features: [
        'Adjustable height (small, medium, large, custom)',
        'Creates visual separation between content',
        'Invisible but essential for clean design',
      ],
      example: 'Add Space between your hero banner and product listing for a cleaner look.',
    },
    {
      icon: '📦',
      name: 'Section',
      category: 'Layout',
      categoryColor: C.blue,
      description: 'A container that groups content together with optional background.',
      features: [
        'Add background color or image',
        'Configurable padding and margins',
        'Can contain any other components',
        'Great for organizing content blocks',
      ],
      example: 'Wrap multiple components inside a Section with a background color for visual grouping.',
    },
    // Typography
    {
      icon: '📝',
      name: 'Text',
      category: 'Typography',
      categoryColor: C.purple,
      description: 'Add formatted text with full control over styling.',
      features: [
        'Multiple font sizes (14px to 48px+)',
        'Font weight options (light, regular, bold)',
        'Text alignment (left, center, right)',
        'Custom colors',
        'Rich text formatting',
      ],
      example: 'Create headlines, descriptions, or promotional text with perfect styling.',
    },
    {
      icon: '🔗',
      name: 'TextLink',
      category: 'Typography',
      categoryColor: C.purple,
      description: 'Clickable text links that navigate to other pages or sections.',
      features: [
        'Link to external URLs or internal pages',
        'Customizable link text and styling',
        'Hover effects',
        'Open in new tab option',
      ],
      example: 'Add "View full collection →" links to guide customers deeper into your catalog.',
    },
    // Media
    {
      icon: '🖼️',
      name: 'Image',
      category: 'Media',
      categoryColor: C.green,
      description: 'Display images with automatic optimization and sizing controls.',
      features: [
        'Upload or link to images',
        'Automatic image optimization',
        'Adjustable width and height',
        'Border radius for rounded corners',
        'Alt text for accessibility',
        'Built-in text overlay for layering text on images',
      ],
      example: 'Showcase your hero banner with an overlay title, product photos, or brand imagery.',
    },
    {
      icon: '🎬',
      name: 'Video',
      category: 'Media',
      categoryColor: C.green,
      description: 'Embed videos that auto-upload to Cloudflare for fast streaming.',
      features: [
        'Upload videos directly',
        'Automatic Cloudflare Stream integration',
        'Autoplay, loop, and mute options',
        'Built-in text overlay for layering text on video',
        'Responsive player',
      ],
      example: 'Feature a runway show video with an overlay title or product demonstration on your frontpage.',
    },
    // Actions
    {
      icon: '🔘',
      name: 'Button',
      category: 'Actions',
      categoryColor: C.orange,
      description: 'Call-to-action buttons that drive customer engagement.',
      features: [
        'Customizable button text',
        'Link to any URL or page',
        'Multiple style variants (primary, secondary)',
        'Adjustable size and colors',
        'Hover animations',
      ],
      example: 'Add "Shop Now" or "View Collection" buttons to convert visitors.',
    },
    // SPY B2B
    {
      icon: '🛍️',
      name: 'ProductListing',
      category: 'SPY B2B',
      categoryColor: C.gold,
      description: 'Dynamic product grid that pulls real products from your SPY catalog.',
      features: [
        'Filter by Brand, Type, Category',
        'Filter by Size, Color, Gender',
        'Price range filtering',
        'Delivery and Style info label filters',
        'Automatic product cards with images',
        'Real-time pricing and availability',
        'Configurable number of products to show',
      ],
      example: 'Showcase "New Arrivals" or "Summer Collection" products dynamically.',
    },
  ]

  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>🧩 Available Components</h2>
      <p style={sub}>10 powerful building blocks to create any layout you can imagine. Click each to learn more.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        {components.map((comp, i) => (
          <ComponentCard key={i} {...comp} />
        ))}
      </div>
    </section>
  )
}

/* ─── Section 4: Sample Layouts ─── */
function SampleLayouts() {
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>💡 Example Layouts</h2>
      <p style={sub}>Get inspired with these common page structures you can build</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {/* Hero Layout */}
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.white, marginBottom: 12 }}>🎯 Hero + Products</div>
          <div style={{ 
            background: C.subtle, 
            borderRadius: 8, 
            padding: 16, 
            marginBottom: 12,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ height: 60, background: `linear-gradient(135deg, ${C.gold}40, ${C.purple}40)`, borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 12 }}>
              Image / Video
            </div>
            <div style={{ height: 20, background: C.card, borderRadius: 4, marginBottom: 8, width: '60%' }}></div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ flex: 1, height: 40, background: C.card, borderRadius: 4 }}></div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5 }}>
            <strong>Components:</strong> Image/Video → Text → ProductListing
          </div>
        </div>

        {/* Split Layout */}
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.white, marginBottom: 12 }}>📐 Side-by-Side</div>
          <div style={{ 
            background: C.subtle, 
            borderRadius: 8, 
            padding: 16, 
            marginBottom: 12,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, height: 100, background: `linear-gradient(135deg, ${C.blue}40, ${C.cyan}40)`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 11 }}>
                Image
              </div>
              <div style={{ flex: 1, padding: 8 }}>
                <div style={{ height: 12, background: C.card, borderRadius: 3, marginBottom: 6, width: '80%' }}></div>
                <div style={{ height: 8, background: C.card, borderRadius: 3, marginBottom: 6 }}></div>
                <div style={{ height: 8, background: C.card, borderRadius: 3, marginBottom: 8, width: '60%' }}></div>
                <div style={{ height: 24, background: C.gold, borderRadius: 4, width: '50%' }}></div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5 }}>
            <strong>Components:</strong> Split [Image | Text + Button]
          </div>
        </div>

        {/* Full Video */}
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.white, marginBottom: 12 }}>🎬 Video Showcase</div>
          <div style={{ 
            background: C.subtle, 
            borderRadius: 8, 
            padding: 16, 
            marginBottom: 12,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ height: 80, background: `linear-gradient(135deg, ${C.green}40, ${C.blue}40)`, borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 24 }}>
              ▶
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1,2].map(i => (
                <div key={i} style={{ flex: 1, height: 30, background: C.card, borderRadius: 4 }}></div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5 }}>
            <strong>Components:</strong> Section [Video] → Split [Button | Button]
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section 5: Workflow Steps ─── */
function WorkflowSteps() {
  const steps = [
    { num: '1', icon: '🖱️', title: 'Drag Components', desc: 'Pick components from the left panel and drag them onto your canvas' },
    { num: '2', icon: '⚙️', title: 'Configure', desc: 'Click any component to customize it in the right settings panel' },
    { num: '3', icon: '👁️', title: 'Preview', desc: 'Click Preview to see exactly how customers will experience your page' },
    { num: '4', icon: '🚀', title: 'Publish', desc: 'Save & Publish to make your landingpage live for B2B customers' },
  ]

  return (
    <section style={section}>
      <h2 style={heading}>🚀 How It Works</h2>
      <p style={sub}>Four simple steps to create a professional B2B landingpage</p>
      
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ 
            flex: '1 1 200px',
            background: C.card, 
            borderRadius: 12, 
            padding: 24, 
            border: `1px solid ${C.border}`,
            position: 'relative',
            textAlign: 'center',
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              background: C.gold, 
              color: C.dark, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 18, 
              fontWeight: 700,
              margin: '0 auto 16px auto',
            }}>
              {step.num}
            </div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{step.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.white, marginBottom: 8 }}>{step.title}</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.5 }}>{step.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Section 6: Pro Tips ─── */
function ProTips() {
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>💡 Pro Tips</h2>
      <p style={sub}>Get more out of the Landingpage Builder with these power features</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <div style={card}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>📅</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 8 }}>Schedule Multiple Pages</div>
          <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>
            Create several B2B frontpages and set release dates for each. Perfect for seasonal campaigns – no manual switching needed!
          </div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 8 }}>Copy Existing Pages</div>
          <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>
            Don't start from scratch! Duplicate any existing landingpage and modify it to quickly create variations.
          </div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>🔄</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 8 }}>Continuous Updates</div>
          <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>
            We're constantly adding new features and components. Check back regularly for the latest additions!
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Intro Section ─── */
function IntroSection() {
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}`, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
      <h1 style={{ ...heading, fontSize: 32, marginBottom: 16 }}>B2B Landingpage Builder</h1>
      <p style={{ fontSize: 18, color: C.grayLight, lineHeight: 1.7, maxWidth: 700, margin: '0 auto 24px auto' }}>
        Create stunning, professional B2B frontpages in minutes – no coding required. 
        Drag and drop components, preview in real-time, and publish instantly.
      </p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ background: C.greenBg, color: C.green, padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
          ✓ No coding skills needed
        </div>
        <div style={{ background: C.blueBg, color: C.blue, padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
          ✓ Real-time preview
        </div>
        <div style={{ background: C.purpleBg, color: C.purple, padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
          ✓ Publish instantly
        </div>
      </div>
    </section>
  )
}

/* ─── Main Component ─── */
export default function LandingpageBuilderContent({ lang = 'en' }: { lang?: string }) {
  return (
    <div style={{ background: '#222222', borderRadius: 12, padding: '8px 24px', border: '1px solid #333333' }}>
      <IntroSection />
      <VideoSection />
      <EditorOverview />
      <ComponentsSection />
      <SampleLayouts />
      <ProTips />
      <WorkflowSteps />
    </div>
  )
}
