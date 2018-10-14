const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const records = {
  responses: {},
  consoles: [],
};

const logResponse = async response => {
  const body = await response.buffer();
  const hash = crypto.createHash('sha256').update(body).digest('hex');
  records.responses[response.url()] = {
    headers: response.headers(),
    status: response.status(),
    hash,
  };
};

const logConsole = message => {
  records.consoles.push({
    type: message.type(),
    text: message.text,
  });
}

const writeFile = () => {
  const dir = 'results';
  const now = new Date();
  const fileName = (
    now.toLocaleString('ja-JP').replace(/[- :]/g,'') +
    '.json'
  );
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(dir, fileName),
    JSON.stringify(records, null, 4)
  );
};

module.exports = {
  logResponse,
  logConsole,
  writeFile,
};
