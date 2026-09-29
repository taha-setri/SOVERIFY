import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';
import { generateSovereignDpoLegalAdvice } from '../server/sovereignDpoEngine';

interface VercelReq extends IncomingMessage {
  body?: any;
  method?: string;
}

interface VercelRes extends ServerResponse {
  status: (statusCode: number) => VercelRes;
  json: (data: any) => void;
}

const DPO_SYSTEM_INSTRUCTION = `أنت "المستشار القانوني الرقمي وخبير حماية المعطيات الشخصية" (Soverify AI DPO Consultant).
أنت خبير معتمد ومستشار قانوني رفيع المستوى في التشريع المغربي، وبشكل خاص:
- القانون رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي.
- مرسوم تطبيق القانون رقم 09-08 (المرسوم رقم 2.09.165).
- قرارات ومداولات اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP)، وخاصة المداولة رقم 08-2020 المتعلقة بملفات تعريف الارتباط (Cookies).
- المبادئ التوجيهية للسيادة الرقمية وتوطين البيانات ونقل المعطيات خارج التراب الوطني (المادتان 43 و44).`;

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
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

    const { messages, model = 'sovereign-free', auditContext } = body || {};
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user');
    const userPromptText = lastUserMsg?.content || '';

    // If free autonomous sovereign engine or no Gemini API key
    if (model === 'sovereign-free' || !process.env.GEMINI_API_KEY) {
      const freeAdvice = generateSovereignDpoLegalAdvice(userPromptText, messages, auditContext);
      res.status(200).json({
        reply: freeAdvice,
        modelUsed: 'المحرك القانوني السيادي المغربي (مجاني 100% ومستقل)',
        isFallback: false
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    const contents = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: typeof model === 'string' && model !== 'sovereign-free' ? model : 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: DPO_SYSTEM_INSTRUCTION,
        temperature: 0.3
      }
    });

    res.status(200).json({
      reply: response.text || '',
      modelUsed: model,
      isFallback: false
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'Chat error' });
  }
}
