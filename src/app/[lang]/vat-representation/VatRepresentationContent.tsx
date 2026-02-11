'use client'

import React, { useState } from 'react'
import { getVatRepT, type VatRepStrings } from './vat-representation-translations'

const C = {
  dark: '#0d0d0d', black: '#1a1a1a', card: '#222222', cardHover: '#2a2a2a',
  elevated: '#2d2d2d', subtle: '#1f1f1f', gold: '#c9a227', goldLight: '#d4b652',
  white: '#ffffff', grayLight: '#cccccc', gray: '#888888', border: '#333333',
  greenDark: '#27ae60', greenBg: 'rgba(39, 174, 96, 0.12)',
  warnRed: '#e74c3c', warnBg: 'rgba(231, 76, 60, 0.12)',
  blue: '#3498db', blueBg: 'rgba(52, 152, 219, 0.12)',
  purple: '#9b59b6', orange: '#e67e22',
}

const section: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '32px 0' }
const heading: React.CSSProperties = { fontSize: 24, fontWeight: 700, marginBottom: 8, color: C.white, fontFamily: "'Cormorant', Georgia, serif" }
const sub: React.CSSProperties = { fontSize: 15, color: C.gray, marginBottom: 24, lineHeight: 1.6 }
const card: React.CSSProperties = { background: C.card, borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, marginBottom: 16 }

function FlowBox({ emoji, label, color }: { emoji: string; label: string; color: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      padding: '12px 20px', background: C.subtle, borderRadius: 10,
      border: `2px solid ${color}`, minWidth: 100, textAlign: 'center',
    }}>
      <span style={{ fontSize: 28 }}>{emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{label}</span>
    </div>
  )
}

function Arrow({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 60 }}>
      <span style={{ fontSize: 10, color, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ width: 50, height: 2, background: color, position: 'relative' }}>
        <div style={{
          position: 'absolute', right: -4, top: -4, width: 0, height: 0,
          borderLeft: `8px solid ${color}`, borderTop: '5px solid transparent', borderBottom: '5px solid transparent',
        }} />
      </div>
    </div>
  )
}

/* ─── Section 1: What is VAT representation? ─── */
function Section1({ t }: { t: VatRepStrings }) {
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>🏛️ {t.s1Title}</h2>
      <p style={sub}>{t.s1Intro}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[
          { icon: '👤', title: t.s1Def1Title, desc: t.s1Def1Desc, color: C.blue },
          { icon: '🔢', title: t.s1Def2Title, desc: t.s1Def2Desc, color: C.gold },
          { icon: '📥', title: t.s1Def3Title, desc: t.s1Def3Desc, color: C.greenDark },
        ].map((d, i) => (
          <div key={i} style={{
            ...card, borderTop: `3px solid ${d.color}`, textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{d.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: d.color, marginBottom: 8 }}>{d.title}</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>{d.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Section 2: Why use VAT representation? ─── */
function Section2({ t }: { t: VatRepStrings }) {
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={{ ...heading, color: C.greenDark }}>💡 {t.s2Title}</h2>
      <p style={sub}>{t.s2Intro}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '🚀', title: t.s2Benefit1Title, desc: t.s2Benefit1Desc, color: C.blue },
          { icon: '💰', title: t.s2Benefit2Title, desc: t.s2Benefit2Desc, color: C.greenDark },
          { icon: '✅', title: t.s2Benefit3Title, desc: t.s2Benefit3Desc, color: C.gold },
          { icon: '💳', title: t.s2Benefit4Title, desc: t.s2Benefit4Desc, color: C.purple },
        ].map((b, i) => (
          <div key={i} style={{ ...card, borderLeft: `3px solid ${b.color}` }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: b.color, marginBottom: 6 }}>{b.title}</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.5 }}>{b.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { title: t.s2BrandBenefits, list: t.s2BrandList, color: C.gold, bg: 'rgba(201,162,39,0.08)' },
          { title: t.s2CustomerBenefits, list: t.s2CustomerList, color: C.greenDark, bg: C.greenBg },
        ].map((box, i) => (
          <div key={i} style={{
            padding: 20, background: box.bg, borderRadius: 12,
            border: `1px solid ${box.color}30`,
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: box.color, marginBottom: 12 }}>{box.title}</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{box.list}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Section 3: Customs & duty ─── */
function Section3({ t }: { t: VatRepStrings }) {
  const [showCalc, setShowCalc] = useState(false)
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>🛃 {t.s3Title}</h2>
      <p style={sub}>{t.s3Intro}</p>

      {/* Flow diagram */}
      <div style={{ ...card, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <FlowBox emoji="🏭" label={t.s3Flow1Label} color={C.orange} />
          <Arrow label="" color={C.gray} />
          <FlowBox emoji="🛃" label={t.s3Flow2Label} color={C.warnRed} />
          <Arrow label="" color={C.gray} />
          <FlowBox emoji="🏢" label={t.s3Flow3Label} color={C.greenDark} />
          <Arrow label="" color={C.gray} />
          <FlowBox emoji="🛒" label={t.s3Flow4Label} color={C.blue} />
        </div>
      </div>

      {/* Without vs With */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ ...card, borderColor: 'rgba(231,76,60,0.3)', borderTop: `3px solid ${C.warnRed}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.warnRed, marginBottom: 8 }}>❌ {t.s3WithoutTitle}</div>
          <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>{t.s3WithoutDesc}</div>
        </div>
        <div style={{ ...card, borderColor: 'rgba(39,174,96,0.3)', borderTop: `3px solid ${C.greenDark}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.greenDark, marginBottom: 8 }}>✅ {t.s3WithTitle}</div>
          <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>{t.s3WithDesc}</div>
        </div>
      </div>

      <div style={{ ...card, background: 'rgba(201,162,39,0.08)', borderColor: 'rgba(201,162,39,0.3)' }}>
        <div style={{ fontSize: 14, color: C.gold, fontWeight: 600, marginBottom: 12 }}>⚠️ {t.s3DutyNote}</div>
        <button
          onClick={() => setShowCalc(v => !v)}
          style={{
            background: 'none', border: `1px solid ${C.gold}`, color: C.gold,
            padding: '6px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}
        >
          {showCalc ? t.s3HideDetails : t.s3ShowDetails}
        </button>
        {showCalc && (
          <div style={{
            marginTop: 12, padding: 16, background: C.subtle, borderRadius: 8,
            fontSize: 13, color: C.grayLight, lineHeight: 1.7, border: `1px solid ${C.border}`,
          }}>
            {t.s3ImportVatExplain}
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Section 4: The journey ─── */
function Section4({ t }: { t: VatRepStrings }) {
  const steps = [
    { icon: '🔍', title: t.s4Step1Title, desc: t.s4Step1Desc, color: C.blue },
    { icon: '🤝', title: t.s4Step2Title, desc: t.s4Step2Desc, color: C.purple },
    { icon: '📋', title: t.s4Step3Title, desc: t.s4Step3Desc, color: C.gold },
    { icon: '⚙️', title: t.s4Step4Title, desc: t.s4Step4Desc, color: C.greenDark },
    { icon: '🧪', title: t.s4Step5Title, desc: t.s4Step5Desc, color: C.orange },
    { icon: '🚀', title: t.s4Step6Title, desc: t.s4Step6Desc, color: C.greenDark },
  ]
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>🗺️ {t.s4Title}</h2>
      <p style={sub}>{t.s4Intro}</p>
      <div style={{ position: 'relative', paddingLeft: 32 }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute', left: 14, top: 0, bottom: 0, width: 2, background: C.border,
        }} />
        {steps.map((s, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: 20 }}>
            {/* Dot */}
            <div style={{
              position: 'absolute', left: -26, top: 4, width: 12, height: 12, borderRadius: '50%',
              background: s.color, border: `2px solid ${C.card}`,
            }} />
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        textAlign: 'center', padding: 16, background: C.blueBg, borderRadius: 12,
        border: '1px solid rgba(52,152,219,0.3)', fontSize: 15, fontWeight: 600, color: C.blue,
      }}>
        ⏱️ {t.s4Timeline}
      </div>
    </section>
  )
}

/* ─── Section 5: Setup in SPY ─── */
function Section5({ t }: { t: VatRepStrings }) {
  const [openStep, setOpenStep] = useState<number | null>(null)
  const steps = [
    { icon: '🏢', title: t.s5Step1Title, desc: t.s5Step1Desc },
    { icon: '💶', title: t.s5Step2Title, desc: t.s5Step2Desc },
    { icon: '📦', title: t.s5Step3Title, desc: t.s5Step3Desc },
    { icon: '👥', title: t.s5Step4Title, desc: t.s5Step4Desc },
    { icon: '📊', title: t.s5Step5Title, desc: t.s5Step5Desc },
  ]
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={{ ...heading, color: C.gold }}>⚙️ {t.s5Title}</h2>
      <p style={sub}>{t.s5Intro}</p>
      {steps.map((s, i) => (
        <div
          key={i}
          style={{
            ...card, cursor: 'pointer',
            borderColor: openStep === i ? C.gold : C.border,
            transition: 'border-color 0.2s',
          }}
          onClick={() => setOpenStep(openStep === i ? null : i)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.white, flex: 1 }}>{s.title}</div>
            <span style={{ color: C.gold, fontSize: 18 }}>{openStep === i ? '▼' : '▶'}</span>
          </div>
          {openStep === i && (
            <div style={{
              marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`,
              fontSize: 13, color: C.grayLight, lineHeight: 1.7,
            }}>
              {s.desc}
            </div>
          )}
        </div>
      ))}
      <div style={{
        marginTop: 16, padding: 16, background: 'rgba(201,162,39,0.08)', borderRadius: 12,
        border: '1px solid rgba(201,162,39,0.3)', fontSize: 14, color: C.goldLight, lineHeight: 1.6,
      }}>
        {t.s5ProTip}
      </div>
    </section>
  )
}

/* ─── Section 6: Daily workflow ─── */
function Section6({ t }: { t: VatRepStrings }) {
  const flows = [
    { icon: '📥', title: t.s6Flow1Title, desc: t.s6Flow1Desc, color: C.blue },
    { icon: '🧾', title: t.s6Flow2Title, desc: t.s6Flow2Desc, color: C.gold },
    { icon: '🚚', title: t.s6Flow3Title, desc: t.s6Flow3Desc, color: C.orange },
    { icon: '📊', title: t.s6Flow4Title, desc: t.s6Flow4Desc, color: C.purple },
    { icon: '✅', title: t.s6Flow5Title, desc: t.s6Flow5Desc, color: C.greenDark },
  ]
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>📋 {t.s6Title}</h2>
      <p style={sub}>{t.s6Intro}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {flows.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: C.subtle,
              border: `2px solid ${f.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
            }}>{f.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: f.color, marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
            {i < flows.length - 1 && (
              <div style={{ position: 'absolute', left: 39, marginTop: 48, width: 2, height: 20, background: C.border }} />
            )}
          </div>
        ))}
      </div>
      <div style={{
        padding: 16, background: C.blueBg, borderRadius: 12,
        border: '1px solid rgba(52,152,219,0.3)', fontSize: 14, color: C.blue, lineHeight: 1.6,
      }}>
        {t.s6Tip}
      </div>
    </section>
  )
}

/* ─── Section 7: Overview table ─── */
function Section7({ t }: { t: VatRepStrings }) {
  const rows: { label: string; ok: boolean; reason: string }[] = [
    { label: t.s7Row1, ok: true, reason: t.s7Row1Reason },
    { label: t.s7Row2, ok: true, reason: t.s7Row2Reason },
    { label: t.s7Row3, ok: false, reason: t.s7Row3Reason },
    { label: t.s7Row4, ok: false, reason: t.s7Row4Reason },
    { label: t.s7Row5, ok: false, reason: t.s7Row5Reason },
    { label: t.s7Row6, ok: true, reason: t.s7Row6Reason },
  ]
  const thStyle: React.CSSProperties = {
    padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700,
    color: C.gold, borderBottom: `2px solid ${C.border}`, background: C.elevated,
  }
  const tdStyle: React.CSSProperties = {
    padding: '12px 16px', fontSize: 13, color: C.grayLight, borderBottom: `1px solid ${C.border}`,
  }

  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>📊 {t.s7Title}</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: C.card, borderRadius: 12, overflow: 'hidden' }}>
          <thead>
            <tr>
              <th style={thStyle}>{t.s7Scenario}</th>
              <th style={{ ...thStyle, textAlign: 'center', width: 120 }}>{t.s7VatRep}</th>
              <th style={thStyle}>{t.s7Reason}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? C.card : C.subtle }}>
                <td style={tdStyle}>{r.label}</td>
                <td style={{ ...tdStyle, textAlign: 'center', fontSize: 18, color: r.ok ? C.greenDark : C.warnRed }}>
                  {r.ok ? '✅' : '❌'}
                </td>
                <td style={{ ...tdStyle, color: C.gray }}>{r.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ─── Section 8: Common mistakes ─── */
function Section8({ t }: { t: VatRepStrings }) {
  const mistakes = [
    { icon: '🔢', title: t.s8Mistake1Title, desc: t.s8Mistake1Desc },
    { icon: '📦', title: t.s8Mistake2Title, desc: t.s8Mistake2Desc },
    { icon: '🗄️', title: t.s8Mistake3Title, desc: t.s8Mistake3Desc },
    { icon: '⏰', title: t.s8Mistake4Title, desc: t.s8Mistake4Desc },
  ]
  return (
    <section style={section}>
      <h2 style={{ ...heading, color: C.warnRed }}>⚠️ {t.s8Title}</h2>
      {mistakes.map((m, i) => (
        <div key={i} style={{ ...card, borderColor: 'rgba(231,76,60,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              fontSize: 28, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: C.warnBg, borderRadius: 10, flexShrink: 0,
            }}>{m.icon}</div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.warnRed, marginBottom: 6 }}>{m.title}</h3>
              <p style={{ fontSize: 14, color: C.grayLight, lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

/* ─── Main component ─── */
export default function VatRepresentationContent({ lang }: { lang: string }) {
  const t = getVatRepT(lang)
  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Section1 t={t} />
      <Section2 t={t} />
      <Section3 t={t} />
      <Section4 t={t} />
      <Section5 t={t} />
      <Section6 t={t} />
      <Section7 t={t} />
      <Section8 t={t} />
    </div>
  )
}
