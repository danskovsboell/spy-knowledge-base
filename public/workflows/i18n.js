/**
 * i18n helper for workflow HTML files
 * Supports both React components (via t() function) and DOM text replacement
 */

// Supported locales (currently active: da, en, nl)
const SUPPORTED_LOCALES = ['da', 'en', 'nl'];
const DEFAULT_LOCALE = 'da';

// Get locale from URL parameter
function getLocale() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  if (lang && SUPPORTED_LOCALES.includes(lang)) {
    return lang;
  }
  return DEFAULT_LOCALE;
}

// Map workflow HTML filenames to article slugs
const WORKFLOW_SLUG_MAP = {
  'ongoing-workflow': 'ongoing-wms',
  'sitoo-workflow': 'sitoo-pos',
  'nemedi-workflow': 'nemedi',
  'lector-customs-workflow': 'lector-customs',
  'dedication': 'dedication'
};

// Load translations from database API
async function loadTranslations(workflowName) {
  const locale = getLocale();

  // Map workflow name to article slug
  const slug = WORKFLOW_SLUG_MAP[workflowName] || workflowName;

  try {
    // Fetch from database API
    const response = await fetch(`/api/translations/${slug}/${locale}`);
    if (!response.ok) {
      console.warn(`[i18n] Translations not found for ${slug}/${locale}`);
      return { locale, translations: null };
    }

    const data = await response.json();
    const translations = data.translations || null;

    if (!translations || Object.keys(translations).length === 0) {
      console.warn(`[i18n] No translations found for locale: ${locale}`);
      return { locale, translations: null };
    }

    console.log(`[i18n] Loaded ${Object.keys(translations).length} translations from database for ${slug}/${locale}`);
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
  DEFAULT_LOCALE
};
