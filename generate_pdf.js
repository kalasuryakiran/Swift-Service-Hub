
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const htmlPath = path.join(__dirname, 'report.html');
    // Open the local HTML file
    await page.goto(`file:${htmlPath}`, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfPath = path.join(__dirname, 'Swift_Service_Hub_Report.pdf');
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    console.log(`PDF Generated successfully at: ${pdfPath}`);
    await browser.close();
})();
