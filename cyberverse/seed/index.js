require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Domain = require('../models/Domain');
const Challenge = require('../models/Challenge');
const LearningModule = require('../models/LearningModule');
const Leaderboard = require('../models/Leaderboard');

const connectDB = require('../config/db');

const DOMAINS = [
  { name: 'Web Security', slug: 'web-security', description: 'SQL injection, XSS, CSRF, and modern web vulnerabilities.', difficulty_level: 'beginner', icon: '🌐', image_url: 'https://img.icons8.com/fluency/96/web.png' },
  { name: 'Network Security', slug: 'network-security', description: 'Packet analysis, firewall evasion, and network-level attacks.', difficulty_level: 'intermediate', icon: '🔗', image_url: 'https://img.icons8.com/fluency/96/network.png' },
  { name: 'Cryptography', slug: 'cryptography', description: 'Ciphers, hashing, encryption schemes, and crypto attacks.', difficulty_level: 'intermediate', icon: '🔐', image_url: 'https://img.icons8.com/fluency/96/lock.png' },
  { name: 'Reverse Engineering', slug: 'reverse-engineering', description: 'Disassembly, decompilation, and binary analysis.', difficulty_level: 'advanced', icon: '⚙️', image_url: 'https://img.icons8.com/fluency/96/settings.png' },
  { name: 'Forensics', slug: 'forensics', description: 'Disk imaging, memory forensics, and steganography.', difficulty_level: 'intermediate', icon: '🔍', image_url: 'https://img.icons8.com/fluency/96/search.png' },
  { name: 'OSINT', slug: 'osint', description: 'Open-source intelligence gathering and social engineering.', difficulty_level: 'beginner', icon: '🕵️', image_url: 'https://img.icons8.com/fluency/96/spy.png' },
  { name: 'Malware Analysis', slug: 'malware-analysis', description: 'Static and dynamic malware analysis techniques.', difficulty_level: 'advanced', icon: '🦠', image_url: 'https://img.icons8.com/fluency/96/virus.png' },
  { name: 'Cloud Security', slug: 'cloud-security', description: 'AWS, GCP, Azure misconfigurations and cloud-native attacks.', difficulty_level: 'advanced', icon: '☁️', image_url: 'https://img.icons8.com/fluency/96/cloud.png' },
  { name: 'Binary Exploitation', slug: 'binary-exploitation', description: 'Buffer overflows, ROP chains, and pwn challenges.', difficulty_level: 'advanced', icon: '💥', image_url: 'https://img.icons8.com/fluency/96/bug.png' },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting seed...');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Domain.deleteMany(),
      Challenge.deleteMany(),
      LearningModule.deleteMany(),
      Leaderboard.deleteMany(),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'OPENLABS_admin',
      email: process.env.ADMIN_EMAIL || 'admin@OPENLABS.io',
      password: process.env.ADMIN_PASSWORD || 'Admin@1234',
      college_name: 'OPENLABS HQ',
      role: 'admin',
      totalPoints: 9999,
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create sample students
    const student1 = await User.create({
      username: 'h4cker_pro',
      email: 'hacker@example.com',
      password: 'Student@123',
      college_name: 'IIT Delhi',
      totalPoints: 850,
    });

    const student2 = await User.create({
      username: 'zero_day',
      email: 'zeroday@example.com',
      password: 'Student@123',
      college_name: 'NIT Trichy',
      totalPoints: 420,
    });

    // Create domains
    const createdDomains = await Domain.insertMany(DOMAINS);
    console.log(`🌍 ${createdDomains.length} domains seeded`);

    const domainMap = {};
    createdDomains.forEach((d) => (domainMap[d.slug] = d._id));

    // Create sample challenges
    const challenges = [
      // Web Security
      { title: 'SQL Injection Basics', description: 'Find the hidden flag by exploiting a SQL injection vulnerability in the login form.', difficulty: 'easy', points: 50, type: 'learn', domain_id: domainMap['web-security'], flag: 'CVF{sql_inj3ct10n_ftw}', hints: ['Try using a single quote', "Think about how SQL queries work", "' OR '1'='1 is a classic"], tags: ['sql', 'injection', 'web'] },
      { title: 'XSS Cookie Stealer', description: 'Craft an XSS payload to steal admin cookies from the vulnerable web app.', difficulty: 'medium', points: 150, type: 'practice', domain_id: domainMap['web-security'], flag: 'CVF{xss_c00k13_st34l3r}', hints: ['Look for reflected input', 'Try script tags', 'document.cookie is your friend'], tags: ['xss', 'javascript', 'web'] },
      { title: 'JWT Forgery', description: 'Forge a JWT token to escalate your privileges to admin.', difficulty: 'hard', points: 300, type: 'compete', domain_id: domainMap['web-security'], flag: 'CVF{jwt_4lg_n0n3_byp4ss}', hints: ['What algorithm does the token use?', 'Try changing the algorithm to none'], tags: ['jwt', 'auth', 'web'] },

      // Cryptography
      { title: 'Caesar Cipher Decoded', description: 'The flag is encrypted with a Caesar cipher. Find the shift and decrypt it.', difficulty: 'easy', points: 30, type: 'learn', domain_id: domainMap['cryptography'], flag: 'CVF{rot13_1s_4_cl4ss1c}', hints: ['ROT13 is a special case', 'Try all 26 shifts'], tags: ['caesar', 'cipher', 'crypto'] },
      { title: 'RSA Small Exponent', description: 'An RSA-encrypted message with e=3. Small exponent attack ahoy!', difficulty: 'hard', points: 350, type: 'compete', domain_id: domainMap['cryptography'], flag: 'CVF{sm4ll_3xp0n3nt_att4ck}', hints: ['What happens when m^e < n?', 'Try cube root attack'], tags: ['rsa', 'crypto', 'math'] },

      // OSINT
      { title: 'Find the CEO', description: 'Use OSINT techniques to find the CEO of a fictional company and their email.', difficulty: 'easy', points: 40, type: 'practice', domain_id: domainMap['osint'], flag: 'CVF{0s1nt_m4st3r_s1uth}', hints: ['Check LinkedIn', 'Whois lookup can help', 'Google dorking is powerful'], tags: ['osint', 'recon', 'google'] },

      // Forensics
      { title: 'Hidden in Plain Sight', description: 'A JPG image contains a hidden message. Use steganography tools to extract the flag.', difficulty: 'medium', points: 120, type: 'practice', domain_id: domainMap['forensics'], flag: 'CVF{st3g0_1n_th3_p1x3ls}', hints: ['Try steghide', 'Check LSB steganography', 'zsteg is another useful tool'], tags: ['steganography', 'forensics', 'image'] },

      // Binary Exploitation
      { title: 'Buffer Overflow 101', description: 'Exploit a classic stack buffer overflow to overwrite the return address.', difficulty: 'hard', points: 400, type: 'compete', domain_id: domainMap['binary-exploitation'], flag: 'CVF{buf3r_0v3rfl0w_pwn3d}', hints: ['Find the offset to EIP', 'cyclic pattern is your friend', 'pwntools makes this easier'], tags: ['pwn', 'bof', 'binary'] },
    ];

    const createdChallenges = await Challenge.insertMany(challenges);
    console.log(`🏴 ${createdChallenges.length} challenges seeded`);

    // Update domain challenge counts
    for (const domain of createdDomains) {
      const count = await Challenge.countDocuments({ domain_id: domain._id, isActive: true });
      await Domain.findByIdAndUpdate(domain._id, { total_challenges: count });
    }

    // Create learning modules
    const modules = [
      {
        domain_id: domainMap['web-security'],
        title: 'Introduction to Web Security',
        content_markdown: `# Web Security Fundamentals\n\n## What is Web Security?\n\nWeb security refers to the protective measures and protocols adopted to protect websites and web applications from threats...\n\n## The OWASP Top 10\n\n1. **Injection** - SQL, NoSQL, OS injection flaws\n2. **Broken Authentication** - Weak credential management\n3. **Sensitive Data Exposure** - Unencrypted PII\n\n## Lab: SQL Injection\n\n\`\`\`sql\nSELECT * FROM users WHERE username='admin' AND password='anything' OR '1'='1'\n\`\`\``,
        video_url: 'https://www.youtube.com/embed/rWHvp7rUka8',
        resources_links: [
          { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', type: 'article' },
          { title: 'PortSwigger Web Academy', url: 'https://portswigger.net/web-security', type: 'article' },
          { title: 'Burp Suite Community', url: 'https://portswigger.net/burp', type: 'tool' },
        ],
        order: 1,
        duration_minutes: 30,
      },
      {
        domain_id: domainMap['cryptography'],
        title: 'Classical Ciphers',
        content_markdown: `# Classical Cryptography\n\n## Caesar Cipher\n\nThe Caesar cipher shifts each letter by a fixed amount.\n\n\`\`\`python\ndef caesar_decrypt(cipher, shift):\n    result = ""\n    for c in cipher:\n        if c.isalpha():\n            result += chr((ord(c) - ord('A') - shift) % 26 + ord('A'))\n        else:\n            result += c\n    return result\n\`\`\`\n\n## Vigenère Cipher\n\nUses a keyword to apply multiple Caesar shifts...`,
        video_url: 'https://www.youtube.com/embed/sMOZf4GN3oc',
        resources_links: [
          { title: 'CryptoHack', url: 'https://cryptohack.org', type: 'article' },
          { title: 'dCode Tools', url: 'https://www.dcode.fr', type: 'tool' },
        ],
        order: 1,
        duration_minutes: 25,
      },
    ];

    await LearningModule.insertMany(modules);
    console.log(`📚 ${modules.length} learning modules seeded`);

    // Seed leaderboard
    const leaderboardEntries = [
      { user_id: admin._id, username: admin.username, college_name: admin.college_name, total_points: 9999, challenges_solved: 50, rank: 1 },
      { user_id: student1._id, username: student1.username, college_name: student1.college_name, total_points: 850, challenges_solved: 12, rank: 2 },
      { user_id: student2._id, username: student2.username, college_name: student2.college_name, total_points: 420, challenges_solved: 6, rank: 3 },
    ];

    await Leaderboard.insertMany(leaderboardEntries);
    console.log('🏆 Leaderboard seeded');

    console.log('\n✅ Seed completed successfully!');
    console.log('─────────────────────────────────');
    console.log(`Admin Email:    ${admin.email}`);
    console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@1234'}`);
    console.log(`Student Email:  hacker@example.com`);
    console.log(`Student Pass:   Student@123`);
    console.log('─────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
