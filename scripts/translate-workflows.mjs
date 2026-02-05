#!/usr/bin/env node
/**
 * Workflow Translation Script
 * 
 * Læser dansk tekst fra workflow HTML-filer og oversætter til engelsk (en) og hollandsk (nl)
 * via OpenAI API. Gemmer oversættelser i JSON-filer.
 * 
 * Usage: node translate-workflows.mjs [workflow-name]
 * Example: node translate-workflows.mjs ongoing-workflow
 */

import { readFile, writeFile } from 'fs/promises';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = 'gpt-4o-mini';

// Workflow files
const WORKFLOWS_DIR = join(__dirname, '../public/workflows');
const WORKFLOW_FILES = [
    'ongoing-workflow.html',
    'nemedi-workflow.html',
    'sitoo-workflow.html',
    'lector-customs-workflow.html'
];

/**
 * Extract translatable text from HTML content
 * Finds all text inside t("...") function calls
 */
function extractTranslatableText(html) {
    const texts = new Set();
    
    // Match t("...") and t('...') patterns
    const tFunctionRegex = /\bt\s*\(\s*["']([^"']+)["']\s*\)/g;
    let match;
    
    while ((match = tFunctionRegex.exec(html)) !== null) {
        const text = match[1];
        // Skip empty strings and strings that look like code/paths
        if (text && text.trim() && !text.startsWith('/') && !text.includes('Task')) {
            texts.add(text);
        }
    }
    
    return Array.from(texts);
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text) {
    const entities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#x27;': "'",
        '&apos;': "'",
        '&aring;': 'å',
        '&Aring;': 'Å',
        '&aelig;': 'æ',
        '&AElig;': 'Æ',
        '&oslash;': 'ø',
        '&Oslash;': 'Ø',
        '&nbsp;': ' ',
        '&mdash;': '—',
        '&ndash;': '–',
        '&rarr;': '→',
        '&larr;': '←',
        '&eacute;': 'é'
    };
    
    let decoded = text;
    for (const [entity, char] of Object.entries(entities)) {
        decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }
    
    // Handle numeric entities
    decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => 
        String.fromCodePoint(parseInt(hex, 16))
    );
    decoded = decoded.replace(/&#(\d+);/g, (_, dec) => 
        String.fromCodePoint(parseInt(dec, 10))
    );
    
    return decoded;
}

/**
 * Call OpenAI API to translate texts
 */
async function translateWithOpenAI(texts, targetLang) {
    const langNames = {
        'en': 'English',
        'nl': 'Dutch'
    };
    
    const prompt = `You are a professional translator. Translate the following Danish texts to ${langNames[targetLang]}.
These are UI texts for a warehouse management system integration documentation.

Return ONLY a JSON object mapping Danish text → ${langNames[targetLang]} translation.
Keep technical terms, product names, and code references (like "PRICAT", "DESADV", "Ongoing") unchanged.
Preserve any formatting like colons, parentheses, etc.

Danish texts to translate:
${JSON.stringify(texts, null, 2)}

Return JSON object with format: {"danish text": "translated text", ...}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
                { role: 'system', content: 'You are a professional translator specializing in technical documentation. Return only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
        return JSON.parse(content);
    } catch (e) {
        console.error('Failed to parse OpenAI response:', content);
        throw new Error('Invalid JSON response from OpenAI');
    }
}

/**
 * Process a single workflow file
 */
async function processWorkflow(filename) {
    const filepath = join(WORKFLOWS_DIR, filename);
    const workflowName = basename(filename, '.html');
    
    console.log(`\n📄 Processing: ${filename}`);
    
    // Read HTML file
    const html = await readFile(filepath, 'utf-8');
    
    // Extract translatable texts
    const texts = extractTranslatableText(html);
    console.log(`   Found ${texts.length} translatable strings`);
    
    if (texts.length === 0) {
        console.log('   ⚠️  No translatable texts found (no t() function calls)');
        return null;
    }
    
    // Decode HTML entities in source texts
    const decodedTexts = texts.map(t => decodeHtmlEntities(t));
    
    // Create Danish base (identity mapping)
    const daTranslations = {};
    for (const text of decodedTexts) {
        daTranslations[text] = text;
    }
    
    console.log(`   🔄 Translating to English...`);
    const enTranslations = await translateWithOpenAI(decodedTexts, 'en');
    
    console.log(`   🔄 Translating to Dutch...`);
    const nlTranslations = await translateWithOpenAI(decodedTexts, 'nl');
    
    // Build final translation object
    const translations = {
        da: daTranslations,
        en: enTranslations,
        nl: nlTranslations
    };
    
    // Save to JSON file
    const outputPath = join(WORKFLOWS_DIR, `${workflowName}-translations.json`);
    await writeFile(outputPath, JSON.stringify(translations, null, 2), 'utf-8');
    
    console.log(`   ✅ Saved: ${workflowName}-translations.json`);
    
    return translations;
}

/**
 * Main function
 */
async function main() {
    console.log('🌐 Workflow Translation Script');
    console.log('================================');
    console.log(`Using model: ${OPENAI_MODEL}`);
    
    const specificWorkflow = process.argv[2];
    
    let filesToProcess = WORKFLOW_FILES;
    if (specificWorkflow) {
        const filename = specificWorkflow.endsWith('.html') ? specificWorkflow : `${specificWorkflow}.html`;
        if (!WORKFLOW_FILES.includes(filename)) {
            console.error(`❌ Unknown workflow: ${specificWorkflow}`);
            console.log(`Available workflows: ${WORKFLOW_FILES.join(', ')}`);
            process.exit(1);
        }
        filesToProcess = [filename];
    }
    
    for (const file of filesToProcess) {
        try {
            await processWorkflow(file);
        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.message);
        }
    }
    
    console.log('\n✨ Done!');
}

main().catch(console.error);
