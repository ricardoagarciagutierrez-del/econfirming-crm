export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { Allow: 'POST', 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));

    const prompt = body.prompt || 'Resume los convenios en formato breve.';

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
      },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', messages: [{ role: 'user', content: prompt }] }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status || 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  path: '/api/resumen',
};
