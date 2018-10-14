const puppeteer = require('puppeteer');
const record = require('./record');

const url = process.argv[2];
if (!url) {
  throw new Error('url should be specified');
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const waitingRequests = [];
  let waitCounter = 0;

  page.on('request', request => {
    waitingRequests.push(request.url());
    waitCounter = 0;
  });
  page.on('response', response => {
    let index = waitingRequests.indexOf(response.url());
    if (index >= 0) {
      waitingRequests.splice(index, 1);
    }
    waitCounter = 0;
    record.logResponse(response);
  });
  page.on('console', message => {
    record.logConsole(message);
  });

  await page.goto(url);
  await new Promise(resolve => {
    const watcher = setInterval(() => {
      waitCounter += 1;
      if (waitCounter > 10) {
        clearInterval(watcher);
        resolve();
      }
    }, 100);
  })
  await browser.close();
  record.writeFile();
})();
