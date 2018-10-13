const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('request', request => {
    console.log('*** REQUEST ***', request.url());
  });
  page.on('response', response => {
    console.log('*** RESPONSE ***', response.status(), response.url() );
  });
  await page.goto('https://github.com/');

  await browser.close();
})();
