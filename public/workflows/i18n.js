/**
 * i18n helper for workflow HTML files
 * Supports both React components (via t() function) and DOM text replacement
 * 
 * Henter oversættelser fra Supabase database via API endpoint
 */

// Supported locales
const SUPPORTED_LOCALES = ['da', 'en', 'nl'];
const DEFAULT_LOCALE = 'da';

// Workflow name → database slug mapping
const WORKFLOW_SLUGS = {
  'ongoing-workflow': 'ongoing-wms',
  'nemedi-workflow': 'nemedi-workflow',
  'sitoo-workflow': 'sitoo-pos',
  'lector-customs-workflow': 'lector-customs'
};

// Get locale from URL parameter
function getLocale() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  if (lang && SUPPORTED_LOCALES.includes(lang)) {
    return lang;
  }
  return DEFAULT_LOCALE;
}

// Load translations from API endpoint (Supabase database)
async function loadTranslations(workflowName) {
  const locale = getLocale();
  
  // Danish is the source language - no translation needed
  if (locale === 'da') {
    return { locale, translations: null };
  }

  // Map workflow name to database slug
  const slug = WORKFLOW_SLUGS[workflowName] || workflowName;

  try {
    // Fetch from API endpoint (henter fra Supabase kb_translations)
    const response = await fetch(`/api/translations/${slug}/${locale}`);
    if (!response.ok) {
      console.warn(`[i18n] API returned ${response.status} for ${slug}/${locale}`);
      return { locale, translations: null };
    }
    
    const data = await response.json();
    const translations = data.translations || null;
    
    if (!translations || Object.keys(translations).length === 0) {
      console.warn(`[i18n] No translations found for ${slug}/${locale}`);
      return { locale, translations: null };
    }
    
    console.log(`[i18n] Loaded ${Object.keys(translations).length} translations for ${slug}/${locale} from ${data.source || 'API'}`);
    return { locale, translations };
  } catch (error) {
    console.error('[i18n] Error loading translations:', error);
    return { locale, translations: null };
  }
}

// Create translation function
function createTranslator(translations) {
  return function t(key, fallback) {
    if (!translations) {
      return fallback !== undefined ? fallback : key;
    }
    return translations[key] || fallback || key;
  };
}

// Replace text in DOM after React has rendered
function translateDOM(translations) {
  if (!translations) return;
  
  // Walk all text nodes and replace
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }
  
  for (const node of textNodes) {
    const text = node.textContent.trim();
    if (text && translations[text]) {
      node.textContent = node.textContent.replace(text, translations[text]);
    }
  }
  
  // Also check common attributes
  const elementsWithText = document.querySelectorAll('[title], [placeholder], [aria-label]');
  for (const el of elementsWithText) {
    for (const attr of ['title', 'placeholder', 'aria-label']) {
      const val = el.getAttribute(attr);
      if (val && translations[val]) {
        el.setAttribute(attr, translations[val]);
      }
    }
  }
}

// Initialize i18n for a workflow
async function initI18n(workflowName) {
  const { locale, translations } = await loadTranslations(workflowName);
  const t = createTranslator(translations);
  
  // Update HTML lang attribute
  document.documentElement.lang = locale;
  
  // Store globally for React components
  window.t = t;
  window.currentLocale = locale;
  window._i18nTranslations = translations;
  
  return { locale, t, translations };
}

// Apply translations to DOM after render (call this after React renders)
function applyTranslations() {
  if (window._i18nTranslations) {
    translateDOM(window._i18nTranslations);
  }
}

// Auto-apply translations after a delay (for React to finish rendering)
function autoApplyTranslations(delayMs = 100) {
  setTimeout(applyTranslations, delayMs);
}

// Export for use in workflows
window.i18n = {
  getLocale,
  loadTranslations,
  createTranslator,
  initI18n,
  applyTranslations,
  autoApplyTranslations,
  translateDOM,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  WORKFLOW_SLUGS
};
