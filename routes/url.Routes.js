import express from 'express';
import { shortenURL, redirectURL } from '../services/url.Service.js';

const router = express.Router();

router.post('/shorten', shortenURL);
router.get('/:shortcode', redirectURL);

export default router;
