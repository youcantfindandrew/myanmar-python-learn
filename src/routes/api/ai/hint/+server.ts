import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { rateLimit, getClientIp } from '$lib/server/rate-limit';

const GROQ_API_KEY = env.GROQ_API_KEY ?? '';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant'; // free tier, ~600 tok/s

export const POST: RequestHandler = async ({ request }) => {
	// 20 AI hint requests per 15 minutes per IP
	const ip = getClientIp(request, request.headers);
	const rl = rateLimit(`hint:${ip}`, 20, 15 * 60 * 1000);
	if (!rl.ok) {
		return json({ hint: null }, {
			status: 429,
			headers: { 'Retry-After': String(rl.retryAfter) }
		});
	}

	const body = await request.json().catch(() => null);
	if (!body) throw error(400, 'Invalid body');

	const { code, errorMsg, problemDesc, language } = body as {
		code: string;
		errorMsg: string | null;
		problemDesc: string;
		language: 'en' | 'mm';
	};

	if (!GROQ_API_KEY) {
		// No API key configured — return a generic offline hint
		return json({ hint: language === 'en'
			? '💡 AI hints are not configured yet. Try reading the error message carefully and checking your indentation!'
			: '💡 AI အကြံပေးချက်များ မသတ်မှတ်ရသေးပါ။ Error message ကို သေချာဖတ်ပြီး indentation စစ်ဆေးပါ!'
		});
	}

	const systemPrompt = language === 'en'
		? `You are a patient, encouraging Python tutor helping kids aged 6-16 learn to code in Myanmar.
Give a SHORT hint (2-4 sentences) that guides without giving the full answer.
Be warm, simple, and age-appropriate. Use simple English.
Do NOT write the complete solution. Just point them in the right direction with a concrete suggestion.
Start your response with a friendly emoji.`
		: `သင်သည် မြန်မာနိုင်ငံရှိ အသက် ၆-၁၆ နှစ် ကလေးများကို Python ကုဒ်ရေးနည်း သင်ကြားပေးနေသော သည်းခံတတ်ပြီး အားပေးတတ်သော ဆရာ/ဆရာမ ဖြစ်သည်။
ဖြေဆိုချက်ကို မပေးဘဲ ကိုင်တွယ်ရမည့်ဦးတည်ချက်ကိုသာ ပြောပြသော တိုတောင်းသော အကြံပေးချက် (၂-၄ ကြောင်း) ပေးပါ။
ချစ်ချစ်ခင်ခင်၊ ရိုးရိုးရှင်းရှင်းဖြင့် ပြောပါ။ မြန်မာဘာသာဖြင့်သာ ဖြေပါ။
ဖြေဆိုချက် အပြည့်အစုံ မရေးပါနဲ့။ Emoji တစ်ခုနှင့် စပါ။`;

	const userMessage = [
		`Problem: ${problemDesc}`,
		`Student's code:\n\`\`\`python\n${code.slice(0, 800)}\n\`\`\``,
		errorMsg ? `Error: ${errorMsg.slice(0, 300)}` : 'No error — code runs but may not produce correct output.'
	].join('\n\n');

	try {
		const resp = await fetch(GROQ_URL, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${GROQ_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: MODEL,
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: userMessage }
				],
				max_tokens: 200,
				temperature: 0.5
			})
		});

		if (!resp.ok) {
			const txt = await resp.text();
			console.error('Groq error:', resp.status, txt);
			throw new Error(`Groq ${resp.status}`);
		}

		const data = await resp.json() as { choices: { message: { content: string } }[] };
		const hint = data.choices[0]?.message?.content?.trim() ?? '';
		return json({ hint });
	} catch (e) {
		console.error('AI hint failed:', e);
		// Graceful degradation — let client use offline fallback
		return json({ hint: null }, { status: 200 });
	}
};
