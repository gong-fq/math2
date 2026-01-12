// Netlify Serverless Function - 专门优化 DeepSeek 流式响应
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { messages, stream = true } = JSON.parse(event.body);
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!DEEPSEEK_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: '服务器未配置 DEEPSEEK_API_KEY' })
      };
    }

    // 调用 DeepSeek 官方接口
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // 确保调用 DeepSeek 模型
        messages: messages,
        stream: stream,
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ error: 'DeepSeek API 报错', details: errorData }) 
      };
    }

    // 如果是流式响应，转发数据流
    if (stream) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: response.body,
        isBase64Encoded: false
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', message: error.message })
    };
  }
};