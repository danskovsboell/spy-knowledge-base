'use client'

import React, { useState } from 'react'
import { getDedicationT, type DedicationStrings } from './dedication-translations'

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
  stockBlue:  '#3498db',
  stockBg:    'rgba(52, 152, 219, 0.15)',
  prePurple:  '#9b59b6',
  preBg:      'rgba(155, 89, 182, 0.15)',
  greenDark:  '#27ae60',
  greenBg:    'rgba(39, 174, 96, 0.12)',
  orangeDark: '#e67e22',
  warnRed:    '#e74c3c',
  warnBg:     'rgba(231, 76, 60, 0.12)',
}

const section: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '32px 0' }
const heading: React.CSSProperties = { fontSize: 24, fontWeight: 700, marginBottom: 8, color: C.white, fontFamily: "'Cormorant', Georgia, serif" }
const sub: React.CSSProperties = { fontSize: 15, color: C.gray, marginBottom: 24, lineHeight: 1.6 }
const card: React.CSSProperties = { background: C.card, borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, marginBottom: 16 }
const pill = (bg: string, fg: string): React.CSSProperties => ({ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: bg, color: fg, marginRight: 6 })

function Section1({ t }: { t: DedicationStrings }) {
  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>{t.s1Title}</h2>
      <p style={sub}>{t.s1Intro}</p>
      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div style={{ textAlign: 'center', padding: 20, background: C.subtle, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>👕</div>
            <div style={{ fontWeight: 700, color: C.white, marginBottom: 6 }}>{t.s1NoosLabel}</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.5 }}>{t.s1NoosDesc}</div>
          </div>
          <div style={{ textAlign: 'center', padding: 20, background: C.stockBg, borderRadius: 12, border: `1px solid rgba(52, 152, 219, 0.2)` }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🛒</div>
            <div style={{ fontWeight: 700, color: C.stockBlue, marginBottom: 6 }}>{t.s1StockLabel}</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.5 }}>{t.s1StockDesc}</div>
          </div>
          <div style={{ textAlign: 'center', padding: 20, background: C.preBg, borderRadius: 12, border: `1px solid rgba(155, 89, 182, 0.2)` }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📅</div>
            <div style={{ fontWeight: 700, color: C.prePurple, marginBottom: 6 }}>{t.s1PreLabel}</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.5 }}>{t.s1PreDesc}</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 20, color: C.dimmed, marginBottom: 12 }}>↓</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.white }}>{t.s1Question}</div>
        </div>
        <div style={{ padding: 20, background: `linear-gradient(135deg, rgba(201, 162, 39, 0.06), rgba(155, 89, 182, 0.06))`, borderRadius: 12, textAlign: 'center', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.gold, marginBottom: 8 }}>{t.s1Answer}</div>
          <div style={{ fontSize: 14, color: C.grayLight, lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }} dangerouslySetInnerHTML={{ __html: t.s1AnswerDesc }} />
        </div>
        <div style={{ marginTop: 20, padding: 16, background: C.subtle, borderRadius: 8, fontSize: 13, lineHeight: 1.6, color: C.grayLight, border: `1px solid ${C.border}` }} dangerouslySetInnerHTML={{ __html: t.s1Note }} />
      </div>
    </section>
  )
}

function Section2({ t }: { t: DedicationStrings }) {
  const poTotal = 200
  const [poDedicated, setPoDedicated] = useState(80)
  const poStock = poTotal - poDedicated
  type Choice = 'pre' | 'stock'
  const [choices, setChoices] = useState<Record<string, Choice>>({ 'PO-4501': 'pre', 'PO-4522': 'stock', 'PO-4530': 'pre' })
  const orders = [
    { id: 'PO-4501', no: 'PO-4501', qty: 120 },
    { id: 'PO-4522', no: 'PO-4522', qty: 60 },
    { id: 'PO-4530', no: 'PO-4530', qty: 20 },
  ]

  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>{t.s2Title}</h2>
      <p style={sub}>{t.s2Intro}</p>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>📦</span>
          <div>
            <div style={{ fontWeight: 700, color: C.white, fontSize: 16 }}>{t.s2PoTitle.replace('{total}', String(poTotal))}</div>
            <div style={{ fontSize: 13, color: C.gray }}>{t.s2PoDesc}</div>
          </div>
        </div>
        <div style={{ position: 'relative', height: 48, borderRadius: 24, overflow: 'hidden', background: C.subtle, marginBottom: 8 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(poStock / poTotal) * 100}%`, background: `linear-gradient(135deg, ${C.stockBlue}, #2980b9)`, transition: 'width 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 700, fontSize: 14, minWidth: 40 }}>
            {poStock > 30 && `Stock ${poStock}`}
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${(poDedicated / poTotal) * 100}%`, background: `linear-gradient(135deg, ${C.prePurple}, #8e44ad)`, transition: 'width 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 700, fontSize: 14, minWidth: 40 }}>
            {poDedicated > 30 && `Pre ${poDedicated}`}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.gray, marginBottom: 16 }}>
          <span>{t.s2ToStock}</span><span>{t.s2ToPreOrders}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 13, color: C.stockBlue, fontWeight: 600, minWidth: 60 }}>Stock {poStock}</span>
          <input type="range" min={0} max={poTotal} value={poDedicated} onChange={e => setPoDedicated(Number(e.target.value))} style={{ flex: 1, accentColor: C.prePurple, cursor: 'pointer' }} />
          <span style={{ fontSize: 13, color: C.prePurple, fontWeight: 600, minWidth: 60, textAlign: 'right' }}>Pre {poDedicated}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: C.stockBg, borderRadius: 10, padding: 16, textAlign: 'center', border: `1px solid rgba(52, 152, 219, 0.2)` }}>
            <div style={{ fontSize: 12, color: C.gray, marginBottom: 4 }}>{t.s2StockSaleLabel}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.stockBlue }}>{poStock}</div>
            <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>{t.s2StockSaleDesc}</div>
          </div>
          <div style={{ background: C.preBg, borderRadius: 10, padding: 16, textAlign: 'center', border: `1px solid rgba(155, 89, 182, 0.2)` }}>
            <div style={{ fontSize: 12, color: C.gray, marginBottom: 4 }}>{t.s2PreOrderLabel}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.prePurple }}>{poDedicated}</div>
            <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>{t.s2PreOrderDesc}</div>
          </div>
        </div>
      </div>
      <div style={card}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 16 }}>{t.s2SpyTitle}</h3>
        <p style={{ fontSize: 13, color: C.gray, marginBottom: 20 }}>{t.s2SpyDesc}</p>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: C.dark, color: C.gold, padding: '10px 16px', fontSize: 14, fontWeight: 600 }}>{t.s2TableHeader}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: C.subtle }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: C.grayLight }}>{t.s2ColOrderNo}</th>
              <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: C.grayLight }}>{t.s2ColQty}</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600, color: C.grayLight }}>{t.s2ColDedicate}</th>
            </tr></thead>
            <tbody>
              {orders.map(row => (
                <tr key={row.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px 16px', fontWeight: 500, color: C.white }}>{row.no}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: C.grayLight }}>{row.qty} {t.s2Pcs}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <select value={choices[row.id]} onChange={e => setChoices(prev => ({ ...prev, [row.id]: e.target.value as Choice }))} style={{ padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${choices[row.id] === 'pre' ? 'rgba(155, 89, 182, 0.3)' : 'rgba(52, 152, 219, 0.3)'}`, background: choices[row.id] === 'pre' ? C.preBg : C.stockBg, color: choices[row.id] === 'pre' ? C.prePurple : C.stockBlue }}>
                      <option value="pre">Pre</option>
                      <option value="stock">Stock</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 16, padding: 16, background: C.greenBg, borderRadius: 8, fontSize: 13, lineHeight: 1.6, color: C.grayLight, border: `1px solid rgba(39, 174, 96, 0.2)` }} dangerouslySetInnerHTML={{ __html: t.s2Tip }} />
        <div style={{ marginTop: 12, padding: 16, background: 'rgba(201, 162, 39, 0.08)', borderRadius: 8, fontSize: 13, lineHeight: 1.6, color: C.grayLight, border: `1px solid rgba(201, 162, 39, 0.2)` }} dangerouslySetInnerHTML={{ __html: `💡 ${t.s2AlternativeTip}` }} />
      </div>
    </section>
  )
}

function Section3({ t }: { t: DedicationStrings }) {
  const total = 200
  const [dedicated, setDedicated] = useState(60)
  const [stockOrders, setStockOrders] = useState(40)
  const [preOrders, setPreOrders] = useState(25)
  const stockPool = total - dedicated
  const stockAvail = stockPool - stockOrders
  const preAvail = dedicated - preOrders

  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>{t.s3Title}</h2>
      <p style={sub}>{t.s3Intro}</p>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>🏭</span>
          <div>
            <div style={{ fontWeight: 700, color: C.white, fontSize: 16 }}>{t.s3WarehouseTitle.replace('{total}', String(total))}</div>
            <div style={{ fontSize: 13, color: C.gray }}>{t.s3WarehouseDesc}</div>
          </div>
        </div>
        <div style={{ position: 'relative', height: 48, borderRadius: 24, overflow: 'hidden', background: C.subtle, marginBottom: 8 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(stockPool / total) * 100}%`, background: `linear-gradient(135deg, ${C.stockBlue}, #2980b9)`, transition: 'width 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 700, fontSize: 14, minWidth: 40 }}>
            {stockPool > 30 && `Stock ${stockPool}`}
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${(dedicated / total) * 100}%`, background: `linear-gradient(135deg, ${C.prePurple}, #8e44ad)`, transition: 'width 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 700, fontSize: 14, minWidth: 40 }}>
            {dedicated > 30 && `Pre ${dedicated}`}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 13, color: C.stockBlue, fontWeight: 600, minWidth: 60 }}>Stock {stockPool}</span>
          <input type="range" min={0} max={total} value={dedicated} onChange={e => setDedicated(Number(e.target.value))} style={{ flex: 1, accentColor: C.prePurple, cursor: 'pointer' }} />
          <span style={{ fontSize: 13, color: C.prePurple, fontWeight: 600, minWidth: 60, textAlign: 'right' }}>Pre {dedicated}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 12, color: C.gray, display: 'block', marginBottom: 4 }}>{t.s3OngoingStockOrders}</label>
            <input type="number" min={0} value={stockOrders} onChange={e => setStockOrders(Math.max(0, Number(e.target.value)))} style={{ width: '100%', padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 16, boxSizing: 'border-box', background: C.black, color: C.white }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: C.gray, display: 'block', marginBottom: 4 }}>{t.s3OngoingPreOrders}</label>
            <input type="number" min={0} value={preOrders} onChange={e => setPreOrders(Math.max(0, Number(e.target.value)))} style={{ width: '100%', padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 16, boxSizing: 'border-box', background: C.black, color: C.white }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: C.stockBg, borderRadius: 10, padding: 16, border: `1px solid rgba(52, 152, 219, 0.2)` }}>
            <div style={{ fontWeight: 700, color: C.stockBlue, marginBottom: 12, fontSize: 14 }}>{t.s3StockPool}</div>
            <RowItem label={t.s3InStock} value={total} color={C.gray} />
            <RowItem label={t.s3ReservedForPre} value={-dedicated} color={C.prePurple} />
            <RowItem label={t.s3OngoingOrders} value={-stockOrders} color={C.orangeDark} />
            <div style={{ borderTop: `2px solid ${C.stockBlue}`, marginTop: 8, paddingTop: 8 }}>
              <RowItem label={t.s3Available} value={stockAvail} color={stockAvail < 0 ? C.warnRed : C.stockBlue} bold />
            </div>
          </div>
          <div style={{ background: C.preBg, borderRadius: 10, padding: 16, border: `1px solid rgba(155, 89, 182, 0.2)` }}>
            <div style={{ fontWeight: 700, color: C.prePurple, marginBottom: 12, fontSize: 14 }}>{t.s3PrePool}</div>
            <RowItem label={t.s3Reserved} value={dedicated} color={C.prePurple} />
            <RowItem label={t.s3OngoingOrders} value={-preOrders} color={C.orangeDark} />
            <div style={{ borderTop: `2px solid ${C.prePurple}`, marginTop: 8, paddingTop: 8 }}>
              <RowItem label={t.s3Available} value={preAvail} color={preAvail < 0 ? C.warnRed : C.prePurple} bold />
            </div>
          </div>
        </div>
      </div>
      <div style={card}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 12 }}>{t.s3HowToTitle}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <StepCard num="1" title={t.s3Step1Title} desc={t.s3Step1Desc} />
          <StepCard num="2" title={t.s3Step2Title} desc={t.s3Step2Desc} />
          <StepCard num="3" title={t.s3Step3Title} desc={t.s3Step3Desc} />
          <StepCard num="4" title={t.s3Step4Title} desc={t.s3Step4Desc} />
        </div>
      </div>
    </section>
  )
}

function Section4({ t }: { t: DedicationStrings }) {
  const [dedicated, setDedicated] = useState(100)
  const [preSold, setPreSold] = useState(60)
  const overDedicated = Math.max(0, dedicated - preSold)

  return (
    <section style={{ ...section, borderBottom: `1px solid ${C.border}` }}>
      <h2 style={heading}>{t.s4Title}</h2>
      <p style={sub}>{t.s4Intro}</p>
      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 12, color: C.gray, display: 'block', marginBottom: 4 }}>{t.s4ReservedForPre}</label>
            <input type="number" min={0} value={dedicated} onChange={e => setDedicated(Math.max(0, Number(e.target.value)))} style={{ width: '100%', padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 16, boxSizing: 'border-box', background: C.black, color: C.white }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: C.gray, display: 'block', marginBottom: 4 }}>{t.s4ActuallySold}</label>
            <input type="number" min={0} value={preSold} onChange={e => setPreSold(Math.max(0, Number(e.target.value)))} style={{ width: '100%', padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 16, boxSizing: 'border-box', background: C.black, color: C.white }} />
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ height: 40, borderRadius: 8, background: C.subtle, position: 'relative', overflow: 'hidden', marginBottom: 12 }}>
            {dedicated > 0 && (
              <>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(100, (preSold / dedicated) * 100)}%`, background: C.prePurple, borderRadius: '8px 0 0 8px', display: 'flex', alignItems: 'center', paddingLeft: 12, color: C.white, fontSize: 12, fontWeight: 600 }}>
                  {preSold > 0 && `${t.s4Sold}: ${Math.min(preSold, dedicated)}`}
                </div>
                {overDedicated > 0 && (
                  <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${(overDedicated / dedicated) * 100}%`, background: `repeating-linear-gradient(45deg, rgba(231, 76, 60, 0.15), rgba(231, 76, 60, 0.15) 10px, rgba(231, 76, 60, 0.08) 10px, rgba(231, 76, 60, 0.08) 20px)`, border: `2px dashed ${C.warnRed}`, borderRadius: '0 8px 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.warnRed, fontSize: 12, fontWeight: 700 }}>
                    {t.s4Over}: {overDedicated}
                  </div>
                )}
              </>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={pill(C.preBg, C.prePurple)}>{t.s3Reserved}: {dedicated}</span>
            <span style={{ fontSize: 20, color: C.dimmed }}>−</span>
            <span style={pill(C.preBg, C.prePurple)}>{t.s4Sold}: {preSold}</span>
            <span style={{ fontSize: 20, color: C.dimmed }}>=</span>
            <span style={pill(overDedicated > 0 ? C.warnBg : C.greenBg, overDedicated > 0 ? C.warnRed : C.greenDark)}>
              {overDedicated > 0 ? `${t.s4Over}: ${overDedicated}` : t.s4PerfectBalance}
            </span>
          </div>
        </div>
        {overDedicated > 0 && (
          <div style={{ marginTop: 0, padding: 16, background: C.warnBg, borderRadius: 8, border: `1px solid rgba(231, 76, 60, 0.2)`, fontSize: 13, lineHeight: 1.6, marginBottom: 24, color: C.grayLight }}>
            <strong style={{ color: C.warnRed }}>{t.s4StuckWarning.replace('{count}', String(overDedicated))}</strong>
          </div>
        )}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 16 }}>{t.s4ThreeWaysTitle}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <div style={{ background: C.subtle, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.gold, color: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>1</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.white, marginBottom: 6 }}>{t.s4Way1Title}</div>
            <div style={{ fontSize: 12, color: C.grayLight, lineHeight: 1.5 }}>{t.s4Way1Desc}</div>
          </div>
          <div style={{ background: C.subtle, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.gold, color: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>2</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.white, marginBottom: 6 }}>{t.s4Way2Title}</div>
            <div style={{ fontSize: 12, color: C.grayLight, lineHeight: 1.5 }}>{t.s4Way2Desc}</div>
          </div>
          <div style={{ background: C.subtle, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.gold, color: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>3</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.white, marginBottom: 6 }}>{t.s4Way3Title}</div>
            <div style={{ fontSize: 12, color: C.grayLight, lineHeight: 1.5 }}>{t.s4Way3Desc}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Section5({ t }: { t: DedicationStrings }) {
  const locations = [
    { icon: '📋', title: t.s5Loc1Title, path: t.s5Loc1Path, canDo: t.s5Loc1Can, when: t.s5Loc1When },
    { icon: '📊', title: t.s5Loc2Title, path: t.s5Loc2Path, canDo: t.s5Loc2Can, when: t.s5Loc2When },
    { icon: '✏️', title: t.s5Loc3Title, path: t.s5Loc3Path, canDo: t.s5Loc3Can, when: t.s5Loc3When },
    { icon: '📦', title: t.s5Loc4Title, path: t.s5Loc4Path, canDo: t.s5Loc4Can, when: t.s5Loc4When },
    { icon: '🔄', title: t.s5Loc5Title, path: t.s5Loc5Path, canDo: t.s5Loc5Can, when: t.s5Loc5When },
  ]

  return (
    <section style={section}>
      <h2 style={heading}>{t.s5Title}</h2>
      <p style={sub}>{t.s5Intro}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {locations.map((loc, i) => (
          <div key={i} style={{ ...card, marginBottom: 0 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{loc.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 8 }}>{loc.title}</div>
            <div style={{ fontSize: 12, color: C.gray, marginBottom: 12, padding: '4px 8px', background: C.subtle, borderRadius: 4, display: 'inline-block', border: `1px solid ${C.border}` }}>{loc.path}</div>
            <div style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.5, marginBottom: 8 }}><strong style={{ color: C.gold }}>{t.s5WhatCanYou}</strong> {loc.canDo}</div>
            <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5, fontStyle: 'italic' }}>{t.s5UseIt} {loc.when}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function RowItem({ label, value, color, bold }: { label: string; value: number; color: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, fontWeight: bold ? 700 : 400 }}>
      <span style={{ color: C.grayLight }}>{label}</span>
      <span style={{ color, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{value > 0 ? '+' : ''}{value}</span>
    </div>
  )
}

function StepCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div style={{ background: C.subtle, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.gold, color: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{num}</div>
      <div style={{ fontWeight: 700, fontSize: 14, color: C.white, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: C.grayLight, lineHeight: 1.5 }}>{desc}</div>
    </div>
  )
}

export default function DedicationContent({ lang = 'da' }: { lang?: string }) {
  const t = getDedicationT(lang)
  return (
    <div style={{ background: '#222222', borderRadius: 12, padding: '8px 24px', border: '1px solid #333333' }}>
      <Section1 t={t} />
      <Section2 t={t} />
      <Section3 t={t} />
      <Section4 t={t} />
      <Section5 t={t} />
    </div>
  )
}
