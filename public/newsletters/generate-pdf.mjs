import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ 
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.goto(`file://${path.join(__dirname, 'returhaandtering-nyhedsbrev.html')}`, { waitUntil: 'networkidle0' });
await page.pdf({
  path: 'returhaandtering-nyhedsbrev.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
});
await browser.close();
console.log('PDF generated with dark background!');
