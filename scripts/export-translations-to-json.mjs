#!/usr/bin/env node
/**
 * Export workflow translations from Supabase to JSON files
 * Usage: node scripts/export-translations-to-json.mjs
 */

import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://fbaxsnfbgqipgyozcbzw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_vMSnh4dH1c5MtlYbGCmILg_lCNcOD1G';
const WORKFLOWS_DIR = '/home/clawdbot/clawd/spy-knowledge-base/public/workflows';

// Map article slugs to workflow file names
const SLUG_TO_WORKFLOW = {
  'ongoing-wms': 'ongoing-workflow',
  'sitoo-pos': 'sitoo-workflow',
  'nemedi': 'nemedi-workflow',
  'lector-customs': 'lector-customs-workflow',
};

async function fetchTranslations() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/kb_translations?select=article_id,language_code,content,kb_articles!inner(slug)`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function main() {
  console.log('Fetching translations from Supabase...');
  
  const translations = await fetchTranslations();
  console.log(`Fetched ${translations.length} translation records`);

  // Group by workflow
  const byWorkflow = {};
  
  for (const trans of translations) {
    const slug = trans.kb_articles?.slug;
    if (!slug) continue;
    
    const workflowName = SLUG_TO_WORKFLOW[slug];
    if (!workflowName) {
      console.log(`  Skipping unknown slug: ${slug}`);
      continue;
    }

    if (!byWorkflow[workflowName]) {
      byWorkflow[workflowName] = {};
    }

    // Parse content JSON
    if (trans.content) {
      try {
        const content = JSON.parse(trans.content);
        byWorkflow[workflowName][trans.language_code] = content;
      } catch (e) {
        console.error(`  Failed to parse content for ${slug}/${trans.language_code}`);
      }
    }
  }

  // Write JSON files
  for (const [workflowName, locales] of Object.entries(byWorkflow)) {
    // Remove Danish (source language) - not needed in translations file
    delete locales.da;
    
    if (Object.keys(locales).length === 0) {
      console.log(`  No translations for ${workflowName}, skipping`);
      continue;
    }

    const outFile = path.join(WORKFLOWS_DIR, `${workflowName}-translations.json`);
    fs.writeFileSync(outFile, JSON.stringify(locales, null, 2));
    console.log(`  Wrote ${outFile} (${Object.keys(locales).length} locales)`);
  }

  console.log('Done!');
}

main().catch(console.error);
