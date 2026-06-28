export interface SafetyProtocol {
  id: string;
  category: 'Identity' | 'Banking' | 'Housing' | 'Medical' | 'Communication' | 'Dead Drops';
  title: string;
  description: string;
  protocol: string;
  eraNote: string;
  tags?: string[];
}

export const safetyProtocols: SafetyProtocol[] = [
  // ── IDENTITY ──────────────────────────────────────────────
  {
    id: 'id-paper-forgery',
    category: 'Identity',
    title: 'Paper Identity Documents',
    description: '1970s driver\'s licenses and Social Security cards are paper-based with minimal security features. This is a window of opportunity.',
    protocol: '1. Obtain a real birth certificate for a deceased infant (newspaper obituaries, county records). 2. Use it to apply for a real SSN at a Social Security office — the system is trust-based in the 70s. 3. Use the SSN + birth certificate to get a driver\'s license at a DMV in a different county from the birth record. 4. Build from there: library card, bank account, rental agreement — each legitimizes the next.',
    eraNote: 'SSN misuse was not a federal crime until the 1980s. In 1975, applying with a fake birth certificate is risky but legally ambiguous. By 1986 (Immigration Reform Act), this becomes much harder.'
  },
  {
    id: 'id-backstory',
    category: 'Identity',
    title: 'Cover Story Construction',
    description: 'Your backstory must be verifiable AND unremarkable. Nobody investigates the unremarkable.',
    protocol: '1. Choose a medium-sized city you actually know well. 2. Claim you moved for work — "I\'m a welder / secretary / salesman." 3. Your past is boring: "Grew up in Ohio, parents passed, no siblings, wanted a fresh start." 4. Never claim military service (verifiable). Never claim prestigious education (verifiable). Never claim connections to famous people. 5. The goal is to be forgettable.',
    eraNote: 'Pre-internet, background checks mean calling references on a phone. Give them the number of a confederate, or a dead-drop answering service.'
  },

  // ── BANKING ───────────────────────────────────────────────
  {
    id: 'banking-cash',
    category: 'Banking',
    title: 'Cash-Based Existence',
    description: 'In the 1970s, cash is normal. Many people don\'t have bank accounts. Operating in cash is not suspicious.',
    protocol: '1. Keep cash in a safety deposit box, not under the mattress. 2. Rent a box at a bank using your new ID — costs ~$10/year in 1975. 3. Never deposit more than $10,000 in cash at once (Bank Secrecy Act, 1970 — triggers a Currency Transaction Report). 4. Use money orders for rent and large bills — they\'re anonymous. 5. Build a bank account slowly: deposit $500, wait a month, deposit another $500.',
    eraNote: 'CTR threshold ($10,000) was set in 1970. Structuring (splitting deposits to avoid CTRs) became illegal in 1986. In 1975, you can deposit $5,000 at three different banks and nobody connects the dots.'
  },
  {
    id: 'banking-investing',
    category: 'Banking',
    title: 'Converting Foreknowledge to Wealth (Quietly)',
    description: 'Making money is easy with a sports almanac. Keeping it without attracting attention is the hard part.',
    protocol: '1. Never win the same bet twice at the same bookie. 2. Spread winnings across multiple cities. 3. "Lose" occasionally — a perfect record attracts attention. 4. Convert gambling winnings into legitimate investments: buy real estate, blue-chip stocks, or a small business. 5. Pay taxes on everything — the IRS got Al Capone, they\'ll get you too. 6. Your cover story for wealth: "I bought some land from a farmer in 1975 and sold it to a developer in 1980." Real estate speculation is the most plausible wealth origin story of the era.',
    eraNote: 'The IRS computerized in the 1960s but cross-referencing is primitive. Still — file your taxes. It\'s the one paper trail you WANT to exist.'
  },

  // ── HOUSING ───────────────────────────────────────────────
  {
    id: 'housing-rental',
    category: 'Housing',
    title: 'Finding Housing Without History',
    description: 'Pre-credit-check era means housing is easier to obtain than in modern times — if you know the rules.',
    protocol: '1. Look for "For Rent" signs in neighborhood windows — these are owner-managed, no corporate screening. 2. Offer to pay 2-3 months in advance in cash. This bypasses the "no references" problem. 3. Claim you just moved to town for a job at a local factory or store. 4. If they ask for a previous landlord, give a dead-drop number (a payphone you monitor, or a confederate). 5. Weekly-rate motels and boarding houses are normal in the 70s and ask zero questions.',
    eraNote: 'Corporate landlords with formal screening processes exist by the late 80s. In 1975, most rentals are still mom-and-pop operations.'
  },

  // ── MEDICAL ───────────────────────────────────────────────
  {
    id: 'medical-vaccines',
    category: 'Medical',
    title: 'Vaccination & Biological Risk',
    description: 'You carry antibodies to diseases that don\'t exist yet. This makes you neither a vector nor vulnerable — but take precautions.',
    protocol: '1. Get era-appropriate vaccines upon arrival: smallpox (still given until 1972), polio, tetanus, diphtheria, measles, mumps, rubella. 2. Do NOT volunteer blood — your blood contains antibodies to HIV (if you\'re vaccinated or exposed), Hepatitis C, HPV, and possibly COVID-19. A curious lab tech could derail everything. 3. If you need medical care, claim you were "home-schooled and never vaccinated" to explain gaps, or "I had all the standard ones as a kid" to explain immunity.',
    eraNote: 'Blood screening for HIV begins in 1985. Before that, donated blood is not tested. Your modern blood in a 1978 blood bank could cause a temporal paradox — or, worse, get you investigated.'
  },
  {
    id: 'medical-meds',
    category: 'Medical',
    title: 'Medication & Treatment Awareness',
    description: 'Many modern medications don\'t exist yet. Know what you can and can\'t access.',
    protocol: '1. Bring a supply of any essential medications. 2. Know the era-appropriate alternatives: no ibuprofen (OTC in US: 1984), use aspirin. No acetaminophen widely available until the 80s — use aspirin or nothing. 3. No SSRIs (Prozac: 1987). Mental health treatment is primitive — avoid needing it. 4. Appendicitis is still treated with open surgery (laparoscopic appendectomy: 1980s). Recovery is weeks, not days.',
    eraNote: 'Antibiotics exist (penicillin, tetracycline, erythromycin) but antibiotic resistance is much lower. A simple infection that\'s drug-resistant in 2025 is easily treatable in 1975.'
  },

  // ── DEAD DROPS ────────────────────────────────────────────
  {
    id: 'dd-classifieds',
    category: 'Dead Drops',
    title: 'Newspaper Classified Ads',
    description: 'The most reliable dead-drop method of the era. Millions of people read classifieds daily. Coded messages are invisible among the noise.',
    protocol: '1. Pre-arrange a cipher with your future/past self (one-time pad is ideal, but a simple book cipher works). 2. Place a classified ad in a major newspaper\'s "Personals" section. Example: "J.C. — Package arrived safely. Meet at the usual place. — M." This means nothing to anyone except the intended recipient. 3. Run the ad for 3 consecutive days to ensure visibility. 4. The recipient checks the specific newspaper on pre-arranged dates.',
    eraNote: 'Major papers: NYT, Washington Post, Chicago Tribune, LA Times, SF Chronicle. For international: The Times (London), Le Monde (Paris). Classifieds cost ~$5-20 per day in 1970s dollars.'
  },
  {
    id: 'dd-safety-deposit',
    category: 'Dead Drops',
    title: 'Safety Deposit Boxes',
    description: 'Open a box in one year, retrieve the contents in another. The longest-duration dead drop that requires no maintenance.',
    protocol: '1. Open a safety deposit box at a bank using an identity you\'ll still have access to later. 2. Pre-pay the rental fee for 10-20 years (banks allow this). 3. Store documents, cash, keys, or microfilm. 4. Name a "co-renter" who is a younger version of yourself or a trusted confederate. 5. The box now exists in a vault, untouched, waiting for retrieval.',
    eraNote: 'Bank mergers and closures happen. Choose a major bank (Chase, Bank of America, Citibank) with national presence. Avoid small regional banks that might not exist in 10 years.'
  },
  {
    id: 'dd-library',
    category: 'Dead Drops',
    title: 'Library Book Annotations',
    description: 'Marginalia in specific editions at specific libraries. Low-tech, durable, and accessible without ID.',
    protocol: '1. Choose a major public library (NYC Main Branch, Boston Public, SF Main). 2. Select a specific book — ideally a reference book that won\'t be weeded (encyclopedia volume, almanac, dictionary). 3. Write your message in the margins or underline specific letters to form a ciphertext. 4. The recipient visits the library, finds the book, and reads the message. 5. For a reply: the recipient writes in a DIFFERENT agreed-upon book.',
    eraNote: 'Library weeding (removing old books) is a risk. Choose books published in the year of your drop — they\'re least likely to be weeded. Academic library collections are more stable than public libraries.'
  },
  {
    id: 'dd-physical',
    category: 'Dead Drops',
    title: 'Physical Dead Drops (Geocaching, 1970s Style)',
    description: 'Bury or hide a waterproof container at pre-arranged GPS coordinates — except you don\'t have GPS. You need detailed physical descriptions.',
    protocol: '1. Choose a location that won\'t be developed: a national park, a rural cemetery, under a specific bridge abutment. 2. Describe the location in terms of permanent landmarks: "50 paces north of the large oak tree at the SW corner of Oak Grove Cemetery, 2 feet down." 3. Use an ammo can or PVC pipe with threaded caps — waterproof and durable for decades. 4. Include silica gel packets for moisture. 5. Bury below the frost line (if in a cold climate) and mark with something permanent.',
    eraNote: 'Avoid locations that might become Superfund sites, shopping malls, or highway expansions. Research planned developments before burying.'
  },
  {
    id: 'dd-cipher',
    category: 'Dead Drops',
    title: 'Book Cipher for Temporal Communication',
    description: 'You need a cipher that works with era-appropriate tools (no computers for the 1970s version of you).',
    protocol: '1. Agree on a specific edition of a specific book (e.g., "1972 Bantam paperback of Dune, 3rd printing"). 2. The cipher: three numbers per word — (page, line, word). "152-12-4 = page 152, line 12, word 4." 3. Both parties need the EXACT same edition. 4. Test the cipher with a known-plaintext message before relying on it. 5. Carry the book — it\'s your "reading material," not a spy tool.',
    eraNote: 'One-time pads are more secure but require both parties to have the same random key. A book cipher is less secure but MUCH more practical for a traveler with limited resources.'
  },
  // ── 1990s & early 2000s EXPANSIONS ────────────────────────
  {
    id: 'analog-cell-cloning',
    category: 'Communication',
    title: 'Analog Cellphone Sniffing & Cloning',
    description: '1990s cellphones (AMPS analog standard) transmit electronic serial numbers (ESN) and mobile identification numbers (MIN) in the clear. Criminals intercept and clone them.',
    protocol: '1. Never discuss time travel or futuristic stock tips over 1990s analog cellphones. Scanner enthusiasts and corporate spies easily intercept calls. 2. To avoid your phone number being cloned, use early digital networks (CDMA/GSM) when they become available mid-90s. 3. Regularly check your monthly bill for unauthorized long-distance charges.',
    eraNote: 'Analog AMPS was highly vulnerable. Scanners that could listen to cell calls were legal to sell until 1994, and modified scanners remained common throughout the 90s.'
  },
  {
    id: 'pager-codes',
    category: 'Communication',
    title: 'Pager / Beeper Numeric Cryptography',
    description: 'Pagers are the default mobile communication tool in the 90s. Messages are often public and unencrypted.',
    protocol: '1. Use numeric codes for basic updates (e.g., "07734" spells "hello" upside down; "143" means "I love you"). 2. For operational directions, map numbers to agreed street grid quadrants or meeting locations. 3. Never send a pager message containing clear dates, times, or money values. If intercepted, it creates an audit trail.',
    eraNote: 'Alphanumeric pagers emerge mid-90s, but numeric beepers remain cheap and dominant. Pager interception systems are cheap for law enforcement and high-tech thieves.'
  },
  {
    id: 'flexibility-protocol',
    category: 'Identity',
    title: 'Flexibility Protocol — When History Doesn\'t Match the Records',
    description: 'The further back you travel, the more likely the historical record is incomplete, distorted, or simply wrong. Written accounts are often propaganda, survivor bias, or later reconstruction. You need a playbook for when things are different from what you expect.',
    protocol: `1. ARRIVAL CALIBRATION: Within the first hour, determine the current date and cross-reference at least 3 independent sources (newspaper date, radio broadcast, a stranger's casual mention of a recent event). Never trust a single source.
2. DEVIATION DETECTION: Compare immediately against your almanac. Is the president who you expect? Is the weather matching records? Is a major event you expected to happen last week being discussed or not?
3. SILENT OBSERVATION MODE: If deviations exceed 20% (multiple facts dont match), enter observation mode for 24-48 hours. Do not intervene. Gather intelligence. The timeline may have already diverged.
4. RE-CENTERING: If the timeline IS different, your almanac is now partially obsolete. Prioritize: (a) survival and identity establishment, (b) understanding the new timeline's rules, (c) re-evaluating which interventions are still possible.
5. ALMANAC DEGRADATION RULES: Events >5 years in the future from your arrival date have a compounding uncertainty. Treat sports scores beyond 3 years as speculative. Financial predictions beyond 1 year are directional at best.`,
    eraNote: 'Historical records for pre-1900 events are often reconstructions from oral tradition, biased chroniclers, or archaeological inference. For pre-1500 travel, expect significant divergence between "recorded history" and actual events.',
    tags: ['flexibility', 'uncertainty', 'deviation', 'observation', 'calibration', 'almanac-degradation']
  },
  {
    id: 'early-web-scams',
    category: 'Communication',
    title: 'Early Internet Security & Email Scams',
    description: 'The 1990s internet has minimal security. Plaintext email, no HTTPS by default, and trust-based chatrooms create exposure vectors.',
    protocol: '1. Secure all communications with early PGP (Pretty Good Privacy) encryption. 2. Never input future-based credentials on HTTP web forms. 3. Ignore early email scams (Nigerian Prince letters emerge on AOL in the late 90s). 4. Use multiple anonymous screen names to split your digital identity.',
    eraNote: 'SSL/TLS encryption emerges in 1995 with Netscape, but is rare outside checkout pages. Most email and web traffic is fully visible to ISP administrators.'
  },

  // ── DIGITAL / COMMUNICATION (continued) ────────────────────
  {
    id: 'pgp-public-key-1991',
    category: 'Communication',
    title: 'PGP & Public Key Cryptography',
    description: 'Philip Zimmermann releases Pretty Good Privacy (PGP) v1.0 in June 1991. By mid-90s, RSA keys offer real confidentiality for email — and the US government opens a criminal investigation for "munitions export without a license."',
    protocol: '1. By 1993-94, generate a 1024-bit RSA keypair on an air-gapped DOS or Linux machine. 2. Print your public key as a paper backup; memorize the passphrase (Diceware-style). 3. Publish your public key on a keyserver (pgp.mit.edu from 1995). 4. Sign and encrypt ALL sensitive email — assume the SMTP backbone is monitored. 5. Verify keys via fingerprint over a separate channel (phone, in person). 6. After 1996, treat 512-bit keys as broken; rotate to 2048+.',
    eraNote: 'Pre-1996 ITAR rules classify strong crypto as a munition. Exporting PGP from the US is technically a felony until Clinton\'s 1996 executive order. Print the source code in books (legally protected speech) as a workaround.',
    tags: ['encryption', 'pgp', 'cryptography', 'email', 'privacy', 'munitions']
  },
  {
    id: 'computer-security-1990s',
    category: 'Communication',
    title: 'Pre-Firewall Computer Hygiene',
    description: 'Internet-connected hosts in the early 90s are wide open. Default installs of Windows, Mac, and Linux ship with telnet, FTP, and unpatched services. Firewalls are rare until 1994-95.',
    protocol: '1. Disable telnet/rsh/rexec — use SSH (released 1995) as soon as it is available. 2. Patch weekly; most exploits are 0-days for months before CVE numbering begins (1999). 3. Run packet filtering on the host (ipfw on BSD, ipchains on Linux 2.0+). 4. Never store passwords in plaintext — use crypt() or MD5 hashes. 5. Treat every floppy as infected — boot-sector viruses (Stoned, Michelangelo) are rampant. 6. Physical access = root access. Lock the chassis.',
    eraNote: 'The Morris Worm (Nov 1988) is the wakeup call, but the average desktop has no antivirus until McAfee and Norton spread in the early 90s. CIH/Chernobyl (1998) destroys BIOSes on Win9x — keep bootable DOS floppies handy.',
    tags: ['computers', 'security', 'firewall', 'ssh', 'antivirus', 'patching']
  },
  {
    id: 'ham-radio-basics',
    category: 'Communication',
    title: 'Ham Radio — The Only Decentralized Network',
    description: 'Amateur ("ham") radio works when phones, internet, and the power grid all fail. It spans the globe on shortwave with zero infrastructure. A US Technician-class license requires a simple written test (Morse code required until 2000).',
    protocol: '1. Get licensed: written exams (Novice/Tech/General/Extra) administered by Volunteer Examiners at any ham radio club. Morse code (5-20 WPM) required for General+ until 2000; dropped after. 2. Equipment by era: 1970s — used Heathkit, Swan, or Yaesu FT-101 HF rigs ($300-500). 1980s — Icom IC-730, Kenwood TS-440. 1990s — Yaesu FT-1000MP, Icom IC-756. 3. Practice antenna theory — a good dipole beats a bad amplifier. 4. Know HF band plans (40m/20m by day, 80m/160m by night). 5. Modes: voice (SSB), CW (Morse), RTTY, then PSK31 (1997) for digital.',
    eraNote: 'The FCC dropped the Morse code requirement entirely in February 2000 (Tech/General) and April 2000 (Extra). Getting licensed before this is a meaningful time investment.',
    tags: ['ham-radio', 'amateur-radio', 'emergency', 'shortwave', 'fcc', 'antenna']
  },
  {
    id: 'phone-phreaking-era',
    category: 'Communication',
    title: 'Phone Phreaking & Blue Box Era Notes',
    description: 'From the 1950s to mid-80s, the Bell System\'s in-band signaling (2600 Hz MF tones) lets anyone with a "blue box" route free long-distance calls. By the 90s, common-channel signaling (SS7) makes blue boxes obsolete — but the culture persists.',
    protocol: '1. AS A TIME TRAVELER: do not rely on phreaking. The 1971 Esquire article "Secrets of the Little Blue Box" draws massive law-enforcement attention. By 1975, AT&T has signal detectors on most trunks. 2. For ANONYMOUS calls in the 1970s: payphones are ubiquitous and accept coins. 3. In the 1980s: caller ID does not exist widely until 1990. *67 per-line blocking appears in 1992. 4. In the 1990s: avoid calling cards — calling-card fraud detection is aggressive. 5. Know that "2600: The Hacker Quarterly" magazine (founded 1984) is monitored by the Secret Service.',
    eraNote: 'Blue boxes become federally illegal to own or ship in 1976 (FCC). Captain Crunch (John Draper) is raided in 1972 and 1976. Wozniak and Jobs sold blue boxes pre-Apple (1971-72) — Steve\'s one felony.',
    tags: ['phreaking', 'blue-box', 'att', 'payphone', 'caller-id', 'hacker']
  },
  {
    id: 'map-navigation-pre-gps',
    category: 'Communication',
    title: 'Map & Compass Navigation (Pre-GPS)',
    description: 'GPS is military-only until the 1983 KAL 007 shootdown prompts Reagan to make it partially civilian. Selective Availability degrades civilian GPS accuracy until May 2000. For most of the era, navigation is map, compass, and dead reckoning.',
    protocol: '1. Carry a quality baseplate compass (Silva Ranger, Suunto MC-2). 2. Buy USGS topo quads (7.5-minute series) for any area you operate in — $2-4 each at outdoor stores. 3. Learn to shoot a bearing and account for declination (changes by region and year — printed on the map). 4. Triangulate position from two landmarks with a 60-90° angle between them. 5. Pace-count (steps per 100m) for distance in featureless terrain. 6. Hand-draw sketch maps for any dead-drop or cache site — do not photograph it (photo development is logged).',
    eraNote: 'Topographic map declination changes ~1° every 5-15 years depending on location. Use the declination printed ON the map for that map\'s vintage, not a modern value.',
    tags: ['navigation', 'map', 'compass', 'orienteering', 'usgs', 'dead-reckoning']
  },
  {
    id: 'celestial-navigation-basics',
    category: 'Communication',
    title: 'Celestial Navigation Fundamentals',
    description: 'For ocean crossings or wilderness travel, the night sky is a reliable clock and compass. Polaris gives latitude directly in the Northern Hemisphere; a sextant plus a nautical almanac gives longitude.',
    protocol: '1. Polaris is within ~1° of true north. Latitude = altitude of Polaris (corrected for the small offset). 2. For longitude: measure local solar noon vs GMT (a chronometer). 1 hour = 15° of longitude. 3. Buy a Davis Mark 3 plastic sextant ($100, post-1960s) or a used Astra IIIB. 4. Carry the Nautical Almanac for the exact year — solar and lunar tables change annually. 5. Pre-1990, GPS is unavailable; this is the only backup to LORAN-C (marine, 1958-2010).',
    eraNote: 'LORAN-C covers coastal US, Europe, and Japan. Inland or mid-ocean, celestial is the gold standard until selective-availability GPS in the 90s.',
    tags: ['celestial', 'sextant', 'polaris', 'longitude', 'loran', 'astronomy']
  },
  {
    id: 'public-transit-mastery',
    category: 'Communication',
    title: 'Public Transit Systems By City',
    description: 'Cars leave paper trails: registration, license plate, insurance, toll records. Public transit — especially cash-paid subway and bus — is one of the most anonymous ways to move in any era.',
    protocol: '1. NYC: token system until May 2003 (MetroCard from 1993). Tokens can be bought with cash at booths, exchanged person-to-person. 2. London: paper Travelcards until the Oyster smartcard (2003). 3. Tokyo: magnetic-card tickets until Suica (2001). 4. Pay with CASH. Stored-value cards (post-2000) leave transaction logs. 5. Vary your route — never take the same train at the same time daily. 6. Avoid monthly passes — they require name and address. 7. Pre-1990s, transit police are minimal; turnstile-jumping is low-risk in many systems.',
    eraNote: 'Tokens and coins are truly anonymous. The shift to magstripe (1990s) and contactless smart cards (2000s+) creates a permanent movement database.',
    tags: ['transit', 'subway', 'anonymous-travel', 'tokens', 'nyc', 'london', 'tokyo']
  },
  {
    id: 'emergency-contact-protocol',
    category: 'Communication',
    title: 'Emergency Contact & Dead-Man Protocols',
    description: 'A scheduled check-in with a designated contact is your canary. Missing a check-in by more than X hours triggers a contingency script — even if you cannot explain your situation to a 1970s police officer.',
    protocol: '1. Set up a "no-show" protocol with a confederate: "Call me at 9pm every Sunday. If I miss 2 in a row, execute Plan B." 2. Use a "duress word" — if you mention the word "LAVENDER" in any call, the confederate knows you are under duress and acts accordingly. 3. Hide a sealed "in case of my disappearance" envelope with a notary or lawyer — instructions, passwords (post-90s), emergency cash. 4. Rotate payphones and numbers you call from. 5. Pre-arrange dates: "If you don\'t hear from me by [anniversary], the safety-deposit box at [bank] has everything you need."',
    eraNote: 'Pre-cellphone, scheduled calls happen from payphones at known times — variation is the giveaway. A "duress protocol" is a real-world espionage tradecraft tactic.',
    tags: ['emergency', 'duress', 'check-in', 'contingency', 'tradecraft', 'no-show']
  },

  // ── MEDICAL (continued) ────────────────────────────────────
  {
    id: 'medical-emergency-kit',
    category: 'Medical',
    title: 'Era-Appropriate Emergency Medical Kit',
    description: 'Modern trauma kits (CAT tourniquets, hemostatic gauze, naloxone) are not yet standard. Build your own from era-available components.',
    protocol: '1. BLOOD STOPPAGE: cotton gauze plus pressure. CAT tourniquets do not exist commercially until the 1990s — improvise with a cravat and stick (windlass). 2. WOUND CLOSURE: butterfly bandages (Band-Aid brand, 1950s+), sterile saline (make your own: 1 tsp salt + 1 pint boiled water). 3. ANTISEPTICS: Betadine (povidone-iodine, 1955+), rubbing alcohol, hydrogen peroxide (avoid peroxide in deep wounds). 4. ANTIBIOTICS (Rx required, stockpile via "I lost my prescription"): penicillin, tetracycline, erythromycin, Bactrim. 5. PAIN: aspirin, Tylenol #3 (acetaminophen + codeine, commonly prescribed). 6. Allergies: Benadryl (1946+). Epinephrine auto-injector: EpiPen launches 1987. 7. Carry QuikClot only after 2002 — pre-2002 versions cause burns.',
    eraNote: 'Naloxone (Narcan) is FDA-approved in 1971 but only as injectable — nasal Narcan is 2015. EMS: 911 dispatch is generalized in the US by 1976, but pre-hospital care is patchy until the mid-80s.',
    tags: ['medical-kit', 'trauma', 'tourniquet', 'antiseptic', 'ems', 'stockpile']
  },
  {
    id: 'first-aid-basics',
    category: 'Medical',
    title: 'First Aid Procedures (Era-Specific Risks)',
    description: 'Common 1970s-90s hazards differ from modern ones: more industrial accidents, smoking-related burns, fewer seatbelt laws (federal mandate 1984, state laws spread through the 90s).',
    protocol: '1. CPR: pre-2008, it is 15 compressions : 2 breaths. Post-2008, "hands-only" CPR is endorsed by the AHA. 2. HEIMLICH (1974): for choking — recognize by the universal clutching sign. Pre-1974, back blows were taught. 3. BURNS: cool with running water 20 min; do NOT apply butter or oil (old wives\' tale of the era). 4. ELECTRIC SHOCK: cut power first — many 1970s appliances lack grounding. 5. CAR ACCIDENTS: pre-1984 seatbelt laws, injuries are far worse. Wear your belt — it is unusual but legal. 6. CARBON MONOXIDE: catalytic converters (1975+) reduce but do not eliminate risk. Have detectors (available from ~1985).',
    eraNote: 'The 911 emergency number is established by AT&T in 1968 but only reaches 50% of the US population by 1985 and 93% by 2000. Know local 7-digit direct police/fire numbers as backup.',
    tags: ['cpr', 'heimlich', 'first-aid', 'burns', 'seatbelts', '911']
  },
  {
    id: 'prescription-stockpiling',
    category: 'Medical',
    title: 'Building A Prescription Stockpile',
    description: 'Many essential medications (insulin, antibiotics, thyroid, cardiac) are needed continuously. The modern insurance/pharmacy system is unforgiving of gaps. Build a buffer.',
    protocol: '1. REFILL EARLY, OFTEN: most US pharmacies allow 7-10 day early refills. Over years this builds a 30-90 day buffer. 2. SUMMER/WINTER VACATION OVERRIDE: insurance allows a "vacation override" for a 90-day supply once per year — request it annually. 3. MAIL-ORDER 90-DAY: from the 1990s, insurance favors mail-order for 90-day supplies. Use this to build buffers. 4. ROTATE STOCK: label everything with expiration, FIFO consumption. Many drugs (doxycycline, ciprofloxacin) remain effective years past expiration per FDA SLEP data. 5. INSULIN is the hardest — short shelf life, refrigeration required. Have a backup access plan. 6. PRE-1970s, prescription laws are laxer — pharmacists often refill on request without an MD call.',
    eraNote: 'The prescription system tightens dramatically after the Controlled Substances Act (1970) and the Kefauver-Harris Amendment (1962). Pre-1970, "legend drugs" (Rx) are loosely enforced.',
    tags: ['prescription', 'stockpile', 'medication', 'insulin', 'rotation', 'expiration']
  },

  // ── SELF-DEFENSE / IDENTITY ────────────────────────────────
  {
    id: 'situational-awareness',
    category: 'Identity',
    title: 'Situational Awareness & The Cooper Color Code',
    description: 'Self-defense begins long before any physical confrontation. Jeff Cooper\'s "Color Code" (1970s, popularized in "Principles of Personal Defense") is the era-appropriate framework: White (unaware) → Yellow (relaxed alert) → Orange (focused alert) → Red (action).',
    protocol: '1. Live in Condition Yellow at all times. Scan hands, eyes, and exits. 2. Condition Orange when something feels wrong — commit to a plan ("if he crosses the curb I am in the store"). 3. Condition Red = execute the plan. 4. Maintain the "21-foot rule" (Tueller Drill, 1983): a knife-wielder can close 21 feet in 1.5 seconds. 5. Trust your gut — primitive pattern recognition flags anomalies faster than conscious thought. 6. If you can avoid a fight by leaving, ALWAYS leave. Pride is for people who cannot afford bail.',
    eraNote: 'Concealed-carry laws are restrictive through the 1970s (only ~8 shall-issue states by 1986). Florida becomes the first major shall-issue state in 1987. Self-defense law = "duty to retreat" in most states until the Castle Doctrine spread (post-2005).',
    tags: ['self-defense', 'awareness', 'cooper', 'condition-yellow', 'tueller', 'concealed-carry']
  },
  {
    id: 'improvised-self-defense',
    category: 'Identity',
    title: 'Improvised & Legal Self-Defense Tools',
    description: 'Gun laws vary wildly by state and era. Pepper spray (mace) is legal most places from 1965. Many everyday objects double as effective defensive tools.',
    protocol: '1. MACE (CN gas aerosol): legal in most states from mid-60s. Carry for keychain defense. OC pepper spray (stronger, non-flammable) becomes standard from the late 80s. 2. PERSONAL ALARM: small screecher alarms ($5-15) draw attention and deter. 3. TACTICAL PEN / KUBOTAN: a short rod (Yawara stick tradition), legal everywhere, durable force multiplier. 4. MAG-LITE FLASHLIGHT: 4-6 cell D-battery Mag-Lite doubles as a club — favored by cops in the era. 5. WALKING STICK/CANE: legal everywhere, does not require a permit, plausible deniability. 6. KEYS between fingers: classic last-ditch. 7. AVOID nunchaku, switchblades, brass knuckles — illegal in most states and brandishing is a felony.',
    eraNote: 'The original Mace brand (1965) uses CN (tear gas). OC pepper spray becomes commercially dominant after the FBI adopts it in 1987. TASER devices (1969) fire tethered darts; the wireless AIR TASER is 1994.',
    tags: ['mace', 'pepper-spray', 'kubotan', 'maglite', 'cane', 'legal-weapons']
  },

  // ── LANGUAGE / CULTURAL ASSIMILATION ───────────────────────
  {
    id: 'rapid-language-acquisition',
    category: 'Identity',
    title: 'Rapid Language Acquisition Strategies',
    description: 'Fitting into a non-English environment requires functional fluency in weeks, not years. Pre-internet tools (Pimsleur, Berlitz, Foreign Service Institute tapes) are your best accelerators.',
    protocol: '1. FSI COURSES: US Foreign Service Institute tapes are in the public domain — covers 70+ languages. Available at major public libraries through the 70s-90s. 2. PIMSLEUR (audio, 1963+): the gold standard for conversational fluency. Do one 30-min lesson daily; 90 lessons per level. 3. BERLITZ books + cassettes: cheap, common, decent. 4. SHADOWING: repeat aloud immediately after the recording — your mouth needs the muscle memory. 5. THE 1,000-WORD LIST: ~85% of daily speech uses ~1,000 words. Master those first (frequency dictionaries exist). 6. LANGUAGE EXCHANGE: place a classified ("Language exchange: my English for your French") — this is THE era method. 7. Live in a homestay if possible; full immersion accelerates 4-5x.',
    eraNote: 'Pre-Duolingo (2012) and pre-internet, language learning means tapes, books, and humans. The cassette Walkman (1979) is a game-changer for mobile study.',
    tags: ['language', 'pimsleur', 'fsi', 'berlitz', 'immersion', 'fluency']
  },
  {
    id: 'accent-management',
    category: 'Identity',
    title: 'Accent Management & Neutralization',
    description: 'An accent is the single hardest part of identity to change. Native listeners detect micro-deviations even when vocabulary and grammar are perfect.',
    protocol: '1. PICK A TARGET: General American (Midwest, no r-dropping) is the safest US target. In the UK, aim for Received Pronunciation or generic London. 2. MIMICRY: listen to era-appropriate recordings (radio newscasters are the gold standard) — Walter Cronkite, Edward R. Murrow, BBC Newsreaders. 3. RECORD YOURSELF — you cannot fix what you cannot hear. Cheap cassette recorders from the 1970s suffice. 4. THE TELL-TALE PHONEMES: the American "r" (rhotic), the vowel in "cat" vs "cah," the "th" sounds, the dark American "L." These mark you instantly. 5. SLOW DOWN. Speaking too fast plus hesitation patterns (ums, ahs) reveal non-native processing. 6. If you cannot fully neutralize, lean into a "regional" cover story: "I grew up in [region], then lived abroad for years."',
    eraNote: 'Speech coaching is expensive and rare in the era. DIY with cassette recordings and a mirror for mouth position. The "transatlantic accent" (Katharine Hepburn) is still taught in elite US schools through the 60s and is fading fast by the 70s.',
    tags: ['accent', 'phonetics', 'speech', 'dialect', 'neutralization', 'cover-story']
  },
  {
    id: 'cultural-norms-assimilation',
    category: 'Identity',
    title: 'Era-Specific Cultural Norms',
    description: 'Social etiquette changes faster than people realize. Behaviors that are normal in 2025 are rude or bizarre in 1980, and vice versa. Failure to assimilate marks you instantly.',
    protocol: '1. SMOKING: ubiquitous through the 70s-80s. ~40% of US adults smoke in 1970, declining through the 90s. NOT smoking is more notable than smoking until ~1990. 2. DRESS: men wear hats outdoors but remove them indoors (pre-1960s holdover, fading). Collared shirts and slacks are baseline casual. T-shirts as outerwear are working-class/sportswear until the late 70s. 3. FORMS OF ADDRESS: "sir/ma\'am" expected from younger to older through the 70s. "Mr./Mrs. Surname" until invited to first names. 4. CHECKS: writing a paper check at the grocery store is normal through the 90s. 5. DRINKING: 18 is the drinking age in many US states until 1984 (federal highway funds push it to 21 by 1988). 6. RACIAL/SEXIST NORMS: openly racist or sexist language is far more common in casual conversation. You need not adopt it but do not visibly react — your reaction marks you.',
    eraNote: 'Smoking bans in restaurants spread from the late 80s (Surgeon General 1986 report). The 18-to-21 drinking age change is driven by the 1984 National Minimum Drinking Age Act.',
    tags: ['culture', 'etiquette', 'smoking', 'dress', 'norms', 'assimilation']
  },
  {
    id: 'avoid-anachronisms',
    category: 'Identity',
    title: 'Avoiding Anachronistic Behavior',
    description: 'The single biggest giveaway that you are from the future. Behaviors, vocabulary, and references that are 5+ years out of sync with the era will mark you instantly.',
    protocol: '1. SLANG: refresh yearly. "Groovy" dies by 1975. "Cool" survives all eras. "Rad" peaks ~1985. "Awesome" universalizes by 1990. Avoid any slang you have not heard locally this month. 2. REFERENCES: never reference movies, songs, or events that have not happened yet. If asked "have you seen [movie]," claim you do not get out much. 3. TECHNOLOGY: do not gesture at non-existent screens. Do not try to "swipe" things. Do not photograph everything — cameras are deliberate acts in this era. 4. POLITICAL OPINIONS: future-consensus views on gender, race, sexuality will mark you as bizarre, hostile, or both. Adopt era-appropriate silences or platitudes. 5. MONEY: never quote exact future prices. Never complain prices are "cheap" — even small inflation-aware comments are weird. 6. HEALTH HABITS: jogging is eccentric in 1970, mainstream by 1980. Helmet-wearing while biking is eccentric until late 90s. Do not be the only person wearing a seatbelt in 1972.',
    eraNote: 'The seatbelt adoption curve: 14% of US drivers wear belts in 1982, 60% by 1994, 80%+ by 2002. Motorcycle helmet laws spread state-by-state through the 60s-70s.',
    tags: ['anachronism', 'slang', 'future-knowledge', 'cover', 'behavior']
  },
  {
    id: 'fashion-adaptation',
    category: 'Identity',
    title: 'Era Fashion Adaptation',
    description: 'Clothing is the fastest visual signal you send. Wearing 2025 fashion in 1975 is impossible to hide. Buy local, current clothes immediately upon arrival.',
    protocol: '1. ON ARRIVAL: visit Goodwill or Salvation Army first. Even secondhand, era clothes beat any modern clothing you may have brought. 2. PURCHASE: at a Sears, JCPenney, or local department store. Avoid couture — you want the AVERAGE LOOK. 3. MEN 1970s: wide lapels, polyester, bell-bottoms (early 70s), platform shoes. By late 70s, narrower lapels, fitted jeans (Sasson, Calvin Klein 1978+). 4. MEN 1980s: preppy (Ralph Lauren, Izod Lacoste, Brooks Brothers), power suits with shoulder pads, Members Only jackets. By late 80s, oversized casual. 5. MEN 1990s: grunge (flannel, ripped jeans), OR frat/prep revival (Abercrombie from 1992, J.Crew), OR hip-hop (baggy, FUBU 1996+). Pick one subculture and commit. 6. HAIR: era-appropriate haircut matters as much as clothes. 7. UNDERWEAR: brands and styles change; replace yours.',
    eraNote: 'Pre-1980, most clothes are made in USA. A "Made in China" tag is unusual and marks the garment as futuristic. Check all labels.',
    tags: ['fashion', 'clothing', 'style', 'arrival', 'sears', 'goodwill', 'subculture']
  },

  // ── BANKING / FINANCIAL DIVERSIFICATION ────────────────────
  {
    id: 'financial-diversification',
    category: 'Banking',
    title: 'Financial Diversification Across Decades',
    description: 'A single bank, broker, or currency is a single point of failure. Time travelers face unique risks: institution collapse, identity exposure, currency redenomination, and the possibility that "your" records do not survive your interventions.',
    protocol: '1. MULTIPLE BANKS: maintain accounts at 2-3 unrelated institutions in different cities. Never single-bank. 2. CASH RESERVES: keep 1-3 months of living expenses in physical currency, in a safety-deposit box (NOT home). Mix small and large bills. 3. PRECIOUS METALS: 5-10% of net worth in physical gold coins (Krugerrand importable from 1967, Canadian Maple from 1979, American Eagle from 1986). Avoid numismatic markup — buy bullion. 4. OFFSHORE (era-dependent): 1970s — Swiss bank accounts are still quasi-anonymous (numbered accounts). 1980s — Cayman Islands emerge. By 2001 (Patriot Act soon), all of this closes. 5. DIVERSIFY JURISDICTIONS: never hold all assets in one country. 6. DUAL-CURRENCY HEDGING: keep some assets in CHF, DEM, or JPY (pre-euro); post-1999 in EUR. 7. RETAIN BORING RECORDS: every bank statement, every tax return, every property deed. Survives audits, disputes, and your own memory failures.',
    eraNote: 'Numbered Swiss accounts survive until 1991 (you must prove identity but it is not in the bank\'s general system). The Bank Secrecy Act (1970), Money Laundering Control Act (1986), and Patriot Act (2001) progressively eliminate offshore secrecy.',
    tags: ['diversification', 'offshore', 'swiss', 'cayman', 'gold', 'krugerrand', 'reserves']
  },
];