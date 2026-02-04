import GuideCard from '../components/GuideCard'

export default function HomePage() {
  return (
    <>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h1>Velkommen til SPY Knowledge Base</h1>
        <p>
          Dit samlede sted for workflows, integrationsguides og dokumentation.
          Her finder du alt hvad du skal bruge for at forstå SPY&apos;s systemer og processer.
        </p>
        <div className="welcome-stats">
          <div className="welcome-stat">
            <div className="welcome-stat-num">4</div>
            <div className="welcome-stat-label">Integration<br/>Workflows</div>
          </div>
          <div className="welcome-stat">
            <div className="welcome-stat-num">1</div>
            <div className="welcome-stat-label">Funktions-<br/>guide</div>
          </div>
          <div className="welcome-stat">
            <div className="welcome-stat-num">1</div>
            <div className="welcome-stat-label">Domain<br/>Guide</div>
          </div>
        </div>
      </div>

      {/* Integrationer */}
      <div className="section-title">🔌 Integrationer</div>
      <div className="guide-grid" style={{ marginBottom: 32 }}>
        <GuideCard
          href="/ongoing"
          title="Ongoing WMS"
          description="Komplet workflow for Ongoing WMS integration – ordrer, webhooks, statuser og fejlhåndtering."
          category="Integration / Development"
          icon="📦"
          iconBg="#ebf5fb"
          imageSrc="/images/ongoing.svg"
          badge="Interaktiv workflow"
          badgeColor="#337ab7"
          badgeBg="#ebf5fb"
        />
        <GuideCard
          href="/sitoo"
          title="Sitoo POS"
          description="Workflow for Sitoo POS integration – butikssalg, lagersynkronisering og produktdata."
          category="Integration / Development"
          icon="🏪"
          iconBg="#e8f8f5"
          imageSrc="/images/sitoo.png"
          badge="Interaktiv workflow"
          badgeColor="#27ae60"
          badgeBg="#e8f8f5"
        />
        <GuideCard
          href="/nemedi"
          title="NemEDI"
          description="EDI dokumentflow for NemEDI integration – PRICAT, ordrer og leveringsadviser."
          category="Integration / Development"
          icon="📄"
          iconBg="#fef9e7"
          imageSrc="/images/nemedi.png"
          badge="Interaktiv workflow"
          badgeColor="#e67e22"
          badgeBg="#fef9e7"
        />
        <GuideCard
          href="/lector"
          title="Lector Customs"
          description="Told/customs workflow for Lector integration – toldbehandling, HS-koder og dokumentation."
          category="Integration / Development"
          icon="🛃"
          iconBg="#f4ecf7"
          imageSrc="/images/lector.png"
          badge="Interaktiv workflow"
          badgeColor="#9b59b6"
          badgeBg="#f4ecf7"
        />
      </div>

      {/* Funktioner */}
      <div className="section-title">⚙️ Funktioner</div>
      <div className="guide-grid" style={{ marginBottom: 32 }}>
        <GuideCard
          href="/dedication"
          title="Dedication / Reservering"
          description="Guide til Pre-Dedication funktionaliteten – fordeling af varer mellem Stock og Pre ordrer."
          category="Funktioner / Support"
          icon="🎯"
          iconBg="#f4ecf7"
          badge="Interaktiv guide"
          badgeColor="#9b59b6"
          badgeBg="#f4ecf7"
        />
      </div>

      {/* Dokumentation */}
      <div className="section-title">📖 Dokumentation</div>
      <div className="guide-grid">
        <GuideCard
          href="/domain-guide"
          title="SPY Domain Guide"
          description="Overordnet domæneguide for SPY's forretningsmodel, begreber, dataflows og systemstruktur."
          category="Dokumentation / Alle"
          icon="📚"
          iconBg="#ebf5fb"
          badge="Reference-dokument"
          badgeColor="#337ab7"
          badgeBg="#ebf5fb"
        />
      </div>
    </>
  )
}
