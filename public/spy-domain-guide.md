# SPY Domæneguide
## Forretningsbegreber og dataflows

*Sidst opdateret: 2. februar 2026*

---

## 1. Produkthierarkiet

SPY er bygget op omkring et hierarki af produktbegreber:

### Style
En style er grundproduktet – f.eks. "Model Copenhagen Jakke". Den har ét style-nummer, én basispris, og hører til ét brand.

### StyleColor (Farvevariant)
Hver style kan findes i flere farver. "Copenhagen Jakke" i sort, blå og rød = 3 StyleColors. Farver kan være aktive eller inaktive.

### StyleVariant (Størrelse/EAN)
Hver farvevariant findes i flere størrelser. "Copenhagen Jakke, sort, str. M" = 1 StyleVariant. Hver variant har sin egen stregkode (EAN).

**Eksempel:** 
Style "Copenhagen Jakke" → 3 farver → 5 størrelser per farve = 15 varianter, hver med sin egen stregkode.

### StyleAssortment (Sortiment)
En foruddefineret kombination af størrelser og antal – bruges til at sælge i faste pakker. F.eks. "S:2, M:4, L:4, XL:2" = et sortiment på 12 stk.

---

## 2. Salg og ordrer

### Salgsordre (SOrder / Sales Order)
Når en kunde bestiller varer, oprettes en salgsordre. En ordre har:
- **Kunde** – hvem bestiller
- **Brand** – hvilket mærke
- **Season** – hvilken sæson
- **Sælger** – hvem har solgt
- **Land** – hvilket marked

### Ordrestatus
En ordre gennemgår disse stadier:
1. **Temp** – Kladde, ikke bekræftet endnu
2. **Proposal** – Tilbud sendt til kunde
3. **Order** – Bekræftet ordre
4. **Consignment** – Konsignationsvarer (hos kunden, men ikke betalt endnu)
5. **Adjustment** – Reguleringer/justeringer

### Ordrelinjer (SO_Style)
Hver ordrelinje knytter en style til ordren med pris, antal, rabat osv. En ordrelinje har en **claims_type** der angiver om det er:
- **None** – Normalt salg
- **Credit** – Kreditnota (reklamation)
- **Replace** – Erstatning (reklamation)
- **Reduction** – Prisreduktion
- **Return** – Returnering med kreditnota
- **Staff Discount** – Medarbejderrabat

### Salgskanal (Channel)
Ordrer kan komme fra forskellige kanaler – f.eks. direkte salg, B2B-portal, Shopify webshop, EDI osv.

---

## 3. Levering og pakning

### Packing (Pakning)
Når varer skal sendes til kunden, oprettes en **pakning**. Dette er det fysiske stadie – varerne pakkes og gøres klar til forsendelse.

### PackingMaster
Selve forsendelsen/følgesedlen. Indeholder:
- Pakkedato (packed_date) – hvornår er det pakket
- Kunde, brand, sælger
- Valutakurs på pakketidspunktet
- Om den er annulleret

### PackingDetails
De enkelte linjer på en pakning – hvilke varianter, i hvilke antal. Knyttet til ordrelinjerne.

### ⚠️ Vigtig forskel: Solgt vs. Leveret
- **Solgt** = En bekræftet ordrelinje eksisterer (status = "order")
- **Leveret** = Ordren er pakket og sendt (der findes en pakning med pakkedato)

En ordre kan være solgt i januar, men først leveret i marts. Det er kerneforskellen mellem mange rapporter i systemet.

---

## 4. Reklamationer (Claims)

### Hvad er en Claim?
Når en kunde har problemer med leverede varer, oprettes en reklamation (claim). En claim er knyttet til en original pakningsforsendelse.

### Claim-typer
| Type | Betydning | Hvad sker der? |
|------|-----------|----------------|
| Claim / Credit Note | Varer returneres, kunde får kreditnota | Varer kommer retur, penge tilbage |
| Claim / Replace | Varer er defekte, nye sendes | Nye varer pakkes og sendes |
| Claim / Price Reduction | Varer beholdes, men med prisreduktion | Kreditnota for differencebeløb |
| Return / Credit Note | Generel returnering | Varer returneres, kreditnota udstedes |

### Claim-flow
1. Reklamation oprettes (med reference til original levering)
2. Årsag angives (ClaimCause – f.eks. defekt, forkert vare, osv.)
3. Reklamation bekræftes
4. Afhængig af type: kreditnota, ny forsendelse, eller prisreduktion

---

## 5. Indkøb (Purchase Orders)

### Indkøbsordre (POrder / Purchase Order)
Når SPY bestiller varer hos en leverandør, oprettes en indkøbsordre.

### PO-flowet
1. **Running** – Ordren er afgivet til leverandør, men varer er ikke afsendt endnu
2. **Shipped** – Varer er afsendt fra leverandør
3. **Received** – Varer er modtaget på lager

### Nøgletal for indkøb
- **PO Running Qty** – Antal bestilt men ikke afsendt
- **PO Shipped Qty** – Antal afsendt fra leverandør
- **PO Received Qty** – Antal modtaget på lager

---

## 6. Lager (Stock)

### Lagerstatus
Hver farvevariant (StyleColor) har en lagerstatus der viser:
- **Stock** – Antal på lager lige nu
- **Corrections** – Lagerkorrektioner (optællinger, svind, justeringer)
- **Available** – Disponibelt antal (lager minus reservationer)

### Lagerlokationer
Varer kan befinde sig på forskellige lokationer – normalt lager, konsignationslager, dedikeret lager til specifikke kunder.

---

## 7. Sæsoner og brands

### Season (Sæson)
Modebranchen arbejder i sæsoner – f.eks. SS26 (Spring/Summer 2026), AW26 (Autumn/Winter 2026). Styles, ordrer og leveringer er knyttet til sæsoner.

### SeasonGroup (Sæsongruppe)
En gruppering af sæsoner – f.eks. alle forårssæsoner. Bruges til at filtrere og rapportere på tværs af relaterede sæsoner.

### Brand
Hvert produkt tilhører et brand. En SPY-installation kan håndtere flere brands. Brugere kan have adgang til specifikke brands.

### SubBrand
En underinddeling af et brand – f.eks. en premium-linje eller en sportslinje under samme brand.

---

## 8. Kunder

### Customer (Kunde)
Butikker, webshops eller distributører der køber varer. Hver kunde har:
- Kundegruppe (CustomerGroup)
- Land
- Sælger tilknyttet
- Betalingsbetingelser
- EDI-type (hvis digital ordreudveksling)

### CustomerGroup (Kundegruppe)
Gruppering af kunder – f.eks. "Premium butikker", "Outlets", "Online" – bruges til rapportering og prisstrukturer.

---

## 9. Valuta og priser

### Exchange (Valuta)
SPY håndterer flere valutaer. Hver valuta har:
- **Valutanavn** (DKK, EUR, USD osv.)
- **Kurs** (rate) – omregningskurs
- **Basisvaluta** – den primære valuta i systemet

### Pristyper på en style
| Forkortelse | Betydning | Forklaring |
|-------------|-----------|------------|
| **WSP** | Wholesale Price | Engros-salgspris (prisen til butikkerne) |
| **RRP** | Recommended Retail Price | Vejledende udsalgspris (butikkens pris til forbrugeren) |
| **Calc** | Calculated Price | Beregnet pris |
| **Raw Cost** | Indkøbspris | Prisen fra leverandøren (offerprice) |
| **Invoiced Cost** | Faktureret kostpris | Faktisk faktureret pris inkl. evt. justeringer |
| **Landed Cost** | Landed kostpris | Total kostpris inkl. fragt, told, mm. |
| **WSP DG** | Wholesale Price Dækningsgrad | Dækningsgrad i procent |

Priser gemmes per style per valuta, så en style kan have WSP 300 DKK og WSP 40 EUR.

### Valutakurser på ordrer og pakninger
Når en ordre eller pakning oprettes, låses valutakursen på det tidspunkt. Det sikrer at beløbet ikke ændrer sig selvom kursen svinger.

---

## 10. EDI-integrationer

### Hvad er EDI?
EDI (Electronic Data Interchange) er elektronisk udveksling af ordrer, fakturaer og leveringsadviser mellem SPY og eksterne systemer.

### Shopify
Integration med Shopify webshops. Ordrer importeres automatisk fra Shopify, og lagerstatus synkroniseres. Produktdata og billeder kan eksporteres til Shopify.

### NemEDI / B24
Integration med danske og skandinaviske handelskæder. Håndterer PRICAT (produktkataloger), ordrer og DESADV (leveringsadviser).

---

## 11. Statistik-sider

### Style Statistics
Viser nøgletal per style (eller per farvevariant):
- **Sold (iSOQty)** – Antal solgt baseret på **bekræftede ordrer**. Inkluderer BÅDE leverede og ikke-leverede ordrer. Returneringer er trukket fra.
- **Delivered (iSODeliveredQty)** – Antal faktisk leveret til kunder
- **Claims** – Antal reklamerede styk
- **Returns** – Antal returnerede styk
- **Stock** – Aktuel lagerbeholdning
- **PO Running/Shipped/Received** – Indkøbsstatus

Style Statistics giver det fulde billede af en styles livscyklus – fra indkøb over salg til lager.

**Datofilter:** Når du angiver et datointerval, filtrerer det på ordredatoen (default). Styles uden aktivitet i perioden skjules.

### Claims Statistics
Viser reklamationsstatistik – grupperet per kunde, sælger, brand, leverandør, reklamationstype eller reklamationsårsag.
- **Sold** – Antal styk der er **pakket og fysisk leveret** i den valgte periode. Kun rene salg tælles (ikke reklamationer eller returneringer).
- **Claimed** – Antal styk der er reklameret
- **Percent** – Reklamationsprocent (claimed / sold × 100)
- **Amount** – Reklamationsbeløb i din valuta

**Datofilter:** Filtrerer på **pakkedatoen** – altså hvornår varerne fysisk er pakket og sendt.

### ⚠️ Vigtig forskel: Sold i Style Statistics vs. Claims Statistics

| | Style Statistics | Claims Statistics |
|---|---|---|
| **Hvad tælles som "Sold"** | Bekræftede ordrer (inkl. ikke-leverede) | Kun fysisk pakkede/leverede varer |
| **Returneringer** | Trækkes fra sold-tallet | Tælles ikke med i sold |
| **Datofilter** | Ordredato (default) | Pakkedato |
| **Typisk scenarie** | Viser det fulde salgsbillede | Viser kun det faktisk leverede |

**Eksempel:** En kunde bestiller 100 stk i januar. 80 stk pakkes og leveres i januar, 20 stk leveres i februar.
- Style Statistics (jan): Sold = 100 (hele ordren)
- Claims Statistics (jan): Sold = 80 (kun det pakkede)
- Claims Statistics (feb): Sold = 20 (resten)

---

## 12. Kodeområder → Forretningsfunktioner

| Kodeområde | Forretningsfunktion |
|---|---|
| **class/Sales/** | Salgsordrer, ordrelinjer, fakturering, bekræftelse |
| **class/Packing/** | Pakning, forsendelse, leveringsadviser, kreditpakninger |
| **class/EDI/** | Shopify-integration, NemEDI, B24, elektronisk ordreudveksling |
| **class/Style/** | Produkter – styles, farver, varianter, stregkoder, priser |
| **class/Purchase/** | Indkøbsordrer, leverandørstyring, modtagelse |
| **class/Stock/** | Lagerstyring, lagerlokationer, transaktioner |
| **class/Finance/** | Fakturering, kreditnotaer, ledger, betalinger, told |
| **class/Form/** | PDF-generering – ordrebekræftelser, følgesedler, fakturaer |
| **class/KeyData/** | Nøgletal og rapporteringsmotor (KeyReport) |
| **class/entities/** | Grundentiteter – claims, sæsoner, custom fields |
| **class/Customer/** | Kundedata, kundegrupper |
| **applications/Spy/** | Hovedapplikationen – alle sider brugerne ser |
| **applications/B2B/** | B2B-portalen – kunders selvbetjening |
| **applications/Frontend/** | React-baseret frontend (nyere UI) |
| **applications/Handscanner/** | Håndscanner til lager og pakning |
| **modules/confident/** | Ældre rapporter og statistik (claims statistics mm.) |
| **tools/script/** | Baggrundsscripts og cron-jobs |

---

## 13. Nøglebegreber: Quick Reference

| Begreb | Betydning |
|--------|-----------|
| **Sold** | Solgt – men kan betyde forskellige ting afhængig af kontekst (se statistik-sektionen) |
| **Delivered** | Fysisk leveret til kunden (pakket og sendt) |
| **Packed** | Pakket og klar til forsendelse (= leveret i SPY-kontekst) |
| **Running** | Bestilt hos leverandør, men ikke afsendt endnu |
| **Shipped** | Afsendt fra leverandør, men ikke modtaget på lager endnu |
| **Received** | Modtaget på SPY's lager |
| **Available** | Disponibelt på lager (kan sælges/sendes) |
| **Consignment** | Varer hos kunden, men ikke betalt/endelig solgt endnu |
| **BasedOn: Ordered** | Beregning baseret på ordredato |
| **BasedOn: Delivered** | Beregning baseret på leveringsdato (pakkedato) |
| **BasedOn: Invoiced** | Beregning baseret på fakturadato |

---

*Dette dokument er genereret ud fra kildekoden og bør verificeres af en domæneekspert. Rettelser og tilføjelser er velkomne.*
