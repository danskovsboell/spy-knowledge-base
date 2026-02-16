'use client'

import { getReturnsT } from './returns-translations'

export default function ReturnsContent({ lang }: { lang: string }) {
  const t = getReturnsT(lang)

  return (
    <div className="article-content">
      {/* Section 1: Overview */}
      <section className="content-section">
        <h2>{t.s1Title}</h2>
        <p>{t.s1Intro}</p>
        <div className="info-box">{t.s1KeyPoint}</div>
      </section>

      {/* Section 2: Shopify Returns */}
      <section className="content-section">
        <h2>{t.s2Title}</h2>
        <p>{t.s2Intro}</p>
        <div className="step-list">
          <div className="step"><h3>{t.s2Step1Title}</h3><p>{t.s2Step1Desc}</p></div>
          <div className="step"><h3>{t.s2Step2Title}</h3><p>{t.s2Step2Desc}</p></div>
          <div className="step"><h3>{t.s2Step3Title}</h3><p>{t.s2Step3Desc}</p></div>
          <div className="step"><h3>{t.s2Step4Title}</h3><p>{t.s2Step4Desc}</p></div>
        </div>
        <div className="tip-box">{t.s2Tip}</div>
        <div className="info-box">{t.s2PortalNote}</div>
      </section>

      {/* Section 3: Ongoing WMS */}
      <section className="content-section">
        <h2>{t.s3Title}</h2>
        <p>{t.s3Intro}</p>
        <div className="step-list">
          <div className="step"><h3>{t.s3Step1Title}</h3><p>{t.s3Step1Desc}</p></div>
          <div className="step"><h3>{t.s3Step2Title}</h3><p>{t.s3Step2Desc}</p></div>
          <div className="step"><h3>{t.s3Step3Title}</h3><p>{t.s3Step3Desc}</p></div>
          <div className="step"><h3>{t.s3Step4Title}</h3><p>{t.s3Step4Desc}</p></div>
        </div>
        <div className="info-box">{t.s3B2cNote}</div>
      </section>

      {/* Section 4: NemEDI */}
      <section className="content-section">
        <h2>{t.s4Title}</h2>
        <p>{t.s4Intro}</p>
        <div className="step-list">
          <div className="step"><h3>{t.s4Step1Title}</h3><p>{t.s4Step1Desc}</p></div>
          <div className="step"><h3>{t.s4Step2Title}</h3><p>{t.s4Step2Desc}</p></div>
          <div className="step"><h3>{t.s4Step3Title}</h3><p>{t.s4Step3Desc}</p></div>
        </div>
        <div className="info-box">{t.s4NemediNote}</div>
      </section>

      {/* Section 5: Claims */}
      <section className="content-section">
        <h2>{t.s5Title}</h2>
        <p>{t.s5Intro}</p>
        <div className="step-list">
          <div className="step"><h3>{t.s5Step1Title}</h3><p>{t.s5Step1Desc}</p></div>
          <div className="step"><h3>{t.s5Step2Title}</h3><p>{t.s5Step2Desc}</p></div>
          <div className="step"><h3>{t.s5Step3Title}</h3><p>{t.s5Step3Desc}</p></div>
        </div>
        <div className="info-box">{t.s5AutoNote}</div>
      </section>

      {/* Section 6: Return to Stock */}
      <section className="content-section">
        <h2>{t.s6Title}</h2>
        <p>{t.s6Intro}</p>
        <p>{t.s6Desc}</p>
      </section>

      {/* Section 7: Supported portals */}
      <section className="content-section">
        <h2>{t.s7Title}</h2>
        <p>{t.s7Intro}</p>
        <div className="info-box" style={{ whiteSpace: 'pre-line' }}>{t.s7List}</div>
      </section>

      {/* Section 8: Overview table */}
      <section className="content-section">
        <h2>{t.s8Title}</h2>
        <table className="overview-table">
          <thead>
            <tr><th>{t.s8Channel}</th><th>{t.s8Type}</th><th>{t.s8How}</th></tr>
          </thead>
          <tbody>
            <tr><td>{t.s8Row1Channel}</td><td>{t.s8Row1Type}</td><td>{t.s8Row1How}</td></tr>
            <tr><td>{t.s8Row2Channel}</td><td>{t.s8Row2Type}</td><td>{t.s8Row2How}</td></tr>
            <tr><td>{t.s8Row3Channel}</td><td>{t.s8Row3Type}</td><td>{t.s8Row3How}</td></tr>
            <tr><td>{t.s8Row4Channel}</td><td>{t.s8Row4Type}</td><td>{t.s8Row4How}</td></tr>
            <tr><td>{t.s8Row5Channel}</td><td>{t.s8Row5Type}</td><td>{t.s8Row5How}</td></tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}
