require('dotenv').config();
const mongoose = require('mongoose');
const Domain = require('./models/Domain.model');
const Challenge = require('./models/Challenge.model');
const User = require('./models/User.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cyberverse';

const getPracticeQuestions = (domainMap, adminId) => [

  // ─── Web Security ─────────────────────────────────────────────────────────
  {
    title: 'IDOR — Access Another User\'s Data',
    description: `An endpoint lets you fetch your own profile:

\`\`\`
GET /api/user/profile?id=1042
\`\`\`

By simply changing the \`id\` parameter, you can view any other user's private data — no authorization check is performed.

**Your task:** Find the admin user's secret note hidden in their profile by accessing \`id=1\`.

The flag is inside the \`secret_note\` field of the admin profile.`,
    difficulty: 'medium',
    points: 150,
    type: 'practice',
    domain_id: domainMap['web-security'],
    flag: 'CV{id0r_4cc3ss_c0ntr0l_byp4ss}',
    hints: [
      { text: 'IDOR = Insecure Direct Object Reference. Change the id parameter to 1 (admin).', cost: 20 },
      { text: 'No token or role check is done server-side. Just modify the request.', cost: 35 },
    ],
    tags: ['idor', 'web', 'access-control', 'medium'],
    author: adminId,
    isActive: true,
  },

  // ─── Cryptography ─────────────────────────────────────────────────────────
  {
    title: 'Vigenère Cipher Crackdown',
    description: `You intercepted the following ciphertext encrypted with a Vigenère cipher:

\`\`\`
RIJVS UYVJN OFLJ KSRE ZKWSN
\`\`\`

The key is a common 4-letter English word. Frequency analysis reveals the key length is **4**.

Decrypt the message and extract the hidden flag. The plaintext, when decoded, reads: \`flag is: <answer>\`

Wrap it as \`CV{answer}\`.`,
    difficulty: 'medium',
    points: 150,
    type: 'practice',
    domain_id: domainMap['cryptography'],
    flag: 'CV{v1g3n3r3_k3y_cr4ck3d}',
    hints: [
      { text: 'Try common 4-letter keys: "key", "code", "flag", "hack", "cyber".', cost: 20 },
      { text: 'Use an online Vigenère decoder. The key is "hack".', cost: 40 },
    ],
    tags: ['vigenere', 'cipher', 'crypto', 'medium'],
    author: adminId,
    isActive: true,
  },

  // ─── Reverse Engineering ───────────────────────────────────────────────────
  {
    title: 'License Key Validator',
    description: `You're given a binary that validates license keys.

\`\`\`
chmod +x license_check
./license_check
Enter license key: ????
\`\`\`

The binary checks your input against a specific pattern:
- Length must be exactly **16 characters**
- Format: \`XXXX-XXXX-XXXX-XXXX\`
- Each segment is validated by a separate function

Reverse the validation logic and find the correct key. Submit it as \`CV{correct_key}\`.

**Hint:** Run \`strings license_check\` first — partial key segments may be visible.`,
    difficulty: 'medium',
    points: 150,
    type: 'practice',
    domain_id: domainMap['reverse-engineering'],
    flag: 'CV{R3V3-RSE0-THIS-K3Y!}',
    hints: [
      { text: 'Use `strings` or `ltrace` to observe comparisons at runtime.', cost: 20 },
      { text: 'Each 4-char segment is compared individually using strcmp. Patch or trace each call.', cost: 40 },
    ],
    tags: ['reverse-engineering', 'binary', 'license', 'medium'],
    author: adminId,
    isActive: true,
  },

  // ─── Forensics ────────────────────────────────────────────────────────────
  {
    title: 'Deleted But Not Gone',
    description: `A suspect deleted a critical text file from a USB drive, but forensic imaging captured the raw disk image before wiping.

**Your task:** Analyze the provided disk image and recover the deleted file.

\`\`\`
file usb.img
# DOS/MBR boot sector
\`\`\`

The deleted file was named \`secret.txt\` and contained the flag.

**Tools:** \`foremost\`, \`autopsy\`, \`testdisk\`, \`strings usb.img\``,
    difficulty: 'medium',
    points: 150,
    type: 'practice',
    domain_id: domainMap['forensics'],
    flag: 'CV{d3l3t3d_f1l3s_l3av3_tr4c3s}',
    hints: [
      { text: 'Run `strings usb.img | grep CV{` — deleted file content may still be in raw sectors.', cost: 20 },
      { text: 'Use `foremost -i usb.img -o recovered/` to carve deleted files.', cost: 35 },
    ],
    tags: ['forensics', 'disk-image', 'file-recovery', 'medium'],
    author: adminId,
    isActive: true,
  },

  // ─── Network Security ─────────────────────────────────────────────────────
  {
    title: 'FTP Credential Sniff',
    description: `You captured network traffic during a suspicious login session. The PCAP file contains an FTP authentication exchange sent in **cleartext**.

\`\`\`
File: capture.pcap
\`\`\`

**Your task:** Open the PCAP in Wireshark, find the FTP credentials, and use them to construct the flag.

Flag format: \`CV{username_password}\`

**Example:** If user is \`admin\` and password is \`letmein\`, flag = \`CV{admin_letmein}\``,
    difficulty: 'medium',
    points: 150,
    type: 'practice',
    domain_id: domainMap['network-security'],
    flag: 'CV{ftpuser_s3cr3tpass}',
    hints: [
      { text: 'In Wireshark, filter: `ftp` — look for USER and PASS commands.', cost: 20 },
      { text: 'FTP sends credentials in plaintext. The USER packet contains username, PASS packet contains password.', cost: 30 },
    ],
    tags: ['network', 'wireshark', 'pcap', 'ftp', 'medium'],
    author: adminId,
    isActive: true,
  },

  // ─── Binary Exploitation ───────────────────────────────────────────────────
  {
    title: 'Format String Leak',
    description: `A vulnerable C program uses \`printf\` without a format string:

\`\`\`c
char buf[64];
fgets(buf, sizeof(buf), stdin);
printf(buf);  // <-- vulnerable!
\`\`\`

The flag is stored as a local variable on the stack. Use a **format string attack** to leak the stack contents and extract the flag.

**Run the binary:**
\`\`\`
nc challenge.cyberverse.io 4444
\`\`\`

Send format specifiers like \`%p\` or \`%x\` to leak stack values. The flag is stored as a string somewhere in the first 20 stack words.`,
    difficulty: 'medium',
    points: 150,
    type: 'practice',
    domain_id: domainMap['binary-exploitation'],
    flag: 'CV{f0rm4t_str1ng_l34k3d}',
    hints: [
      { text: 'Send: `%p.%p.%p.%p.%p` — each `%p` leaks a pointer from the stack.', cost: 20 },
      { text: 'Use `%s` with an offset like `%7$s` to read a string at that stack position. Try offsets 6–15.', cost: 40 },
    ],
    tags: ['pwn', 'format-string', 'binary', 'medium'],
    author: adminId,
    isActive: true,
  },

  // ─── Web Security (2nd) ───────────────────────────────────────────────────
  {
    title: 'JWT Algorithm Confusion',
    description: `The web app uses JSON Web Tokens for authentication. The token you receive after login:

\`\`\`
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciJ9.<sig>
\`\`\`

The server accepts **both RS256 and HS256**. If you switch the algorithm to HS256 and sign with the server's **public key** as the HMAC secret, you can forge a token with \`"role": "admin"\`.

Forge an admin token and access \`/api/admin/flag\` to get the flag.`,
    difficulty: 'medium',
    points: 150,
    type: 'practice',
    domain_id: domainMap['web-security'],
    flag: 'CV{jwt_4lg0r1thm_c0nfus10n}',
    hints: [
      { text: 'Decode the JWT at jwt.io. Change "alg" from RS256 to HS256 and "role" to "admin".', cost: 20 },
      { text: 'The server\'s public key is exposed at /api/public-key. Use it as the HMAC secret when signing with HS256.', cost: 45 },
    ],
    tags: ['jwt', 'web', 'auth', 'algorithm-confusion', 'medium'],
    author: adminId,
    isActive: true,
  },

  // ─── Cryptography (2nd) ───────────────────────────────────────────────────
  {
    title: 'ECB Penguin Mode',
    description: `A service encrypts your data using **AES-ECB** mode and returns the ciphertext.

Because ECB encrypts each 16-byte block independently, identical plaintext blocks produce identical ciphertext blocks — leaking patterns.

**The server encrypts:** \`your_input + secret_flag\`

By carefully crafting your input block by block, you can recover the secret flag one byte at a time using a **byte-at-a-time ECB decryption attack**.

\`\`\`
nc challenge.cyberverse.io 5555
\`\`\``,
    difficulty: 'medium',
    points: 150,
    type: 'practice',
    domain_id: domainMap['cryptography'],
    flag: 'CV{3cb_m0d3_1s_uns4f3}',
    hints: [
      { text: 'Send 15 "A"s. The first block is now "AAAAAAAAAAAAAAA?" where ? is the first byte of the flag. Brute force that byte.', cost: 25 },
      { text: 'Repeat: send 14 "A"s for the second byte, 13 for the third, etc. This is the classic byte-at-a-time attack.', cost: 45 },
    ],
    tags: ['aes', 'ecb', 'crypto', 'block-cipher', 'medium'],
    author: adminId,
    isActive: true,
  },

];

async function addPracticeQuestions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) { console.error('❌ Admin user nahi mila.'); process.exit(1); }

    // Saare domains fetch karo
    const domains = await Domain.find({ isActive: true });
    const domainMap = {};
    domains.forEach(d => { domainMap[d.slug] = d._id; });

    const requiredDomains = ['web-security', 'cryptography', 'reverse-engineering', 'forensics', 'network-security', 'binary-exploitation'];
    for (const slug of requiredDomains) {
      if (!domainMap[slug]) {
        console.error(`❌ Domain nahi mila: ${slug}. Pehle seed.js run karo.`);
        process.exit(1);
      }
    }
    console.log('✅ Saare domains mil gaye');

    const questions = getPracticeQuestions(domainMap, admin._id);
    let added = 0;
    let skipped = 0;

    for (const q of questions) {
      const exists = await Challenge.findOne({ title: q.title });
      if (exists) {
        console.log(`⚠️  Already exists, skip: "${q.title}"`);
        skipped++;
        continue;
      }
      await Challenge.create(q);
      console.log(`✅ Added: "${q.title}" [${q.domain_id}]`);
      added++;
    }

    console.log('\n─────────────────────────────');
    console.log(`🎉 Done! ${added} questions added, ${skipped} skipped (already existed)`);
    console.log('─────────────────────────────\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addPracticeQuestions();
