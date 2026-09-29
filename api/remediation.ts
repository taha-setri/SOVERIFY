import type { IncomingMessage, ServerResponse } from 'http';
import { generateTechStackRemediation } from '../server/remediationOptimizer';

interface VercelReq extends IncomingMessage {
  body?: any;
  method?: string;
}

interface VercelRes extends ServerResponse {
  status: (statusCode: number) => VercelRes;
  json: (data: any) => void;
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
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

    const { targetDomain = 'domain.ma', techStack = 'Generic Web Stack', score = 50, gaps = [], warnings = [] } = body || {};

    const optimization = await generateTechStackRemediation(null, {
      targetDomain,
      techStack,
      score,
      gaps,
      warnings
    });

    res.status(200).json({
      success: true,
      optimization
    });
  } catch (err: any) {
    console.error('Error in remediation handler:', err);
    res.status(500).json({ error: err.message || 'Remediation error' });
  }
}
