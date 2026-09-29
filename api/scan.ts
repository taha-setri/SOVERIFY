import type { IncomingMessage, ServerResponse } from 'http';
import { performRealDomainAudit } from '../server/realAuditEngine';
import crypto from 'crypto';

interface VercelReq extends IncomingMessage {
  body?: any;
  query?: Record<string, string>;
  method?: string;
}

interface VercelRes extends ServerResponse {
  status: (statusCode: number) => VercelRes;
  json: (data: any) => void;
  send: (body: any) => void;
}

export default async function handler(req: VercelReq, res: VercelRes) {
  // Global CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST with { target: "domain.ma" }' });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // use raw
      }
    }

    const target = body?.target || (req.query as any)?.target;
    if (!target || typeof target !== 'string') {
      res.status(400).json({ error: 'Target URL or domain is required.' });
      return;
    }

    console.log(`[Vercel Serverless Audit Engine] Scanning domain: ${target}`);
    const report = await performRealDomainAudit(target);

    // Compute cryptographic SHA-256 seal
    const signature = report.signature || crypto.createHash('sha256').update(`${report.domain}-${report.score}`).digest('hex');
    report.signature = signature;

    res.status(200).json({
      success: true,
      report
    });
  } catch (err: any) {
    console.error('[Vercel Serverless Audit Engine] Error during scan:', err);
    res.status(500).json({
      error: err?.message || 'Server error during compliance audit scan'
    });
  }
}
