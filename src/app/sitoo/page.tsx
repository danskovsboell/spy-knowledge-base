export default function SitooPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href="/">Oversigt</a> → Integrationer → Sitoo POS
        </div>
        <h1>Sitoo POS Integration</h1>
        <p>Workflow for Sitoo POS integration – butikssalg, lagersynkronisering og produktdata</p>
      </div>
      <div className="iframe-wrapper">
        <iframe
          src="/workflows/sitoo-workflow.html"
          title="Sitoo POS Workflow"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </>
  )
}
