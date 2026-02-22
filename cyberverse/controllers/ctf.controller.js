const axios = require('axios');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * @desc    Get live CTF events from CTFtime
 * @route   GET /api/live-ctfs
 * @access  Private
 */
const getLiveCTFs = asyncHandler(async (req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysLater = now + 30 * 24 * 60 * 60;

    const response = await axios.get('https://ctftime.org/api/v1/events/', {
      params: { limit: 20, start: now, finish: thirtyDaysLater },
      headers: { 'User-Agent': 'OPENLABS-Platform/1.0' },
      timeout: 8000,
    });

    const events = response.data.map((event) => ({
      id: event.id,
      event_name: event.title,
      description: event.description,
      start_date: new Date(event.start * 1000).toISOString(),
      end_date: new Date(event.finish * 1000).toISOString(),
      format: event.format,
      format_id: event.format_id,
      location: event.location || 'Online',
      link: event.url,
      ctftime_url: event.ctftime_url,
      weight: event.weight,
      organizers: event.organizers?.map((o) => o.name) || [],
      logo: event.logo,
    }));

    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    // Return mock events on failure
    res.json({
      success: true,
      source: 'mock_fallback',
      message: 'Live CTF data temporarily unavailable. Showing sample events.',
      data: getMockCTFs(),
    });
  }
});

const getMockCTFs = () => [
  {
    id: 1,
    event_name: 'PicoCTF 2025',
    description: 'A beginner-friendly CTF hosted by Carnegie Mellon University.',
    start_date: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    end_date: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(),
    format: 'Jeopardy',
    location: 'Online',
    link: 'https://picoctf.org',
    weight: 55.5,
    organizers: ['CMU Cybersecurity Club'],
  },
  {
    id: 2,
    event_name: 'DEF CON CTF Qualifier',
    description: 'The qualifier for the prestigious DEF CON CTF competition.',
    start_date: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    end_date: new Date(Date.now() + 16 * 24 * 3600 * 1000).toISOString(),
    format: 'Attack-Defense',
    location: 'Online',
    link: 'https://defcon.org',
    weight: 100,
    organizers: ['DEF CON'],
  },
];

module.exports = { getLiveCTFs };
