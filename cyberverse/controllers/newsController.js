const axios = require('axios');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    Get live cybersecurity news
// @route   GET /api/ctf-news
// @access  Private
exports.getCTFNews = async (req, res, next) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey || apiKey === 'your_newsapi_key_here') {
      // Return mock data if no API key configured
      return sendSuccess(res, 200, 'CTF News fetched (mock)', {
        articles: getMockNews(),
        source: 'mock',
      });
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'cybersecurity CTF hacking vulnerability',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 20,
        apiKey,
      },
      timeout: 8000,
    });

    const articles = response.data.articles.map((a) => ({
      title: a.title,
      description: a.description,
      source: a.source.name,
      url: a.url,
      published_date: a.publishedAt,
      image: a.urlToImage,
    }));

    return sendSuccess(res, 200, 'CTF News fetched', { count: articles.length, articles });
  } catch (error) {
    // Fallback to mock on API failure
    console.error('NewsAPI error:', error.message);
    return sendSuccess(res, 200, 'CTF News fetched (fallback)', {
      articles: getMockNews(),
      source: 'fallback',
    });
  }
};

// @desc    Get live CTF events from CTFtime
// @route   GET /api/live-ctfs
// @access  Private
exports.getLiveCTFs = async (req, res, next) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const futureTime = now + 30 * 24 * 60 * 60; // 30 days ahead

    const response = await axios.get(`${process.env.CTFTIME_API_URL || 'https://ctftime.org/api/v1'}/events/`, {
      params: { limit: 20, start: now, finish: futureTime },
      headers: { 'User-Agent': 'OPENLABS-Platform/1.0' },
      timeout: 8000,
    });

    const events = response.data.map((e) => ({
      event_name: e.title,
      start_date: e.start,
      end_date: e.finish,
      format: e.format,
      location: e.location || 'Online',
      link: e.url,
      ctftime_url: e.ctftime_url,
      weight: e.weight,
      organizer: e.organizers?.[0]?.name || 'Unknown',
    }));

    return sendSuccess(res, 200, 'Live CTF events fetched', { count: events.length, events });
  } catch (error) {
    console.error('CTFtime API error:', error.message);
    return sendSuccess(res, 200, 'Live CTF events (fallback)', {
      events: getMockCTFEvents(),
      source: 'fallback',
    });
  }
};

// Mock data fallbacks
function getMockNews() {
  return [
    {
      title: 'Critical RCE Vulnerability Found in Popular Web Framework',
      description: 'Security researchers have disclosed a critical remote code execution vulnerability...',
      source: 'The Hacker News',
      url: 'https://thehackernews.com',
      published_date: new Date().toISOString(),
    },
    {
      title: 'Google Announces $1M Bug Bounty Program Expansion',
      description: 'Google is expanding its VRP program to include Chrome OS and Android...',
      source: 'BleepingComputer',
      url: 'https://bleepingcomputer.com',
      published_date: new Date().toISOString(),
    },
    {
      title: 'DEF CON 2024 CTF Finals Results Announced',
      description: 'The annual hacking competition saw teams from 30 countries compete...',
      source: 'Dark Reading',
      url: 'https://darkreading.com',
      published_date: new Date().toISOString(),
    },
  ];
}

function getMockCTFEvents() {
  const now = new Date();
  const next7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return [
    {
      event_name: 'PicoCTF 2024',
      start_date: now.toISOString(),
      end_date: next7.toISOString(),
      format: 'Jeopardy',
      location: 'Online',
      link: 'https://picoctf.org',
    },
    {
      event_name: 'HackTheBox CTF Season',
      start_date: now.toISOString(),
      end_date: next7.toISOString(),
      format: 'Attack-Defense',
      location: 'Online',
      link: 'https://hackthebox.com',
    },
  ];
}
