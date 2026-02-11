export type VatRepLang = 'da' | 'en' | 'nl'

export interface VatRepStrings {
  // Section 1: What is VAT representation?
  s1Title: string; s1Intro: string
  s1Def1Title: string; s1Def1Desc: string
  s1Def2Title: string; s1Def2Desc: string
  s1Def3Title: string; s1Def3Desc: string

  // Section 2: Why use VAT representation?
  s2Title: string; s2Intro: string
  s2Benefit1Title: string; s2Benefit1Desc: string
  s2Benefit2Title: string; s2Benefit2Desc: string
  s2Benefit3Title: string; s2Benefit3Desc: string
  s2Benefit4Title: string; s2Benefit4Desc: string
  s2BrandBenefits: string; s2CustomerBenefits: string
  s2BrandList: string; s2CustomerList: string

  // Section 3: Customs & duty
  s3Title: string; s3Intro: string
  s3WithoutTitle: string; s3WithoutDesc: string
  s3WithTitle: string; s3WithDesc: string
  s3Flow1Label: string; s3Flow2Label: string; s3Flow3Label: string; s3Flow4Label: string
  s3DutyNote: string
  s3ShowDetails: string; s3HideDetails: string
  s3ImportVatExplain: string

  // Section 4: The journey – from idea to go-live
  s4Title: string; s4Intro: string
  s4Step1Title: string; s4Step1Desc: string
  s4Step2Title: string; s4Step2Desc: string
  s4Step3Title: string; s4Step3Desc: string
  s4Step4Title: string; s4Step4Desc: string
  s4Step5Title: string; s4Step5Desc: string
  s4Step6Title: string; s4Step6Desc: string
  s4Timeline: string

  // Section 5: Setup in SPY
  s5Title: string; s5Intro: string
  s5Step1Title: string; s5Step1Desc: string
  s5Step2Title: string; s5Step2Desc: string
  s5Step3Title: string; s5Step3Desc: string
  s5Step4Title: string; s5Step4Desc: string
  s5Step5Title: string; s5Step5Desc: string
  s5ProTip: string

  // Section 6: Daily workflow in SPY
  s6Title: string; s6Intro: string
  s6Flow1Title: string; s6Flow1Desc: string
  s6Flow2Title: string; s6Flow2Desc: string
  s6Flow3Title: string; s6Flow3Desc: string
  s6Flow4Title: string; s6Flow4Desc: string
  s6Flow5Title: string; s6Flow5Desc: string
  s6Tip: string

  // Section 7: Overview table – when to use
  s7Title: string
  s7Scenario: string; s7VatRep: string; s7Reason: string
  s7Row1: string; s7Row1Reason: string
  s7Row2: string; s7Row2Reason: string
  s7Row3: string; s7Row3Reason: string
  s7Row4: string; s7Row4Reason: string
  s7Row5: string; s7Row5Reason: string
  s7Row6: string; s7Row6Reason: string

  // Section 8: Common mistakes
  s8Title: string
  s8Mistake1Title: string; s8Mistake1Desc: string
  s8Mistake2Title: string; s8Mistake2Desc: string
  s8Mistake3Title: string; s8Mistake3Desc: string
  s8Mistake4Title: string; s8Mistake4Desc: string
}

const da: VatRepStrings = {
  s1Title: 'Hvad er momsrepræsentation?',
  s1Intro: 'Momsrepræsentation (VAT Representation) betyder, at en udenlandsk virksomhed udpeger en lokal fiskal repræsentant i et andet EU-land til at håndtere momsregistrering, -afregning og toldangivelser på virksomhedens vegne. For fashion/tekstilbrands er det typisk relevant ved salg og import til et nyt EU-marked.',
  s1Def1Title: 'Fiskal repræsentant',
  s1Def1Desc: 'En lokal virksomhed eller rådgiver der er momsregistreret i det pågældende land og optræder på brandets vegne over for skattemyndighederne.',
  s1Def2Title: 'Momsregistrering',
  s1Def2Desc: 'Brandet får et lokalt momsnummer (VAT-nummer) i importlandet via repræsentanten – uden at etablere en fysisk tilstedeværelse.',
  s1Def3Title: 'Importmoms',
  s1Def3Desc: 'Ved import fra lande uden for EU skal der betales importmoms. Med en fiskal repræsentant kan denne moms fratrækkes direkte, så den reelt bliver 0.',

  s2Title: 'Hvorfor bruge momsrepræsentation?',
  s2Intro: 'For fashion-brands der vil sælge til B2B-kunder i et nyt EU-land – eller importere varer via et specifikt land – giver momsrepræsentation en række fordele.',
  s2Benefit1Title: 'Hurtigere markedsadgang',
  s2Benefit1Desc: 'Sælg til nye EU-markeder uden at oprette et lokalt selskab. Registrering tager typisk 2-6 uger.',
  s2Benefit2Title: 'Lavere priser for kunder',
  s2Benefit2Desc: 'Kunderne slipper for at betale importmoms og told ved modtagelse – varerne er allerede fortoldet.',
  s2Benefit3Title: 'Professionelt setup',
  s2Benefit3Desc: 'Automatisk momsafregning, korrekte fakturaer og compliance med lokal lovgivning.',
  s2Benefit4Title: 'Cash flow fordel',
  s2Benefit4Desc: 'Importmoms fratrækkes direkte i momsopgørelsen – ingen udlæg der skal refunderes.',
  s2BrandBenefits: 'Fordele for brandet',
  s2CustomerBenefits: 'Fordele for brandets kunder',
  s2BrandList: '• Adgang til nye markeder uden lokalt selskab\n• Fradrag for importmoms\n• Korrekt EU-momsafregning\n• Professionelt image over for kunder',
  s2CustomerList: '• Ingen told/moms-overraskelser ved levering\n• DDP-levering (Delivered Duty Paid)\n• Normale lokale fakturaer med lokal moms\n• Hurtigere levering (ingen toldstop)',

  s3Title: 'Told & importmoms',
  s3Intro: 'Den største forskel mærkes ved import af varer fra lande uden for EU (f.eks. Tyrkiet, Kina, Bangladesh).',
  s3WithoutTitle: 'UDEN momsrepræsentant',
  s3WithoutDesc: 'Kunden betaler selv told + importmoms ved modtagelse (DAP). Det giver høje ekstraomkostninger og forsinkelser i tolden.',
  s3WithTitle: 'MED momsrepræsentant',
  s3WithDesc: 'Brandet fortolder varerne i importlandet via repræsentanten. Importmoms fratrækkes i momsopgørelsen. Kunden modtager varen told- og momsfrit (DDP).',
  s3Flow1Label: 'Leverandør (3. land)',
  s3Flow2Label: 'Toldklarering',
  s3Flow3Label: 'Lager / VAT rep.',
  s3Flow4Label: 'Kunde (EU)',
  s3DutyNote: 'Told (duty) skal altid betales – den kan ikke fratrækkes. Men importmoms kan fratrækkes via repræsentanten.',
  s3ShowDetails: 'Vis toldberegning',
  s3HideDetails: 'Skjul toldberegning',
  s3ImportVatExplain: 'Eksempel: Vare til €10.000. Told 12% = €1.200. Importmoms 25% af (€10.000 + €1.200) = €2.800. Med VAT rep. fratrækkes de €2.800 direkte → netto momsomkostning = €0.',

  s4Title: 'Rejsen – fra idé til daglig drift',
  s4Intro: 'Her er den typiske rejse for et fashion-brand der vil sætte momsrepræsentation op i et nyt EU-land.',
  s4Step1Title: '1. Beslutning & analyse',
  s4Step1Desc: 'Vurder om der er tilstrækkeligt salgsvolumen i mållandet. Typisk relevant fra >€50.000/år i omsætning.',
  s4Step2Title: '2. Vælg fiskal repræsentant',
  s4Step2Desc: 'Find en pålidelig lokal partner (revisor/speditor). De skal kunne håndtere momsregistrering, kvartalsindberetning og toldklarering.',
  s4Step3Title: '3. Momsregistrering',
  s4Step3Desc: 'Repræsentanten ansøger om lokalt momsnummer. Kræver typisk: Vedtægter, CVR-bevis, fuldmagt. Tager 2-6 uger.',
  s4Step4Title: '4. Opsætning i SPY',
  s4Step4Desc: 'Opret nyt lager/dispatch-lokation, konfigurer momsgrupper og leveringsbetingelser i SPY. Se næste sektion for detaljer.',
  s4Step5Title: '5. Test & validering',
  s4Step5Desc: 'Kør testordrer, verificér fakturering, told-dokumenter og momsbehandling. Tjek at alt matcher med repræsentantens forventninger.',
  s4Step6Title: '6. Go-live & daglig drift',
  s4Step6Desc: 'Start med at sende rigtige ordrer. Overvåg de første 2-3 momsperioder tæt sammen med repræsentanten.',
  s4Timeline: 'Typisk tidslinje: 4-10 uger fra beslutning til go-live',

  s5Title: 'Opsætning i SPY',
  s5Intro: 'Følgende trin skal udføres i SPY for at understøtte momsrepræsentation i et nyt land.',
  s5Step1Title: 'Opret leveringsadresse / lager',
  s5Step1Desc: 'Under Administration → Lagre, opret en ny lokation for importlandet. Sæt land og adresse til repræsentantens/lagerets adresse. Denne bruges som "ship-from" for ordrer i det pågældende land.',
  s5Step2Title: 'Konfigurér momsgrupper',
  s5Step2Desc: 'Under Administration → Moms/VAT, opret momsgrupper for det nye land. Sæt den korrekte lokale momssats (f.eks. 21% NL, 19% DE). For B2B-salg inden for landet: lokal moms. For EU-eksport: 0% med reverse charge.',
  s5Step3Title: 'Leveringsbetingelser (Incoterms)',
  s5Step3Desc: 'Sæt standardleveringsbetingelse til DDP (Delivered Duty Paid) for kunder i importlandet. Dette sikrer at brandet betaler told og moms – ikke kunden.',
  s5Step4Title: 'Kundeopsætning',
  s5Step4Desc: 'For kunder i det nye land: Tildel den korrekte momsgruppe og leveringsbetingelse. Sørg for at kundens EU VAT-nummer er registreret (til B2B reverse charge ved videresalg til andre EU-lande).',
  s5Step5Title: 'ERP-integration / bogføring',
  s5Step5Desc: 'Konfigurér bogføringskontiene så salg via repræsentanten bogføres korrekt. Typisk en separat indtægtskonto og momskonto per land.',
  s5ProTip: '💡 Pro tip: Opret en "varemærke-kunde" (dummy) for testordrer, så du kan validere hele flowet inden go-live.',

  s6Title: 'Daglig drift i SPY',
  s6Intro: 'Når momsrepræsentation er sat op, ser den daglige drift i SPY typisk sådan ud:',
  s6Flow1Title: 'Ordre modtages',
  s6Flow1Desc: 'Kunde i importlandet placerer ordre. SPY anvender automatisk den korrekte momsgruppe og leveringsbetingelse baseret på kundens land.',
  s6Flow2Title: 'Fakturering',
  s6Flow2Desc: 'Faktura oprettes med lokal moms og brandets lokale momsnummer (via repræsentanten). Fakturaen sendes fra brandets navn men med den lokale momsregistrering.',
  s6Flow3Title: 'Forsendelse & toldklarering',
  s6Flow3Desc: 'Varer sendes fra lager. Hvis import fra 3. land: Toldklarering håndteres af repræsentanten/speditøren. Toldpapirer arkiveres.',
  s6Flow4Title: 'Momsindberetning',
  s6Flow4Desc: 'Repræsentanten indberetter moms kvartalsvist (eller månedligt). SPY\'s salgsrapporter bruges som grundlag. Importmoms modregnes automatisk.',
  s6Flow5Title: 'Afstemning',
  s6Flow5Desc: 'Månedlig afstemning mellem SPY-rapporter og repræsentantens momsopgørelse. Brug SPY\'s Moms/VAT-rapport til at trække relevante tal.',
  s6Tip: '🔔 Husk: Send momsrapport til repræsentanten inden deadline (typisk 25. i måneden efter kvartalets afslutning).',

  s7Title: 'Hvornår er VAT-repræsentation relevant?',
  s7Scenario: 'Scenarie', s7VatRep: 'VAT rep.?', s7Reason: 'Begrundelse',
  s7Row1: 'B2B-salg til nyt EU-land (høj volumen)', s7Row1Reason: 'Giver lavere priser for kunder og professionelt setup.',
  s7Row2: 'Import fra 3. land til EU-lager', s7Row2Reason: 'Nødvendigt for at fratrække importmoms og fortolde korrekt.',
  s7Row3: 'B2C e-commerce (under OSS-grænse)', s7Row3Reason: 'OSS (One Stop Shop) er nemmere for B2C under €10.000.',
  s7Row4: 'B2C e-commerce (over OSS-grænse)', s7Row4Reason: 'Kan være relevant, men OSS-registrering er ofte tilstrækkeligt.',
  s7Row5: 'Lejlighedsvis salg til ét EU-land', s7Row5Reason: 'Omkostningen ved repræsentant overstiger typisk gevinsten.',
  s7Row6: 'Lager i EU-land (3PL)', s7Row6Reason: 'Kræver momsregistrering – repræsentant er standard løsningen.',

  s8Title: 'Typiske fejl at undgå',
  s8Mistake1Title: 'Glemmer at opdatere momsnummer',
  s8Mistake1Desc: 'Alle fakturaer skal vise det lokale momsnummer – ikke kun det danske. Tjek fakturaskabelonen i SPY.',
  s8Mistake2Title: 'Forkert Incoterms',
  s8Mistake2Desc: 'Bruger DAP i stedet for DDP. Kunden får en toldregning og bliver utilfreds.',
  s8Mistake3Title: 'Manglende toldarkivering',
  s8Mistake3Desc: 'Toldpapirer skal gemmes i min. 5 år. Opret en fast rutine for arkivering.',
  s8Mistake4Title: 'For sen momsindberetning',
  s8Mistake4Desc: 'Mangler at sende salgsdata til repræsentanten til tiden. Sæt en fast kalenderreminder.',
}

const en: VatRepStrings = {
  s1Title: 'What is VAT Representation?',
  s1Intro: 'VAT Representation means that a foreign company appoints a local fiscal representative in another EU country to handle VAT registration, reporting and customs declarations on the company\'s behalf. For fashion/textile brands, this is typically relevant when selling and importing to a new EU market.',
  s1Def1Title: 'Fiscal representative',
  s1Def1Desc: 'A local company or advisor who is VAT-registered in the relevant country and acts on behalf of the brand towards tax authorities.',
  s1Def2Title: 'VAT registration',
  s1Def2Desc: 'The brand receives a local VAT number in the import country through the representative – without establishing a physical presence.',
  s1Def3Title: 'Import VAT',
  s1Def3Desc: 'When importing from non-EU countries, import VAT must be paid. With a fiscal representative, this VAT can be deducted directly, effectively making it €0.',

  s2Title: 'Why use VAT representation?',
  s2Intro: 'For fashion brands wanting to sell to B2B customers in a new EU country – or import goods via a specific country – VAT representation offers several advantages.',
  s2Benefit1Title: 'Faster market access',
  s2Benefit1Desc: 'Sell to new EU markets without setting up a local entity. Registration typically takes 2-6 weeks.',
  s2Benefit2Title: 'Lower prices for customers',
  s2Benefit2Desc: 'Customers avoid paying import VAT and duties upon receipt – goods are already customs cleared.',
  s2Benefit3Title: 'Professional setup',
  s2Benefit3Desc: 'Automatic VAT reporting, correct invoices and compliance with local legislation.',
  s2Benefit4Title: 'Cash flow advantage',
  s2Benefit4Desc: 'Import VAT is deducted directly in the VAT return – no advance payments to be refunded.',
  s2BrandBenefits: 'Benefits for the brand',
  s2CustomerBenefits: 'Benefits for the brand\'s customers',
  s2BrandList: '• Access to new markets without a local entity\n• Deduction of import VAT\n• Correct EU VAT reporting\n• Professional image towards customers',
  s2CustomerList: '• No customs/VAT surprises upon delivery\n• DDP delivery (Delivered Duty Paid)\n• Normal local invoices with local VAT\n• Faster delivery (no customs delays)',

  s3Title: 'Customs & import VAT',
  s3Intro: 'The biggest difference is felt when importing goods from non-EU countries (e.g. Turkey, China, Bangladesh).',
  s3WithoutTitle: 'WITHOUT VAT representative',
  s3WithoutDesc: 'The customer pays customs duties + import VAT upon receipt (DAP). This creates high extra costs and customs delays.',
  s3WithTitle: 'WITH VAT representative',
  s3WithDesc: 'The brand clears goods in the import country via the representative. Import VAT is deducted in the VAT return. The customer receives goods duty- and VAT-free (DDP).',
  s3Flow1Label: 'Supplier (3rd country)',
  s3Flow2Label: 'Customs clearance',
  s3Flow3Label: 'Warehouse / VAT rep.',
  s3Flow4Label: 'Customer (EU)',
  s3DutyNote: 'Customs duty must always be paid – it cannot be deducted. But import VAT can be deducted via the representative.',
  s3ShowDetails: 'Show duty calculation',
  s3HideDetails: 'Hide duty calculation',
  s3ImportVatExplain: 'Example: Goods worth €10,000. Duty 12% = €1,200. Import VAT 25% of (€10,000 + €1,200) = €2,800. With VAT rep. the €2,800 is deducted directly → net VAT cost = €0.',

  s4Title: 'The journey – from idea to go-live',
  s4Intro: 'Here is the typical journey for a fashion brand setting up VAT representation in a new EU country.',
  s4Step1Title: '1. Decision & analysis',
  s4Step1Desc: 'Assess whether there is sufficient sales volume in the target country. Typically relevant from >€50,000/year in revenue.',
  s4Step2Title: '2. Choose fiscal representative',
  s4Step2Desc: 'Find a reliable local partner (accountant/freight forwarder). They should handle VAT registration, quarterly reporting and customs clearance.',
  s4Step3Title: '3. VAT registration',
  s4Step3Desc: 'The representative applies for a local VAT number. Typically requires: Articles of association, company registration, power of attorney. Takes 2-6 weeks.',
  s4Step4Title: '4. Setup in SPY',
  s4Step4Desc: 'Create new warehouse/dispatch location, configure VAT groups and delivery terms in SPY. See next section for details.',
  s4Step5Title: '5. Test & validation',
  s4Step5Desc: 'Run test orders, verify invoicing, customs documents and VAT treatment. Check everything matches the representative\'s expectations.',
  s4Step6Title: '6. Go-live & daily operations',
  s4Step6Desc: 'Start sending real orders. Monitor the first 2-3 VAT periods closely with the representative.',
  s4Timeline: 'Typical timeline: 4-10 weeks from decision to go-live',

  s5Title: 'Setup in SPY',
  s5Intro: 'The following steps should be completed in SPY to support VAT representation in a new country.',
  s5Step1Title: 'Create delivery address / warehouse',
  s5Step1Desc: 'Under Administration → Warehouses, create a new location for the import country. Set country and address to the representative\'s/warehouse address. This is used as "ship-from" for orders in that country.',
  s5Step2Title: 'Configure VAT groups',
  s5Step2Desc: 'Under Administration → VAT, create VAT groups for the new country. Set the correct local VAT rate (e.g. 21% NL, 19% DE). For domestic B2B sales: local VAT. For EU export: 0% with reverse charge.',
  s5Step3Title: 'Delivery terms (Incoterms)',
  s5Step3Desc: 'Set default delivery term to DDP (Delivered Duty Paid) for customers in the import country. This ensures the brand pays duties and VAT – not the customer.',
  s5Step4Title: 'Customer setup',
  s5Step4Desc: 'For customers in the new country: Assign the correct VAT group and delivery terms. Ensure the customer\'s EU VAT number is registered (for B2B reverse charge on resale to other EU countries).',
  s5Step5Title: 'ERP integration / accounting',
  s5Step5Desc: 'Configure chart of accounts so sales via the representative are booked correctly. Typically a separate revenue account and VAT account per country.',
  s5ProTip: '💡 Pro tip: Create a "brand customer" (dummy) for test orders, so you can validate the entire flow before go-live.',

  s6Title: 'Daily workflow in SPY',
  s6Intro: 'Once VAT representation is set up, the daily workflow in SPY typically looks like this:',
  s6Flow1Title: 'Order received',
  s6Flow1Desc: 'Customer in the import country places an order. SPY automatically applies the correct VAT group and delivery terms based on the customer\'s country.',
  s6Flow2Title: 'Invoicing',
  s6Flow2Desc: 'Invoice is created with local VAT and the brand\'s local VAT number (via the representative). The invoice is sent from the brand\'s name but with the local VAT registration.',
  s6Flow3Title: 'Shipping & customs clearance',
  s6Flow3Desc: 'Goods are shipped from warehouse. If importing from a 3rd country: Customs clearance is handled by the representative/forwarder. Customs documents are archived.',
  s6Flow4Title: 'VAT reporting',
  s6Flow4Desc: 'The representative reports VAT quarterly (or monthly). SPY\'s sales reports are used as the basis. Import VAT is offset automatically.',
  s6Flow5Title: 'Reconciliation',
  s6Flow5Desc: 'Monthly reconciliation between SPY reports and the representative\'s VAT return. Use SPY\'s VAT report to extract relevant figures.',
  s6Tip: '🔔 Remember: Send VAT report to the representative before the deadline (typically the 25th of the month following the quarter end).',

  s7Title: 'When is VAT representation relevant?',
  s7Scenario: 'Scenario', s7VatRep: 'VAT rep.?', s7Reason: 'Reason',
  s7Row1: 'B2B sales to new EU country (high volume)', s7Row1Reason: 'Provides lower prices for customers and professional setup.',
  s7Row2: 'Import from 3rd country to EU warehouse', s7Row2Reason: 'Necessary to deduct import VAT and clear customs correctly.',
  s7Row3: 'B2C e-commerce (under OSS threshold)', s7Row3Reason: 'OSS (One Stop Shop) is easier for B2C under €10,000.',
  s7Row4: 'B2C e-commerce (over OSS threshold)', s7Row4Reason: 'Can be relevant, but OSS registration is often sufficient.',
  s7Row5: 'Occasional sales to one EU country', s7Row5Reason: 'The cost of a representative typically exceeds the benefit.',
  s7Row6: 'Warehouse in EU country (3PL)', s7Row6Reason: 'Requires VAT registration – a representative is the standard solution.',

  s8Title: 'Common mistakes to avoid',
  s8Mistake1Title: 'Forgetting to update VAT number',
  s8Mistake1Desc: 'All invoices must show the local VAT number – not just the home country one. Check the invoice template in SPY.',
  s8Mistake2Title: 'Wrong Incoterms',
  s8Mistake2Desc: 'Using DAP instead of DDP. The customer receives a customs bill and is dissatisfied.',
  s8Mistake3Title: 'Missing customs archiving',
  s8Mistake3Desc: 'Customs documents must be stored for at least 5 years. Establish a fixed archiving routine.',
  s8Mistake4Title: 'Late VAT reporting',
  s8Mistake4Desc: 'Failing to send sales data to the representative on time. Set a fixed calendar reminder.',
}

const nl: VatRepStrings = {
  s1Title: 'Wat is btw-vertegenwoordiging?',
  s1Intro: 'Btw-vertegenwoordiging (VAT Representation) betekent dat een buitenlands bedrijf een lokale fiscaal vertegenwoordiger aanstelt in een ander EU-land om btw-registratie, -aangifte en douaneformaliteiten namens het bedrijf af te handelen. Voor fashion/textielbedrijven is dit meestal relevant bij verkoop en import naar een nieuwe EU-markt.',
  s1Def1Title: 'Fiscaal vertegenwoordiger',
  s1Def1Desc: 'Een lokaal bedrijf of adviseur die btw-geregistreerd is in het betreffende land en namens het merk optreedt bij de belastingdienst.',
  s1Def2Title: 'Btw-registratie',
  s1Def2Desc: 'Het merk krijgt een lokaal btw-nummer in het importland via de vertegenwoordiger – zonder fysieke aanwezigheid.',
  s1Def3Title: 'Invoer-btw',
  s1Def3Desc: 'Bij import van buiten de EU moet invoer-btw worden betaald. Met een fiscaal vertegenwoordiger kan deze btw direct worden afgetrokken, waardoor het effectief €0 is.',

  s2Title: 'Waarom btw-vertegenwoordiging gebruiken?',
  s2Intro: 'Voor fashion-merken die aan B2B-klanten in een nieuw EU-land willen verkopen – of goederen via een specifiek land willen importeren – biedt btw-vertegenwoordiging diverse voordelen.',
  s2Benefit1Title: 'Snellere markttoegang',
  s2Benefit1Desc: 'Verkoop op nieuwe EU-markten zonder een lokale entiteit op te richten. Registratie duurt doorgaans 2-6 weken.',
  s2Benefit2Title: 'Lagere prijzen voor klanten',
  s2Benefit2Desc: 'Klanten hoeven geen invoer-btw en douanerechten te betalen bij ontvangst – de goederen zijn al inklaard.',
  s2Benefit3Title: 'Professionele opzet',
  s2Benefit3Desc: 'Automatische btw-aangifte, correcte facturen en naleving van lokale wetgeving.',
  s2Benefit4Title: 'Cashflow-voordeel',
  s2Benefit4Desc: 'Invoer-btw wordt direct afgetrokken in de btw-aangifte – geen voorschotten die teruggevorderd moeten worden.',
  s2BrandBenefits: 'Voordelen voor het merk',
  s2CustomerBenefits: 'Voordelen voor de klanten van het merk',
  s2BrandList: '• Toegang tot nieuwe markten zonder lokale entiteit\n• Aftrek van invoer-btw\n• Correcte EU-btw-aangifte\n• Professioneel imago richting klanten',
  s2CustomerList: '• Geen douane/btw-verrassingen bij levering\n• DDP-levering (Delivered Duty Paid)\n• Normale lokale facturen met lokale btw\n• Snellere levering (geen douanevertraging)',

  s3Title: 'Douane & invoer-btw',
  s3Intro: 'Het grootste verschil is merkbaar bij import van goederen van buiten de EU (bijv. Turkije, China, Bangladesh).',
  s3WithoutTitle: 'ZONDER btw-vertegenwoordiger',
  s3WithoutDesc: 'De klant betaalt zelf douanerechten + invoer-btw bij ontvangst (DAP). Dit zorgt voor hoge extra kosten en vertragingen bij de douane.',
  s3WithTitle: 'MET btw-vertegenwoordiger',
  s3WithDesc: 'Het merk klaart de goederen in het importland via de vertegenwoordiger. Invoer-btw wordt afgetrokken in de btw-aangifte. De klant ontvangt de goederen zonder douanerechten en btw (DDP).',
  s3Flow1Label: 'Leverancier (3e land)',
  s3Flow2Label: 'Douaneafhandeling',
  s3Flow3Label: 'Magazijn / btw-vert.',
  s3Flow4Label: 'Klant (EU)',
  s3DutyNote: 'Douanerechten moeten altijd betaald worden – die kunnen niet afgetrokken worden. Maar invoer-btw kan wel afgetrokken worden via de vertegenwoordiger.',
  s3ShowDetails: 'Toon berekening',
  s3HideDetails: 'Verberg berekening',
  s3ImportVatExplain: 'Voorbeeld: Goederen ter waarde van €10.000. Douanerechten 12% = €1.200. Invoer-btw 25% van (€10.000 + €1.200) = €2.800. Met btw-vert. worden de €2.800 direct afgetrokken → netto btw-kosten = €0.',

  s4Title: 'De reis – van idee tot dagelijks gebruik',
  s4Intro: 'Dit is de typische reis voor een fashion-merk dat btw-vertegenwoordiging wil opzetten in een nieuw EU-land.',
  s4Step1Title: '1. Beslissing & analyse',
  s4Step1Desc: 'Beoordeel of er voldoende verkoopvolume is in het doelland. Doorgaans relevant vanaf >€50.000/jaar aan omzet.',
  s4Step2Title: '2. Kies fiscaal vertegenwoordiger',
  s4Step2Desc: 'Vind een betrouwbare lokale partner (accountant/expediteur). Ze moeten btw-registratie, kwartaalaangifte en douaneafhandeling kunnen verzorgen.',
  s4Step3Title: '3. Btw-registratie',
  s4Step3Desc: 'De vertegenwoordiger vraagt een lokaal btw-nummer aan. Vereist doorgaans: statuten, KvK-uittreksel, volmacht. Duurt 2-6 weken.',
  s4Step4Title: '4. Instelling in SPY',
  s4Step4Desc: 'Maak een nieuw magazijn/verzendlocatie aan, configureer btw-groepen en leveringsvoorwaarden in SPY. Zie volgende sectie voor details.',
  s4Step5Title: '5. Test & validatie',
  s4Step5Desc: 'Voer testbestellingen uit, controleer facturering, douanedocumenten en btw-behandeling. Controleer of alles overeenkomt met de verwachtingen van de vertegenwoordiger.',
  s4Step6Title: '6. Go-live & dagelijks gebruik',
  s4Step6Desc: 'Begin met het verzenden van echte bestellingen. Monitor de eerste 2-3 btw-periodes nauwkeurig samen met de vertegenwoordiger.',
  s4Timeline: 'Typische tijdlijn: 4-10 weken van beslissing tot go-live',

  s5Title: 'Instelling in SPY',
  s5Intro: 'De volgende stappen moeten in SPY worden uitgevoerd om btw-vertegenwoordiging in een nieuw land te ondersteunen.',
  s5Step1Title: 'Maak afleveradres / magazijn aan',
  s5Step1Desc: 'Onder Administratie → Magazijnen, maak een nieuwe locatie aan voor het importland. Stel land en adres in op het adres van de vertegenwoordiger/het magazijn. Dit wordt gebruikt als "ship-from" voor bestellingen in dat land.',
  s5Step2Title: 'Configureer btw-groepen',
  s5Step2Desc: 'Onder Administratie → Btw, maak btw-groepen aan voor het nieuwe land. Stel het juiste lokale btw-tarief in (bijv. 21% NL, 19% DE). Voor binnenlandse B2B-verkoop: lokale btw. Voor EU-export: 0% met verlegd.',
  s5Step3Title: 'Leveringsvoorwaarden (Incoterms)',
  s5Step3Desc: 'Stel standaard leveringsvoorwaarde in op DDP (Delivered Duty Paid) voor klanten in het importland. Dit zorgt ervoor dat het merk de rechten en btw betaalt – niet de klant.',
  s5Step4Title: 'Klantinstellingen',
  s5Step4Desc: 'Voor klanten in het nieuwe land: Wijs de juiste btw-groep en leveringsvoorwaarden toe. Zorg dat het EU-btw-nummer van de klant is geregistreerd (voor B2B verlegging bij doorverkoop naar andere EU-landen).',
  s5Step5Title: 'ERP-integratie / boekhouding',
  s5Step5Desc: 'Configureer het rekeningschema zodat verkoop via de vertegenwoordiger correct wordt geboekt. Doorgaans een apart omzetrekening en btw-rekening per land.',
  s5ProTip: '💡 Pro tip: Maak een "merk-klant" (dummy) aan voor testbestellingen, zodat u de hele flow kunt valideren vóór go-live.',

  s6Title: 'Dagelijkse workflow in SPY',
  s6Intro: 'Zodra btw-vertegenwoordiging is ingesteld, ziet de dagelijkse workflow in SPY er doorgaans als volgt uit:',
  s6Flow1Title: 'Bestelling ontvangen',
  s6Flow1Desc: 'Klant in het importland plaatst een bestelling. SPY past automatisch de juiste btw-groep en leveringsvoorwaarden toe op basis van het land van de klant.',
  s6Flow2Title: 'Facturering',
  s6Flow2Desc: 'Factuur wordt aangemaakt met lokale btw en het lokale btw-nummer van het merk (via de vertegenwoordiger). De factuur wordt verzonden op naam van het merk maar met de lokale btw-registratie.',
  s6Flow3Title: 'Verzending & douaneafhandeling',
  s6Flow3Desc: 'Goederen worden verzonden vanuit het magazijn. Bij import van een 3e land: douaneafhandeling door de vertegenwoordiger/expediteur. Douanedocumenten worden gearchiveerd.',
  s6Flow4Title: 'Btw-aangifte',
  s6Flow4Desc: 'De vertegenwoordiger doet per kwartaal (of maandelijks) btw-aangifte. De verkooprapporten van SPY worden als basis gebruikt. Invoer-btw wordt automatisch verrekend.',
  s6Flow5Title: 'Afstemming',
  s6Flow5Desc: 'Maandelijkse afstemming tussen SPY-rapporten en de btw-aangifte van de vertegenwoordiger. Gebruik het btw-rapport van SPY om relevante cijfers te extraheren.',
  s6Tip: '🔔 Onthoud: Stuur het btw-rapport naar de vertegenwoordiger vóór de deadline (doorgaans de 25e van de maand na het kwartaaleinde).',

  s7Title: 'Wanneer is btw-vertegenwoordiging relevant?',
  s7Scenario: 'Scenario', s7VatRep: 'Btw-vert.?', s7Reason: 'Reden',
  s7Row1: 'B2B-verkoop aan nieuw EU-land (hoog volume)', s7Row1Reason: 'Biedt lagere prijzen voor klanten en professionele opzet.',
  s7Row2: 'Import van 3e land naar EU-magazijn', s7Row2Reason: 'Noodzakelijk om invoer-btw af te trekken en correct in te klaren.',
  s7Row3: 'B2C e-commerce (onder OSS-drempel)', s7Row3Reason: 'OSS (One Stop Shop) is eenvoudiger voor B2C onder €10.000.',
  s7Row4: 'B2C e-commerce (boven OSS-drempel)', s7Row4Reason: 'Kan relevant zijn, maar OSS-registratie is vaak voldoende.',
  s7Row5: 'Incidentele verkoop aan één EU-land', s7Row5Reason: 'De kosten van een vertegenwoordiger overtreffen doorgaans het voordeel.',
  s7Row6: 'Magazijn in EU-land (3PL)', s7Row6Reason: 'Vereist btw-registratie – een vertegenwoordiger is de standaardoplossing.',

  s8Title: 'Veelgemaakte fouten om te vermijden',
  s8Mistake1Title: 'Btw-nummer vergeten bij te werken',
  s8Mistake1Desc: 'Alle facturen moeten het lokale btw-nummer tonen – niet alleen het thuisland. Controleer de factuursjabloon in SPY.',
  s8Mistake2Title: 'Verkeerde Incoterms',
  s8Mistake2Desc: 'DAP gebruiken in plaats van DDP. De klant ontvangt een douanerekening en is ontevreden.',
  s8Mistake3Title: 'Ontbrekende douanearchivering',
  s8Mistake3Desc: 'Douanedocumenten moeten minimaal 5 jaar bewaard worden. Stel een vaste archiveringsroutine in.',
  s8Mistake4Title: 'Te late btw-aangifte',
  s8Mistake4Desc: 'Verkoopdata niet op tijd naar de vertegenwoordiger sturen. Stel een vaste kalenderherinnering in.',
}

const allT: Record<string, VatRepStrings> = { da, en, nl }

export function getVatRepT(lang: string): VatRepStrings {
  return allT[lang] || da
}
