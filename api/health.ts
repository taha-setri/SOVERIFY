import type { IncomingMessage, ServerResponse } from 'http';

interface VercelReq extends IncomingMessage {
  method?: string;
}

interface VercelRes extends ServerResponse {
  status: (statusCode: number) => VercelRes;
  json: (data: any) => void;
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    engine: 'Soverify Real Audit Serverless Engine (Vercel Node.js)',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
}
