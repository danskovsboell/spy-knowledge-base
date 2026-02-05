#!/usr/bin/env node
/**
 * Apply i18n to workflow HTML files
 * Replaces hardcoded Danish strings with t() calls based on translation JSON
 * 
 * Usage: node scripts/apply-i18n-to-workflow.mjs ongoing-workflow
 */

import fs from 'fs';
import path from 'path';

const WORKFLOWS_DIR = '/home/clawdbot/clawd/spy-knowledge-base/public/workflows';

const workflowName = process.argv[2];
if (!workflowName) {
  console.error('Usage: node apply-i18n-to-workflow.mjs <workflow-name>');
  console.error('Example: node apply-i18n-to-workflow.mjs ongoing-workflow');
  process.exit(1);
}

const htmlFile = path.join(WORKFLOWS_DIR, `${workflowName}.html`);
const transFile = path.join(WORKFLOWS_DIR, `${workflowName}-translations.json`);

if (!fs.existsSync(htmlFile)) {
  console.error(`HTML file not found: ${htmlFile}`);
  process.exit(1);
}

if (!fs.existsSync(transFile)) {
  console.error(`Translations file not found: ${transFile}`);
  process.exit(1);
}

// Load translations to get the list of Danish strings
const translations = JSON.parse(fs.readFileSync(transFile, 'utf8'));
const danishStrings = Object.keys(translations.en || translations[Object.keys(translations)[0]] || {});

// Sort by length descending to replace longer strings first (avoid partial matches)
danishStrings.sort((a, b) => b.length - a.length);

console.log(`Found ${danishStrings.length} strings to translate in ${workflowName}`);

// Load HTML
let html = fs.readFileSync(htmlFile, 'utf8');

// Track replacements
let replacements = 0;

// Replace each Danish string with t() call
for (const daString of danishStrings) {
  // Skip very short strings that might cause false positives
  if (daString.length < 4) continue;
  
  // Skip strings that are just technical terms (no spaces, looks like code)
  if (/^[A-Z_]+$/.test(daString) || /^\d+$/.test(daString)) continue;
  
  // Escape special regex characters
  const escaped = daString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Pattern 1: >DanishString< (text content in JSX)
  const pattern1 = new RegExp(`>(\\s*)${escaped}(\\s*)<`, 'g');
  html = html.replace(pattern1, (match, ws1, ws2) => {
    replacements++;
    return `>${ws1}{t("${daString}")}${ws2}<`;
  });
  
  // Pattern 2: ">DanishString</span>" style patterns
  const pattern2 = new RegExp(`">(\\s*)${escaped}(\\s*)</`, 'g');
  html = html.replace(pattern2, (match, ws1, ws2) => {
    replacements++;
    return `">${ws1}{t("${daString}")}${ws2}</`;
  });
  
  // Pattern 3: <span>DanishString</span> etc
  const pattern3 = new RegExp(`(<(?:span|div|p|h[1-6]|td|th|label|button)[^>]*>)(\\s*)${escaped}(\\s*)(</(?:span|div|p|h[1-6]|td|th|label|button)>)`, 'gi');
  html = html.replace(pattern3, (match, open, ws1, ws2, close) => {
    replacements++;
    return `${open}${ws1}{t("${daString}")}${ws2}${close}`;
  });
}

// Save updated HTML
fs.writeFileSync(htmlFile, html);

console.log(`Applied ${replacements} i18n replacements to ${htmlFile}`);
console.log('Note: Manual review recommended');
