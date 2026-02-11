// Article data layer - fetches from Supabase with graceful fallback to hardcoded content

import { supabase, createServerClient } from './supabase'
import type { Locale } from './i18n'

export interface ArticleData {
  slug: string
  category: string
  icon: string
  imageUrl: string | null
  badge: string
  badgeColor: string
  sortOrder: number
  title: string
  description: string
  content: string | null
  contentType: 'iframe' | 'react' | 'html' | 'markdown'
  iframeSrc?: string
}

// Hardcoded fallback data (Danish originals)
const FALLBACK_ARTICLES: Record<string, Omit<ArticleData, 'title' | 'description'> & { titles: Record<string, string>, descriptions: Record<string, string> }> = {
  'ongoing-wms': {
    slug: 'ongoing-wms',
    category: 'Integration',
    icon: '📦',
    imageUrl: '/images/ongoing.svg',
    badge: 'Interaktiv workflow',
    badgeColor: '#3498db',
    sortOrder: 1,
    content: null,
    contentType: 'iframe',
    iframeSrc: '/workflows/ongoing-workflow.html',
    titles: {
      da: 'Ongoing WMS',
      en: 'Ongoing WMS',
      de: 'Ongoing WMS',
      nl: 'Ongoing WMS',
      fr: 'Ongoing WMS',
      it: 'Ongoing WMS',
      es: 'Ongoing WMS',
      sv: 'Ongoing WMS',
      no: 'Ongoing WMS',
    },
    descriptions: {
      da: 'Komplet workflow for Ongoing WMS integration – ordrer, webhooks, statuser og fejlhåndtering.',
      en: 'Complete workflow for Ongoing WMS integration – orders, webhooks, statuses and error handling.',
      de: 'Kompletter Workflow für Ongoing WMS-Integration – Aufträge, Webhooks, Status und Fehlerbehandlung.',
      nl: 'Complete workflow voor Ongoing WMS-integratie – orders, webhooks, statussen en foutafhandeling.',
      fr: 'Workflow complet pour l\'intégration Ongoing WMS – commandes, webhooks, statuts et gestion des erreurs.',
      it: 'Workflow completo per l\'integrazione Ongoing WMS – ordini, webhook, stati e gestione errori.',
      es: 'Workflow completo para la integración Ongoing WMS – pedidos, webhooks, estados y manejo de errores.',
      sv: 'Komplett arbetsflöde för Ongoing WMS-integration – ordrar, webhooks, statusar och felhantering.',
      no: 'Komplett arbeidsflyt for Ongoing WMS-integrasjon – ordrer, webhooks, statuser og feilhåndtering.',
    },
  },
  'sitoo-pos': {
    slug: 'sitoo-pos',
    category: 'Integration',
    icon: '🏪',
    imageUrl: '/images/sitoo.png',
    badge: 'Interaktiv workflow',
    badgeColor: '#27ae60',
    sortOrder: 2,
    content: null,
    contentType: 'iframe',
    iframeSrc: '/workflows/sitoo-workflow.html',
    titles: {
      da: 'Sitoo POS',
      en: 'Sitoo POS',
      de: 'Sitoo POS',
      nl: 'Sitoo POS',
      fr: 'Sitoo POS',
      it: 'Sitoo POS',
      es: 'Sitoo POS',
      sv: 'Sitoo POS',
      no: 'Sitoo POS',
    },
    descriptions: {
      da: 'Workflow for Sitoo POS integration – butikssalg, lagersynkronisering og produktdata.',
      en: 'Workflow for Sitoo POS integration – retail sales, inventory sync and product data.',
      de: 'Workflow für Sitoo POS-Integration – Einzelhandelsverkauf, Bestandssynchronisierung und Produktdaten.',
      nl: 'Workflow voor Sitoo POS-integratie – winkelverkoop, voorraadsynchronisatie en productgegevens.',
      fr: 'Workflow pour l\'intégration Sitoo POS – ventes en magasin, synchronisation des stocks et données produits.',
      it: 'Workflow per l\'integrazione Sitoo POS – vendite al dettaglio, sincronizzazione inventario e dati prodotto.',
      es: 'Workflow para la integración Sitoo POS – ventas minoristas, sincronización de inventario y datos de producto.',
      sv: 'Arbetsflöde för Sitoo POS-integration – butiksförsäljning, lagersynkronisering och produktdata.',
      no: 'Arbeidsflyt for Sitoo POS-integrasjon – butikksalg, lagersynkronisering og produktdata.',
    },
  },
  'nemedi': {
    slug: 'nemedi',
    category: 'Integration',
    icon: '📄',
    imageUrl: '/images/nemedi.png',
    badge: 'Interaktiv workflow',
    badgeColor: '#e67e22',
    sortOrder: 3,
    content: null,
    contentType: 'iframe',
    iframeSrc: '/workflows/nemedi-workflow.html',
    titles: {
      da: 'NemEDI',
      en: 'NemEDI',
      de: 'NemEDI',
      nl: 'NemEDI',
      fr: 'NemEDI',
      it: 'NemEDI',
      es: 'NemEDI',
      sv: 'NemEDI',
      no: 'NemEDI',
    },
    descriptions: {
      da: 'EDI dokumentflow for NemEDI integration – PRICAT, ordrer og leveringsadviser.',
      en: 'EDI document flow for NemEDI integration – PRICAT, orders and delivery notices.',
      de: 'EDI-Dokumentenfluss für NemEDI-Integration – PRICAT, Bestellungen und Lieferavise.',
      nl: 'EDI-documentenstroom voor NemEDI-integratie – PRICAT, bestellingen en leveringsberichten.',
      fr: 'Flux de documents EDI pour l\'intégration NemEDI – PRICAT, commandes et avis de livraison.',
      it: 'Flusso documenti EDI per l\'integrazione NemEDI – PRICAT, ordini e avvisi di consegna.',
      es: 'Flujo de documentos EDI para la integración NemEDI – PRICAT, pedidos y avisos de entrega.',
      sv: 'EDI-dokumentflöde för NemEDI-integration – PRICAT, ordrar och leveransaviseringar.',
      no: 'EDI-dokumentflyt for NemEDI-integrasjon – PRICAT, bestillinger og leveringsadvarsler.',
    },
  },
  'lector-customs': {
    slug: 'lector-customs',
    category: 'Integration',
    icon: '🛃',
    imageUrl: '/images/lector.png',
    badge: 'Interaktiv workflow',
    badgeColor: '#9b59b6',
    sortOrder: 4,
    content: null,
    contentType: 'iframe',
    iframeSrc: '/workflows/lector-customs-workflow.html',
    titles: {
      da: 'Lector Customs',
      en: 'Lector Customs',
      de: 'Lector Customs',
      nl: 'Lector Customs',
      fr: 'Lector Customs',
      it: 'Lector Customs',
      es: 'Lector Customs',
      sv: 'Lector Customs',
      no: 'Lector Customs',
    },
    descriptions: {
      da: 'Told/customs workflow for Lector integration – toldbehandling, HS-koder og dokumentation.',
      en: 'Customs workflow for Lector integration – customs processing, HS codes and documentation.',
      de: 'Zoll-Workflow für Lector-Integration – Zollabwicklung, HS-Codes und Dokumentation.',
      nl: 'Douane-workflow voor Lector-integratie – douaneverwerking, HS-codes en documentatie.',
      fr: 'Workflow douanier pour l\'intégration Lector – traitement douanier, codes HS et documentation.',
      it: 'Workflow doganale per l\'integrazione Lector – elaborazione doganale, codici HS e documentazione.',
      es: 'Workflow aduanero para la integración Lector – despacho aduanero, códigos HS y documentación.',
      sv: 'Tullarbetsflöde för Lector-integration – tullhantering, HS-koder och dokumentation.',
      no: 'Toll-arbeidsflyt for Lector-integrasjon – tollbehandling, HS-koder og dokumentasjon.',
    },
  },
  'shopify-flow': {
    slug: 'shopify-flow',
    category: 'Integration',
    icon: '🛒',
    imageUrl: null,
    badge: 'Interaktiv workflow',
    badgeColor: '#27ae60',
    sortOrder: 5,
    content: null,
    contentType: 'iframe',
    iframeSrc: '/workflows/shopify-flow-workflow.html',
    titles: {
      da: 'Shopify integration',
      en: 'Shopify Integration',
      de: 'Shopify-Integration',
      nl: 'Shopify-integratie',
      fr: 'Intégration Shopify',
      it: 'Integrazione Shopify',
      es: 'Integración Shopify',
      sv: 'Shopify-integration',
      no: 'Shopify-integrasjon',
    },
    descriptions: {
      da: 'Spy\'s webhook-baserede realtidssynkronisering med Shopify – ordrer, produkter, fulfillment, returneringer og kø-system.',
      en: 'Spy\'s webhook-based real-time synchronization with Shopify – orders, products, fulfillment, returns and queue system.',
      de: 'Spy\'s webhook-basierte Echtzeit-Synchronisierung mit Shopify – Bestellungen, Produkte, Fulfillment, Retouren und Warteschlangensystem.',
      nl: 'Spy\'s webhook-gebaseerde real-time synchronisatie met Shopify – bestellingen, producten, fulfillment, retourzendingen en wachtrijsysteem.',
      fr: 'Synchronisation en temps réel basée sur les webhooks de Spy avec Shopify – commandes, produits, fulfillment, retours et système de file d\'attente.',
      it: 'Sincronizzazione in tempo reale basata su webhook di Spy con Shopify – ordini, prodotti, fulfillment, resi e sistema di code.',
      es: 'Sincronización en tiempo real basada en webhooks de Spy con Shopify – pedidos, productos, fulfillment, devoluciones y sistema de colas.',
      sv: 'Spy\'s webhook-baserade realtidssynkronisering med Shopify – ordrar, produkter, fulfillment, returer och kösystem.',
      no: 'Spy\'s webhook-baserte sanntidssynkronisering med Shopify – ordrer, produkter, fulfillment, returer og køsystem.',
    },
  },
  'dedication': {
    slug: 'dedication',
    category: 'Feature',
    icon: '🎯',
    imageUrl: null,
    badge: 'Interaktiv guide',
    badgeColor: '#c9a227',
    sortOrder: 5,
    content: null,
    contentType: 'react',
    titles: {
      da: 'Dedication / Reservering',
      en: 'Dedication / Reservation',
      de: 'Dedication / Reservierung',
      nl: 'Dedication / Reservering',
      fr: 'Dedication / Réservation',
      it: 'Dedication / Prenotazione',
      es: 'Dedication / Reserva',
      sv: 'Dedication / Reservation',
      no: 'Dedication / Reservering',
    },
    descriptions: {
      da: 'Guide til Pre-Dedication funktionaliteten – fordeling af varer mellem Stock og Pre ordrer.',
      en: 'Guide to Pre-Dedication functionality – allocation of goods between Stock and Pre orders.',
      de: 'Leitfaden zur Pre-Dedication-Funktionalität – Warenverteilung zwischen Stock- und Pre-Aufträgen.',
      nl: 'Gids voor Pre-Dedication functionaliteit – verdeling van goederen tussen Stock en Pre orders.',
      fr: 'Guide de la fonctionnalité Pre-Dedication – répartition des marchandises entre commandes Stock et Pre.',
      it: 'Guida alla funzionalità Pre-Dedication – distribuzione merci tra ordini Stock e Pre.',
      es: 'Guía de la funcionalidad Pre-Dedication – distribución de mercancías entre pedidos Stock y Pre.',
      sv: 'Guide till Pre-Dedication funktionalitet – fördelning av varor mellan Stock- och Pre-ordrar.',
      no: 'Guide til Pre-Dedication-funksjonalitet – fordeling av varer mellom Stock- og Pre-ordrer.',
    },
  },
  'triangular-trade': {
    slug: 'triangular-trade',
    category: 'Feature',
    icon: '🔺',
    imageUrl: null,
    badge: 'Interaktiv guide',
    badgeColor: '#e67e22',
    sortOrder: 6,
    content: null,
    contentType: 'react',
    titles: {
      da: 'Trekantshandel',
      en: 'Triangular Trade',
      nl: 'Driehoekshandel',
    },
    descriptions: {
      da: 'Interaktiv guide til trekantshandel – scenarier, momsbehandling og ERP-integration.',
      en: 'Interactive guide to triangular trade – scenarios, VAT treatment and ERP integration.',
      nl: 'Interactieve gids voor driehoekshandel – scenario\'s, btw-behandeling en ERP-integratie.',
    },
  },
}

// Slug to page route mapping
const SLUG_TO_ROUTE: Record<string, string> = {
  'ongoing-wms': 'ongoing',
  'sitoo-pos': 'sitoo',
  'nemedi': 'nemedi',
  'lector-customs': 'lector',
  'shopify-flow': 'shopify-flow',
  'dedication': 'dedication',
  'triangular-trade': 'triangular-trade',
}

const ROUTE_TO_SLUG: Record<string, string> = {
  'ongoing': 'ongoing-wms',
  'sitoo': 'sitoo-pos',
  'nemedi': 'nemedi',
  'lector': 'lector-customs',
  'shopify-flow': 'shopify-flow',
  'dedication': 'dedication',
  'triangular-trade': 'triangular-trade',
}

export function getRouteForSlug(slug: string): string {
  return SLUG_TO_ROUTE[slug] || slug
}

export function getSlugForRoute(route: string): string {
  return ROUTE_TO_SLUG[route] || route
}

/**
 * Fetch all articles for a given language. 
 * Tries Supabase first, falls back to hardcoded data.
 */
export async function getArticles(lang: Locale): Promise<ArticleData[]> {
  try {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('kb_articles')
      .select(`
        id, slug, category, icon, image_url, badge, badge_color, sort_order,
        kb_translations!inner(title, description, content, status)
      `)
      .eq('is_published', true)
      .eq('kb_translations.language_code', lang)
      .order('sort_order')

    if (error) throw error
    if (!data || data.length === 0) throw new Error('No articles found')

    return data.map((article: any) => {
      const translation = Array.isArray(article.kb_translations)
        ? article.kb_translations[0]
        : article.kb_translations
      const fallback = FALLBACK_ARTICLES[article.slug]
      const contentType = fallback?.contentType || 'html'

      return {
        slug: article.slug,
        category: article.category,
        icon: article.icon || fallback?.icon || '📄',
        imageUrl: article.image_url || fallback?.imageUrl || null,
        badge: article.badge || fallback?.badge || '',
        badgeColor: article.badge_color || fallback?.badgeColor || '#c9a227',
        sortOrder: article.sort_order,
        title: translation?.title || fallback?.titles[lang] || fallback?.titles.da || article.slug,
        description: translation?.description || fallback?.descriptions[lang] || fallback?.descriptions.da || '',
        // For iframe/react content types, use null (content field contains translation keys JSON, not HTML)
        content: contentType === 'iframe' || contentType === 'react' ? null : (translation?.content || null),
        contentType,
        iframeSrc: fallback?.iframeSrc,
      }
    })
  } catch {
    // Fallback to hardcoded data
    return getFallbackArticles(lang)
  }
}

/**
 * Fetch a single article by slug for a given language.
 */
export async function getArticle(slug: string, lang: Locale): Promise<ArticleData | null> {
  try {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('kb_articles')
      .select(`
        id, slug, category, icon, image_url, badge, badge_color, sort_order,
        kb_translations!inner(title, description, content, status)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .eq('kb_translations.language_code', lang)
      .single()

    if (error) throw error
    if (!data) throw new Error('Article not found')

    const translation = Array.isArray(data.kb_translations) 
      ? data.kb_translations[0] 
      : data.kb_translations
    const fallback = FALLBACK_ARTICLES[slug]

    const contentType = fallback?.contentType || 'html'

    return {
      slug: data.slug,
      category: data.category,
      icon: data.icon || fallback?.icon || '📄',
      imageUrl: data.image_url || fallback?.imageUrl || null,
      badge: data.badge || fallback?.badge || '',
      badgeColor: data.badge_color || fallback?.badgeColor || '#c9a227',
      sortOrder: data.sort_order,
      title: translation?.title || fallback?.titles[lang] || fallback?.titles.da || slug,
      description: translation?.description || fallback?.descriptions[lang] || fallback?.descriptions.da || '',
      // For iframe/react content types, use null (content field contains translation keys JSON, not HTML)
      content: contentType === 'iframe' || contentType === 'react' ? null : (translation?.content || null),
      contentType,
      iframeSrc: fallback?.iframeSrc,
    }
  } catch {
    // Fallback to hardcoded data
    return getFallbackArticle(slug, lang)
  }
}

/**
 * Get fallback article list from hardcoded data
 */
function getFallbackArticles(lang: Locale): ArticleData[] {
  return Object.values(FALLBACK_ARTICLES)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(article => ({
      slug: article.slug,
      category: article.category,
      icon: article.icon,
      imageUrl: article.imageUrl,
      badge: article.badge,
      badgeColor: article.badgeColor,
      sortOrder: article.sortOrder,
      content: article.content,
      contentType: article.contentType,
      iframeSrc: article.iframeSrc,
      title: article.titles[lang] || article.titles.da,
      description: article.descriptions[lang] || article.descriptions.da,
    }))
}

/**
 * Get a single fallback article
 */
function getFallbackArticle(slug: string, lang: Locale): ArticleData | null {
  const article = FALLBACK_ARTICLES[slug]
  if (!article) return null
  
  return {
    slug: article.slug,
    category: article.category,
    icon: article.icon,
    imageUrl: article.imageUrl,
    badge: article.badge,
    badgeColor: article.badgeColor,
    sortOrder: article.sortOrder,
    content: article.content,
    contentType: article.contentType,
    iframeSrc: article.iframeSrc,
    title: article.titles[lang] || article.titles.da,
    description: article.descriptions[lang] || article.descriptions.da,
  }
}
