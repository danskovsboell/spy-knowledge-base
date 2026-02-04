export default function NemediPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href="/">Oversigt</a> → Integrationer → NemEDI
        </div>
        <h1>NemEDI Integration</h1>
        <p>EDI dokumentflow for NemEDI integration – PRICAT, ordrer og leveringsadviser</p>
      </div>
      <div className="iframe-wrapper">
        <iframe
          src="/workflows/nemedi-workflow.html"
          title="NemEDI Workflow"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </>
  )
}
