const axios = require('axios');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

const CYBERSEC_TOPICS = 'cybersecurity OR hacking OR CTF OR vulnerability OR malware OR ransomware';

/**
 * @desc    Get live cybersecurity news
 * @route   GET /api/ctf-news
 * @access  Private
 */
const getCyberNews = asyncHandler(async (req, res) => {
  if (!process.env.NEWS_API_KEY) {
    // Return mock data if no API key configured
    return res.json({
      success: true,
      source: 'mock',
      message: 'Configure NEWS_API_KEY in .env for live news',
      data: getMockNews(),
    });
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: CYBERSEC_TOPICS,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: process.env.NEWS_API_KEY,
      },
      timeout: 8000,
    });

    const articles = response.data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      source: article.source.name,
      url: article.url,
      image_url: article.urlToImage,
      published_at: article.publishedAt,
    }));

    res.json({ success: true, source: 'NewsAPI', count: articles.length, data: articles });
  } catch (error) {
    // Fallback to mock on API error
    res.json({
      success: true,
      source: 'mock_fallback',
      message: 'Live news temporarily unavailable',
      data: getMockNews(),
    });
  }
});

const getMockNews = () => [
  {
    title: 'Critical Zero-Day Vulnerability Discovered in Popular Web Framework',
    description: 'Security researchers have discovered a critical remote code execution vulnerability affecting millions of installations worldwide.',
    source: 'OPENLABS News',
    url: 'https://example.com/news/1',
    image_url: null,
    published_at: new Date().toISOString(),
  },
  {
    title: 'New CTF Competition: GlobalCTF 2025 Registration Open',
    description: 'Teams worldwide are invited to participate in one of the largest online CTF competitions of the year.',
    source: 'CTFtime',
    url: 'https://ctftime.org',
    image_url: null,
    published_at: new Date().toISOString(),
  },
  {
    title: 'Ransomware Groups Target Healthcare Sector',
    description: 'Multiple hospitals across Europe and North America report ransomware attacks disrupting operations.',
    source: 'OPENLABS News',
    url: 'https://example.com/news/3',
    image_url: null,
    published_at: new Date().toISOString(),
  },
];

module.exports = { getCyberNews };
