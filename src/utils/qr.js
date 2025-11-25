const QRCode = require('qrcode');

async function generateQRCode(text) {
  // returns Data URL (base64)
  return await QRCode.toDataURL(text);
}

module.exports = { generateQRCode };
