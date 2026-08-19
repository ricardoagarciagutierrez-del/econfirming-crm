exports.handler = async function (event, context) {
  try {
    const body = event.body ? JSON.parse(event.body) : {}
    const conveniosCount = body?.conveniosCount || (body?.pipeline?.total || 0)

    const titular = `${conveniosCount} convenios en el pipeline`;
    const hallazgos = conveniosCount ? [`${conveniosCount} convenios registrados`] : [];
    const accionRecomendada = conveniosCount ? 'Revisar convenios con mayor tiempo en etapa' : 'No hay convenios'

    const resumen = { titular, hallazgos, accionRecomendada }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumen, source: 'netlify-fallback' })
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'internal_error', detail: String(err) })
    }
  }
}
