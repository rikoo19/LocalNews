export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q, topic, lang, country, max, apikey } = req.query;

    // Build GNews API URL
    const baseUrl = q 
      ? 'https://gnews.io/api/v4/search'
      : 'https://gnews.io/api/v4/top-headlines';
    
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (topic) params.append('topic', topic);
    if (lang) params.append('lang', lang);
    if (country) params.append('country', country);
    if (max) params.append('max', max);
    if (apikey) params.append('apikey', apikey);

    const url = `${baseUrl}?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();

    // Forward the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
