import app from '../src/app.js';
import { createServer } from 'http';

export default function handler(req, res) {
  return app(req, res);
}
