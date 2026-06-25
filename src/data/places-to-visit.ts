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
];
