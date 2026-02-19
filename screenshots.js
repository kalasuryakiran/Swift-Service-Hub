
import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const capture = async (name, url = 'http://127.0.0.1:8080/') => {
        const filePath = path.resolve(name);
        console.log(`Capturing ${name} to ${filePath}...`);
        try {
            if (page.url() !== url) await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await page.screenshot({ path: filePath });
            console.log(`Saved ${name}`);
        } catch (e) {
            console.error(`Failed to capture ${name}:`, e.message);
        }
    };

    try {
        await capture('login.png');

        console.log('Logging in...');
        await page.type('input[type="text"]', 'admin');
        await page.type('input[type="password"]', 'admin123');
        const loginButton = await page.$('button[type="submit"]');
        if (loginButton) {
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }),
                loginButton.click()
            ]);
        }

        // Wait for dashboard content
        await new Promise(r => setTimeout(r, 2000));
        await capture('admin_dashboard.png', page.url());

        // Try to find the modal button
        const newRequestBtn = await page.$x("//button[contains(., 'New Request')]");
        if (newRequestBtn.length > 0) {
            await newRequestBtn[0].click();
            await new Promise(r => setTimeout(r, 1000));
            await capture('create_request_modal.png', page.url());
        }

    } catch (error) {
        console.error('Script error:', error);
    } finally {
        await browser.close();
        console.log('Browser closed.');
    }
})();
