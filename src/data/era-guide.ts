export interface EraGuideEntry {
  id?: string;
  category: 'Slang' | 'Prices' | 'Tech Constraints' | 'Fashion' | 'Identity';
  era: '1970s' | '1980s' | '1990s' | '2000s';
  item: string;
  description: string;
  advice: string;
  tags?: string[];
}

export function slugifyItem(item: string): string {
  return item
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateId(entry: EraGuideEntry): string {
  return `era-guide-${entry.era.toLowerCase()}-${entry.category.toLowerCase()}-${slugifyItem(entry.item)}`;
}

export const eraGuideData: EraGuideEntry[] = [
  // ── PRICES ────────────────────────────────────────────────
  {
    category: 'Prices', era: '1970s',
    item: 'Gasoline (per gallon)',
    description: '1970: $0.36. Spiked to $0.55 after 1973 oil embargo. Hit $0.86 by 1979.',
    advice: 'Gas stations often closed on Sundays in the 70s. Plan ahead. Odd/even rationing in some states during the 1973 crisis.'
  },
  {
    category: 'Prices', era: '1980s',
    item: 'Gasoline (per gallon)',
    description: '1980: $1.19. Dropped to ~$0.90 by 1986-88 during the oil glut.',
    advice: 'Self-service pumps are common by the 80s. Pay-at-pump does not exist — pay cashier inside.'
  },
  {
    category: 'Prices', era: '1970s',
    item: 'Loaf of bread',
    description: '1970: $0.25. 1979: ~$0.50.',
    advice: 'Wonder Bread dominates. Whole wheat is for "health nuts."'
  },
  {
    category: 'Prices', era: '1980s',
    item: 'Loaf of bread',
    description: 'Early 80s: ~$0.55. Late 80s: ~$0.75.',
    advice: 'Bagels and croissants start appearing in mainstream supermarkets mid-80s.'
  },
  {
    category: 'Prices', era: '1970s',
    item: 'Movie ticket',
    description: '1970: ~$1.50. 1979: ~$2.50.',
    advice: 'No stadium seating. No advance online tickets. Wait in line. Smoking in theaters was common until the late 70s.'
  },
  {
    category: 'Prices', era: '1980s',
    item: 'Movie ticket',
    description: '1980: ~$2.70. 1989: ~$4.00.',
    advice: 'VCRs take off in the 80s — Blockbuster opens 1985. Movie rental becomes an alternative.'
  },
  {
    category: 'Prices', era: '1970s',
    item: 'Average rent (1BR, US city)',
    description: '~$135/month in 1970, rising to ~$280 by 1979.',
    advice: 'Security deposits are typically one month\'s rent. No credit check era — landlords rely on employment verification and references.'
  },
  {
    category: 'Prices', era: '1980s',
    item: 'Average rent (1BR, US city)',
    description: 'Early 80s: ~$300. Late 80s: ~$500.',
    advice: 'Rent control exists in NYC and SF. Housing bubble forming in coastal cities by late 80s.'
  },
  {
    category: 'Prices', era: '1970s',
    item: 'New car (average)',
    description: '1970: ~$3,500. 1979: ~$6,800.',
    advice: 'Japanese imports (Toyota, Honda, Datsun/Nissan) gain popularity after the 1973 oil crisis. American cars are large and inefficient.'
  },
  {
    category: 'Prices', era: '1980s',
    item: 'New car (average)',
    description: '1980: ~$7,200. 1989: ~$15,400.',
    advice: 'Chrysler K-cars and minivans dominate. By late 80s, airbags begin appearing in luxury models.'
  },
  {
    category: 'Prices', era: '1970s',
    item: 'US Postage stamp',
    description: '1971: 8¢. 1974: 10¢. 1978: 15¢.',
    advice: 'Mail is the primary communication method with institutions. No email, no online accounts.'
  },
  {
    category: 'Prices', era: '1980s',
    item: 'US Postage stamp',
    description: '1981: 18¢. 1985: 22¢. 1988: 25¢.',
    advice: 'Fax machines become common in offices by mid-80s. Overnight delivery (FedEx founded 1971) is an option for urgent items.'
  },

  // ── SLANG ─────────────────────────────────────────────────
  {
    category: 'Slang', era: '1970s',
    item: '"Groovy" / "Far out"',
    description: 'Hippie-era holdovers meaning cool, excellent, or mind-blowing.',
    advice: 'Already fading by mid-70s. Use only in casual settings. Saying "groovy" in 1978 marks you as out of touch.'
  },
  {
    category: 'Slang', era: '1970s',
    item: '"Cool" / "Right on" / "Can you dig it?"',
    description: 'Universal approval. "Right on" is more 70s. "Can you dig it?" peaked mid-70s.',
    advice: '"Cool" is timeless — it\'s the safest universal positive. "Right on" after 1975 sounds dated.'
  },
  {
    category: 'Slang', era: '1980s',
    item: '"Radical" / "Rad" / "Awesome" / "Gnarly"',
    description: 'Surfer/skater slang that spread nationally. "Gnarly" can mean good or bad depending on tone.',
    advice: '"Awesome" is the safest 80s positive. "Rad" is very California. "Gnarly" requires careful tone — "That wipeout was gnarly!" = bad.'
  },
  {
    category: 'Slang', era: '1980s',
    item: '"Like" / "Totally" / "Gag me with a spoon"',
    description: 'Valley Girl speak explodes in 1982-83. "Like" as filler, "totally" as intensifier.',
    advice: 'Use sparingly unless you want to sound like a Valley Girl. A little goes a long way. Mostly female-coded in the 80s.'
  },
  {
    category: 'Slang', era: '1980s',
    item: '"Wicked" / "Bodacious" / "Tubular"',
    description: 'Regional variations. "Wicked" is New England (means "very"). "Tubular" is surfer. "Bodacious" is general 80s.',
    advice: 'Know the region. Saying "wicked" in California marks you as an East Coaster immediately.'
  },

  // ── TECH CONSTRAINTS ──────────────────────────────────────
  {
    category: 'Tech Constraints', era: '1970s',
    item: 'Public Telephones (Payphones)',
    description: 'Rotary dial, coin-operated. 1970: a dime. By late 70s: a quarter. No caller ID.',
    advice: 'Memorize numbers. Phone books (White/Yellow Pages) are at every payphone. No texting — leave a message with a person or on an answering machine.'
  },
  {
    category: 'Tech Constraints', era: '1980s',
    item: 'Public Telephones & Early Mobile',
    description: 'Touch-tone phones replace rotary by mid-80s. First mobile phones (1983: Motorola DynaTAC, $3,995, "the brick").',
    advice: 'Car phones (1985+) are the first mobile option normies encounter. A cell phone in 1987 makes you look like a stockbroker or drug dealer.'
  },
  {
    category: 'Tech Constraints', era: '1970s',
    item: 'Navigation Without GPS',
    description: 'Paper maps only. Thomas Guides in cities. AAA TripTiks for road trips. No GPS until the 1990s (military only).',
    advice: 'Buy a local map immediately upon arrival. Learn to fold it. Ask for directions at gas stations — this is normal and expected.'
  },
  {
    category: 'Tech Constraints', era: '1980s',
    item: 'Navigation Without GPS',
    description: 'Still paper maps. First consumer GPS (Magellan NAV 1000) launches in 1989 at $3,000 — but it\'s handheld, not in cars.',
    advice: 'In-car GPS is still science fiction. If you pull out a smartphone, you blow your cover immediately.'
  },
  {
    category: 'Tech Constraints', era: '1970s',
    item: 'Banking & ATMs',
    description: 'ATMs introduced in 1969 but rare until late 70s. Most banking is in-branch, Mon-Fri 9-3. No online banking.',
    advice: 'Cash is king. Personal checks are normal for rent and large purchases. To open an account, you need a local address and ID — no SSN verification exists for basic accounts in most banks until the 80s.'
  },
  {
    category: 'Tech Constraints', era: '1980s',
    item: 'Banking & ATMs',
    description: 'ATM networks (Cirrus, Plus) launch mid-80s. Debit cards appear around 1984-85 but are not widely used.',
    advice: 'ATMs are common by 1985 but expect fees at machines not belonging to your bank. Still carry cash — many places (dive bars, food trucks, farmers markets) remain cash-only.'
  },
  {
    category: 'Tech Constraints', era: '1970s',
    item: 'Computers & Internet',
    description: 'No personal computers. Mainframes and minicomputers only (IBM, DEC). ARPANET exists (ancestor of internet) but is military/academic only.',
    advice: 'Do not reference "the internet," "Google," "email," or "websites." The concept of a "personal computer" is fringe until 1977 (Apple II, Commodore PET, TRS-80).'
  },
  {
    category: 'Tech Constraints', era: '1980s',
    item: 'Computers & Internet',
    description: 'Home computers: Apple II (1977), Commodore 64 (1982), IBM PC (1981). Macintosh (1984). BBS (bulletin board systems) exist — modem dial-up to individual servers. No web until 1991.',
    advice: '"Going online" means dialing a BBS with a 300-2400 baud modem. You can reference "computer networks" but not "the web." CompuServe and AOL exist by late 80s (walled gardens, not the open internet).'
  },
  {
    category: 'Tech Constraints', era: '1970s',
    item: 'Music & Media',
    description: 'Vinyl records (LPs/45s). 8-track tapes fade by late 70s. Cassette tapes rise. No CDs until 1982.',
    advice: 'If someone asks for music recommendations, name bands, not songs you "streamed." Mixtapes on cassette are the playlists of the era.'
  },
  {
    category: 'Tech Constraints', era: '1980s',
    item: 'Music & Media',
    description: 'CDs launch 1982, gain traction slowly. Cassette remains dominant portable format. Walkman (Sony, 1979) is ubiquitous by 1983.',
    advice: 'The Walkman is a cultural touchstone — recognize it. MTV launches 1981 and reshapes music. VHS beats Betamax in the format war (by ~1985-86).'
  },
  {
    category: 'Tech Constraints', era: '1970s',
    item: 'Smoking & Social Norms',
    description: 'Smoking is EVERYWHERE — restaurants, airplanes, offices, hospitals, schools. "Non-smoking section" is a joke until late 70s.',
    advice: 'Don\'t visibly react to cigarette smoke. It\'s normal. If you don\'t smoke, people may find it mildly unusual but won\'t question it.'
  },

  // ── FASHION ───────────────────────────────────────────────
  {
    category: 'Fashion', era: '1970s',
    item: 'Bell-bottoms & Wide Collars',
    description: 'Standard casual and semi-formal wear. Polyester leisure suits peak 1975-77.',
    advice: 'Bell-bottoms fade by 1979. Straight-leg jeans replace them. Leisure suit in 1978 = trying too hard.'
  },
  {
    category: 'Fashion', era: '1980s',
    item: 'Shoulder Pads & Power Suits',
    description: 'Women\'s business wear: shoulder pads, bold colors, large earrings. Men: Armani-style loose-fit suits with suspenders. Preppy (polo shirts, khakis, boat shoes) is a parallel current.',
    advice: 'Shoulder pads on women peak 1985-88. Preppy look is the safe default for men — think J.Crew catalog, not Wall Street.'
  },
  {
    category: 'Fashion', era: '1980s',
    item: 'Athletic & Streetwear',
    description: 'Sneaker culture begins: Air Jordans (1985), Reebok Pumps (1989). Tracksuits, headbands. Acid-wash jeans (1986+).',
    advice: 'Air Jordans in 1985 cost $65 and sell out. Knowing this is era-appropriate. Wearing them is normal; obsessing over sneaker culture is mostly a 2010s thing.'
  },
  {
    category: 'Fashion', era: '1980s',
    item: 'Hair & Accessories',
    description: 'Big hair (both genders). Perms for women, mullets for men. Wayfarer sunglasses (Ray-Ban). Swatch watches (1983+).',
    advice: 'A mullet in 1985 is unremarkable. A man bun would attract stares — that\'s a 2010s thing. Swatch collecting is a genuine 80s phenomenon.'
  },

  // ── IDENTITY ──────────────────────────────────────────────
  {
    category: 'Identity', era: '1970s',
    item: 'Driver\'s License & ID',
    description: 'Paper or early laminated cards. No magnetic stripes, no holograms, no barcodes. Photo might be black-and-white.',
    advice: 'Easier to forge than modern IDs but risky. The best cover is a real identity — find recently deceased infants in newspaper obituaries (common identity theft tactic of the era, though unethical).'
  },
  {
    category: 'Identity', era: '1980s',
    item: 'Driver\'s License & ID',
    description: 'Laminated with simple security features by mid-80s. Some states add holograms by late 80s. Still no magnetic stripes on most.',
    advice: 'By 1985, law enforcement is more sophisticated about ID verification. Forging IDs is harder. Consider the "dead drop" approach — pre-positioned documents.'
  },
  {
    category: 'Identity', era: '1970s',
    item: 'Social Security Number',
    description: 'SSN is NOT a universal ID yet. Issued at any age. No SSN verification exists — you just provide the number on a form.',
    advice: 'You can obtain a real SSN by applying at a Social Security office with a plausible birth certificate and story. The system is trust-based. SSN misuse only becomes a federal crime in the 80s.'
  },
  {
    category: 'Identity', era: '1980s',
    item: 'Social Security Number',
    description: 'SSN gradually becomes universal ID. Required for employment verification (I-9 form, 1986). IRS begins SSN matching.',
    advice: 'The window for easy SSN acquisition closes during the 80s. By 1986, employers must verify SSNs. Pre-1986 arrival gives you more options.'
  },
  {
    category: 'Identity', era: '1970s',
    item: 'Credit Cards & Credit History',
    description: 'Credit cards are less universal. Many people operate on cash and check. Diners Club, American Express, BankAmericard (later Visa).',
    advice: 'Credit checks for rentals and jobs are rare. Your lack of credit history is not suspicious — many young people have none. Building credit is unnecessary for short-term stays.'
  },
  {
    category: 'Identity', era: '1980s',
    item: 'Credit Cards & Credit History',
    description: 'Visa and MasterCard become ubiquitous. Credit bureaus (Equifax, TransUnion, Experian) digitize records. Credit scoring emerges late 80s.',
    advice: 'A "no credit history" story becomes less plausible by the late 80s. A traveler arriving in 1988 should have a cover story for their financial background.'
  },
  // ── 1990s & early 2000s EXPANSIONS ────────────────────────
  {
    category: 'Prices', era: '1990s',
    item: 'Gasoline (per gallon)',
    description: '1990: $1.22. Average hovered around $1.15 to $1.30 for most of the decade. Rose to $1.50 by 2000.',
    advice: 'Pay-at-pump becomes widely available. You can pay with cash or credit cards directly at the dispenser.'
  },
  {
    category: 'Prices', era: '2000s',
    item: 'Gasoline (per gallon)',
    description: '2001: ~$1.46. Spiked to over $2.00 in subsequent years following geopolitical events.',
    advice: 'Gas pump electronic screens are standard. Credit cards are the default payment option.'
  },
  {
    category: 'Prices', era: '1990s',
    item: 'Movie ticket',
    description: '1990: ~$4.25. 1999: ~$5.00.',
    advice: 'Multiplexes dominate. Advance phone booking (e.g. MovieFone, "777-FILM") becomes popular. Dialing online doesn\'t exist yet.'
  },
  {
    category: 'Prices', era: '2000s',
    item: 'Movie ticket',
    description: '2001: ~$5.60.',
    advice: 'Online ticket websites (Fandango) emerge. Print your ticket confirmation barcode at home or pick it up at a lobby kiosk.'
  },
  {
    category: 'Prices', era: '1990s',
    item: 'Average Rent (1BR)',
    description: '1990: ~$450. 1999: ~$600. Spiked dramatically in Silicon Valley due to the dot-com bubble.',
    advice: 'Landlords start requiring formal credit reports and employment verification letters. Pay with personal checks.'
  },
  {
    category: 'Prices', era: '2000s',
    item: 'Average Rent (1BR)',
    description: '2001: ~$650.',
    advice: 'Online listings (early Craigslist) start replacing newspaper classified ads for finding rentals in major cities.'
  },
  {
    category: 'Slang', era: '1990s',
    item: 'Slang Scans',
    description: '"Da bomb" (excellent), "Talk to the hand" (talk to me no more), "All that" (great), "Whatever" (dismissive, with W finger gesture), "Fly" (stylish).',
    advice: 'Grunge and hip-hop culture heavily influence dialogue. Using "rad" or "groovy" sounds outdated. Valley Girl "like" is still everywhere.'
  },
  {
    category: 'Slang', era: '2000s',
    item: 'Early 2000s Slang',
    description: '"Wassup" (greetings, from the Budweiser ad), "Sweet" (excellent), "Bounce" (to leave), "Chillax" (chill and relax).',
    advice: 'Internet chat slang (LOL, BRB) starts leaking into spoken conversations among teens, but adults find it bizarre.'
  },
  {
    category: 'Tech Constraints', era: '1990s',
    item: 'Dial-up Internet & Web Browsers',
    description: 'Speeds capped at 28.8k to 56k. Phone line is blocked while browsing. Internet Explorer and Netscape Navigator are the main browsers.',
    advice: 'No video streaming. Images load line-by-line. Standard sites are mostly text and static layouts. Download MP3s on Napster (1999).'
  },
  {
    category: 'Tech Constraints', era: '2000s',
    item: 'Early Broadband & Search Engines',
    description: 'Cable/DSL broadband rolls out (256kbps-1Mbps). Google becomes the dominant search engine, replacing Yahoo/AltaVista.',
    advice: 'WiFi (802.11b) starts appearing in laptops. Wikipedia launches (2001). Yahoo Mail and Hotmail are the primary personal mail options.'
  },
  {
    category: 'Fashion', era: '1990s',
    item: 'Grunge & Hip-Hop Apparel',
    description: 'Grunge (flannel shirts, combat boots, ripped jeans), Hip-Hop (baggy jeans, oversized t-shirts, bucket hats). Windbreakers and chokers.',
    advice: 'Casual dress codes become common in workplaces. Tie-dye and neon 80s styles are strictly out.'
  },
  {
    category: 'Fashion', era: '2000s',
    item: 'Y2K Aesthetics',
    description: 'Metallic fabrics, low-rise jeans, tracksuits (Juicy Couture), cargo pants, frosted tips, and tiny sunglasses.',
    advice: 'Logos are huge. Brand alignment (Abercrombie, Von Dutch) is highly visible.'
  },
  {
    category: 'Identity', era: '1990s',
    item: 'AOL & Screen Names',
    description: 'America Online (AOL) dominates internet onboarding. Instant Messenger (AIM) defines social circles.',
    advice: 'Secure a screen name (e.g. "CoolTraveler99") to chat. Background checks are partially computerized, so fake references require more care.'
  },
  {
    category: 'Identity', era: '2000s',
    item: 'Cybercafes & Early Mobile Contacts',
    description: 'Cellphones become mainstream (Nokia 3310). Cybercafes provide web access for travelers.',
    advice: 'Acquiring a cellphone is cheap. Prepaid SIM cards allow communication without a long-term contract or deep credit checks.'
  },
];

eraGuideData.forEach(entry => {
  if (!entry.id) {
    (entry as { id: string }).id = generateId(entry);
  }
});
