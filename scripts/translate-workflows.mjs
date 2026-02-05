#!/usr/bin/env node
/**
 * Workflow Translation Script
 * 
 * Læser dansk tekst fra workflow HTML-filer og oversætter til engelsk (en) og hollandsk (nl)
 * via OpenAI API. Gemmer oversættelser i Supabase kb_translations tabellen.
 * 
 * Usage: node translate-workflows.mjs [workflow-name]
 * Example: node translate-workflows.mjs ongoing-workflow
 */

import { readFile } from 'fs/promises';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = 'gpt-5-mini';

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fbaxsnfbgqipgyozcbzw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Workflow files and their corresponding slugs
const WORKFLOWS_DIR = join(__dirname, '../public/workflows');
const WORKFLOW_CONFIG = [
    { file: 'ongoing-workflow.html', slug: 'ongoing-wms' },
    { file: 'nemedi-workflow.html', slug: 'nemedi-workflow' },
    { file: 'sitoo-workflow.html', slug: 'sitoo-pos' },
    { file: 'lector-customs-workflow.html', slug: 'lector-customs' }
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
 * Get or create article in kb_articles
 */
async function getOrCreateArticle(slug, title) {
    // Check if article exists
    const { data: existing, error: selectError } = await supabase
        .from('kb_articles')
        .select('id')
        .eq('slug', slug)
        .single();
    
    if (existing) {
        console.log(`   📚 Found existing article: ${slug} (id: ${existing.id})`);
        return existing.id;
    }
    
    // Create new article (only slug and category - no title/status columns exist)
    const { data: newArticle, error: insertError } = await supabase
        .from('kb_articles')
        .insert({
            slug: slug,
            category: 'workflows',
            is_published: true
        })
        .select('id')
        .single();
    
    if (insertError) {
        throw new Error(`Failed to create article: ${insertError.message}`);
    }
    
    console.log(`   📚 Created new article: ${slug} (id: ${newArticle.id})`);
    return newArticle.id;
}

/**
 * Save translation to Supabase
 */
async function saveTranslationToSupabase(articleId, locale, translations) {
    const contentJson = JSON.stringify(translations);
    
    // Check if translation exists
    const { data: existing } = await supabase
        .from('kb_translations')
        .select('id')
        .eq('article_id', articleId)
        .eq('language_code', locale)
        .single();
    
    if (existing) {
        // Update existing translation
        const { error } = await supabase
            .from('kb_translations')
            .update({
                content: contentJson,
                status: 'published',
                translated_by: 'openai-gpt-4o-mini',
                translated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        
        if (error) throw new Error(`Failed to update translation: ${error.message}`);
        console.log(`   💾 Updated ${locale} translation in database`);
    } else {
        // Insert new translation
        const { error } = await supabase
            .from('kb_translations')
            .insert({
                article_id: articleId,
                language_code: locale,
                title: '',
                content: contentJson,
                status: 'published',
                translated_by: 'openai-gpt-4o-mini',
                translated_at: new Date().toISOString()
            });
        
        if (error) throw new Error(`Failed to insert translation: ${error.message}`);
        console.log(`   💾 Saved ${locale} translation to database`);
    }
}

/**
 * Process a single workflow file
 */
async function processWorkflow(config) {
    const { file, slug } = config;
    const filepath = join(WORKFLOWS_DIR, file);
    const workflowName = basename(file, '.html');
    
    console.log(`\n📄 Processing: ${file} (slug: ${slug})`);
    
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
    
    // Get or create article in database
    const articleId = await getOrCreateArticle(slug, workflowName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    
    // Create Danish base (identity mapping)
    const daTranslations = {};
    for (const text of decodedTexts) {
        daTranslations[text] = text;
    }
    
    // Save Danish (source) translations
    await saveTranslationToSupabase(articleId, 'da', daTranslations);
    
    console.log(`   🔄 Translating to English...`);
    const enTranslations = await translateWithOpenAI(decodedTexts, 'en');
    await saveTranslationToSupabase(articleId, 'en', enTranslations);
    
    console.log(`   🔄 Translating to Dutch...`);
    const nlTranslations = await translateWithOpenAI(decodedTexts, 'nl');
    await saveTranslationToSupabase(articleId, 'nl', nlTranslations);
    
    console.log(`   ✅ Completed: ${workflowName}`);
    
    return { da: daTranslations, en: enTranslations, nl: nlTranslations };
}

/**
 * Main function
 */
async function main() {
    console.log('🌐 Workflow Translation Script (Supabase)');
    console.log('==========================================');
    console.log(`Using model: ${OPENAI_MODEL}`);
    console.log(`Supabase: ${SUPABASE_URL}`);
    
    if (!OPENAI_API_KEY) {
        console.error('❌ OPENAI_API_KEY environment variable is required');
        process.exit(1);
    }
    
    const specificWorkflow = process.argv[2];
    
    let configsToProcess = WORKFLOW_CONFIG;
    if (specificWorkflow) {
        const filename = specificWorkflow.endsWith('.html') ? specificWorkflow : `${specificWorkflow}.html`;
        const config = WORKFLOW_CONFIG.find(c => c.file === filename);
        if (!config) {
            console.error(`❌ Unknown workflow: ${specificWorkflow}`);
            console.log(`Available workflows: ${WORKFLOW_CONFIG.map(c => c.file).join(', ')}`);
            process.exit(1);
        }
        configsToProcess = [config];
    }
    
    for (const config of configsToProcess) {
        try {
            await processWorkflow(config);
        } catch (error) {
            console.error(`❌ Error processing ${config.file}:`, error.message);
        }
    }
    
    console.log('\n✨ Done! Translations saved to Supabase database.');
}

main().catch(console.error);
