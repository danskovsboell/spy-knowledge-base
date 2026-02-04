export default function OngoingPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href="/">Oversigt</a> → Integrationer → Ongoing WMS
        </div>
        <h1>Ongoing WMS Integration</h1>
        <p>Komplet workflow for Ongoing WMS integration – ordrer, webhooks, statuser og fejlhåndtering</p>
      </div>
      <div className="iframe-wrapper">
        <iframe
          src="/workflows/ongoing-workflow.html"
          title="Ongoing WMS Workflow"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </>
  )
}
