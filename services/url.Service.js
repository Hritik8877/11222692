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

  const expiry = Date.now() + ((validity || 30) * 60 * 1000);

  data[code] = {
    originalURL: url,
    expiresAt: expiry
  };

  return res.status(201).json({ shortURL: `http://localhost:5000/${code}` });
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
