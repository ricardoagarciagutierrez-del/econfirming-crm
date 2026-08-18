export const onRequestPost = async ({ request, env }) => {
  try {
    const body = await request.json()
    const key = env.ANTHROPIC_API_KEY
    if (!key) {
      return new Response(JSON.stringify({ error: 'ANALYSIS_KEY_MISSING' }), { status: 503 })
    }

    // Build a strict prompt asking for only the required JSON structure
    const prompt = `Eres un analista del pipeline. A partir del siguiente JSON con métricas y conteos, devuelve SOLO un JSON con la forma {"titular":"...","hallazgos":[...],"accionRecomendada":"..."}. Puedes usar únicamente los datos entregados. No inventes cifras ni convenios.\n\nDATOS:\n` + JSON.stringify(body)

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),
    })

    if (!resp.ok) {
      const text = await resp.text()
      return new Response(JSON.stringify({ error: 'MODEL_ERROR', detail: text }), { status: 502 })
    }

    const data = await resp.json()
    // Try to extract assistant content depending on response shape
    const content = data?.choices?.[0]?.message?.content || data?.output || data?.result || JSON.stringify(data)

    // Validate that content is JSON; try parse
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content
      return new Response(JSON.stringify({ ok: true, resumen: parsed }), { status: 200 })
    } catch (e) {
      // If model did not return pure JSON, return an error to trigger fallback on client
      return new Response(JSON.stringify({ error: 'INVALID_MODEL_OUTPUT', raw: content }), { status: 502 })
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: 'INTERNAL_ERROR' }), { status: 500 })
  }
}
