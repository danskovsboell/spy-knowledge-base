#!/bin/bash
# Add i18n support to all workflow HTML files

WORKFLOWS_DIR="/home/clawdbot/clawd/spy-knowledge-base/public/workflows"

for html_file in "$WORKFLOWS_DIR"/*.html; do
    filename=$(basename "$html_file" .html)
    echo "Processing $filename..."
    
    # Skip if already has i18n.js
    if grep -q 'i18n.js' "$html_file"; then
        echo "  Already has i18n.js, skipping include"
    else
        # Add i18n.js script after babel
        sed -i 's|<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>|<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n    <script src="/workflows/i18n.js"></script>|' "$html_file"
        echo "  Added i18n.js include"
    fi
    
    # Check if it has the old ReactDOM.render pattern
    if grep -q "ReactDOM.render(<" "$html_file" && ! grep -q "initI18n" "$html_file"; then
        echo "  Needs i18n initialization (manual update required)"
    fi
done

echo "Done!"
