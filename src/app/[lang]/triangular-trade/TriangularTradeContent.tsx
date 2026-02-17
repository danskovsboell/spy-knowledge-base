'use client'

import React, { useState } from 'react'
import { getTriangularT, type TriangularStrings } from './triangular-trade-translations'

const C = {
  dark: '#0d0d0d', black: '#1a1a1a', card: '#222222', cardHover: '#2a2a2a',
  elevated: '#2d2d2d', subtle: '#1f1f1f', gold: '#c9a227', goldLight: '#d4b652',
  white: '#ffffff', grayLight: '#cccccc', gray: '#888888', border: '#333333',
  stockBlue: '#3498db', prePurple: '#9b59b6', greenDark: '#27ae60',
  greenBg: 'rgba(39, 174, 96, 0.12)', warnRed: '#e74c3c', warnBg: 'rgba(231, 76, 60, 0.12)',
  orangeDark: '#e67e22',
}

const section: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '32px 0' }
const heading: React.CSSProperties = { fontSize: 24, fontWeight: 700, marginBottom: 8, color: C.white, fontFamily: "'Cormorant', Georgia, serif" }
const sub: React.CSSProperties = { fontSize: 15, color: C.gray, marginBottom: 24, lineHeight: 1.6 }
const card: React.CSSProperties = { background: C.card, borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, marginBottom: 16 }

/* ─── Flowchart components ─── */
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

function Arrow({ label, color, dashed }: { label: string; color: string; dashed?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 60 }}>
      <span style={{ fontSize: 10, color, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{
        width: 50, height: 2, background: color,
        borderTop: dashed ? `2px dashed ${color}` : undefined,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', right: -4, top: -4, width: 0, height: 0,
          borderLeft: `8px solid ${color}`, borderTop: '5px solid transparent', borderBottom: '5px solid transparent',
        }} />
      </div>
    </div>
  )
}

interface ScenarioFlowProps {
  t: TriangularStrings
  parties: { emoji: string; label: string; country: string }[]
  isTriangular: boolean
  vatText?: string
  showVat: boolean
  onToggleVat: () => void
}

function ScenarioFlow({ t, parties, isTriangular, vatText, showVat, onToggleVat }: ScenarioFlowProps) {
  const accentColor = isTriangular ? C.greenDark : C.warnRed
  return (
    <div>
      {/* Order flow */}
      <div style={{ fontSize: 11, color: C.gray, marginBottom: 8, fontWeight: 600 }}>{t.s2OrderFlow}:</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {parties.map((p, i) => (
          <React.Fragment key={i}>
            <FlowBox emoji={p.emoji} label={`${p.label} (${p.country})`} color={accentColor} />
            {i < parties.length - 1 && <Arrow label={t.s2OrderFlow} color={C.gray} />}
          </React.Fragment>
        ))}
      </div>
      {/* Goods flow (direct) */}
      <div style={{ fontSize: 11, color: C.gray, marginBottom: 8, fontWeight: 600 }}>{t.s2GoodsFlow}:</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        <FlowBox emoji={parties[0].emoji} label={`${parties[0].label} (${parties[0].country})`} color={accentColor} />
        <Arrow label={t.s2DirectDelivery} color={accentColor} dashed />
        <FlowBox emoji={parties[parties.length - 1].emoji} label={`${parties[parties.length - 1].label} (${parties[parties.length - 1].country})`} color={accentColor} />
      </div>
      {/* VAT toggle */}
      {vatText && (
        <>
          <button
            onClick={onToggleVat}
            style={{
              background: 'none', border: `1px solid ${accentColor}`, color: accentColor,
              padding: '6px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              marginBottom: showVat ? 12 : 0,
            }}
          >
            {showVat ? t.s2HideVat : t.s2ShowVat}
          </button>
          {showVat && (
            <div style={{
              marginTop: 8, padding: 16,
              background: isTriangular ? C.greenBg : C.warnBg,
              borderRadius: 8, fontSize: 13, color: C.grayLight, lineHeight: 1.7,
              border: `1px solid ${isTriangular ? 'rgba(39,174,96,0.3)' : 'rgba(231,76,60,0.3)'}`,
            }}>
              {vatText}
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ─── Section 1: What is triangular trade? ─── */
function Section1({ t }: { t: TriangularStrings }) {
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>{t.s1Title}</h2>
      <p style={sub}>{t.s1Intro}</p>
      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { icon: '🏢', text: t.s1Req1 },
            { icon: '🇪🇺', text: t.s1Req2 },
            { icon: '📦', text: t.s1Req3 },
          ].map((req, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: 20, background: C.subtle, borderRadius: 12,
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{req.icon}</div>
              <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.5 }}>{req.text}</div>
            </div>
          ))}
        </div>
        <div style={{
          padding: 20, background: C.greenBg, borderRadius: 12, textAlign: 'center',
          border: '1px solid rgba(39,174,96,0.3)',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.greenDark, marginBottom: 8 }}>✅ {t.s1Benefit}</div>
          <div style={{ fontSize: 14, color: C.grayLight, lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
            {t.s1BenefitDesc}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section 2: Scenarios that trigger ─── */
function Section2({ t }: { t: TriangularStrings }) {
  const [showVat1, setShowVat1] = useState(false)
  const [showVat2, setShowVat2] = useState(false)

  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={{ ...heading, color: C.greenDark }}>✅ {t.s2Title}</h2>
      <p style={sub}>{t.s2Intro}</p>

      {/* Scenario 1 */}
      <div style={{ ...card, borderColor: 'rgba(39,174,96,0.3)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.greenDark, marginBottom: 8 }}>{t.s2Scenario1Title}</h3>
        <p style={{ fontSize: 14, color: C.grayLight, marginBottom: 16, lineHeight: 1.6 }}>{t.s2Scenario1Desc}</p>
        <ScenarioFlow
          t={t}
          parties={[
            { emoji: '🇵🇹', label: 'A', country: 'PT' },
            { emoji: '🇩🇰', label: 'B', country: 'DK' },
            { emoji: '🇩🇪', label: 'C', country: 'DE' },
          ]}
          isTriangular={true}
          vatText={t.s2Scenario1Vat}
          showVat={showVat1}
          onToggleVat={() => setShowVat1(v => !v)}
        />
      </div>

      {/* Scenario 2 */}
      <div style={{ ...card, borderColor: 'rgba(39,174,96,0.3)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.greenDark, marginBottom: 8 }}>{t.s2Scenario2Title}</h3>
        <p style={{ fontSize: 14, color: C.grayLight, marginBottom: 16, lineHeight: 1.6 }}>{t.s2Scenario2Desc}</p>
        <ScenarioFlow
          t={t}
          parties={[
            { emoji: '🇮🇹', label: 'A', country: 'IT' },
            { emoji: '🇩🇪', label: 'B', country: 'DE' },
            { emoji: '🇩🇰', label: 'C', country: 'DK' },
          ]}
          isTriangular={true}
          vatText={t.s2Scenario2Vat}
          showVat={showVat2}
          onToggleVat={() => setShowVat2(v => !v)}
        />
      </div>
    </section>
  )
}

/* ─── Section 3: Scenarios that don't trigger ─── */
function Section3({ t }: { t: TriangularStrings }) {
  const scenarios = [
    { title: t.s3Scenario3Title, desc: t.s3Scenario3Desc, icon: '🔄' },
    { title: t.s3Scenario4Title, desc: t.s3Scenario4Desc, icon: '2️⃣' },
    { title: t.s3Scenario5Title, desc: t.s3Scenario5Desc, icon: '4️⃣' },
    { title: t.s3Scenario6Title, desc: t.s3Scenario6Desc, icon: '🌍' },
  ]

  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={{ ...heading, color: C.warnRed }}>❌ {t.s3Title}</h2>
      <p style={sub}>{t.s3Intro}</p>
      {scenarios.map((s, i) => (
        <div key={i} style={{ ...card, borderColor: 'rgba(231,76,60,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              fontSize: 28, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: C.warnBg, borderRadius: 10, flexShrink: 0,
            }}>{s.icon}</div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.warnRed, marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: C.grayLight, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

/* ─── Section 4: B2C ─── */
function Section4({ t }: { t: TriangularStrings }) {
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>🛒 {t.s4Title}</h2>
      <p style={sub}>{t.s4Intro}</p>
      <div style={{ ...card, borderColor: 'rgba(231,76,60,0.3)' }}>
        <div style={{
          padding: 16, background: C.warnBg, borderRadius: 8, marginBottom: 16,
          fontSize: 15, fontWeight: 700, color: C.warnRed, textAlign: 'center',
        }}>
          ⚠️ {t.s4NotApplicable}
        </div>
        <p style={{ fontSize: 14, color: C.grayLight, lineHeight: 1.6, marginBottom: 12 }}>{t.s4OssRules}</p>
        <div style={{
          padding: 16, background: C.subtle, borderRadius: 8, fontSize: 13,
          color: C.grayLight, lineHeight: 1.6, border: `1px solid ${C.border}`,
        }}>
          💡 {t.s4OssThreshold}
        </div>
      </div>
    </section>
  )
}

/* ─── Section 5: Overview table ─── */
function Section5({ t }: { t: TriangularStrings }) {
  const rows: { label: string; ok: boolean; reason: string }[] = [
    { label: t.s5Row1, ok: true, reason: t.s5Row1Reason },
    { label: t.s5Row2, ok: true, reason: t.s5Row2Reason },
    { label: t.s5Row3, ok: false, reason: t.s5Row3Reason },
    { label: t.s5Row4, ok: false, reason: t.s5Row4Reason },
    { label: t.s5Row5, ok: false, reason: t.s5Row5Reason },
    { label: t.s5Row6, ok: false, reason: t.s5Row6Reason },
    { label: t.s5Row7, ok: false, reason: t.s5Row7Reason },
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
      <h2 style={heading}>📊 {t.s5Title}</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: C.card, borderRadius: 12, overflow: 'hidden' }}>
          <thead>
            <tr>
              <th style={thStyle}>{t.s5Scenario}</th>
              <th style={{ ...thStyle, textAlign: 'center', width: 120 }}>{t.s5Triangular}</th>
              <th style={thStyle}>{t.s5Reason}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? C.card : C.subtle }}>
                <td style={tdStyle}>{r.label}</td>
                <td style={{
                  ...tdStyle, textAlign: 'center', fontSize: 18,
                  color: r.ok ? C.greenDark : C.warnRed,
                }}>
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

/* ─── Section 6: SPY handling ─── */
function Section6({ t }: { t: TriangularStrings }) {
  const erpSystems = [
    { name: 'e-conomic', mapping: 'Reverse Charge', color: C.stockBlue },
    { name: 'Fortnox', mapping: 'EU Reversed VAT / SE Reversed VAT', color: C.prePurple },
    { name: 'Tripletex', mapping: 'Reverse Charge', color: C.greenDark },
    { name: 'Navision / MS BC', mapping: 'Reverse Charge', color: C.orangeDark },
    { name: 'Exact Online', mapping: 'Reverse Charge', color: C.stockBlue },
    { name: 'C5', mapping: 'Reverse Charge', color: C.gray },
    { name: '24Seven', mapping: 'Reverse Charge', color: C.prePurple },
    { name: 'PowerOffice Go', mapping: 'Reverse Charge', color: C.greenDark },
  ]

  return (
    <section style={section}>
      <h2 style={heading}>⚙️ {t.s6Title}</h2>
      <p style={sub}>{t.s6Intro}</p>

      {/* Auto-detection note */}
      <div style={{
        padding: 20, marginBottom: 24, background: C.greenBg, borderRadius: 12,
        border: '1px solid rgba(39,174,96,0.3)', fontSize: 15, color: C.greenDark,
        fontWeight: 600, lineHeight: 1.6, textAlign: 'center',
      }}>
        ✅ {t.s6AutoNote}
      </div>

      {/* EU Sales Report */}
      <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.gold, marginBottom: 8 }}>📋 {t.s6EuSalesReport}</h3>
        <p style={{ fontSize: 14, color: C.grayLight, lineHeight: 1.6 }}>{t.s6EuSalesDesc}</p>
      </div>

      {/* ERP integrations */}
      <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.gold, marginBottom: 8 }}>🔌 {t.s6ErpTitle}</h3>
        <p style={{ fontSize: 14, color: C.gray, marginBottom: 16 }}>{t.s6ErpIntro}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {erpSystems.map((erp, i) => (
            <div key={i} style={{
              padding: 14, background: C.subtle, borderRadius: 8,
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ fontWeight: 700, color: erp.color, fontSize: 14, marginBottom: 4 }}>{erp.name}</div>
              <div style={{ fontSize: 12, color: C.gray }}>{erp.mapping}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TypeLedgerEntry */}
      <div style={card}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.gold, marginBottom: 8 }}>🗂️ {t.s6LedgerTitle}</h3>
        <p style={{ fontSize: 14, color: C.grayLight, lineHeight: 1.6, marginBottom: 16 }}>{t.s6LedgerDesc}</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Country', 'B2C', 'B2B Normal', 'Triangular'].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px', textAlign: 'left', color: C.gold,
                    borderBottom: `2px solid ${C.border}`, background: C.elevated, fontWeight: 700, fontSize: 12,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { country: '🇩🇰 DK', b2c: 'SalesB2C_DK', normal: 'SalesEU_DK', tri: 'TriangularTrade_DK' },
                { country: '🇩🇪 DE', b2c: 'SalesB2C_DE', normal: 'SalesEU_DE', tri: 'TriangularTrade_DE' },
                { country: '🇸🇪 SE', b2c: 'SalesB2C_SE', normal: 'SalesEU_SE', tri: 'TriangularTrade_SE' },
                { country: '🇳🇴 NO', b2c: 'SalesB2C_NO', normal: 'SalesEU_NO', tri: 'TriangularTrade_NO' },
                { country: '🇳🇱 NL', b2c: 'SalesB2C_NL', normal: 'SalesEU_NL', tri: 'TriangularTrade_NL' },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.card : C.subtle }}>
                  <td style={{ padding: '8px 12px', color: C.white, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{row.country}</td>
                  <td style={{ padding: '8px 12px', color: C.orangeDark, borderBottom: `1px solid ${C.border}`, fontFamily: 'monospace', fontSize: 12 }}>{row.b2c}</td>
                  <td style={{ padding: '8px 12px', color: C.stockBlue, borderBottom: `1px solid ${C.border}`, fontFamily: 'monospace', fontSize: 12 }}>{row.normal}</td>
                  <td style={{ padding: '8px 12px', color: C.greenDark, borderBottom: `1px solid ${C.border}`, fontFamily: 'monospace', fontSize: 12 }}>{row.tri}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

/* ─── Main component ─── */
export default function TriangularTradeContent({ lang }: { lang: string }) {
  const t = getTriangularT(lang)
  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Section1 t={t} />
      <Section2 t={t} />
      <Section3 t={t} />
      <Section4 t={t} />
      <Section5 t={t} />
      <Section6 t={t} />
    </div>
  )
}
