import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = '1dily2wiik92TAyK3zyIsu8TDuyYNoF20IM1iMk_X-pg';

// Cache parameter in memory with TTL
let cachedParam: {
  param: string;
  source: string;
  updatedAt: number;
  rawText?: string;
} = {
  param: '',
  source: 'initial',
  updatedAt: Date.now(),
};

async function fetchSpreadsheetParam(): Promise<{ param: string; raw: string }> {
  try {
    const urls = [
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`,
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`,
    ];

    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ShiaTube/1.0',
          },
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const text = await res.text();
          // Extract first cell value (A1) from CSV
          const firstLine = text.split('\n')[0] || '';
          let cellA1 = firstLine.replace(/^"|"$/g, '').trim();
          
          if (cellA1) {
            // Normalize parameter (ensure it starts with ? or & if not empty)
            if (!cellA1.startsWith('?') && !cellA1.startsWith('&')) {
              cellA1 = '?' + cellA1;
            }
            return { param: cellA1, raw: firstLine };
          }
        }
      } catch {
        // Try next URL
      }
    }
  } catch (err) {
    console.error('Failed to fetch from Google Spreadsheet:', err);
  }

  return { param: '', raw: '' };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Dynamic Education Parameter
  app.get('/api/education-param', async (req, res) => {
    const forceRefresh = req.query.refresh === 'true';
    const now = Date.now();
    const CACHE_TTL = 30 * 1000; // 30 seconds

    if (!forceRefresh && cachedParam.param && now - cachedParam.updatedAt < CACHE_TTL) {
      return res.json({
        success: true,
        param: cachedParam.param,
        source: 'cache',
        spreadsheetId: SPREADSHEET_ID,
        cachedAt: new Date(cachedParam.updatedAt).toISOString(),
      });
    }

    const { param, raw } = await fetchSpreadsheetParam();

    if (param) {
      cachedParam = {
        param,
        source: 'spreadsheet_live',
        updatedAt: now,
        rawText: raw,
      };
    } else if (!cachedParam.param) {
      // Fallback default query parameter if spreadsheet is offline/inaccessible
      cachedParam = {
        param: '',
        source: 'empty_default',
        updatedAt: now,
      };
    }

    return res.json({
      success: true,
      param: cachedParam.param,
      source: cachedParam.source,
      spreadsheetId: SPREADSHEET_ID,
      rawA1: raw || cachedParam.rawText || '',
      updatedAt: new Date(cachedParam.updatedAt).toISOString(),
    });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Serve code.gs and index.html raw contents if requested
  app.get('/api/gas-source', (req, res) => {
    res.json({
      spreadsheetId: SPREADSHEET_ID,
      targetEmbedDomain: 'youtubeeducation.com',
    });
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
