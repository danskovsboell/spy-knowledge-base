// UI Translations for SPY Knowledge Base
// All user-facing strings in 3 languages

import { Locale } from './i18n'

export interface UIStrings {
  // General
  knowledgeBase: string
  loading: string
  
  // Login
  loginTitle: string
  loginSubtitle: string
  loginPlaceholder: string
  loginButton: string
  loginError: string
  loginFooter: string
  
  // Home page
  welcomeTitle: string
  welcomeDescription: string
  integrationWorkflows: string
  functionGuides: string
  sectionIntegrations: string
  sectionFunctions: string
  
  // Sidebar
  navOverview: string
  navHome: string
  navIntegrations: string
  navFunctions: string
  
  // Breadcrumb
  breadcrumbOverview: string
  
  // Guide cards
  interactiveWorkflow: string
  interactiveGuide: string
  categoryIntegration: string
  categoryFunction: string
  
  // Articles
  ongoingTitle: string
  ongoingDesc: string
  ongoingPageDesc: string
  sitooTitle: string
  sitooDesc: string
  sitooPageDesc: string
  nemediTitle: string
  nemediDesc: string
  nemediPageDesc: string
  lectorTitle: string
  lectorDesc: string
  lectorPageDesc: string
  dedicationTitle: string
  dedicationDesc: string
  dedicationPageDesc: string
  triangularTradeTitle: string
  triangularTradeDesc: string
  triangularTradePageDesc: string
  shopifyFlowTitle: string
  shopifyFlowDesc: string
  shopifyFlowPageDesc: string
  
  // Language switcher
  selectLanguage: string
}

const translations: Record<Locale, UIStrings> = {
  da: {
    knowledgeBase: 'Knowledge Base',
    loading: 'Indlæser...',
    loginTitle: 'SPY Knowledge Base',
    loginSubtitle: 'Indtast adgangskode for at fortsætte',
    loginPlaceholder: 'Adgangskode',
    loginButton: 'Log ind →',
    loginError: 'Forkert adgangskode. Prøv igen.',
    loginFooter: 'Kun for SPY-medarbejdere',
    welcomeTitle: 'Velkommen til SPY Knowledge Base',
    welcomeDescription: 'Dit samlede sted for workflows, integrationsguides og dokumentation. Her finder du alt hvad du skal bruge for at forstå SPY\'s systemer og processer.',
    integrationWorkflows: 'Integration Workflows',
    functionGuides: 'Funktionsguides',
    sectionIntegrations: 'Integrationer',
    sectionFunctions: 'Funktioner',
    navOverview: '🏠 Oversigt',
    navHome: 'Startside',
    navIntegrations: '🔌 Integrationer',
    navFunctions: '⚙️ Funktioner',
    breadcrumbOverview: 'Oversigt',
    interactiveWorkflow: 'Interaktiv workflow',
    interactiveGuide: 'Interaktiv guide',
    categoryIntegration: 'Integration / Development',
    categoryFunction: 'Funktioner / Support',
    ongoingTitle: 'Ongoing WMS',
    ongoingDesc: 'Komplet workflow for Ongoing WMS integration – ordrer, webhooks, statuser og fejlhåndtering.',
    ongoingPageDesc: 'Komplet workflow for Ongoing WMS integration – ordrer, webhooks, statuser og fejlhåndtering',
    sitooTitle: 'Sitoo POS',
    sitooDesc: 'Workflow for Sitoo POS integration – butikssalg, lagersynkronisering og produktdata.',
    sitooPageDesc: 'Workflow for Sitoo POS integration – butikssalg, lagersynkronisering og produktdata',
    nemediTitle: 'NemEDI',
    nemediDesc: 'EDI dokumentflow for NemEDI integration – PRICAT, ordrer og leveringsadviser.',
    nemediPageDesc: 'EDI dokumentflow for NemEDI integration – PRICAT, ordrer og leveringsadviser',
    lectorTitle: 'Lector Customs',
    lectorDesc: 'Told/customs workflow for Lector integration – toldbehandling, HS-koder og dokumentation.',
    lectorPageDesc: 'Told/customs workflow for Lector integration – toldbehandling, HS-koder og dokumentation',
    dedicationTitle: 'Dedication / Reservering',
    dedicationDesc: 'Guide til Pre-Dedication funktionaliteten – fordeling af varer mellem Stock og Pre ordrer.',
    dedicationPageDesc: 'Guide til Pre-Dedication funktionaliteten – fordeling af varer mellem Stock og Pre ordrer',
    triangularTradeTitle: 'Trekantshandel',
    triangularTradeDesc: 'Interaktiv guide til trekantshandel – scenarier, momsbehandling og ERP-integration.',
    triangularTradePageDesc: 'Interaktiv guide til trekantshandel – scenarier, momsbehandling og ERP-integration',
    shopifyFlowTitle: 'Shopify Flow',
    shopifyFlowDesc: 'Automatisering af Shopify-hændelser med SPY ERP – ordrer, lager, kunder og produktdata via Shopify Flow.',
    shopifyFlowPageDesc: 'Automatisering af Shopify-hændelser med SPY ERP via Shopify Flow workflows',
    selectLanguage: 'Vælg sprog',
  },
  en: {
    knowledgeBase: 'Knowledge Base',
    loading: 'Loading...',
    loginTitle: 'SPY Knowledge Base',
    loginSubtitle: 'Enter password to continue',
    loginPlaceholder: 'Password',
    loginButton: 'Log in →',
    loginError: 'Incorrect password. Please try again.',
    loginFooter: 'For SPY employees only',
    welcomeTitle: 'Welcome to SPY Knowledge Base',
    welcomeDescription: 'Your central hub for workflows, integration guides and documentation. Find everything you need to understand SPY\'s systems and processes.',
    integrationWorkflows: 'Integration Workflows',
    functionGuides: 'Function Guides',
    sectionIntegrations: 'Integrations',
    sectionFunctions: 'Functions',
    navOverview: '🏠 Overview',
    navHome: 'Home',
    navIntegrations: '🔌 Integrations',
    navFunctions: '⚙️ Functions',
    breadcrumbOverview: 'Overview',
    interactiveWorkflow: 'Interactive workflow',
    interactiveGuide: 'Interactive guide',
    categoryIntegration: 'Integration / Development',
    categoryFunction: 'Functions / Support',
    ongoingTitle: 'Ongoing WMS',
    ongoingDesc: 'Complete workflow for Ongoing WMS integration – orders, webhooks, statuses and error handling.',
    ongoingPageDesc: 'Complete workflow for Ongoing WMS integration – orders, webhooks, statuses and error handling',
    sitooTitle: 'Sitoo POS',
    sitooDesc: 'Workflow for Sitoo POS integration – retail sales, inventory sync and product data.',
    sitooPageDesc: 'Workflow for Sitoo POS integration – retail sales, inventory sync and product data',
    nemediTitle: 'NemEDI',
    nemediDesc: 'EDI document flow for NemEDI integration – PRICAT, orders and delivery notices.',
    nemediPageDesc: 'EDI document flow for NemEDI integration – PRICAT, orders and delivery notices',
    lectorTitle: 'Lector Customs',
    lectorDesc: 'Customs workflow for Lector integration – customs processing, HS codes and documentation.',
    lectorPageDesc: 'Customs workflow for Lector integration – customs processing, HS codes and documentation',
    dedicationTitle: 'Dedication / Reservation',
    dedicationDesc: 'Guide to Pre-Dedication functionality – allocation of goods between Stock and Pre orders.',
    dedicationPageDesc: 'Guide to Pre-Dedication functionality – allocation of goods between Stock and Pre orders',
    triangularTradeTitle: 'Triangular Trade',
    triangularTradeDesc: 'Interactive guide to triangular trade – scenarios, VAT treatment and ERP integration.',
    triangularTradePageDesc: 'Interactive guide to triangular trade – scenarios, VAT treatment and ERP integration',
    shopifyFlowTitle: 'Shopify Flow',
    shopifyFlowDesc: 'Automating Shopify events with SPY ERP – orders, inventory, customers and product data via Shopify Flow.',
    shopifyFlowPageDesc: 'Automating Shopify events with SPY ERP via Shopify Flow workflows',
    selectLanguage: 'Select language',
  },
  nl: {
    knowledgeBase: 'Kennisbank',
    loading: 'Laden...',
    loginTitle: 'SPY Kennisbank',
    loginSubtitle: 'Voer wachtwoord in om door te gaan',
    loginPlaceholder: 'Wachtwoord',
    loginButton: 'Inloggen →',
    loginError: 'Onjuist wachtwoord. Probeer het opnieuw.',
    loginFooter: 'Alleen voor SPY-medewerkers',
    welcomeTitle: 'Welkom bij de SPY Kennisbank',
    welcomeDescription: 'Uw centrale plek voor workflows, integratiegidsen en documentatie. Vind alles wat u nodig heeft om de systemen en processen van SPY te begrijpen.',
    integrationWorkflows: 'Integratie Workflows',
    functionGuides: 'Functiegidsen',
    sectionIntegrations: 'Integraties',
    sectionFunctions: 'Functies',
    navOverview: '🏠 Overzicht',
    navHome: 'Startpagina',
    navIntegrations: '🔌 Integraties',
    navFunctions: '⚙️ Functies',
    breadcrumbOverview: 'Overzicht',
    interactiveWorkflow: 'Interactieve workflow',
    interactiveGuide: 'Interactieve gids',
    categoryIntegration: 'Integratie / Ontwikkeling',
    categoryFunction: 'Functies / Ondersteuning',
    ongoingTitle: 'Ongoing WMS',
    ongoingDesc: 'Complete workflow voor Ongoing WMS-integratie – orders, webhooks, statussen en foutafhandeling.',
    ongoingPageDesc: 'Complete workflow voor Ongoing WMS-integratie – orders, webhooks, statussen en foutafhandeling',
    sitooTitle: 'Sitoo POS',
    sitooDesc: 'Workflow voor Sitoo POS-integratie – winkelverkoop, voorraadsynchronisatie en productgegevens.',
    sitooPageDesc: 'Workflow voor Sitoo POS-integratie – winkelverkoop, voorraadsynchronisatie en productgegevens',
    nemediTitle: 'NemEDI',
    nemediDesc: 'EDI-documentenstroom voor NemEDI-integratie – PRICAT, bestellingen en leveringsberichten.',
    nemediPageDesc: 'EDI-documentenstroom voor NemEDI-integratie – PRICAT, bestellingen en leveringsberichten',
    lectorTitle: 'Lector Customs',
    lectorDesc: 'Douane-workflow voor Lector-integratie – douaneverwerking, HS-codes en documentatie.',
    lectorPageDesc: 'Douane-workflow voor Lector-integratie – douaneverwerking, HS-codes en documentatie',
    dedicationTitle: 'Dedication / Reservering',
    dedicationDesc: 'Gids voor Pre-Dedication functionaliteit – verdeling van goederen tussen Stock en Pre orders.',
    dedicationPageDesc: 'Gids voor Pre-Dedication functionaliteit – verdeling van goederen tussen Stock en Pre orders',
    triangularTradeTitle: 'Driehoekshandel',
    triangularTradeDesc: 'Interactieve gids voor driehoekshandel – scenario\'s, btw-behandeling en ERP-integratie.',
    triangularTradePageDesc: 'Interactieve gids voor driehoekshandel – scenario\'s, btw-behandeling en ERP-integratie',
    shopifyFlowTitle: 'Shopify Flow',
    shopifyFlowDesc: 'Automatisering van Shopify-events met SPY ERP – bestellingen, voorraad, klanten en productgegevens via Shopify Flow.',
    shopifyFlowPageDesc: 'Automatisering van Shopify-events met SPY ERP via Shopify Flow workflows',
    selectLanguage: 'Taal selecteren',
  },
}

export function getTranslations(locale: Locale): UIStrings {
  return translations[locale] || translations.da
}

export function t(locale: Locale, key: keyof UIStrings): string {
  const strings = getTranslations(locale)
  return strings[key] || translations.da[key] || key
}
