export default function LectorPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href="/">Oversigt</a> → Integrationer → Lector Customs
        </div>
        <h1>Lector Customs Integration</h1>
        <p>Told/customs workflow for Lector integration – toldbehandling, HS-koder og dokumentation</p>
      </div>
      <div className="iframe-wrapper">
        <iframe
          src="/workflows/lector-customs-workflow.html"
          title="Lector Customs Workflow"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </>
  )
}
