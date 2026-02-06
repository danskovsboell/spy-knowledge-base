import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, 
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ImageRun, ShadingType, convertInchesToTwip
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper to create image
function createImage(imageName, width = 600) {
  const imagePath = path.join(__dirname, 'images', imageName);
  if (!fs.existsSync(imagePath)) {
    console.warn(`Image not found: ${imagePath}`);
    return null;
  }
  return new ImageRun({
    data: fs.readFileSync(imagePath),
    transformation: { width, height: Math.round(width * 0.6) },
    type: 'png',
  });
}

// Color constants
const SPY_BLUE = "1a365d";
const GRAY_600 = "4a5568";
const GREEN = "38a169";
const ORANGE = "dd6b20";

const doc = new Document({
  styles: {
    paragraphStyles: [
      {
        id: "Normal",
        name: "Normal",
        run: { font: "Calibri", size: 22 },
        paragraph: { spacing: { after: 200 } }
      }
    ]
  },
  sections: [{
    properties: {},
    children: [
      // Header
      new Paragraph({
        children: [new TextRun({ text: "SPY NEWS", bold: true, size: 24, color: SPY_BLUE })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Ny Returhåndtering i SPY", bold: true, size: 48, color: SPY_BLUE })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ 
          text: "Direkte integration mellem Shopify-returportaler og SPY – for nemmere og hurtigere håndtering af B2C-returneringer", 
          size: 24, color: GRAY_600 
        })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),

      // Alert Box
      new Paragraph({
        children: [new TextRun({ text: "⚠️ Vigtigt: Håndscanner-support kommer i uge 7", bold: true, size: 24, color: ORANGE })],
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ 
          text: "Vi arbejder på at få de almindelige Zebra-håndscannere til at understøtte scanning af retur. Indtil da virker scanning kun med en bordscanner, der er fysisk forbundet til pc'en (returstationen).", 
          size: 22 
        })],
        spacing: { after: 400 }
      }),

      // Quick Start
      new Paragraph({
        children: [new TextRun({ text: "🚀 Quick Start – Kom i gang på 3 minutter", bold: true, size: 28, color: SPY_BLUE })],
        spacing: { before: 200, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "1. Aktivér Integration: ", bold: true }),
          new TextRun({ text: "Admin → Settings → Shopify → Edit → Slå \"Handle Returns\" til" })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "2. Gå til Scan: ", bold: true }),
          new TextRun({ text: "Sales → Claims/Returns → Scan Shopify Returns" })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "3. Scan & Bekræft: ", bold: true }),
          new TextRun({ text: "Scan returlabel → Registrér varer → Confirm" })
        ],
        spacing: { after: 400 }
      }),

      // Hvad er nyt
      new Paragraph({
        children: [new TextRun({ text: "📦 Hvad er nyt?", bold: true, size: 32, color: SPY_BLUE })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ 
          text: "Vi har udvidet vores returhåndtering, så I nu både kan starte og scanne en retur direkte i SPY. Derudover er vores Shopify-integration blevet udvidet med returhåndtering fra returportaler, så disse passer ind i en ny arbejdsproces i SPY." 
        })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ 
          text: "Det betyder, at I nu har mulighed for nemmere returhåndtering i jeres forretning med de muligheder, en returportal kan give – såsom ombytninger, returlabels og hurtigere refunderinger." 
        })],
        spacing: { after: 400 }
      }),

      // Returportaler
      new Paragraph({
        children: [new TextRun({ text: "🤝 Returportaler & Apps", bold: true, size: 32, color: SPY_BLUE })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Enhver portal, der understøtter vores proces, kan bruges. Vi har testet og har kendskab til følgende:" })],
        spacing: { after: 200 }
      }),

      // Returnflows
      new Paragraph({
        children: [new TextRun({ text: "Returnflows", bold: true, size: 26, color: SPY_BLUE })],
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({ children: [new TextRun({ text: "returnflows.com", color: GRAY_600 })] }),
      new Paragraph({
        children: [new TextRun({ text: "🎁 Særtilbud til SPY-kunder:", bold: true, color: GREEN })],
        spacing: { before: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "• Intet opsætningsgebyr (normalt 2.500-10.000 kr.)" })],
        indent: { left: convertInchesToTwip(0.25) }
      }),
      new Paragraph({
        children: [new TextRun({ text: "• Ingen ekstra pris pr. marked (normalt 250 kr./md.)" })],
        indent: { left: convertInchesToTwip(0.25) }
      }),
      new Paragraph({
        children: [new TextRun({ text: "• 30 dages gratis prøveperiode" })],
        indent: { left: convertInchesToTwip(0.25) }
      }),
      new Paragraph({
        children: [new TextRun({ text: "📞 +45 27 13 40 53 | ✉️ jeppe@returnflows.com", size: 20, color: GRAY_600 })],
        spacing: { after: 200 }
      }),

      // Float
      new Paragraph({
        children: [new TextRun({ text: "Float", bold: true, size: 26, color: SPY_BLUE })],
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({ children: [new TextRun({ text: "floatreturns.com", color: GRAY_600 })] }),
      new Paragraph({
        children: [new TextRun({ text: "🎁 Særtilbud til SPY-kunder:", bold: true, color: GREEN })],
        spacing: { before: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "• Intet opstartsgebyr" })],
        indent: { left: convertInchesToTwip(0.25) }
      }),
      new Paragraph({
        children: [new TextRun({ text: "• Ingen ekstra gebyr for flere shops/markeder" })],
        indent: { left: convertInchesToTwip(0.25) }
      }),
      new Paragraph({
        children: [new TextRun({ text: "• 60 dages gratis prøveperiode" })],
        indent: { left: convertInchesToTwip(0.25) }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Kontakt Float for mere information", size: 20, color: GRAY_600 })],
        spacing: { after: 200 }
      }),

      // Info box
      new Paragraph({
        children: [new TextRun({ text: "💡 Bruger I en anden returportal?", bold: true })],
        spacing: { before: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Ønsker I at bruge en anden returportal end ovenstående? Ræk ud til os, så vi kan starte en dialog omkring jeres ønskede løsning." })],
        spacing: { after: 400 }
      }),

      // Den overordnede proces
      new Paragraph({
        children: [new TextRun({ text: "🔄 Den overordnede proces", bold: true, size: 32, color: SPY_BLUE })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Kunde → Returportal → SPY → Shopify", bold: true, size: 24 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Slutkunden ", bold: true }),
          new TextRun({ text: "bruger den tilgængelige returportal til registrering af returen – herunder valg af ordrer, varer og muligheder som fx returlabel, refundering eller ombytning." })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Selve varehåndteringen sker i SPY: ", bold: true }),
          new TextRun({ text: "Håndtér pakken ved modtagelse på lageret med bordscanner/håndscanner. Godkend, refundér eller ombyt fra SPY, og integrationen opdaterer automatisk Shopify." })
        ],
        spacing: { after: 200 }
      }),

      // Godt at vide
      new Paragraph({
        children: [new TextRun({ text: "📋 Godt at vide", bold: true })],
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• Gavekort: ", bold: true }),
          new TextRun({ text: "Det er pt. ikke muligt at udstede gavekort i stedet for tilbagebetaling – men vi arbejder på det." })
        ],
        indent: { left: convertInchesToTwip(0.25) },
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• Price Reduction: ", bold: true }),
          new TextRun({ text: "Funktionen i SPY understøttes ikke i kombination med Shopify-returportaler." })
        ],
        indent: { left: convertInchesToTwip(0.25) },
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• Copy/Credit: ", bold: true }),
          new TextRun({ text: "Via Sales → Invoiced bruges stadig til krediteringer uden returportaler." })
        ],
        indent: { left: convertInchesToTwip(0.25) },
        spacing: { after: 400 }
      }),

      // Vælg din metode
      new Paragraph({
        children: [new TextRun({ text: "🎯 Vælg din metode", bold: true, size: 32, color: SPY_BLUE })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Der er 3 måder at håndtere B2C-returneringer i SPY:" })],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "1️⃣ Process Shopify Return ", bold: true }),
          new TextRun({ text: "– Kunden har brugt en returportal" })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "2️⃣ Create Return ", bold: true }),
          new TextRun({ text: "– Manuel registrering uden portal" })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "3️⃣ Eksternt Lager ", bold: true }),
          new TextRun({ text: "– Via ekstern lagerintegration" })
        ],
        spacing: { after: 400 }
      }),

      // Metode 1
      new Paragraph({
        children: [new TextRun({ text: "① Process Shopify Return", bold: true, size: 32, color: SPY_BLUE })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Når kunden har startet returen via en integreret returportal", italics: true, color: GRAY_600 })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Navigation: Sales → Claims/Returns → Scan Shopify Returns", bold: true })],
        spacing: { after: 200 }
      }),

      // Image 2
      new Paragraph({
        children: [createImage('image2.png', 550)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Søg efter returen og tryk \"Process Shopify Return\"", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),

      // Steps
      new Paragraph({ children: [new TextRun({ text: "1. Søg efter returen ved at scanne returlabelen eller søge efter Shopify-ordren." })] }),
      new Paragraph({ children: [new TextRun({ text: "2. Tryk \"Process Shopify Return\" – varelinjerne, der er meldt retur, ligger klar til registrering." })] }),

      // Image 3
      new Paragraph({
        children: [createImage('image3.png', 550)].filter(Boolean),
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Varelinjerne ligger klar – scan stregkoden eller tryk på varen", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "3. Registrér varerne ved at scanne stregkoden eller trykke på den. Vælg:" })
        ]
      }),
      new Paragraph({
        children: [new TextRun({ text: "   • Claim Cause – årsagskode for returen" })],
        indent: { left: convertInchesToTwip(0.25) }
      }),
      new Paragraph({
        children: [new TextRun({ text: "   • Claim Type – \"Return/Credit Note\" (på lager) eller \"Claim/Credit Note\" (ikke på lager)" })],
        indent: { left: convertInchesToTwip(0.25) }
      }),
      new Paragraph({
        children: [new TextRun({ text: "   • Needs Label – slå til, hvis I ønsker print af ny style-label" })],
        indent: { left: convertInchesToTwip(0.25) },
        spacing: { after: 200 }
      }),

      // Image 4
      new Paragraph({
        children: [createImage('image4.png', 550)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Registrér varen: Vælg Claim Type, Claim Cause, og om der skal printes ny label", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),

      new Paragraph({ children: [new TextRun({ text: "4. Gem linjen ved at trykke eller scanne \"Save Item\". Gentag for alle varelinjer." })] }),
      new Paragraph({ children: [new TextRun({ text: "5. Bekræft returen ved at trykke eller scanne \"Confirm\". Tilbagebetaling sættes i gang automatisk." })], spacing: { after: 200 } }),

      // Image 5
      new Paragraph({
        children: [createImage('image5.png', 550)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Bekræft returen og se beløbsoversigt", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),

      // Tilbagebetaling tip
      new Paragraph({
        children: [new TextRun({ text: "💰 Tilbagebetaling", bold: true, color: GREEN })],
        spacing: { before: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Returen ligger nu under Sales → Claims/Returns → Confirmed. Tilbagebetalingen går automatisk tilbage til det oprindelige betalingsmiddel (kreditkort, gavekort osv.). SPY følger fragtbeløbet fra returportalen." })],
        spacing: { after: 400 }
      }),

      // Ombytninger
      new Paragraph({
        children: [new TextRun({ text: "🔄 Ombytninger via returportaler", bold: true, size: 28, color: SPY_BLUE })],
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Når systemet registrerer en ombytning via returportalen:" })],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• Varerne reserveres på lageret med det samme ", bold: true }),
          new TextRun({ text: "– så de er klar til den nye ordre." })
        ],
        indent: { left: convertInchesToTwip(0.25) }
      }),
      new Paragraph({
        children: [new TextRun({ text: "• Den \"nye\" ordre venter, til varerne fra den oprindelige ordre er registreret retur." })],
        indent: { left: convertInchesToTwip(0.25) }
      }),
      new Paragraph({
        children: [new TextRun({ text: "• SPY håndterer automatisk eventuel ekstra betaling via Shopify, hvis der er prisforskel." })],
        indent: { left: convertInchesToTwip(0.25) },
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "⚡ Vigtigt: ", bold: true }),
          new TextRun({ text: "SPY håndterer først kreditering eller opkrævning, når både returen og ombytningen er færdiggjort i SPY." })
        ],
        spacing: { after: 400 }
      }),

      // Metode 2
      new Paragraph({
        children: [new TextRun({ text: "② Create Return", bold: true, size: 32, color: SPY_BLUE })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Når returen ikke er startet via en returportal – I registrerer den selv", italics: true, color: GRAY_600 })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Navigation: Sales → Claims/Returns → Scan Claims/Returns", bold: true })],
        spacing: { after: 200 }
      }),

      // Image 6
      new Paragraph({
        children: [createImage('image6.png', 550)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Søg efter ordren og tryk \"Create Return\"", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),

      new Paragraph({ children: [new TextRun({ text: "1. Søg efter ordren via en af de oplyste parametre." })] }),
      new Paragraph({ children: [new TextRun({ text: "2. Tryk \"Create Return\" – vælg Credit Note Date, Claim Cause og evt. kommentarer." })], spacing: { after: 200 } }),

      // Image 7
      new Paragraph({
        children: [createImage('image7.png', 450)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Vælg Credit Note Date, Claim Cause og tilføj evt. kommentarer", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),

      new Paragraph({ children: [new TextRun({ text: "3. Vælg varerne, der skal registreres på returen, ved at scanne eller trykke." })], spacing: { after: 200 } }),

      // Image 8
      new Paragraph({
        children: [createImage('image8.png', 550)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Vælg de varer, der skal registreres på returen", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),

      new Paragraph({ children: [new TextRun({ text: "4. Konfigurér hver varelinje: Claim Cause, Claim Type og om der skal printes ny label." })], spacing: { after: 200 } }),

      // Image 9
      new Paragraph({
        children: [createImage('image9.png', 550)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Udfyld detaljer for hver vare: Claim Type, Claim Cause og Needs Label", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),

      new Paragraph({ children: [new TextRun({ text: "5. Tryk \"Continue\", når alle linjer er registreret." })], spacing: { after: 200 } }),

      // Image 10
      new Paragraph({
        children: [createImage('image10.png', 550)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Oversigt over scannede varer – tryk Continue for at fortsætte", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),

      // Image 11
      new Paragraph({
        children: [createImage('image11.png', 400)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Bekræft, hvis ikke alle varer er scannet – de fjernes fra returen", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),

      new Paragraph({ children: [new TextRun({ text: "6. Bekræft: Brug evt. \"Update Freight Refund Amount\" til automatisk fragtbeløb. Tryk \"Confirm\"." })], spacing: { after: 200 } }),

      // Image 12
      new Paragraph({
        children: [createImage('image12.png', 550)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Bekræft returen med Finance Info og fragtbeløb", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "📝 Note om fragt: ", bold: true }),
          new TextRun({ text: "Hvis slutkunden selv skal betale for returfragten, skal værdien i \"Freight Refund\" være negativ." })
        ],
        spacing: { after: 400 }
      }),

      // Metode 3
      new Paragraph({
        children: [new TextRun({ text: "③ Eksternt Lager Integration", bold: true, size: 32, color: SPY_BLUE })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Når I har en integration til et eksternt lager", italics: true, color: GRAY_600 })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Har I en ekstern lagerintegration, der allerede behandler B2B-retur via eksportfunktionen (RECADV/Entry), gør en returportal det endnu nemmere – flowet er automatisk:" })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Returportal → SPY eksport → Eksternt lager → Auto-kreditnota", bold: true, size: 24 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Returen eksporteres til lageret som en B2B-retur. Når lageret tilbagemelder, dannes kreditnota og tilbagebetaling automatisk." })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "📞 Vigtigt: ", bold: true }),
          new TextRun({ text: "Kontakt jeres lager og indgå aftale om den nye håndtering – det påvirker deres arbejdsgang. Returen vil ligge under Sales → Delivered, indtil lageret tilbagemelder." })
        ],
        spacing: { after: 400 }
      }),

      // Tips
      new Paragraph({
        children: [new TextRun({ text: "💡 Tip & Tricks", bold: true, size: 32, color: SPY_BLUE })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),

      // Print Action Barcodes
      new Paragraph({
        children: [new TextRun({ text: "🖨️ Print Action Barcodes", bold: true, size: 26 })],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "I kan printe jeres \"Claim Causes\" og \"Claim Types\" ud som stregkoder. På den måde slipper I for at trykke på pc'en – i stedet vælger I ved at scanne den relevante stregkode. Perfekt til at speede arbejdsgangen op!" })],
        spacing: { after: 200 }
      }),

      // Image 14
      new Paragraph({
        children: [createImage('image14.png', 500)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Klik på \"Print Action Barcodes\" for at printe stregkoder", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 }
      }),

      // Toggle Label
      new Paragraph({
        children: [new TextRun({ text: "🔄 Toggle Label via scanner", bold: true, size: 26, color: GREEN })],
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Ligesom det er muligt at navigere med bordscanneren ved at scanne funktioner med stregkoder, kan I også skifte \"Needs Label\" til/fra ved at scanne på \"Toggle Label\"." })],
        spacing: { after: 200 }
      }),

      // Image 13
      new Paragraph({
        children: [createImage('image13.png', 500)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "\"Needs Label\" kan toggles via scanner", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),

      // Aktivering
      new Paragraph({
        children: [new TextRun({ text: "⚙️ Sådan aktiverer I returhåndtering", bold: true, size: 32, color: SPY_BLUE })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Shopify Return-filteret vises først, når det er aktiveret.", italics: true, color: GRAY_600 })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Navigation: Admin → Settings → Integration → Shopify → Shops → Edit", bold: true })],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Aktivér feltet: \"Handle Returns\"" })],
        spacing: { after: 200 }
      }),

      // Image 1
      new Paragraph({
        children: [createImage('image1.png', 550)].filter(Boolean),
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Aktivér \"Handle Returns\" under Shopify integration settings", italics: true, size: 20, color: GRAY_600 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),

      // Footer
      new Paragraph({
        children: [new TextRun({ text: "De bedste hilsner fra SPY-teamet", bold: true, size: 28, color: SPY_BLUE })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "🇩🇰 Danmark: support@spysystem.dk | +45 97 99 77 76" })],
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [new TextRun({ text: "🇳🇱 Holland: supportnl@spy-system.com | +31 318 798 210" })],
        alignment: AlignmentType.CENTER
      }),
    ]
  }]
});

// Generate and save
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(path.join(__dirname, 'Returhaandtering-Nyhedsbrev.docx'), buffer);
console.log('✅ Word-dokument genereret: Returhaandtering-Nyhedsbrev.docx');
