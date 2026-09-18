exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { nome, email, whatsapp } = JSON.parse(event.body);

    let numero = whatsapp.replace(/\D/g, '');
    const telefoneFormatado = (numero.length === 10 || numero.length === 11)
      ? '+55' + numero
      : whatsapp;

    const API_KEY = process.env.BREVO_API_KEY;
    const LIST_ID = 2;

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          NOME: nome,
          SMS: telefoneFormatado
        },
        listIds: [LIST_ID],
        updateEnabled: true
      })
    });

    const responseText = await response.text();
    console.log('Brevo status:', response.status);
    console.log('Brevo resposta:', responseText);

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: responseText })
      };
    }
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};