export type ReturnsLang = 'da' | 'en' | 'nl'

export interface ReturnsStrings {
  pageTitle: string
  pageDesc: string

  // Section 1: Overview
  s1Title: string
  s1Intro: string
  s1KeyPoint: string

  // Section 2: Shopify Returns
  s2Title: string
  s2Intro: string
  s2Step1Title: string; s2Step1Desc: string
  s2Step2Title: string; s2Step2Desc: string
  s2Step3Title: string; s2Step3Desc: string
  s2Step4Title: string; s2Step4Desc: string
  s2Tip: string
  s2PortalNote: string

  // Section 3: External Warehouse Returns (Ongoing)
  s3Title: string
  s3Intro: string
  s3Step1Title: string; s3Step1Desc: string
  s3Step2Title: string; s3Step2Desc: string
  s3Step3Title: string; s3Step3Desc: string
  s3Step4Title: string; s3Step4Desc: string
  s3B2cNote: string

  // Section 4: NemEDI / SystemTransport Returns
  s4Title: string
  s4Intro: string
  s4Step1Title: string; s4Step1Desc: string
  s4Step2Title: string; s4Step2Desc: string
  s4Step3Title: string; s4Step3Desc: string
  s4NemediNote: string

  // Section 5: Claims (reklamationer)
  s5Title: string
  s5Intro: string
  s5Step1Title: string; s5Step1Desc: string
  s5Step2Title: string; s5Step2Desc: string
  s5Step3Title: string; s5Step3Desc: string
  s5AutoNote: string

  // Section 6: Return to Stock
  s6Title: string
  s6Intro: string
  s6Desc: string

  // Section 7: Supported return portals
  s7Title: string
  s7Intro: string
  s7List: string

  // Section 8: Overview table
  s8Title: string
  s8Channel: string; s8Type: string; s8How: string
  s8Row1Channel: string; s8Row1Type: string; s8Row1How: string
  s8Row2Channel: string; s8Row2Type: string; s8Row2How: string
  s8Row3Channel: string; s8Row3Type: string; s8Row3How: string
  s8Row4Channel: string; s8Row4Type: string; s8Row4How: string
  s8Row5Channel: string; s8Row5Type: string; s8Row5How: string
}

const da: ReturnsStrings = {
  pageTitle: 'Returneringer i SPY',
  pageDesc: 'Sådan håndterer SPY returneringer fra Shopify, eksterne lagre og NemEDI – og hvordan returportaler spiller sammen med systemet.',

  s1Title: 'Hvordan virker returneringer i SPY?',
  s1Intro: 'SPY håndterer returneringer fra flere kanaler – Shopify webshops, eksterne lagre (Ongoing, SystemTransport) og NemEDI. Det smarte er, at SPY ikke behøver at integrere direkte med hver enkelt returportal derude. I stedet får SPY besked via de systemer, der allerede er koblet på.',
  s1KeyPoint: '💡 Nøglepunkt: SPY taler med Shopify, Ongoing og NemEDI – og de taler med returportalerne. Så uanset hvilken returportal brandet bruger (ReturnGo, Reclaimit, Returnless osv.), kommer returdataene automatisk ind i SPY via den kanal der allerede er sat op.',

  s2Title: 'Shopify-returneringer (B2C)',
  s2Intro: 'Når en slutkunde returnerer en vare via en Shopify-webshop, henter SPY returneringen automatisk.',
  s2Step1Title: '1. Kunden starter en retur',
  s2Step1Desc: 'Kunden anmoder om retur via webshoppens returportal eller kontakter kundeservice. Returen oprettes i Shopify.',
  s2Step2Title: '2. SPY henter returen',
  s2Step2Desc: 'SPY henter returdata fra Shopify via GraphQL API\'en. Den ved hvad der er returneret, og om kunden skal have penge tilbage, et gavekort eller en ny vare.',
  s2Step3Title: '3. Varen modtages',
  s2Step3Desc: 'Enten scannes varen manuelt ind på eget lager, eller det eksterne lager melder varen modtaget automatisk.',
  s2Step4Title: '4. Refusion eller ombytning',
  s2Step4Desc: 'SPY håndterer pengene: refusion til kunden, gavekort, eller oprettelse af en ny ombytningsordre. Fragt-refusion kan også håndteres.',
  s2Tip: '🔔 Tip: Shopify-returer understøtter flere refusionstyper – penge tilbage, gavekort, fragt-refusion og ombytning til ny vare.',
  s2PortalNote: '🔌 Returportaler der fungerer via Shopify: ReturnGo, Returnless, Loop Returns, AfterShip Returns, Happy Returns, Return Prime og alle andre der integrerer med Shopify\'s Return API. SPY behøver ingen opsætning – det virker automatisk.',

  s3Title: 'Eksterne lagre – Ongoing WMS',
  s3Intro: 'Når brandet bruger et eksternt lager via Ongoing WMS, kan returneringer også håndteres derigennem.',
  s3Step1Title: '1. Returordre sendes til Ongoing',
  s3Step1Desc: 'SPY opretter en returordre og sender den til Ongoing. Lageret ved nu at der kommer en pakke retur.',
  s3Step2Title: '2. Lageret modtager varen',
  s3Step2Desc: 'Ongoing opdaterer status løbende: anmeldt → ankommet → behandlet. SPY poller for status og modtager også webhooks.',
  s3Step3Title: '3. Varen inspiceres',
  s3Step3Desc: 'Lageret tjekker varen og melder tilbage hvad der er modtaget – og om varen er i orden eller skal kasseres.',
  s3Step4Title: '4. SPY opdateres',
  s3Step4Desc: 'SPY matcher det modtagne med det forventede. Hvis alt stemmer, afsluttes returen automatisk. Ved afvigelser sendes en besked til support.',
  s3B2cNote: '🛒 B2C via Ongoing: Shopify-returer kan også gå via Ongoing som "Shop Return Purchase Orders". Så håndterer lageret den fysiske modtagelse, mens Shopify-returen i SPY opdateres automatisk.',

  s4Title: 'NemEDI og SystemTransport',
  s4Intro: 'For brands der bruger NemEDI til kommunikation med deres lager, fungerer returneringer via EDI-beskeder.',
  s4Step1Title: '1. Returordre sendes via NemEDI',
  s4Step1Desc: 'SPY opretter en claim (reklamation) og sender den til lageret som en EDI-ordre. Produktdata (PRICAT) og modtagelsesdata (RECADV) følger med, så lageret ved hvad de skal forvente.',
  s4Step2Title: '2. Lageret modtager og bekræfter',
  s4Step2Desc: 'Lageret sender en ReturnConfirmation (XML) tilbage med EAN-koder, antal modtaget og returårsag for hver vare.',
  s4Step3Title: '3. SPY behandler bekræftelsen',
  s4Step3Desc: 'SPY matcher det modtagne med det forventede og opretter claim-linjer. Varer kan enten returneres til lager eller kasseres.',
  s4NemediNote: '📋 SystemTransport bruger samme flow men via XML-filer i stedet for NemEDI-beskeder. Resultatet er det samme – lageret bekræfter hvad de har modtaget.',

  s5Title: 'Claims (reklamationer)',
  s5Intro: 'En claim i SPY er den overordnede ramme for en returnering. Uanset om returen kommer fra Shopify, Ongoing eller NemEDI, ender den som en claim.',
  s5Step1Title: 'Claim oprettes',
  s5Step1Desc: 'Enten automatisk (fra Shopify/Ongoing) eller manuelt af en supporter. Claimen indeholder kundeinfo, hvilke varer der returneres, og årsagen.',
  s5Step2Title: 'Varer modtages og tjekkes',
  s5Step2Desc: 'Når varerne fysisk er modtaget, matcher SPY det forventede antal med det modtagne.',
  s5Step3Title: 'Claim afsluttes',
  s5Step3Desc: 'Refusion, kreditnota eller ombytning gennemføres. Lagerstatus opdateres.',
  s5AutoNote: '⚡ Automatisk afstemning: SPY har en "ClaimConfirmer" der automatisk matcher forventet og modtaget antal. Simple afvigelser (f.eks. 1 vare mere end forventet) rettes automatisk. Ved større afvigelser sendes en fejl-email til support.',

  s6Title: 'Return to Stock',
  s6Intro: 'Konsignationskunder kan også returnere varer til lager.',
  s6Desc: 'Funktionen "Return to Stock" håndterer varer der kommer retur fra en konsignationskunde – altså varer der var udlånt/placeret hos kunden men ikke solgt. Varerne føres tilbage på lager og kan eventuelt eksporteres til eksternt lager.',

  s7Title: 'Hvilke returportaler virker med SPY?',
  s7Intro: 'Fordi SPY henter returdata via Shopify\'s API, virker alle returportaler der integrerer med Shopify automatisk med SPY. Det inkluderer blandt andet:',
  s7List: '• ReturnGo\n• Returnless\n• Loop Returns\n• AfterShip Returns\n• Happy Returns\n• Return Prime\n• Reclaimit (via Shopify)\n• Og alle andre der bruger Shopify\'s Return API\n\nDer kræves ingen ekstra opsætning i SPY – så længe returportalen er koblet til Shopify, får SPY besked automatisk.',

  s8Title: 'Overblik – hvornår bruger du hvad?',
  s8Channel: 'Kanal', s8Type: 'Type retur', s8How: 'Sådan virker det',
  s8Row1Channel: 'Shopify webshop', s8Row1Type: 'B2C kundeReturnering', s8Row1How: 'Automatisk via Shopify Return API. Virker med alle Shopify-returportaler.',
  s8Row2Channel: 'Ongoing WMS', s8Row2Type: 'B2B retur til eksternt lager', s8Row2How: 'SPY sender returordre → Ongoing modtager → status sendes tilbage.',
  s8Row3Channel: 'Ongoing + Shopify', s8Row3Type: 'B2C retur via eksternt lager', s8Row3How: 'Shop Return Purchase Order – lageret håndterer fysisk modtagelse.',
  s8Row4Channel: 'NemEDI / SystemTransport', s8Row4Type: 'EDI-baseret retur', s8Row4How: 'Claim sendes via EDI → lager bekræfter med ReturnConfirmation.',
  s8Row5Channel: 'Manuel', s8Row5Type: 'Konsignation / Return to Stock', s8Row5How: 'Varer returneres fra konsignationskunde til eget lager.',
}

const en: ReturnsStrings = {
  pageTitle: 'Returns in SPY',
  pageDesc: 'How SPY handles returns from Shopify, external warehouses and NemEDI – and how return portals work with the system.',

  s1Title: 'How do returns work in SPY?',
  s1Intro: 'SPY handles returns from multiple channels – Shopify webshops, external warehouses (Ongoing, SystemTransport) and NemEDI. The smart part is that SPY doesn\'t need to integrate directly with every return portal out there. Instead, SPY receives data through the systems already connected.',
  s1KeyPoint: '💡 Key point: SPY talks to Shopify, Ongoing and NemEDI – and they talk to the return portals. So regardless of which return portal the brand uses (ReturnGo, Reclaimit, Returnless etc.), the return data flows automatically into SPY through the channel already set up.',

  s2Title: 'Shopify returns (B2C)',
  s2Intro: 'When an end customer returns an item via a Shopify webshop, SPY fetches the return automatically.',
  s2Step1Title: '1. Customer initiates a return',
  s2Step1Desc: 'The customer requests a return via the webshop\'s return portal or contacts customer service. The return is created in Shopify.',
  s2Step2Title: '2. SPY fetches the return',
  s2Step2Desc: 'SPY fetches return data from Shopify via the GraphQL API. It knows what was returned and whether the customer should get a refund, gift card or replacement.',
  s2Step3Title: '3. Item is received',
  s2Step3Desc: 'Either the item is manually scanned at the brand\'s own warehouse, or the external warehouse reports it received automatically.',
  s2Step4Title: '4. Refund or exchange',
  s2Step4Desc: 'SPY handles the money: refund to customer, gift card, or creation of a new exchange order. Shipping refunds can also be handled.',
  s2Tip: '🔔 Tip: Shopify returns support multiple refund types – money back, gift cards, shipping refunds and exchange for a new item.',
  s2PortalNote: '🔌 Return portals that work via Shopify: ReturnGo, Returnless, Loop Returns, AfterShip Returns, Happy Returns, Return Prime and all others that integrate with Shopify\'s Return API. No setup needed in SPY – it works automatically.',

  s3Title: 'External warehouses – Ongoing WMS',
  s3Intro: 'When the brand uses an external warehouse via Ongoing WMS, returns can also be handled through there.',
  s3Step1Title: '1. Return order sent to Ongoing',
  s3Step1Desc: 'SPY creates a return order and sends it to Ongoing. The warehouse now knows a package is coming back.',
  s3Step2Title: '2. Warehouse receives the item',
  s3Step2Desc: 'Ongoing updates status continuously: notified → arrived → processed. SPY polls for status and also receives webhooks.',
  s3Step3Title: '3. Item is inspected',
  s3Step3Desc: 'The warehouse checks the item and reports back what was received – and whether it\'s in good condition or needs to be discarded.',
  s3Step4Title: '4. SPY is updated',
  s3Step4Desc: 'SPY matches received against expected. If everything matches, the return is completed automatically. If there are discrepancies, support is notified.',
  s3B2cNote: '🛒 B2C via Ongoing: Shopify returns can also go through Ongoing as "Shop Return Purchase Orders". The warehouse handles physical receipt while the Shopify return in SPY is updated automatically.',

  s4Title: 'NemEDI and SystemTransport',
  s4Intro: 'For brands using NemEDI to communicate with their warehouse, returns work via EDI messages.',
  s4Step1Title: '1. Return order sent via NemEDI',
  s4Step1Desc: 'SPY creates a claim and sends it to the warehouse as an EDI order. Product data (PRICAT) and receiving data (RECADV) are included so the warehouse knows what to expect.',
  s4Step2Title: '2. Warehouse receives and confirms',
  s4Step2Desc: 'The warehouse sends a ReturnConfirmation (XML) back with EAN codes, quantities received and return reason for each item.',
  s4Step3Title: '3. SPY processes the confirmation',
  s4Step3Desc: 'SPY matches received against expected and creates claim lines. Items can either be returned to stock or discarded.',
  s4NemediNote: '📋 SystemTransport uses the same flow but via XML files instead of NemEDI messages. The result is the same – the warehouse confirms what they received.',

  s5Title: 'Claims',
  s5Intro: 'A claim in SPY is the overarching framework for a return. Whether the return comes from Shopify, Ongoing or NemEDI, it ends up as a claim.',
  s5Step1Title: 'Claim is created',
  s5Step1Desc: 'Either automatically (from Shopify/Ongoing) or manually by a support agent. The claim contains customer info, which items are being returned, and the reason.',
  s5Step2Title: 'Items are received and checked',
  s5Step2Desc: 'When items are physically received, SPY matches expected quantities against actual received quantities.',
  s5Step3Title: 'Claim is completed',
  s5Step3Desc: 'Refund, credit note or exchange is processed. Stock levels are updated.',
  s5AutoNote: '⚡ Automatic reconciliation: SPY has a "ClaimConfirmer" that automatically matches expected and received quantities. Simple discrepancies (e.g. 1 extra item) are corrected automatically. For larger discrepancies, an error email is sent to support.',

  s6Title: 'Return to Stock',
  s6Intro: 'Consignment customers can also return items to stock.',
  s6Desc: 'The "Return to Stock" function handles items coming back from a consignment customer – items that were on loan/placed with the customer but not sold. Items are returned to stock and can optionally be exported to an external warehouse.',

  s7Title: 'Which return portals work with SPY?',
  s7Intro: 'Because SPY fetches return data via Shopify\'s API, all return portals that integrate with Shopify work automatically with SPY. This includes:',
  s7List: '• ReturnGo\n• Returnless\n• Loop Returns\n• AfterShip Returns\n• Happy Returns\n• Return Prime\n• Reclaimit (via Shopify)\n• And all others using Shopify\'s Return API\n\nNo extra setup is needed in SPY – as long as the return portal is connected to Shopify, SPY gets notified automatically.',

  s8Title: 'Overview – when to use what?',
  s8Channel: 'Channel', s8Type: 'Return type', s8How: 'How it works',
  s8Row1Channel: 'Shopify webshop', s8Row1Type: 'B2C customer return', s8Row1How: 'Automatic via Shopify Return API. Works with all Shopify return portals.',
  s8Row2Channel: 'Ongoing WMS', s8Row2Type: 'B2B return to external warehouse', s8Row2How: 'SPY sends return order → Ongoing receives → status sent back.',
  s8Row3Channel: 'Ongoing + Shopify', s8Row3Type: 'B2C return via external warehouse', s8Row3How: 'Shop Return Purchase Order – warehouse handles physical receipt.',
  s8Row4Channel: 'NemEDI / SystemTransport', s8Row4Type: 'EDI-based return', s8Row4How: 'Claim sent via EDI → warehouse confirms with ReturnConfirmation.',
  s8Row5Channel: 'Manual', s8Row5Type: 'Consignment / Return to Stock', s8Row5How: 'Items returned from consignment customer to own warehouse.',
}

const nl: ReturnsStrings = {
  pageTitle: 'Retouren in SPY',
  pageDesc: 'Hoe SPY retouren afhandelt via Shopify, externe magazijnen en NemEDI – en hoe retourportalen samenwerken met het systeem.',

  s1Title: 'Hoe werken retouren in SPY?',
  s1Intro: 'SPY handelt retouren af via meerdere kanalen – Shopify webshops, externe magazijnen (Ongoing, SystemTransport) en NemEDI. Het slimme is dat SPY niet rechtstreeks hoeft te integreren met elk retourportaal. In plaats daarvan ontvangt SPY de data via de systemen die al gekoppeld zijn.',
  s1KeyPoint: '💡 Kernpunt: SPY communiceert met Shopify, Ongoing en NemEDI – en zij communiceren met de retourportalen. Dus ongeacht welk retourportaal het merk gebruikt (ReturnGo, Reclaimit, Returnless enz.), stromen de retourgegevens automatisch SPY binnen via het kanaal dat al is ingesteld.',

  s2Title: 'Shopify-retouren (B2C)',
  s2Intro: 'Wanneer een eindklant een artikel retourneert via een Shopify-webshop, haalt SPY de retour automatisch op.',
  s2Step1Title: '1. Klant start een retour',
  s2Step1Desc: 'De klant vraagt een retour aan via het retourportaal van de webshop of neemt contact op met de klantenservice. De retour wordt aangemaakt in Shopify.',
  s2Step2Title: '2. SPY haalt de retour op',
  s2Step2Desc: 'SPY haalt retourdata op van Shopify via de GraphQL API. Het weet wat is geretourneerd en of de klant geld terug moet krijgen, een cadeaukaart of een vervanging.',
  s2Step3Title: '3. Artikel wordt ontvangen',
  s2Step3Desc: 'Het artikel wordt handmatig gescand in het eigen magazijn, of het externe magazijn meldt automatisch de ontvangst.',
  s2Step4Title: '4. Terugbetaling of omruiling',
  s2Step4Desc: 'SPY regelt het geld: terugbetaling aan klant, cadeaukaart, of aanmaken van een nieuwe omruilbestelling. Verzendkosten-terugbetaling kan ook worden afgehandeld.',
  s2Tip: '🔔 Tip: Shopify-retouren ondersteunen meerdere terugbetalingstypen – geld terug, cadeaukaarten, verzendkosten-terugbetaling en omruiling voor een nieuw artikel.',
  s2PortalNote: '🔌 Retourportalen die werken via Shopify: ReturnGo, Returnless, Loop Returns, AfterShip Returns, Happy Returns, Return Prime en alle anderen die integreren met Shopify\'s Return API. Geen instellingen nodig in SPY – het werkt automatisch.',

  s3Title: 'Externe magazijnen – Ongoing WMS',
  s3Intro: 'Wanneer het merk een extern magazijn gebruikt via Ongoing WMS, kunnen retouren ook via daar worden afgehandeld.',
  s3Step1Title: '1. Retourorder verzonden naar Ongoing',
  s3Step1Desc: 'SPY maakt een retourorder aan en stuurt deze naar Ongoing. Het magazijn weet nu dat er een pakket terugkomt.',
  s3Step2Title: '2. Magazijn ontvangt het artikel',
  s3Step2Desc: 'Ongoing werkt de status doorlopend bij: aangemeld → aangekomen → verwerkt. SPY pollt voor status en ontvangt ook webhooks.',
  s3Step3Title: '3. Artikel wordt geïnspecteerd',
  s3Step3Desc: 'Het magazijn controleert het artikel en rapporteert wat is ontvangen – en of het in goede staat is of moet worden afgevoerd.',
  s3Step4Title: '4. SPY wordt bijgewerkt',
  s3Step4Desc: 'SPY vergelijkt ontvangen met verwacht. Als alles klopt, wordt de retour automatisch afgesloten. Bij afwijkingen wordt support op de hoogte gesteld.',
  s3B2cNote: '🛒 B2C via Ongoing: Shopify-retouren kunnen ook via Ongoing als "Shop Return Purchase Orders" worden afgehandeld. Het magazijn handelt de fysieke ontvangst af, terwijl de Shopify-retour in SPY automatisch wordt bijgewerkt.',

  s4Title: 'NemEDI en SystemTransport',
  s4Intro: 'Voor merken die NemEDI gebruiken om met hun magazijn te communiceren, werken retouren via EDI-berichten.',
  s4Step1Title: '1. Retourorder verzonden via NemEDI',
  s4Step1Desc: 'SPY maakt een claim aan en stuurt deze als EDI-order naar het magazijn. Productdata (PRICAT) en ontvangstdata (RECADV) worden meegestuurd zodat het magazijn weet wat te verwachten.',
  s4Step2Title: '2. Magazijn ontvangt en bevestigt',
  s4Step2Desc: 'Het magazijn stuurt een ReturnConfirmation (XML) terug met EAN-codes, ontvangen aantallen en retourRedenen per artikel.',
  s4Step3Title: '3. SPY verwerkt de bevestiging',
  s4Step3Desc: 'SPY vergelijkt ontvangen met verwacht en maakt claimregels aan. Artikelen kunnen naar voorraad worden teruggebracht of worden afgevoerd.',
  s4NemediNote: '📋 SystemTransport gebruikt dezelfde flow maar via XML-bestanden in plaats van NemEDI-berichten. Het resultaat is hetzelfde – het magazijn bevestigt wat ze hebben ontvangen.',

  s5Title: 'Claims (reclamaties)',
  s5Intro: 'Een claim in SPY is het overkoepelende kader voor een retour. Of de retour nu van Shopify, Ongoing of NemEDI komt, het eindigt als een claim.',
  s5Step1Title: 'Claim wordt aangemaakt',
  s5Step1Desc: 'Automatisch (vanuit Shopify/Ongoing) of handmatig door een supportmedewerker. De claim bevat klantinfo, welke artikelen worden geretourneerd en de reden.',
  s5Step2Title: 'Artikelen worden ontvangen en gecontroleerd',
  s5Step2Desc: 'Wanneer artikelen fysiek zijn ontvangen, vergelijkt SPY de verwachte aantallen met de daadwerkelijk ontvangen aantallen.',
  s5Step3Title: 'Claim wordt afgesloten',
  s5Step3Desc: 'Terugbetaling, creditnota of omruiling wordt verwerkt. Voorraadniveaus worden bijgewerkt.',
  s5AutoNote: '⚡ Automatische afstemming: SPY heeft een "ClaimConfirmer" die automatisch verwachte en ontvangen aantallen vergelijkt. Eenvoudige afwijkingen (bijv. 1 extra artikel) worden automatisch gecorrigeerd. Bij grotere afwijkingen wordt een foutmail naar support gestuurd.',

  s6Title: 'Retour naar voorraad',
  s6Intro: 'Consignatieklanten kunnen ook artikelen retourneren naar voorraad.',
  s6Desc: 'De functie "Return to Stock" handelt artikelen af die terugkomen van een consignatieklant – artikelen die in bruikleen/geplaatst waren bij de klant maar niet verkocht. Artikelen worden teruggebracht naar voorraad en kunnen optioneel worden geëxporteerd naar een extern magazijn.',

  s7Title: 'Welke retourportalen werken met SPY?',
  s7Intro: 'Omdat SPY retourdata ophaalt via Shopify\'s API, werken alle retourportalen die met Shopify integreren automatisch met SPY. Dit omvat onder andere:',
  s7List: '• ReturnGo\n• Returnless\n• Loop Returns\n• AfterShip Returns\n• Happy Returns\n• Return Prime\n• Reclaimit (via Shopify)\n• En alle anderen die Shopify\'s Return API gebruiken\n\nGeen extra instellingen nodig in SPY – zolang het retourportaal gekoppeld is aan Shopify, krijgt SPY automatisch bericht.',

  s8Title: 'Overzicht – wanneer gebruik je wat?',
  s8Channel: 'Kanaal', s8Type: 'Type retour', s8How: 'Hoe het werkt',
  s8Row1Channel: 'Shopify webshop', s8Row1Type: 'B2C klantretour', s8Row1How: 'Automatisch via Shopify Return API. Werkt met alle Shopify-retourportalen.',
  s8Row2Channel: 'Ongoing WMS', s8Row2Type: 'B2B retour naar extern magazijn', s8Row2How: 'SPY stuurt retourorder → Ongoing ontvangt → status teruggestuurd.',
  s8Row3Channel: 'Ongoing + Shopify', s8Row3Type: 'B2C retour via extern magazijn', s8Row3How: 'Shop Return Purchase Order – magazijn handelt fysieke ontvangst af.',
  s8Row4Channel: 'NemEDI / SystemTransport', s8Row4Type: 'EDI-gebaseerde retour', s8Row4How: 'Claim via EDI → magazijn bevestigt met ReturnConfirmation.',
  s8Row5Channel: 'Handmatig', s8Row5Type: 'Consignatie / Retour naar voorraad', s8Row5How: 'Artikelen geretourneerd van consignatieklant naar eigen magazijn.',
}

const allT: Record<string, ReturnsStrings> = { da, en, nl }

export function getReturnsT(lang: string): ReturnsStrings {
  return allT[lang] || da
}
