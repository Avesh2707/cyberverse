require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User.model');
const Domain = require('../models/Domain.model');
const Challenge = require('../models/Challenge.model');
const LearningModule = require('../models/LearningModule.model');
const Leaderboard = require('../models/Leaderboard.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/OPENLABS';

const domains = [
  { name: 'Web Security', slug: 'web-security', description: 'Learn to find and exploit web vulnerabilities like XSS, SQLi, CSRF, and more.', difficulty_level: 'beginner', icon: '🌐', color: '#00bcd4', order: 1 },
  { name: 'Network Security', slug: 'network-security', description: 'Understand network protocols, packet analysis, and network-based attacks.', difficulty_level: 'intermediate', icon: '🔌', color: '#4caf50', order: 2 },
  { name: 'Cryptography', slug: 'cryptography', description: 'Break ciphers and understand modern encryption algorithms.', difficulty_level: 'intermediate', icon: '🔐', color: '#9c27b0', order: 3 },
  { name: 'Reverse Engineering', slug: 'reverse-engineering', description: 'Disassemble and analyze binaries to understand how they work.', difficulty_level: 'advanced', icon: '⚙️', color: '#ff5722', order: 4 },
  { name: 'Forensics', slug: 'forensics', description: 'Investigate digital evidence, analyze file systems and recover hidden data.', difficulty_level: 'intermediate', icon: '🔍', color: '#607d8b', order: 5 },
  { name: 'OSINT', slug: 'osint', description: 'Use open-source intelligence techniques to gather information.', difficulty_level: 'beginner', icon: '📡', color: '#03a9f4', order: 6 },
  { name: 'Malware Analysis', slug: 'malware-analysis', description: 'Analyze malicious software to understand how it operates and how to stop it.', difficulty_level: 'advanced', icon: '🦠', color: '#f44336', order: 7 },
  { name: 'Cloud Security', slug: 'cloud-security', description: 'Secure and attack cloud environments including AWS, Azure, and GCP.', difficulty_level: 'advanced', icon: '☁️', color: '#2196f3', order: 8 },
  { name: 'Binary Exploitation', slug: 'binary-exploitation', description: 'Exploit buffer overflows, format strings, and other binary vulnerabilities.', difficulty_level: 'advanced', icon: '💣', color: '#795548', order: 9 },
];

const getChallenges = (domainMap) => [
  // Web Security
  { title: 'SQL Injection 101', description: 'Exploit a classic SQL injection vulnerability to bypass authentication.', difficulty: 'easy', points: 50, type: 'learn', domain_id: domainMap['web-security'], flag: 'CV{sql_injection_b4sics}', hints: [{ text: "Try entering ' OR '1'='1 in the login form", cost: 10 }], tags: ['sqli', 'web', 'beginner'] },
  { title: 'XSS Reflected Attack', description: 'Find and exploit a reflected XSS vulnerability on the target web app.', difficulty: 'easy', points: 75, type: 'practice', domain_id: domainMap['web-security'], flag: 'CV{xss_r3fl3ct3d_pwn}', hints: [{ text: 'Check the search parameter in the URL', cost: 15 }], tags: ['xss', 'web'] },
  { title: 'CSRF Token Bypass', description: 'Bypass CSRF protection and force an authenticated user to perform actions.', difficulty: 'medium', points: 150, type: 'compete', domain_id: domainMap['web-security'], flag: 'CV{csrf_byp4ss_m4st3r}', tags: ['csrf', 'web', 'intermediate'] },
  // Network Security
  { title: 'Wireshark Basics', description: 'Analyze a PCAP file and extract credentials sent in cleartext.', difficulty: 'easy', points: 60, type: 'learn', domain_id: domainMap['network-security'], flag: 'CV{pcap_4nalysis_1s_fun}', hints: [{ text: 'Filter for HTTP POST requests', cost: 10 }], tags: ['pcap', 'network', 'wireshark'] },
  { title: 'Port Scanning Masterclass', description: 'Identify open ports and running services on the target machine.', difficulty: 'easy', points: 50, type: 'practice', domain_id: domainMap['network-security'], flag: 'CV{nmap_sc4nn3r_pro}', tags: ['nmap', 'network'] },
  { title: 'DNS Exfiltration', description: 'Detect and reconstruct data exfiltrated through DNS queries.', difficulty: 'hard', points: 300, type: 'compete', domain_id: domainMap['network-security'], flag: 'CV{dns_3xf1ltr4t10n_d3t3ct3d}', tags: ['dns', 'network', 'forensics'] },
  // Cryptography
  { title: 'Caesar Cipher Cracker', description: 'Decrypt a message encoded with a Caesar cipher.', difficulty: 'easy', points: 40, type: 'learn', domain_id: domainMap['cryptography'], flag: 'CV{c4es4r_w4s_h3r3}', tags: ['cipher', 'classic', 'crypto'] },
  { title: 'RSA Weak Keys', description: 'Factor a small RSA modulus and decrypt the ciphertext.', difficulty: 'medium', points: 200, type: 'compete', domain_id: domainMap['cryptography'], flag: 'CV{rs4_f4ct0r3d_3z}', tags: ['rsa', 'crypto', 'math'] },
  // Forensics
  { title: 'Hidden in Plain Sight', description: 'Extract a hidden message from an image using steganography techniques.', difficulty: 'easy', points: 75, type: 'practice', domain_id: domainMap['forensics'], flag: 'CV{st3g4n0gr4phy_fun}', hints: [{ text: 'Try using steghide or binwalk', cost: 20 }], tags: ['steganography', 'forensics', 'image'] },
  { title: 'Memory Dump Analysis', description: 'Analyze a memory dump to find malicious processes and extract artifacts.', difficulty: 'hard', points: 350, type: 'compete', domain_id: domainMap['forensics'], flag: 'CV{v0l4t1l1ty_m4st3r}', tags: ['memory', 'volatility', 'forensics'] },
  // Binary Exploitation
  { title: 'Stack Buffer Overflow', description: 'Exploit a classic stack buffer overflow to overwrite the return address.', difficulty: 'hard', points: 400, type: 'compete', domain_id: domainMap['binary-exploitation'], flag: 'CV{buff3r_0v3rfl0w_pwnd}', hints: [{ text: 'Find the offset using pattern_create', cost: 50 }], tags: ['pwn', 'bof', 'x86'] },
];

const getModules = (domainMap) => [
  {
    domain_id: domainMap['web-security'],
    title: 'Introduction to Web Security',
    content_markdown: `# Introduction to Web Security\n\nWeb security is the practice of protecting websites and online services from security threats.\n\n## The OWASP Top 10\n\nThe Open Web Application Security Project (OWASP) maintains a list of the top 10 most critical web application security risks:\n\n1. **Injection** - SQL, OS, LDAP injection\n2. **Broken Authentication** - Weak credentials, session management\n3. **Sensitive Data Exposure** - Unencrypted data in transit/rest\n4. **XML External Entities (XXE)**\n5. **Broken Access Control**\n6. **Security Misconfiguration**\n7. **Cross-Site Scripting (XSS)**\n8. **Insecure Deserialization**\n9. **Using Components with Known Vulnerabilities**\n10. **Insufficient Logging & Monitoring**\n\n## Your First Challenge\n\nHead to the practice section and try the SQL Injection 101 challenge!`,
    video_url: 'https://www.youtube.com/embed/rWHvp7rUka8',
    resources_links: [
      { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', type: 'article' },
      { title: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security', type: 'article' },
      { title: 'HackTheBox Academy', url: 'https://academy.hackthebox.com', type: 'article' },
    ],
    order: 1,
    estimated_time: 45,
  },
  {
    domain_id: domainMap['cryptography'],
    title: 'Classical Ciphers',
    content_markdown: `# Classical Ciphers\n\nBefore modern computers, cryptographers used clever letter-substitution schemes.\n\n## Caesar Cipher\n\nOne of the earliest encryption techniques — Julius Caesar used it to protect military messages.\n\n\`\`\`\nPlaintext:  HELLO WORLD\nKey:        3\nCiphertext: KHOOR ZRUOG\n\`\`\`\n\nEach letter is shifted by the key value. Decryption shifts back.\n\n## Vigenère Cipher\n\nA polyalphabetic cipher using a repeating keyword to vary the shift.\n\n## Frequency Analysis\n\nIn English, certain letters appear far more frequently (E, T, A, O). This weakness allows us to crack classical ciphers by analyzing letter frequencies.`,
    video_url: '',
    resources_links: [
      { title: 'CryptoHack', url: 'https://cryptohack.org', type: 'article' },
      { title: 'Khan Academy Cryptography', url: 'https://www.khanacademy.org/computing/computer-science/cryptography', type: 'video' },
    ],
    order: 1,
    estimated_time: 30,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Domain.deleteMany({}),
      Challenge.deleteMany({}),
      LearningModule.deleteMany({}),
      Leaderboard.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create domains
    const createdDomains = await Domain.insertMany(domains);
    const domainMap = {};
    createdDomains.forEach((d) => { domainMap[d.slug] = d._id; });
    console.log(`✅ Created ${createdDomains.length} domains`);

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@OPENLABS.io',
      password: 'Admin@12345',
      college_name: 'OPENLABS Academy',
      role: 'admin',
      totalPoints: 9999,
    });

    // Create sample student
    const student = await User.create({
      username: 'h4x0r_student',
      email: 'student@example.com',
      password: 'Student@123',
      college_name: 'MIT',
      totalPoints: 275,
    });

    console.log('✅ Created users (admin + student)');

    // Create challenges
    const challengeData = getChallenges(domainMap);
    await Challenge.insertMany(challengeData.map(c => ({ ...c, author: adminUser._id })));
    console.log(`✅ Created ${challengeData.length} challenges`);

    // Create learning modules
    const moduleData = getModules(domainMap);
    await LearningModule.insertMany(moduleData);
    console.log(`✅ Created ${moduleData.length} learning modules`);

    // Create leaderboard entries
    await Leaderboard.insertMany([
      { user_id: adminUser._id, username: 'admin', college_name: 'OPENLABS Academy', total_points: 9999, rank: 1, challenges_solved: 50 },
      { user_id: student._id, username: 'h4x0r_student', college_name: 'MIT', total_points: 275, rank: 2, challenges_solved: 4 },
    ]);
    console.log('✅ Created leaderboard entries');

    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────');
    console.log('Admin credentials:');
    console.log('  Email:    admin@OPENLABS.io');
    console.log('  Password: Admin@12345');
    console.log('Student credentials:');
    console.log('  Email:    student@example.com');
    console.log('  Password: Student@123');
    console.log('─────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
