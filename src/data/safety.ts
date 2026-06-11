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
];