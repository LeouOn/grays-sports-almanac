/**
 * A destination worth visiting at a specific moment in history.
 * The `decade` field tells a time traveler WHEN to aim the DeLorean;
 * the `category` tells them what kind of experience awaits.
 */
export interface TouristDestination {
  id: string;
  name: string;
  /** City, country (or equivalent locator) */
  location: string;
  /** The decade this destination is at its peak / most worth visiting */
  decade: '1970s' | '1980s' | '1990s' | '2000s';
  category:
    | 'Natural Wonder'
    | 'Historical Site'
    | 'Cultural Event'
    | 'Architectural Marvel'
    | 'Music/Arts Scene'
    | 'Urban Experience';
  /** Evocative, time-travel-focused: WHY be here at THIS specific moment */
  description: string;
  /** Specific season or month for the best experience */
  bestTimeToVisit: string;
  costTier: 'Budget' | 'Moderate' | 'Expensive' | 'Luxury';
  tags?: string[];
}

export const touristDestinations: TouristDestination[] = [
  // ── 1970s ─────────────────────────────────────────────────
  {
    id: 'apollo-moon-sites',
    name: 'Apollo Lunar Landing Sites',
    location: 'Sea of Tranquility / Taurus–Littrow Valley, Moon',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Aim for the Apollo 15–17 missions (1971–1972), when astronauts drove the Lunar Roving Vehicle across the valleys of the Moon and stayed for days. This is the only brief window in human history when walking on another world was possible — and the footprints you would see are still there, undisturbed, half a century later.',
    bestTimeToVisit: 'July 1971 – December 1972 (during a mission)',
    costTier: 'Luxury',
    tags: ['space', 'moon', 'apollo', 'once-in-a-lifetime', 'science'],
  },
  {
    id: 'expo-70-osaka',
    name: 'Expo \'70 Osaka',
    location: 'Osaka, Japan',
    decade: '1970s',
    category: 'Cultural Event',
    description:
      'The first World\'s Fair held in Asia, and still one of the most dazzling: 64 million visitors, the debut of mobile phones and IMAX, and Tange\'s vast space-frame "Theme Space." It is the moment Japan announced itself as the future — a utopian, gadget-filled future you can walk through in person.',
    bestTimeToVisit: 'March–September 1970',
    costTier: 'Moderate',
    tags: ['worlds-fair', 'futurism', 'japan', 'architecture', 'technology'],
  },
  {
    id: 'studio-54',
    name: 'Studio 54',
    location: 'New York City, USA',
    decade: '1970s',
    category: 'Music/Arts Scene',
    description:
      'For 33 months between 1977 and 1980, a former theater on West 54th became the most famous nightclub in history — where celebrities, artists, and ordinary (but beautiful) people danced under a man-in-the-moon prop that sniffed cocaine from a silver spoon. This is disco at its most theatrical and decadent, a closing aria before the era collapsed.',
    bestTimeToVisit: '1977–1979 (Tuesday and Saturday nights)',
    costTier: 'Expensive',
    tags: ['disco', 'nightlife', 'celebrity', 'nyc', 'decadence'],
  },
  {
    id: 'munich-olympic-park',
    name: 'Munich Olympic Park',
    location: 'Munich, Germany',
    decade: '1970s',
    category: 'Historical Site',
    description:
      'Frei Otto\'s tensile-canopy roofs over the 1972 Games were meant to signal a gentle, welcoming Germany — and they remain breathtaking. Visit in the optimistic weeks before the Munich massacre to walk a city consciously trying to erase the shadow of 1936, then witness history pivot in real time.',
    bestTimeToVisit: 'August–September 1972',
    costTier: 'Moderate',
    tags: ['olympics', 'architecture', 'germany', 'history', 'tension'],
  },
  {
    id: 'louvre-pre-pyramid',
    name: 'The Louvre (Before the Pyramid)',
    location: 'Paris, France',
    decade: '1970s',
    category: 'Architectural Marvel',
    description:
      'Tour the world\'s most visited museum in the era before I. M. Pei\'s glass pyramid transformed its courtyard in 1989 — when you entered through the same centuries-old palatial doors as Napoleon\'s curators. Quieter, dustier, and unmistakably grander in the old way.',
    bestTimeToVisit: 'Year-round (weekday mornings)',
    costTier: 'Budget',
    tags: ['museum', 'art', 'paris', 'architecture', 'pre-renovation'],
  },
  {
    id: 'sahara-desert',
    name: 'The Sahara Desert',
    location: 'Morocco / Algeria, North Africa',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Camel-trek the great ergs in the last era before GPS, cell coverage, and air-conditioned 4x4 convoys made the desert manageable. The 1970s Tuareg trade routes are still intact, the stars at night are unchallenged by light pollution, and the silence is absolute.',
    bestTimeToVisit: 'October–March (cool season)',
    costTier: 'Moderate',
    tags: ['desert', 'nature', 'adventure', 'stars', 'pre-tech'],
  },
  {
    id: 'cbgb-punk',
    name: 'CBGB & OMFUG',
    location: 'New York City, USA',
    decade: '1970s',
    category: 'Music/Arts Scene',
    description:
      'A crumbling Bowery dive where the Ramones, Patti Smith, Talking Heads, and Blondie invented American punk and new wave between 1974 and 1978. Stand at the back, pay almost nothing, and watch genres be born on a tiny stage plastered with decades of band stickers.',
    bestTimeToVisit: '1975–1978 (weeknights)',
    costTier: 'Budget',
    tags: ['punk', 'music', 'nyc', 'counterculture', 'live-music'],
  },

  // ── 1980s ─────────────────────────────────────────────────
  {
    id: 'berlin-wall-pre-fall',
    name: 'The Berlin Wall & Checkpoint Charlie',
    location: 'Berlin, Germany',
    decade: '1980s',
    category: 'Historical Site',
    description:
      'Visit the divided city in the years just before November 1989, when the Wall, the death strip, and the crossing points still carved a wound through the heart of Europe. Standing at the Brandenburg Gate on the Western side, you can feel the Cold War in the air — a vanished geopolitical reality you can still touch with your hands.',
    bestTimeToVisit: '1986–1989',
    costTier: 'Moderate',
    tags: ['cold-war', 'history', 'politics', 'germany', 'divided-city'],
  },
  {
    id: 'live-aid-1985',
    name: 'Live Aid Concert',
    location: 'London, UK & Philadelphia, USA',
    decade: '1980s',
    category: 'Music/Arts Scene',
    description:
      'July 13, 1985: the largest satellite-linked concert ever staged, with Queen\'s career-defining Wembley set as its centerpiece. Be in the crowd for the day rock music tried to save the world — a genuinely unprecedented global moment, never quite replicated.',
    bestTimeToVisit: 'July 13, 1985',
    costTier: 'Budget',
    tags: ['concert', 'charity', 'queen', '1980s', 'live-music'],
  },
  {
    id: 'statue-of-liberty-centennial',
    name: 'Statue of Liberty Centennial',
    location: 'New York City, USA',
    decade: '1980s',
    category: 'Cultural Event',
    description:
      'After a two-year interior restoration, Lady Liberty reopens for her 100th birthday on July 4, 1986, amid the largest fireworks display in American history and a naval review of tall ships. The most patriotic Fourth of July the country has ever thrown — pure red-white-and-blue spectacle.',
    bestTimeToVisit: 'July 3–6, 1986',
    costTier: 'Moderate',
    tags: ['patriotism', 'celebration', 'nyc', 'history', 'fireworks'],
  },
  {
    id: 'mt-st-helens',
    name: 'Mount St. Helens (Post-Eruption)',
    location: 'Washington, USA',
    decade: '1980s',
    category: 'Natural Wonder',
    description:
      'Walk the rim of a volcano that lost its top 1,300 feet on May 18, 1980 — the most destructive volcanic event in U.S. history. In the years immediately after, you can watch an entire ecosystem reborn across a gray moonscape, a rare chance to see geological catastrophe and biological recovery side by side.',
    bestTimeToVisit: 'August–October (clear days)',
    costTier: 'Budget',
    tags: ['volcano', 'geology', 'nature', 'disaster-recovery', 'pacific-northwest'],
  },
  {
    id: 'christo-pont-neuf',
    name: 'Christo\'s Wrapped Pont Neuf',
    location: 'Paris, France',
    decade: '1980s',
    category: 'Cultural Event',
    description:
      'For just 14 days in September 1985, artists Christo and Jeanne-Claude wrapped Paris\'s oldest bridge in 40,000 square meters of golden fabric. A fleeting, unrepeatable artwork that transformed the Seine for two weeks and then vanished forever — the definition of a time-limited destination.',
    bestTimeToVisit: 'September 22 – October 6, 1985',
    costTier: 'Moderate',
    tags: ['art', 'installation', 'paris', 'ephemeral', 'land-art'],
  },
  {
    id: 'tokyo-bubble-era',
    name: 'Bubble-Era Tokyo',
    location: 'Tokyo, Japan',
    decade: '1980s',
    category: 'Urban Experience',
    description:
      'Experience the peak of Japan\'s late-1980s asset-price bubble, when Ginza real estate cost more than all of California and corporate expense accounts bought gold-leaf sushi and champagne cascades. A genuinely surreal urban moment of extravagant optimism that would vanish in the 1990s — neon, money, and confidence in full flood.',
    bestTimeToVisit: '1987–1989 (December nightlife)',
    costTier: 'Luxury',
    tags: ['urban', 'economy', 'nightlife', 'japan', 'excess'],
  },
  {
    id: 'venice-carnival-revival',
    name: 'Venice Carnival (Revived)',
    location: 'Venice, Italy',
    decade: '1980s',
    category: 'Cultural Event',
    description:
      'After two centuries of dormancy, the Venetian Carnival was reborn in 1979–1980 and hit its full masked stride through the 1980s. Drift through candlelit calli among handmade bauta masks and gilded costumes at the moment this ancient festival found its modern form.',
    bestTimeToVisit: 'February (the ten days before Lent)',
    costTier: 'Expensive',
    tags: ['carnival', 'masks', 'italy', 'tradition', 'party'],
  },

  // ── 1990s ─────────────────────────────────────────────────
  {
    id: 'berlin-wall-fall',
    name: 'Berlin Wall Fall — Brandenburg Gate',
    location: 'Berlin, Germany',
    decade: '1990s',
    category: 'Historical Site',
    description:
      'Be at the Brandenburg Gate on the night of November 9, 1989, and in the days that follow, as East and West Berliners tear the Wall apart with hammers and champagne. The Cold War ends in front of you — arguably the single most joyful political event of the 20th century.',
    bestTimeToVisit: 'November 9–12, 1989',
    costTier: 'Moderate',
    tags: ['cold-war', 'history', 'freedom', 'germany', 'celebration'],
  },
  {
    id: 'hong-kong-handover',
    name: 'Hong Kong Handover Ceremony',
    location: 'Hong Kong',
    decade: '1990s',
    category: 'Cultural Event',
    description:
      'Midnight, June 30 – July 1, 1997: 156 years of British rule end and Hong Kong returns to China in a torrential rainstorm of Union Jacks and five-star red flags. Witness the last act of European colonial empire in Asia — solemn, cinematic, and soaked with rain and meaning.',
    bestTimeToVisit: 'June 30 – July 1, 1997',
    costTier: 'Expensive',
    tags: ['politics', 'history', 'ceremony', 'china', 'colonialism'],
  },
  {
    id: 'mandela-inauguration',
    name: 'Mandela\'s Inauguration',
    location: 'Pretoria, South Africa',
    decade: '1990s',
    category: 'Historical Site',
    description:
      'May 10, 1994: Nelson Mandela is sworn in as South Africa\'s first Black president after 27 years in prison and centuries of apartheid. Stand on the Union Buildings terrace among a worldwide crowd watching a country remake itself without a civil war — a near-miraculous transfer of power.',
    bestTimeToVisit: 'May 10, 1994',
    costTier: 'Moderate',
    tags: ['politics', 'history', 'freedom', 'south-africa', 'ceremony'],
  },
  {
    id: 'woodstock-94',
    name: 'Woodstock \'94',
    location: 'Saugerties, New York, USA',
    decade: '1990s',
    category: 'Music/Arts Scene',
    description:
      'The 25th-anniversary festival that became "Mudstock" after torrential rain turned Winston Farm into a giant mud pit. 350,000 people, Green Day\'s breakout mud-fight set, and a genuinely peaceful, grunge-era echo of the original — a generational party in the sludge.',
    bestTimeToVisit: 'August 12–14, 1994',
    costTier: 'Moderate',
    tags: ['festival', 'grunge', 'music', 'nyc-area', 'mud'],
  },
  {
    id: 'barcelona-olympics-92',
    name: 'Barcelona \'92 Olympic Village & Stadium',
    location: 'Barcelona, Spain',
    decade: '1990s',
    category: 'Architectural Marvel',
    description:
      'The 1992 Games reinvented Barcelona: a derelict industrial waterfront became two miles of beaches, and the city opened to the sea for the first time in centuries. Walk the freshly finished Vila Olímpica and Montjuïc venues during the "Dream Team" summer that relaunched a whole city as a destination.',
    bestTimeToVisit: 'July–August 1992',
    costTier: 'Expensive',
    tags: ['olympics', 'architecture', 'urban-renewal', 'spain', 'design'],
  },
  {
    id: 'prague-velvet-revolution',
    name: 'Velvet Revolution Sites — Wenceslas Square',
    location: 'Prague, Czech Republic',
    decade: '1990s',
    category: 'Historical Site',
    description:
      'Stand in Wenceslas Square during the gentle, theatrical revolution of November–December 1989, when Václav Havel and hundreds of thousands of Czechs rattled keys and toppled a regime without a shot. Then watch Prague bloom, almost overnight, into the most beautiful post-Communist city to explore.',
    bestTimeToVisit: 'November 17 – December 29, 1989',
    costTier: 'Budget',
    tags: ['history', 'politics', 'peaceful-revolution', 'czech', 'europe'],
  },
  {
    id: 'angkor-wat-reopening',
    name: 'Angkor Wat (Reopening)',
    location: 'Siem Reap, Cambodia',
    decade: '1990s',
    category: 'Historical Site',
    description:
      'After decades of war and Khmer Rouge rule, Angkor slowly reopens to visitors in the early-to-mid 1990s, still half-reclaimed by jungle and almost empty of tourists. Watch sunrise over the world\'s largest religious monument in near-solitude — a privilege that will vanish within a decade as the crowds arrive.',
    bestTimeToVisit: 'November–February (dry season, dawn)',
    costTier: 'Moderate',
    tags: ['ruins', 'temple', 'history', 'cambodia', 'jungle'],
  },

  // ── 2000s (2000–2001) ─────────────────────────────────────
  {
    id: 'sydney-olympics-2000',
    name: 'Sydney 2000 Olympics',
    location: 'Sydney, Australia',
    decade: '2000s',
    category: 'Cultural Event',
    description:
      'Widely called the best-organized Games ever, with Cathy Freeman lighting the cauldron in a silver suit and winning 400m gold before a stunned home crowd. The green-and-gold "best Olympics ever" close out a millennium of sport in a harbor city at its absolute peak.',
    bestTimeToVisit: 'September 15 – October 1, 2000',
    costTier: 'Expensive',
    tags: ['olympics', 'ceremony', 'australia', 'millennium', 'sport'],
  },
  {
    id: 'y2k-new-year',
    name: 'Y2K Millennium Celebrations',
    location: 'Global (time-zone hopping)',
    decade: '2000s',
    category: 'Cultural Event',
    description:
      'Ride the International Date Line through December 31, 1999 into January 1, 2000, partying through each time zone\'s midnight as the world holds its breath over the Y2K bug that mostly never came. The biggest, most anxious, most global New Year in history — and it turned out fine.',
    bestTimeToVisit: 'December 31, 1999 – January 1, 2000',
    costTier: 'Expensive',
    tags: ['new-year', 'millennium', 'party', 'global', 'y2k'],
  },
  {
    id: 'international-space-station',
    name: 'International Space Station (First Crew)',
    location: 'Low Earth Orbit',
    decade: '2000s',
    category: 'Architectural Marvel',
    description:
      'November 2, 2000: Expedition 1 docks and humanity gains a permanent off-world home for the first time, occupied continuously ever since. Visit the tiny three-module outpost at the dawn of continuous human spaceflight — before it grew into the football-field-sized laboratory it is today.',
    bestTimeToVisit: 'November 2000 – 2001',
    costTier: 'Luxury',
    tags: ['space', 'orbit', 'science', 'humanity', 'frontier'],
  },
  {
    id: 'dubai-construction-boom',
    name: 'Pre-Burj Dubai Construction Boom',
    location: 'Dubai, UAE',
    decade: '2000s',
    category: 'Urban Experience',
    description:
      'Watch a fishing-village-turned-city will itself skyward in 2000–2001, on the eve of the Burj Al Arab and Burj Khalifa era. Cranes fill the skyline, the Palm Jumeirah is being poured into the sea, and the desert is being rewritten in glass and gold at a pace almost nowhere else has matched.',
    bestTimeToVisit: 'October–April (cool season)',
    costTier: 'Luxury',
    tags: ['urban', 'construction', 'uae', 'skyscraper', 'ambition'],
  },
  {
    id: 'millennium-dome',
    name: 'The Millennium Dome',
    location: 'London, UK',
    decade: '2000s',
    category: 'Architectural Marvel',
    description:
      'Richard Rogers\'s giant tensioned fabric dome opened January 1, 2000 as the largest of its kind on Earth — controversial, overcrowded, and unmistakably the future as 1990s Britain imagined it. Visit during its single, much-maligned exhibition year before it was reborn as the O2 Arena.',
    bestTimeToVisit: 'January–December 2000',
    costTier: 'Moderate',
    tags: ['architecture', 'millennium', 'london', 'controversy', 'exhibition'],
  },
  {
    id: 'kyoto-cherry-blossoms',
    name: 'Kyoto Cherry Blossoms',
    location: 'Kyoto, Japan',
    decade: '2000s',
    category: 'Natural Wonder',
    description:
      'Walk the Philosopher\'s Path under the sakura at the turn of the millennium, when the blossoms still reliably peaked in early April and the ancient capital felt caught between centuries. A quiet, perfect, low-stakes destination — the opposite of a time-travel crisis, and all the better for it.',
    bestTimeToVisit: 'Late March – early April',
    costTier: 'Moderate',
    tags: ['nature', 'sakura', 'japan', 'tradition', 'seasonal'],
  },
  {
    id: 'apple-first-store',
    name: 'Apple\'s First Retail Store',
    location: 'Glendale, California, USA',
    decade: '2000s',
    category: 'Cultural Event',
    description:
      'May 19, 2001: Apple opens its first two retail stores (Glendale and McLean), previewing the Genius Bar, the all-white aesthetic, and a fundamentally new theory of tech retail — just months before the iPod would change everything. A small event that quietly redrew how the 21st century shops.',
    bestTimeToVisit: 'May 19, 2001',
    costTier: 'Budget',
    tags: ['technology', 'retail', 'apple', 'design', 'silicon-valley'],
  },

  // ── Additional destinations — Asia ────────────────────────
  {
    id: 'great-wall-badaling-opening',
    name: 'Great Wall at Badaling (Reopening Era)',
    location: 'Near Beijing, China',
    decade: '1980s',
    category: 'Historical Site',
    description:
      'Tour the Great Wall in the years immediately after Deng Xiaoping opened China to foreign tourism, when Badaling had been restored but visitor numbers were still a trickle compared to today. The mountains north of Beijing look much as they have for six centuries, and you can walk the watchtowers in near-solitude — a privilege that would vanish within a generation.',
    bestTimeToVisit: 'April–May, September–October',
    costTier: 'Budget',
    tags: ['china', 'wall', 'history', 'reform-era', 'mountains'],
  },
  {
    id: 'bali-kuta-1970s',
    name: 'Bali — Kuta Beach Discovery Era',
    location: 'Bali, Indonesia',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Visit Bali in the 1970s, when Kuta was still a sleepy fishing village with a few losmen guesthouses and the surf breaks were all but empty. The island\'s Hindu temples, terraced rice paddies, and gamelan ceremonies were accessible to a few hundred travelers a year — the last moment of "undiscovered" Bali before the package resorts arrived.',
    bestTimeToVisit: 'May–September (dry season)',
    costTier: 'Budget',
    tags: ['beach', 'surf', 'indonesia', 'temple', 'pre-tourism'],
  },
  {
    id: 'himalayan-trekking-annapurna',
    name: 'Annapurna Circuit Trek',
    location: 'Nepal',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Trek the Annapurna Circuit in the decade it was "opened" to foreigners, when the trail saw only a handful of westerners each season and the 5,416m Thorong La pass felt like the edge of the known world. Stay in teahouses lit by butter lamps, walk through villages that had never seen a camera, and stand in the shadow of 8,000-meter peaks.',
    bestTimeToVisit: 'October–November (post-monsoon)',
    costTier: 'Budget',
    tags: ['trekking', 'mountains', 'nepal', 'adventure', 'himalaya'],
  },
  {
    id: 'singapore-1970s-transformation',
    name: 'Singapore — Transformation City',
    location: 'Singapore',
    decade: '1970s',
    category: 'Urban Experience',
    description:
      'Walk Lee Kuan Yew\'s Singapore mid-transformation, when the Singapore River still stank of bunkhouses and tongkangs, HDB blocks were rising across the island by the thousands, and the city was being cleaned, greened, and disciplined into the metropolis it would become. A fascinating glimpse of a country building itself in real time.',
    bestTimeToVisit: 'Year-round (avoid monsoon months)',
    costTier: 'Moderate',
    tags: ['urban', 'development', 'asia', 'city-building', 'transformation'],
  },
  {
    id: 'bangkok-klongs-1980s',
    name: 'Bangkok — Canals and Khlongs',
    location: 'Bangkok, Thailand',
    decade: '1980s',
    category: 'Urban Experience',
    description:
      'Experience Bangkok before the Skytrain and the hyper-development, when much of the city still moved by longtail boat along the khlongs, the floating markets started at dawn with real produce (not tourist trinkets), and Sukhumvit was a two-lane road. The "Venice of the East" was still genuinely aquatic.',
    bestTimeToVisit: 'November–February (cool dry season)',
    costTier: 'Budget',
    tags: ['urban', 'canals', 'thailand', 'pre-modernization', 'floating-market'],
  },
  {
    id: 'maldives-2000s-discovery',
    name: 'Maldives — Pre-Mass-Tourism Atolls',
    location: 'Maldives',
    decade: '2000s',
    category: 'Natural Wonder',
    description:
      'Snorkel the Maldivian atolls at the turn of the millennium, when the country had only a handful of resort islands and the coral was still pristine and vividly alive. Stay in a water bungalow in the years before overwater rooms became a global cliché — an untouched Indian Ocean paradise at the moment of its global "discovery".',
    bestTimeToVisit: 'November–April (dry season)',
    costTier: 'Luxury',
    tags: ['beach', 'snorkeling', 'islands', 'indian-ocean', 'pristine'],
  },

  // ── Additional destinations — Europe ──────────────────────
  {
    id: 'amsterdam-canals-1970s',
    name: 'Amsterdam Canals — Hippie Era',
    location: 'Amsterdam, Netherlands',
    decade: '1970s',
    category: 'Urban Experience',
    description:
      'Drift the 17th-century grachten in the era of the squatting movement, when the Jordaan was still working-class and full of "happenings", the Vondelpark hosted free love-ins, and houseboats cost almost nothing to moor. A more bohemian, decaying, and romantic Amsterdam than the polished museum-city of today.',
    bestTimeToVisit: 'April–May (tulip season)',
    costTier: 'Budget',
    tags: ['urban', 'canals', 'netherlands', 'counterculture', 'cycling'],
  },
  {
    id: 'santorini-1980s',
    name: 'Santorini — Whitewashed Discovery',
    location: 'Cyclades, Greece',
    decade: '1980s',
    category: 'Natural Wonder',
    description:
      'Watch the sun set over the caldera from Oia in the decade Santorini first entered the global backpacker circuit, when rooms in cave houses could be had for a few dollars and donkeys still carried luggage up the cliff path. The blue-and-white cycladic dream before the cruise-ship crowds — a quieter, dustier paradise.',
    bestTimeToVisit: 'May–June, September',
    costTier: 'Budget',
    tags: ['islands', 'greece', 'sunset', 'aegean', 'pre-tourism'],
  },
  {
    id: 'norwegian-fjords-1970s',
    name: 'Norwegian Fjords — Coastal Voyage',
    location: 'Bergen to Kirkenes, Norway',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Sail the Hurtigruten coastal steamer along Norway\'s west coast in the era before the route became a marketed cruise, when working cargo ships carried locals between villages and the fjords — Geiranger, Trollfjord, Naerøy — passed in solemn silence. Mountains, waterfalls, and midnight sun, undisturbed.',
    bestTimeToVisit: 'June–August (midnight sun)',
    costTier: 'Moderate',
    tags: ['fjords', 'norway', 'coastal', 'mountains', 'pre-cruise'],
  },
  {
    id: 'barcelona-gaudi-1970s',
    name: 'Barcelona — Gaudí Under Restoration',
    location: 'Barcelona, Spain',
    decade: '1970s',
    category: 'Architectural Marvel',
    description:
      'Wander post-Franco Barcelona while Sagrada Família was still only a fraction of its eventual height and Park Güell had no entrance fee or crowds. The city is gritty, cheap, politically electric in the transition years, and Gaudí\'s wonders feel like secrets shared among the few who came.',
    bestTimeToVisit: 'April–June, September–October',
    costTier: 'Budget',
    tags: ['architecture', 'gaudi', 'spain', 'pre-tourism', 'transition'],
  },
  {
    id: 'edinburgh-festival-1970s',
    name: 'Edinburgh Festival Fringe',
    location: 'Edinburgh, Scotland',
    decade: '1970s',
    category: 'Cultural Event',
    description:
      'August in Edinburgh as the Fringe was still a true counter-cultural free-for-all: performances in church halls and pub back-rooms, unknown comics cutting their teeth, and a military tattoo that ended with a single piper on the castle battlements. Smaller, rawer, and easier to get into than the global mega-festival it would become.',
    bestTimeToVisit: 'August (first three weeks)',
    costTier: 'Moderate',
    tags: ['festival', 'comedy', 'scotland', 'theatre', 'fringe'],
  },
  {
    id: 'french-riviera-1970s',
    name: 'French Riviera — End of the Golden Age',
    location: 'Côte d\'Azur, France',
    decade: '1970s',
    category: 'Urban Experience',
    description:
      'Cruise the Côte d\'Azur in the last years of the truly glamorous Riviera — Nice, Cannes, Antibes, Saint-Tropez — when Brigitte Bardot was still in Saint-Tropez, Picasso was still painting from Mougins, and the Croisette had not yet been widened into a strip of high-rise condos. Old-money glamour at its sun-bleached peak.',
    bestTimeToVisit: 'May–June, September',
    costTier: 'Expensive',
    tags: ['mediterranean', 'france', 'glamour', 'coast', 'old-money'],
  },
  {
    id: 'iceland-1970s-landscapes',
    name: 'Iceland — Pre-Tourism Volcanic Wilderness',
    location: 'Iceland',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Drive Iceland\'s Ring Road when the entire country saw fewer tourists per year than one busload per village, when Gullfoss and Geysir had no entrance buildings, and you could bathe alone in steaming rivers at Hveravellir. Volcanoes, glaciers, and black sand — raw, empty, and almost otherworldly.',
    bestTimeToVisit: 'June–August (long days)',
    costTier: 'Moderate',
    tags: ['volcano', 'glacier', 'iceland', 'wilderness', 'pre-tourism'],
  },

  // ── Additional destinations — Americas ────────────────────
  {
    id: 'machu-picchu-1970s',
    name: 'Machu Picchu — Empty Citadel',
    location: 'Cusco Region, Peru',
    decade: '1970s',
    category: 'Historical Site',
    description:
      'Take the narrow-gauge train up the Urubamba valley in the years before the Inca Trail became a regulated trek, when you could wander Machu Picchu\'s terraces all morning and meet only a handful of other visitors, and the guardhouse above the site was staffed by a single caretaker. The most spectacular ruin in the Americas, almost to yourself.',
    bestTimeToVisit: 'May–September (dry season)',
    costTier: 'Moderate',
    tags: ['ruins', 'inca', 'peru', 'mountains', 'pre-tourism'],
  },
  {
    id: 'galapagos-1970s',
    name: 'Galápagos Islands — Darwin\'s Laboratory',
    location: 'Galápagos, Ecuador',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Cruise the Galápagos in the decade the islands were first opened to organized tourism, when only a few hundred visitors a year walked among fearless boobies, giant tortoises, and marine iguanas. Strict protections were just being written; the wildlife had not yet learned to fear humans. A genuine living laboratory, virtually unchanged since Darwin.',
    bestTimeToVisit: 'December–May (warm season)',
    costTier: 'Expensive',
    tags: ['wildlife', 'evolution', 'ecuador', 'islands', 'darwin'],
  },
  {
    id: 'patagonia-1980s',
    name: 'Patagonia — Torres del Paine Trek',
    location: 'Chile/Argentina, South America',
    decade: '1980s',
    category: 'Natural Wonder',
    description:
      'Trek the Torres del Paine and Fitz Roy ranges when Patagonia was a frontier for serious overlanders rather than a bucket-list brand, when the "W" circuit had no refugios and you carried everything. Wind, ice, and granite spires under a sky so big it bends the horizon — the bottom of the world, gloriously empty.',
    bestTimeToVisit: 'December–February (austral summer)',
    costTier: 'Moderate',
    tags: ['trekking', 'mountains', 'chile', 'argentina', 'wilderness'],
  },
  {
    id: 'niagara-falls-1970s',
    name: 'Niagara Falls — Honeymoon Capital',
    location: 'Ontario / New York, Canada/USA',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Ride the Maid of the Mist in the era when Niagara\'s trade-marked kitsch — neon motels, wax museums, the Skylon Tower — was at full mid-century throttle, and the Horseshoe Falls churned out 168,000 cubic meters of water a minute in a roar that drowned every conversation. A grand, slightly tacky, pure-Americana spectacle.',
    bestTimeToVisit: 'June–September',
    costTier: 'Moderate',
    tags: ['waterfall', 'canada', 'usa', 'kitsch', 'honeymoon'],
  },
  {
    id: 'grand-canyon-1970s',
    name: 'Grand Canyon — Pre-Crowd South Rim',
    location: 'Arizona, USA',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Stand at Mather Point on the South Rim before shuttle buses and selfie sticks, when the Canyon felt like a private revelation and you could hike Bright Angel to Indian Garden sharing the trail with a handful of mules and almost no other people. A mile deep and ten miles across, and almost silent.',
    bestTimeToVisit: 'April–May, September–October',
    costTier: 'Budget',
    tags: ['canyon', 'arizona', 'usa', 'national-park', 'geology'],
  },
  {
    id: 'yellowstone-1970s',
    name: 'Yellowstone — Old Faithful Era',
    location: 'Wyoming/Montana/Idaho, USA',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Tour America\'s first national park in the era of the great bear-feeding bleachers (just being phased out), when the Firehole River swimming hole was still allowed, and wolves had not yet been reintroduced. Geothermal spectacle — geysers, paint pots, the Grand Canyon of the Yellowstone — at a slower, gentler pace.',
    bestTimeToVisit: 'June–September',
    costTier: 'Budget',
    tags: ['geyser', 'wildlife', 'wyoming', 'national-park', 'usa'],
  },
  {
    id: 'new-orleans-french-quarter-1970s',
    name: 'New Orleans French Quarter — Jazz and Funk Era',
    location: 'New Orleans, Louisiana, USA',
    decade: '1970s',
    category: 'Music/Arts Scene',
    description:
      'Hear Preservation Hall, Allen Toussaint\'s studio sessions, and the Meters at Tipitina\'s in the decade New Orleans funk and brass-band tradition peaked. Steamy, decrepit, musical, and gloriously tolerant of any hour — the French Quarter before the cruise-ship era, still very much a working neighborhood.',
    bestTimeToVisit: 'February–April (before humidity)',
    costTier: 'Moderate',
    tags: ['jazz', 'funk', 'louisiana', 'usa', 'music'],
  },
  {
    id: 'rio-carnival-1980s',
    name: 'Rio Carnival — Sambadrome Era',
    location: 'Rio de Janeiro, Brazil',
    decade: '1980s',
    category: 'Cultural Event',
    description:
      'Be in the Sambadrome for Carnival in the decade after Niemeyer\'s purpose-built parade ground opened, when the great escolas de samba — Mangueira, Salgueiro, Portela — were in their golden age and the blocos still spilled through Lapa and Ipanema for free. The greatest party on Earth, at full thunder.',
    bestTimeToVisit: 'February or March (the four days before Lent)',
    costTier: 'Expensive',
    tags: ['carnival', 'samba', 'brazil', 'party', 'dance'],
  },
  {
    id: 'havana-1980s',
    name: 'Havana — Soviet-Subsidized Cuba',
    location: 'Havana, Cuba',
    decade: '1980s',
    category: 'Urban Experience',
    description:
      'Walk Havana in the last years of Soviet support, when the Malecón was lit but quiet, classic American cars were everyday transport (not nostalgia), and the country was cautiously opening to tourism via the Habana Libre hotels. Crumbling, romantic, ideologically frozen mid-revolution — a city preserved in amber.',
    bestTimeToVisit: 'November–April (dry season)',
    costTier: 'Budget',
    tags: ['cuba', 'cars', 'revolution', 'caribbean', 'socialism'],
  },

  // ── Additional destinations — Africa ──────────────────────
  {
    id: 'serengeti-migration-1970s',
    name: 'Serengeti Great Migration',
    location: 'Tanzania / Kenya, East Africa',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Camp in the Serengeti in the era before lodge networks and mini-bus caravans, when you pitched a tent on the open plain and watched two million wildebeest and zebra cross the Mara River in columns a mile wide. The largest land migration on Earth, witnessed in something close to the way the first explorers did.',
    bestTimeToVisit: 'January–March (calving), July–October (river crossings)',
    costTier: 'Expensive',
    tags: ['safari', 'wildlife', 'tanzania', 'migration', 'africa'],
  },
  {
    id: 'victoria-falls-1970s',
    name: 'Victoria Falls — "Mosi-oa-Tunya"',
    location: 'Zambia / Zimbabwe',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Stand at the edge of the Smoke That Thunders in the late colonial / early independence era, when the spray rose 400 meters and the footpaths along the gorge had no guardrails and almost no other visitors. A curtain of water a mile wide and a hundred meters tall — and you could walk right up to it.',
    bestTimeToVisit: 'February–May (peak flow)',
    costTier: 'Moderate',
    tags: ['waterfall', 'zambia', 'zimbabwe', 'africa', 'adventure'],
  },
  {
    id: 'pyramids-giza-1970s',
    name: 'Pyramids of Giza — Climbable Era',
    location: 'Giza, Egypt',
    decade: '1970s',
    category: 'Historical Site',
    description:
      'Visit the last surviving Wonder of the Ancient World in the era when tourists could still climb Khufu\'s pyramid at dawn for the view (formally banned only in the 1980s), the Sphinx had sand up to its shoulders in places, and Cairo\'s edge was a half-mile from the base. Four and a half thousand years of history, more accessible than it has ever been since.',
    bestTimeToVisit: 'October–April',
    costTier: 'Budget',
    tags: ['egypt', 'pyramid', 'antiquity', 'archaeology', 'history'],
  },
  {
    id: 'marrakech-medina-1970s',
    name: 'Marrakech — Jemaa el-Fnaa',
    location: 'Marrakech, Morocco',
    decade: '1970s',
    category: 'Urban Experience',
    description:
      'Sit on a rooftop above Jemaa el-Fnaa at dusk in the decade the hippie trail still swung through Morocco, when snake charmers, storytellers, and Gnawa drummers held court to mostly-local crowds and a glass of mint tea cost pennies. The "Red City" before the riad renaissance — denser, poorer, and far more atmospheric.',
    bestTimeToVisit: 'March–May, September–November',
    costTier: 'Budget',
    tags: ['morocco', 'medina', 'souk', 'africa', 'counterculture'],
  },
  {
    id: 'cape-town-1990s',
    name: 'Cape Town — Post-Apartheid Dawn',
    location: 'Cape Town, South Africa',
    decade: '1990s',
    category: 'Urban Experience',
    description:
      'Be in Cape Town through the Mandela years, when District Six was being reclaimed, Robben Island opened as a museum with former political prisoners as guides, and the city\'s beaches, suburbs, and schools integrated for the first time. Table Mountain, two oceans, and a country rewriting itself in real time — a city surging with hope.',
    bestTimeToVisit: 'November–March (austral summer)',
    costTier: 'Moderate',
    tags: ['south-africa', 'apartheid', 'table-mountain', 'history', 'transformation'],
  },
  {
    id: 'madagascar-1980s',
    name: 'Madagascar — Lemurs and Baobabs',
    location: 'Madagascar',
    decade: '1980s',
    category: 'Natural Wonder',
    description:
      'Trek the rainforests of Andasibe and the avenue of baobabs near Morondava when Madagascar was a frontier for biologists and almost no tourists, when indri lemurs called across the canopy at dawn and 80% of the wildlife existed nowhere else on Earth. The world\'s most biodiverse island, nearly empty of visitors.',
    bestTimeToVisit: 'April–November (dry)',
    costTier: 'Moderate',
    tags: ['wildlife', 'lemur', 'baobab', 'biodiversity', 'island'],
  },

  // ── Additional destinations — Oceania ─────────────────────
  {
    id: 'great-barrier-reef-1970s',
    name: 'Great Barrier Reef — Pre-Bleaching',
    location: 'Queensland, Australia',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Dive the Reef in the decade before mass coral bleaching, when every current-swept wall was a saturated wall of color and the crown-of-thorns outbreak was the only worry. The largest living structure on Earth, at its absolute biological peak — a 2,300-kilometer underwater wilderness that will not look this way again.',
    bestTimeToVisit: 'June–October (dry, clear water)',
    costTier: 'Expensive',
    tags: ['reef', 'diving', 'australia', 'coral', 'marine'],
  },
  {
    id: 'uluru-1970s',
    name: 'Uluru — Ayers Rock (Pre-Climb-Ban)',
    location: 'Northern Territory, Australia',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Stand at the base of Uluru in the era when the climb chain was still bolted to the rock and 4x4 convoys arrived for sunset drinks with no interpretive center in sight. The cultural meaning of the Anangu people was being heard for the first time — a moment of awkward transition at one of Earth\'s most sacred monoliths.',
    bestTimeToVisit: 'May–September (cool dry)',
    costTier: 'Moderate',
    tags: ['australia', 'outback', 'sacred-site', 'monolith', 'desert'],
  },
  {
    id: 'new-zealand-fjords-1980s',
    name: 'Fiordland — Milford and Doubtful Sound',
    location: 'South Island, New Zealand',
    decade: '1980s',
    category: 'Natural Wonder',
    description:
      'Cruise Milford and Doubtful Sounds in the era before daily boatloads of coach-tourists, when the Homer Tunnel still felt like a secret passage and dolphins rode the bow wave in waterfalls cascading straight off sheer cliffs. The "Eighth Wonder of the World", so empty your echo comes back unanswered.',
    bestTimeToVisit: 'October–April (austral summer)',
    costTier: 'Moderate',
    tags: ['fjord', 'new-zealand', 'wilderness', 'mountains', 'cruise'],
  },
  {
    id: 'bora-bora-1970s',
    name: 'Bora Bora — Overwater Beginnings',
    location: 'Society Islands, French Polynesia',
    decade: '1970s',
    category: 'Natural Wonder',
    description:
      'Snorkel the lagoon of Bora Bora just as the first overwater bungalows were being built on the barrier reef — there were only a few dozen rooms on the entire island. Turquoise water, volcanic spires, and a way of life that would, within a generation, define tropical luxury worldwide. The blueprint at the moment of its invention.',
    bestTimeToVisit: 'May–October (dry season)',
    costTier: 'Luxury',
    tags: ['polynesia', 'lagoon', 'bungalow', 'tropical', 'island'],
  },
];
