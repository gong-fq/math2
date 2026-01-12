const fetch = require('node-fetch'); // 确保环境支持 fetch

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!DEEPSEEK_API_KEY) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: '未在 Netlify 后台配置 DEEPSEEK_API_KEY 环境变量' }) 
      };
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // 确保模型名称正确
        messages: messages,
        stream: true, // 强制开启流式
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      return { statusCode: response.status, body: errorDetail };
    }

    // 转发流式响应
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
      body: response.body,
      isBase64Encoded: false
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};