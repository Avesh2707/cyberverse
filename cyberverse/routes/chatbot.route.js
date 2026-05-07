const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth.middleware');

const SYSTEM_PROMPT = `You are ARIA (Advanced Reconnaissance & Intelligence Assistant), the AI assistant for OpenLabs — a cybersecurity learning platform. You are an expert ethical hacker and cybersecurity mentor.

Your personality:
- Speak like a knowledgeable hacker mentor — technical but approachable
- Use occasional hacker slang (pwned, root, 0day, etc.) naturally
- Be encouraging to beginners, challenging to advanced users
- Keep responses concise and practical

Your expertise covers:
- Web Security (XSS, SQLi, CSRF, SSRF, IDOR)
- Network Security (Nmap, Wireshark, MITM, ARP spoofing)
- Cryptography (RSA, AES, classical ciphers, hash cracking)
- Reverse Engineering (Ghidra, GDB, assembly basics)
- Forensics (Volatility, steganography, file carving)
- OSINT (Google dorking, Shodan, social media intel)
- Binary Exploitation (buffer overflow, ROP chains, format strings)
- Malware Analysis (static & dynamic analysis)
- Cloud Security (AWS, Azure, GCP misconfigurations)
- CTF tips and strategies

Rules:
- Only help with ETHICAL hacking and learning
- Never help attack systems without permission
- Always remind users to practice on legal platforms (TryHackMe, HackTheBox, DVWA)
- If asked about illegal activities, redirect to ethical alternatives
- Keep responses under 300 words unless user asks for detailed explanation
- Format code blocks with triple backticks`;

// POST /api/chatbot
router.post('/', protect, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array required' });
    }

    // Validate messages format
    const validMessages = messages.filter(m =>
      m.role && m.content &&
      ['user', 'assistant'].includes(m.role) &&
      typeof m.content === 'string'
    );

    if (validMessages.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid messages format' });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'ARIA is currently offline. ANTHROPIC_API_KEY not configured.',
      });
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: validMessages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        timeout: 30000,
      }
    );

    const reply = response.data?.content?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ success: false, message: 'Empty response from AI' });
    }

    return res.json({ success: true, data: { reply } });

  } catch (error) {
    console.error('Chatbot error:', error?.response?.data || error.message);

    if (error?.response?.status === 401) {
      return res.status(503).json({ success: false, message: 'ARIA authentication failed. Check API key.' });
    }
    if (error?.response?.status === 429) {
      return res.status(429).json({ success: false, message: 'Rate limit hit. Please wait a moment.' });
    }

    return res.status(500).json({ success: false, message: 'ARIA is temporarily unavailable.' });
  }
});

module.exports = router;
