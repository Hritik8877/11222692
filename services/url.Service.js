import data from '../data.js';
import generateShortcode from '../utils/generateShortcode.js';

export function shortenURL(req, res) {
  const { url, shortcode, validity } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  let code = shortcode || generateShortcode();
  if (shortcode) {
    if (!/^[a-zA-Z0-9]{4,10}$/.test(shortcode)) {
      return res.status(400).json({ error: 'Invalid shortcode format' });
    }
    if (data[shortcode]) {
      return res.status(400).json({ error: 'Shortcode already exists' });
    }
  }

const expiryTimestamp = Date.now() + ((validity || 30) * 60 * 1000);
const expiry = new Date(Math.floor(expiryTimestamp / 1000) * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');


  data[code] = {
    originalURL: url,
    expiresAt: expiryTimestamp
  };

  return res.status(201).json({
    shortLink: `https://localhost:5000/${code}`,
    expiry
  });
}


export function redirectURL(req, res) {
  const { shortcode } = req.params;
  const record = data[shortcode];

  if (!record) {
    return res.status(404).json({ error: 'Shortcode does not exist' });
  }

  if (Date.now() > record.expiresAt) {
    return res.status(410).json({ error: 'Shortcode has expired' });
  }

  return res.redirect(record.originalURL);
}
