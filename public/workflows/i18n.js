/**
 * i18n helper for workflow HTML files
 * Supports both React components (via t() function) and DOM text replacement
 */

// Supported locales
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

// Load translations from JSON file
async function loadTranslations(workflowName) {
  const locale = getLocale();
  
  // Danish is the source language - no translation needed
  if (locale === 'da') {
    return { locale, translations: null };
  }

  try {
    const response = await fetch(`/workflows/${workflowName}-translations.json`);
    if (!response.ok) {
      console.warn(`[i18n] Translations file not found for ${workflowName}`);
      return { locale, translations: null };
    }
    const allTranslations = await response.json();
    const translations = allTranslations[locale] || null;
    
    if (!translations) {
      console.warn(`[i18n] No translations found for locale: ${locale}`);
    }
    
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
